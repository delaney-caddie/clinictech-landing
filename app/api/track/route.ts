// src/app/api/track/route.ts
// 
// API route that logs preview page views to Supabase
// Called automatically when someone opens a preview page
//
// Vercel provides geo headers for free:
//   x-vercel-ip-city, x-vercel-ip-country-region, x-vercel-ip-country

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars not configured");
  return createClient(url, key);
}

function hashIP(ip: string): string {
  // Hash the IP for privacy - we can still count unique visitors
  // but we're not storing raw IPs
  return createHash("sha256")
    .update(ip + "clinictech-salt-2026")
    .digest("hex")
    .slice(0, 16);
}

function getDeviceType(ua: string): string {
  if (/mobile/i.test(ua)) return "mobile";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  return "desktop";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, page_path, session_id } = body;

    if (!slug) {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }

    // Get clinic ID from slug
    const { data: clinic } = await getSupabase()
      .from("clinics")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!clinic) {
      return NextResponse.json({ error: "clinic not found" }, { status: 404 });
    }

    // Extract visitor info from Vercel headers (free on Vercel)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const city = req.headers.get("x-vercel-ip-city") || null;
    const region = req.headers.get("x-vercel-ip-country-region") || null;
    const country = req.headers.get("x-vercel-ip-country") || null;
    const userAgent = req.headers.get("user-agent") || "";
    const referrer = req.headers.get("referer") || body.referrer || null;

    // Insert view record
    const { error } = await getSupabase().from("preview_views").insert({
      clinic_id: clinic.id,
      slug,
      ip_hash: hashIP(ip),
      city: city ? decodeURIComponent(city) : null,
      region,
      country,
      user_agent: userAgent.slice(0, 500),
      device_type: getDeviceType(userAgent),
      referrer: referrer?.slice(0, 500),
      page_path: page_path || "/",
      session_id: session_id || null,
    });

    if (error) {
      console.error("Track error:", error);
      return NextResponse.json({ error: "tracking failed" }, { status: 500 });
    }

    // Auto-flag clinic for call queue when preview is first opened
    // Only on initial page load (not navigation/duration events)
    if (page_path === "/" || !page_path) {
      const supabase = getSupabase();
      const { data: clinicData } = await supabase
        .from("clinics")
        .select("status")
        .eq("id", clinic.id)
        .single();

      // If clinic is in preview_sent status, move to call_flagged
      // (they opened the preview — time to follow up)
      if (clinicData && clinicData.status === "preview_sent") {
        await supabase
          .from("clinics")
          .update({
            status: "call_flagged",
            call_flagged_at: new Date().toISOString(),
          })
          .eq("id", clinic.id);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Track error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

// Also support GET for simple pixel tracking (email open tracking etc.)
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (slug) {
    // Fire and forget
    const { data: clinic } = await getSupabase()
      .from("clinics")
      .select("id")
      .eq("slug", slug)
      .single();

    if (clinic) {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
      await getSupabase().from("preview_views").insert({
        clinic_id: clinic.id,
        slug,
        ip_hash: hashIP(ip),
        city: req.headers.get("x-vercel-ip-city") ? decodeURIComponent(req.headers.get("x-vercel-ip-city")!) : null,
        region: req.headers.get("x-vercel-ip-country-region"),
        country: req.headers.get("x-vercel-ip-country"),
        user_agent: (req.headers.get("user-agent") || "").slice(0, 500),
        device_type: getDeviceType(req.headers.get("user-agent") || ""),
        referrer: req.headers.get("referer")?.slice(0, 500),
        page_path: "/",
      });
    }
  }

  // Return a 1x1 transparent pixel
  const pixel = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64"
  );
  return new NextResponse(pixel, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
