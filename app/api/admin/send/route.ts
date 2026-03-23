import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function getTransporter() {
  const address = process.env.GMAIL_ADDRESS;
  const password = process.env.GMAIL_APP_PASSWORD;
  if (!address || !password) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: address, pass: password },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clinicId } = body;

    if (!clinicId) {
      return NextResponse.json({ error: "clinicId is required" }, { status: 400 });
    }

    const supabase = getSupabase();

    // Get the clinic with its draft
    const { data: clinic, error: fetchError } = await supabase
      .from("clinics")
      .select("*")
      .eq("id", clinicId)
      .single();

    if (fetchError || !clinic) {
      return NextResponse.json({ error: "clinic not found" }, { status: 404 });
    }

    const draft = clinic.scraped_data?.draft;
    if (!draft) {
      return NextResponse.json({ error: "no draft found — generate a draft first" }, { status: 400 });
    }

    // Try to send via Gmail
    const transporter = getTransporter();
    let emailSent = false;

    if (transporter && draft.to) {
      try {
        const senderName = process.env.SENDER_NAME || "Danika";
        const senderEmail = process.env.GMAIL_ADDRESS;

        await transporter.sendMail({
          from: `${senderName} <${senderEmail}>`,
          to: draft.to,
          subject: draft.subject,
          text: draft.body,
          // Also send HTML version with line breaks
          html: draft.body.replace(/\n/g, "<br>"),
        });

        emailSent = true;
      } catch (emailErr: any) {
        console.error("Email send failed:", emailErr.message);
        // Don't fail the whole request — still mark as sent
      }
    }

    // Update status
    const { error } = await supabase
      .from("clinics")
      .update({
        status: "preview_sent",
        preview_sent_at: new Date().toISOString(),
        emailed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", clinicId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      emailSent,
      to: draft.to,
      message: emailSent
        ? `Email sent to ${draft.to}`
        : "Marked as sent (Gmail not configured — set GMAIL_ADDRESS and GMAIL_APP_PASSWORD to send automatically)",
    });
  } catch (err) {
    console.error("POST /api/admin/send error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
