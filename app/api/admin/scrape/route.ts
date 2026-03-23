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

  // 4. Fallback: most frequent viable color, weighted towards early-appearing ones
  const hexPattern = /#([0-9a-fA-F]{6})\b/g;
  const freq: Record<string, { count: number; position: number }> = {};
  let m;
  while ((m = hexPattern.exec(html))) {
    const hex = `#${m[1].toUpperCase()}`;
    if (!isViableColor(hex)) continue;
    if (!freq[hex]) freq[hex] = { count: 0, position: m.index };
    freq[hex].count++;
  }
  // Score = count * 2 + earlier position bonus
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

    // Try to find logo — only match actual logo images, not og:image or hero images
    let logoUrl: string | null = null;
    const logoPatterns = [
      // class contains "logo" and has src
      /class="[^"]*logo[^"]*"[^>]*src="([^"]+)"/i,
      /src="([^"]+)"[^>]*class="[^"]*logo[^"]*"/i,
      // alt contains "logo"
      /alt="[^"]*logo[^"]*"[^>]*src="([^"]+)"/i,
      /src="([^"]+)"[^>]*alt="[^"]*logo[^"]*"/i,
      // id contains "logo"
      /id="[^"]*logo[^"]*"[^>]*src="([^"]+)"/i,
    ];
    for (const pattern of logoPatterns) {
      const match = html.match(pattern);
      if (match?.[1]) {
        const src = match[1];
        // Skip if it looks like a photo/hero image (jpg/jpeg usually aren't logos)
        if (/\.(jpg|jpeg)$/i.test(src)) continue;
        // Skip very long URLs (usually tracking/ad images)
        if (src.length > 300) continue;
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
