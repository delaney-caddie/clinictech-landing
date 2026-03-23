import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const DOMAIN = process.env.CLINICTECH_DOMAIN || "clinictech.io";
const SENDER_NAME = process.env.SENDER_NAME || "Delaney";
const SENDER_TITLE = process.env.SENDER_TITLE || "Co-founder, ClinicTech";
const CALENDAR_LINK = process.env.CALENDAR_LINK || "https://calendly.com/clinictech/intro";

interface ClinicData {
  id: string;
  name: string;
  slug: string;
  website: string;
  contact_name: string | null;
  contact_email: string | null;
  services: string[] | null;
  location: string | null;
  status: string;
}

function getFirstName(fullName: string | null): string {
  if (!fullName) return "";
  return fullName.split(" ")[0].replace(/^Dr\.?\s*/i, "");
}

function generateEmail(clinic: ClinicData): { subject: string; body: string; to: string } {
  const previewUrl = `https://${DOMAIN}/preview/${clinic.slug}`;
  const firstName = getFirstName(clinic.contact_name);
  const greeting = firstName ? `Hi ${firstName}` : "Hi there";
  const services = clinic.services || [];
  const servicesSnippet =
    services.length > 0 ? services.slice(0, 3).join(", ") : "regenerative treatments";

  if (clinic.contact_name && services.length > 0) {
    return {
      to: clinic.contact_email || `contact@${clinic.website}`,
      subject: `Built something for ${clinic.name}`,
      body: `${greeting},

I came across ${clinic.name} and your work in ${servicesSnippet}. I was impressed enough that I actually built a quick preview of what a custom back-office platform could look like for your clinic.

Here it is: ${previewUrl}

It's branded to ${clinic.name} and shows what a purpose-built system for regenerative medicine clinics looks like. Think lead tracking, patient management, AI-assisted follow-ups, and intake forms, all in one place.

Most clinics we talk to are stitching together 4-5 different tools and still dropping leads. This replaces all of that.

Would you be open to a 15-minute walkthrough this week? Happy to show you how it would work with your actual workflow.

${SENDER_NAME}
${SENDER_TITLE}

P.S. That preview is live and interactive. Click around, it's all real.`,
    };
  }

  if (clinic.contact_name) {
    return {
      to: clinic.contact_email || `contact@${clinic.website}`,
      subject: `Quick question for ${clinic.name}`,
      body: `${greeting},

I've been researching regenerative medicine clinics and ${clinic.name} caught my attention. I put together a quick preview of what a custom platform could look like for your practice:

${previewUrl}

We're building ClinicTech specifically for clinics like yours. It handles lead tracking, patient intake, appointment management, and AI-powered follow-ups, all branded to your clinic.

Curious if managing leads and patient communications is a pain point for your team? Most clinic owners we talk to say it's their biggest bottleneck after clinical work.

Happy to jump on a quick call if you're interested: ${CALENDAR_LINK}

${SENDER_NAME}
${SENDER_TITLE}`,
    };
  }

  return {
    to: clinic.contact_email || `info@${clinic.website}`,
    subject: `Built a custom preview for ${clinic.name}`,
    body: `Hi,

I put together a custom preview of what a back-office platform could look like for ${clinic.name}:

${previewUrl}

It's branded to your clinic and shows how ClinicTech handles lead tracking, patient management, AI-assisted follow-ups, and intake, all purpose-built for regenerative medicine.

We're working with a handful of clinics in the space and would love to include ${clinic.name}. Happy to walk you through it.

Would a 15-minute call work this week? ${CALENDAR_LINK}

${SENDER_NAME}
${SENDER_TITLE}`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clinicId } = body;

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

    const draft = generateEmail(clinic);

    // Store the draft in the scraped_data jsonb field under a "draft" key
    const existingData = clinic.scraped_data || {};
    const updatedData = {
      ...existingData,
      draft: {
        subject: draft.subject,
        body: draft.body,
        to: draft.to,
        generated_at: new Date().toISOString(),
      },
    };

    const { error: updateError } = await supabase
      .from("clinics")
      .update({
        scraped_data: updatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", clinicId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ draft });
  } catch (err) {
    console.error("POST /api/admin/draft error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
