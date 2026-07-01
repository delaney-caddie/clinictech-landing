import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const DOMAIN = process.env.CLINICTECH_DOMAIN || "clinictech.io";
const SENDER_NAME = process.env.SENDER_NAME || "Danika";
const SENDER_TITLE = process.env.SENDER_TITLE || "Co-founder, ClinicTech";
const SENDER_EMAIL = process.env.SENDER_EMAIL || "danika@clinictech.io";
const CALENDAR_LINK = process.env.CALENDAR_LINK || "https://calendly.com/danika-clinictech/clinictech-1-hour-meeting-clone";

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
  const greeting = firstName ? `Hi ${firstName},` : "Hi there,";

  const signature = `${SENDER_NAME} Chilibeck\nCofounder & CEO\nClinicTech.io`;

  // Primary template — personalized with name
  if (clinic.contact_name) {
    return {
      to: clinic.contact_email || `contact@${clinic.website}`,
      subject: `Quick mockup for ${clinic.name}`,
      body: `${greeting}

My team was looking at your ${clinic.name} site and put together a quick mockup of what a more streamlined patient experience and backend system could look like: ${previewUrl}

Just a rough concept, but the idea is to show how you could:
• centralize protocols, case studies, and patient info in one place
• give patients a simple way to understand their treatment instead of PDFs and back-and-forth
• tighten up how inquiries get handled so fewer leads slip through the cracks

For context, most regen med clinics we talk to are leaving a lot on the table just from slow response times and manual follow-up. Even converting 2-5 more patients a month from leads you're already getting can mean $150K-$500K+ in additional annual revenue.

Would love to walk you through the mockup and show you how we could build something like this for your clinic.

Open to a quick call next week?

${signature}`,
    };
  }

  // Fallback — no contact name
  return {
    to: clinic.contact_email || `info@${clinic.website}`,
    subject: `Custom mockup for ${clinic.name}`,
    body: `Hi there,

My team put together a quick mockup of what a more streamlined patient experience and backend system could look like for ${clinic.name}: ${previewUrl}

Just a rough concept, but the idea is to show how you could:
• centralize protocols, case studies, and patient info in one place
• give patients a simple way to understand their treatment instead of PDFs and back-and-forth
• tighten up how inquiries get handled so fewer leads slip through the cracks

For context, most regen med clinics we talk to are leaving a lot on the table just from slow response times and manual follow-up. Even converting 2-5 more patients a month from leads you're already getting can mean $150K-$500K+ in additional annual revenue.

Would love to walk you through the mockup and show you how we could build something like this for your clinic.

Open to a quick call next week?

${signature}`,
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
