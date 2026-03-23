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
      // Get the clinic first to generate slug from name
      const { data: clinic, error: fetchError } = await supabase
        .from("clinics")
        .select("id, name, slug")
        .eq("id", id)
        .single();

      if (fetchError || !clinic) {
        results.push({ id, slug: "", status: "not_found" });
        continue;
      }

      const slug = clinic.slug || generateSlug(clinic.name);

      // Simulate scraping: update status and set slug
      const { error: updateError } = await supabase
        .from("clinics")
        .update({
          status: "scraped",
          slug,
          scraped_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
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
