import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const FIRECRAWL_KEY = () => process.env.FIRECRAWL_API_KEY;
const FIRECRAWL_BASE = "https://api.firecrawl.dev/v1";

interface LinkedInProfile {
  name: string;
  headline: string;
  url: string;
}

function extractLinkedInProfiles(markdown: string): LinkedInProfile[] {
  const profiles: LinkedInProfile[] = [];
  const seen = new Set<string>();

  // Match LinkedIn profile URLs — various formats from Google search results
  const urlRegex = /https?:\/\/(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/g;
  let match;

  while ((match = urlRegex.exec(markdown)) !== null) {
    const slug = match[1];
    const url = `https://www.linkedin.com/in/${slug}`;

    if (seen.has(slug)) continue;
    seen.add(slug);

    // Try to extract name and headline from surrounding text
    // Look backwards and forwards from the URL position for context
    const start = Math.max(0, match.index - 300);
    const end = Math.min(markdown.length, match.index + 300);
    const context = markdown.substring(start, end);

    // Try to extract a name — typically appears as bold text or link text near the URL
    let name = "";
    let headline = "";

    // Pattern: "Name - Title" or "Name – Title" (common in Google snippets)
    const namePatterns = [
      /\*\*([A-Z][a-zA-Z.'\s-]{2,40})\*\*/,
      /\[([A-Z][a-zA-Z.'\s-]{2,40})\]/,
      /^#+\s*([A-Z][a-zA-Z.'\s-]{2,40})/m,
    ];

    for (const pattern of namePatterns) {
      const nameMatch = context.match(pattern);
      if (nameMatch) {
        name = nameMatch[1].trim();
        break;
      }
    }

    // Pattern: "Title at Company" or "Title | Company" from LinkedIn snippets
    const headlinePatterns = [
      /[-–—]\s*(.{10,100}?)(?:\n|\.\.\.|\|)/,
      /(?:title|headline)[:\s]+(.{10,80})/i,
    ];

    for (const pattern of headlinePatterns) {
      const hlMatch = context.match(pattern);
      if (hlMatch) {
        headline = hlMatch[1].trim().replace(/\*\*/g, "").replace(/\[|\]/g, "");
        break;
      }
    }

    // Clean up the slug to make a readable name if we didn't find one
    if (!name) {
      name = slug
        .replace(/-\w{6,10}$/, "") // remove trailing ID hash
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim();
    }

    profiles.push({ name, headline, url });
  }

  return profiles;
}

export async function POST(req: NextRequest) {
  try {
    const firecrawlKey = FIRECRAWL_KEY();
    if (!firecrawlKey) {
      return NextResponse.json({ error: "FIRECRAWL_API_KEY not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { clinicId } = body;

    if (!clinicId) {
      return NextResponse.json({ error: "clinicId is required" }, { status: 400 });
    }

    const supabase = getSupabase();

    const { data: clinic, error: fetchError } = await supabase
      .from("clinics")
      .select("id, name, website")
      .eq("id", clinicId)
      .single();

    if (fetchError || !clinic) {
      return NextResponse.json({ error: "clinic not found" }, { status: 404 });
    }

    // Build a Google search query targeting decision makers on LinkedIn
    const clinicName = clinic.name.replace(/['"]/g, "");
    const query = `"${clinicName}" owner OR founder OR "medical director" OR CEO site:linkedin.com/in`;
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=10`;

    // Use Firecrawl to scrape the Google search results page
    const scrapeRes = await fetch(`${FIRECRAWL_BASE}/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${firecrawlKey}`,
      },
      body: JSON.stringify({
        url: googleUrl,
        formats: ["markdown"],
      }),
    });

    if (!scrapeRes.ok) {
      const errText = await scrapeRes.text();
      console.error("Firecrawl scrape failed:", errText);
      return NextResponse.json({ error: "Failed to search Google via Firecrawl" }, { status: 502 });
    }

    const scrapeData = await scrapeRes.json();
    const markdown = scrapeData?.data?.markdown || "";

    if (!markdown) {
      return NextResponse.json({ profiles: [], message: "No results from Google search" });
    }

    // Extract LinkedIn profiles from the markdown
    const profiles = extractLinkedInProfiles(markdown).slice(0, 5);

    return NextResponse.json({ profiles });
  } catch (err) {
    console.error("POST /api/admin/linkedin error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
