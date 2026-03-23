"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { ClinicDashboard } from "@/components/clinic-dashboard"
import { PatientPortal } from "@/components/patient-portal"

function PreviewContent() {
  const searchParams = useSearchParams()
  const [view, setView] = useState<"dashboard" | "portal">("dashboard")
  const [activePage, setActivePage] = useState("overview")

  const clinicName = searchParams.get("name") || "ResCore Clinic"
  const tagline = searchParams.get("tag") || "Regenerative Medicine & Stem Cell Therapy"

  // When view changes, reset to default page for that view
  const handleViewChange = (newView: "dashboard" | "portal") => {
    setView(newView)
    setActivePage(newView === "dashboard" ? "overview" : "home")
  }

  return (
    <div className="flex min-h-screen">
      <SidebarNav
        view={view}
        onViewChange={handleViewChange}
        activePage={activePage}
        onPageChange={setActivePage}
      />
      <main className="flex-1 overflow-auto pb-12">
        {view === "dashboard" ? (
          <ClinicDashboard activePage={activePage} />
        ) : (
          <PatientPortal activePage={activePage} />
        )}
      </main>

      {/* Powered by ClinicTech footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between bg-gray-900 px-4 py-2 text-white">
        <span className="text-xs text-gray-400">
          Powered by <span className="font-semibold text-white">ClinicTech</span>
        </span>
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
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading preview...</div>
      </div>
    }>
      <PreviewContent />
    </Suspense>
  )
}
