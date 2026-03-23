import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function cleanClinicName(name: string): string {
  // Strip everything after common separators (|, –, -, :)
  let cleaned = name.split(/\s*[|–—:]\s*/)[0].trim();
  // Remove trailing " - Something"
  cleaned = cleaned.replace(/\s+-\s+.*$/, "").trim();
  // Cap at reasonable length
  if (cleaned.length > 50) cleaned = cleaned.slice(0, 50).trim();
  return cleaned || name.slice(0, 50);
}

function generateSlug(name: string): string {
  return cleanClinicName(name)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
}

// ─── Lightweight scrape (fetch HTML, extract colors + services) ───

// WordPress Gutenberg default palette — appears on every WP site, never brand colors
const WP_DEFAULT_COLORS = new Set([
  "#FF6900", "#FCB900", "#7BDCB5", "#00D084", "#8ED1FC",
  "#0693E3", "#ABB8C3", "#CF2E2E", "#F78DA7", "#9B51E0",
  "#FDD79A", "#FAFAE1", "#FAACA8",
]);

function isViableColor(hex: string): boolean {
  const stripped = hex.replace("#", "").toUpperCase();
  const full = `#${stripped}`;
  if (WP_DEFAULT_COLORS.has(full)) return false; // WordPress default palette
  if (/^([0-9A-F])\1{5}$/.test(stripped)) return false; // pure grey
  if (stripped === "000000" || stripped === "FFFFFF") return false;
  const r = parseInt(stripped.slice(0, 2), 16);
  const g = parseInt(stripped.slice(2, 4), 16);
  const b = parseInt(stripped.slice(4, 6), 16);
  if (r > 230 && g > 230 && b > 230) return false; // too light
  if (r < 20 && g < 20 && b < 20) return false; // too dark
  // Skip pure greys (r ≈ g ≈ b)
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max - min < 20) return false;
  return true;
}

function extractBrandColor(html: string): string | null {
  // 1. Meta theme-color (most reliable)
  const themeColor = html.match(/<meta[^>]*name=["']theme-color["'][^>]*content=["']([^"']+)["']/i)?.[1];
  if (themeColor && themeColor.startsWith("#") && isViableColor(themeColor)) {
    return themeColor.toUpperCase();
  }

  // 2. CSS custom properties (--primary, --brand, --accent, --main-color, etc.)
  const cssVarPatterns = [
    /--(?:primary|brand|main|accent)(?:-color)?:\s*#([0-9a-fA-F]{6})/gi,
    /--(?:primary|brand|main|accent)(?:-color)?:\s*#([0-9a-fA-F]{3})\b/gi,
  ];
  for (const pattern of cssVarPatterns) {
    let match;
    while ((match = pattern.exec(html))) {
      let hex = match[1].toUpperCase();
      if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
      const full = `#${hex}`;
      if (isViableColor(full)) return full;
    }
  }

  // 3. Colors from nav/header/button backgrounds (high signal)
  const highSignalPatterns = [
    /(?:nav|header|\.nav|\.header|\.btn-primary|\.button-primary)[^}]*?(?:background(?:-color)?)\s*:\s*#([0-9a-fA-F]{6})/gi,
    /(?:background(?:-color)?)\s*:\s*#([0-9a-fA-F]{6})[^}]*?(?:nav|header|button)/gi,
  ];
  for (const pattern of highSignalPatterns) {
    let match;
    while ((match = pattern.exec(html))) {
      const full = `#${match[1].toUpperCase()}`;
      if (isViableColor(full)) return full;
    }
  }

  // 4. Extract rgb/rgba colors and convert to hex
  const rgbaPattern = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/g;
  const rgbColors: string[] = [];
  let rm;
  while ((rm = rgbaPattern.exec(html))) {
    const r = parseInt(rm[1]), g = parseInt(rm[2]), b = parseInt(rm[3]);
    const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();
    if (isViableColor(hex)) rgbColors.push(hex);
  }

  // 5. Colors from button/CTA backgrounds (highest signal for brand)
  const buttonColorPattern = /(?:button|btn|cta|book|schedule|get-started|learn-more)[^}]{0,200}?(?:background(?:-color)?|color)\s*:\s*(?:#([0-9a-fA-F]{6})|rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3}))/gi;
  let bm;
  while ((bm = buttonColorPattern.exec(html))) {
    let hex;
    if (bm[1]) {
      hex = `#${bm[1].toUpperCase()}`;
    } else if (bm[2]) {
      const r = parseInt(bm[2]), g = parseInt(bm[3]), b = parseInt(bm[4]);
      hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();
    }
    if (hex && isViableColor(hex)) return hex;
  }

  // 6. Most frequent rgb/rgba color
  if (rgbColors.length > 0) {
    const freq: Record<string, number> = {};
    rgbColors.forEach(c => { freq[c] = (freq[c] || 0) + 1; });
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
    if (top && top[1] >= 1) return top[0];
  }

  // 7. Fallback: most frequent viable hex color in entire HTML, weighted by position
  const hexPattern = /#([0-9a-fA-F]{6})\b/g;
  const freq: Record<string, { count: number; position: number }> = {};
  let m;
  while ((m = hexPattern.exec(html))) {
    const hex = `#${m[1].toUpperCase()}`;
    if (!isViableColor(hex)) continue;
    if (!freq[hex]) freq[hex] = { count: 0, position: m.index };
    freq[hex].count++;
  }
  const scored = Object.entries(freq)
    .map(([hex, { count, position }]) => ({
      hex,
      score: count * 2 + Math.max(0, 10 - position / 1000),
    }))
    .sort((a, b) => b.score - a.score);

  return scored[0]?.hex || null;
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

interface FirecrawlBranding {
  primaryColor: string | null;
  secondaryColor: string | null;
  logo: string | null;
  favicon: string | null;
}

async function fetchBrandingFromFirecrawl(url: string): Promise<FirecrawlBranding | null> {
  const firecrawlKey = process.env.FIRECRAWL_API_KEY;
  if (!firecrawlKey) return null;

  try {
    const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${firecrawlKey}`,
      },
      body: JSON.stringify({
        url,
        formats: ["branding"],
      }),
      signal: AbortSignal.timeout(30000),
    });

    const data = await res.json();
    if (!data.success || !data.data?.branding) return null;

    const branding = data.data.branding;
    const colors = branding.colors || {};
    const images = branding.images || {};

    return {
      primaryColor: colors.primary || colors.accent || null,
      secondaryColor: colors.secondary || null,
      logo: images.logo || branding.logo || null,
      favicon: images.favicon || null,
    };
  } catch {
    return null;
  }
}

async function fetchHtmlFromFirecrawl(url: string): Promise<string | null> {
  const firecrawlKey = process.env.FIRECRAWL_API_KEY;
  if (!firecrawlKey) return null;

  try {
    const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${firecrawlKey}`,
      },
      body: JSON.stringify({
        url,
        formats: ["html"],
        waitFor: 3000,
      }),
      signal: AbortSignal.timeout(30000),
    });

    const data = await res.json();
    if (!data.success || !data.data?.html) return null;
    return data.data.html;
  } catch {
    return null;
  }
}

async function scrapeWebsite(website: string): Promise<{
  primaryColor: string | null;
  services: string[];
  contactEmail: string | null;
  logoUrl: string | null;
}> {
  try {
    const url = website.startsWith("http") ? website : `https://${website}`;

    // Try Firecrawl branding endpoint first (best quality)
    const branding = await fetchBrandingFromFirecrawl(url);

    // Get HTML for services/emails extraction
    let html: string;
    const firecrawlHtml = await fetchHtmlFromFirecrawl(url);
    if (firecrawlHtml) {
      html = firecrawlHtml;
    } else {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; ClinicTech/1.0)" },
        signal: AbortSignal.timeout(10000),
      });
      html = await res.text();
    }

    // Use Firecrawl branding colors if available, otherwise extract from HTML
    const primaryColor = branding?.primaryColor || extractBrandColor(html);

    const services = extractServices(html);
    const emails = extractEmails(html);

    // Use Firecrawl logo if available, otherwise skip (text fallback is cleaner)
    const logoUrl = branding?.logo || branding?.favicon || null;

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
