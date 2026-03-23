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

// ─── Fiber: Find people at a company ───

async function fiberFindPeople(domain: string): Promise<{
  name: string | null;
  title: string | null;
  linkedinUrl: string | null;
} | null> {
  const apiKey = FIBER_KEY();
  if (!apiKey) return null;

  try {
    // Start combined search
    const startRes = await fetch(`${FIBER_BASE}/combined-search/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey,
        companyParams: {
          exactCompanyV2: {
            anyOf: [{ identifier: "domain", domain }],
          },
        },
        profileParams: {
          jobTitleV2: {
            anyOf: [
              { type: "static-groups", groups: ["founder", "c-suite"] },
              { type: "term", term: "owner" },
              { type: "term", term: "medical director" },
            ],
          },
        },
        maxProfiles: 5,
        maxCompanies: 1,
      }),
    });

    const startData = await startRes.json();
    const searchId = startData?.output?.searchID;
    if (!searchId) return null;

    // Poll for results (max 20 seconds)
    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 2000));

      const pollRes = await fetch(`${FIBER_BASE}/combined-search/poll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, searchId, entityType: "profile" }),
      });

      const pollData = await pollRes.json();
      const items = pollData?.output?.data?.items || [];

      if (items.length > 0) {
        // Rank by job title relevance
        const ranked = items.sort((a: any, b: any) => {
          const tA = (a.headline || "").toLowerCase();
          const tB = (b.headline || "").toLowerCase();
          const score = (t: string) =>
            t.includes("owner") ? 5 : t.includes("founder") ? 4 : t.includes("ceo") ? 3 :
            t.includes("director") ? 2 : t.includes("doctor") || t.includes("md") || t.includes("dr.") ? 1 : 0;
          return score(tB) - score(tA);
        });

        const best = ranked[0];
        return {
          name: best.name || `${best.first_name || ""} ${best.last_name || ""}`.trim() || null,
          title: best.headline || null,
          linkedinUrl: best.url || (best.primary_slug ? `https://www.linkedin.com/in/${best.primary_slug}` : null),
        };
      }

      // If done with no results, break
      if (pollData?.output?.data?.nextCursor === null && items.length === 0) break;
    }
  } catch (err) {
    console.error("Fiber search error:", err);
  }

  // Retry without job title filter
  try {
    const startRes = await fetch(`${FIBER_BASE}/combined-search/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: FIBER_KEY(),
        companyParams: {
          exactCompanyV2: {
            anyOf: [{ identifier: "domain", domain }],
          },
        },
        maxProfiles: 5,
        maxCompanies: 1,
      }),
    });

    const startData = await startRes.json();
    const searchId = startData?.output?.searchID;
    if (!searchId) return null;

    await new Promise(r => setTimeout(r, 8000));

    const pollRes = await fetch(`${FIBER_BASE}/combined-search/poll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey: FIBER_KEY(), searchId, entityType: "profile" }),
    });

    const pollData = await pollRes.json();
    const items = pollData?.output?.data?.items || [];
    if (items.length > 0) {
      const best = items[0];
      return {
        name: best.name || `${best.first_name || ""} ${best.last_name || ""}`.trim() || null,
        title: best.headline || null,
        linkedinUrl: best.url || (best.primary_slug ? `https://www.linkedin.com/in/${best.primary_slug}` : null),
      };
    }
  } catch { /* ignore */ }

  return null;
}

// ─── Fiber: Get contact details from LinkedIn URL ───

async function getContactDetails(linkedinUrl: string): Promise<{
  personalEmail: string | null;
  workEmail: string | null;
  phone: string | null;
}> {
  try {
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
    const profile = data?.output?.profile || {};
    const emails = profile.emails || [];
    const phones = profile.phoneNumbers || [];

    return {
      personalEmail: emails.find((e: any) => e.type === "personal" && e.status !== "invalid")?.email || null,
      workEmail: emails.find((e: any) => e.type === "work" && e.status !== "invalid")?.email || null,
      phone: phones.find((p: any) => p.type === "mobile")?.number || phones[0]?.number || null,
    };
  } catch {
    return { personalEmail: null, workEmail: null, phone: null };
  }
}

// ─── Fallback: Scrape website for doctor/owner name ───

async function scrapeForOwner(website: string): Promise<{ name: string | null; title: string | null }> {
  try {
    const url = website.startsWith("http") ? website : `https://${website}`;

    // Try /about, /team, /our-team pages
    const pages = [url, `${url}/about`, `${url}/about-us`, `${url}/team`, `${url}/our-team`];

    for (const pageUrl of pages) {
      try {
        const res = await fetch(pageUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; ClinicTech/1.0)" },
          signal: AbortSignal.timeout(5000),
          redirect: "follow",
        });
        if (!res.ok) continue;
        const html = await res.text();

        // Look for doctor names: "Dr. First Last" or "First Last, MD"
        const drPattern = /(?:Dr\.?\s+)([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/g;
        const mdPattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\s*,?\s*(?:MD|M\.D\.|DO|D\.O\.|NMD|ND|DC)/g;

        let match;
        if ((match = drPattern.exec(html))) {
          return { name: `Dr. ${match[1]}`, title: "Physician" };
        }
        if ((match = mdPattern.exec(html))) {
          return { name: `Dr. ${match[1]}`, title: "Physician" };
        }
      } catch { continue; }
    }
  } catch { /* ignore */ }

  return { name: null, title: null };
}

// ─── Main API Route ───

export async function POST(req: NextRequest) {
  try {
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
        .select("id, name, website, scraped_data")
        .eq("id", id)
        .single();

      if (!clinic) {
        results.push({ id, name: "Unknown", status: "not_found" });
        continue;
      }

      try {
        // Try Fiber first
        let owner = await fiberFindPeople(clinic.website);

        // Fallback: scrape website for doctor name
        if (!owner?.name) {
          const scraped = await scrapeForOwner(clinic.website);
          if (scraped.name) {
            owner = { name: scraped.name, title: scraped.title, linkedinUrl: null };
          }
        }

        if (!owner?.name) {
          results.push({ id, name: clinic.name, status: "no_owner_found" });
          continue;
        }

        const update: Record<string, unknown> = {
          contact_name: owner.name,
          contact_title: owner.title,
          updated_at: new Date().toISOString(),
        };

        // Get contact details if we have LinkedIn
        let contact = { personalEmail: null as string | null, workEmail: null as string | null, phone: null as string | null };
        if (owner.linkedinUrl) {
          contact = await getContactDetails(owner.linkedinUrl);
        }

        // Merge with existing scraped_data
        const existing = typeof clinic.scraped_data === "object" && clinic.scraped_data ? clinic.scraped_data : {};
        update.scraped_data = {
          ...existing,
          linkedin_url: owner.linkedinUrl,
          personal_email: contact.personalEmail,
          work_email: contact.workEmail,
          owner_phone: contact.phone,
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
