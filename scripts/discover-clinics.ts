// scripts/discover-clinics.ts
//
// Discover stem cell / regenerative medicine clinics in a given area
// using Google Places API (New), then optionally scrape + add to pipeline.
//
// Usage:
//   npx ts-node scripts/discover-clinics.ts "Austin, TX"
//   npx ts-node scripts/discover-clinics.ts "Los Angeles, CA" --scrape
//   npx ts-node scripts/discover-clinics.ts "Miami, FL" --scrape --draft
//
// Flags:
//   --scrape    Auto-scrape each discovered clinic's website
//   --draft     Auto-draft outreach emails after scraping
//   --radius    Search radius in meters (default: 50000 = 50km)
//
// Requires env vars:
//   GOOGLE_MAPS_API_KEY
//   NEXT_PUBLIC_SUPABASE_URL (for --scrape)
//   SUPABASE_SERVICE_ROLE_KEY (for --scrape)
//   FIRECRAWL_API_KEY (for --scrape)

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
if (!GOOGLE_API_KEY) {
  console.error("Missing GOOGLE_MAPS_API_KEY in .env.local");
  process.exit(1);
}

const SEARCH_QUERIES = [
  "stem cell therapy clinic",
  "stem cell treatment center",
  "regenerative medicine stem cell clinic",
];

// ─── No geocoding needed — Places text search handles location in query ───

// ─── Search for clinics using Places API (New) ───

interface PlaceResult {
  name: string;
  address: string;
  website: string | null;
  phone: string | null;
  rating: number | null;
  totalRatings: number | null;
  placeId: string;
  types: string[];
}

async function searchPlaces(
  query: string,
  location: string
): Promise<PlaceResult[]> {
  const url = "https://places.googleapis.com/v1/places:searchText";
  const fullQuery = `${query} in ${location}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_API_KEY!,
      "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.websiteUri,places.nationalPhoneNumber,places.rating,places.userRatingCount,places.id,places.types",
    },
    body: JSON.stringify({
      textQuery: fullQuery,
      maxResultCount: 20,
    }),
  });

  const data = await res.json();

  if (!data.places) return [];

  return data.places.map((p: any) => ({
    name: p.displayName?.text || "Unknown",
    address: p.formattedAddress || "",
    website: p.websiteUri || null,
    phone: p.nationalPhoneNumber || null,
    rating: p.rating || null,
    totalRatings: p.userRatingCount || null,
    placeId: p.id || "",
    types: p.types || [],
  }));
}

// ─── Deduplicate by website domain ───

function deduplicateByDomain(clinics: PlaceResult[]): PlaceResult[] {
  const seen = new Set<string>();
  return clinics.filter((c) => {
    if (!c.website) return true; // keep clinics without websites (can still be added)
    const domain = getDomain(c.website);
    if (seen.has(domain)) return false;
    seen.add(domain);
    return true;
  });
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "").toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

// ─── Generate slug from name ───

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
}

// ─── Save to Supabase ───

async function saveToSupabase(clinics: PlaceResult[], location: string): Promise<number> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase env vars — skipping database save");
    return 0;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  let added = 0;

  for (const clinic of clinics) {
    const slug = generateSlug(clinic.name);
    const website = clinic.website ? getDomain(clinic.website) : null;

    // Check if already exists by slug or website
    if (website) {
      const { data: existing } = await supabase
        .from("clinics")
        .select("id")
        .eq("website", website)
        .single();

      if (existing) {
        console.log(`  ⏭  ${clinic.name} — already in database`);
        continue;
      }
    }

    const { error } = await supabase.from("clinics").insert({
      name: clinic.name,
      slug,
      website: website || `${slug}.com`,
      location: clinic.address || location,
      contact_phone: clinic.phone,
      status: "new",
      source: "google_maps",
      scraped_data: {
        google_place_id: clinic.placeId,
        google_rating: clinic.rating,
        google_total_ratings: clinic.totalRatings,
        google_types: clinic.types,
        discovered_location: location,
      },
    });

    if (error) {
      console.log(`  ❌ ${clinic.name} — ${error.message}`);
    } else {
      console.log(`  ✅ ${clinic.name} — added to pipeline`);
      added++;
    }
  }

  return added;
}

// ─── Main ───

async function discoverClinics() {
  const args = process.argv.slice(2);
  const location = args.find((a) => !a.startsWith("--"));
  const doScrape = args.includes("--scrape");
  const doDraft = args.includes("--draft");
  const radiusArg = args.find((a) => a.startsWith("--radius="));
  const radius = radiusArg ? parseInt(radiusArg.split("=")[1]) : 50000;

  if (!location) {
    console.log(`
ClinicTech — Clinic Discovery
==============================

Usage:
  npx ts-node scripts/discover-clinics.ts "<city, state>"
  npx ts-node scripts/discover-clinics.ts "<city>" --scrape
  npx ts-node scripts/discover-clinics.ts "<city>" --scrape --draft
  npx ts-node scripts/discover-clinics.ts "<city>" --radius=100000

Options:
  --scrape     Auto-scrape each clinic's website after discovery
  --draft      Auto-draft outreach emails (requires --scrape)
  --radius=N   Search radius in meters (default: 50000)

Examples:
  npx ts-node scripts/discover-clinics.ts "Austin, TX"
  npx ts-node scripts/discover-clinics.ts "Miami, FL" --scrape --draft
  npx ts-node scripts/discover-clinics.ts "New York, NY" --radius=25000
`);
    process.exit(1);
  }

  console.log(`\n🔍 ClinicTech — Clinic Discovery`);
  console.log(`================================`);
  console.log(`Location: ${location}`);
  console.log(`Radius: ${(radius / 1000).toFixed(0)}km`);
  console.log(`Scrape: ${doScrape ? "yes" : "no"}`);
  console.log(`Draft emails: ${doDraft ? "yes" : "no"}\n`);

  // Search for clinics across multiple queries
  const allResults: PlaceResult[] = [];

  for (const query of SEARCH_QUERIES) {
    console.log(`\n🔎 Searching: "${query} in ${location}"...`);
    const results = await searchPlaces(query, location);
    console.log(`   Found ${results.length} results`);
    allResults.push(...results);
  }

  // Step 3: Deduplicate
  const unique = deduplicateByDomain(allResults);
  console.log(`\n📊 Total unique clinics found: ${unique.length}`);

  // Step 4: Display results
  console.log(`\n${"─".repeat(80)}`);
  unique.forEach((c, i) => {
    console.log(`\n${i + 1}. ${c.name}`);
    console.log(`   📍 ${c.address}`);
    if (c.website) console.log(`   🌐 ${c.website}`);
    if (c.phone) console.log(`   📞 ${c.phone}`);
    if (c.rating) console.log(`   ⭐ ${c.rating}/5 (${c.totalRatings} reviews)`);
  });
  console.log(`\n${"─".repeat(80)}`);

  // Step 5: Save to Supabase
  console.log(`\n💾 Saving to database...`);
  const added = await saveToSupabase(unique, location);
  console.log(`\n✅ Added ${added} new clinics to pipeline (${unique.length - added} already existed)`);

  // Step 6: Optionally scrape each one
  if (doScrape) {
    const clinicsWithSites = unique.filter((c) => c.website);
    console.log(`\n🕷️ Scraping ${clinicsWithSites.length} clinic websites...\n`);

    const { execSync } = await import("child_process");
    for (const clinic of clinicsWithSites) {
      try {
        console.log(`\n── Scraping ${clinic.name} (${clinic.website}) ──`);
        execSync(`npx ts-node scripts/scraper.ts "${clinic.website}"`, {
          stdio: "inherit",
          cwd: process.cwd(),
        });
      } catch {
        console.log(`   ⚠️  Scrape failed for ${clinic.name}, skipping`);
      }
    }
  }

  // Step 7: Optionally draft emails
  if (doDraft && doScrape) {
    console.log(`\n📧 Drafting outreach emails...\n`);
    const { execSync } = await import("child_process");
    try {
      execSync(`npx ts-node scripts/email-drafter.ts`, {
        stdio: "inherit",
        cwd: process.cwd(),
      });
    } catch {
      console.log(`   ⚠️  Email drafting had errors`);
    }
  }

  console.log(`\n🎉 Discovery complete for: ${location}`);
  console.log(`   ${unique.length} clinics found, ${added} new to pipeline\n`);
}

discoverClinics();
