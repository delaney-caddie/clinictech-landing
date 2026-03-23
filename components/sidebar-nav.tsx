"use client"

import {
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  FileText,
  MessageSquare,
  Calendar,
  FileBarChart,
  Settings,
  Building2,
  User,
  Home,
  Heart,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Inbox,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SidebarNavProps {
  view: "dashboard" | "portal"
  onViewChange: (view: "dashboard" | "portal") => void
  activePage: string
  onPageChange: (page: string) => void
  clinicName?: string
  logoUrl?: string | null
}

const dashboardNavItems = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "inbox", label: "Inbox", icon: Inbox, badge: 5 },
  { id: "leads", label: "Leads", icon: Users },
  { id: "patients", label: "Patients", icon: UserCheck },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "knowledge", label: "Knowledge Base", icon: BookOpen },
  { id: "case-studies", label: "Case Studies", icon: FileBarChart },
  { id: "insights", label: "Insights", icon: Sparkles },
  { id: "settings", label: "Settings", icon: Settings },
]

const portalNavItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "knowledge", label: "Knowledge Base", icon: BookOpen },
  { id: "documents", label: "My Documents", icon: FileText },
  { id: "results", label: "Treatment Tracker", icon: Heart },
  { id: "messages", label: "Messages", icon: MessageSquare, badge: 1 },
  { id: "appointments", label: "Appointments", icon: Calendar },
]

export function SidebarNav({ view, onViewChange, activePage, onPageChange, clinicName, logoUrl }: SidebarNavProps) {
  const [collapsed, setCollapsed] = useState(false)
  const navItems = view === "dashboard" ? dashboardNavItems : portalNavItems

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-3">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center w-full")}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={clinicName || "Clinic"}
              style={{ width: collapsed ? 32 : 140, height: "auto", maxHeight: 40 }}
              className="shrink-0 object-contain"
            />
          ) : collapsed ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-sm font-bold shrink-0">
              {(clinicName || "CT").charAt(0)}
            </div>
          ) : (
            <span className="text-base font-bold text-sidebar-foreground truncate">
              {clinicName || "ClinicTech"}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "h-7 w-7 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "absolute -right-3 top-6 rounded-full bg-sidebar border border-sidebar-border shadow-sm"
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* View Switcher */}
      <div className={cn("p-3", collapsed && "px-2")}>
        <div className={cn("flex rounded-lg bg-sidebar-accent p-1", collapsed ? "flex-col gap-1" : "gap-1")}>
          <button
            onClick={() => onViewChange("dashboard")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
              collapsed ? "w-full" : "flex-1",
              view === "dashboard"
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/80"
            )}
            title={collapsed ? "Clinic Dashboard" : undefined}
          >
            <Building2 className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Admin</span>}
          </button>
          <button
            onClick={() => onViewChange("portal")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
              collapsed ? "w-full" : "flex-1",
              view === "portal"
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/80"
            )}
            title={collapsed ? "Patient Portal" : undefined}
          >
            <User className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Patient</span>}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onPageChange(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  collapsed && "justify-center px-2",
                  activePage === item.id
                    ? "bg-sidebar-accent text-sidebar-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary px-1.5 text-xs text-sidebar-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && item.badge && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-sidebar-primary text-[10px] text-sidebar-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className="border-t border-sidebar-border p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2",
            collapsed && "justify-center px-0"
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
            {view === "dashboard" ? "CT" : "JM"}
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {view === "dashboard" ? `${clinicName || "Clinic"} Admin` : "Jennifer M."}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/60">
                {view === "dashboard" ? "admin@clinic.com" : "patient@example.com"}
              </p>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  )
}
