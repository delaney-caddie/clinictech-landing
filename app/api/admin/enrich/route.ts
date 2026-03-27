import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── Website scraping for contact info ───

interface ScrapedContact {
  email: string | null;
  phone: string | null;
  contactName: string | null;
}

async function scrapeWebsiteContact(website: string): Promise<ScrapedContact> {
  const url = website.startsWith("http") ? website : `https://${website}`;
  let htmlText = "";
  let markdownText = "";

  // 1. Raw HTML fetch (most reliable for emails embedded in source)
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
      signal: AbortSignal.timeout(10000),
    });
    htmlText = await res.text();
  } catch { /* continue */ }

  // 2. Firecrawl markdown (catches JS-rendered content)
  const firecrawlKey = process.env.FIRECRAWL_API_KEY;
  if (firecrawlKey) {
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${firecrawlKey}`,
        },
        body: JSON.stringify({ url, formats: ["markdown"], waitFor: 3000 }),
        signal: AbortSignal.timeout(20000),
      });
      const data = await res.json();
      if (data.success && data.data?.markdown) {
        markdownText = data.data.markdown;
      }
    } catch { /* continue */ }
  }

  const combined = htmlText + "\n" + markdownText;
  if (!combined.trim()) return { email: null, phone: null, contactName: null };

  // Extract emails
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const rawEmails = combined.match(emailPattern) || [];
  const emails = [...new Set(rawEmails)].filter(e =>
    !e.includes("example.com") &&
    !e.includes("wixpress") &&
    !e.includes("sentry") &&
    !e.includes("googleapis") &&
    !e.includes("schema.org") &&
    !e.includes("wordpress") &&
    !e.includes("gravatar") &&
    !e.endsWith(".png") &&
    !e.endsWith(".jpg") &&
    !e.endsWith(".svg") &&
    !e.toLowerCase().includes("noreply") &&
    !e.toLowerCase().includes("no-reply")
  );

  // Pick best email: prioritize clinic-facing addresses
  const priorityPrefixes = ["info", "contact", "hello", "admin", "office", "appointments", "reception", "inquiries", "frontdesk", "booking"];
  let bestEmail: string | null = null;
  for (const prefix of priorityPrefixes) {
    const match = emails.find(e => e.toLowerCase().startsWith(prefix + "@"));
    if (match) { bestEmail = match; break; }
  }
  if (!bestEmail && emails.length > 0) {
    bestEmail = emails[0];
  }

  // Extract phone numbers
  const phonePattern = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const phones = combined.match(phonePattern) || [];
  const cleanPhones = [...new Set(phones.map(p => p.trim()))].filter(p => p.replace(/\D/g, "").length >= 10);
  const bestPhone = cleanPhones[0] || null;

  // Try to extract a contact name from common patterns in markdown
  let contactName: string | null = null;
  if (markdownText) {
    // Look for "Dr. FirstName LastName" or "MD" patterns
    const drPattern = /(?:Dr\.?\s+)([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/g;
    const drMatch = drPattern.exec(markdownText);
    if (drMatch) {
      contactName = "Dr. " + drMatch[1];
    }
  }

  return { email: bestEmail, phone: bestPhone, contactName };
}

// ─── Fiber (LinkedIn-only path) ───

const FIBER_KEY = () => process.env.FIBER_API_KEY;
const FIBER_BASE = "https://api.fiber.ai/v1";

async function enrichFromLinkedIn(linkedinUrl: string, existingName: string | null): Promise<{
  name: string;
  title: string;
  email: string | null;
  phone: string | null;
  linkedinSlug: string;
}> {
  const apiKey = FIBER_KEY();
  const slug = linkedinUrl.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\/?/, "").replace(/\/$/, "");
  let name = existingName || "";
  let title = "";

  if (apiKey) {
    // Kitchen-sink lookup for name + headline
    try {
      const ksRes = await fetch(`${FIBER_BASE}/kitchen-sink/person`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          profileIdentifier: { identifier: "linkedinSlug", value: slug },
          numProfiles: 1,
        }),
      });
      const ksData = await ksRes.json();
      const profiles = ksData?.output?.data || [];
      if (profiles.length > 0) {
        const p = profiles[0];
        name = p.name || `${p.first_name || ""} ${p.last_name || ""}`.trim() || name;
        title = p.headline || "";
      }
    } catch { /* continue */ }

    // Contact details for email + phone
    try {
      const res = await fetch(`${FIBER_BASE}/contact-details/single`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, linkedinUrl: slug }),
      });
      const data = await res.json();
      const profile = data?.output?.profile || {};
      const emails = profile.emails || [];
      const phones = profile.phoneNumbers || [];

      return {
        name,
        title,
        email: emails.find((e: any) => e.type === "personal")?.email || emails.find((e: any) => e.type === "work")?.email || null,
        phone: phones.find((p: any) => p.type === "mobile")?.number || null,
        linkedinSlug: slug,
      };
    } catch { /* continue */ }
  }

  return { name, title, email: null, phone: null, linkedinSlug: slug };
}

// ─── Main API Route ───

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const linkedinUrl: string | undefined = body.linkedinUrl;
    const clinicIds: string[] = body.clinicIds || (body.clinicId ? [body.clinicId] : []);

    if (clinicIds.length === 0) {
      return NextResponse.json({ error: "clinicId or clinicIds required" }, { status: 400 });
    }

    const supabase = getSupabase();
    const results: {
      id: string; name: string; status: string;
      email?: string; phone?: string;
    }[] = [];

    for (const id of clinicIds) {
      const { data: clinic } = await supabase
        .from("clinics")
        .select("id, name, website, scraped_data, contact_name, contact_title, contact_email, status")
        .eq("id", id)
        .single();

      if (!clinic) {
        results.push({ id, name: "Unknown", status: "not_found" });
        continue;
      }

      try {
        if (linkedinUrl) {
          // ─── LinkedIn path (Fiber) — only when URL explicitly provided ───
          const fiber = await enrichFromLinkedIn(linkedinUrl, clinic.contact_name);

          const update: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
          };
          if (fiber.name) update.contact_name = fiber.name;
          if (fiber.title) update.contact_title = fiber.title;
          if (fiber.email) update.contact_email = fiber.email;
          if (fiber.phone) update.contact_phone = fiber.phone;

          const existing = typeof clinic.scraped_data === "object" && clinic.scraped_data ? clinic.scraped_data : {};
          update.scraped_data = {
            ...existing,
            enriched_at: new Date().toISOString(),
            linkedin_url: linkedinUrl,
            linkedin_slug: fiber.linkedinSlug,
          };

          // If Fiber didn't find email, scrape website as fallback
          if (!fiber.email && clinic.website) {
            const scraped = await scrapeWebsiteContact(clinic.website);
            if (scraped.email) update.contact_email = scraped.email;
            if (scraped.phone && !fiber.phone) update.contact_phone = scraped.phone;
          }

          await supabase.from("clinics").update(update).eq("id", id);
          results.push({
            id, name: clinic.name, status: "enriched",
            email: (update.contact_email as string) || undefined,
            phone: (update.contact_phone as string) || undefined,
          });

        } else {
          // ─── Default path: scrape the website for clinic contact info ───
          if (!clinic.website) {
            results.push({ id, name: clinic.name, status: "no_website" });
            continue;
          }

          const scraped = await scrapeWebsiteContact(clinic.website);

          const update: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
          };

          // Pre-pipeline clinics: always override contact info
          // In-pipeline clinics: only fill in if empty
          const prePipeline = ["new", "scraped", "preview_generated", "preview_sent", "audited"].includes(clinic.status);

          if (scraped.email && (prePipeline || !clinic.contact_email)) {
            update.contact_email = scraped.email;
          }
          if (scraped.phone) update.contact_phone = scraped.phone;

          const existing = typeof clinic.scraped_data === "object" && clinic.scraped_data ? clinic.scraped_data : {};
          update.scraped_data = {
            ...existing,
            enriched_at: new Date().toISOString(),
            enrichment_source: "website_scrape",
          };

          await supabase.from("clinics").update(update).eq("id", id);

          if (scraped.email || scraped.phone) {
            results.push({
              id, name: clinic.name, status: "enriched",
              email: scraped.email || undefined,
              phone: scraped.phone || undefined,
            });
          } else {
            results.push({ id, name: clinic.name, status: "no_contact_found" });
          }
        }
      } catch (err: any) {
        results.push({ id, name: clinic.name, status: `error: ${err.message?.slice(0, 100)}` });
      }
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error("POST /api/admin/enrich error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
