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

// ─── Step 1: Find the owner/decision-maker via People Search ───

async function findOwner(domain: string): Promise<{
  name: string | null;
  title: string | null;
  linkedinUrl: string | null;
} | null> {
  const res = await fetch(`${FIBER_BASE}/people-search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey: FIBER_KEY(),
      searchParams: {
        currentCompanies: [{ domain }],
        jobTitleV2: {
          anyOf: [
            { type: "static-groups", groups: ["founder", "c-suite"] },
            { type: "term", term: "owner" },
            { type: "term", term: "medical director" },
            { type: "term", term: "practice manager" },
            { type: "term", term: "doctor" },
          ],
        },
      },
      limit: 3,
    }),
  });

  const data = await res.json();
  const profiles = data?.profiles || data?.results || [];

  if (!profiles.length) return null;

  // Pick the best match — prefer founder/owner/CEO over others
  const ranked = profiles.sort((a: any, b: any) => {
    const titleA = (a.headline || a.current_job?.title || "").toLowerCase();
    const titleB = (b.headline || b.current_job?.title || "").toLowerCase();
    const scoreA = titleA.includes("owner") ? 3 : titleA.includes("founder") ? 3 : titleA.includes("ceo") ? 2 : titleA.includes("director") ? 1 : 0;
    const scoreB = titleB.includes("owner") ? 3 : titleB.includes("founder") ? 3 : titleB.includes("ceo") ? 2 : titleB.includes("director") ? 1 : 0;
    return scoreB - scoreA;
  });

  const best = ranked[0];
  return {
    name: best.name || `${best.first_name || ""} ${best.last_name || ""}`.trim() || null,
    title: best.headline || best.current_job?.title || null,
    linkedinUrl: best.url || best.linkedin_url || (best.primary_slug ? `https://www.linkedin.com/in/${best.primary_slug}` : null),
  };
}

// ─── Step 2: Get contact details from LinkedIn URL ───

async function getContactDetails(linkedinUrl: string): Promise<{
  personalEmail: string | null;
  workEmail: string | null;
  phone: string | null;
}> {
  const res = await fetch(`${FIBER_BASE}/contact-details/single`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey: FIBER_KEY(),
      linkedinUrl,
      enrichmentType: {
        getWorkEmails: true,
        getPersonalEmails: true,
        getPhoneNumbers: true,
      },
    }),
  });

  const data = await res.json();
  const profile = data?.output?.profile || data?.profile || {};

  const emails = profile.emails || [];
  const phones = profile.phoneNumbers || [];

  const personalEmail = emails.find((e: any) => e.type === "personal" && e.status !== "invalid")?.email || null;
  const workEmail = emails.find((e: any) => e.type === "work" && e.status !== "invalid")?.email || null;
  const phone = phones.find((p: any) => p.type === "mobile")?.number || phones[0]?.number || null;

  return { personalEmail, workEmail, phone };
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
    const results: { id: string; name: string; status: string; owner?: string; email?: string; phone?: string }[] = [];

    for (const id of clinicIds) {
      const { data: clinic } = await supabase
        .from("clinics")
        .select("id, name, website")
        .eq("id", id)
        .single();

      if (!clinic) {
        results.push({ id, name: "Unknown", status: "not_found" });
        continue;
      }

      try {
        // Step 1: Find the owner
        const owner = await findOwner(clinic.website);

        if (!owner?.linkedinUrl) {
          // Save whatever name we found even without LinkedIn
          if (owner?.name) {
            await supabase.from("clinics").update({
              contact_name: owner.name,
              contact_title: owner.title,
              updated_at: new Date().toISOString(),
            }).eq("id", id);
          }
          results.push({
            id, name: clinic.name, status: "no_linkedin",
            owner: owner?.name || undefined,
          });
          continue;
        }

        // Step 2: Get contact details
        const contact = await getContactDetails(owner.linkedinUrl);

        // Save to Supabase
        const update: Record<string, unknown> = {
          contact_name: owner.name,
          contact_title: owner.title,
          updated_at: new Date().toISOString(),
          scraped_data: {
            linkedin_url: owner.linkedinUrl,
            personal_email: contact.personalEmail,
            work_email: contact.workEmail,
            phone: contact.phone,
            enriched_at: new Date().toISOString(),
          },
        };

        // Use personal email first, then work email
        if (contact.personalEmail) update.contact_email = contact.personalEmail;
        else if (contact.workEmail) update.contact_email = contact.workEmail;

        if (contact.phone) update.contact_phone = contact.phone;

        await supabase.from("clinics").update(update).eq("id", id);

        results.push({
          id,
          name: clinic.name,
          status: "enriched",
          owner: owner.name || undefined,
          email: contact.personalEmail || contact.workEmail || undefined,
          phone: contact.phone || undefined,
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
