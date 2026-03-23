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

  // Apply brand color as CSS custom property
  const brandStyle = clinic.primary_color ? {
    "--brand-color": clinic.primary_color,
  } as React.CSSProperties : {};

  return (
    <div className="flex min-h-screen" style={brandStyle}>
      <SidebarNav
        view={view}
        onViewChange={handleViewChange}
        activePage={activePage}
        onPageChange={setActivePage}
        clinicName={clinic.name}
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
