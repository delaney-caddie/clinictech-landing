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

interface LinkedInProfile {
  name: string;
  headline: string;
  slug: string;
  url: string;
  source: string;
}

// Strategy 1: Kitchen-sink with company domain + job title
async function findViaKitchenSink(domain: string, clinicName: string): Promise<LinkedInProfile[]> {
  const apiKey = FIBER_KEY();
  if (!apiKey) return [];

  const results: LinkedInProfile[] = [];
  const titles = ["owner", "founder", "ceo", "medical director"];

  for (const title of titles) {
    try {
      const res = await fetch(`${FIBER_BASE}/kitchen-sink/person`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          companyDomain: { value: domain },
          jobTitle: { value: title },
          numProfiles: 3,
        }),
      });
      const data = await res.json();
      const profiles = data?.output?.data || [];

      for (const p of profiles) {
        const headline = (p.headline || "").toLowerCase();
        const domainBase = domain.split(".")[0].toLowerCase();
        const nameWords = clinicName.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);

        const relevant = headline.includes(domainBase) ||
          nameWords.some((w: string) => headline.includes(w)) ||
          (p.tenures || []).some((t: any) => {
            const cn = (t.company_name || "").toLowerCase();
            return cn.includes(domainBase) || nameWords.some((w: string) => cn.includes(w));
          });

        if (relevant && p.primary_slug) {
          results.push({
            name: p.name || `${p.first_name || ""} ${p.last_name || ""}`.trim(),
            headline: p.headline || title,
            slug: p.primary_slug,
            url: `https://linkedin.com/in/${p.primary_slug}`,
            source: "fiber",
          });
        }
      }
      if (results.length > 0) break;
    } catch { continue; }
  }
  return results;
}

// Strategy 2: Scrape clinic website for LinkedIn profile URLs, then look up via kitchen-sink
async function findViaWebsite(domain: string): Promise<LinkedInProfile[]> {
  const firecrawlKey = process.env.FIRECRAWL_API_KEY;
  const apiKey = FIBER_KEY();
  if (!firecrawlKey || !apiKey) return [];

  try {
    const url = domain.startsWith("http") ? domain : `https://${domain}`;
    const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${firecrawlKey}` },
      body: JSON.stringify({ url, formats: ["html"], waitFor: 3000 }),
      signal: AbortSignal.timeout(20000),
    });
    const data = await res.json();
    const html = data?.data?.html || "";

    // Find LinkedIn /in/ profile URLs on the site
    const slugs = [...new Set(
      (html.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/g) || [])
        .map((m: string) => m.replace(/.*linkedin\.com\/in\//, ""))
        .filter((s: string) => s.length > 3 && !s.includes("share"))
    )];

    const results: LinkedInProfile[] = [];
    for (const slug of slugs.slice(0, 5)) {
      try {
        const ksRes = await fetch(`${FIBER_BASE}/kitchen-sink/person`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            apiKey,
            profileIdentifier: { identifier: "linkedinSlug", value: slug },
            numProfiles: 1,
          }),
        });
        const ksData = await ksRes.json();
        const profiles = ksData?.output?.data || [];
        if (profiles.length > 0) {
          const p = profiles[0];
          results.push({
            name: p.name || `${p.first_name || ""} ${p.last_name || ""}`.trim(),
            headline: p.headline || "",
            slug: p.primary_slug || slug,
            url: `https://linkedin.com/in/${p.primary_slug || slug}`,
            source: "website",
          });
        }
      } catch { continue; }
    }
    return results;
  } catch { return []; }
}

// Strategy 3: Google search for owner LinkedIn profile
async function findViaGoogle(clinicName: string): Promise<LinkedInProfile[]> {
  const firecrawlKey = process.env.FIRECRAWL_API_KEY;
  if (!firecrawlKey) return [];

  try {
    const query = `"${clinicName}" owner OR founder OR "medical director" site:linkedin.com/in`;
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=5`;

    const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${firecrawlKey}` },
      body: JSON.stringify({ url: googleUrl, formats: ["markdown"] }),
      signal: AbortSignal.timeout(20000),
    });
    const data = await res.json();
    const markdown = data?.data?.markdown || "";

    const results: LinkedInProfile[] = [];
    const lines = markdown.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const slugMatch = lines[i].match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/);
      if (slugMatch) {
        const slug = slugMatch[1];
        const context = lines.slice(Math.max(0, i - 2), i + 3).join(" ");
        const nameMatch = context.match(/([A-Z][a-z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-z]+)/);
        results.push({
          name: nameMatch?.[1] || slug.replace(/-/g, " ").replace(/\d+$/, "").trim(),
          headline: context.slice(0, 100).replace(/[#\[\]()]/g, "").trim(),
          slug,
          url: `https://linkedin.com/in/${slug}`,
          source: "google",
        });
      }
    }
    return results.slice(0, 5);
  } catch { return []; }
}

export async function POST(req: NextRequest) {
  try {
    const { clinicId } = await req.json();
    if (!clinicId) return NextResponse.json({ error: "clinicId required" }, { status: 400 });

    const { data: clinic } = await getSupabase()
      .from("clinics")
      .select("name, website")
      .eq("id", clinicId)
      .single();

    if (!clinic) return NextResponse.json({ error: "clinic not found" }, { status: 404 });

    // Run all 3 strategies in parallel
    const [fiberResults, websiteResults, googleResults] = await Promise.all([
      findViaKitchenSink(clinic.website, clinic.name),
      findViaWebsite(clinic.website),
      findViaGoogle(clinic.name),
    ]);

    // Combine and deduplicate by slug
    const all = [...fiberResults, ...websiteResults, ...googleResults];
    const seen = new Set<string>();
    const unique = all.filter(p => {
      if (!p.slug || seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    });

    return NextResponse.json({
      profiles: unique,
      sources: { fiber: fiberResults.length, website: websiteResults.length, google: googleResults.length },
    });
  } catch (err: any) {
    console.error("LinkedIn lookup error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
