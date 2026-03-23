"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface ClinicData {
  name: string;
  slug: string;
  website: string;
  primary_color: string | null;
  logo_url: string | null;
  services: string[] | null;
  location: string | null;
  contact_phone: string | null;
}

function hexToHsl(hex: string): { h: number; s: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100) };
}

export default function ClinicPreviewPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [clinic, setClinic] = useState<ClinicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    // Track the view
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, page_path: "/", session_id: Math.random().toString(36).slice(2) }),
      keepalive: true,
    }).catch(() => {});

    // Fetch clinic data
    fetch(`/api/admin/clinics`)
      .then(r => r.json())
      .then(data => {
        const found = (data.clinics || []).find((c: ClinicData) => c.slug === slug);
        if (found) setClinic(found);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8FAFC", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", color: "#64748B" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>Loading preview...</div>
        </div>
      </div>
    );
  }

  if (error || !clinic) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8FAFC", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", color: "#64748B" }}>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Preview not found</div>
          <div>No clinic found for &quot;{slug}&quot;</div>
        </div>
      </div>
    );
  }

  // Build preview URL with query params for the main preview engine
  const hsl = clinic.primary_color ? hexToHsl(clinic.primary_color) : { h: 220, s: 60 };
  const previewParams = new URLSearchParams({
    name: clinic.name,
    hue: String(hsl.h),
    sat: String(hsl.s),
    ...(clinic.logo_url ? { logo: clinic.logo_url } : {}),
    ...(clinic.services?.length ? { tag: clinic.services.slice(0, 3).join(" · ") } : {}),
  });

  // Redirect to the preview engine with brand params
  if (typeof window !== "undefined") {
    window.location.href = `/preview?${previewParams.toString()}`;
  }

  return null;
}
