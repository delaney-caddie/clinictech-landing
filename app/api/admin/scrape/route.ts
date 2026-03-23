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

function isViableColor(hex: string): boolean {
  const stripped = hex.replace("#", "").toUpperCase();
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

  // 4. Colors from inline styles on headers, navs, buttons
  const inlineStylePatterns = [
    /style="[^"]*background(?:-color)?:\s*#([0-9a-fA-F]{6})/gi,
    /style="[^"]*(?:^|;)\s*color:\s*#([0-9a-fA-F]{6})/gi,
  ];
  const inlineColors: string[] = [];
  for (const pattern of inlineStylePatterns) {
    let match;
    while ((match = pattern.exec(html))) {
      const hex = `#${match[1].toUpperCase()}`;
      if (isViableColor(hex)) inlineColors.push(hex);
    }
  }
  if (inlineColors.length > 0) {
    // Most frequent inline style color
    const freq: Record<string, number> = {};
    inlineColors.forEach(c => { freq[c] = (freq[c] || 0) + 1; });
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
    if (top) return top[0];
  }

  // 5. Fallback: most frequent viable color in entire HTML, weighted by position
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

    const primaryColor = extractBrandColor(html);

    const services = extractServices(html);
    const emails = extractEmails(html);

    // Try to find logo — match actual logo images only
    let logoUrl: string | null = null;
    const logoPatterns = [
      // class contains "logo" with src
      /class="[^"]*logo[^"]*"[^>]*src="([^"]+)"/i,
      /src="([^"]+)"[^>]*class="[^"]*logo[^"]*"/i,
      // class contains "logo" with data-src (lazy loaded)
      /class="[^"]*logo[^"]*"[^>]*data-src="([^"]+)"/i,
      // alt contains "logo" with src
      /alt="[^"]*logo[^"]*"[^>]*src="([^"]+)"/i,
      /src="([^"]+)"[^>]*alt="[^"]*logo[^"]*"/i,
      // id contains "logo"
      /id="[^"]*logo[^"]*"[^>]*src="([^"]+)"/i,
      // Common header image patterns
      /class="[^"]*(?:site-logo|header-logo|navbar-brand|custom-logo)[^"]*"[^>]*src="([^"]+)"/i,
      /class="[^"]*(?:site-logo|header-logo|navbar-brand|custom-logo)[^"]*"[^>]*data-src="([^"]+)"/i,
      // WordPress custom logo
      /class="[^"]*custom-logo[^"]*"[^>]*src="([^"]+)"/i,
      // srcset on logo elements (take first URL)
      /class="[^"]*logo[^"]*"[^>]*srcset="([^\s,"]+)/i,
      // Link with logo in rel (favicon as last resort)
      /<link[^>]*rel="icon"[^>]*href="([^"]+)"/i,
      /<link[^>]*rel="apple-touch-icon"[^>]*href="([^"]+)"/i,
    ];
    for (const pattern of logoPatterns) {
      const match = html.match(pattern);
      if (match?.[1]) {
        let src = match[1];
        // Skip broken/placeholder URLs
        if (src.includes("${") || src.includes("{{")) continue;
        if (src.length > 500) continue;
        if (src.startsWith("data:")) continue;
        // Skip certification/partner logos (common false positives)
        const srcLower = src.toLowerCase();
        if (srcLower.includes("certification") || srcLower.includes("accredit") ||
            srcLower.includes("partner") || srcLower.includes("association") ||
            srcLower.includes("greyscale") || srcLower.includes("grayscale") ||
            srcLower.includes("award") || srcLower.includes("badge")) continue;
        // Resolve to absolute URL
        if (src.startsWith("http")) logoUrl = src;
        else if (src.startsWith("//")) logoUrl = `https:${src}`;
        else if (src.startsWith("/")) logoUrl = `${new URL(url).origin}${src}`;
        else logoUrl = `${new URL(url).origin}/${src}`;
        break;
      }
    }

    // If no logo found, try the site's favicon (almost always works)
    if (!logoUrl) {
      const faviconUrl = `${new URL(url).origin}/favicon.ico`;
      try {
        const favRes = await fetch(faviconUrl, { method: "HEAD", signal: AbortSignal.timeout(3000) });
        if (favRes.ok) logoUrl = faviconUrl;
      } catch { /* skip */ }
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
