import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const DOMAIN = process.env.CLINICTECH_DOMAIN || "caddieai.com";

function getFirstName(fullName: string | null): string {
  if (!fullName) return "";
  return fullName.split(" ")[0].replace(/^Dr\.?\s*/i, "");
}

function generateFollowUp(
  clinic: { name: string; slug: string; contact_name: string | null; contact_email: string | null; website: string },
  followupNumber: 1 | 2
): { subject: string; body: string; to: string } {
  const previewUrl = `https://${DOMAIN}/preview/${clinic.slug}`;
  const firstName = getFirstName(clinic.contact_name);
  const greeting = firstName ? `Hi ${firstName},` : "Hi there,";
  const to = clinic.contact_email || `contact@${clinic.website}`;
  const signature = `Danika Chilibeck\nCofounder & CEO\nCaddie AI.io`;

  if (followupNumber === 1) {
    return {
      to,
      subject: `Re: Quick mockup for ${clinic.name}`,
      body: `${greeting}

Just bumping this in case it got buried — I put together a mockup for ${clinic.name} that I think you'd find interesting: ${previewUrl}

Even a quick look would be worth it. Most regen med clinics we work with are surprised by how much they're leaving on the table with their current setup.

Happy to walk you through it whenever works.

${signature}`,
    };
  }

  // followupNumber === 2
  return {
    to,
    subject: `Re: Quick mockup for ${clinic.name}`,
    body: `${greeting}

Last note from me on this. The mockup I built for ${clinic.name} is still live if you want to check it out: ${previewUrl}

If the timing isn't right, no worries. If there's someone else on your team I should reach out to, happy to connect with them instead.

${signature}`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clinicId, followupNumber } = body;

    if (!clinicId) {
      return NextResponse.json({ error: "clinicId is required" }, { status: 400 });
    }

    if (followupNumber !== 1 && followupNumber !== 2) {
      return NextResponse.json({ error: "followupNumber must be 1 or 2" }, { status: 400 });
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

    const draft = generateFollowUp(clinic, followupNumber);
    const draftKey = followupNumber === 1 ? "followup_1_draft" : "followup_2_draft";

    // Save draft to scraped_data
    const existingData = clinic.scraped_data || {};
    const updatedData = {
      ...existingData,
      [draftKey]: {
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

    return NextResponse.json({ draft, draftKey });
  } catch (err) {
    console.error("POST /api/admin/followup error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
