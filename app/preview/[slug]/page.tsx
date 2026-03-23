"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SidebarNav } from "@/components/sidebar-nav";
import { ClinicDashboard } from "@/components/clinic-dashboard";
import { PatientPortal } from "@/components/patient-portal";

interface ClinicData {
  name: string;
  slug: string;
  website: string;
  primary_color: string | null;
  logo_url: string | null;
  services: string[] | null;
  location: string | null;
  tagline: string | null;
}

export default function ClinicPreviewPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [clinic, setClinic] = useState<ClinicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [view, setView] = useState<"dashboard" | "portal">("dashboard");
  const [activePage, setActivePage] = useState("overview");

  useEffect(() => {
    if (!slug) return;

    // Track the view
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, page_path: "/", session_id: Math.random().toString(36).slice(2) }),
      keepalive: true,
    }).catch(() => {});

    // Fetch clinic data from public API
    fetch(`/api/preview/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.clinic) setClinic(data.clinic);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleViewChange = (newView: "dashboard" | "portal") => {
    setView(newView);
    setActivePage(newView === "dashboard" ? "overview" : "home");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground text-lg">Loading preview...</div>
      </div>
    );
  }

  if (error || !clinic) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Preview not found</div>
          <div className="text-muted-foreground">No clinic found for &quot;{slug}&quot;</div>
        </div>
      </div>
    );
  }

  const brandHex = clinic.primary_color || null;

  // Determine if brand color is light or dark
  function isLightColor(hex: string): boolean {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    // Perceived luminance formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.55;
  }

  const isLight = brandHex ? isLightColor(brandHex) : false;
  const textColor = isLight ? "#1a1a2e" : "#ffffff";
  const textMuted = isLight ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.7)";
  const borderColor = isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.12)";
  const accentBg = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)";
  const activeBg = isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.15)";

  return (
    <div className="flex min-h-screen">
      {brandHex && (
        <style>{`
          .bg-sidebar { background-color: ${brandHex} !important; }
          .bg-sidebar-primary { background-color: ${activeBg} !important; }
          .bg-sidebar-accent { background-color: ${accentBg} !important; }
          .text-sidebar-foreground { color: ${textColor} !important; }
          .text-sidebar-primary-foreground { color: ${textColor} !important; }
          .border-sidebar-border { border-color: ${borderColor} !important; }
          .text-sidebar-foreground\\/70 { color: ${textMuted} !important; }
          .hover\\:text-sidebar-foreground:hover { color: ${textColor} !important; }
          .hover\\:bg-sidebar-accent:hover { background-color: ${accentBg} !important; }
          .hover\\:bg-sidebar-accent\\/80:hover { background-color: ${accentBg} !important; }
        `}</style>
      )}
      <SidebarNav
        view={view}
        onViewChange={handleViewChange}
        activePage={activePage}
        onPageChange={setActivePage}
        clinicName={clinic.name}
        logoUrl={clinic.logo_url}
      />
      <main className="flex-1 overflow-auto pb-12">
        {view === "dashboard" ? (
          <ClinicDashboard activePage={activePage} clinicName={clinic.name} />
        ) : (
          <PatientPortal activePage={activePage} clinicName={clinic.name} />
        )}
      </main>

      {/* Powered by ClinicTech footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between bg-gray-900 px-4 py-2 text-white">
        <span className="text-xs text-gray-400">
          Powered by <span className="font-semibold text-white">ClinicTech</span>
        </span>
        <div className="flex items-center gap-2">
          <a
            href="https://clinictech.io"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-gray-600 px-3 py-1 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
          >
            More Info
          </a>
          <a
            href="https://calendar.app.google/WCKTy12it4D4kMkH7"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-500"
          >
            Book a Demo
          </a>
        </div>
      </div>
    </div>
  );
}
