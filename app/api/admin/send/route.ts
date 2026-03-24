import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function sendViaComposio(to: string, subject: string, body: string): Promise<boolean> {
  const apiKey = process.env.COMPOSIO_API_KEY;
  if (!apiKey) return false;

  try {
    const { ComposioToolSet } = require("composio-core");
    const toolset = new ComposioToolSet({
      apiKey,
      entityId: "clinictech-danika",
    });

    await toolset.executeAction({
      action: "GMAIL_SEND_EMAIL",
      params: {
        recipient_email: to,
        subject,
        body,
      },
      entityId: "clinictech-danika",
    });

    return true;
  } catch (err: any) {
    console.error("Composio send failed:", err.message);
    return false;
  }
}

async function sendViaNodemailer(to: string, subject: string, body: string): Promise<boolean> {
  const address = process.env.GMAIL_ADDRESS;
  const password = process.env.GMAIL_APP_PASSWORD;
  if (!address || !password) return false;

  try {
    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: address, pass: password },
    });

    const senderName = process.env.SENDER_NAME || "Danika";
    await transporter.sendMail({
      from: `${senderName} <${address}>`,
      to,
      subject,
      text: body,
      html: body.replace(/\n/g, "<br>"),
    });

    return true;
  } catch (err: any) {
    console.error("Nodemailer send failed:", err.message);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clinicId, draftKey } = body;

    if (!clinicId) {
      return NextResponse.json({ error: "clinicId is required" }, { status: 400 });
    }

    const supabase = getSupabase();

    const { data: clinic, error: fetchError } = await supabase
      .from("clinics")
      .select("*")
      .eq("id", clinicId)
      .single();

    if (fetchError || !clinic) {
      return NextResponse.json({ error: "clinic not found" }, { status: 404 });
    }

    // Support follow-up drafts via draftKey parameter
    const key = draftKey || "draft";
    const draft = clinic.scraped_data?.[key];
    if (!draft) {
      return NextResponse.json({ error: `no ${key} found — generate a draft first` }, { status: 400 });
    }

    // Try Composio first, then Nodemailer fallback
    let emailSent = await sendViaComposio(draft.to, draft.subject, draft.body);
    let method = "composio";

    if (!emailSent) {
      emailSent = await sendViaNodemailer(draft.to, draft.subject, draft.body);
      method = "nodemailer";
    }

    // Determine status and timestamp fields based on draft type
    let statusUpdate: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (key === "followup_1_draft") {
      statusUpdate.status = "follow_up_1";
      statusUpdate.follow_up_1_at = new Date().toISOString();
    } else if (key === "followup_2_draft") {
      statusUpdate.status = "follow_up_2";
      statusUpdate.follow_up_2_at = new Date().toISOString();
    } else {
      statusUpdate.status = "preview_sent";
      statusUpdate.preview_sent_at = new Date().toISOString();
      statusUpdate.emailed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("clinics")
      .update(statusUpdate)
      .eq("id", clinicId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      emailSent,
      method: emailSent ? method : "none",
      to: draft.to,
      message: emailSent
        ? `Email sent to ${draft.to} via ${method}`
        : "Marked as sent (email not configured — connect Gmail via Composio or set GMAIL_APP_PASSWORD)",
    });
  } catch (err) {
    console.error("POST /api/admin/send error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
