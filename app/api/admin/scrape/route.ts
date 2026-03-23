import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
}

// ─── Lightweight scrape (fetch HTML, extract colors + services) ───

function extractHexColors(html: string): string[] {
  const hexPattern = /#(?:[0-9a-fA-F]{6})\b/g;
  const matches = html.match(hexPattern) || [];
  const unique = [...new Set(matches.map(c => c.toUpperCase()))];
  return unique.filter(c => {
    const stripped = c.replace("#", "");
    if (/^([0-9a-f])\1{5}$/i.test(stripped)) return false;
    if (stripped === "000000" || stripped === "FFFFFF") return false;
    const r = parseInt(stripped.slice(0, 2), 16);
    const g = parseInt(stripped.slice(2, 4), 16);
    const b = parseInt(stripped.slice(4, 6), 16);
    if (r > 240 && g > 240 && b > 240) return false;
    if (r < 15 && g < 15 && b < 15) return false;
    return true;
  });
}

function extractServices(text: string): string[] {
  const keywords = [
    "stem cell therapy", "regenerative medicine", "PRP", "platelet rich plasma",
    "exosome", "joint therapy", "anti-aging", "sports medicine", "pain management",
    "IV therapy", "peptide therapy", "hormone therapy", "prolotherapy",
  ];
  const found: string[] = [];
  const lower = text.toLowerCase();
  for (const kw of keywords) {
    if (lower.includes(kw.toLowerCase())) {
      found.push(kw.split(" ").map(w => w === "PRP" || w === "IV" ? w : w.charAt(0).toUpperCase() + w.slice(1)).join(" "));
    }
  }
  return [...new Set(found)];
}

function extractEmails(text: string): string[] {
  const pattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(pattern) || [];
  return [...new Set(matches)].filter(e =>
    !e.includes("example.com") && !e.includes("wixpress") && !e.includes("sentry")
  );
}

async function scrapeWebsite(website: string): Promise<{
  primaryColor: string | null;
  services: string[];
  contactEmail: string | null;
  logoUrl: string | null;
}> {
  try {
    const url = website.startsWith("http") ? website : `https://${website}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ClinicTech/1.0)" },
      signal: AbortSignal.timeout(10000),
    });
    const html = await res.text();

    const colors = extractHexColors(html);
    // Most frequent non-grey color
    const colorFreq: Record<string, number> = {};
    colors.forEach(c => { colorFreq[c] = (colorFreq[c] || 0) + 1; });
    const sorted = Object.entries(colorFreq).sort((a, b) => b[1] - a[1]);
    const primaryColor = sorted[0]?.[0] || null;

    const services = extractServices(html);
    const emails = extractEmails(html);

    // Try to find logo
    let logoUrl: string | null = null;
    const logoPatterns = [
      /class="[^"]*logo[^"]*"[^>]*src="([^"]+)"/i,
      /src="([^"]+)"[^>]*class="[^"]*logo[^"]*"/i,
      /alt="[^"]*logo[^"]*"[^>]*src="([^"]+)"/i,
      /property="og:image"[^>]*content="([^"]+)"/i,
    ];
    for (const pattern of logoPatterns) {
      const match = html.match(pattern);
      if (match?.[1]) {
        const src = match[1];
        if (src.startsWith("http")) logoUrl = src;
        else if (src.startsWith("//")) logoUrl = `https:${src}`;
        else if (src.startsWith("/")) logoUrl = `${new URL(url).origin}${src}`;
        break;
      }
    }

    return { primaryColor, services, contactEmail: emails[0] || null, logoUrl };
  } catch {
    return { primaryColor: null, services: [], contactEmail: null, logoUrl: null };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const clinicIds: string[] = body.clinicIds || (body.clinicId ? [body.clinicId] : []);

    if (clinicIds.length === 0) {
      return NextResponse.json({ error: "clinicId or clinicIds required" }, { status: 400 });
    }

    const supabase = getSupabase();
    const results: { id: string; slug: string; status: string }[] = [];

    for (const id of clinicIds) {
      const { data: clinic, error: fetchError } = await supabase
        .from("clinics")
        .select("id, name, slug, website")
        .eq("id", id)
        .single();

      if (fetchError || !clinic) {
        results.push({ id, slug: "", status: "not_found" });
        continue;
      }

      const slug = clinic.slug || generateSlug(clinic.name);

      // Actually scrape the website
      const scraped = await scrapeWebsite(clinic.website);

      const update: Record<string, unknown> = {
        status: "scraped",
        slug,
        scraped_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (scraped.primaryColor) update.primary_color = scraped.primaryColor;
      if (scraped.services.length > 0) update.services = scraped.services;
      if (scraped.contactEmail) update.contact_email = scraped.contactEmail;
      if (scraped.logoUrl) update.logo_url = scraped.logoUrl;

      const { error: updateError } = await supabase
        .from("clinics")
        .update(update)
        .eq("id", id);

      if (updateError) {
        results.push({ id, slug, status: "error" });
      } else {
        results.push({ id, slug, status: "scraped" });
      }
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error("POST /api/admin/scrape error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
