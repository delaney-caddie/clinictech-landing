"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, Plus, Globe, Eye, Mail, Phone, MoreHorizontal,
  RefreshCw, ExternalLink, CheckCircle2, Clock,
  AlertCircle, XCircle, Send, Target, Settings, Calendar,
  PhoneCall, BarChart3, Loader2, MapPin, Star, ChevronDown, Users,
} from "lucide-react";

/* ─── Types ─── */

interface Clinic {
  id: string;
  name: string;
  slug: string;
  website: string;
  logo_url: string | null;
  primary_color: string | null;
  services: string[] | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  location: string | null;
  status: string;
  source: string | null;
  scraped_at: string | null;
  scraped_data: any;
  preview_sent_at: string | null;
  emailed_at: string | null;
  follow_up_1_at: string | null;
  follow_up_2_at: string | null;
  call_flagged_at: string | null;
  created_at: string;
  updated_at: string | null;
}

interface DiscoveredClinic {
  name: string;
  address: string;
  website: string | null;
  phone: string | null;
  rating: number | null;
  totalRatings: number | null;
  placeId: string;
  types: string[];
}

interface AnalyticsData {
  total_views: number;
  unique_visitors: number;
  clinics: {
    clinic_id: string;
    slug: string;
    total_views: number;
    unique_visitors: number;
    last_viewed: string;
  }[];
  message?: string;
}

interface Draft {
  subject: string;
  body: string;
  to: string;
}

/* ─── Constants ─── */

type StatusConfigEntry = { label: string; color: string; bg: string; icon: React.ComponentType<{ size: number }> };

const STATUS_CONFIG: Record<string, StatusConfigEntry> = {
  new:               { label: "New",              color: "#6B7280", bg: "#F3F4F6", icon: Plus },
  scraped:           { label: "Scraped",          color: "#8B5CF6", bg: "#F5F3FF", icon: Globe },
  preview_generated: { label: "Preview Ready",    color: "#2563EB", bg: "#EFF6FF", icon: Eye },
  preview_sent:      { label: "Preview Sent",     color: "#0891B2", bg: "#ECFEFF", icon: Send },
  emailed:           { label: "Emailed",          color: "#059669", bg: "#ECFDF5", icon: Mail },
  follow_up_1:       { label: "Follow-up 1",      color: "#D97706", bg: "#FFFBEB", icon: Clock },
  follow_up_2:       { label: "Follow-up 2",      color: "#EA580C", bg: "#FFF7ED", icon: AlertCircle },
  meeting_booked:    { label: "Meeting Booked",   color: "#7C3AED", bg: "#F5F3FF", icon: Calendar },
  called:            { label: "Called",            color: "#0EA5E9", bg: "#F0F9FF", icon: PhoneCall },
  call_flagged:      { label: "Call Flagged",      color: "#DC2626", bg: "#FEF2F2", icon: Phone },
  converted:         { label: "Converted",         color: "#16A34A", bg: "#F0FDF4", icon: CheckCircle2 },
  lost:              { label: "Lost",              color: "#9CA3AF", bg: "#F9FAFB", icon: XCircle },
};

const PIPELINE_STATUSES = [
  "preview_sent", "emailed", "follow_up_1", "follow_up_2",
  "meeting_booked", "called", "call_flagged", "converted", "lost",
];

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

  /* Pipeline chips */
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
  .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .action-btn.primary { background: #0F172A; color: #F1F5F9; border-color: #0F172A; }
  .action-btn.primary:hover { background: #1E293B; }
  .action-btn.danger { color: #DC2626; border-color: #FCA5A5; }
  .action-btn.danger:hover { background: #FEF2F2; }
  .action-btn.success { color: #059669; border-color: #6EE7B7; }
  .action-btn.success:hover { background: #ECFDF5; }

  /* Stats bar */
  .stats-bar { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; padding: 20px 28px; }
  .stat-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px; }
  .stat-label { font-size: 12px; font-weight: 500; color: #64748B; }
  .stat-value { font-size: 28px; font-weight: 700; margin-top: 2px; }
  .stat-sub { font-size: 11px; color: #94A3B8; margin-top: 4px; }

  /* Detail panel */
  .detail-panel { position: fixed; right: 0; top: 0; width: 420px; height: 100vh; background: #fff; border-left: 1px solid #E2E8F0; box-shadow: -4px 0 20px rgba(0,0,0,0.06); z-index: 50; overflow-y: auto; animation: slideIn 0.2s ease-out; }
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
  .preview-links { display: flex; flex-direction: column; gap: 6px; }
  .preview-link-row { background: #F1F5F9; border-radius: 8px; padding: 8px 12px; font-size: 12px; display: flex; align-items: center; justify-content: space-between; }
  .preview-link-label { font-size: 10px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 2px; }

  /* Overlay */
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.15); z-index: 40; }
  @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

  /* Discover tab */
  .discover-search { display: flex; gap: 12px; padding: 28px; }
  .discover-input { flex: 1; padding: 14px 18px; font-size: 15px; border: 2px solid #E2E8F0; border-radius: 10px; font-family: var(--font-dm-sans), 'DM Sans', sans-serif; outline: none; transition: border-color 0.15s; }
  .discover-input:focus { border-color: #0F172A; }
  .discover-results { padding: 0 28px 28px; }
  .discover-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px 16px; margin-bottom: 8px; display: flex; align-items: center; gap: 14px; cursor: pointer; transition: all 0.15s; }
  .discover-card:hover { border-color: #CBD5E1; background: #FAFBFD; }
  .discover-card.selected { border-color: #0F172A; background: #F8FAFC; }
  .discover-check { width: 20px; height: 20px; border: 2px solid #CBD5E1; border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .discover-check.checked { background: #0F172A; border-color: #0F172A; color: #fff; }
  .discover-info { flex: 1; min-width: 0; }
  .discover-name { font-weight: 600; font-size: 14px; }
  .discover-address { font-size: 12px; color: #64748B; margin-top: 2px; }
  .discover-meta { display: flex; gap: 12px; margin-top: 4px; font-size: 11px; color: #94A3B8; }

  /* Draft preview */
  .draft-preview { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px; margin-top: 12px; }
  .draft-subject { font-weight: 600; font-size: 14px; margin-bottom: 8px; }
  .draft-to { font-size: 12px; color: #64748B; margin-bottom: 12px; }
  .draft-body { font-size: 13px; line-height: 1.6; color: #475569; white-space: pre-wrap; }

  /* Loading */
  .loading-center { display: flex; align-items: center; justify-content: center; padding: 60px; color: #94A3B8; gap: 10px; font-size: 14px; }
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  /* Empty state */
  .empty-state { text-align: center; padding: 60px 28px; color: #94A3B8; }
  .empty-state-title { font-size: 16px; font-weight: 600; color: #64748B; margin-bottom: 6px; }
  .empty-state-sub { font-size: 13px; }

  /* Checkbox */
  .cb { width: 16px; height: 16px; border: 2px solid #CBD5E1; border-radius: 3px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.1s; }
  .cb.checked { background: #0F172A; border-color: #0F172A; }

  /* Status dropdown */
  .status-dropdown { position: relative; }
  .status-menu { position: absolute; top: 100%; left: 0; background: #fff; border: 1px solid #E2E8F0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); z-index: 30; min-width: 180px; padding: 4px; }
  .status-menu-item { padding: 8px 12px; font-size: 12px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px; }
  .status-menu-item:hover { background: #F1F5F9; }

  /* Bulk bar */
  .bulk-bar { display: flex; align-items: center; gap: 12px; padding: 12px 28px; background: #0F172A; color: #F1F5F9; font-size: 13px; }
`;

/* ─── Helper Components ─── */

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

function formatDate(d: string | null): string {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function DetailPanel({ clinic, onClose, onStatusChange, onEnrich, onClearLogo, onRescrape }: { clinic: Clinic; onClose: () => void; onStatusChange: (id: string, status: string) => void; onEnrich: (id: string) => void; onClearLogo: (id: string) => void; onRescrape: (id: string) => void }) {
  const [statusOpen, setStatusOpen] = useState(false);

  const timeline = [
    { label: "Added to pipeline", date: formatDate(clinic.created_at), done: true },
    { label: "Website scraped", date: formatDate(clinic.scraped_at), done: !!clinic.scraped_at },
    { label: "Preview sent", date: formatDate(clinic.preview_sent_at), done: !!clinic.preview_sent_at },
    { label: "Emailed", date: formatDate(clinic.emailed_at), done: !!clinic.emailed_at },
    { label: "Follow-up 1", date: formatDate(clinic.follow_up_1_at), done: !!clinic.follow_up_1_at },
    { label: "Follow-up 2", date: formatDate(clinic.follow_up_2_at), done: !!clinic.follow_up_2_at },
    { label: "Call flagged", date: formatDate(clinic.call_flagged_at), done: !!clinic.call_flagged_at },
  ];
  const currentIdx = timeline.findLastIndex((t) => t.done);

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="detail-panel">
        <div className="detail-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {clinic.primary_color && (
                <div className="color-dot" style={{ background: clinic.primary_color, width: 20, height: 20 }} />
              )}
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
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <StatusBadge status={clinic.status} />
              <div className="status-dropdown">
                <button className="action-btn" onClick={() => setStatusOpen(!statusOpen)}>
                  <ChevronDown size={12} /> Change
                </button>
                {statusOpen && (
                  <div className="status-menu">
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                      <div
                        key={key}
                        className="status-menu-item"
                        onClick={() => {
                          onStatusChange(clinic.id, key);
                          setStatusOpen(false);
                        }}
                      >
                        <span className="status-badge" style={{ background: cfg.bg, color: cfg.color, padding: "2px 6px", fontSize: 10 }}>
                          {cfg.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-section-title">Contact</div>
            <div className="detail-field"><span className="detail-field-label">Name</span><span className="detail-field-value">{clinic.contact_name || "Unknown"}</span></div>
            <div className="detail-field"><span className="detail-field-label">Email</span><span className="detail-field-value">{clinic.contact_email || "Unknown"}</span></div>
            <div className="detail-field"><span className="detail-field-label">Phone</span><span className="detail-field-value">{clinic.contact_phone || "Unknown"}</span></div>
            <div className="detail-field"><span className="detail-field-label">Location</span><span className="detail-field-value">{clinic.location || "Unknown"}</span></div>
          </div>

          <div className="detail-section">
            <div className="detail-section-title">Brand</div>
            {clinic.primary_color && (
              <div className="detail-field">
                <span className="detail-field-label">Primary Color</span>
                <span className="detail-field-value" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div className="color-dot" style={{ background: clinic.primary_color }} />
                  {clinic.primary_color}
                </span>
              </div>
            )}
            <div className="detail-field">
              <span className="detail-field-label">Services</span>
              <span className="detail-field-value">{clinic.services && clinic.services.length > 0 ? clinic.services.join(", ") : "Not scraped"}</span>
            </div>
          </div>

          {clinic.slug && (
            <div className="detail-section">
              <div className="detail-section-title">Preview</div>
              <div className="preview-links">
                <div className="preview-link-row">
                  <div>
                    <div className="preview-link-label">Preview URL</div>
                    <code style={{ color: "#0F172A", fontSize: 12 }}>/preview/{clinic.slug}</code>
                  </div>
                  <a href={`/preview/${clinic.slug}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={14} style={{ color: "#64748B", cursor: "pointer" }} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {clinic.scraped_data?.draft && (
            <div className="detail-section">
              <div className="detail-section-title">Email Draft</div>
              <div className="draft-preview">
                <div className="draft-to">To: {clinic.scraped_data.draft.to}</div>
                <div className="draft-subject">Subject: {clinic.scraped_data.draft.subject}</div>
                <div className="draft-body">{clinic.scraped_data.draft.body}</div>
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
                  {t.date !== "-" && <span className="timeline-date"> &mdash; {t.date}</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="detail-actions">
            {clinic.status === "new" && (
              <button className="action-btn primary" onClick={() => onStatusChange(clinic.id, "scraped")}>
                <Globe size={12} /> Generate Preview
              </button>
            )}
            <button className="action-btn" onClick={() => onRescrape(clinic.id)}>
              <RefreshCw size={12} /> Re-scrape
            </button>
            {clinic.logo_url && (
              <button className="action-btn" onClick={() => onClearLogo(clinic.id)} style={{ color: "#DC2626", borderColor: "#FCA5A5" }}>
                <XCircle size={12} /> Use Text Logo
              </button>
            )}
            {(clinic.status === "scraped" || clinic.status === "preview_generated") && (
              <button className="action-btn primary" onClick={() => onStatusChange(clinic.id, "preview_sent")}>
                <Send size={12} /> Mark Sent
              </button>
            )}
            <button
              className="action-btn"
              onClick={() => onEnrich(clinic.id)}
              style={{ color: "#7C3AED", borderColor: "#C4B5FD" }}
            >
              <Users size={12} /> {clinic.contact_name ? "Re-Enrich" : "Enrich Contact"}
            </button>
            <a href={`https://${clinic.website}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button className="action-btn"><Globe size={12} /> Open Website</button>
            </a>
            {clinic.slug && (
              <a href={`/preview/${clinic.slug}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <button className="action-btn"><ExternalLink size={12} /> View Preview</button>
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Tab Components ─── */

function DiscoverTab({ onRefresh }: { onRefresh: () => void }) {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DiscoveredClinic[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [adding, setAdding] = useState(false);
  const [addedCount, setAddedCount] = useState<number | null>(null);

  async function handleDiscover() {
    if (!location.trim()) return;
    setLoading(true);
    setResults([]);
    setSelected(new Set());
    setAddedCount(null);
    try {
      const res = await fetch("/api/admin/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: location.trim() }),
      });
      const data = await res.json();
      setResults(data.clinics || []);
    } catch {
      // handle error silently
    }
    setLoading(false);
  }

  function toggleSelect(placeId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(placeId)) next.delete(placeId);
      else next.add(placeId);
      return next;
    });
  }

  function selectAll() {
    if (selected.size === results.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(results.map((r) => r.placeId)));
    }
  }

  async function handleAdd() {
    setAdding(true);
    try {
      const res = await fetch("/api/admin/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: location.trim(), save: true }),
      });
      const data = await res.json();
      setAddedCount(data.added || 0);
      onRefresh();
    } catch {
      // handle error silently
    }
    setAdding(false);
  }

  return (
    <>
      <div className="discover-search">
        <input
          className="discover-input"
          placeholder="Enter a city to find clinics... (e.g. Austin, TX)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleDiscover()}
        />
        <button className="action-btn primary" style={{ padding: "12px 24px", fontSize: 14 }} onClick={handleDiscover} disabled={loading || !location.trim()}>
          {loading ? <><Loader2 size={14} className="spin" /> Searching...</> : <><Search size={14} /> Discover</>}
        </button>
      </div>

      {loading && (
        <div className="loading-center">
          <Loader2 size={20} className="spin" />
          Searching Google Places...
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="discover-results">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{results.length} clinics found</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="action-btn" onClick={selectAll}>
                {selected.size === results.length ? "Deselect All" : "Select All"}
              </button>
              {selected.size > 0 && (
                <button className="action-btn primary" onClick={handleAdd} disabled={adding}>
                  {adding ? <><Loader2 size={12} className="spin" /> Adding...</> : <><Plus size={12} /> Add {selected.size} to Pipeline</>}
                </button>
              )}
              {selected.size === 0 && (
                <button className="action-btn primary" onClick={handleAdd} disabled={adding}>
                  {adding ? <><Loader2 size={12} className="spin" /> Adding...</> : <><Plus size={12} /> Add All to Pipeline</>}
                </button>
              )}
            </div>
          </div>

          {addedCount !== null && (
            <div style={{ padding: "10px 14px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, marginBottom: 12, fontSize: 13, color: "#166534" }}>
              Added {addedCount} new clinics to the pipeline.
            </div>
          )}

          {results.map((r) => (
            <div key={r.placeId} className={`discover-card ${selected.has(r.placeId) ? "selected" : ""}`} onClick={() => toggleSelect(r.placeId)}>
              <div className={`discover-check ${selected.has(r.placeId) ? "checked" : ""}`}>
                {selected.has(r.placeId) && <CheckCircle2 size={14} />}
              </div>
              <div className="discover-info">
                <div className="discover-name">{r.name}</div>
                <div className="discover-address"><MapPin size={11} /> {r.address}</div>
                <div className="discover-meta">
                  {r.website && <span><Globe size={10} /> {r.website.replace(/https?:\/\/(www\.)?/, "").split("/")[0]}</span>}
                  {r.phone && <span><Phone size={10} /> {r.phone}</span>}
                  {r.rating && <span><Star size={10} /> {r.rating}/5 ({r.totalRatings})</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && !addedCount && (
        <div className="empty-state">
          <Search size={40} style={{ color: "#CBD5E1", marginBottom: 12 }} />
          <div className="empty-state-title">Discover new clinics</div>
          <div className="empty-state-sub">Enter a city name above to search Google Places for stem cell and regenerative medicine clinics.</div>
        </div>
      )}
    </>
  );
}

function ClinicTable({
  clinics,
  onSelect,
  selectedIds,
  onToggleSelect,
  showCheckboxes,
  actions,
}: {
  clinics: Clinic[];
  onSelect: (c: Clinic) => void;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  showCheckboxes?: boolean;
  actions?: (clinic: Clinic) => React.ReactNode;
}) {
  return (
    <div className="admin-table-wrap">
      <div className="admin-table">
        <table>
          <thead>
            <tr>
              {showCheckboxes && <th style={{ width: 40 }}></th>}
              <th>Clinic</th>
              <th>Status</th>
              <th>Contact</th>
              <th>Source</th>
              <th>Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clinics.map((clinic) => (
              <tr key={clinic.id} style={{ cursor: "pointer" }} onClick={() => onSelect(clinic)}>
                {showCheckboxes && (
                  <td onClick={(e) => e.stopPropagation()}>
                    <div
                      className={`cb ${selectedIds?.has(clinic.id) ? "checked" : ""}`}
                      onClick={() => onToggleSelect?.(clinic.id)}
                    >
                      {selectedIds?.has(clinic.id) && <CheckCircle2 size={10} color="#fff" />}
                    </div>
                  </td>
                )}
                <td>
                  <div className="clinic-name">{clinic.name}</div>
                  <div className="clinic-website"><Globe size={11} /> {clinic.website}</div>
                  {clinic.location && <div className="clinic-location">{clinic.location}</div>}
                </td>
                <td><StatusBadge status={clinic.status} /></td>
                <td>
                  {clinic.contact_name ? (
                    <div>
                      <div style={{ fontWeight: 500 }}>{clinic.contact_name}</div>
                      <div style={{ fontSize: 12, color: "#94A3B8" }}>{clinic.contact_email}</div>
                    </div>
                  ) : (
                    <span style={{ color: "#CBD5E1", fontSize: 12 }}>Not found</span>
                  )}
                </td>
                <td><span style={{ fontSize: 12, color: "#64748B" }}>{clinic.source || "-"}</span></td>
                <td><span style={{ fontSize: 12, color: "#64748B" }}>{formatDate(clinic.created_at)}</span></td>
                <td onClick={(e) => e.stopPropagation()}>
                  {actions ? actions(clinic) : (
                    <button className="action-btn" title="More"><MoreHorizontal size={12} /></button>
                  )}
                </td>
              </tr>
            ))}
            {clinics.length === 0 && (
              <tr>
                <td colSpan={showCheckboxes ? 8 : 7} style={{ textAlign: "center", padding: 40, color: "#94A3B8" }}>
                  No clinics in this view
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ total_views: 0, unique_visitors: 0, clinics: [], message: "Failed to load" }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-center"><Loader2 size={20} className="spin" /> Loading analytics...</div>;
  }

  if (!data || data.total_views === 0) {
    return (
      <div className="empty-state">
        <BarChart3 size={40} style={{ color: "#CBD5E1", marginBottom: 12 }} />
        <div className="empty-state-title">No analytics data yet</div>
        <div className="empty-state-sub">{data?.message || "Preview view tracking will appear here once clinics start viewing their previews."}</div>
      </div>
    );
  }

  return (
    <>
      <div className="stats-bar" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="stat-card">
          <div className="stat-label">Total Views</div>
          <div className="stat-value">{data.total_views}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Unique Visitors</div>
          <div className="stat-value">{data.unique_visitors}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Clinics Tracked</div>
          <div className="stat-value">{data.clinics.length}</div>
        </div>
      </div>
      <div className="admin-table-wrap">
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Clinic</th>
                <th>Total Views</th>
                <th>Unique Visitors</th>
                <th>Last Viewed</th>
              </tr>
            </thead>
            <tbody>
              {data.clinics.map((c) => (
                <tr key={c.clinic_id}>
                  <td style={{ fontWeight: 600 }}>{c.slug}</td>
                  <td>{c.total_views}</td>
                  <td>{c.unique_visitors}</td>
                  <td style={{ fontSize: 12, color: "#64748B" }}>{formatDate(c.last_viewed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ─── Main Admin Panel ─── */

export default function AdminPanel() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activePage, setActivePage] = useState("discover");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [draftPreviews, setDraftPreviews] = useState<Record<string, Draft>>({});

  const fetchClinics = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/clinics");
      const data = await res.json();
      setClinics(data.clinics || []);
    } catch {
      // handle silently
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchClinics();
  }, [fetchClinics]);

  // Filter helpers
  const filtered = clinics.filter(
    (c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.website.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const newClinics = filtered.filter((c) => c.status === "new");
  const previewClinics = filtered.filter((c) => c.status === "scraped" || c.status === "preview_generated");
  const outreachClinics = filtered.filter((c) => c.scraped_data?.draft);
  const pipelineClinics = filtered.filter((c) => PIPELINE_STATUSES.includes(c.status));

  // Counts for nav
  const counts = {
    discover: 0,
    new_clinics: clinics.filter((c) => c.status === "new").length,
    previews: clinics.filter((c) => c.status === "scraped" || c.status === "preview_generated").length,
    outreach: clinics.filter((c) => c.scraped_data?.draft).length,
    pipeline: clinics.filter((c) => PIPELINE_STATUSES.includes(c.status)).length,
    analytics: 0,
    settings: 0,
  };

  // Actions
  async function handleScrape(ids: string[]) {
    setActionLoading("scrape");
    try {
      await fetch("/api/admin/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicIds: ids }),
      });
      await fetchClinics();
      setSelectedIds(new Set());
    } catch {
      // handle silently
    }
    setActionLoading(null);
  }

  async function handleDraft(clinicId: string) {
    setActionLoading(clinicId);
    try {
      const res = await fetch("/api/admin/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicId }),
      });
      const data = await res.json();
      if (data.draft) {
        setDraftPreviews((prev) => ({ ...prev, [clinicId]: data.draft }));
      }
      await fetchClinics();
    } catch {
      // handle silently
    }
    setActionLoading(null);
  }

  async function handleBulkDraft(ids: string[]) {
    setActionLoading("bulk-draft");
    let drafted = 0;
    for (const id of ids) {
      try {
        await fetch("/api/admin/draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clinicId: id }),
        });
        drafted++;
      } catch { /* continue */ }
    }
    await fetchClinics();
    setSelectedIds(new Set());
    setActionLoading(null);
    alert(`Drafted ${drafted} email(s)`);
  }

  async function handleBulkSend(ids: string[]) {
    setActionLoading("bulk-send");
    let sent = 0;
    let emailed = 0;
    for (const id of ids) {
      try {
        const res = await fetch("/api/admin/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clinicId: id }),
        });
        const data = await res.json();
        sent++;
        if (data.emailSent) emailed++;
      } catch { /* continue */ }
    }
    await fetchClinics();
    setSelectedIds(new Set());
    setActionLoading(null);
    alert(`${sent} moved to pipeline.${emailed > 0 ? ` ${emailed} email(s) sent.` : " Set up Gmail to send automatically."}`);
  }

  async function handleSend(clinicId: string) {
    setActionLoading(clinicId);
    try {
      const res = await fetch("/api/admin/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicId }),
      });
      const data = await res.json();
      await fetchClinics();
      if (data.emailSent) {
        alert(`Email sent to ${data.to}`);
      } else {
        alert(data.message || "Marked as sent");
      }
    } catch {
      alert("Send failed");
    }
    setActionLoading(null);
  }

  async function handleEnrich(ids: string[]) {
    setActionLoading("enrich");
    try {
      const res = await fetch("/api/admin/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicIds: ids }),
      });
      const data = await res.json();
      await fetchClinics();
      setSelectedIds(new Set());
      // Show results
      const results = data.results || [];
      const enriched = results.filter((r: any) => r.status === "enriched");
      const notFound = results.filter((r: any) => r.status === "no_owner_found");
      if (enriched.length > 0) {
        const names = enriched.map((r: any) => `${r.owner} (${r.name})`).join(", ");
        alert(`Enriched: ${names}`);
      } else if (notFound.length > 0) {
        alert(`No owner found for: ${notFound.map((r: any) => r.name).join(", ")}. The clinic may not be in Fiber's database.`);
      }
    } catch {
      alert("Enrichment failed. Check that FIBER_API_KEY is set.");
    }
    setActionLoading(null);
  }

  async function handleClearLogo(clinicId: string) {
    try {
      await fetch("/api/admin/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicId, clearLogo: true }),
      });
      await fetchClinics();
      setSelectedClinic(null);
    } catch { /* handle silently */ }
  }

  async function handleRescrape(clinicId: string) {
    setActionLoading("scrape");
    try {
      await fetch("/api/admin/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicIds: [clinicId] }),
      });
      await fetchClinics();
      setSelectedClinic(null);
    } catch { /* handle silently */ }
    setActionLoading(null);
  }

  async function handleStatusChange(clinicId: string, status: string) {
    try {
      await fetch("/api/admin/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicId, status }),
      });
      await fetchClinics();
      // Update selected clinic if open
      if (selectedClinic?.id === clinicId) {
        const updated = clinics.find((c) => c.id === clinicId);
        if (updated) setSelectedClinic({ ...updated, status });
      }
    } catch {
      // handle silently
    }
  }

  function toggleId(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Pipeline filter
  const [pipelineFilter, setPipelineFilter] = useState("all");
  const pipelineFiltered = pipelineFilter === "all" ? pipelineClinics : pipelineClinics.filter((c) => c.status === pipelineFilter);

  const pipelineStatusCounts: Record<string, number> = {};
  pipelineClinics.forEach((c) => {
    pipelineStatusCounts[c.status] = (pipelineStatusCounts[c.status] || 0) + 1;
  });

  // Nav items
  const navItems = [
    { id: "discover", label: "Discover", icon: Search, count: undefined },
    { id: "new_clinics", label: "New Clinics", icon: Plus, count: counts.new_clinics || undefined },
    { id: "previews", label: "Previews", icon: Eye, count: counts.previews || undefined },
    { id: "outreach", label: "Outreach", icon: Send, count: counts.outreach || undefined },
    { id: "pipeline", label: "Pipeline", icon: Target, count: counts.pipeline || undefined },
    { id: "analytics", label: "Analytics", icon: BarChart3, count: undefined },
    { id: "settings", label: "Settings", icon: Settings, count: undefined },
  ];

  const pageTitles: Record<string, string> = {
    discover: "Discover Clinics",
    new_clinics: "New Clinics",
    previews: "Preview Manager",
    outreach: "Outreach",
    pipeline: "Pipeline",
    analytics: "Analytics",
    settings: "Settings",
  };

  return (
    <>
      <style>{styles}</style>
      <div className="admin">
        {/* Sidebar */}
        <div className="admin-sidebar">
          <div className="admin-sidebar-header">
            <div className="admin-brand">ClinicTech</div>
            <div className="admin-brand-sub">OUTBOUND ENGINE</div>
          </div>
          <div className="admin-nav">
            {navItems.map((item) => (
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

        {/* Main */}
        <div className="admin-main">
          <div className="admin-topbar">
            <div className="admin-topbar-left">
              <h1 style={{ fontSize: 18, fontWeight: 700 }}>{pageTitles[activePage] || "Admin"}</h1>
              {activePage !== "discover" && activePage !== "analytics" && activePage !== "settings" && (
                <div className="search-box">
                  <Search size={14} style={{ color: "#94A3B8" }} />
                  <input
                    placeholder="Search clinics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              )}
            </div>
            <div className="admin-topbar-right">
              <button className="action-btn" onClick={fetchClinics}><RefreshCw size={12} /> Refresh</button>
            </div>
          </div>

          {/* Stats bar — shown on non-discover/analytics/settings tabs */}
          {activePage !== "discover" && activePage !== "analytics" && activePage !== "settings" && (
            <div className="stats-bar">
              <div className="stat-card">
                <div className="stat-label">Total Clinics</div>
                <div className="stat-value">{clinics.length}</div>
                <div className="stat-sub">In database</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">New</div>
                <div className="stat-value">{clinics.filter((c) => c.status === "new").length}</div>
                <div className="stat-sub">Awaiting scrape</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Previews Ready</div>
                <div className="stat-value">{clinics.filter((c) => c.status === "scraped" || c.status === "preview_generated").length}</div>
                <div className="stat-sub">Ready for outreach</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Sent</div>
                <div className="stat-value" style={{ color: "#0891B2" }}>{clinics.filter((c) => c.preview_sent_at).length}</div>
                <div className="stat-sub">Previews sent</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Meetings</div>
                <div className="stat-value" style={{ color: "#7C3AED" }}>{clinics.filter((c) => c.status === "meeting_booked").length}</div>
                <div className="stat-sub">Booked</div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && activePage !== "discover" && activePage !== "analytics" && (
            <div className="loading-center"><Loader2 size={20} className="spin" /> Loading clinics...</div>
          )}

          {/* ─── DISCOVER TAB ─── */}
          {activePage === "discover" && <DiscoverTab onRefresh={fetchClinics} />}

          {/* ─── NEW CLINICS TAB ─── */}
          {activePage === "new_clinics" && !loading && (
            <>
              {selectedIds.size > 0 && (
                <div className="bulk-bar">
                  <span>{selectedIds.size} selected</span>
                  <button
                    className="action-btn primary"
                    style={{ fontSize: 12 }}
                    onClick={() => handleScrape(Array.from(selectedIds))}
                    disabled={actionLoading === "scrape"}
                  >
                    {actionLoading === "scrape" ? <><Loader2 size={12} className="spin" /> Generating...</> : <><Eye size={12} /> Generate Previews</>}
                  </button>
                  <button
                    className="action-btn"
                    style={{ fontSize: 12, color: "#C4B5FD", borderColor: "#7C3AED" }}
                    onClick={() => handleEnrich(Array.from(selectedIds))}
                    disabled={actionLoading === "enrich"}
                  >
                    {actionLoading === "enrich" ? <><Loader2 size={12} className="spin" /> Enriching...</> : <><Users size={12} /> Enrich Contacts</>}
                  </button>
                  <button className="action-btn" style={{ color: "#94A3B8", borderColor: "#475569" }} onClick={() => setSelectedIds(new Set())}>
                    Clear
                  </button>
                </div>
              )}
              <ClinicTable
                clinics={newClinics}
                onSelect={setSelectedClinic}
                selectedIds={selectedIds}
                onToggleSelect={toggleId}
                showCheckboxes
                actions={(clinic) => (
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      className="action-btn primary"
                      onClick={() => handleScrape([clinic.id])}
                      disabled={actionLoading === "scrape"}
                    >
                      <Eye size={12} /> Generate Preview
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleEnrich([clinic.id])}
                      disabled={actionLoading === "enrich"}
                      style={{ color: "#7C3AED", borderColor: "#C4B5FD" }}
                    >
                      {actionLoading === "enrich" ? <Loader2 size={12} className="spin" /> : <><Users size={12} /> Enrich</>}
                    </button>
                  </div>
                )}
              />
            </>
          )}

          {/* ─── PREVIEWS TAB ─── */}
          {activePage === "previews" && !loading && (
            <>
              {selectedIds.size > 0 && (
                <div className="bulk-bar">
                  <span>{selectedIds.size} selected</span>
                  <button
                    className="action-btn primary"
                    style={{ fontSize: 12 }}
                    onClick={() => handleBulkDraft(Array.from(selectedIds))}
                    disabled={actionLoading === "bulk-draft"}
                  >
                    {actionLoading === "bulk-draft" ? <><Loader2 size={12} className="spin" /> Drafting...</> : <><Mail size={12} /> Draft All</>}
                  </button>
                  <button
                    className="action-btn"
                    style={{ fontSize: 12, color: "#C4B5FD", borderColor: "#7C3AED" }}
                    onClick={() => handleEnrich(Array.from(selectedIds))}
                    disabled={actionLoading === "enrich"}
                  >
                    {actionLoading === "enrich" ? <><Loader2 size={12} className="spin" /> Enriching...</> : <><Users size={12} /> Enrich All</>}
                  </button>
                  <button className="action-btn" style={{ color: "#94A3B8", borderColor: "#475569" }} onClick={() => setSelectedIds(new Set())}>Clear</button>
                </div>
              )}
              <ClinicTable
                clinics={previewClinics}
                onSelect={setSelectedClinic}
                selectedIds={selectedIds}
                onToggleSelect={toggleId}
                showCheckboxes
                actions={(clinic) => (
                  <div style={{ display: "flex", gap: 4 }}>
                    {clinic.slug && (
                      <a href={`/preview/${clinic.slug}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                        <button className="action-btn"><ExternalLink size={12} /> View</button>
                      </a>
                    )}
                    <button className="action-btn primary" onClick={() => handleDraft(clinic.id)} disabled={actionLoading === clinic.id}>
                      {actionLoading === clinic.id ? <Loader2 size={12} className="spin" /> : <><Mail size={12} /> Draft</>}
                    </button>
                    {(draftPreviews[clinic.id] || clinic.scraped_data?.draft) && (
                      <button className="action-btn success" onClick={() => setSelectedClinic(clinic)}>
                        <CheckCircle2 size={12} /> Ready
                      </button>
                    )}
                  </div>
                )}
              />
            </>
          )}

          {/* ─── OUTREACH TAB ─── */}
          {activePage === "outreach" && !loading && (
            <div className="admin-table-wrap">
              {outreachClinics.length > 1 && (
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  <button
                    className="action-btn success"
                    style={{ fontSize: 13, padding: "8px 16px" }}
                    onClick={() => handleBulkSend(outreachClinics.map(c => c.id))}
                    disabled={actionLoading === "bulk-send"}
                  >
                    {actionLoading === "bulk-send" ? <><Loader2 size={14} className="spin" /> Sending...</> : <><Send size={14} /> Approve &amp; Send All ({outreachClinics.length})</>}
                  </button>
                </div>
              )}
              {outreachClinics.length === 0 ? (
                <div className="empty-state">
                  <Mail size={40} style={{ color: "#CBD5E1", marginBottom: 12 }} />
                  <div className="empty-state-title">No drafts pending</div>
                  <div className="empty-state-sub">Generate email drafts from the Previews tab first.</div>
                </div>
              ) : (
                outreachClinics.map((clinic) => {
                  const draft = clinic.scraped_data?.draft;
                  if (!draft) return null;
                  return (
                    <div key={clinic.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20, marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 16 }}>{clinic.name}</div>
                          <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                            To: {draft.to} | {clinic.location || "Unknown location"}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            className="action-btn success"
                            onClick={() => handleSend(clinic.id)}
                            disabled={actionLoading === clinic.id}
                          >
                            {actionLoading === clinic.id ? <Loader2 size={12} className="spin" /> : <><Send size={12} /> Approve &amp; Send</>}
                          </button>
                          <button className="action-btn" onClick={() => handleStatusChange(clinic.id, "new")}>Skip</button>
                        </div>
                      </div>
                      <div className="draft-preview">
                        <div className="draft-subject">Subject: {draft.subject}</div>
                        <div className="draft-body">{draft.body}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ─── PIPELINE TAB ─── */}
          {activePage === "pipeline" && !loading && (
            <>
              <div className="pipeline-bar">
                <div
                  className={`pipeline-chip ${pipelineFilter === "all" ? "active" : ""}`}
                  style={{ background: "#F1F5F9", color: "#475569" }}
                  onClick={() => setPipelineFilter("all")}
                >
                  All ({pipelineClinics.length})
                </div>
                {PIPELINE_STATUSES.filter((s) => pipelineStatusCounts[s]).map((s) => {
                  const cfg = STATUS_CONFIG[s];
                  return (
                    <div
                      key={s}
                      className={`pipeline-chip ${pipelineFilter === s ? "active" : ""}`}
                      style={{ background: cfg.bg, color: cfg.color }}
                      onClick={() => setPipelineFilter(s)}
                    >
                      {cfg.label} ({pipelineStatusCounts[s]})
                    </div>
                  );
                })}
              </div>
              <ClinicTable
                clinics={pipelineFiltered}
                onSelect={setSelectedClinic}
                actions={(clinic) => (
                  <div style={{ display: "flex", gap: 4 }}>
                    {!clinic.contact_phone && (
                      <button className="action-btn" onClick={() => handleEnrich([clinic.id])} disabled={actionLoading === "enrich"} style={{ color: "#7C3AED", borderColor: "#C4B5FD" }}>
                        {actionLoading === "enrich" ? <Loader2 size={12} className="spin" /> : <><Users size={12} /> Enrich</>}
                      </button>
                    )}
                    {clinic.status !== "call_flagged" && (
                      <button className="action-btn danger" onClick={() => handleStatusChange(clinic.id, "call_flagged")}>
                        <Phone size={12} /> Flag Call
                      </button>
                    )}
                    {clinic.status !== "meeting_booked" && (
                      <button className="action-btn success" onClick={() => handleStatusChange(clinic.id, "meeting_booked")}>
                        <Calendar size={12} /> Meeting
                      </button>
                    )}
                    {clinic.status !== "converted" && (
                      <button className="action-btn" style={{ color: "#16A34A", borderColor: "#86EFAC" }} onClick={() => handleStatusChange(clinic.id, "converted")}>
                        <CheckCircle2 size={12} /> Convert
                      </button>
                    )}
                  </div>
                )}
              />
            </>
          )}

          {/* ─── ANALYTICS TAB ─── */}
          {activePage === "analytics" && <AnalyticsTab />}

          {/* ─── SETTINGS TAB ─── */}
          {activePage === "settings" && (
            <div className="empty-state">
              <Settings size={40} style={{ color: "#CBD5E1", marginBottom: 12 }} />
              <div className="empty-state-title">Settings</div>
              <div className="empty-state-sub">Configuration options will be available here.</div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedClinic && (
        <DetailPanel
          clinic={selectedClinic}
          onClose={() => setSelectedClinic(null)}
          onStatusChange={(id, status) => {
            handleStatusChange(id, status);
            setSelectedClinic(null);
          }}
          onEnrich={(id) => {
            handleEnrich([id]);
            setSelectedClinic(null);
          }}
          onClearLogo={(id) => handleClearLogo(id)}
          onRescrape={(id) => handleRescrape(id)}
        />
      )}
    </>
  );
}
