import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const FIBER_KEY = () => process.env.FIBER_API_KEY;
const FIBER_BASE = "https://api.fiber.ai/v1";

// ─── Step 1: Find owner via Kitchen Sink Person ───

function isPersonAtClinic(person: any, domain: string, clinicName?: string): boolean {
  const headline = (person.headline || "").toLowerCase();
  const domainBase = domain.toLowerCase().replace(/\.(com|net|org|ca|co|io)$/, "").replace(/^www\./, "");

  // Check headline mentions the clinic
  if (headline.includes(domainBase.split(".")[0])) return true;

  // Check if clinic name appears in headline
  if (clinicName) {
    const nameLower = clinicName.toLowerCase();
    if (headline.includes(nameLower)) return true;
    // Check first significant word of clinic name
    const firstWord = nameLower.split(/\s+/).find(w => w.length > 3);
    if (firstWord && headline.includes(firstWord)) return true;
  }

  // Check work experiences for the domain
  const experiences = person.experiences || [];
  for (const exp of experiences) {
    if (exp.is_current) {
      const compName = (exp.company_name || "").toLowerCase();
      if (compName.includes(domainBase.split(".")[0])) return true;
      if (clinicName) {
        const nameLower = clinicName.toLowerCase();
        if (compName.includes(nameLower) || nameLower.includes(compName)) return true;
      }
    }
  }

  // Known false positives
  const name = (person.name || "").toLowerCase();
  if (name.includes("sahil bloom") || name.includes("gary neville")) return false;

  return false;
}

async function findOwner(domain: string, clinicName?: string): Promise<{
  name: string;
  title: string;
  linkedinSlug: string;
} | null> {
  const apiKey = FIBER_KEY();
  if (!apiKey) return null;

  // Try different job titles in priority order
  const jobTitles = ["owner", "founder", "ceo", "medical director"];

  for (const title of jobTitles) {
    try {
      const res = await fetch(`${FIBER_BASE}/kitchen-sink/person`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          companyDomain: { value: domain },
          jobTitle: { value: title },
          numProfiles: 5,
        }),
      });

      const data = await res.json();
      const profiles = data?.output?.data || [];

      // Find the first person who is ACTUALLY at this clinic
      for (const p of profiles) {
        if (isPersonAtClinic(p, domain, clinicName)) {
          return {
            name: p.name || `${p.first_name || ""} ${p.last_name || ""}`.trim(),
            title: p.headline || title,
            linkedinSlug: p.primary_slug || "",
          };
        }
      }
    } catch {
      continue;
    }
  }

  return null;
}

// ─── Step 2: Get contact details ───

async function getContactDetails(linkedinSlug: string): Promise<{
  personalEmail: string | null;
  workEmail: string | null;
  mobilePhone: string | null;
}> {
  try {
    const res = await fetch(`${FIBER_BASE}/contact-details/single`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: FIBER_KEY(),
        linkedinUrl: linkedinSlug,
      }),
    });

    const data = await res.json();
    const profile = data?.output?.profile || {};
    const emails = profile.emails || [];
    const phones = profile.phoneNumbers || [];

    return {
      personalEmail: emails.find((e: any) => e.type === "personal")?.email || null,
      workEmail: emails.find((e: any) => e.type === "work")?.email || null,
      mobilePhone: phones.find((p: any) => p.type === "mobile")?.number || null,
    };
  } catch {
    return { personalEmail: null, workEmail: null, mobilePhone: null };
  }
}

// ─── Main API Route ───

export async function POST(req: NextRequest) {
  try {
    const apiKey = FIBER_KEY();
    if (!apiKey) {
      return NextResponse.json({ error: "FIBER_API_KEY not configured" }, { status: 500 });
    }

    const body = await req.json();
    const clinicIds: string[] = body.clinicIds || (body.clinicId ? [body.clinicId] : []);

    if (clinicIds.length === 0) {
      return NextResponse.json({ error: "clinicId or clinicIds required" }, { status: 400 });
    }

    const supabase = getSupabase();
    const results: {
      id: string; name: string; status: string;
      owner?: string; personalEmail?: string; workEmail?: string; phone?: string;
    }[] = [];

    for (const id of clinicIds) {
      const { data: clinic } = await supabase
        .from("clinics")
        .select("id, name, website, scraped_data")
        .eq("id", id)
        .single();

      if (!clinic) {
        results.push({ id, name: "Unknown", status: "not_found" });
        continue;
      }

      try {
        // Step 1: Find the owner
        const owner = await findOwner(clinic.website, clinic.name);

        if (!owner) {
          results.push({ id, name: clinic.name, status: "no_owner_found" });
          continue;
        }

        // Step 2: Get their contact details
        const contact = owner.linkedinSlug
          ? await getContactDetails(owner.linkedinSlug)
          : { personalEmail: null, workEmail: null, mobilePhone: null };

        // Save to Supabase
        const update: Record<string, unknown> = {
          contact_name: owner.name,
          contact_title: owner.title,
          updated_at: new Date().toISOString(),
        };

        // Prefer personal email, then work email
        if (contact.personalEmail) update.contact_email = contact.personalEmail;
        else if (contact.workEmail) update.contact_email = contact.workEmail;

        // Save mobile phone (personal direct dial)
        if (contact.mobilePhone) update.contact_phone = contact.mobilePhone;

        // Merge enrichment data into scraped_data
        const existing = typeof clinic.scraped_data === "object" && clinic.scraped_data ? clinic.scraped_data : {};
        update.scraped_data = {
          ...existing,
          enriched_at: new Date().toISOString(),
          owner_name: owner.name,
          owner_title: owner.title,
          linkedin_slug: owner.linkedinSlug,
          personal_email: contact.personalEmail,
          work_email: contact.workEmail,
          mobile_phone: contact.mobilePhone,
        };

        await supabase.from("clinics").update(update).eq("id", id);

        results.push({
          id, name: clinic.name, status: "enriched",
          owner: owner.name,
          personalEmail: contact.personalEmail || undefined,
          workEmail: contact.workEmail || undefined,
          phone: contact.mobilePhone || undefined,
        });
      } catch (err: any) {
        results.push({ id, name: clinic.name, status: `error: ${err.message?.slice(0, 100)}` });
      }
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error("POST /api/admin/enrich error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
