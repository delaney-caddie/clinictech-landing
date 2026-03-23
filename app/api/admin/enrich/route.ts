import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── Scrape website for owner/doctor name and email ───

async function fetchPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ClinicTech/1.0)" },
      signal: AbortSignal.timeout(8000),
      redirect: "follow",
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function fetchWithFirecrawl(url: string): Promise<string | null> {
  const key = process.env.FIRECRAWL_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
      body: JSON.stringify({ url, formats: ["html"], waitFor: 3000 }),
      signal: AbortSignal.timeout(30000),
    });
    const data = await res.json();
    return data.success ? data.data?.html || null : null;
  } catch {
    return null;
  }
}

function extractDoctorNames(html: string): { name: string; title: string }[] {
  const results: { name: string; title: string }[] = [];
  const seen = new Set<string>();

  // "Dr. First Last" pattern
  const drPattern = /Dr\.?\s+([A-Z][a-z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-z]+)/g;
  let m;
  while ((m = drPattern.exec(html))) {
    const name = `Dr. ${m[1].trim()}`;
    if (!seen.has(name.toLowerCase())) {
      seen.add(name.toLowerCase());
      results.push({ name, title: "Physician" });
    }
  }

  // "First Last, MD" or "First Last, DO" etc.
  const mdPattern = /([A-Z][a-z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-z]+)\s*,?\s*(?:MD|M\.D\.|DO|D\.O\.|NMD|N\.D\.|DC|D\.C\.|PhD|DAOM)/g;
  while ((m = mdPattern.exec(html))) {
    const name = `Dr. ${m[1].trim()}`;
    if (!seen.has(name.toLowerCase())) {
      seen.add(name.toLowerCase());
      results.push({ name, title: "Physician" });
    }
  }

  // "Owner" or "Founder" near a name — strict: name must be capitalized properly
  const ownerPattern = /(?:owner|founder|ceo|medical director|clinic director)[^<]{0,50}?([A-Z][a-z]{2,15}\s+[A-Z][a-z]{2,15})/gi;
  while ((m = ownerPattern.exec(html))) {
    const name = m[1].trim();
    // Filter out common false positives
    const lower = name.toLowerCase();
    if (lower.includes("have") || lower.includes("that") || lower.includes("this") ||
        lower.includes("with") || lower.includes("from") || lower.includes("your") ||
        lower.includes("will") || lower.includes("also") || lower.includes("more") ||
        lower.includes("our") || lower.includes("the") || lower.includes("and")) continue;
    if (!seen.has(lower) && name.length > 5) {
      seen.add(lower);
      results.push({ name, title: "Owner" });
    }
  }

  return results;
}

function extractEmails(html: string): string[] {
  const pattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = html.match(pattern) || [];
  return [...new Set(matches)].filter(e =>
    !e.includes("example.com") &&
    !e.includes("wixpress") &&
    !e.includes("sentry") &&
    !e.includes("wordpress") &&
    !e.includes("gravatar") &&
    !e.includes("schema.org") &&
    !e.includes("googleapis") &&
    !e.endsWith(".svg") &&
    !e.endsWith(".png") &&
    !e.endsWith(".jpg")
  );
}

async function enrichFromWebsite(website: string): Promise<{
  ownerName: string | null;
  ownerTitle: string | null;
  email: string | null;
}> {
  const baseUrl = website.startsWith("http") ? website : `https://${website}`;

  // Pages to scrape for owner/doctor info
  const pagePaths = ["", "/about", "/about-us", "/team", "/our-team", "/doctors", "/providers", "/staff"];
  const allDoctors: { name: string; title: string }[] = [];
  const allEmails: string[] = [];

  for (const path of pagePaths) {
    const pageUrl = `${baseUrl}${path}`;

    // Try Firecrawl first (renders JS), fall back to basic fetch
    let html = await fetchWithFirecrawl(pageUrl);
    if (!html) html = await fetchPage(pageUrl);
    if (!html) continue;

    const doctors = extractDoctorNames(html);
    allDoctors.push(...doctors);

    const emails = extractEmails(html);
    allEmails.push(...emails);

    // Stop after finding a doctor name (don't scrape all pages unnecessarily)
    if (doctors.length > 0) break;
  }

  // Dedupe emails
  const uniqueEmails = [...new Set(allEmails)];

  // Prefer owner/founder over generic doctor
  const ranked = allDoctors.sort((a, b) => {
    const score = (t: string) =>
      t.toLowerCase().includes("owner") ? 3 :
      t.toLowerCase().includes("founder") ? 3 :
      t.toLowerCase().includes("director") ? 2 : 1;
    return score(b.title) - score(a.title);
  });

  // Find an email that looks personal (has a name in it) vs generic (info@, contact@)
  const personalEmail = uniqueEmails.find(e => {
    const local = e.split("@")[0].toLowerCase();
    return !["info", "contact", "hello", "admin", "support", "office", "reception", "team", "careers", "hr", "billing", "appointments"].includes(local);
  });

  return {
    ownerName: ranked[0]?.name || null,
    ownerTitle: ranked[0]?.title || null,
    email: personalEmail || uniqueEmails[0] || null,
  };
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
    const results: { id: string; name: string; status: string; owner?: string; email?: string }[] = [];

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
        const enriched = await enrichFromWebsite(clinic.website);

        if (!enriched.ownerName && !enriched.email) {
          results.push({ id, name: clinic.name, status: "no_data_found" });
          continue;
        }

        const update: Record<string, unknown> = {
          updated_at: new Date().toISOString(),
        };

        if (enriched.ownerName) {
          update.contact_name = enriched.ownerName;
          update.contact_title = enriched.ownerTitle;
        }
        if (enriched.email) {
          update.contact_email = enriched.email;
        }

        // Merge with existing scraped_data
        const existing = typeof clinic.scraped_data === "object" && clinic.scraped_data ? clinic.scraped_data : {};
        update.scraped_data = {
          ...existing,
          enriched_at: new Date().toISOString(),
          enriched_owner: enriched.ownerName,
          enriched_email: enriched.email,
        };

        await supabase.from("clinics").update(update).eq("id", id);

        results.push({
          id, name: clinic.name, status: "enriched",
          owner: enriched.ownerName || undefined,
          email: enriched.email || undefined,
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
