"use client";

import { useState, useEffect } from "react";
import {
  Users, Calendar, DollarSign, Plus, Zap, MessageSquare, Search,
  Phone, Mail, Eye, Settings, UserPlus, X, Clock, Activity, ArrowUpRight, ArrowDownRight,
  Sparkles, Send, Globe, LayoutDashboard, UserCheck,
  User, Inbox, ArrowRight, CheckCircle2, Play,
} from "lucide-react";

/* ─── Brand Config ─── */
const DEFAULT_BRAND = {
  clinicName: "ResCore Clinic",
  logoUrl: "",
  primaryHue: 220,
  primarySat: 60,
  accentHue: 160,
  accentSat: 50,
  fontDisplay: "var(--font-dm-serif), 'DM Serif Display', Georgia, serif",
  fontBody: "var(--font-dm-sans), 'DM Sans', system-ui, sans-serif",
  tagline: "Regenerative Medicine & Stem Cell Therapy",
};

function parseBrandFromUrl() {
  if (typeof window === "undefined") return DEFAULT_BRAND;
  const p = new URLSearchParams(window.location.search);
  return {
    clinicName: p.get("name") || DEFAULT_BRAND.clinicName,
    logoUrl: p.get("logo") || DEFAULT_BRAND.logoUrl,
    primaryHue: parseInt(p.get("hue") || String(DEFAULT_BRAND.primaryHue)),
    primarySat: parseInt(p.get("sat") || String(DEFAULT_BRAND.primarySat)),
    accentHue: parseInt(p.get("ahue") || String(DEFAULT_BRAND.accentHue)),
    accentSat: parseInt(p.get("asat") || String(DEFAULT_BRAND.accentSat)),
    fontDisplay: p.get("fd") || DEFAULT_BRAND.fontDisplay,
    fontBody: p.get("fb") || DEFAULT_BRAND.fontBody,
    tagline: p.get("tag") || DEFAULT_BRAND.tagline,
  };
}

type Brand = ReturnType<typeof parseBrandFromUrl>;

/* ─── Data ─── */
const leads = [
  { id: "1", name: "Jennifer M.", email: "jennifer@email.com", phone: "(555) 123-4567", treatment: "Knee Stem Cell Therapy", value: 12000, stage: "new", source: "Website", assignedTo: "Dr. Chen", date: "Mar 15", notes: "Interested in non-surgical options", lastContact: "Mar 18" },
  { id: "2", name: "Michael T.", email: "michael@email.com", phone: "(555) 234-5678", treatment: "PRP Consultation", value: 5000, stage: "new", source: "Referral", assignedTo: "Dr. Chen", date: "Mar 14" },
  { id: "3", name: "Amanda S.", email: "amanda@email.com", phone: "(555) 345-6789", treatment: "Shoulder Regeneration", value: 8500, stage: "new", source: "Google Ads", assignedTo: "Sarah", date: "Mar 13" },
  { id: "4", name: "James P.", email: "james@email.com", phone: "(555) 456-7890", treatment: "Hip Treatment", value: 15000, stage: "new", source: "Facebook", assignedTo: "Sarah", date: "Mar 12" },
  { id: "5", name: "Robert K.", email: "robert@email.com", phone: "(555) 567-8901", treatment: "Hip Regeneration", value: 18000, stage: "consult", source: "Website", assignedTo: "Dr. Chen", date: "Mar 10" },
  { id: "6", name: "Sarah L.", email: "sarah@email.com", phone: "(555) 678-9012", treatment: "Shoulder PRP", value: 6500, stage: "consult", source: "Referral", assignedTo: "Dr. Chen", date: "Mar 9" },
  { id: "7", name: "Emily R.", email: "emily@email.com", phone: "(555) 789-0123", treatment: "Knee Therapy", value: 11000, stage: "consult", source: "Website", assignedTo: "Sarah", date: "Mar 8" },
  { id: "8", name: "Lisa W.", email: "lisa@email.com", phone: "(555) 890-1234", treatment: "Stem Cell - Knee", value: 15000, stage: "treatment", source: "Google Ads", assignedTo: "Dr. Chen", date: "Mar 5" },
  { id: "9", name: "Mark D.", email: "mark@email.com", phone: "(555) 901-2345", treatment: "Full Joint Care", value: 22000, stage: "treatment", source: "Website", assignedTo: "Dr. Chen", date: "Mar 3" },
  { id: "10", name: "David R.", email: "david@email.com", phone: "(555) 012-3456", treatment: "Post-PRP Check-in", value: 8000, stage: "followup", source: "Referral", assignedTo: "Sarah", date: "Feb 28" },
  { id: "11", name: "Susan T.", email: "susan@email.com", phone: "(555) 111-2222", treatment: "Recovery Review", value: 3000, stage: "followup", source: "Website", assignedTo: "Dr. Chen", date: "Feb 25" },
  { id: "12", name: "Brian C.", email: "brian@email.com", phone: "(555) 222-3333", treatment: "6-Month Follow-up", value: 2500, stage: "followup", source: "Website", assignedTo: "Sarah", date: "Feb 20" },
];

const stages = [
  { id: "new", label: "NEW LEAD", count: 4 },
  { id: "consult", label: "CONSULT BOOKED", count: 3 },
  { id: "treatment", label: "IN TREATMENT", count: 2 },
  { id: "followup", label: "FOLLOW-UP", count: 3 },
];

const appointments = [
  { patient: "Jennifer M.", type: "Consultation", time: "9:00 AM", date: "Today", status: "Confirmed" },
  { patient: "Robert K.", type: "Follow-up", time: "10:30 AM", date: "Today", status: "Pending" },
  { patient: "Lisa W.", type: "Treatment", time: "2:00 PM", date: "Today", status: "Confirmed" },
  { patient: "Mark D.", type: "Check-up", time: "9:00 AM", date: "Tomorrow", status: "Confirmed" },
];

const recentActivity = [
  { message: "Jennifer M. booked consultation", time: "Just now", icon: "calendar" as const, color: "primary" },
  { message: "Auto-followed up with 3 leads", time: "2m ago", icon: "zap" as const, color: "accent" },
  { message: "Sent testimonial request to Sarah L.", time: "12m ago", icon: "message" as const, color: "primary" },
  { message: "Phone call logged with Robert K.", time: "25m ago", icon: "phone" as const, color: "accent" },
];

const inboxMessages = [
  { from: "Jennifer M.", subject: "Re: Knee stem cell therapy consultation", preview: "Hi, I wanted to follow up on our call. I'm very interested in scheduling...", time: "10m", unread: true, status: "hot", suggestion: "She's ready to book. Suggest confirming the March 25th slot." },
  { from: "Alex T.", subject: "Contact form: PRP treatment inquiry", preview: "I've been dealing with chronic knee pain for 3 years...", time: "32m", unread: true, status: "new", suggestion: null },
  { from: "Robert K.", subject: "Rescheduling tomorrow's appointment", preview: "Something came up, would it be possible to move my 10:30?", time: "1h", unread: true, status: "patient", suggestion: "Next available: Thursday 2pm, Friday 9am." },
  { from: "Sarah L.", subject: "Re: Post-treatment feedback", preview: "The shoulder is feeling so much better! I'd be happy to share...", time: "3h", unread: false, status: "followup", suggestion: "Testimonial opportunity. Send the intake form?" },
];

const quickActions = [
  { title: "Morning briefing", desc: "New leads, today's schedule, pending follow-ups" },
  { title: "Follow up on stale leads", desc: "Draft emails for leads with no activity in 5+ days" },
  { title: "Pipeline report", desc: "Revenue by stage, conversion rates, trends" },
  { title: "Prep for consultation", desc: "Summarize a patient's history before their visit" },
];

/* ─── Styles ─── */
function injectStyles(brand: Brand) {
  const h = brand.primaryHue, s = brand.primarySat;
  const ah = brand.accentHue, as_ = brand.accentSat;
  return `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --primary: hsl(${h}, ${s}%, 42%);
      --primary-light: hsl(${h}, ${s}%, 95%);
      --primary-fg: #fff;
      --accent: hsl(${ah}, ${as_}%, 45%);
      --accent-light: hsl(${ah}, ${as_}%, 93%);
      --sidebar-bg: hsl(${h}, ${s+10}%, 16%);
      --sidebar-fg: hsl(${h}, 10%, 92%);
      --sidebar-active: hsl(${h}, ${s}%, 24%);
      --sidebar-primary: hsl(${ah}, ${as_}%, 50%);
      --bg: hsl(${h}, 15%, 97%);
      --card: #fff;
      --card-border: hsl(${h}, 12%, 90%);
      --fg: hsl(${h}, 20%, 14%);
      --muted: hsl(${h}, 8%, 55%);
      --muted-bg: hsl(${h}, 10%, 95%);
      --danger: hsl(0, 65%, 50%);
      --success: hsl(145, 55%, 42%);
      --warning: hsl(38, 90%, 50%);
      --font-display: ${brand.fontDisplay};
      --font-body: ${brand.fontBody};
      --radius: 10px;
    }
    body { background: var(--bg); color: var(--fg); font-family: var(--font-body); line-height: 1.5; -webkit-font-smoothing: antialiased; }
    .app { display: flex; min-height: 100vh; }

    /* Sidebar */
    .sidebar { width: 256px; background: var(--sidebar-bg); color: var(--sidebar-fg); display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; flex-shrink: 0; }
    .sidebar-header { height: 64px; display: flex; align-items: center; padding: 0 16px; border-bottom: 1px solid hsla(0,0%,100%,0.08); gap: 10px; }
    .sidebar-logo { height: 28px; width: auto; border-radius: 4px; }
    .sidebar-brand { font-family: var(--font-display); font-size: 18px; font-style: italic; letter-spacing: -0.3px; }
    .sidebar-nav { flex: 1; padding: 12px 10px; overflow-y: auto; }
    .nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.15s; color: hsla(0,0%,100%,0.6); position: relative; }
    .nav-item:hover { background: hsla(0,0%,100%,0.06); color: var(--sidebar-fg); }
    .nav-item.active { background: var(--sidebar-active); color: var(--sidebar-fg); }
    .nav-badge { position: absolute; right: 10px; background: var(--sidebar-primary); color: var(--sidebar-bg); font-size: 11px; font-weight: 700; min-width: 20px; height: 20px; border-radius: 10px; display: flex; align-items: center; justify-content: center; padding: 0 6px; }
    .sidebar-user { border-top: 1px solid hsla(0,0%,100%,0.08); padding: 14px 16px; display: flex; align-items: center; gap: 10px; }
    .avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
    .avatar-primary { background: var(--sidebar-primary); color: var(--sidebar-bg); }
    .avatar-sm { width: 32px; height: 32px; font-size: 11px; }

    /* Main */
    .main { flex: 1; overflow-x: hidden; padding-bottom: 60px; }
    .page { padding: 28px 32px; max-width: 1280px; }
    .page-title { font-family: var(--font-display); font-size: 24px; font-style: italic; font-weight: 400; margin-bottom: 4px; }
    .page-desc { font-size: 13px; color: var(--muted); margin-bottom: 24px; }

    /* Cards */
    .card { background: var(--card); border: 1px solid var(--card-border); border-radius: var(--radius); overflow: hidden; }
    .card-header { padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; }
    .card-title { font-size: 14px; font-weight: 600; }
    .card-body { padding: 0 20px 20px; }

    /* Stat Cards */
    .stats-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 24px; }
    .stat-card { background: var(--card); border: 1px solid var(--card-border); border-radius: var(--radius); padding: 16px; }
    .stat-card.highlight { background: var(--primary); color: var(--primary-fg); border-color: transparent; }
    .stat-card.highlight .stat-label { color: hsla(0,0%,100%,0.7); }
    .stat-card.highlight .stat-delta { color: hsla(0,0%,100%,0.7); }
    .stat-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .stat-label { font-size: 12px; font-weight: 500; color: var(--muted); }
    .stat-value { font-size: 26px; font-weight: 700; margin-top: 2px; }
    .stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
    .stat-delta { display: flex; align-items: center; gap: 4px; font-size: 12px; margin-top: 8px; }
    .delta-up { color: var(--success); }
    .delta-down { color: var(--danger); }

    /* Grid layouts */
    .grid-3-1 { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .space-y > * + * { margin-top: 14px; }

    /* Pipeline / Kanban */
    .pipeline { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .pipeline-col { background: var(--muted-bg); border-radius: var(--radius); padding: 12px; min-height: 200px; }
    .pipeline-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .pipeline-label { font-size: 11px; font-weight: 700; letter-spacing: 0.5px; color: var(--muted); }
    .pipeline-count { font-size: 11px; font-weight: 700; background: var(--card); border-radius: 6px; padding: 2px 8px; color: var(--fg); }
    .lead-card { background: var(--card); border: 1px solid var(--card-border); border-radius: 8px; padding: 12px; margin-bottom: 8px; cursor: pointer; transition: box-shadow 0.15s; }
    .lead-card:hover { box-shadow: 0 2px 8px hsla(0,0%,0%,0.08); }
    .lead-name { font-size: 13px; font-weight: 600; }
    .lead-treatment { font-size: 12px; color: var(--muted); margin-top: 2px; }
    .lead-meta { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
    .lead-value { font-size: 13px; font-weight: 700; color: var(--accent); }
    .lead-source { font-size: 11px; color: var(--muted); background: var(--muted-bg); padding: 2px 8px; border-radius: 4px; }

    /* Badges */
    .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; }
    .badge-primary { background: var(--primary-light); color: var(--primary); }
    .badge-accent { background: var(--accent-light); color: var(--accent); }
    .badge-success { background: hsl(145,55%,92%); color: var(--success); }
    .badge-warning { background: hsl(38,90%,92%); color: hsl(38,70%,35%); }
    .badge-outline { background: transparent; border: 1px solid var(--card-border); color: var(--muted); }
    .badge-hot { background: hsl(0,70%,94%); color: hsl(0,65%,45%); }

    /* Buttons */
    .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; transition: all 0.15s; font-family: var(--font-body); }
    .btn-primary { background: var(--primary); color: var(--primary-fg); }
    .btn-primary:hover { opacity: 0.9; }
    .btn-outline { background: transparent; border: 1px solid var(--card-border); color: var(--fg); }
    .btn-outline:hover { background: var(--muted-bg); }
    .btn-ghost { background: transparent; color: var(--muted); padding: 6px 8px; }
    .btn-sm { padding: 5px 10px; font-size: 12px; }

    /* Table */
    .table { width: 100%; border-collapse: collapse; }
    .table th { text-align: left; padding: 10px 16px; font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.4px; background: var(--muted-bg); border-bottom: 1px solid var(--card-border); }
    .table td { padding: 12px 16px; font-size: 13px; border-bottom: 1px solid var(--card-border); }
    .table tr:hover { background: hsla(0,0%,0%,0.015); }

    /* Activity */
    .activity-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; }
    .activity-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .activity-icon.primary { background: var(--primary-light); color: var(--primary); }
    .activity-icon.accent { background: var(--accent-light); color: var(--accent); }
    .activity-msg { font-size: 13px; font-weight: 500; }
    .activity-time { font-size: 11px; color: var(--muted); }

    /* Inbox */
    .inbox-layout { display: grid; grid-template-columns: 340px 1fr; height: calc(100vh - 140px); }
    .inbox-list { border-right: 1px solid var(--card-border); overflow-y: auto; }
    .inbox-item { padding: 14px 16px; border-bottom: 1px solid var(--card-border); cursor: pointer; transition: background 0.1s; }
    .inbox-item:hover { background: var(--muted-bg); }
    .inbox-item.active { background: var(--primary-light); }
    .inbox-item.unread .inbox-from { font-weight: 700; }
    .inbox-from { font-size: 13px; font-weight: 600; }
    .inbox-subject { font-size: 12px; color: var(--fg); margin-top: 2px; }
    .inbox-preview { font-size: 12px; color: var(--muted); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .inbox-time { font-size: 11px; color: var(--muted); }
    .inbox-detail { padding: 24px; overflow-y: auto; }
    .suggestion-card { background: hsl(38,90%,95%); border: 1px solid hsl(38,60%,82%); border-radius: 8px; padding: 14px; margin-top: 16px; }
    .suggestion-label { font-size: 12px; font-weight: 600; color: hsl(38,70%,35%); margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
    .suggestion-text { font-size: 13px; color: var(--fg); }

    /* AI Chat */
    .chat-layout { display: grid; grid-template-columns: 240px 1fr; height: calc(100vh - 32px); }
    .chat-sidebar { border-right: 1px solid var(--card-border); display: flex; flex-direction: column; }
    .chat-sidebar-header { padding: 12px; border-bottom: 1px solid var(--card-border); }
    .chat-list { flex: 1; overflow-y: auto; }
    .chat-list-group { padding: 4px 16px; font-size: 11px; font-weight: 600; color: var(--muted); }
    .chat-list-item { padding: 10px 16px; cursor: pointer; transition: background 0.1s; }
    .chat-list-item:hover { background: var(--muted-bg); }
    .chat-list-item.active { background: var(--muted-bg); }
    .chat-list-title { font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .chat-list-time { font-size: 11px; color: var(--muted); }
    .chat-area { display: flex; flex-direction: column; padding: 24px; }
    .chat-messages { flex: 1; overflow-y: auto; }
    .chat-bubble-user { max-width: 80%; margin-left: auto; background: var(--primary); color: var(--primary-fg); padding: 12px 16px; border-radius: 12px; font-size: 14px; margin-bottom: 16px; }
    .chat-bubble-ai { display: flex; gap: 12px; margin-bottom: 16px; }
    .chat-ai-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--primary); }
    .chat-ai-body { flex: 1; }
    .chat-ai-name { font-size: 13px; font-weight: 600; margin-bottom: 6px; }
    .workflow-card { border: 1px solid hsl(38,60%,82%); background: hsl(38,90%,96%); border-radius: 8px; padding: 14px; margin: 8px 0; }
    .workflow-card.active { border-color: hsl(145,50%,70%); background: hsl(145,60%,96%); }
    .workflow-title { font-size: 13px; font-weight: 600; color: hsl(38,70%,30%); margin-bottom: 8px; }
    .workflow-card.active .workflow-title { color: hsl(145,55%,30%); }
    .workflow-row { font-size: 13px; margin: 4px 0; }
    .workflow-row strong { font-weight: 600; }
    .chat-input-area { border-top: 1px solid var(--card-border); padding-top: 16px; }
    .chat-input { display: flex; gap: 8px; align-items: center; }
    .chat-input input { flex: 1; height: 48px; border: 1px solid var(--card-border); border-radius: 10px; padding: 0 16px; font-size: 14px; font-family: var(--font-body); background: var(--card); outline: none; }
    .chat-input input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }
    .chat-landing { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; text-align: center; }
    .chat-landing-icon { width: 64px; height: 64px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; color: var(--primary); margin-bottom: 16px; }
    .chat-landing h1 { font-family: var(--font-display); font-size: 30px; font-style: italic; margin-bottom: 8px; }
    .chat-landing p { color: var(--muted); font-size: 14px; margin-bottom: 24px; max-width: 400px; }
    .quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; max-width: 500px; width: 100%; }
    .quick-card { background: var(--muted-bg); padding: 14px; border-radius: 8px; text-align: left; cursor: pointer; transition: background 0.15s; border: none; font-family: var(--font-body); }
    .quick-card:hover { background: var(--card-border); }
    .quick-card-title { font-size: 13px; font-weight: 600; color: var(--fg); margin-bottom: 4px; }
    .quick-card-desc { font-size: 11px; color: var(--muted); }

    /* Powered by banner */
    .powered-banner { position: fixed; bottom: 0; left: 0; right: 0; background: linear-gradient(135deg, var(--sidebar-bg), hsl(${h}, ${s+10}%, 22%)); color: var(--sidebar-fg); padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; z-index: 100; }
    .powered-text { font-size: 13px; opacity: 0.8; }
    .powered-cta { display: inline-flex; align-items: center; gap: 8px; padding: 8px 20px; background: var(--sidebar-primary); color: var(--sidebar-bg); border-radius: 8px; font-size: 13px; font-weight: 700; border: none; cursor: pointer; font-family: var(--font-body); transition: transform 0.15s; }
    .powered-cta:hover { transform: translateY(-1px); }

    /* Animations */
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .animate-in { animation: fadeIn 0.3s ease-out forwards; }
    .delay-1 { animation-delay: 0.05s; opacity: 0; }
    .delay-2 { animation-delay: 0.1s; opacity: 0; }
    .delay-3 { animation-delay: 0.15s; opacity: 0; }
    .delay-4 { animation-delay: 0.2s; opacity: 0; }
  `;
}

/* ─── Icon helper ─── */
function ActivityIcon({ type }: { type: string }) {
  const size = 16;
  const icons: Record<string, React.ComponentType<{ size: number }>> = { calendar: Calendar, zap: Zap, message: MessageSquare, phone: Phone };
  const Icon = icons[type] || Activity;
  return <Icon size={size} />;
}

/* ─── Components ─── */

function Sidebar({ brand, activePage, onPageChange }: { brand: Brand; activePage: string; onPageChange: (page: string) => void }) {
  const navItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "inbox", label: "Inbox", icon: Inbox, badge: 3 },
    { id: "leads", label: "Leads", icon: Users },
    { id: "patients", label: "Patients", icon: UserCheck },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "insights", label: "ClinicIQ", icon: Sparkles },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        {brand.logoUrl ? (
          <img src={brand.logoUrl} alt={brand.clinicName} className="sidebar-logo" />
        ) : null}
        <span className="sidebar-brand">{brand.clinicName}</span>
      </div>
      <div className="sidebar-nav">
        {navItems.map(item => (
          <div
            key={item.id}
            className={`nav-item ${activePage === item.id ? "active" : ""}`}
            onClick={() => onPageChange(item.id)}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </div>
        ))}
      </div>
      <div className="sidebar-user">
        <div className="avatar avatar-primary">CT</div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--sidebar-fg)" }}>Admin</div>
          <div style={{ fontSize: 11, color: "hsla(0,0%,100%,0.5)" }}>admin@{brand.clinicName.toLowerCase().replace(/\s/g, "")}.com</div>
        </div>
      </div>
    </div>
  );
}

function OverviewPage({ brand }: { brand: Brand }) {
  const pipelineValue = leads.reduce((a, l) => a + l.value, 0);
  return (
    <div className="page">
      <h1 className="page-title">This Week at {brand.clinicName}</h1>
      <p className="page-desc">March 13 - March 19, 2026</p>

      <div className="stats-row">
        <div className="stat-card animate-in delay-1">
          <div className="stat-top">
            <div><div className="stat-label">New Leads</div><div className="stat-value">4</div></div>
            <div className="stat-icon" style={{ background: "var(--primary-light)", color: "var(--primary)" }}><UserPlus size={20} /></div>
          </div>
          <div className="stat-delta delta-up"><ArrowUpRight size={12} /> +2 from last week</div>
        </div>
        <div className="stat-card animate-in delay-2">
          <div className="stat-top">
            <div><div className="stat-label">Consults Booked</div><div className="stat-value">3</div></div>
            <div className="stat-icon" style={{ background: "var(--accent-light)", color: "var(--accent)" }}><Calendar size={20} /></div>
          </div>
          <div className="stat-delta delta-up"><ArrowUpRight size={12} /> +1 from last week</div>
        </div>
        <div className="stat-card animate-in delay-3">
          <div className="stat-top">
            <div><div className="stat-label">In Treatment</div><div className="stat-value">2</div></div>
            <div className="stat-icon" style={{ background: "var(--accent-light)", color: "var(--accent)" }}><Activity size={20} /></div>
          </div>
          <div className="stat-delta" style={{ color: "var(--muted)" }}>Same as last week</div>
        </div>
        <div className="stat-card animate-in delay-4">
          <div className="stat-top">
            <div><div className="stat-label">Follow-ups</div><div className="stat-value">3</div></div>
            <div className="stat-icon" style={{ background: "var(--primary-light)", color: "var(--primary)" }}><Clock size={20} /></div>
          </div>
          <div className="stat-delta delta-down"><ArrowDownRight size={12} /> -1 from last week</div>
        </div>
        <div className="stat-card highlight animate-in delay-4">
          <div className="stat-top">
            <div><div className="stat-label">Pipeline Value</div><div className="stat-value">${Math.round(pipelineValue/1000)}k</div></div>
            <div className="stat-icon" style={{ background: "hsla(0,0%,100%,0.2)" }}><DollarSign size={20} /></div>
          </div>
          <div className="stat-delta"><ArrowUpRight size={12} /> +18% this month</div>
        </div>
      </div>

      <div className="grid-3-1">
        <div className="space-y">
          <div className="card">
            <div className="card-header"><span className="card-title">Pipeline Overview</span></div>
            <div className="card-body">
              <div className="grid-4">
                {stages.map(s => (
                  <div key={s.id} style={{ background: "var(--muted-bg)", borderRadius: 8, padding: 14, cursor: "pointer", transition: "box-shadow 0.15s" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: "var(--muted)", marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>{s.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Today&apos;s Appointments</span></div>
            <div className="card-body">
              {appointments.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < appointments.length-1 ? "1px solid var(--card-border)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="avatar avatar-sm" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                      {a.patient.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{a.patient}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{a.type}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{a.time}</div>
                    <span className={`badge ${a.status === "Confirmed" ? "badge-success" : "badge-warning"}`}>{a.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y">
          <div className="card">
            <div className="card-header"><span className="card-title">Recent Activity</span></div>
            <div className="card-body">
              {recentActivity.map((a, i) => (
                <div key={i} className="activity-item">
                  <div className={`activity-icon ${a.color}`}><ActivityIcon type={a.icon} /></div>
                  <div style={{ flex: 1 }}>
                    <div className="activity-msg">{a.message}</div>
                    <div className="activity-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Quick Actions</span></div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="btn btn-primary" style={{ justifyContent: "center" }}><Plus size={14} /> Add New Lead</button>
              <button className="btn btn-outline" style={{ justifyContent: "center" }}><Calendar size={14} /> Schedule Appointment</button>
              <button className="btn btn-outline" style={{ justifyContent: "center" }}><Sparkles size={14} /> Ask ClinicIQ</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadsPage() {
  return (
    <div className="page">
      <h1 className="page-title">Leads</h1>
      <p className="page-desc">Manage your patient acquisition pipeline</p>
      <div className="pipeline">
        {stages.map(stage => {
          const stageLeads = leads.filter(l => l.stage === stage.id);
          return (
            <div key={stage.id} className="pipeline-col">
              <div className="pipeline-header">
                <span className="pipeline-label">{stage.label}</span>
                <span className="pipeline-count">{stageLeads.length}</span>
              </div>
              {stageLeads.map(lead => (
                <div key={lead.id} className="lead-card">
                  <div className="lead-name">{lead.name}</div>
                  <div className="lead-treatment">{lead.treatment}</div>
                  <div className="lead-meta">
                    <span className="lead-value">${lead.value.toLocaleString()}</span>
                    <span className="lead-source">{lead.source}</span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InboxPage({ brand }: { brand: Brand }) {
  const [selected, setSelected] = useState(0);
  const msg = inboxMessages[selected];
  return (
    <div className="page" style={{ padding: 0 }}>
      <div style={{ padding: "20px 24px 0" }}>
        <h1 className="page-title">Inbox</h1>
        <p className="page-desc">Messages and lead inquiries</p>
      </div>
      <div className="card" style={{ margin: "0 24px", borderRadius: "var(--radius)" }}>
        <div className="inbox-layout">
          <div className="inbox-list">
            {inboxMessages.map((m, i) => (
              <div key={i} className={`inbox-item ${i === selected ? "active" : ""} ${m.unread ? "unread" : ""}`} onClick={() => setSelected(i)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                  <span className="inbox-from">{m.from}</span>
                  <span className="inbox-time">{m.time}</span>
                </div>
                <div className="inbox-subject">{m.subject}</div>
                <div className="inbox-preview">{m.preview}</div>
                <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
                  {m.unread && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)", marginTop: 3 }} />}
                  <span className={`badge ${m.status === "hot" ? "badge-hot" : m.status === "new" ? "badge-primary" : "badge-outline"}`}>{m.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="inbox-detail">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 600 }}>{msg.from}</h2>
                <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 2 }}>{msg.subject}</p>
              </div>
              <span className="inbox-time">{msg.time} ago</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, marginTop: 16, color: "var(--fg)" }}>{msg.preview}</p>
            {msg.suggestion && (
              <div className="suggestion-card">
                <div className="suggestion-label"><Sparkles size={14} /> ClinicIQ suggestion</div>
                <p className="suggestion-text">{msg.suggestion}</p>
                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                  <button className="btn btn-primary btn-sm">Send suggested reply</button>
                  <button className="btn btn-outline btn-sm">Edit first</button>
                </div>
              </div>
            )}
            <div style={{ marginTop: 24, display: "flex", gap: 8, alignItems: "center" }}>
              <input type="text" placeholder="Type your reply..." style={{ flex: 1, height: 40, border: "1px solid var(--card-border)", borderRadius: 8, padding: "0 14px", fontSize: 13, fontFamily: "var(--font-body)", outline: "none" }} />
              <button className="btn btn-outline btn-sm"><Sparkles size={12} /> Draft with ClinicIQ</button>
              <button className="btn btn-primary btn-sm"><Send size={12} /> Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightsPage({ brand }: { brand: Brand }) {
  const [activeChat, setActiveChat] = useState("c1");
  const conversations = [
    { id: "c1", title: "Set up auto-responses for web leads", time: "10m ago", group: "Today" },
    { id: "c2", title: "Morning briefing", time: "2h ago", group: "Today" },
    { id: "c3", title: "Draft testimonial request", time: "Yesterday", group: "Yesterday" },
    { id: "c4", title: "Which lead source converts best?", time: "Yesterday", group: "Yesterday" },
  ];
  const groups = ["Today", "Yesterday"];

  return (
    <div className="chat-layout">
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}><Plus size={14} /> New conversation</button>
        </div>
        <div className="chat-list">
          {groups.map(g => (
            <div key={g}>
              <div className="chat-list-group">{g}</div>
              {conversations.filter(c => c.group === g).map(c => (
                <div key={c.id} className={`chat-list-item ${activeChat === c.id ? "active" : ""}`} onClick={() => setActiveChat(c.id)}>
                  <div className="chat-list-title">{c.title}</div>
                  <div className="chat-list-time">{c.time}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="chat-area">
        {activeChat === "" ? (
          <div className="chat-landing">
            <div className="chat-landing-icon"><Sparkles size={32} /></div>
            <h1>ClinicIQ</h1>
            <p>Your clinic&apos;s intelligent sidekick. Ask anything, get answers, take action.</p>
            <div className="quick-grid">
              {quickActions.map((a, i) => (
                <button key={i} className="quick-card" onClick={() => setActiveChat("c2")}>
                  <div className="quick-card-title">{a.title}</div>
                  <div className="quick-card-desc">{a.desc}</div>
                </button>
              ))}
            </div>
          </div>
        ) : activeChat === "c1" ? (
          <div className="chat-messages" style={{ flex: 1 }}>
            <div className="chat-bubble-user">Set up auto-responses for new website leads that come in after hours</div>
            <div className="chat-bubble-ai">
              <div className="chat-ai-avatar"><Sparkles size={14} /></div>
              <div className="chat-ai-body">
                <div className="chat-ai-name">ClinicIQ</div>
                <p style={{ fontSize: 14, marginBottom: 10 }}>I can set that up. Here&apos;s what I&apos;d recommend:</p>
                <div className="workflow-card">
                  <div className="workflow-title">Proposed workflow: After-hours web lead response</div>
                  <div className="workflow-row"><strong>Trigger:</strong> New form submission outside 7pm - 7am</div>
                  <div className="workflow-row"><strong>Action:</strong> Send personalized email within 5 minutes</div>
                  <div className="workflow-row"><strong>Follow-up:</strong> Flag lead as &ldquo;needs morning call&rdquo;</div>
                </div>
                <p style={{ fontSize: 14, marginTop: 10 }}>Want me to activate this?</p>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button className="btn btn-primary btn-sm">Activate this workflow</button>
                  <button className="btn btn-outline btn-sm">Edit the template first</button>
                </div>
              </div>
            </div>
            <div className="chat-bubble-user">Activate it, but make the window 7pm to 7am instead</div>
            <div className="chat-bubble-ai">
              <div className="chat-ai-avatar"><Sparkles size={14} /></div>
              <div className="chat-ai-body">
                <div className="chat-ai-name">ClinicIQ</div>
                <p style={{ fontSize: 14, marginBottom: 10 }}>Done. Your after-hours auto-response is now active.</p>
                <div className="workflow-card active">
                  <div className="workflow-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)" }} />
                    Workflow active
                  </div>
                  <div className="workflow-row">After-hours web lead auto-response (7pm - 7am)</div>
                </div>
                <p style={{ fontSize: 14, marginTop: 10 }}>You can toggle this on/off anytime from Settings. Anything else?</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="chat-messages" style={{ flex: 1 }}>
            <div className="chat-bubble-user">Morning briefing</div>
            <div className="chat-bubble-ai">
              <div className="chat-ai-avatar"><Sparkles size={14} /></div>
              <div className="chat-ai-body">
                <div className="chat-ai-name">ClinicIQ</div>
                <div style={{ background: "var(--muted-bg)", borderRadius: 8, padding: 16, marginTop: 8 }}>
                  <p style={{ fontSize: 14, marginBottom: 12 }}>Here&apos;s your morning overview:</p>
                  <div className="grid-2" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 12 }}>
                    {([["New Leads","2"],["Appointments Today","3"],["Pending Follow-ups","4"]] as const).map(([l,v]) => (
                      <div key={l} style={{ background: "var(--card)", border: "1px solid var(--card-border)", borderRadius: 8, padding: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted)" }}>{l}</div>
                        <div style={{ fontSize: 22, fontWeight: 700 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.6 }}>You have 3 appointments starting at 9:00 AM with Jennifer M. (consultation). Two leads haven&apos;t been contacted in over 5 days: <strong>Amanda S.</strong> and <strong>James P.</strong></p>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button className="btn btn-primary btn-sm">Draft follow-ups</button>
                    <button className="btn btn-outline btn-sm">Show me the leads</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="chat-input-area">
          <div className="chat-input">
            <input type="text" placeholder={`Ask ClinicIQ anything about ${brand.clinicName}...`} />
            <button className="btn btn-primary" style={{ height: 48, width: 48, padding: 0, justifyContent: "center" }}><Send size={18} /></button>
          </div>
          <p style={{ fontSize: 10, color: "var(--muted)", textAlign: "center", marginTop: 8 }}>ClinicIQ can access your leads, patients, inbox, and connected tools</p>
        </div>
      </div>
    </div>
  );
}

function PatientsPage() {
  const patients = [
    { name: "Lisa Williams", treatment: "Stem Cell - Knee", status: "In Treatment", progress: 65, next: "Mar 24" },
    { name: "Mark Davis", treatment: "Full Joint Care", status: "In Treatment", progress: 45, next: "Mar 20" },
    { name: "David Roberts", treatment: "Post-PRP Check-in", status: "Recovery", progress: 80, next: "Apr 5" },
    { name: "Susan Thompson", treatment: "Recovery Review", status: "Completed", progress: 100, next: "-" },
  ];
  return (
    <div className="page">
      <h1 className="page-title">Patients</h1>
      <p className="page-desc">Active patients and treatment progress</p>
      <div className="card">
        <table className="table">
          <thead><tr><th>Patient</th><th>Treatment</th><th>Status</th><th>Progress</th><th>Next Appt</th></tr></thead>
          <tbody>
            {patients.map((p, i) => (
              <tr key={i}>
                <td><div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="avatar avatar-sm" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>{p.name.split(" ").map(n=>n[0]).join("")}</div>
                  <span style={{ fontWeight: 600 }}>{p.name}</span>
                </div></td>
                <td>{p.treatment}</td>
                <td><span className={`badge ${p.status==="Completed" ? "badge-success" : p.status==="Recovery" ? "badge-accent" : "badge-primary"}`}>{p.status}</span></td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: "var(--muted-bg)", borderRadius: 3 }}>
                      <div style={{ height: "100%", width: `${p.progress}%`, background: p.progress === 100 ? "var(--success)" : "var(--accent)", borderRadius: 3, transition: "width 0.5s" }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, minWidth: 32 }}>{p.progress}%</span>
                  </div>
                </td>
                <td>{p.next}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AppointmentsPage() {
  return (
    <div className="page">
      <h1 className="page-title">Appointments</h1>
      <p className="page-desc">Manage clinic schedule and bookings</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline btn-sm">Today</button>
          <button className="btn btn-ghost btn-sm">This Week</button>
          <button className="btn btn-ghost btn-sm">This Month</button>
        </div>
        <button className="btn btn-primary btn-sm"><Plus size={14} /> New Appointment</button>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Patient</th><th>Type</th><th>Date</th><th>Time</th><th>Status</th></tr></thead>
          <tbody>
            {appointments.map((a, i) => (
              <tr key={i}>
                <td><div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="avatar avatar-sm" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>{a.patient.split(" ").map(n=>n[0]).join("")}</div>
                  <span style={{ fontWeight: 600 }}>{a.patient}</span>
                </div></td>
                <td>{a.type}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td><span className={`badge ${a.status==="Confirmed" ? "badge-success" : "badge-warning"}`}>{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsPage({ brand }: { brand: Brand }) {
  const integrations = [
    { name: "Gmail", desc: "See and send emails from your inbox", connected: true, as: `admin@${brand.clinicName.toLowerCase().replace(/\s/g, "")}.com` },
    { name: "Google Calendar", desc: "Sync appointments and availability", connected: true, as: `admin@${brand.clinicName.toLowerCase().replace(/\s/g, "")}.com` },
    { name: "Website Forms", desc: "Auto-import leads from your contact forms", connected: true },
    { name: "QuickBooks", desc: "Sync invoices and payment status", connected: false },
  ];
  return (
    <div className="page">
      <h1 className="page-title">Settings</h1>
      <p className="page-desc">Configure your clinic dashboard</p>
      <div className="space-y">
        <div className="card">
          <div className="card-header"><span className="card-title">Connected Integrations</span></div>
          <div className="card-body">
            {integrations.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: i < integrations.length-1 ? "1px solid var(--card-border)" : "none" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{t.desc}</div>
                  {t.as && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{t.as}</div>}
                </div>
                {t.connected ? (
                  <span className="badge badge-success"><span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)" }} /> Connected</span>
                ) : (
                  <button className="btn btn-outline btn-sm">Connect</button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Automation Rules</span></div>
          <div className="card-body">
            {[
              { name: "After-hours web lead auto-response", desc: "Auto-respond to leads between 7pm - 7am", on: true, ai: true },
              { name: "Auto-follow up new leads", desc: "Follow-up email after 3 days of no response", on: true, ai: false },
              { name: "Send appointment reminders", desc: "Reminder 24 hours before scheduled appointments", on: true, ai: false },
              { name: "Request testimonials", desc: "Send request 2 weeks after treatment completion", on: false, ai: false },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--card-border)" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</span>
                    {r.ai && <span className="badge badge-primary" style={{ fontSize: 10 }}>via ClinicIQ</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{r.desc}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 36, height: 20, borderRadius: 10, background: r.on ? "var(--accent)" : "var(--card-border)", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: r.on ? 18 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                  </div>
                  <span style={{ fontSize: 12, color: "var(--muted)", width: 20 }}>{r.on ? "On" : "Off"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main App ─── */
export default function ClinicTechPreview() {
  const [brand, setBrand] = useState(DEFAULT_BRAND);
  const [activePage, setActivePage] = useState("overview");

  useEffect(() => {
    setBrand(parseBrandFromUrl());
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "overview": return <OverviewPage brand={brand} />;
      case "leads": return <LeadsPage />;
      case "inbox": return <InboxPage brand={brand} />;
      case "patients": return <PatientsPage />;
      case "appointments": return <AppointmentsPage />;
      case "insights": return <InsightsPage brand={brand} />;
      case "settings": return <SettingsPage brand={brand} />;
      default: return <OverviewPage brand={brand} />;
    }
  };

  return (
    <>
      <style>{injectStyles(brand)}</style>
      <div className="app">
        <Sidebar brand={brand} activePage={activePage} onPageChange={setActivePage} />
        <div className="main">
          {renderPage()}
        </div>
      </div>
      <div className="powered-banner">
        <span className="powered-text">This is a personalized preview of ClinicTech for <strong>{brand.clinicName}</strong></span>
        <button className="powered-cta">
          <Sparkles size={14} />
          Get Started with ClinicTech
          <ArrowRight size={14} />
        </button>
      </div>
    </>
  );
}
