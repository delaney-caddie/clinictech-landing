// clinictech-scraper.ts
// Usage: npx ts-node clinictech-scraper.ts "https://example-clinic.com"
// 
// Requires env vars:
//   FIRECRAWL_API_KEY - from firecrawl.dev (free tier: 500 pages/mo)
//   NEXT_PUBLIC_SUPABASE_URL - your Supabase project URL
//   SUPABASE_SERVICE_ROLE_KEY - service role key (for server-side writes)
//
// What it does:
//   1. Scrapes the clinic website with Firecrawl
//   2. Extracts: logo URL, brand colors, clinic name, services, contact info
//   3. Generates a URL slug
//   4. Writes everything to the Supabase `clinics` table
//   5. Outputs the preview URL
//
// Install deps: npm install @mendable/firecrawl-js @supabase/supabase-js dotenv

import Firecrawl from "@mendable/firecrawl-js";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// ─── Config ───
const FIRECRAWL_KEY = process.env.FIRECRAWL_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DOMAIN = process.env.CLINICTECH_DOMAIN || "clinictech.io";

if (!FIRECRAWL_KEY) throw new Error("Missing FIRECRAWL_API_KEY in .env.local");
if (!SUPABASE_URL) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
if (!SUPABASE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local");

const firecrawl = new Firecrawl({ apiKey: FIRECRAWL_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Color extraction helpers ───

function extractHexColors(html: string): string[] {
  const hexPattern = /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
  const matches = html.match(hexPattern) || [];
  // Dedupe and filter out pure black/white/grey
  const unique = [...new Set(matches.map((c) => c.toUpperCase()))];
  return unique.filter((c) => {
    const stripped = c.replace("#", "");
    // Skip pure greys, black, white
    if (/^([0-9a-f])\1{5}$/i.test(stripped)) return false;
    if (stripped === "000000" || stripped === "FFFFFF") return false;
    // Skip very light colors (likely backgrounds)
    const r = parseInt(stripped.slice(0, 2), 16);
    const g = parseInt(stripped.slice(2, 4), 16);
    const b = parseInt(stripped.slice(4, 6), 16);
    if (r > 240 && g > 240 && b > 240) return false;
    return true;
  });
}

function extractCSSColors(html: string): string[] {
  // Also grab rgb/rgba and hsl values from inline styles
  const rgbPattern =
    /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/g;
  const colors: string[] = [];
  let match;
  while ((match = rgbPattern.exec(html))) {
    const [, r, g, b] = match;
    const hex = `#${[r, g, b]
      .map((v) => parseInt(v).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()}`;
    colors.push(hex);
  }
  return colors;
}

function pickPrimaryColor(colors: string[]): string {
  // Most frequently occurring non-grey color is likely the brand color
  const freq: Record<string, number> = {};
  colors.forEach((c) => {
    freq[c] = (freq[c] || 0) + 1;
  });
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || "#0F172A";
}

// ─── Logo extraction ───

function extractLogo(html: string, baseUrl: string): string | null {
  // Try common patterns for logo images
  const patterns = [
    /class="[^"]*logo[^"]*"[^>]*src="([^"]+)"/i,
    /src="([^"]+)"[^>]*class="[^"]*logo[^"]*"/i,
    /alt="[^"]*logo[^"]*"[^>]*src="([^"]+)"/i,
    /src="([^"]+)"[^>]*alt="[^"]*logo[^"]*"/i,
    /id="[^"]*logo[^"]*"[^>]*src="([^"]+)"/i,
    /<link[^>]*rel="icon"[^>]*href="([^"]+)"/i,
    /<link[^>]*rel="apple-touch-icon"[^>]*href="([^"]+)"/i,
    // og:image as fallback
    /property="og:image"[^>]*content="([^"]+)"/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      const src = match[1];
      // Make absolute URL
      if (src.startsWith("http")) return src;
      if (src.startsWith("//")) return `https:${src}`;
      if (src.startsWith("/")) return `${baseUrl}${src}`;
      return `${baseUrl}/${src}`;
    }
  }
  return null;
}

// ─── Contact info extraction ───

function extractEmails(text: string): string[] {
  const pattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(pattern) || [];
  // Filter out common non-contact emails
  return [...new Set(matches)].filter(
    (e) =>
      !e.includes("example.com") &&
      !e.includes("wixpress") &&
      !e.includes("sentry") &&
      !e.includes("schema.org")
  );
}

function extractPhones(text: string): string[] {
  const pattern =
    /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const matches = text.match(pattern) || [];
  return [...new Set(matches)];
}

// ─── Services extraction ───

function extractServices(text: string): string[] {
  const stemCellKeywords = [
    "stem cell therapy",
    "stem cell treatment",
    "regenerative medicine",
    "PRP",
    "platelet rich plasma",
    "exosome",
    "joint therapy",
    "knee therapy",
    "hip therapy",
    "shoulder therapy",
    "anti-aging",
    "sports medicine",
    "pain management",
    "orthopedic",
    "cartilage repair",
    "spinal",
    "IV therapy",
    "peptide therapy",
    "hormone therapy",
    "functional medicine",
    "prolotherapy",
  ];

  const found: string[] = [];
  const lowerText = text.toLowerCase();

  for (const keyword of stemCellKeywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
      // Capitalize nicely
      found.push(
        keyword
          .split(" ")
          .map((w) =>
            w === "PRP" || w === "IV"
              ? w
              : w.charAt(0).toUpperCase() + w.slice(1)
          )
          .join(" ")
      );
    }
  }

  return [...new Set(found)];
}

// ─── Clinic name extraction ───

function extractClinicName(html: string, markdown: string, url: string): string {
  // Try og:title or title tag
  const ogTitle = html.match(
    /property="og:title"[^>]*content="([^"]+)"/i
  )?.[1];
  if (ogTitle && ogTitle.length < 80) return ogTitle.split("|")[0].trim();

  const titleTag = html.match(/<title>([^<]+)<\/title>/i)?.[1];
  if (titleTag && titleTag.length < 80) return titleTag.split("|")[0].trim();

  // Try first h1 from markdown
  const h1 = markdown.match(/^#\s+(.+)$/m)?.[1];
  if (h1 && h1.length < 60) return h1.trim();

  // Fallback: domain name cleaned up
  const domain = new URL(url).hostname.replace("www.", "");
  return domain
    .split(".")[0]
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ─── Slug generator ───

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
}

// ─── Main scraper ───

async function scrapeClinic(websiteUrl: string) {
  console.log(`\n🔍 Scraping ${websiteUrl}...\n`);

  // Normalize URL
  let url = websiteUrl;
  if (!url.startsWith("http")) url = `https://${url}`;
  const baseUrl = new URL(url).origin;

  // Step 1: Scrape with Firecrawl
  let scrapeResult;
  try {
    scrapeResult = await firecrawl.scrapeUrl(url, {
      formats: ["html", "markdown"],
    });
  } catch (err: any) {
    console.error("❌ Firecrawl scrape failed:", err.message);
    process.exit(1);
  }

  if (!scrapeResult.success) {
    console.error("❌ Scrape unsuccessful:", scrapeResult);
    process.exit(1);
  }

  const html = scrapeResult.html || "";
  const markdown = scrapeResult.markdown || "";
  const fullText = markdown || html;

  console.log(`✅ Scraped ${url} (${html.length} chars HTML, ${markdown.length} chars MD)`);

  // Step 2: Extract brand data
  const hexColors = [...extractHexColors(html), ...extractCSSColors(html)];
  const primaryColor = pickPrimaryColor(hexColors);
  const logoUrl = extractLogo(html, baseUrl);
  const clinicName = extractClinicName(html, markdown, url);
  const slug = generateSlug(clinicName);
  const services = extractServices(fullText);
  const emails = extractEmails(fullText);
  const phones = extractPhones(fullText);
  const location = extractLocation(fullText);

  console.log(`\n📋 Extracted data:`);
  console.log(`   Name:     ${clinicName}`);
  console.log(`   Slug:     ${slug}`);
  console.log(`   Color:    ${primaryColor}`);
  console.log(`   Logo:     ${logoUrl || "not found"}`);
  console.log(`   Services: ${services.join(", ") || "none found"}`);
  console.log(`   Email:    ${emails[0] || "not found"}`);
  console.log(`   Phone:    ${phones[0] || "not found"}`);
  console.log(`   Location: ${location || "not found"}`);
  console.log(`   Colors:   ${hexColors.slice(0, 5).join(", ")}`);

  // Step 3: Check if slug already exists
  const { data: existing } = await supabase
    .from("clinics")
    .select("id, slug")
    .eq("slug", slug)
    .single();

  let clinicId: string;

  if (existing) {
    // Update existing record
    console.log(`\n♻️  Updating existing clinic: ${slug}`);
    const { error } = await supabase
      .from("clinics")
      .update({
        name: clinicName,
        website: new URL(url).hostname.replace("www.", ""),
        logo_url: logoUrl,
        primary_color: primaryColor,
        services,
        contact_email: emails[0] || null,
        contact_phone: phones[0] || null,
        location,
        status: "scraped",
        scraped_at: new Date().toISOString(),
        scraped_data: {
          all_colors: hexColors.slice(0, 10),
          all_emails: emails,
          all_phones: phones,
          markdown_preview: markdown.slice(0, 2000),
        },
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) {
      console.error("❌ Supabase update failed:", error);
      process.exit(1);
    }
    clinicId = existing.id;
  } else {
    // Insert new record
    console.log(`\n✨ Creating new clinic: ${slug}`);
    const { data, error } = await supabase
      .from("clinics")
      .insert({
        name: clinicName,
        slug,
        website: new URL(url).hostname.replace("www.", ""),
        logo_url: logoUrl,
        primary_color: primaryColor,
        services,
        contact_email: emails[0] || null,
        contact_phone: phones[0] || null,
        location,
        status: "scraped",
        scraped_at: new Date().toISOString(),
        scraped_data: {
          all_colors: hexColors.slice(0, 10),
          all_emails: emails,
          all_phones: phones,
          markdown_preview: markdown.slice(0, 2000),
        },
        source: "scraper",
      })
      .select("id")
      .single();

    if (error) {
      console.error("❌ Supabase insert failed:", error);
      process.exit(1);
    }
    clinicId = data!.id;
  }

  const previewUrl = `https://${DOMAIN}/preview/${slug}`;

  console.log(`\n🎉 Done!`);
  console.log(`   Preview URL: ${previewUrl}`);
  console.log(`   Clinic ID:   ${clinicId}`);
  console.log(`   Status:      scraped → ready for preview`);

  return {
    id: clinicId,
    name: clinicName,
    slug,
    previewUrl,
    primaryColor,
    logoUrl,
    services,
    contactEmail: emails[0],
    contactPhone: phones[0],
    location,
  };
}

// ─── Location extraction ───

function extractLocation(text: string): string | null {
  // US states
  const statePattern =
    /(?:Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming)\b/i;

  // City, STATE pattern
  const cityState =
    /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),?\s+(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|BC|AB|ON|QC)\b/;
  const cityMatch = text.match(cityState);
  if (cityMatch) return `${cityMatch[1]}, ${cityMatch[2]}`;

  const stateMatch = text.match(statePattern);
  if (stateMatch) return stateMatch[0];

  return null;
}

// ─── CLI entry point ───

const targetUrl = process.argv[2];
if (!targetUrl) {
  console.log("Usage: npx ts-node clinictech-scraper.ts <clinic-website-url>");
  console.log("Example: npx ts-node clinictech-scraper.ts https://rescore.com");
  process.exit(1);
}

scrapeClinic(targetUrl);
