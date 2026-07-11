import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function splitName(fullName: string | null): { first: string; last: string } {
  if (!fullName) return { first: "", last: "" };
  const parts = fullName.trim().split(" ");
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

function formatFindings(findings: unknown): string {
  if (!Array.isArray(findings)) return "";
  return findings.map((f, i) => `${i + 1}) ${f}`).join(" ");
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
    const { data: clinics, error } = await supabase
      .from("clinics")
      .select("*")
      .in("id", clinicIds);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const allClinics = clinics || [];
    const withEmail = allClinics.filter((c: any) => c.contact_email).length;
    const withoutEmail = allClinics.length - withEmail;

    const headers = [
      "first_name",
      "last_name",
      "email",
      "phone",
      "company_name",
      "website",
      "location",
      "title",
      "linkedin_url",
      "personalization",
    ];

    const rows = allClinics.map((clinic: any) => {
      const { first, last } = splitName(clinic.contact_name);
      const scrapedData = clinic.scraped_data || {};

      return [
        first,
        last,
        clinic.contact_email || "",
        clinic.contact_phone || "",
        clinic.name || "",
        clinic.website || "",
        clinic.location || "",
        clinic.contact_title || "",
        scrapedData.linkedin_url || "",
        formatFindings(scrapedData.audit_findings),
      ]
        .map(escapeCSV)
        .join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const date = new Date().toISOString().split("T")[0];

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="caddie-outreach-${date}.csv"`,
        "X-Total-Count": String(allClinics.length),
        "X-With-Email": String(withEmail),
        "X-Without-Email": String(withoutEmail),
      },
    });
  } catch (err) {
    console.error("Export route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
