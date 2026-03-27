import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
}

function truncateContent(content: string, maxChars = 10000): string {
  if (content.length <= maxChars) return content;
  return content.slice(0, maxChars) + "\n...[truncated]";
}

// ─── Fetch page content + screenshot via Firecrawl ───

interface PageData {
  markdown: string | null;
  screenshotBase64: string | null;
}

async function fetchPageData(website: string): Promise<PageData> {
  const url = website.startsWith("http") ? website : `https://${website}`;
  const firecrawlKey = process.env.FIRECRAWL_API_KEY;

  if (firecrawlKey) {
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${firecrawlKey}`,
        },
        body: JSON.stringify({
          url,
          formats: ["markdown", "screenshot@fullPage"],
          waitFor: 3000,
        }),
        signal: AbortSignal.timeout(45000),
      });
      const data = await res.json();
      if (data.success) {
        return {
          markdown: data.data?.markdown || null,
          screenshotBase64: data.data?.screenshot || null,
        };
      }
    } catch {
      // Fall through
    }

    // Retry without screenshot if full-page screenshot failed
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${firecrawlKey}`,
        },
        body: JSON.stringify({
          url,
          formats: ["markdown", "screenshot"],
          waitFor: 3000,
        }),
        signal: AbortSignal.timeout(30000),
      });
      const data = await res.json();
      if (data.success) {
        return {
          markdown: data.data?.markdown || null,
          screenshotBase64: data.data?.screenshot || null,
        };
      }
    } catch {
      // Fall through
    }
  }

  // Fallback: direct fetch, no screenshot
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ClinicTech/1.0)" },
      signal: AbortSignal.timeout(10000),
    });
    const html = await res.text();
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return { markdown: text, screenshotBase64: null };
  } catch {
    return { markdown: null, screenshotBase64: null };
  }
}

function buildAuditMessages(clinic: {
  name: string;
  website: string;
  location: string | null;
  services: string[] | null;
  pageContent: string;
  screenshotBase64: string | null;
}): Anthropic.MessageCreateParams["messages"] {
  const services =
    clinic.services && clinic.services.length > 0
      ? clinic.services.join(", ")
      : "None found";

  const textPrompt = `You are a website and digital operations expert specializing in regenerative medicine and stem cell clinics.

A clinic's website has been scraped. You have the page text content below${clinic.screenshotBase64 ? " AND a full-page screenshot of the website" : ""}. Analyze everything and identify exactly 3 specific, actionable issues with their website and online presence.

RULES:
- Each finding must be ONE short sentence (under 20 words)
- Be specific to what you actually see (or don't see) on their site
- Focus on issues that a back-office and patient management platform could help solve
- No generic advice. "Improve your SEO" is bad. "No online booking option visible on any page" is good.
- Read the scraped content carefully. If you see booking calendars, forms, testimonials, etc. — do NOT say they're missing.
- The current year is ${new Date().getFullYear()}. Do NOT flag copyright years that match the current year as outdated. Only flag copyright years that are 2+ years old.
${clinic.screenshotBase64 ? `- LOOK AT THE SCREENSHOT CAREFULLY. Call out visual/aesthetic issues you can see:
  - Blurry, pixelated, or low-resolution logo
  - Blurry, stretched, or watermarked images (copyright symbols, stock photo marks)
  - Poor layout spacing (elements too close together, overlapping content)
  - Unprofessional design (clashing colors, hard-to-read text, cluttered layout)
  - Broken images or missing visuals
  - Text overlapping images or unreadable over backgrounds` : ""}
- Prioritize from these categories (pick the 3 most relevant):
  1. Lead capture (no contact form, no email capture, buried phone number)
  2. Online booking (no scheduling, links to third-party tools, "call to book" only)
  3. Patient trust (no testimonials, no before/after results, no provider bios)
  4. Follow-up systems (no patient portal, no post-treatment info visible)
  5. Service clarity (vague service descriptions, no pricing transparency, missing treatment pages)
  6. Visual/aesthetic quality (blurry images, watermarked photos, poor layout, outdated design)
  7. Outdated content (old copyright dates, stale blog, broken links)
  8. Competitive gaps (missing services competitors offer, no differentiators)

CLINIC DATA:
Name: ${clinic.name}
Website: ${clinic.website || "N/A"}
Services found: ${services}
Location: ${clinic.location || "N/A"}
Scraped content:
${truncateContent(clinic.pageContent)}

Respond with ONLY a JSON array of exactly 3 strings. No preamble, no markdown, no explanation.
Example: ["Logo appears blurry and pixelated at current display size", "No patient testimonials or success stories anywhere on the site", "Contact form is buried below the fold with poor spacing from hero images"]`;

  // Build content blocks — text + optional screenshot image
  const content: Anthropic.ContentBlockParam[] = [];

  if (clinic.screenshotBase64) {
    const ss = clinic.screenshotBase64;
    if (ss.startsWith("http://") || ss.startsWith("https://")) {
      // Firecrawl returns a URL
      content.push({
        type: "image",
        source: {
          type: "url",
          url: ss,
        },
      });
    } else {
      // base64 data
      let base64 = ss;
      if (base64.startsWith("data:")) {
        base64 = base64.replace(/^data:image\/[^;]+;base64,/, "");
      }
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: "image/png",
          data: base64,
        },
      });
    }
  }

  content.push({ type: "text", text: textPrompt });

  return [{ role: "user", content }];
}

async function auditClinic(
  supabase: ReturnType<typeof getSupabase>,
  anthropic: Anthropic,
  clinicId: string
): Promise<{
  clinicId: string;
  name: string;
  status: "audited" | "skipped" | "error";
  findings?: string[];
  reason?: string;
}> {
  const { data: clinic, error } = await supabase
    .from("clinics")
    .select("*")
    .eq("id", clinicId)
    .single();

  if (error || !clinic) {
    return { clinicId, name: "Unknown", status: "skipped", reason: "not found" };
  }

  if (!clinic.website) {
    return { clinicId, name: clinic.name, status: "skipped", reason: "no website" };
  }

  // Fetch fresh page content + screenshot
  const { markdown, screenshotBase64 } = await fetchPageData(clinic.website);

  if (!markdown || markdown.length < 50) {
    return {
      clinicId,
      name: clinic.name,
      status: "skipped",
      reason: "could not fetch website content",
    };
  }

  const messages = buildAuditMessages({
    name: clinic.name,
    website: clinic.website,
    location: clinic.location,
    services: clinic.services,
    pageContent: markdown,
    screenshotBase64,
  });

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages,
      });

      const text =
        message.content[0].type === "text" ? message.content[0].text : "";
      const findings: string[] = JSON.parse(text);

      if (!Array.isArray(findings) || findings.length !== 3) {
        throw new Error("Expected array of 3 findings");
      }

      // Save findings into scraped_data.audit_findings
      const existingScraped =
        typeof clinic.scraped_data === "object" && clinic.scraped_data
          ? clinic.scraped_data
          : {};
      const updatedScrapedData = {
        ...existingScraped,
        audit_findings: findings,
      };

      await supabase
        .from("clinics")
        .update({ scraped_data: updatedScrapedData })
        .eq("id", clinicId);

      return { clinicId, name: clinic.name, status: "audited", findings };
    } catch {
      if (attempt === 1) {
        const fallback = ["Audit could not be completed"];
        const existingScraped =
          typeof clinic.scraped_data === "object" && clinic.scraped_data
            ? clinic.scraped_data
            : {};
        const updatedScrapedData = {
          ...existingScraped,
          audit_findings: fallback,
        };
        await supabase
          .from("clinics")
          .update({ scraped_data: updatedScrapedData })
          .eq("id", clinicId);

        return {
          clinicId,
          name: clinic.name,
          status: "error",
          reason: "Claude response could not be parsed after retry",
          findings: fallback,
        };
      }
    }
  }

  return { clinicId, name: "Unknown", status: "error", reason: "unexpected" };
}

export async function POST(request: NextRequest) {
  try {
    const { clinicIds } = (await request.json()) as { clinicIds: string[] };

    if (!Array.isArray(clinicIds) || clinicIds.length === 0) {
      return NextResponse.json(
        { error: "clinicIds must be a non-empty array" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const anthropic = getAnthropic();
    const results = [];
    const useBatchDelay = clinicIds.length > 10;

    for (const id of clinicIds) {
      const result = await auditClinic(supabase, anthropic, id);
      results.push(result);

      if (useBatchDelay) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Audit route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
