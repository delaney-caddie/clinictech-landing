import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars not configured");
  return createClient(url, key);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { data, error } = await getSupabase()
      .from("clinics")
      .select("name, slug, website, primary_color, logo_url, services, location, contact_phone, tagline")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    return NextResponse.json({ clinic: data });
  } catch (err) {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
