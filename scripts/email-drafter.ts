// caddie-email-drafter.ts
// Usage: npx ts-node caddie-email-drafter.ts [slug]
//
// If slug is provided: drafts email for that specific clinic
// If no slug: drafts emails for all clinics with status "scraped" or "preview_generated"
//
// Requires env vars:
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//
// What it does:
//   1. Pulls clinic data from Supabase
//   2. Generates a personalized cold email with the preview link
//   3. Outputs the email (subject + body) for you to review
//   4. Optionally updates the clinic status to "preview_sent"
//
// Install deps: npm install @supabase/supabase-js dotenv

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as readline from "readline";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DOMAIN = process.env.CLINICTECH_DOMAIN || "caddieai.com";
const SENDER_NAME = process.env.SENDER_NAME || "Delaney";
const SENDER_TITLE = process.env.SENDER_TITLE || "Co-founder, Caddie AI";
const SENDER_EMAIL = process.env.SENDER_EMAIL || "delaney@clinictech.io";
const CALENDAR_LINK = process.env.CALENDAR_LINK || "https://calendly.com/clinictech/intro";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE env vars in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Email Templates ───

interface ClinicData {
  id: string;
  name: string;
  slug: string;
  website: string;
  contact_name: string | null;
  contact_email: string | null;
  services: string[];
  location: string | null;
  primary_color: string;
  logo_url: string | null;
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
  const servicesSnippet = clinic.services.length > 0
    ? clinic.services.slice(0, 3).join(", ")
    : "regenerative treatments";

  // Pick template based on available data
  if (clinic.contact_name && clinic.services.length > 0) {
    // Best case: we have name + services
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
    // Have name but limited services data
    return {
      to: clinic.contact_email || `contact@${clinic.website}`,
      subject: `Quick question for ${clinic.name}`,
      body: `${greeting},

I've been researching regenerative medicine clinics and ${clinic.name} caught my attention. I put together a quick preview of what a custom platform could look like for your practice:

${previewUrl}

We're building Caddie AI specifically for clinics like yours. It handles lead tracking, patient intake, appointment management, and AI-powered follow-ups, all branded to your clinic.

Curious if managing leads and patient communications is a pain point for your team? Most clinic owners we talk to say it's their biggest bottleneck after clinical work.

Happy to jump on a quick call if you're interested: ${CALENDAR_LINK}

${SENDER_NAME}
${SENDER_TITLE}`,
    };
  }

  // Minimal data - generic but still personalized with preview link
  return {
    to: clinic.contact_email || `info@${clinic.website}`,
    subject: `Built a custom preview for ${clinic.name}`,
    body: `Hi,

I put together a custom preview of what a back-office platform could look like for ${clinic.name}:

${previewUrl}

It's branded to your clinic and shows how Caddie AI handles lead tracking, patient management, AI-assisted follow-ups, and intake, all purpose-built for regenerative medicine.

We're working with a handful of clinics in the space and would love to include ${clinic.name}. Happy to walk you through it.

Would a 15-minute call work this week? ${CALENDAR_LINK}

${SENDER_NAME}
${SENDER_TITLE}`,
  };
}

function generateFollowUp1(clinic: ClinicData): { subject: string; body: string; to: string } {
  const previewUrl = `https://${DOMAIN}/preview/${clinic.slug}`;
  const firstName = getFirstName(clinic.contact_name);
  const greeting = firstName ? `Hey ${firstName}` : "Hi";

  return {
    to: clinic.contact_email || `contact@${clinic.website}`,
    subject: `Re: Built something for ${clinic.name}`,
    body: `${greeting},

Just bumping this up in case it got buried. I built an interactive preview of what a dedicated back-office platform would look like for ${clinic.name}:

${previewUrl}

Worth a look even if the timing isn't right. We're onboarding a small group of clinics for early access and I'd love ${clinic.name} to be one of them.

Any interest in a quick chat?

${SENDER_NAME}`,
  };
}

function generateFollowUp2(clinic: ClinicData): { subject: string; body: string; to: string } {
  const previewUrl = `https://${DOMAIN}/preview/${clinic.slug}`;
  const firstName = getFirstName(clinic.contact_name);
  const greeting = firstName ? `Hi ${firstName}` : "Hi";

  return {
    to: clinic.contact_email || `contact@${clinic.website}`,
    subject: `Last note from me (preview for ${clinic.name})`,
    body: `${greeting},

Last follow-up from me on this. I built a branded preview for ${clinic.name} and wanted to make sure you saw it:

${previewUrl}

If it's not the right time, no worries at all. The preview will stay live if you want to check it out later.

If you'd prefer I reach out to someone else on your team, just let me know.

${SENDER_NAME}
${SENDER_TITLE}`,
  };
}

// ─── Status helpers ───

function getNextStatus(current: string): string {
  const flow: Record<string, string> = {
    scraped: "preview_sent",
    preview_generated: "preview_sent",
    preview_sent: "emailed",
    emailed: "follow_up_1",
    follow_up_1: "follow_up_2",
    follow_up_2: "call_flagged",
  };
  return flow[current] || current;
}

function getEmailType(status: string): "initial" | "followup1" | "followup2" {
  if (status === "emailed" || status === "follow_up_1") return "followup1";
  if (status === "follow_up_2") return "followup2";
  return "initial";
}

// ─── CLI interaction ───

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// ─── Main ───

async function draftEmails(targetSlug?: string) {
  let query = supabase.from("clinics").select("*");

  if (targetSlug) {
    query = query.eq("slug", targetSlug);
  } else {
    // Get all clinics ready for outreach
    query = query.in("status", [
      "scraped",
      "preview_generated",
      "preview_sent",
      "emailed",
      "follow_up_1",
    ]);
  }

  const { data: clinics, error } = await query.order("created_at", {
    ascending: true,
  });

  if (error) {
    console.error("❌ Supabase query failed:", error);
    process.exit(1);
  }

  if (!clinics || clinics.length === 0) {
    console.log("No clinics found ready for outreach.");
    if (targetSlug) {
      console.log(`Check that slug "${targetSlug}" exists and has been scraped.`);
    }
    process.exit(0);
  }

  console.log(`\n📧 Found ${clinics.length} clinic(s) ready for outreach\n`);
  console.log("─".repeat(60));

  for (const clinic of clinics) {
    const emailType = getEmailType(clinic.status);
    let email;

    switch (emailType) {
      case "followup1":
        email = generateFollowUp1(clinic);
        break;
      case "followup2":
        email = generateFollowUp2(clinic);
        break;
      default:
        email = generateEmail(clinic);
    }

    const typeLabel =
      emailType === "initial"
        ? "INITIAL OUTREACH"
        : emailType === "followup1"
        ? "FOLLOW-UP #1"
        : "FOLLOW-UP #2 (FINAL)";

    console.log(`\n┌─ ${clinic.name} (${typeLabel})`);
    console.log(`│  Status: ${clinic.status}`);
    console.log(`│  To: ${email.to}`);
    console.log(`│  Preview: https://${DOMAIN}/preview/${clinic.slug}`);
    console.log(`├──────────────────────────────────────`);
    console.log(`│  Subject: ${email.subject}`);
    console.log(`├──────────────────────────────────────`);
    email.body.split("\n").forEach((line) => {
      console.log(`│  ${line}`);
    });
    console.log(`└──────────────────────────────────────\n`);

    // Ask user what to do
    const action = await prompt(
      `  [s]end (copy + mark sent) | [k]ip | [e]dit status | [q]uit: `
    );

    switch (action.toLowerCase()) {
      case "s":
      case "send": {
        const nextStatus = getNextStatus(clinic.status);
        const timestampField = {
          preview_sent: "preview_sent_at",
          emailed: "emailed_at",
          follow_up_1: "follow_up_1_at",
          follow_up_2: "follow_up_2_at",
          call_flagged: "call_flagged_at",
        }[nextStatus];

        const update: Record<string, any> = { status: nextStatus };
        if (timestampField) update[timestampField] = new Date().toISOString();

        const { error: updateError } = await supabase
          .from("clinics")
          .update(update)
          .eq("id", clinic.id);

        if (updateError) {
          console.error(`  ❌ Failed to update status: ${updateError.message}`);
        } else {
          console.log(`  ✅ Marked as "${nextStatus}". Copy the email above and send it!`);
        }
        break;
      }
      case "e":
      case "edit": {
        const newStatus = await prompt(
          `  Enter new status (new/scraped/preview_generated/preview_sent/emailed/follow_up_1/follow_up_2/call_flagged/converted/lost): `
        );
        const { error: editError } = await supabase
          .from("clinics")
          .update({ status: newStatus })
          .eq("id", clinic.id);
        if (editError) {
          console.error(`  ❌ Failed: ${editError.message}`);
        } else {
          console.log(`  ✅ Status updated to "${newStatus}"`);
        }
        break;
      }
      case "q":
      case "quit":
        console.log("\n👋 Done.");
        process.exit(0);
      default:
        console.log("  ⏭ Skipped.");
    }
  }

  console.log("\n✅ All clinics processed.");
}

// ─── CLI entry point ───

const targetSlug = process.argv[2];
draftEmails(targetSlug);
