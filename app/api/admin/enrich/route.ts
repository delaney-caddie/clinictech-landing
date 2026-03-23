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

// ─── Step 1: Find owner via combined-search (async start + poll) ───

async function findOwner(domain: string): Promise<{
  name: string | null;
  title: string | null;
  linkedinUrl: string | null;
} | null> {
  // Start the search
  const startRes = await fetch(`${FIBER_BASE}/combined-search/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey: FIBER_KEY(),
      companyParams: {
        domains: [domain],
      },
      personParams: {
        jobTitleV2: {
          anyOf: [
            { type: "static-groups", groups: ["founder", "c-suite"] },
            { type: "term", term: "owner" },
            { type: "term", term: "medical director" },
          ],
        },
      },
      personLimit: 3,
    }),
  });

  const startData = await startRes.json();
  const searchId = startData?.output?.searchID;
  if (!searchId) return null;

  // Poll for results (max 30 seconds)
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 2000));

    const pollRes = await fetch(`${FIBER_BASE}/combined-search/poll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: FIBER_KEY(),
        searchID: searchId,
      }),
    });

    const pollData = await pollRes.json();
    const output = pollData?.output;

    if (output?.done) {
      const companies = output?.companies || [];
      // Look through companies for people
      for (const company of companies) {
        const people = company?.people || [];
        if (people.length > 0) {
          // Rank: owner > founder > CEO > director
          const ranked = people.sort((a: any, b: any) => {
            const tA = (a.headline || a.current_job?.title || "").toLowerCase();
            const tB = (b.headline || b.current_job?.title || "").toLowerCase();
            const sA = tA.includes("owner") ? 4 : tA.includes("founder") ? 3 : tA.includes("ceo") ? 2 : tA.includes("director") ? 1 : 0;
            const sB = tB.includes("owner") ? 4 : tB.includes("founder") ? 3 : tB.includes("ceo") ? 2 : tB.includes("director") ? 1 : 0;
            return sB - sA;
          });

          const best = ranked[0];
          return {
            name: best.name || `${best.first_name || ""} ${best.last_name || ""}`.trim() || null,
            title: best.headline || best.current_job?.title || null,
            linkedinUrl: best.url || best.linkedin_url ||
              (best.primary_slug ? `https://www.linkedin.com/in/${best.primary_slug}` : null),
          };
        }
      }

      // No people found in companies — try the people array directly
      const people = output?.people || [];
      if (people.length > 0) {
        const best = people[0];
        return {
          name: best.name || `${best.first_name || ""} ${best.last_name || ""}`.trim() || null,
          title: best.headline || best.current_job?.title || null,
          linkedinUrl: best.url || best.linkedin_url ||
            (best.primary_slug ? `https://www.linkedin.com/in/${best.primary_slug}` : null),
        };
      }

      return null;
    }
  }

  return null; // Timed out
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

  return {
    personalEmail: emails.find((e: any) => e.type === "personal" && e.status !== "invalid")?.email || null,
    workEmail: emails.find((e: any) => e.type === "work" && e.status !== "invalid")?.email || null,
    phone: phones.find((p: any) => p.type === "mobile")?.number || phones[0]?.number || null,
  };
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

        if (!owner) {
          results.push({ id, name: clinic.name, status: "no_owner_found" });
          continue;
        }

        // Save name/title even if no LinkedIn
        const update: Record<string, unknown> = {
          contact_name: owner.name,
          contact_title: owner.title,
          updated_at: new Date().toISOString(),
        };

        if (!owner.linkedinUrl) {
          await supabase.from("clinics").update(update).eq("id", id);
          results.push({ id, name: clinic.name, status: "name_only", owner: owner.name || undefined });
          continue;
        }

        // Step 2: Get contact details
        const contact = await getContactDetails(owner.linkedinUrl);

        // Build scraped_data with enrichment info
        const existingData = (await supabase.from("clinics").select("scraped_data").eq("id", id).single())?.data?.scraped_data || {};
        update.scraped_data = {
          ...(typeof existingData === "object" ? existingData : {}),
          linkedin_url: owner.linkedinUrl,
          personal_email: contact.personalEmail,
          work_email: contact.workEmail,
          phone: contact.phone,
          owner_title: owner.title,
          enriched_at: new Date().toISOString(),
        };

        if (contact.personalEmail) update.contact_email = contact.personalEmail;
        else if (contact.workEmail) update.contact_email = contact.workEmail;
        if (contact.phone) update.contact_phone = contact.phone;

        await supabase.from("clinics").update(update).eq("id", id);

        results.push({
          id, name: clinic.name, status: "enriched",
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
