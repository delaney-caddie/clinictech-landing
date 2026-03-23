import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const VALID_STATUSES = [
  "new",
  "scraped",
  "preview_generated",
  "preview_sent",
  "emailed",
  "follow_up_1",
  "follow_up_2",
  "meeting_booked",
  "called",
  "call_flagged",
  "converted",
  "lost",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clinicId, status, clearLogo, updateDraft } = body;

    if (!clinicId) {
      return NextResponse.json({ error: "clinicId is required" }, { status: 400 });
    }

    // Handle clear logo action
    if (clearLogo) {
      const { error } = await getSupabase()
        .from("clinics")
        .update({ logo_url: null, updated_at: new Date().toISOString() })
        .eq("id", clinicId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, action: "logo_cleared" });
    }

    // Handle draft update
    if (updateDraft) {
      const supabase = getSupabase();
      const { data: clinic } = await supabase.from("clinics").select("scraped_data").eq("id", clinicId).single();
      const existing = typeof clinic?.scraped_data === "object" && clinic?.scraped_data ? clinic.scraped_data : {};
      const { error } = await supabase
        .from("clinics")
        .update({
          scraped_data: { ...existing, draft: updateDraft },
          contact_email: updateDraft.to || existing.draft?.to,
          updated_at: new Date().toISOString(),
        })
        .eq("id", clinicId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, action: "draft_updated" });
    }

    if (!status) {
      return NextResponse.json({ error: "status is required" }, { status: 400 });
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // Build update payload with relevant timestamp
    const update: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };

    const timestampMap: Record<string, string> = {
      preview_sent: "preview_sent_at",
      emailed: "emailed_at",
      follow_up_1: "follow_up_1_at",
      follow_up_2: "follow_up_2_at",
      call_flagged: "call_flagged_at",
    };

    if (timestampMap[status]) {
      update[timestampMap[status]] = new Date().toISOString();
    }

    const { error } = await supabase
      .from("clinics")
      .update(update)
      .eq("id", clinicId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, status });
  } catch (err) {
    console.error("POST /api/admin/status error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
