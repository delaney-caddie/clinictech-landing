"use client";

import { useState } from "react";
import {
  Search, Plus, Globe, Eye, Mail, Phone, MoreHorizontal,
  Sparkles, RefreshCw, ExternalLink, CheckCircle2, Clock,
  AlertCircle, XCircle, Send, Target, Settings, Calendar,
  PhoneCall,
} from "lucide-react";

/* ─── Sample Data ─── */
const CLINICS = [
  { id: 1, name: "ResCore Stem Cell", website: "rescore.com", logo: "", primaryColor: "#1B6B4A", status: "preview_sent", previewSlug: "rescore", externalPreviewUrl: null, contactName: "Steve", contactEmail: "steve@rescore.com", contactPhone: "(555) 100-2000", location: "Austin, TX", services: ["Stem Cell Therapy", "PRP", "Exosomes"], scrapedAt: "Mar 20", previewAt: "Mar 20", emailedAt: "Mar 21", followUp1: null, followUp2: null, callFlag: false, meetingBooked: false, calledAt: null, notes: "Beta client. Warm lead. Preview sent via V0 mockup." },
  { id: 2, name: "BioXcellerator", website: "bioxcellerator.com", logo: "", primaryColor: "#0066CC", status: "preview_sent", previewSlug: "bioxcellerator", externalPreviewUrl: null, contactName: "Dr. Martinez", contactEmail: "info@bioxcellerator.com", contactPhone: "(555) 200-3000", location: "Medellin, CO", services: ["Stem Cell Therapy", "Anti-Aging"], scrapedAt: "Mar 19", previewAt: "Mar 19", emailedAt: "Mar 20", followUp1: null, followUp2: null, callFlag: false, meetingBooked: false, calledAt: null, notes: "Large operation, high value target." },
  { id: 3, name: "Dynamic Stem Cell Therapy", website: "dynamicstemcelltherapy.com", logo: "", primaryColor: "#8B2252", status: "meeting_booked", previewSlug: "dynamic-stem-cell", externalPreviewUrl: "https://v0.dev/chat/dynamic-stem-cell-preview", contactName: "Dr. Gaveck", contactEmail: "info@dynamicstemcelltherapy.com", contactPhone: null, location: "Las Vegas, NV", services: ["Stem Cell", "PRP", "Joint Therapy"], scrapedAt: "Mar 18", previewAt: "Mar 18", emailedAt: "Mar 19", followUp1: null, followUp2: null, callFlag: false, meetingBooked: true, calledAt: null, notes: "Meeting booked! Responded to initial preview email." },
  { id: 4, name: "Prodromos Stem Cell", website: "prodromosstemcell.com", logo: "", primaryColor: "#1a1a2e", status: "preview_sent", previewSlug: "prodromos", externalPreviewUrl: null, contactName: "Chloe", contactEmail: "contact@prodromos.com", contactPhone: "(555) 400-5000", location: "Chicago, IL", services: ["ACL Repair", "Stem Cell", "Sports Medicine"], scrapedAt: "Mar 15", previewAt: "Mar 15", emailedAt: "Mar 16", followUp1: null, followUp2: null, callFlag: false, meetingBooked: false, calledAt: null, notes: "Preview sent. Awaiting response." },
  { id: 5, name: "Pagdin Health", website: "pagdinhealth.com", logo: "", primaryColor: "#2E7D32", status: "meeting_booked", previewSlug: "pagdin-health", externalPreviewUrl: "https://v0.dev/chat/pagdin-health-preview", contactName: "Dr. Pagdin", contactEmail: "info@pagdinhealth.com", contactPhone: null, location: "Kelowna, BC", services: ["Regenerative Medicine", "IV Therapy", "Hormone Therapy"], scrapedAt: "Mar 17", previewAt: "Mar 17", emailedAt: "Mar 18", followUp1: null, followUp2: null, callFlag: false, meetingBooked: true, calledAt: null, notes: "Meeting booked! Very interested in the platform." },
  { id: 6, name: "Kopi Stem Cell", website: "kopistemcell.com", logo: "", primaryColor: "#D4A843", status: "preview_sent", previewSlug: "kopi-stem-cell", externalPreviewUrl: null, contactName: null, contactEmail: "info@kopistemcell.com", contactPhone: null, location: "Jakarta, ID", services: ["Stem Cell Therapy"], scrapedAt: "Mar 20", previewAt: "Mar 20", emailedAt: "Mar 21", followUp1: null, followUp2: null, callFlag: false, meetingBooked: false, calledAt: null, notes: "International clinic. Preview sent." },
  { id: 7, name: "ISSCA Member Clinic", website: "example-regen.com", logo: "", primaryColor: "#4A90D9", status: "preview_sent", previewSlug: "issca-member", externalPreviewUrl: null, contactName: "Dr. Kim", contactEmail: "drkim@example-regen.com", contactPhone: "(555) 700-8000", location: "Los Angeles, CA", services: ["Stem Cell", "Regenerative Medicine"], scrapedAt: "Mar 21", previewAt: "Mar 22", emailedAt: "Mar 22", followUp1: null, followUp2: null, callFlag: false, meetingBooked: false, calledAt: null, notes: "Preview sent same day as generation." },
];

type Clinic = (typeof CLINICS)[number];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ComponentType<{ size: number }> }> = {
  new:               { label: "New",              color: "#6B7280", bg: "#F3F4F6", icon: Plus },
  scraped:           { label: "Scraped",          color: "#8B5CF6", bg: "#F5F3FF", icon: Globe },
  preview_generated: { label: "Preview Ready",    color: "#2563EB", bg: "#EFF6FF", icon: Eye },
  preview_sent:      { label: "Preview Sent",     color: "#0891B2", bg: "#ECFEFF", icon: Send },
  emailed:           { label: "Emailed",          color: "#059669", bg: "#ECFDF5", icon: Mail },
  follow_up_1:       { label: "Follow-up 1",      color: "#D97706", bg: "#FFFBEB", icon: Clock },
  follow_up_2:       { label: "Follow-up 2",      color: "#EA580C", bg: "#FFF7ED", icon: AlertCircle },
  meeting_booked:    { label: "Meeting Booked",     color: "#7C3AED", bg: "#F5F3FF", icon: Calendar },
  called:            { label: "Called",             color: "#0EA5E9", bg: "#F0F9FF", icon: PhoneCall },
  call_flagged:      { label: "Call Flagged",       color: "#DC2626", bg: "#FEF2F2", icon: Phone },
  converted:         { label: "Converted",          color: "#16A34A", bg: "#F0FDF4", icon: CheckCircle2 },
  lost:              { label: "Lost",               color: "#9CA3AF", bg: "#F9FAFB", icon: XCircle },
};

const PIPELINE_ORDER = ["new","scraped","preview_generated","preview_sent","emailed","follow_up_1","follow_up_2","meeting_booked","called","call_flagged","converted","lost"];

/* ─── Styles ─── */
const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--font-dm-sans), 'DM Sans', system-ui, sans-serif; background: #F8FAFC; color: #0F172A; -webkit-font-smoothing: antialiased; }

  .admin { display: flex; min-height: 100vh; }

  /* Sidebar */
  .admin-sidebar { width: 240px; background: #0F172A; color: #E2E8F0; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; }
  .admin-sidebar-header { padding: 20px 16px; border-bottom: 1px solid #1E293B; }
  .admin-brand { font-family: var(--font-dm-serif), 'DM Serif Display', serif; font-size: 20px; font-style: italic; color: #F1F5F9; }
  .admin-brand-sub { font-size: 11px; color: #64748B; margin-top: 2px; letter-spacing: 0.5px; }
  .admin-nav { flex: 1; padding: 12px 8px; }
  .admin-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; color: #94A3B8; transition: all 0.15s; }
  .admin-nav-item:hover { background: #1E293B; color: #E2E8F0; }
  .admin-nav-item.active { background: #1E293B; color: #F1F5F9; }
  .admin-nav-count { margin-left: auto; background: #334155; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 8px; }
  .admin-sidebar-footer { padding: 16px; border-top: 1px solid #1E293B; }

  /* Main content */
  .admin-main { flex: 1; overflow-x: hidden; }
  .admin-topbar { display: flex; align-items: center; justify-content: space-between; padding: 16px 28px; background: #fff; border-bottom: 1px solid #E2E8F0; position: sticky; top: 0; z-index: 10; }
  .admin-topbar-left { display: flex; align-items: center; gap: 16px; }
  .admin-topbar-right { display: flex; align-items: center; gap: 10px; }
  .search-box { display: flex; align-items: center; gap: 8px; background: #F1F5F9; border: 1px solid #E2E8F0; border-radius: 8px; padding: 8px 14px; width: 300px; }
  .search-box input { border: none; background: transparent; font-size: 13px; font-family: var(--font-dm-sans), 'DM Sans', sans-serif; outline: none; flex: 1; color: #0F172A; }
  .search-box input::placeholder { color: #94A3B8; }

  /* Pipeline summary */
  .pipeline-bar { display: flex; gap: 6px; padding: 16px 28px; background: #fff; border-bottom: 1px solid #E2E8F0; overflow-x: auto; }
  .pipeline-chip { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; white-space: nowrap; border: 1px solid transparent; }
  .pipeline-chip:hover { opacity: 0.85; }
  .pipeline-chip.active { border-color: currentColor; box-shadow: 0 0 0 2px rgba(0,0,0,0.05); }

  /* Table */
  .admin-table-wrap { padding: 20px 28px; }
  .admin-table { width: 100%; background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; }
  .admin-table table { width: 100%; border-collapse: collapse; }
  .admin-table th { text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; }
  .admin-table td { padding: 14px 16px; font-size: 13px; border-bottom: 1px solid #F1F5F9; vertical-align: middle; }
  .admin-table tr:hover { background: #FAFBFD; }
  .admin-table tr:last-child td { border-bottom: none; }

  /* Status badge */
  .status-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; }

  /* Clinic row */
  .clinic-name { font-weight: 600; font-size: 14px; }
  .clinic-website { font-size: 12px; color: #64748B; display: flex; align-items: center; gap: 4px; }
  .clinic-location { font-size: 12px; color: #94A3B8; }
  .color-dot { width: 14px; height: 14px; border-radius: 4px; border: 1px solid rgba(0,0,0,0.1); }

  /* Action buttons */
  .action-btn { display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; border: 1px solid #E2E8F0; background: #fff; cursor: pointer; color: #475569; transition: all 0.15s; font-family: var(--font-dm-sans), 'DM Sans', sans-serif; }
  .action-btn:hover { background: #F1F5F9; border-color: #CBD5E1; }
  .action-btn.primary { background: #0F172A; color: #F1F5F9; border-color: #0F172A; }
  .action-btn.primary:hover { background: #1E293B; }
  .action-btn.danger { color: #DC2626; border-color: #FCA5A5; }
  .action-btn.danger:hover { background: #FEF2F2; }
  .action-btn.success { color: #059669; border-color: #6EE7B7; }
  .action-btn.success:hover { background: #ECFDF5; }

  /* Stats bar */
  .stats-bar { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; padding: 20px 28px; }
  .preview-links { display: flex; flex-direction: column; gap: 6px; }
  .preview-link-row { background: #F1F5F9; border-radius: 8px; padding: 8px 12px; font-size: 12px; display: flex; align-items: center; justify-content: space-between; }
  .preview-link-label { font-size: 10px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 2px; }
  .stat-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px; }
  .stat-label { font-size: 12px; font-weight: 500; color: #64748B; }
  .stat-value { font-size: 28px; font-weight: 700; margin-top: 2px; }
  .stat-sub { font-size: 11px; color: #94A3B8; margin-top: 4px; }

  /* Detail panel */
  .detail-panel { position: fixed; right: 0; top: 0; width: 420px; height: 100vh; background: #fff; border-left: 1px solid #E2E8F0; box-shadow: -4px 0 20px rgba(0,0,0,0.06); z-index: 50; overflow-y: auto; }
  .detail-header { padding: 20px; border-bottom: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-between; }
  .detail-body { padding: 20px; }
  .detail-section { margin-bottom: 20px; }
  .detail-section-title { font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
  .detail-field { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; border-bottom: 1px solid #F1F5F9; }
  .detail-field-label { color: #64748B; }
  .detail-field-value { font-weight: 500; }
  .detail-timeline { position: relative; padding-left: 20px; }
  .detail-timeline::before { content: ''; position: absolute; left: 5px; top: 4px; bottom: 4px; width: 2px; background: #E2E8F0; }
  .timeline-item { position: relative; padding: 6px 0; font-size: 12px; }
  .timeline-dot { position: absolute; left: -20px; top: 10px; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #E2E8F0; background: #fff; }
  .timeline-dot.done { background: #059669; border-color: #059669; }
  .timeline-dot.active { background: #2563EB; border-color: #2563EB; }
  .timeline-label { font-weight: 600; color: #0F172A; }
  .timeline-date { color: #94A3B8; }
  .detail-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #E2E8F0; }

  /* Overlay */
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.15); z-index: 40; }

  @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
  .detail-panel { animation: slideIn 0.2s ease-out; }
`;

/* ─── Components ─── */

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.new;
  const Icon = cfg.icon;
  return (
    <span className="status-badge" style={{ background: cfg.bg, color: cfg.color }}>
      <Icon size={12} />
      {cfg.label}
    </span>
  );
}

function DetailPanel({ clinic, onClose }: { clinic: Clinic; onClose: () => void }) {
  const timeline = [
    { label: "Added to pipeline", date: clinic.notes?.includes("A4M") ? "A4M directory" : "Manual", done: true },
    { label: "Website scraped", date: clinic.scrapedAt, done: !!clinic.scrapedAt },
    { label: "Preview generated", date: clinic.previewAt, done: !!clinic.previewAt },
    { label: "Preview sent", date: clinic.emailedAt, done: !!clinic.emailedAt },
    { label: "Follow-up 1", date: clinic.followUp1, done: !!clinic.followUp1 },
    { label: "Follow-up 2", date: clinic.followUp2, done: !!clinic.followUp2 },
    { label: "Meeting booked", date: clinic.meetingBooked ? "Yes" : null, done: clinic.meetingBooked },
    { label: "Called", date: clinic.calledAt, done: !!clinic.calledAt },
    { label: "Call flagged", date: clinic.callFlag ? "Yes" : null, done: clinic.callFlag },
  ];
  const currentIdx = timeline.findLastIndex(t => t.done);

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="detail-panel">
        <div className="detail-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="color-dot" style={{ background: clinic.primaryColor, width: 20, height: 20 }} />
              <span style={{ fontSize: 18, fontWeight: 700 }}>{clinic.name}</span>
            </div>
            <div className="clinic-website" style={{ marginTop: 4 }}>
              <Globe size={12} /> {clinic.website}
            </div>
          </div>
          <button className="action-btn" onClick={onClose}><XCircle size={14} /></button>
        </div>

        <div className="detail-body">
          <div className="detail-section">
            <div className="detail-section-title">Status</div>
            <StatusBadge status={clinic.status} />
          </div>

          <div className="detail-section">
            <div className="detail-section-title">Contact</div>
            <div className="detail-field"><span className="detail-field-label">Name</span><span className="detail-field-value">{clinic.contactName || "Unknown"}</span></div>
            <div className="detail-field"><span className="detail-field-label">Email</span><span className="detail-field-value">{clinic.contactEmail || "Unknown"}</span></div>
            <div className="detail-field"><span className="detail-field-label">Phone</span><span className="detail-field-value">{clinic.contactPhone || "Unknown"}</span></div>
            <div className="detail-field"><span className="detail-field-label">Location</span><span className="detail-field-value">{clinic.location}</span></div>
          </div>

          <div className="detail-section">
            <div className="detail-section-title">Brand</div>
            <div className="detail-field">
              <span className="detail-field-label">Primary Color</span>
              <span className="detail-field-value" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div className="color-dot" style={{ background: clinic.primaryColor }} />
                {clinic.primaryColor}
              </span>
            </div>
            <div className="detail-field"><span className="detail-field-label">Services</span><span className="detail-field-value">{clinic.services.length > 0 ? clinic.services.join(", ") : "Not scraped"}</span></div>
          </div>

          {(clinic.previewSlug || clinic.externalPreviewUrl) && (
            <div className="detail-section">
              <div className="detail-section-title">Preview Links</div>
              <div className="preview-links">
                {clinic.previewSlug && (
                  <div className="preview-link-row">
                    <div>
                      <div className="preview-link-label">ClinicTech Preview</div>
                      <code style={{ color: "#0F172A", fontSize: 12 }}>clinictech.io/preview/{clinic.previewSlug}</code>
                    </div>
                    <ExternalLink size={14} style={{ color: "#64748B", cursor: "pointer" }} />
                  </div>
                )}
                {clinic.externalPreviewUrl && (
                  <div className="preview-link-row">
                    <div>
                      <div className="preview-link-label">External Mockup</div>
                      <code style={{ color: "#0F172A", fontSize: 12 }}>{clinic.externalPreviewUrl.replace(/https?:\/\//, "").slice(0, 40)}...</code>
                    </div>
                    <ExternalLink size={14} style={{ color: "#64748B", cursor: "pointer" }} />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="detail-section">
            <div className="detail-section-title">Pipeline Timeline</div>
            <div className="detail-timeline">
              {timeline.map((t, i) => (
                <div key={i} className="timeline-item">
                  <div className={`timeline-dot ${t.done ? (i === currentIdx ? "active" : "done") : ""}`} />
                  <span className="timeline-label">{t.label}</span>
                  {t.date && <span className="timeline-date"> &mdash; {t.date}</span>}
                </div>
              ))}
            </div>
          </div>

          {clinic.notes && (
            <div className="detail-section">
              <div className="detail-section-title">Notes</div>
              <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{clinic.notes}</p>
            </div>
          )}

          <div className="detail-actions">
            {!clinic.scrapedAt && <button className="action-btn primary"><Globe size={12} /> Scrape Website</button>}
            {clinic.scrapedAt && !clinic.previewAt && <button className="action-btn primary"><Eye size={12} /> Generate Preview</button>}
            {clinic.previewAt && !clinic.emailedAt && <button className="action-btn primary"><Send size={12} /> Send Preview Email</button>}
            {clinic.emailedAt && !clinic.callFlag && <button className="action-btn danger"><Phone size={12} /> Flag for Call</button>}
            {clinic.previewSlug && <button className="action-btn"><ExternalLink size={12} /> View Preview</button>}
            <button className="action-btn"><Mail size={12} /> Send Email</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Main Admin Panel ─── */
export default function AdminPanel() {
  const [clinics] = useState(CLINICS);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activePage, setActivePage] = useState("pipeline");

  const filtered = clinics
    .filter(c => filterStatus === "all" || c.status === filterStatus)
    .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.website.toLowerCase().includes(searchTerm.toLowerCase()));

  const statusCounts: Record<string, number> = {};
  clinics.forEach(c => { statusCounts[c.status] = (statusCounts[c.status] || 0) + 1; });

  const navItems = [
    { id: "pipeline", label: "Pipeline", icon: Target, count: clinics.length },
    { id: "previews", label: "Previews", icon: Eye, count: clinics.filter(c => c.previewSlug).length },
    { id: "outreach", label: "Outreach", icon: Send, count: clinics.filter(c => c.emailedAt).length },
    { id: "meetings", label: "Meetings", icon: Calendar, count: clinics.filter(c => c.meetingBooked).length },
    { id: "calls", label: "Call Queue", icon: Phone, count: clinics.filter(c => c.callFlag).length },
    { id: "called", label: "Called", icon: PhoneCall, count: clinics.filter(c => c.calledAt).length },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="admin">
        <div className="admin-sidebar">
          <div className="admin-sidebar-header">
            <div className="admin-brand">ClinicTech</div>
            <div className="admin-brand-sub">OUTBOUND ENGINE</div>
          </div>
          <div className="admin-nav">
            {navItems.map(item => (
              <div
                key={item.id}
                className={`admin-nav-item ${activePage === item.id ? "active" : ""}`}
                onClick={() => setActivePage(item.id)}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
                {item.count !== undefined && <span className="admin-nav-count">{item.count}</span>}
              </div>
            ))}
          </div>
          <div className="admin-sidebar-footer">
            <div style={{ fontSize: 11, color: "#64748B" }}>Agent Status</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} />
              <span style={{ fontSize: 12, color: "#94A3B8" }}>Ready to run</span>
            </div>
            <button
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" });
                window.location.href = "/admin/login";
              }}
              style={{
                marginTop: 12, width: "100%", padding: "8px 0",
                background: "transparent", border: "1px solid #334155",
                borderRadius: 8, color: "#94A3B8", fontSize: 12,
                cursor: "pointer", fontWeight: 600,
              }}
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="admin-main">
          <div className="admin-topbar">
            <div className="admin-topbar-left">
              <h1 style={{ fontSize: 18, fontWeight: 700 }}>
                {activePage === "pipeline" && "Clinic Pipeline"}
                {activePage === "previews" && "Preview Manager"}
                {activePage === "outreach" && "Outreach Tracker"}
                {activePage === "meetings" && "Meetings Booked"}
                {activePage === "calls" && "Call Queue"}
                {activePage === "called" && "Called"}
                {activePage === "settings" && "Settings"}
              </h1>
              <div className="search-box">
                <Search size={14} style={{ color: "#94A3B8" }} />
                <input
                  placeholder="Search clinics..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="admin-topbar-right">
              <button className="action-btn"><RefreshCw size={12} /> Run Agent</button>
              <button className="action-btn primary"><Plus size={12} /> Add Clinic</button>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-bar">
            <div className="stat-card">
              <div className="stat-label">Total Clinics</div>
              <div className="stat-value">{clinics.length}</div>
              <div className="stat-sub">In pipeline</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Previews Generated</div>
              <div className="stat-value">{clinics.filter(c => c.previewSlug).length}</div>
              <div className="stat-sub">{clinics.filter(c => c.previewSlug && !c.emailedAt).length} pending send</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Emails Sent</div>
              <div className="stat-value">{clinics.filter(c => c.emailedAt).length}</div>
              <div className="stat-sub">This month</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Meetings Booked</div>
              <div className="stat-value" style={{ color: "#7C3AED" }}>{clinics.filter(c => c.meetingBooked).length}</div>
              <div className="stat-sub">From outreach</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Conversion</div>
              <div className="stat-value" style={{ color: "#059669" }}>{clinics.filter(c => c.status === "converted").length}</div>
              <div className="stat-sub">Customers</div>
            </div>
          </div>

          {/* Pipeline filter chips */}
          <div className="pipeline-bar">
            <div
              className={`pipeline-chip ${filterStatus === "all" ? "active" : ""}`}
              style={{ background: "#F1F5F9", color: "#475569" }}
              onClick={() => setFilterStatus("all")}
            >
              All ({clinics.length})
            </div>
            {PIPELINE_ORDER.filter(s => statusCounts[s]).map(s => {
              const cfg = STATUS_CONFIG[s];
              return (
                <div
                  key={s}
                  className={`pipeline-chip ${filterStatus === s ? "active" : ""}`}
                  style={{ background: cfg.bg, color: cfg.color }}
                  onClick={() => setFilterStatus(s)}
                >
                  {cfg.label} ({statusCounts[s]})
                </div>
              );
            })}
          </div>

          {/* Table */}
          <div className="admin-table-wrap">
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Clinic</th>
                    <th>Status</th>
                    <th>Brand</th>
                    <th>Contact</th>
                    <th>Preview</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(clinic => (
                    <tr key={clinic.id} style={{ cursor: "pointer" }} onClick={() => setSelectedClinic(clinic)}>
                      <td>
                        <div className="clinic-name">{clinic.name}</div>
                        <div className="clinic-website"><Globe size={11} /> {clinic.website}</div>
                        <div className="clinic-location">{clinic.location}</div>
                      </td>
                      <td><StatusBadge status={clinic.status} /></td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div className="color-dot" style={{ background: clinic.primaryColor }} />
                          <span style={{ fontSize: 12, color: "#64748B" }}>{clinic.primaryColor}</span>
                        </div>
                      </td>
                      <td>
                        {clinic.contactName ? (
                          <div>
                            <div style={{ fontWeight: 500 }}>{clinic.contactName}</div>
                            <div style={{ fontSize: 12, color: "#94A3B8" }}>{clinic.contactEmail}</div>
                          </div>
                        ) : (
                          <span style={{ color: "#CBD5E1", fontSize: 12 }}>Not found</span>
                        )}
                      </td>
                      <td>
                        {clinic.previewSlug ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <code style={{ fontSize: 11, background: "#F1F5F9", padding: "2px 6px", borderRadius: 4 }}>/{clinic.previewSlug}</code>
                            <ExternalLink size={12} style={{ color: "#64748B" }} />
                          </div>
                        ) : (
                          <span style={{ color: "#CBD5E1", fontSize: 12 }}>Not generated</span>
                        )}
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", gap: 4 }}>
                          {!clinic.scrapedAt && <button className="action-btn" title="Scrape"><Globe size={12} /></button>}
                          {clinic.scrapedAt && !clinic.previewAt && <button className="action-btn" title="Generate preview"><Eye size={12} /></button>}
                          {clinic.previewAt && !clinic.emailedAt && <button className="action-btn" title="Send email"><Send size={12} /></button>}
                          {clinic.callFlag && <button className="action-btn danger" title="Call"><Phone size={12} /></button>}
                          <button className="action-btn" title="More"><MoreHorizontal size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selectedClinic && <DetailPanel clinic={selectedClinic} onClose={() => setSelectedClinic(null)} />}
    </>
  );
}
