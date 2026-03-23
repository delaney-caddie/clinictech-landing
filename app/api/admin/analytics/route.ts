import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  try {
    const supabase = getSupabase();

    // Try to fetch preview_views — table may not exist yet
    const { data: views, error } = await supabase
      .from("preview_views")
      .select("clinic_id, slug, ip_hash, created_at, device_type, city, country");

    if (error) {
      // Table probably doesn't exist yet
      return NextResponse.json({
        total_views: 0,
        unique_visitors: 0,
        clinics: [],
        message: "No analytics data yet",
      });
    }

    if (!views || views.length === 0) {
      return NextResponse.json({
        total_views: 0,
        unique_visitors: 0,
        clinics: [],
      });
    }

    // Aggregate by clinic
    const clinicMap: Record<
      string,
      {
        clinic_id: string;
        slug: string;
        total_views: number;
        unique_visitors: Set<string>;
        last_viewed: string;
      }
    > = {};

    const allUniqueIps = new Set<string>();

    for (const view of views) {
      const key = view.clinic_id || view.slug;
      if (!clinicMap[key]) {
        clinicMap[key] = {
          clinic_id: view.clinic_id,
          slug: view.slug,
          total_views: 0,
          unique_visitors: new Set(),
          last_viewed: view.created_at,
        };
      }
      clinicMap[key].total_views++;
      if (view.ip_hash) {
        clinicMap[key].unique_visitors.add(view.ip_hash);
        allUniqueIps.add(view.ip_hash);
      }
      if (view.created_at > clinicMap[key].last_viewed) {
        clinicMap[key].last_viewed = view.created_at;
      }
    }

    const clinics = Object.values(clinicMap)
      .map((c) => ({
        clinic_id: c.clinic_id,
        slug: c.slug,
        total_views: c.total_views,
        unique_visitors: c.unique_visitors.size,
        last_viewed: c.last_viewed,
      }))
      .sort((a, b) => b.total_views - a.total_views);

    return NextResponse.json({
      total_views: views.length,
      unique_visitors: allUniqueIps.size,
      clinics,
    });
  } catch (err) {
    console.error("GET /api/admin/analytics error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
