import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const SEARCH_QUERIES = [
  "stem cell therapy clinic",
  "stem cell treatment center",
  "regenerative medicine stem cell clinic",
];

// Filter out medspas, cosmetic-only, and unrelated results
const EXCLUDE_TYPES = ["spa", "beauty_salon", "hair_care", "skin_care_clinic"];
const EXCLUDE_KEYWORDS = [
  "medspa", "med spa", "aesthetics", "aesthetic", "dermatology",
  "botox", "filler", "laser", "facial", "waxing", "lash",
  "chiropractic", "chiropractor", "massage",
];

function isRelevantClinic(place: PlaceResult): boolean {
  const name = place.name.toLowerCase();
  // If name explicitly mentions stem cell or regenerative, always include
  if (name.includes("stem cell") || name.includes("regenerat") || name.includes("prp")) return true;
  // Exclude if types are purely cosmetic/spa
  const hasOnlyExcludedTypes = place.types.length > 0 &&
    place.types.filter(t => !["health", "point_of_interest", "establishment", "service", "store"].includes(t))
      .every(t => EXCLUDE_TYPES.includes(t));
  if (hasOnlyExcludedTypes) return false;
  // Exclude by name keywords
  if (EXCLUDE_KEYWORDS.some(kw => name.includes(kw))) return false;
  return true;
}

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

async function searchPlaces(query: string, location: string): Promise<PlaceResult[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_MAPS_API_KEY not configured");

  const url = "https://places.googleapis.com/v1/places:searchText";
  const fullQuery = `${query} in ${location}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "places.displayName,places.formattedAddress,places.websiteUri,places.nationalPhoneNumber,places.rating,places.userRatingCount,places.id,places.types",
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

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "").toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function deduplicateByDomain(clinics: PlaceResult[]): PlaceResult[] {
  const seen = new Set<string>();
  return clinics.filter((c) => {
    if (!c.website) return true;
    const domain = getDomain(c.website);
    if (seen.has(domain)) return false;
    seen.add(domain);
    return true;
  });
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { location, save } = body;

    if (!location) {
      return NextResponse.json({ error: "location is required" }, { status: 400 });
    }

    // Search across all queries
    const allResults: PlaceResult[] = [];
    for (const query of SEARCH_QUERIES) {
      const results = await searchPlaces(query, location);
      allResults.push(...results);
    }

    const unique = deduplicateByDomain(allResults).filter(isRelevantClinic);

    // If save flag is set, add to Supabase
    if (save) {
      const supabase = getSupabase();
      let added = 0;

      for (const clinic of unique) {
        const slug = generateSlug(clinic.name);
        const website = clinic.website ? getDomain(clinic.website) : null;

        // Check for existing
        if (website) {
          const { data: existing } = await supabase
            .from("clinics")
            .select("id")
            .eq("website", website)
            .single();
          if (existing) continue;
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

        if (!error) added++;
      }

      return NextResponse.json({ clinics: unique, added, total: unique.length });
    }

    return NextResponse.json({ clinics: unique, total: unique.length });
  } catch (err: any) {
    console.error("POST /api/admin/discover error:", err);
    return NextResponse.json({ error: err.message || "server error" }, { status: 500 });
  }
}
