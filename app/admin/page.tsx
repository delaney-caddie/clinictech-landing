"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, Plus, Globe, Eye, Mail, Phone, MoreHorizontal,
  RefreshCw, ExternalLink, CheckCircle2, Clock,
  AlertCircle, XCircle, Send, Target, Settings, Calendar,
  PhoneCall, BarChart3, Loader2, MapPin, Star, ChevronDown, Users,
  Link, UserSearch, MessageSquare, TrendingUp, Download, Zap, Copy,
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
  new:               { label: "New Lead",          color: "#6B7280", bg: "#F3F4F6", icon: Plus },
  scraped:           { label: "Scraped",           color: "#8B5CF6", bg: "#F5F3FF", icon: Globe },
  preview_generated: { label: "Preview Ready",     color: "#2563EB", bg: "#EFF6FF", icon: Eye },
  preview_sent:      { label: "Preview Sent",      color: "#0891B2", bg: "#ECFEFF", icon: Send },
  audited:           { label: "Audited",           color: "#D97706", bg: "#FFFBEB", icon: Zap },
  audit_sent:        { label: "Audit Sent",        color: "#059669", bg: "#ECFDF5", icon: Send },
  cold_call_1:       { label: "Cold Call 1",       color: "#7C3AED", bg: "#F5F3FF", icon: PhoneCall },
  follow_up_1:       { label: "Follow Up Email 1", color: "#D97706", bg: "#FFFBEB", icon: Mail },
  cold_call_2:       { label: "Cold Call 2",       color: "#6D28D9", bg: "#EDE9FE", icon: PhoneCall },
  follow_up_2:       { label: "Follow Up Email 2", color: "#EA580C", bg: "#FFF7ED", icon: Mail },
  follow_up_3:       { label: "Follow Up Email 3", color: "#C2410C", bg: "#FFF7ED", icon: Mail },
  cold_call_3:       { label: "Cold Call 3",       color: "#5B21B6", bg: "#EDE9FE", icon: PhoneCall },
  text_message_1:    { label: "Text Message 1",    color: "#0891B2", bg: "#ECFEFF", icon: Send },
  interested:        { label: "Interested",        color: "#2563EB", bg: "#EFF6FF", icon: Star },
  meeting_booked:    { label: "Meeting Booked",    color: "#059669", bg: "#ECFDF5", icon: Calendar },
  converted:         { label: "Converted",         color: "#16A34A", bg: "#F0FDF4", icon: CheckCircle2 },
  cold:              { label: "Cold",              color: "#94A3B8", bg: "#F8FAFC", icon: Clock },
  closed_lost:       { label: "Closed Lost",       color: "#9CA3AF", bg: "#F9FAFB", icon: XCircle },
  // Legacy statuses for backward compat
  emailed:           { label: "Emailed",           color: "#059669", bg: "#ECFDF5", icon: Mail },
  called:            { label: "Called",             color: "#0EA5E9", bg: "#F0F9FF", icon: PhoneCall },
  call_flagged:      { label: "Call Flagged",       color: "#DC2626", bg: "#FEF2F2", icon: Phone },
  lost:              { label: "Lost",               color: "#9CA3AF", bg: "#F9FAFB", icon: XCircle },
};

const PIPELINE_STATUSES = [
  "new", "preview_generated", "preview_sent",
  "audited", "audit_sent",
  "cold_call_1", "follow_up_1", "cold_call_2", "follow_up_2",
  "follow_up_3", "cold_call_3", "text_message_1",
  "interested", "meeting_booked", "converted", "cold", "closed_lost",
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

  /* Kanban */
  .kanban { display: flex; gap: 12px; padding: 20px 28px; overflow-x: auto; min-height: calc(100vh - 200px); align-items: flex-start; }
  .kanban-col { min-width: 260px; max-width: 280px; flex: 1; background: #F1F5F9; border-radius: 12px; display: flex; flex-direction: column; max-height: calc(100vh - 220px); }
  .kanban-col-header { padding: 14px 16px 10px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 1; }
  .kanban-col-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px; }
  .kanban-col-count { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px; background: rgba(0,0,0,0.06); }
  .kanban-col-body { padding: 0 10px 10px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 8px; }
  .kanban-card { background: #fff; border-radius: 10px; padding: 14px; cursor: pointer; transition: all 0.15s; border: 1px solid #E2E8F0; }
  .kanban-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-1px); }
  .kanban-card-name { font-size: 13px; font-weight: 700; color: #0F172A; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .kanban-card-detail { font-size: 11px; color: #64748B; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .kanban-card-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .kanban-card-tag { font-size: 9px; font-weight: 600; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.3px; }
  .kanban-card-actions { display: flex; gap: 4px; margin-top: 10px; flex-wrap: wrap; }
  .kanban-card-actions .action-btn { font-size: 10px; padding: 3px 8px; }
  .kanban-card.dragging { opacity: 0.4; transform: rotate(2deg); }
  .kanban-col.drag-over .kanban-col-body { background: rgba(99,102,241,0.06); border-radius: 8px; }
  .kanban-drop-indicator { height: 3px; background: #6366F1; border-radius: 2px; margin: 2px 0; transition: opacity 0.15s; }

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
  .stats-bar { display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px; padding: 20px 28px; }
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

interface LinkedInResult {
  name: string;
  headline: string;
  url: string;
}

function DecisionMakerSection({ clinic, onEnrichFromLinkedIn }: { clinic: Clinic; onEnrichFromLinkedIn: (id: string, linkedinUrl: string) => void }) {
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<LinkedInResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const [enriching, setEnriching] = useState(false);

  async function handleSearch() {
    setSearching(true);
    setResults([]);
    setSearched(false);
    try {
      const res = await fetch("/api/admin/linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicId: clinic.id }),
      });
      const data = await res.json();
      setResults(data.profiles || []);
    } catch {
      // silent
    }
    setSearching(false);
    setSearched(true);
  }

  async function handleSelectProfile(url: string) {
    setEnriching(true);
    onEnrichFromLinkedIn(clinic.id, url);
    setEnriching(false);
  }

  async function handleManualEnrich() {
    if (!manualUrl.trim()) return;
    setEnriching(true);
    onEnrichFromLinkedIn(clinic.id, manualUrl.trim());
    setEnriching(false);
    setManualUrl("");
  }

  return (
    <div className="detail-section">
      <div className="detail-section-title">Find Decision Maker</div>

      {/* Manual LinkedIn URL input */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <input
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          placeholder="Paste LinkedIn URL..."
          style={{ flex: 1, padding: "6px 10px", border: "1px solid #E2E8F0", borderRadius: 6, fontSize: 12, fontFamily: "inherit", outline: "none" }}
        />
        <button
          className="action-btn"
          onClick={handleManualEnrich}
          disabled={!manualUrl.trim() || enriching}
          style={{ color: "#7C3AED", borderColor: "#C4B5FD", whiteSpace: "nowrap" }}
        >
          {enriching ? <Loader2 size={12} className="spin" /> : <><Link size={12} /> Enrich</>}
        </button>
      </div>

      {/* Auto-search button */}
      <button
        className="action-btn"
        onClick={handleSearch}
        disabled={searching}
        style={{ width: "100%", justifyContent: "center", marginBottom: 10, color: "#2563EB", borderColor: "#93C5FD" }}
      >
        {searching ? <><Loader2 size={12} className="spin" /> Searching LinkedIn...</> : <><UserSearch size={12} /> Search LinkedIn for Owner</>}
      </button>

      {/* Results */}
      {searched && results.length === 0 && !searching && (
        <div style={{ fontSize: 12, color: "#94A3B8", textAlign: "center", padding: "8px 0" }}>
          No LinkedIn profiles found. Try pasting a URL manually.
        </div>
      )}

      {results.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {results.map((profile, i) => (
            <div
              key={i}
              onClick={() => handleSelectProfile(profile.url)}
              style={{
                background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8,
                padding: "10px 12px", cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseOver={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#93C5FD"; (e.currentTarget as HTMLDivElement).style.background = "#EFF6FF"; }}
              onMouseOut={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#E2E8F0"; (e.currentTarget as HTMLDivElement).style.background = "#F8FAFC"; }}
            >
              <div style={{ fontWeight: 600, fontSize: 13 }}>{profile.name}</div>
              {profile.headline && <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{profile.headline}</div>}
              <div style={{ fontSize: 11, color: "#2563EB", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                <ExternalLink size={10} /> {profile.url.replace("https://www.linkedin.com/in/", "")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface AdditionalContact {
  name: string;
  title: string;
  email: string;
  phone: string;
}

function AdditionalContactsSection({ clinic, onSave }: { clinic: Clinic; onSave: (id: string, data: Record<string, unknown>) => Promise<void> }) {
  const contacts: AdditionalContact[] = clinic.scraped_data?.additional_contacts || [];
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<AdditionalContact>({ name: "", title: "", email: "", phone: "" });

  async function handleAdd() {
    if (!form.name.trim() && !form.email.trim()) return;
    setSaving(true);
    const updated = [...contacts, { ...form }];
    const existing = typeof clinic.scraped_data === "object" && clinic.scraped_data ? clinic.scraped_data : {};
    await fetch("/api/admin/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clinicId: clinic.id, updateProfile: {}, updateScrapedData: { additional_contacts: updated } }),
    });
    // Refresh by calling onSave with empty to trigger refetch
    await onSave(clinic.id, {});
    setForm({ name: "", title: "", email: "", phone: "" });
    setAdding(false);
    setSaving(false);
  }

  async function handleRemove(idx: number) {
    const updated = contacts.filter((_, i) => i !== idx);
    await fetch("/api/admin/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clinicId: clinic.id, updateProfile: {}, updateScrapedData: { additional_contacts: updated } }),
    });
    await onSave(clinic.id, {});
  }

  return (
    <div className="detail-section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div className="detail-section-title" style={{ margin: 0 }}>People</div>
        {!adding && (
          <button className="action-btn" style={{ fontSize: 11, color: "#2563EB", borderColor: "#93C5FD" }} onClick={() => setAdding(true)}>
            <Plus size={12} /> Add Person
          </button>
        )}
      </div>

      {contacts.map((c, i) => (
        <div key={i} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{c.name || "Unnamed"}</div>
              {c.title && <div style={{ fontSize: 11, color: "#64748B" }}>{c.title}</div>}
            </div>
            <button className="action-btn" style={{ fontSize: 10, color: "#DC2626", borderColor: "#FECACA", padding: "2px 6px" }} onClick={() => handleRemove(i)}>
              <XCircle size={10} />
            </button>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 11, color: "#475569" }}>
            {c.email && <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Mail size={10} /> {c.email}</span>}
            {c.phone && <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Phone size={10} /> {c.phone}</span>}
          </div>
        </div>
      ))}

      {adding && (
        <div style={{ background: "#F8FAFC", border: "1px solid #93C5FD", borderRadius: 8, padding: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { key: "name", placeholder: "Full name", label: "Name" },
              { key: "title", placeholder: "e.g. Medical Director, Office Manager", label: "Title" },
              { key: "email", placeholder: "email@clinic.com", label: "Email" },
              { key: "phone", placeholder: "+1 (555) 123-4567", label: "Phone" },
            ].map(({ key, placeholder, label }) => (
              <div key={key}>
                <label style={{ fontSize: 10, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 2 }}>{label}</label>
                <input
                  value={(form as any)[key]}
                  onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={{ width: "100%", padding: "6px 10px", border: "1px solid #E2E8F0", borderRadius: 6, fontSize: 12, fontFamily: "inherit", outline: "none" }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <button className="action-btn primary" style={{ fontSize: 11 }} onClick={handleAdd} disabled={saving}>
              {saving ? "Saving..." : "Add"}
            </button>
            <button className="action-btn" style={{ fontSize: 11 }} onClick={() => { setAdding(false); setForm({ name: "", title: "", email: "", phone: "" }); }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {contacts.length === 0 && !adding && (
        <div style={{ fontSize: 12, color: "#94A3B8", textAlign: "center", padding: "8px 0" }}>
          No additional contacts yet
        </div>
      )}
    </div>
  );
}

function AuditFindingsSection({ clinic }: { clinic: Clinic }) {
  const findings: string[] | undefined = clinic.scraped_data?.audit_findings;
  const hasAudit = Array.isArray(findings) && findings.length === 3;
  const [auditing, setAuditing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValues, setEditValues] = useState<string[]>(findings || ["", "", ""]);
  const [saving, setSaving] = useState(false);

  async function handleAuditSingle() {
    setAuditing(true);
    try {
      const res = await fetch("/api/admin/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicIds: [clinic.id] }),
      });
      if (!res.ok) throw new Error("Audit failed");
      const data = await res.json();
      const result = data.results?.[0];
      if (result?.status === "audited") {
        alert(`Audit complete: ${result.findings.length} findings`);
        window.location.reload();
      } else {
        alert(result?.reason || "Audit could not be completed");
      }
    } catch {
      alert("Audit failed");
    }
    setAuditing(false);
  }

  function copyFindings() {
    if (!findings) return;
    const text = findings.map((f: string, i: number) => `${i + 1}) ${f}`).join("\n");
    navigator.clipboard.writeText(text);
    alert("Findings copied to clipboard");
  }

  async function handleSaveFindings() {
    setSaving(true);
    try {
      await fetch("/api/admin/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicId: clinic.id,
          updateProfile: {},
          updateScrapedData: { audit_findings: editValues },
        }),
      });
      setEditing(false);
      window.location.reload();
    } catch {
      alert("Failed to save findings");
    }
    setSaving(false);
  }

  return (
    <div className="detail-section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div className="detail-section-title" style={{ margin: 0 }}>Audit Findings</div>
        <div style={{ display: "flex", gap: 4 }}>
          {hasAudit && !editing && (
            <>
              <button className="action-btn" style={{ fontSize: 11 }} onClick={() => { setEditValues(findings!); setEditing(true); }}>
                ✏️ Edit
              </button>
              <button className="action-btn" style={{ fontSize: 11 }} onClick={copyFindings}>
                <Copy size={11} /> Copy
              </button>
            </>
          )}
          {editing && (
            <>
              <button className="action-btn primary" style={{ fontSize: 11 }} onClick={handleSaveFindings} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button className="action-btn" style={{ fontSize: 11 }} onClick={() => setEditing(false)}>Cancel</button>
            </>
          )}
        </div>
      </div>

      {hasAudit && !editing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {findings!.map((f: string, i: number) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{
                flexShrink: 0, width: 22, height: 22, borderRadius: "50%",
                background: "#FEF3C7", color: "#D97706", fontSize: 11, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {i + 1}
              </span>
              <span style={{ fontSize: 13, color: "#334155", lineHeight: "1.4" }}>{f}</span>
            </div>
          ))}
        </div>
      ) : hasAudit && editing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {editValues.map((val, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{
                flexShrink: 0, width: 22, height: 22, borderRadius: "50%",
                background: "#FEF3C7", color: "#D97706", fontSize: 11, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", marginTop: 6,
              }}>
                {i + 1}
              </span>
              <textarea
                value={val}
                onChange={(e) => {
                  const next = [...editValues];
                  next[i] = e.target.value;
                  setEditValues(next);
                }}
                rows={2}
                style={{
                  flex: 1, padding: "6px 10px", border: "1px solid #E2E8F0", borderRadius: 6,
                  fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none",
                  lineHeight: "1.4",
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 8 }}>Not audited yet</div>
          <button
            className="action-btn"
            onClick={handleAuditSingle}
            disabled={auditing}
            style={{ color: "#D97706", borderColor: "#FCD34D" }}
          >
            {auditing ? <><Loader2 size={12} className="spin" /> Auditing...</> : <><Zap size={12} /> Run Audit</>}
          </button>
        </div>
      )}
    </div>
  );
}

function DetailPanel({ clinic, onClose, onStatusChange, onEnrich, onEnrichFromLinkedIn, onClearLogo, onRescrape, onSaveProfile, onDelete }: { clinic: Clinic; onClose: () => void; onStatusChange: (id: string, status: string) => void; onEnrich: (id: string) => void; onEnrichFromLinkedIn: (id: string, linkedinUrl: string) => void; onClearLogo: (id: string) => void; onRescrape: (id: string) => void; onSaveProfile: (id: string, data: Record<string, unknown>) => Promise<void>; onDelete: (id: string) => void }) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    contact_name: clinic.contact_name || "",
    contact_email: clinic.contact_email || "",
    contact_phone: clinic.contact_phone || "",
    contact_title: (clinic as any).contact_title || "",
    linkedin_url: clinic.scraped_data?.linkedin_url || "",
    location: clinic.location || "",
    website: clinic.website || "",
    primary_color: clinic.primary_color || "",
    notes: (clinic as any).notes || "",
  });

  function handleEditChange(field: string, value: string) {
    setEditData(prev => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    // Extract linkedin_url to save into scraped_data separately
    const { linkedin_url, ...profileData } = editData;
    await onSaveProfile(clinic.id, { ...profileData, linkedin_url });
    setSaving(false);
    setEditing(false);
  }

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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div className="detail-section-title" style={{ margin: 0 }}>Contact</div>
              {!editing && (
                <button className="action-btn" style={{ fontSize: 11 }} onClick={() => setEditing(true)}>✏️ Edit</button>
              )}
              {editing && (
                <div style={{ display: "flex", gap: 4 }}>
                  <button className="action-btn primary" style={{ fontSize: 11 }} onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button className="action-btn" style={{ fontSize: 11 }} onClick={() => setEditing(false)}>Cancel</button>
                </div>
              )}
            </div>
            {editing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Name", field: "contact_name", placeholder: "Dr. Jane Smith" },
                  { label: "Title", field: "contact_title", placeholder: "Owner, Medical Director" },
                  { label: "Email", field: "contact_email", placeholder: "jane@clinic.com" },
                  { label: "Phone", field: "contact_phone", placeholder: "+1 (555) 123-4567" },
                  { label: "LinkedIn URL", field: "linkedin_url", placeholder: "https://linkedin.com/in/dr-jane-smith" },
                  { label: "Location", field: "location", placeholder: "City, State" },
                  { label: "Website", field: "website", placeholder: "clinicname.com" },
                  { label: "Brand Color", field: "primary_color", placeholder: "#1A2B3C" },
                  { label: "Notes", field: "notes", placeholder: "Internal notes..." },
                ].map(({ label, field, placeholder }) => (
                  <div key={field}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 2 }}>{label}</label>
                    {field === "notes" ? (
                      <textarea
                        value={(editData as any)[field]}
                        onChange={(e) => handleEditChange(field, e.target.value)}
                        placeholder={placeholder}
                        rows={3}
                        style={{ width: "100%", padding: "6px 10px", border: "1px solid #E2E8F0", borderRadius: 6, fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none" }}
                      />
                    ) : (
                      <input
                        value={(editData as any)[field]}
                        onChange={(e) => handleEditChange(field, e.target.value)}
                        placeholder={placeholder}
                        style={{ width: "100%", padding: "6px 10px", border: "1px solid #E2E8F0", borderRadius: 6, fontSize: 13, fontFamily: "inherit", outline: "none", ...(field === "primary_color" ? { fontFamily: "monospace" } : {}) }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="detail-field"><span className="detail-field-label">Name</span><span className="detail-field-value">{clinic.contact_name || "Unknown"}</span></div>
                <div className="detail-field"><span className="detail-field-label">Title</span><span className="detail-field-value">{(clinic as any).contact_title || "Unknown"}</span></div>
                <div className="detail-field"><span className="detail-field-label">Email</span><span className="detail-field-value">{clinic.contact_email || "Unknown"}</span></div>
                <div className="detail-field"><span className="detail-field-label">Phone</span><span className="detail-field-value">{clinic.contact_phone || "Unknown"}</span></div>
                {clinic.scraped_data?.linkedin_url && (
                  <div className="detail-field">
                    <span className="detail-field-label">LinkedIn</span>
                    <a href={clinic.scraped_data.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: "#2563EB", fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                      <ExternalLink size={11} /> Profile
                    </a>
                  </div>
                )}
                <div className="detail-field"><span className="detail-field-label">Location</span><span className="detail-field-value">{clinic.location || "Unknown"}</span></div>
                {(clinic as any).notes && (
                  <div className="detail-field"><span className="detail-field-label">Notes</span><span className="detail-field-value" style={{ fontSize: 12, maxWidth: 200, textAlign: "right" }}>{(clinic as any).notes}</span></div>
                )}
              </>
            )}
          </div>

          <DecisionMakerSection clinic={clinic} onEnrichFromLinkedIn={onEnrichFromLinkedIn} />
          <AdditionalContactsSection clinic={clinic} onSave={onSaveProfile} />

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

          {/* Audit Findings */}
          <AuditFindingsSection clinic={clinic} />

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

          {clinic.scraped_data?.followup_1_draft && (
            <div className="detail-section">
              <div className="detail-section-title">Follow-up 1 Draft</div>
              <div className="draft-preview">
                <div className="draft-to">To: {clinic.scraped_data.followup_1_draft.to}</div>
                <div className="draft-subject">Subject: {clinic.scraped_data.followup_1_draft.subject}</div>
                <div className="draft-body">{clinic.scraped_data.followup_1_draft.body}</div>
              </div>
            </div>
          )}

          {clinic.scraped_data?.followup_2_draft && (
            <div className="detail-section">
              <div className="detail-section-title">Follow-up 2 Draft</div>
              <div className="draft-preview">
                <div className="draft-to">To: {clinic.scraped_data.followup_2_draft.to}</div>
                <div className="draft-subject">Subject: {clinic.scraped_data.followup_2_draft.subject}</div>
                <div className="draft-body">{clinic.scraped_data.followup_2_draft.body}</div>
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
            <button
              className="action-btn"
              style={{ color: "#DC2626", borderColor: "#FCA5A5" }}
              onClick={() => { if (confirm(`Remove "${clinic.name}" from the pipeline? This cannot be undone.`)) onDelete(clinic.id); }}
            >
              <XCircle size={12} /> Remove Clinic
            </button>
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
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <StatusBadge status={clinic.status} />
                    {Array.isArray(clinic.scraped_data?.audit_findings) && clinic.scraped_data.audit_findings.length === 3 && (
                      <span className="status-badge" style={{ background: "#ECFDF5", color: "#059669", fontSize: 10 }}>Audited</span>
                    )}
                  </div>
                </td>
                <td>
                  {(clinic.contact_email || clinic.contact_name) ? (
                    <div>
                      {clinic.contact_name && <div style={{ fontWeight: 500 }}>{clinic.contact_name}</div>}
                      {clinic.contact_email && <div style={{ fontSize: 12, color: clinic.contact_name ? "#94A3B8" : "#0F172A", fontWeight: clinic.contact_name ? 400 : 500 }}>{clinic.contact_email}</div>}
                      {clinic.contact_phone && !clinic.contact_email && <div style={{ fontSize: 12, color: "#94A3B8" }}>{clinic.contact_phone}</div>}
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

function EditableDraftCard({ clinic, actionLoading, onSend, onSkip, onSaveDraft }: {
  clinic: Clinic;
  actionLoading: string | null;
  onSend: (id: string) => void;
  onSkip: () => void;
  onSaveDraft: (id: string, draft: { to: string; subject: string; body: string }) => void;
}) {
  const draft = clinic.scraped_data?.draft;
  if (!draft) return null;

  const [editing, setEditing] = useState(false);
  const [to, setTo] = useState(draft.to || "");
  const [subject, setSubject] = useState(draft.subject || "");
  const [body, setBody] = useState(draft.body || "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await onSaveDraft(clinic.id, { to, subject, body });
    setSaving(false);
    setEditing(false);
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{clinic.name}</div>
          <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
            {clinic.location || ""}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {!editing && (
            <button className="action-btn" onClick={() => setEditing(true)}>
              ✏️ Edit
            </button>
          )}
          {editing && (
            <button className="action-btn primary" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 size={12} className="spin" /> : "Save"}
            </button>
          )}
          {editing && (
            <button className="action-btn" onClick={() => { setEditing(false); setTo(draft.to); setSubject(draft.subject); setBody(draft.body); }}>
              Cancel
            </button>
          )}
          {!editing && (
            <>
              <button
                className="action-btn success"
                onClick={() => onSend(clinic.id)}
                disabled={actionLoading === clinic.id}
              >
                {actionLoading === clinic.id ? <Loader2 size={12} className="spin" /> : <><Send size={12} /> Approve &amp; Send</>}
              </button>
              <button className="action-btn" onClick={onSkip}>Skip</button>
            </>
          )}
        </div>
      </div>
      <div className="draft-preview">
        {editing ? (
          <>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4 }}>To</label>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", border: "1px solid #E2E8F0", borderRadius: 6, fontSize: 13, fontFamily: "inherit", outline: "none" }}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4 }}>Subject</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", border: "1px solid #E2E8F0", borderRadius: 6, fontSize: 13, fontFamily: "inherit", fontWeight: 600, outline: "none" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4 }}>Body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={14}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #E2E8F0", borderRadius: 6, fontSize: 13, lineHeight: 1.6, fontFamily: "inherit", resize: "vertical", outline: "none" }}
              />
            </div>
          </>
        ) : (
          <>
            <div className="draft-to">To: {to}</div>
            <div className="draft-subject">Subject: {subject}</div>
            <div className="draft-body">{body}</div>
          </>
        )}
      </div>
    </div>
  );
}

function SettingsTab() {
  const [gmailStatus, setGmailStatus] = useState<{ connected: boolean; authUrl?: string; error?: string } | null>(null);
  const [checking, setChecking] = useState(false);

  async function checkGmail() {
    setChecking(true);
    try {
      const res = await fetch("/api/admin/gmail");
      const data = await res.json();
      setGmailStatus(data);
    } catch {
      setGmailStatus({ connected: false, error: "Failed to check" });
    }
    setChecking(false);
  }

  return (
    <div style={{ padding: 28 }}>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, maxWidth: 600 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Email Integration</h3>
        <p style={{ fontSize: 13, color: "#64748B", marginBottom: 16, lineHeight: 1.6 }}>
          Connect Gmail to send outreach emails directly from the platform. Emails will be sent from Danika&apos;s account.
        </p>

        {!gmailStatus && (
          <button className="action-btn primary" onClick={checkGmail} disabled={checking}>
            {checking ? <><Loader2 size={12} className="spin" /> Checking...</> : "Check Gmail Connection"}
          </button>
        )}

        {gmailStatus?.connected && (
          <div style={{ padding: 12, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, fontSize: 13, color: "#166534", display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle2 size={16} /> Gmail connected and ready to send
          </div>
        )}

        {gmailStatus && !gmailStatus.connected && !gmailStatus.error && gmailStatus.authUrl && (
          <div>
            <p style={{ fontSize: 13, color: "#DC2626", marginBottom: 12 }}>Gmail not connected.</p>
            <a href={gmailStatus.authUrl} target="_blank" rel="noopener noreferrer">
              <button className="action-btn primary">Connect Gmail via Composio</button>
            </a>
          </div>
        )}

        {gmailStatus && !gmailStatus.connected && !gmailStatus.authUrl && (
          <div style={{ padding: 12, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, fontSize: 13, color: "#DC2626" }}>
            {gmailStatus.error || "Gmail not configured. Set COMPOSIO_API_KEY in environment variables."}
          </div>
        )}
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, maxWidth: 600, marginTop: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Email Signature</h3>
        <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, padding: 16, fontSize: 13, lineHeight: 1.6, color: "#475569" }}>
          <strong>Danika Chilibeck</strong><br />
          Cofounder &amp; CEO<br />
          ClinicTech.io
        </div>
        <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 8 }}>
          Update SENDER_NAME and SENDER_TITLE in environment variables to change.
        </p>
      </div>
    </div>
  );
}

interface Lead {
  id: string;
  email: string;
  source: string;
  created_at: string;
}

/* ─── Product Feedback Tab ─── */

const FEATURE_CATEGORIES = [
  {
    name: "Scheduling & Appointments",
    features: [
      { id: "apt_calendar", name: "Appointment calendar", desc: "Full calendar view, room/resource allocation, procedure duration blocking" },
      { id: "staff_assign", name: "Staff assignment per procedure", desc: "Assign providers to specific procedures" },
      { id: "waitlist", name: "Waitlist management", desc: "Manage patient waitlists for popular time slots" },
      { id: "recurring_apt", name: "Recurring appointment series", desc: "E.g., PRP 3-session protocols" },
    ],
  },
  {
    name: "Patient Management",
    features: [
      { id: "treatment_tracking", name: "Patient treatment tracking", desc: "Protocols, sessions completed vs planned, injection sites, dosing" },
      { id: "outcomes_tracking", name: "Patient outcomes tracking", desc: "Pain scores, ROM, patient-reported outcomes over time" },
      { id: "photo_gallery", name: "Before/after photo gallery", desc: "Organized by treatment type, consent status" },
      { id: "patient_education", name: "Patient education content", desc: "Pre/post procedure instructions, FAQ automation" },
      { id: "digital_intake", name: "Digital intake forms", desc: "Online patient intake and registration" },
    ],
  },
  {
    name: "Revenue & Billing",
    features: [
      { id: "revenue_dash", name: "Revenue dashboard", desc: "Collected vs outstanding, daily/weekly/monthly views" },
      { id: "payment_plans", name: "Payment plan management", desc: "Stem cell treatments are $5k-$25k+ out-of-pocket" },
      { id: "invoicing", name: "Invoice generation", desc: "Create and send invoices" },
      { id: "insurance_verify", name: "Insurance verification", desc: "For clinics that accept insurance" },
    ],
  },
  {
    name: "Inventory & Supply Chain",
    features: [
      { id: "biologics_inv", name: "Biologics inventory tracking", desc: "Exosome vials, PRP kits, stem cell products" },
      { id: "expiration_alerts", name: "Expiration date alerts", desc: "Cold chain tracking and expiry management" },
      { id: "lot_tracking", name: "Lot number tracking", desc: "Tied to patients for compliance" },
      { id: "reorder_alerts", name: "Reorder alerts", desc: "Supplier management and auto-reorder" },
    ],
  },
  {
    name: "Compliance & Documentation",
    features: [
      { id: "consent_mgmt", name: "Consent and document management", desc: "E-signatures, treatment-specific waivers" },
      { id: "audit_trail", name: "Audit trail", desc: "Who got what product, from what lot, on what date" },
      { id: "fda_compliance", name: "FDA 21 CFR Part 1271 logging", desc: "Compliance logging for tissue products" },
      { id: "adverse_events", name: "Adverse event reporting", desc: "Track and report adverse events" },
    ],
  },
  {
    name: "Marketing & Growth",
    features: [
      { id: "lead_attribution", name: "Lead source attribution", desc: "Marketing ROI tracking" },
      { id: "referral_network", name: "Referral network management", desc: "Which doctors/PTs send patients, referral fees" },
      { id: "case_study_builder", name: "Case study builder", desc: "Pull from outcomes data" },
      { id: "review_automation", name: "Review/testimonial automation", desc: "Automated review request campaigns" },
    ],
  },
  {
    name: "Staff & Operations",
    features: [
      { id: "staff_dash", name: "Staff/provider dashboard", desc: "Who's on today, procedures per provider, utilization" },
      { id: "multi_location", name: "Multi-location rollup", desc: "Aggregate dashboard across clinic locations" },
      { id: "protocol_templates", name: "Treatment protocol templates", desc: "Standardized protocols for new providers" },
      { id: "lab_tracking", name: "Lab/processing tracking", desc: "Harvest-to-injection timelines for in-house processing" },
    ],
  },
  {
    name: "Follow-up & Retention",
    features: [
      { id: "followup_protocols", name: "Clinical follow-up protocols", desc: "Structured check-ins at 2wk, 6wk, 3mo, 6mo" },
      { id: "recall_automation", name: "Recall automation", desc: "Bring patients back for maintenance treatments" },
      { id: "satisfaction_surveys", name: "Patient satisfaction surveys", desc: "NPS, post-treatment feedback" },
    ],
  },
  {
    name: "Platform Capabilities",
    features: [
      { id: "custom_dashboard", name: "Customizable dashboard", desc: "Drag-and-drop widgets, role-based views per clinic" },
      { id: "ai_automations", name: "AI automations", desc: "Smart follow-ups, appointment reminders, lead scoring, protocol suggestions" },
      { id: "tool_connections", name: "Tool connections", desc: "EHR integrations, Google Calendar, payment processors, lab systems" },
      { id: "unified_inbox", name: "Unified inbox", desc: "All patient comms in one place: email, SMS, portal messages, calls" },
      { id: "ai_interface", name: "AI-first interface", desc: "Natural language queries, AI-assisted charting, smart scheduling" },
    ],
  },
];

interface FeatureVote {
  count: number;
  timestamps: number[];
}

function ProductFeedbackTab() {
  const [votes, setVotes] = useState<Record<string, FeatureVote>>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem("ct_feature_votes") || "{}");
    } catch { return {}; }
  });
  const [sortBy, setSortBy] = useState<"most" | "alpha" | "category">("most");
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(FEATURE_CATEGORIES.map(c => c.name)));
  const [customFeatures, setCustomFeatures] = useState<{ id: string; name: string; desc: string; category: string }[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("ct_custom_features") || "[]"); } catch { return []; }
  });
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  function saveVotes(updated: Record<string, FeatureVote>) {
    setVotes(updated);
    localStorage.setItem("ct_feature_votes", JSON.stringify(updated));
  }

  function addCustomFeature(category: string) {
    if (!newName.trim()) return;
    const id = `custom_${Date.now()}`;
    const updated = [...customFeatures, { id, name: newName.trim(), desc: newDesc.trim(), category }];
    setCustomFeatures(updated);
    localStorage.setItem("ct_custom_features", JSON.stringify(updated));
    setNewName("");
    setNewDesc("");
    setAddingTo(null);
  }

  function removeCustomFeature(id: string) {
    const updated = customFeatures.filter(f => f.id !== id);
    setCustomFeatures(updated);
    localStorage.setItem("ct_custom_features", JSON.stringify(updated));
    const updatedVotes = { ...votes };
    delete updatedVotes[id];
    saveVotes(updatedVotes);
  }

  function handleVote(featureId: string) {
    const existing = votes[featureId] || { count: 0, timestamps: [] };
    saveVotes({
      ...votes,
      [featureId]: { count: existing.count + 1, timestamps: [...existing.timestamps, Date.now()] },
    });
  }

  function handleReset() {
    if (confirm("Reset all feature votes to zero? This cannot be undone.")) {
      saveVotes({});
    }
  }

  function toggleCat(name: string) {
    setExpandedCats(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  }

  function getWeeklyCount(featureId: string): number {
    const v = votes[featureId];
    if (!v) return 0;
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return v.timestamps.filter(t => t > weekAgo).length;
  }

  // All features flat for sorting/top 5
  const allFeatures = [
    ...FEATURE_CATEGORIES.flatMap(cat => cat.features.map(f => ({ ...f, category: cat.name, count: votes[f.id]?.count || 0 }))),
    ...customFeatures.map(f => ({ ...f, count: votes[f.id]?.count || 0 })),
  ];
  const top5 = [...allFeatures].sort((a, b) => b.count - a.count).filter(f => f.count > 0).slice(0, 5);
  const maxCount = top5[0]?.count || 1;

  // For "most requested" sort, flatten and sort
  const sortedCategories = sortBy === "category" ? FEATURE_CATEGORIES :
    sortBy === "alpha" ? [...FEATURE_CATEGORIES].map(cat => ({
      ...cat,
      features: [...cat.features].sort((a, b) => a.name.localeCompare(b.name)),
    })).sort((a, b) => a.name.localeCompare(b.name)) :
    FEATURE_CATEGORIES;

  return (
    <div style={{ padding: "20px 28px", maxWidth: 900 }}>
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {(["most", "alpha", "category"] as const).map(s => (
            <button
              key={s}
              className={`pipeline-chip ${sortBy === s ? "active" : ""}`}
              style={{ background: sortBy === s ? "#EFF6FF" : "#F1F5F9", color: sortBy === s ? "#2563EB" : "#475569" }}
              onClick={() => setSortBy(s)}
            >
              {s === "most" ? "Most Requested" : s === "alpha" ? "A-Z" : "By Category"}
            </button>
          ))}
        </div>
        <button className="action-btn" style={{ color: "#DC2626", borderColor: "#FCA5A5" }} onClick={handleReset}>
          <RefreshCw size={12} /> Reset All
        </button>
      </div>

      {/* Top 5 chart */}
      {top5.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <TrendingUp size={14} /> Top Requested Features
          </div>
          {top5.map((f, i) => (
            <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < top5.length - 1 ? 10 : 0 }}>
              <div style={{ width: 18, fontSize: 12, fontWeight: 700, color: "#64748B", textAlign: "right" }}>#{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{f.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#2563EB" }}>{f.count}</span>
                </div>
                <div style={{ height: 6, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(f.count / maxCount) * 100}%`, background: "linear-gradient(90deg, #3B82F6, #6366F1)", borderRadius: 3, transition: "width 0.3s" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Categories */}
      {sortedCategories.map(cat => {
        const expanded = expandedCats.has(cat.name);
        const catCustom = customFeatures.filter(f => f.category === cat.name);
        const allCatFeatures = [...cat.features, ...catCustom];
        const catTotal = allCatFeatures.reduce((sum, f) => sum + (votes[f.id]?.count || 0), 0);
        const features = sortBy === "most"
          ? [...allCatFeatures].sort((a, b) => (votes[b.id]?.count || 0) - (votes[a.id]?.count || 0))
          : allCatFeatures;

        return (
          <div key={cat.name} style={{ marginBottom: 12 }}>
            <div
              onClick={() => toggleCat(cat.name)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px", background: "#fff", border: "1px solid #E2E8F0",
                borderRadius: expanded ? "12px 12px 0 0" : 12, cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ChevronDown size={14} style={{ transform: expanded ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.15s", color: "#64748B" }} />
                <span style={{ fontSize: 13, fontWeight: 700 }}>{cat.name}</span>
              </div>
              {catTotal > 0 && (
                <span style={{ fontSize: 11, fontWeight: 700, color: "#2563EB", background: "#EFF6FF", padding: "2px 8px", borderRadius: 10 }}>
                  {catTotal} vote{catTotal !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            {expanded && (
              <div style={{ border: "1px solid #E2E8F0", borderTop: "none", borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
                {features.map((f, i) => {
                  const count = votes[f.id]?.count || 0;
                  const weekly = getWeeklyCount(f.id);
                  const isCustom = f.id.startsWith("custom_");
                  return (
                    <div
                      key={f.id}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "12px 16px",
                        borderBottom: i < features.length - 1 ? "1px solid #F1F5F9" : "none",
                        background: i % 2 === 0 ? "#FAFBFD" : "#fff",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                          {f.name}
                          {isCustom && <span style={{ fontSize: 9, color: "#8B5CF6", background: "#F5F3FF", padding: "1px 5px", borderRadius: 4, fontWeight: 700 }}>Custom</span>}
                        </div>
                        <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{f.desc}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, marginLeft: 16 }}>
                        {weekly > 0 && (
                          <span style={{ fontSize: 9, color: "#059669", fontWeight: 600 }}>{weekly} this week</span>
                        )}
                        <span style={{ fontSize: 14, fontWeight: 800, color: count > 0 ? "#0F172A" : "#CBD5E1", minWidth: 24, textAlign: "right" }}>{count}</span>
                        <button
                          className="action-btn primary"
                          style={{ fontSize: 11, padding: "4px 10px" }}
                          onClick={() => handleVote(f.id)}
                        >
                          +1
                        </button>
                        {isCustom && (
                          <button
                            className="action-btn"
                            style={{ fontSize: 10, padding: "3px 6px", color: "#DC2626", borderColor: "#FCA5A5" }}
                            onClick={() => removeCustomFeature(f.id)}
                          >
                            <XCircle size={10} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {/* Add feature */}
                {addingTo === cat.name ? (
                  <div style={{ padding: "12px 16px", background: "#F8FAFC", display: "flex", flexDirection: "column", gap: 6 }}>
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Feature name"
                      autoFocus
                      style={{ padding: "6px 10px", border: "1px solid #E2E8F0", borderRadius: 6, fontSize: 12, outline: "none" }}
                    />
                    <input
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Short description (optional)"
                      style={{ padding: "6px 10px", border: "1px solid #E2E8F0", borderRadius: 6, fontSize: 12, outline: "none" }}
                    />
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="action-btn primary" style={{ fontSize: 11 }} onClick={() => addCustomFeature(cat.name)}>Add</button>
                      <button className="action-btn" style={{ fontSize: 11 }} onClick={() => { setAddingTo(null); setNewName(""); setNewDesc(""); }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setAddingTo(cat.name)}
                    style={{ padding: "10px 16px", fontSize: 12, color: "#64748B", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, borderTop: "1px solid #F1F5F9" }}
                  >
                    <Plus size={12} /> Add feature
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function InboundLeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((d) => setLeads(d.leads || []))
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
        <Loader2 size={24} className="spin" />
      </div>
    );
  }

  return (
    <div className="admin-table-wrap">
      <div style={{ marginBottom: 16, fontSize: 13, color: "#64748B" }}>
        {leads.length} lead{leads.length !== 1 ? "s" : ""} captured
      </div>
      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Source</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", color: "#94A3B8", padding: 40 }}>
                  No inbound leads yet
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id}>
                  <td style={{ fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Mail size={14} style={{ color: "#64748B" }} />
                      {lead.email}
                    </div>
                  </td>
                  <td>{lead.source || "landing_hero"}</td>
                  <td style={{ color: "#64748B" }}>
                    {new Date(lead.created_at).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
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
  const auditedClinics = filtered.filter(
    (c) => c.status === "audited" || c.status === "audit_sent" || (Array.isArray(c.scraped_data?.audit_findings) && c.scraped_data.audit_findings.length === 3)
  );

  const counts = {
    discover: 0,
    new_clinics: clinics.filter((c) => c.status === "new").length,
    previews: clinics.filter((c) => c.status === "scraped" || c.status === "preview_generated").length,
    audited: clinics.filter((c) => Array.isArray(c.scraped_data?.audit_findings) && c.scraped_data.audit_findings.length === 3).length,
    outreach: clinics.filter((c) => c.scraped_data?.draft).length,
    pipeline: clinics.filter((c) => PIPELINE_STATUSES.includes(c.status) && c.status !== "new" && c.status !== "preview_generated" && c.status !== "scraped").length,
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
      const noContact = results.filter((r: any) => r.status === "no_contact_found" || r.status === "no_website");
      const parts: string[] = [];
      if (enriched.length > 0) {
        const emails = enriched.filter((r: any) => r.email).map((r: any) => `${r.email} (${r.name})`);
        parts.push(`Enriched ${enriched.length}: ${emails.join(", ") || "phone only"}`);
      }
      if (noContact.length > 0) {
        parts.push(`${noContact.length} with no contact info found on site`);
      }
      alert(parts.join(". ") || "Enrichment complete.");
    } catch {
      alert("Enrichment failed.");
    }
    setActionLoading(null);
  }

  async function handleEnrichFromLinkedIn(clinicId: string, linkedinUrl: string) {
    setActionLoading("enrich");
    try {
      const res = await fetch("/api/admin/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicIds: [clinicId], linkedinUrl }),
      });
      const data = await res.json();
      await fetchClinics();
      const results = data.results || [];
      const enriched = results.filter((r: any) => r.status === "enriched");
      if (enriched.length > 0) {
        const r = enriched[0];
        alert(`Enriched from LinkedIn: ${r.personalEmail || r.workEmail || "no email found"}${r.phone ? `, ${r.phone}` : ""}`);
      } else {
        alert("Enrichment completed but no contact details found.");
      }
      setSelectedClinic(null);
    } catch {
      alert("Enrichment from LinkedIn failed.");
    }
    setActionLoading(null);
  }

  async function handleAudit(ids: string[]) {
    setActionLoading("audit");
    try {
      const res = await fetch("/api/admin/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicIds: ids }),
      });
      const data = await res.json();
      await fetchClinics();
      setSelectedIds(new Set());
      const results = data.results || [];
      const audited = results.filter((r: any) => r.status === "audited").length;
      const skipped = results.filter((r: any) => r.status === "skipped").length;
      alert(`Audited ${audited} clinic(s)${skipped > 0 ? `. ${skipped} skipped (no scraped data).` : "."}`);
    } catch {
      alert("Audit failed. Check that ANTHROPIC_API_KEY is set.");
    }
    setActionLoading(null);
  }

  async function handleExport(ids?: string[]) {
    setActionLoading("export");
    try {
      // If no ids provided, export all audited clinics with email
      const exportIds = ids && ids.length > 0
        ? ids
        : clinics
            .filter((c) =>
              c.contact_email &&
              Array.isArray(c.scraped_data?.audit_findings) &&
              c.scraped_data.audit_findings.length === 3
            )
            .map((c) => c.id);

      if (exportIds.length === 0) {
        alert("No clinics to export (need email + audit findings).");
        setActionLoading(null);
        return;
      }

      const res = await fetch("/api/admin/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicIds: exportIds }),
      });

      if (!res.ok) throw new Error("Export failed");

      const totalCount = res.headers.get("X-Total-Count") || "0";
      const withEmail = res.headers.get("X-With-Email") || "0";
      const withoutEmail = res.headers.get("X-Without-Email") || "0";
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1]
        || `clinictech-outreach-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const msg = `CSV downloaded — ${totalCount} clinics (${withEmail} with email, ${withoutEmail} without).`;
      alert(msg);
    } catch {
      alert("Export failed.");
    }
    setActionLoading(null);
  }

  async function handleFollowupDraft(clinicId: string, followupNumber: 1 | 2) {
    setActionLoading(`followup-${followupNumber}-${clinicId}`);
    try {
      await fetch("/api/admin/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicId, followupNumber }),
      });
      await fetchClinics();
    } catch {
      alert("Failed to draft follow-up.");
    }
    setActionLoading(null);
  }

  async function handleSendFollowup(clinicId: string, followupNumber: 1 | 2) {
    const draftKey = followupNumber === 1 ? "followup_1_draft" : "followup_2_draft";
    setActionLoading(`send-followup-${followupNumber}-${clinicId}`);
    try {
      const res = await fetch("/api/admin/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicId, draftKey }),
      });
      const data = await res.json();
      await fetchClinics();
      if (data.emailSent) {
        alert(`Follow-up ${followupNumber} sent to ${data.to}`);
      } else {
        alert(data.message || `Follow-up ${followupNumber} marked as sent`);
      }
    } catch {
      alert("Send failed");
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

  async function handleDeleteClinic(clinicId: string) {
    try {
      await fetch("/api/admin/clinics", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: clinicId }),
      });
      if (selectedClinic?.id === clinicId) setSelectedClinic(null);
      await fetchClinics();
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

  function selectPage(list: Clinic[], pageSize = 25) {
    const ids = list.slice(0, pageSize).map((c) => c.id);
    setSelectedIds(new Set(ids));
  }

  function selectAll(list: Clinic[]) {
    setSelectedIds(new Set(list.map((c) => c.id)));
  }

  // Pipeline / Kanban
  const [pipelineFilter, setPipelineFilter] = useState("all");
  const [dragClinicId, setDragClinicId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
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
    { id: "audited", label: "Audited", icon: Zap, count: counts.audited || undefined },
    { id: "outreach", label: "Outreach", icon: Send, count: counts.outreach || undefined },
    { id: "pipeline", label: "Pipeline", icon: Target, count: counts.pipeline || undefined },
    { id: "inbound", label: "Inbound Leads", icon: Mail, count: undefined },
    { id: "feedback", label: "Product Feedback", icon: MessageSquare, count: undefined },
    { id: "analytics", label: "Analytics", icon: BarChart3, count: undefined },
    { id: "settings", label: "Settings", icon: Settings, count: undefined },
  ];

  const pageTitles: Record<string, string> = {
    discover: "Discover Clinics",
    new_clinics: "New Clinics",
    previews: "Preview Manager",
    audited: "Audited Clinics",
    outreach: "Outreach",
    pipeline: "Pipeline",
    inbound: "Inbound Leads",
    feedback: "Product Feedback",
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
              {activePage !== "discover" && activePage !== "analytics" && activePage !== "settings" && activePage !== "inbound" && activePage !== "feedback" && (
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
              <button
                className="action-btn"
                onClick={() => handleExport(selectedIds.size > 0 ? Array.from(selectedIds) : undefined)}
                disabled={actionLoading === "export"}
                style={{ color: "#059669", borderColor: "#6EE7B7" }}
              >
                {actionLoading === "export" ? <><Loader2 size={12} className="spin" /> Exporting...</> : <><Download size={12} /> Export for Instantly</>}
              </button>
              <button className="action-btn" onClick={fetchClinics}><RefreshCw size={12} /> Refresh</button>
            </div>
          </div>

          {/* Stats bar — shown on non-discover/analytics/settings tabs */}
          {activePage !== "discover" && activePage !== "analytics" && activePage !== "settings" && activePage !== "inbound" && activePage !== "feedback" && (
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
                <div className="stat-label">Audited</div>
                <div className="stat-value" style={{ color: "#D97706" }}>{clinics.filter((c) => Array.isArray(c.scraped_data?.audit_findings) && c.scraped_data.audit_findings.length === 3).length}</div>
                <div className="stat-sub">With findings</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Meetings</div>
                <div className="stat-value" style={{ color: "#7C3AED" }}>{clinics.filter((c) => c.status === "meeting_booked").length}</div>
                <div className="stat-sub">Booked</div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && activePage !== "discover" && activePage !== "analytics" && activePage !== "inbound" && activePage !== "feedback" && (
            <div className="loading-center"><Loader2 size={20} className="spin" /> Loading clinics...</div>
          )}

          {/* ─── DISCOVER TAB ─── */}
          {activePage === "discover" && <DiscoverTab onRefresh={fetchClinics} />}

          {/* ─── NEW CLINICS TAB ─── */}
          {activePage === "new_clinics" && !loading && (
            <>
              {/* Selection helpers */}
              <div style={{ display: "flex", gap: 8, padding: "12px 28px 0", alignItems: "center" }}>
                <button className="action-btn" style={{ fontSize: 12 }} onClick={() => selectPage(newClinics)}>
                  Select 25
                </button>
                <button className="action-btn" style={{ fontSize: 12 }} onClick={() => selectAll(newClinics)}>
                  Select All ({newClinics.length})
                </button>
                {selectedIds.size > 0 && (
                  <button className="action-btn" style={{ fontSize: 12, color: "#94A3B8" }} onClick={() => setSelectedIds(new Set())}>
                    Clear Selection
                  </button>
                )}
              </div>
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
                  <button
                    className="action-btn"
                    style={{ fontSize: 12, color: "#FCD34D", borderColor: "#D97706" }}
                    onClick={() => handleAudit(Array.from(selectedIds))}
                    disabled={actionLoading === "audit"}
                  >
                    {actionLoading === "audit" ? <><Loader2 size={12} className="spin" /> Auditing...</> : <><Zap size={12} /> Run Audit</>}
                  </button>
                  <button
                    className="action-btn"
                    style={{ fontSize: 12, color: "#6EE7B7", borderColor: "#059669" }}
                    onClick={() => handleExport(Array.from(selectedIds))}
                    disabled={actionLoading === "export"}
                  >
                    {actionLoading === "export" ? <><Loader2 size={12} className="spin" /> Exporting...</> : <><Download size={12} /> Export CSV</>}
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
              <div style={{ display: "flex", gap: 8, padding: "12px 28px 0", alignItems: "center" }}>
                <button className="action-btn" style={{ fontSize: 12 }} onClick={() => selectPage(previewClinics)}>
                  Select 25
                </button>
                <button className="action-btn" style={{ fontSize: 12 }} onClick={() => selectAll(previewClinics)}>
                  Select All ({previewClinics.length})
                </button>
                {selectedIds.size > 0 && (
                  <button className="action-btn" style={{ fontSize: 12, color: "#94A3B8" }} onClick={() => setSelectedIds(new Set())}>
                    Clear Selection
                  </button>
                )}
              </div>
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
                  <button
                    className="action-btn"
                    style={{ fontSize: 12, color: "#FCD34D", borderColor: "#D97706" }}
                    onClick={() => handleAudit(Array.from(selectedIds))}
                    disabled={actionLoading === "audit"}
                  >
                    {actionLoading === "audit" ? <><Loader2 size={12} className="spin" /> Auditing...</> : <><Zap size={12} /> Run Audit</>}
                  </button>
                  <button
                    className="action-btn"
                    style={{ fontSize: 12, color: "#6EE7B7", borderColor: "#059669" }}
                    onClick={() => handleExport(Array.from(selectedIds))}
                    disabled={actionLoading === "export"}
                  >
                    {actionLoading === "export" ? <><Loader2 size={12} className="spin" /> Exporting...</> : <><Download size={12} /> Export CSV</>}
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

          {/* ─── AUDITED TAB ─── */}
          {activePage === "audited" && !loading && (
            <>
              <div style={{ display: "flex", gap: 8, padding: "12px 28px 0", alignItems: "center" }}>
                <button className="action-btn" style={{ fontSize: 12 }} onClick={() => selectPage(auditedClinics)}>
                  Select 25
                </button>
                <button className="action-btn" style={{ fontSize: 12 }} onClick={() => selectAll(auditedClinics)}>
                  Select All ({auditedClinics.length})
                </button>
                {selectedIds.size > 0 && (
                  <button className="action-btn" style={{ fontSize: 12, color: "#94A3B8" }} onClick={() => setSelectedIds(new Set())}>
                    Clear Selection
                  </button>
                )}
              </div>
              {selectedIds.size > 0 && (
                <div className="bulk-bar">
                  <span>{selectedIds.size} selected</span>
                  <button
                    className="action-btn"
                    style={{ fontSize: 12, color: "#C4B5FD", borderColor: "#7C3AED" }}
                    onClick={() => handleEnrich(Array.from(selectedIds))}
                    disabled={actionLoading === "enrich"}
                  >
                    {actionLoading === "enrich" ? <><Loader2 size={12} className="spin" /> Enriching...</> : <><Users size={12} /> Enrich Contacts</>}
                  </button>
                  <button
                    className="action-btn"
                    style={{ fontSize: 12, color: "#FCD34D", borderColor: "#D97706" }}
                    onClick={() => handleAudit(Array.from(selectedIds))}
                    disabled={actionLoading === "audit"}
                  >
                    {actionLoading === "audit" ? <><Loader2 size={12} className="spin" /> Re-auditing...</> : <><Zap size={12} /> Re-Audit</>}
                  </button>
                  <button
                    className="action-btn"
                    style={{ fontSize: 12, color: "#6EE7B7", borderColor: "#059669" }}
                    onClick={() => handleExport(Array.from(selectedIds))}
                    disabled={actionLoading === "export"}
                  >
                    {actionLoading === "export" ? <><Loader2 size={12} className="spin" /> Exporting...</> : <><Download size={12} /> Export CSV</>}
                  </button>
                  <button className="action-btn" style={{ color: "#94A3B8", borderColor: "#475569" }} onClick={() => setSelectedIds(new Set())}>Clear</button>
                </div>
              )}
              <div className="admin-table-wrap">
                <div className="admin-table">
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: 40 }}></th>
                        <th>Clinic</th>
                        <th>Contact</th>
                        <th>Findings</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditedClinics.map((clinic) => {
                        const findings: string[] = clinic.scraped_data?.audit_findings || [];
                        return (
                          <tr key={clinic.id} style={{ cursor: "pointer" }} onClick={() => setSelectedClinic(clinic)}>
                            <td onClick={(e) => e.stopPropagation()}>
                              <div
                                className={`cb ${selectedIds.has(clinic.id) ? "checked" : ""}`}
                                onClick={() => toggleId(clinic.id)}
                              >
                                {selectedIds.has(clinic.id) && <CheckCircle2 size={10} color="#fff" />}
                              </div>
                            </td>
                            <td>
                              <div className="clinic-name">{clinic.name}</div>
                              <div className="clinic-website"><Globe size={11} /> {clinic.website}</div>
                              {clinic.location && <div className="clinic-location">{clinic.location}</div>}
                            </td>
                            <td>
                              {(clinic.contact_email || clinic.contact_name) ? (
                                <div>
                                  {clinic.contact_name && <div style={{ fontWeight: 500 }}>{clinic.contact_name}</div>}
                                  {clinic.contact_email && <div style={{ fontSize: 12, color: clinic.contact_name ? "#94A3B8" : "#0F172A", fontWeight: clinic.contact_name ? 400 : 500 }}>{clinic.contact_email}</div>}
                                  {clinic.contact_phone && !clinic.contact_email && <div style={{ fontSize: 12, color: "#94A3B8" }}>{clinic.contact_phone}</div>}
                                </div>
                              ) : (
                                <span style={{ color: "#CBD5E1", fontSize: 12 }}>Not enriched</span>
                              )}
                            </td>
                            <td>
                              <div style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: 320 }}>
                                {findings.map((f: string, i: number) => (
                                  <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                                    <span style={{
                                      flexShrink: 0, width: 18, height: 18, borderRadius: "50%",
                                      background: "#FEF3C7", color: "#D97706", fontSize: 10, fontWeight: 700,
                                      display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                      {i + 1}
                                    </span>
                                    <span style={{ fontSize: 12, color: "#475569", lineHeight: "1.4" }}>{f}</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td onClick={(e) => e.stopPropagation()}>
                              <div style={{ display: "flex", gap: 4 }}>
                                {!clinic.contact_email && (
                                  <button
                                    className="action-btn"
                                    onClick={() => handleEnrich([clinic.id])}
                                    disabled={actionLoading === "enrich"}
                                    style={{ color: "#7C3AED", borderColor: "#C4B5FD" }}
                                  >
                                    <Users size={12} /> Enrich
                                  </button>
                                )}
                                <button
                                  className="action-btn"
                                  onClick={() => handleAudit([clinic.id])}
                                  disabled={actionLoading === "audit"}
                                  style={{ color: "#D97706", borderColor: "#FCD34D" }}
                                >
                                  <Zap size={12} /> Re-Audit
                                </button>
                                <button
                                  className="action-btn"
                                  onClick={() => handleExport([clinic.id])}
                                  disabled={actionLoading === "export"}
                                  style={{ color: "#059669", borderColor: "#6EE7B7" }}
                                >
                                  <Download size={12} /> Export
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {auditedClinics.length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#94A3B8" }}>
                            <Zap size={40} style={{ color: "#CBD5E1", marginBottom: 12, display: "block", margin: "0 auto 12px" }} />
                            <div style={{ fontWeight: 600, color: "#64748B", marginBottom: 4 }}>No audited clinics</div>
                            <div style={{ fontSize: 13 }}>Select clinics from New Clinics or Previews and run an audit.</div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
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
                outreachClinics.map((clinic) => (
                  <EditableDraftCard
                    key={clinic.id}
                    clinic={clinic}
                    actionLoading={actionLoading}
                    onSend={handleSend}
                    onSkip={() => handleStatusChange(clinic.id, "new")}
                    onSaveDraft={async (id, draft) => {
                      await fetch("/api/admin/status", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ clinicId: id, updateDraft: draft }),
                      });
                      await fetchClinics();
                    }}
                  />
                ))
              )}
            </div>
          )}

          {/* ─── PIPELINE TAB — Kanban ─── */}
          {activePage === "pipeline" && !loading && (
            <div className="kanban">
              {PIPELINE_STATUSES.map((status) => {
                const cfg = STATUS_CONFIG[status];
                const colClinics = filtered.filter((c) => c.status === status || (status === "preview_generated" && c.status === "scraped"));
                return (
                  <div
                    className={`kanban-col ${dragOverCol === status ? "drag-over" : ""}`}
                    key={status}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverCol(status); }}
                    onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverCol(status); }}
                    onDragLeave={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const { clientX, clientY } = e;
                      if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
                        setDragOverCol(null);
                      }
                    }}
                    onDrop={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const droppedId = e.dataTransfer.getData("text/plain") || dragClinicId;
                      setDragOverCol(null);
                      if (droppedId) {
                        setDragClinicId(null);
                        await handleStatusChange(droppedId, status);
                      }
                    }}
                  >
                    <div className="kanban-col-header">
                      <div className="kanban-col-title" style={{ color: cfg.color }}>
                        <cfg.icon size={14} />
                        {cfg.label}
                      </div>
                      <div className="kanban-col-count">{colClinics.length}</div>
                    </div>
                    <div className="kanban-col-body">
                      {dragOverCol === status && dragClinicId && (
                        <div className="kanban-drop-indicator" />
                      )}
                      {colClinics.map((clinic) => (
                        <div
                          className={`kanban-card ${dragClinicId === clinic.id ? "dragging" : ""}`}
                          key={clinic.id}
                          draggable
                          onDragStart={(e) => { e.dataTransfer.setData("text/plain", clinic.id); e.dataTransfer.effectAllowed = "move"; setDragClinicId(clinic.id); }}
                          onDragEnd={() => { setDragClinicId(null); setDragOverCol(null); }}
                          onClick={() => setSelectedClinic(clinic)}
                        >
                          <div className="kanban-card-name">{clinic.name}</div>
                          <div className="kanban-card-detail">
                            {clinic.contact_name || clinic.location || clinic.website}
                          </div>
                          <div className="kanban-card-meta">
                            {clinic.contact_email && (
                              <div className="kanban-card-tag" style={{ background: cfg.bg, color: cfg.color }}>
                                {clinic.contact_email.split("@")[0]}
                              </div>
                            )}
                            {clinic.contact_phone && (
                              <div className="kanban-card-tag" style={{ background: "#F0F9FF", color: "#0EA5E9" }}>
                                Phone
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {colClinics.length === 0 && !dragOverCol && (
                        <div style={{ padding: "20px 12px", textAlign: "center", fontSize: 11, color: "#94A3B8" }}>
                          No clinics
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ─── ANALYTICS TAB ─── */}
          {activePage === "inbound" && <InboundLeadsTab />}

          {activePage === "feedback" && <ProductFeedbackTab />}

          {activePage === "analytics" && <AnalyticsTab />}

          {/* ─── SETTINGS TAB ─── */}
          {activePage === "settings" && <SettingsTab />}
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
          onEnrichFromLinkedIn={(id, linkedinUrl) => {
            handleEnrichFromLinkedIn(id, linkedinUrl);
          }}
          onClearLogo={(id) => handleClearLogo(id)}
          onRescrape={(id) => handleRescrape(id)}
          onSaveProfile={async (id, data) => {
            // Extract linkedin_url and save it into scraped_data
            const { linkedin_url, ...profileFields } = data as any;
            const payload: any = { clinicId: id, updateProfile: profileFields };
            if (linkedin_url !== undefined) {
              payload.updateScrapedData = { linkedin_url };
            }
            await fetch("/api/admin/status", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            await fetchClinics();
            setSelectedClinic(null);
          }}
          onDelete={(id) => handleDeleteClinic(id)}
        />
      )}
    </>
  );
}
