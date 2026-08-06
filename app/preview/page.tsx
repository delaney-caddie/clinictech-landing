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
        clinicName={clinicName}
      />
      <main className="flex-1 overflow-auto pb-12">
        {view === "dashboard" ? (
          <ClinicDashboard activePage={activePage} clinicName={clinicName} />
        ) : (
          <PatientPortal activePage={activePage} clinicName={clinicName} />
        )}
      </main>

      {/* Caddie AI preview banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Preview</span>
              <span className="text-xs text-gray-500">|</span>
              <span className="text-xs text-gray-400">Powered by <span className="font-semibold text-white">Caddie AI</span></span>
            </div>
            <p className="text-[11px] text-gray-400 leading-snug max-w-2xl">
              This is a preview of what your custom platform could look like. Your brand colors, logo, and workflows are fully customizable - every feature can be tailored to how your clinic operates.
            </p>
          </div>
          <div className="flex items-center gap-2 ml-4 shrink-0">
            <a
              href="https://hirecaddie.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
            >
              Learn More
            </a>
            <a
              href="https://calendly.com/caddie-ai/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-500"
            >
              Book a Demo
            </a>
          </div>
        </div>
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
