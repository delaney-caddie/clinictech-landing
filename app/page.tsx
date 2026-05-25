"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { SiteNav } from "@/components/site-nav";

const CALENDAR_URL = "https://calendar.app.google/YvNVdxRdiXVhjXQDA";

const agents = [
  {
    name: "Mia",
    slug: "mia",
    role: "Patient Coordinator",
    color: "#2563EB",
    tint: "rgba(37,99,235,0.08)",
    border: "rgba(37,99,235,0.22)",
    headline: "Never lose a patient to a slow reply.",
    body: "Answers new leads the moment they come in, runs follow-up cadences, books consults, cites real patient stories when it helps the sale, loops your team in the moment a conversation needs a human.",
    badge: null as string | null,
  },
  {
    name: "Atlas",
    slug: "atlas",
    role: "Protocol Architect",
    color: "#D97706",
    tint: "rgba(217,119,6,0.08)",
    border: "rgba(217,119,6,0.22)",
    headline: "Highly customized protocols. Doctor reviews instead of writes.",
    body: "Drafts multi-phase treatment protocols from intake notes, consult notes, and similar patient cases. Every draft waits for doctor sign-off. Nothing reaches a patient without it.",
    badge: "Doctor approval required",
  },
  {
    name: "Rio",
    slug: "rio",
    role: "Care Advocate",
    color: "#DB2777",
    tint: "rgba(219,39,119,0.08)",
    border: "rgba(219,39,119,0.22)",
    headline: "Turn happy patients into your marketing engine.",
    body: "Phased post-treatment check-ins on Day 7, 14, 30, 60, and 90. Asks for reviews and case studies when outcomes are strong. Escalates to your doctor the moment something sounds off.",
    badge: null,
  },
  {
    name: "Sage",
    slug: "sage",
    role: "Sales Coach",
    color: "#16A34A",
    tint: "rgba(22,163,74,0.08)",
    border: "rgba(22,163,74,0.22)",
    headline: "Turn more consults into booked patients.",
    body: "Daily pipeline brief. Watches what Mia does and proposes new rules you can accept in one click. Internal only.",
    badge: "Internal only",
  },
  {
    name: "Tomas",
    slug: "tomas",
    role: "Growth Marketer",
    color: "#7C3AED",
    tint: "rgba(124,58,237,0.08)",
    border: "rgba(124,58,237,0.22)",
    headline: "Turn ad spend into booked patients.",
    body: "Plans and runs your Google, Meta, and LinkedIn campaigns. Writes ad copy built for regenerative medicine patients. Optimizes against one number that matters: cost per booked consult. Every lead lands in your pipeline where Mia picks it up.",
    badge: "Budget-capped",
  },
];

const platformBits = [
  "CRM and pipeline",
  "Smart intake forms",
  "Protocol builder",
  "AI chat widget",
  "Patient portal",
  "Review capturing",
  "Follow-up sequences",
];

const platformMockups = [
  { slug: "home", label: "Home", caption: "Daily activity feed across all your agents" },
  { slug: "pipeline", label: "Pipeline", caption: "Lead pipeline with agent-aware drawer" },
  { slug: "patient-stories", label: "Patient stories", caption: "Reviews, testimonials, and case studies in one library" },
];

const mockupCaptions: Record<string, string> = {
  mia: "Mia, Patient Coordinator",
  atlas: "Atlas, Protocol Architect",
  rio: "Rio, Care Advocate",
  sage: "Sage, Sales Coach",
  tomas: "Tomas, Growth Marketer",
  home: "Home, daily activity across your agents",
  pipeline: "Pipeline with agent-aware drawer",
  "patient-stories": "Patient stories library",
};

const testimonials = [
  { name: "Dr. Carlos M.", role: "Medical Director", location: "Regenerative clinic, Tijuana", stat: "22 hrs/wk saved", quote: "I used to spend half my day on WhatsApp coordinating travel for international patients. Flights, hotels, pickups. Now patients handle it themselves through the portal. I actually get to focus on patient care instead of logistics." },
  { name: "Sofia R.", role: "Patient Coordinator", location: "Multi-location stem cell network", stat: "3 second response time", quote: "Our response time dropped from over a day to under 3 seconds. That alone changed everything. Patients were booking with competitors because we were too slow. Now we are always the first clinic to reply." },
  { name: "Dr. James L.", role: "Clinic Owner", location: "Regenerative medicine, US", stat: "+5 bookings/month", quote: "We were getting inquiries but barely booking any. After switching our intake to ClinicTech, we picked up an extra 5 consultations a month just from leads that would have gone cold. The follow-up sequences run themselves." },
];

export default function LandingPage() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const openLightbox = useCallback((slug: string) => setLightbox(slug), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox]);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(20px)";
      (el as HTMLElement).style.transition = "all 0.6s ease";
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  background: #fff;
  color: #0F172A;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

/* Buttons */
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 32px;
  background: #3730A3; color: #fff;
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-weight: 700; font-size: 15px;
  border: none; border-radius: 100px; cursor: pointer; text-decoration: none;
  transition: all 0.2s;
}
.btn-primary:hover {
  background: #4338CA; box-shadow: 0 4px 16px rgba(55,48,163,0.3); transform: translateY(-1px);
}
.btn-secondary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 13px 28px;
  background: transparent; color: #3730A3;
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-weight: 700; font-size: 15px;
  border: 1.5px solid rgba(55,48,163,0.2); border-radius: 100px;
  cursor: pointer; text-decoration: none; transition: all 0.2s;
}
.btn-secondary:hover { border-color: #3730A3; background: rgba(55,48,163,0.04); }
.btn-outline-white {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 32px;
  background: #fff; color: #3730A3;
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-weight: 700; font-size: 15px;
  border: 1.5px solid #E2E8F0; border-radius: 100px;
  cursor: pointer; text-decoration: none; transition: all 0.2s;
}
.btn-outline-white:hover { border-color: #3730A3; background: rgba(55,48,163,0.04); }

/* Section helpers */
.section-label {
  display: inline-block; font-size: 12px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1.5px; color: #3730A3; margin-bottom: 12px;
}
.section-title {
  font-size: 40px; font-weight: 800; line-height: 1.15; letter-spacing: -0.5px;
  color: #0F172A; margin-bottom: 16px;
}
.section-sub {
  font-size: 18px; line-height: 1.7; color: #475569; max-width: 640px;
}
.hl { color: #5EC4E3; }

/* ===== HERO ===== */
.hero-section {
  position: relative; padding: 160px 0 80px; overflow: hidden; background: #fff;
}
.hero-grid {
  display: grid; grid-template-columns: 1.15fr 1fr; gap: 48px; align-items: center;
  max-width: 1280px; margin: 0 auto; padding: 0 40px; position: relative; z-index: 1;
}
.hero-left { display: flex; flex-direction: column; align-items: flex-start; }
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 16px 6px 10px;
  background: rgba(94,196,227,0.1); border: 1px solid rgba(94,196,227,0.25);
  border-radius: 100px; font-size: 13px; font-weight: 600; color: #0E9AC0;
  margin-bottom: 24px;
}
.hero-badge .dot {
  width: 8px; height: 8px; background: #22C55E; border-radius: 50%;
  animation: pulse 2s ease infinite;
}
@keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
.hero-title {
  font-size: 48px; font-weight: 800; line-height: 1.12; letter-spacing: -1px;
  color: #0F172A; margin-bottom: 24px;
}
.hero-sub {
  font-size: 17px; line-height: 1.7; color: #475569; max-width: 560px; margin-bottom: 32px;
}
.hero-ctas { display: flex; gap: 16px; align-items: center; margin-bottom: 16px; }
.hero-see-link {
  color: #3730A3; font-weight: 600; font-size: 15px; text-decoration: none;
  display: inline-flex; align-items: center; gap: 4px;
}
.hero-see-link:hover { text-decoration: underline; }
.hero-source {
  font-size: 12px; color: #94A3B8; max-width: 480px; line-height: 1.5; margin-top: 8px;
}
.hero-right { position: relative; }

/* Audit mockup */
.audit-card {
  background: #fff; border: 1px solid #E2E8F0; border-radius: 16px;
  overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.08);
}
.audit-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 20px; background: #3730A3; color: #fff;
}
.audit-bar-left { display: flex; align-items: center; gap: 10px; }
.audit-bar-dots { display: flex; gap: 5px; }
.audit-bar-dots span { width: 10px; height: 10px; border-radius: 50%; }
.audit-bar-dots span:nth-child(1) { background: #FF5F57; }
.audit-bar-dots span:nth-child(2) { background: #FEBC2E; }
.audit-bar-dots span:nth-child(3) { background: #28C840; }
.audit-bar-title { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.9); }
.audit-body { padding: 24px; }
.audit-score-row {
  display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
}
.audit-score-circle {
  width: 72px; height: 72px; border-radius: 50%;
  border: 4px solid #EF4444; display: flex; flex-direction: column;
  align-items: center; justify-content: center; flex-shrink: 0;
}
.audit-score-num { font-size: 24px; font-weight: 800; color: #EF4444; line-height: 1; }
.audit-score-of { font-size: 11px; color: #94A3B8; }
.audit-score-text { font-size: 14px; font-weight: 700; color: #0F172A; }
.audit-rows { margin-bottom: 20px; }
.audit-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 0; border-bottom: 1px solid #F1F5F9; font-size: 13px;
}
.audit-row-name { color: #475569; flex: 1; }
.audit-row-status {
  font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 100px; margin: 0 12px;
}
.audit-row-status.poor { background: rgba(239,68,68,0.1); color: #EF4444; }
.audit-row-status.fair { background: rgba(245,158,11,0.1); color: #F59E0B; }
.audit-row-score { font-size: 12px; font-weight: 600; color: #94A3B8; }
.audit-lb { margin-bottom: 16px; }
.audit-lb-title { font-size: 12px; font-weight: 700; color: #0F172A; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
.audit-lb-row {
  display: flex; align-items: center; gap: 8px; padding: 5px 0;
  font-size: 12px; color: #475569;
}
.audit-lb-row.you { color: #EF4444; font-weight: 700; }
.audit-lb-rank { width: 28px; font-weight: 700; }
.audit-lb-name { flex: 1; }
.audit-lb-stars { color: #F59E0B; }
.audit-lb-score { font-weight: 600; color: #94A3B8; }
.audit-loss {
  background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.15);
  border-radius: 8px; padding: 10px 14px; font-size: 13px; font-weight: 700;
  color: #EF4444; text-align: center; margin-bottom: 16px;
}
.audit-fixes { margin-bottom: 16px; }
.audit-fix {
  display: flex; gap: 8px; font-size: 12px; color: #475569; margin-bottom: 6px; line-height: 1.5;
}
.audit-fix-x { color: #EF4444; font-weight: 700; flex-shrink: 0; }

/* DNA background */
.hero-dna-bg {
  position: absolute; bottom: 0; left: 0; right: 0; height: 50%; z-index: 0; pointer-events: none;
}
.hero-dna-wave { width: 100%; height: 100%; animation: waveFloat 8s ease-in-out infinite alternate; }
@keyframes waveFloat { 0%{transform:translateY(0) scale(1);} 100%{transform:translateY(-20px) scale(1.02);} }
.dna-wave-path { animation: waveDash 6s linear infinite; stroke-dasharray: 200 100; }
.dna-wave-2 { animation-delay: -3s; animation-duration: 7s; }
@keyframes waveDash { 0%{stroke-dashoffset:0;} 100%{stroke-dashoffset:-600;} }
.dna-rung-line { animation: rungPulse 2s ease-in-out infinite alternate; }
@keyframes rungPulse { 0%{opacity:0.03;} 100%{opacity:0.08;} }
.dna-bg-node { animation: bgNodePulse 3s ease-in-out infinite alternate; }
@keyframes bgNodePulse { 0%{opacity:0.08;} 100%{opacity:0.2;} }

/* ===== LOGO BAR ===== */
.logo-bar { padding: 40px 0; background: #fff; border-bottom: 1px solid #F1F5F9; overflow: hidden; }
.logo-bar-label {
  text-align: center; font-size: 12px; font-weight: 600; color: #94A3B8;
  text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 24px;
}
.logo-bar-track {
  display: flex; align-items: center; gap: 64px;
  animation: logoScroll 25s linear infinite;
  width: max-content;
}
.logo-bar-track img {
  height: 36px; max-width: 140px; width: auto; object-fit: contain; flex-shrink: 0;
}
@keyframes logoScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* ===== PROBLEM ===== */
.problem-section { padding: 100px 0; background: #F8FAFC; }
.problem-grid {
  display: grid; grid-template-columns: repeat(5,1fr); gap: 18px; margin-top: 48px;
}
.problem-card {
  background: #fff; border: 1px solid #E2E8F0; border-radius: 16px; padding: 32px 24px;
  transition: box-shadow 0.3s;
}
.problem-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.06); }
.problem-card h3 {
  font-size: 17px; font-weight: 700; color: #0F172A; margin-bottom: 12px; line-height: 1.35;
}
.problem-card p { font-size: 14px; line-height: 1.65; color: #64748B; }
.problem-card-icon {
  width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center;
  justify-content: center; font-size: 20px; margin-bottom: 16px;
}

/* ===== OUTCOME ===== */
.outcome-section { padding: 80px 0; text-align: center; }
.outcome-pills {
  display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 32px;
}
.outcome-pill {
  padding: 12px 24px; background: rgba(55,48,163,0.06); border: 1px solid rgba(55,48,163,0.12);
  border-radius: 100px; font-size: 14px; font-weight: 700; color: #3730A3;
}

/* ===== FEATURE BLOCKS ===== */
.feature-block { padding: 80px 0; }
.feature-block:nth-child(even) { background: #F8FAFC; }
.feature-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
  max-width: 1200px; margin: 0 auto; padding: 0 24px;
}
.feature-grid.reversed { direction: rtl; }
.feature-grid.reversed > * { direction: ltr; }
.feature-text .feature-label {
  font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;
  color: #5EC4E3; margin-bottom: 12px;
}
.feature-text h2 {
  font-size: 36px; font-weight: 800; line-height: 1.15; letter-spacing: -0.5px;
  color: #0F172A; margin-bottom: 16px;
}
.feature-text p { font-size: 16px; line-height: 1.7; color: #475569; }
.feature-visual {
  background: #fff; border: 1px solid #E2E8F0; border-radius: 16px;
  padding: 24px; min-height: 320px; box-shadow: 0 8px 30px rgba(0,0,0,0.04);
}

/* Chat mockup */
.chat-mockup-header {
  display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
  padding-bottom: 12px; border-bottom: 1px solid #F1F5F9;
}
.chat-mockup-dot {
  width: 36px; height: 36px; border-radius: 50%; background: #3730A3;
  display: flex; align-items: center; justify-content: center; color: #fff;
  font-size: 14px; font-weight: 700;
}
.chat-mockup-info { font-size: 13px; font-weight: 700; color: #0F172A; }
.chat-mockup-info span { display: block; font-size: 11px; color: #22C55E; font-weight: 600; }
.chat-msg {
  padding: 10px 14px; border-radius: 12px; margin-bottom: 10px;
  font-size: 13px; line-height: 1.55; max-width: 85%;
}
.chat-msg.user { background: #3730A3; color: #fff; margin-left: auto; border-bottom-right-radius: 4px; }
.chat-msg.bot { background: #F1F5F9; color: #0F172A; border-bottom-left-radius: 4px; }
.chat-msg .lang-tag {
  font-size: 10px; font-weight: 700; color: #94A3B8; margin-bottom: 4px; display: block;
}

/* Timeline mockup */
.timeline-mockup { display: flex; flex-direction: column; gap: 0; }
.timeline-step {
  display: flex; align-items: flex-start; gap: 14px; position: relative; padding-bottom: 20px;
}
.timeline-step:last-child { padding-bottom: 0; }
.timeline-node {
  width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center;
  justify-content: center; font-size: 14px; flex-shrink: 0; position: relative; z-index: 1;
}
.timeline-node.green { background: rgba(34,197,94,0.12); }
.timeline-node.blue { background: rgba(94,196,227,0.15); }
.timeline-node.amber { background: rgba(245,158,11,0.12); }
.timeline-node.navy { background: rgba(55,48,163,0.1); }
.timeline-step::before {
  content: ""; position: absolute; left: 15px; top: 32px; bottom: 0;
  width: 2px; background: #E2E8F0;
}
.timeline-step:last-child::before { display: none; }
.timeline-content h4 { font-size: 13px; font-weight: 700; color: #0F172A; margin-bottom: 2px; }
.timeline-content p { font-size: 12px; color: #64748B; }
.timeline-content .timeline-time { font-size: 11px; color: #94A3B8; margin-top: 2px; }

/* Booking mockup */
.booking-split { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.booking-phone {
  background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 20px; padding: 16px;
}
.booking-phone-header {
  font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 12px; text-align: center;
}
.booking-field {
  background: #fff; border: 1px solid #E2E8F0; border-radius: 8px;
  padding: 8px 12px; margin-bottom: 8px; font-size: 12px; color: #475569;
}
.booking-field-label { font-size: 10px; font-weight: 700; color: #94A3B8; margin-bottom: 2px; }
.booking-btn {
  width: 100%; padding: 10px; background: #3730A3; color: #fff; border: none;
  border-radius: 8px; font-size: 13px; font-weight: 700; margin-top: 8px; cursor: pointer;
}
.booking-admin { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; }
.booking-admin-title { font-size: 12px; font-weight: 700; color: #0F172A; margin-bottom: 12px; }
.booking-admin-row {
  display: flex; align-items: center; gap: 8px; padding: 8px 0;
  border-bottom: 1px solid #F1F5F9; font-size: 12px;
}
.booking-admin-dot { width: 8px; height: 8px; border-radius: 50%; }
.booking-admin-name { flex: 1; font-weight: 600; color: #0F172A; }
.booking-admin-tag {
  font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 100px;
}

/* Patient record mockup */
.record-card { display: flex; flex-direction: column; gap: 16px; }
.record-header {
  display: flex; align-items: center; gap: 12px; padding-bottom: 12px;
  border-bottom: 1px solid #F1F5F9;
}
.record-avatar {
  width: 40px; height: 40px; border-radius: 50%; background: #3730A3;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 16px; font-weight: 700;
}
.record-info h4 { font-size: 14px; font-weight: 700; color: #0F172A; }
.record-info span { font-size: 12px; color: #64748B; }
.record-tabs {
  display: flex; gap: 0; border-bottom: 1px solid #E2E8F0;
}
.record-tab {
  padding: 8px 16px; font-size: 12px; font-weight: 600; color: #94A3B8; cursor: pointer;
  border-bottom: 2px solid transparent;
}
.record-tab.active { color: #3730A3; border-bottom-color: #3730A3; }
.record-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.record-field-label { font-size: 10px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; }
.record-field-value { font-size: 13px; font-weight: 600; color: #0F172A; margin-top: 2px; }

/* ===== DAY IN LIFE ===== */
.daylife-section { padding: 100px 0; }
.daylife-layout {
  display: grid; grid-template-columns: 1fr 320px 1fr; gap: 32px;
  align-items: start; margin-top: 48px;
}
.daylife-col { display: flex; flex-direction: column; gap: 20px; padding-top: 40px; }
.daylife-col.right { padding-top: 120px; }
.daylife-label {
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1.5px; color: #94A3B8; margin-bottom: 4px;
}
.daylife-card {
  background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 20px 24px;
  transition: box-shadow 0.3s;
}
.daylife-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.04); }
.daylife-card-header {
  display: flex; align-items: center; gap: 8px; margin-bottom: 8px;
}
.daylife-card-icon {
  width: 28px; height: 28px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; flex-shrink: 0;
}
.daylife-card-title { font-size: 13px; font-weight: 700; color: #0F172A; }
.daylife-card-sub { font-size: 10px; color: #94A3B8; }
.daylife-card p { font-size: 13px; line-height: 1.55; color: #64748B; }
/* Phone mockup */
.daylife-phone {
  width: 280px; margin: 0 auto;
  background: #0F172A; border-radius: 36px; padding: 12px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.15);
}
.daylife-phone-notch {
  width: 100px; height: 24px; background: #0F172A; border-radius: 0 0 14px 14px;
  margin: 0 auto; position: relative; top: -1px;
}
.daylife-phone-screen {
  background: #fff; border-radius: 24px; overflow: hidden; min-height: 460px;
}
.daylife-phone-status {
  padding: 10px 16px 6px; font-size: 10px; font-weight: 600;
  display: flex; justify-content: space-between; color: #94A3B8;
}
.daylife-phone-wa-header {
  padding: 8px 14px; background: #075E54; color: #fff;
  display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700;
}
.daylife-phone-wa-avatar {
  width: 28px; height: 28px; border-radius: 50%; background: #25D366;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; color: #fff;
}
.daylife-phone-wa-online { font-size: 10px; font-weight: 400; opacity: 0.7; }
.daylife-phone-chat {
  padding: 12px; background: #ECE5DD; min-height: 340px;
  display: flex; flex-direction: column; gap: 6px;
}
.daylife-phone-msg {
  max-width: 85%; padding: 8px 12px; border-radius: 8px;
  font-size: 11px; line-height: 1.45; position: relative;
}
.daylife-phone-msg .msg-time {
  font-size: 9px; color: #94A3B8; float: right; margin-left: 8px; margin-top: 4px;
}
.daylife-phone-msg.bot {
  background: #fff; color: #0F172A; align-self: flex-start;
  border-top-left-radius: 2px;
}
.daylife-phone-msg.user {
  background: #DCF8C6; color: #0F172A; align-self: flex-end;
  border-top-right-radius: 2px;
}
.daylife-phone-msg.system {
  background: rgba(0,0,0,0.04); color: #64748B; align-self: center;
  font-size: 10px; border-radius: 6px; text-align: center;
  max-width: 90%; padding: 6px 12px;
}
.daylife-phone-divider {
  text-align: center; font-size: 10px; color: #94A3B8;
  background: rgba(0,0,0,0.04); padding: 3px 12px; border-radius: 6px;
  align-self: center; font-weight: 600;
}

/* ===== TESTIMONIALS ===== */
.testimonials-section { padding: 100px 0; background: #F8FAFC; }
.testimonials-pills {
  display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin: 24px 0 48px;
}
.testimonials-pill {
  padding: 8px 18px; background: #fff; border: 1px solid #E2E8F0;
  border-radius: 100px; font-size: 13px; font-weight: 600; color: #475569;
}
.testimonials-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 40px;
}
.testimonial-card {
  background: #fff; border: 1px solid #E2E8F0; border-radius: 16px; padding: 32px;
  display: flex; flex-direction: column; transition: box-shadow 0.3s;
}
.testimonial-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.06); }
.testimonial-stat {
  font-size: 22px; font-weight: 800; color: #3730A3; margin-bottom: 12px;
}
.testimonial-quote {
  font-size: 14px; line-height: 1.65; color: #475569; flex: 1; margin-bottom: 16px;
}
.testimonial-author {
  display: flex; align-items: center; gap: 10px; padding-top: 16px;
  border-top: 1px solid #F1F5F9;
}
.testimonial-avatar {
  width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,#3730A3,#5EC4E3);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 14px; font-weight: 700;
}
.testimonial-name { font-size: 13px; font-weight: 700; color: #0F172A; }
.testimonial-role { font-size: 12px; color: #94A3B8; }

/* ===== CALLOUT CARDS ===== */
.callout-section { padding: 100px 0; }
.callout-grid {
  display: grid; grid-template-columns: repeat(2,1fr); gap: 24px; margin-top: 48px;
}
.callout-card {
  background: #fff; border: 1px solid #E2E8F0; border-radius: 16px; padding: 32px;
  transition: box-shadow 0.3s;
}
.callout-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.06); }
.callout-card-icon {
  width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center;
  justify-content: center; font-size: 22px; margin-bottom: 16px;
}
.callout-card h3 { font-size: 20px; font-weight: 800; color: #0F172A; margin-bottom: 4px; }
.callout-card .callout-tagline { font-size: 14px; font-weight: 600; color: #5EC4E3; margin-bottom: 12px; }
.callout-card p { font-size: 14px; line-height: 1.65; color: #64748B; }

/* ===== PRODUCT TABS ===== */
.product-tabs-section { padding: 120px 0; background: #F8FAFC; }
.tabs-row {
  display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin: 40px 0 32px;
}
.tab-btn {
  padding: 10px 20px; background: #fff; border: 1px solid #E2E8F0; border-radius: 100px;
  font-size: 13px; font-weight: 600; color: #475569; cursor: pointer;
  transition: all 0.2s; font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
}
.tab-btn:hover { border-color: #3730A3; color: #3730A3; }
.tab-btn.active {
  background: #3730A3; color: #fff; border-color: #3730A3;
}
.tab-content {
  max-width: 1060px; margin: 0 auto; text-align: left;
  background: #fff; border: 1px solid #E2E8F0; border-radius: 20px; padding: 48px;
  display: grid; grid-template-columns: 1fr 1.1fr; gap: 48px; align-items: center;
  animation: fadeUp 0.3s ease;
  box-shadow: 0 8px 32px rgba(0,0,0,0.04);
}
.tab-content h3 { font-size: 26px; font-weight: 800; color: #0F172A; margin-bottom: 14px; }
.tab-content p { font-size: 15px; line-height: 1.7; color: #475569; }
.tab-mockup {
  background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px;
  overflow: hidden;
}
.tab-mockup-bar {
  padding: 8px 14px; background: #0F172A; color: #fff;
  font-size: 10px; font-weight: 600; display: flex; align-items: center; gap: 8px;
}
.tab-mockup-dots { display: flex; gap: 3px; }
.tab-mockup-dots span { width: 6px; height: 6px; border-radius: 50%; }
.tab-mockup-dots span:nth-child(1) { background: #FF5F57; }
.tab-mockup-dots span:nth-child(2) { background: #FEBC2E; }
.tab-mockup-dots span:nth-child(3) { background: #28C840; }
.tab-mockup-body { padding: 16px; }
.tab-mockup-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px; background: #fff; border: 1px solid #E2E8F0;
  border-radius: 8px; margin-bottom: 6px; font-size: 11px;
}
.tab-mockup-row:last-child { margin-bottom: 0; }
.tab-mockup-name { font-weight: 700; color: #0F172A; }
.tab-mockup-detail { color: #94A3B8; font-size: 10px; }
.tab-mockup-badge {
  font-size: 8px; font-weight: 700; padding: 2px 8px; border-radius: 100px;
  text-transform: uppercase;
}
.tab-mockup-badge.green { background: rgba(34,197,94,0.1); color: #22C55E; }
.tab-mockup-badge.amber { background: rgba(245,158,11,0.1); color: #D97706; }
.tab-mockup-badge.blue { background: rgba(55,48,163,0.08); color: #3730A3; }
.tab-mockup-badge.gray { background: #F1F5F9; color: #64748B; }
.tab-mockup-stat {
  text-align: center; padding: 12px; background: #fff;
  border: 1px solid #E2E8F0; border-radius: 8px; margin-bottom: 6px;
}
.tab-mockup-stat-num {
  font-size: 24px; font-weight: 800; color: #3730A3;
}
.tab-mockup-stat-label { font-size: 10px; color: #94A3B8; }
.tab-mockup-msg {
  padding: 10px 14px; border-radius: 10px; font-size: 11px;
  line-height: 1.4; margin-bottom: 6px; max-width: 85%;
}
.tab-mockup-msg.user {
  background: #3730A3; color: #fff; align-self: flex-end;
  margin-left: auto; border-bottom-right-radius: 4px;
}
.tab-mockup-msg.bot {
  background: #fff; border: 1px solid #E2E8F0; color: #0F172A;
  border-bottom-left-radius: 4px;
}
.tab-mockup-stars { color: #F59E0B; font-size: 12px; letter-spacing: 2px; }
.tab-mockup-checklist { display: flex; flex-direction: column; gap: 6px; }
.tab-mockup-check {
  display: flex; align-items: center; gap: 8px; font-size: 11px; color: #0F172A;
  padding: 8px 12px; background: #fff; border: 1px solid #E2E8F0; border-radius: 8px;
}
.tab-mockup-check-icon { color: #22C55E; font-weight: 700; }

/* ===== HOW IT WORKS ===== */
.how-section { padding: 100px 0; }
.how-steps {
  display: grid; grid-template-columns: repeat(3,1fr); gap: 32px; margin: 48px 0 40px;
}
.how-step {
  text-align: center; padding: 32px 24px;
  background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px;
}
.how-step-num {
  width: 48px; height: 48px; border-radius: 50%; background: #3730A3;
  color: #fff; font-size: 20px; font-weight: 800; display: flex; align-items: center;
  justify-content: center; margin: 0 auto 16px;
}
.how-step h3 { font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 10px; }
.how-step p { font-size: 14px; line-height: 1.65; color: #64748B; }
.how-cta { text-align: center; }

/* ===== FINAL CTA ===== */
.final-cta-section { padding: 100px 0; background: #F8FAFC; }
.final-cta-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 32px;
}
.final-cta-card {
  background: #fff; border: 1px solid #E2E8F0; border-radius: 16px; padding: 48px 40px;
  display: flex; flex-direction: column; align-items: flex-start;
}
.final-cta-card h3 { font-size: 28px; font-weight: 800; color: #0F172A; margin-bottom: 12px; }
.final-cta-card p { font-size: 15px; line-height: 1.65; color: #475569; margin-bottom: 24px; }

/* ===== FOOTER ===== */
.site-footer { padding: 60px 0 32px; border-top: 1px solid #E2E8F0; }
.footer-grid {
  display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 40px;
}
.footer-brand { display: flex; flex-direction: column; gap: 12px; }
.footer-brand-name {
  font-size: 20px; font-weight: 800; color: #0F172A; display: flex; align-items: center; gap: 8px;
}
.footer-brand p { font-size: 13px; color: #94A3B8; line-height: 1.6; }
.footer-col h4 {
  font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
  color: #94A3B8; margin-bottom: 16px;
}
.footer-col a {
  display: block; font-size: 14px; color: #475569; text-decoration: none;
  margin-bottom: 10px; transition: color 0.2s;
}
.footer-col a:hover { color: #3730A3; }
.footer-bottom {
  margin-top: 40px; padding-top: 24px; border-top: 1px solid #F1F5F9;
  font-size: 13px; color: #94A3B8; text-align: center;
}

/* ===== ANIMATIONS ===== */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ===== RESPONSIVE 900px ===== */
@media (max-width: 900px) {
  .hero-grid { grid-template-columns: 1fr; gap: 40px; }
  .hero-right { max-width: 480px; margin: 0 auto; }
  .hero-title { font-size: 36px; }
  .hero-section { padding: 130px 0 60px; }
  .problem-grid { grid-template-columns: repeat(2,1fr); }
  .section-title { font-size: 32px; }
  .feature-grid, .feature-grid.reversed { grid-template-columns: 1fr; direction: ltr; }
  .feature-grid.reversed > * { direction: ltr; }
  .feature-text h2 { font-size: 28px; }
  .testimonials-grid { grid-template-columns: 1fr 1fr; }
  .callout-grid { grid-template-columns: 1fr; }
  .tab-content { grid-template-columns: 1fr; }
  .tabs-row { gap: 6px; }
  .daylife-layout { grid-template-columns: 1fr; }
  .daylife-col { padding-top: 0 !important; }
  .daylife-phone { margin-bottom: 24px; }
  .how-steps { grid-template-columns: 1fr; }
  .final-cta-grid { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: repeat(2,1fr); }
  .tabs-row { gap: 6px; }
  .tab-btn { font-size: 12px; padding: 8px 14px; }
  .booking-split { grid-template-columns: 1fr; }
}

/* ===== RESPONSIVE 640px ===== */
@media (max-width: 640px) {
  .hero-grid { padding: 0 20px; }
  .hero-title { font-size: 28px; }
  .hero-sub { font-size: 15px; }
  .hero-ctas { flex-direction: column; align-items: flex-start; }
  .hero-section { padding: 110px 0 48px; }
  .problem-grid { grid-template-columns: 1fr; }
  .section-title { font-size: 26px; }
  .testimonials-grid { grid-template-columns: 1fr; }
  .outcome-pills { flex-direction: column; align-items: center; }
  .footer-grid { grid-template-columns: 1fr; gap: 24px; }
  .container { padding: 0 16px; }
  .feature-grid { gap: 32px; padding: 0 16px; }
  .feature-visual { padding: 16px; min-height: 240px; }
  .final-cta-card { padding: 32px 24px; }
  .tab-content { padding: 24px; }
  .record-fields { grid-template-columns: 1fr; }
}
      `}</style>

      <SiteNav />

      {/* ===== 1. HERO ===== */}
      <section className="hero-section">
        <div className="hero-dna-bg">
          <svg viewBox="0 0 1200 800" className="hero-dna-wave" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3730A3" stopOpacity="0.08"/>
                <stop offset="50%" stopColor="#5EC4E3" stopOpacity="0.12"/>
                <stop offset="100%" stopColor="#7DD4ED" stopOpacity="0.06"/>
              </linearGradient>
              <linearGradient id="waveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7DD4ED" stopOpacity="0.06"/>
                <stop offset="50%" stopColor="#5EC4E3" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="#3730A3" stopOpacity="0.08"/>
              </linearGradient>
            </defs>
            <path className="dna-wave-path" d="M-100,400 C100,200 300,600 500,350 C700,100 900,500 1100,300 C1300,100 1500,400 1500,400" fill="none" stroke="url(#waveGrad1)" strokeWidth="60" strokeLinecap="round"/>
            <path className="dna-wave-path dna-wave-2" d="M-100,350 C100,550 300,150 500,400 C700,650 900,250 1100,450 C1300,650 1500,350 1500,350" fill="none" stroke="url(#waveGrad2)" strokeWidth="60" strokeLinecap="round"/>
            {Array.from({length: 15}, (_, i) => {
              const x = 50 + i * 80;
              return <line key={i} x1={x} y1="300" x2={x} y2="450" stroke="rgba(94,196,227,0.06)" strokeWidth="2" className="dna-rung-line" style={{animationDelay: `${i * 0.2}s`}}/>;
            })}
            {Array.from({length: 12}, (_, i) => {
              const x = 80 + i * 100;
              return (
                <g key={i}>
                  <circle cx={x} cy={350 + Math.sin(i * 0.8) * 60} r="4" fill="rgba(55,48,163,0.15)" className="dna-bg-node" style={{animationDelay: `${i * 0.15}s`}}/>
                  <circle cx={x + 30} cy={400 - Math.sin(i * 0.8) * 60} r="3" fill="rgba(94,196,227,0.12)" className="dna-bg-node" style={{animationDelay: `${i * 0.15 + 0.5}s`}}/>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="hero-grid">
          <div className="hero-left" style={{animation: "fadeUp 0.8s ease both"}}>
            <div className="hero-badge">
              <span className="dot"></span>
              Built for regenerative medicine. Trusted by the top clinics worldwide.
            </div>
            <h1 className="hero-title">
              Built to grow your regen clinic. <span className="hl">Run by an AI team.</span>
            </h1>
            <p className="hero-sub">
              A team of AI staff for your regenerative medicine clinic, built on the platform that runs everything around them. Your team focuses on patients. ClinicTech handles the rest.
            </p>
            <div className="hero-ctas">
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">Book a demo &rarr;</a>
              <a href="#how-it-works" className="hero-see-link">See how it works &darr;</a>
            </div>
          </div>

          <div className="hero-right" style={{animation: "fadeUp 0.8s ease 0.3s both"}}>
            {/* AI Concierge chat mockup */}
            <div className="audit-card">
              <div className="audit-bar">
                <div className="audit-bar-left">
                  <div className="audit-bar-dots"><span></span><span></span><span></span></div>
                  <span className="audit-bar-title">AI Patient Concierge</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                  <span style={{width:6,height:6,borderRadius:"50%",background:"#22C55E",display:"inline-block"}}></span>
                  <span style={{fontSize:10,opacity:0.7}}>Online 24/7</span>
                </div>
              </div>
              <div className="audit-body" style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                <div style={{alignSelf:"flex-end",background:"#3730A3",color:"#fff",padding:"10px 14px",borderRadius:"12px 12px 4px 12px",fontSize:12,maxWidth:"80%",lineHeight:1.5}}>
                  I&apos;m interested in stem cell therapy for my knee. How much does it cost and do you help with travel from the US?
                </div>
                <div style={{alignSelf:"flex-start",background:"#F8FAFC",border:"1px solid #E2E8F0",padding:"10px 14px",borderRadius:"12px 12px 12px 4px",fontSize:12,maxWidth:"85%",lineHeight:1.5,color:"#0F172A"}}>
                  <div style={{display:"inline-flex",alignItems:"center",gap:"4px",fontSize:9,fontWeight:700,color:"#3730A3",background:"rgba(55,48,163,0.06)",padding:"2px 8px",borderRadius:100,marginBottom:6}}>&#10024; AI-Powered</div><br/>
                  Our stem cell therapy for knees ranges from $8,000-$15,000. We handle everything for US patients: airport pickup, hotel near the clinic, and a bilingual coordinator. Recovery is typically 1-2 days of rest.<br/><br/>
                  <strong>Would you like to book a free consultation with Dr. Rivera?</strong>
                </div>
                <div style={{alignSelf:"flex-end",background:"#3730A3",color:"#fff",padding:"10px 14px",borderRadius:"12px 12px 4px 12px",fontSize:12}}>
                  Yes, I&apos;d love to book a consultation.
                </div>
                <div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:8,fontSize:11,color:"#15803D",fontWeight:600}}>
                  <span>&#10003;</span> Consultation booked for Apr 22 at 10:00 AM with Dr. Rivera
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap" as const}}>
                  <span style={{fontSize:9,fontWeight:700,padding:"3px 10px",borderRadius:100,background:"rgba(34,197,94,0.1)",color:"#22C55E",textTransform:"uppercase" as const}}>Hot Lead</span>
                  <span style={{fontSize:9,fontWeight:700,padding:"3px 10px",borderRadius:100,border:"1.5px solid #22C55E",color:"#22C55E",textTransform:"uppercase" as const}}>Qualified</span>
                  <span style={{fontSize:9,fontWeight:700,padding:"3px 10px",borderRadius:100,background:"rgba(55,48,163,0.06)",color:"#3730A3",textTransform:"uppercase" as const}}>Auto-booked</span>
                </div>
                <div style={{fontSize:10,color:"#94A3B8",textAlign:"center" as const,paddingTop:4,borderTop:"1px solid #E2E8F0"}}>
                  Responded in 3 seconds - EN/ES - Trained on your clinic&apos;s content
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LOGO BAR ===== */}
      <section className="logo-bar">
        <div className="logo-bar-label">Backed by investors from</div>
        <div className="logo-bar-track">
          <img src="/logos/shopify.png" alt="Shopify" />
          <img src="/logos/deepmind.png" alt="Google DeepMind" style={{height: 44, maxWidth: 180}} />
          <img src="/logos/rewind.png" alt="Rewind" style={{height: 44, maxWidth: 160}} />
          <img src="/logos/fellow.png" alt="Fellow" />
          <img src="/logos/y-combinator.png" alt="Y Combinator" />
          <img src="/logos/noibu.webp" alt="Noibu" />
          <img src="/logos/mistral.avif" alt="Mistral" />
          <img src="/logos/shopify.png" alt="Shopify" />
          <img src="/logos/deepmind.png" alt="Google DeepMind" style={{height: 44, maxWidth: 180}} />
          <img src="/logos/rewind.png" alt="Rewind" style={{height: 44, maxWidth: 160}} />
          <img src="/logos/fellow.png" alt="Fellow" />
          <img src="/logos/y-combinator.png" alt="Y Combinator" />
          <img src="/logos/noibu.webp" alt="Noibu" />
          <img src="/logos/mistral.avif" alt="Mistral" />
        </div>
      </section>

      {/* ===== 2. PROBLEM STATEMENT ===== */}
      <section className="problem-section">
        <div className="container" style={{textAlign: "center"}}>
          <h2 className="section-title">If any of this sounds familiar, you&apos;re not alone.</h2>
          <div className="problem-grid">
            <div className="problem-card reveal">
              <div className="problem-card-icon" style={{background: "rgba(37,99,235,0.08)", color: "#2563EB"}}>&#9200;</div>
              <h3>Your leads go cold from slow response rates</h3>
              <p>Most regen med inquiries wait hours, sometimes a full day, for a first reply. By then, the patient has already booked with a competitor who answered faster.</p>
            </div>
            <div className="problem-card reveal">
              <div className="problem-card-icon" style={{background: "rgba(22,163,74,0.08)", color: "#16A34A"}}>&#128202;</div>
              <h3>Your team goes into sales calls blind and unprepared</h3>
              <p>Coordinators jump on consults without a brief, without lead history, without context. The good calls happen by chance, not by system.</p>
            </div>
            <div className="problem-card reveal">
              <div className="problem-card-icon" style={{background: "rgba(217,119,6,0.08)", color: "#D97706"}}>&#128221;</div>
              <h3>Your protocols are time-consuming to draft and rarely customized</h3>
              <p>Every patient deserves a plan tailored to their case. In practice, your doctor reuses templates or writes from scratch under time pressure, every single time.</p>
            </div>
            <div className="problem-card reveal">
              <div className="problem-card-icon" style={{background: "rgba(219,39,119,0.08)", color: "#DB2777"}}>&#11088;</div>
              <h3>Your happy patients are your biggest missed opportunity</h3>
              <p>The strongest outcomes never get captured as reviews, testimonials, or case studies. Your best marketing asset walks out the door and never comes back.</p>
            </div>
            <div className="problem-card reveal">
              <div className="problem-card-icon" style={{background: "rgba(124,58,237,0.08)", color: "#7C3AED"}}>&#128200;</div>
              <h3>Your ads spend without a system that converts</h3>
              <p>You either ignore paid ads or hand a credit card to an agency and hope. Budgets drift, creative goes stale, and no one is watching cost per booked consult.</p>
            </div>
          </div>
        </div>
      </section>


      <section className="agents-section" id="products">
        <style>{`
          .agents-section { padding: 100px 0; background: #fff; }
          .agents-section .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
          .agents-eyebrow { display: inline-block; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #3730A3; margin-bottom: 12px; }
          .agents-head { text-align: center; max-width: 720px; margin: 0 auto 56px; }
          .agents-head h2 { font-size: 40px; font-weight: 800; line-height: 1.15; letter-spacing: -0.5px; color: #0F172A; margin-bottom: 16px; }
          .agents-head p { font-size: 17px; line-height: 1.7; color: #475569; }
          .agents-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; max-width: 1080px; margin: 0 auto; }
          .agents-team-divider {
            grid-column: 1 / -1;
            display: flex; align-items: center; gap: 16px;
            margin: 28px 0 4px;
          }
          .agents-team-divider::before,
          .agents-team-divider::after {
            content: ""; flex: 1; height: 1px; background: #E2E8F0;
          }
          .agents-team-divider span {
            font-size: 12px; font-weight: 800; text-transform: uppercase;
            letter-spacing: 1.5px; color: #94A3B8;
          }
          .agent-card.featured {
            grid-column: 1 / -1;
            display: grid; grid-template-columns: 1.05fr 1fr;
            gap: 32px; padding: 40px; align-items: center;
          }
          .agent-card.featured .agent-portrait { width: 96px; height: 96px; border-width: 3px; }
          .agent-card.featured .agent-name { font-size: 26px; }
          .agent-card.featured .agent-role { font-size: 14px; }
          .agent-card.featured .agent-headline { font-size: 22px; line-height: 1.3; margin-bottom: 14px; }
          .agent-card.featured .agent-body { font-size: 16px; }
          .agent-card.featured .agent-mockup-trigger { margin-top: 0; }
          .agent-card.featured .featured-meta {
            display: inline-block;
            margin-bottom: 14px;
            padding: 4px 12px; border-radius: 100px;
            background: var(--agent-tint); color: var(--agent-color);
            font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;
            border: 1px solid var(--agent-border);
          }
          @media (max-width: 768px) {
            .agent-card.featured { grid-template-columns: 1fr; padding: 28px 24px; gap: 24px; }
            .agent-card.featured .agent-headline { font-size: 19px; }
          }
          .agent-card {
            background: #fff; border: 1px solid #E2E8F0; border-radius: 20px;
            padding: 36px; position: relative; transition: all 0.25s;
            border-top: 4px solid var(--agent-color);
          }
          .agent-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.06); transform: translateY(-2px); }
          .agent-row { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
          .agent-portrait {
            width: 64px; height: 64px; border-radius: 50%;
            object-fit: cover; flex-shrink: 0;
            border: 2px solid var(--agent-color);
            background: var(--agent-tint);
          }
          .agent-mockup-trigger {
            display: block; width: 100%; margin-top: 20px;
            background: #F8FAFC; border: 1px solid #E2E8F0;
            border-radius: 12px; padding: 0; overflow: hidden;
            cursor: pointer; position: relative; transition: all 0.2s;
            font: inherit;
          }
          .agent-mockup-trigger:hover {
            border-color: var(--agent-color);
            box-shadow: 0 8px 24px rgba(0,0,0,0.08);
            transform: translateY(-1px);
          }
          .agent-mockup-trigger img {
            display: block; width: 100%; height: auto; aspect-ratio: 16 / 10; object-fit: cover; object-position: top left;
          }
          .agent-mockup-caption {
            position: absolute; left: 12px; bottom: 12px;
            background: rgba(15,23,42,0.85); color: #fff;
            font-size: 12px; font-weight: 700;
            padding: 6px 12px; border-radius: 100px;
            backdrop-filter: blur(4px);
          }
          .agent-name { font-size: 20px; font-weight: 800; color: #0F172A; line-height: 1.1; }
          .agent-role { font-size: 13px; color: #64748B; margin-top: 2px; }
          .agent-headline { font-size: 17px; font-weight: 700; color: var(--agent-color); margin-bottom: 12px; }
          .agent-body { font-size: 15px; line-height: 1.65; color: #475569; }
          .agent-badge {
            display: inline-block; margin-top: 16px;
            padding: 4px 12px; border-radius: 100px;
            background: var(--agent-tint); color: var(--agent-color);
            font-size: 12px; font-weight: 700; border: 1px solid var(--agent-border);
          }

          .under-hood { margin-top: 80px; padding: 40px 36px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 20px; max-width: 1080px; margin-left: auto; margin-right: auto; }
          .under-hood-head { display: flex; align-items: baseline; gap: 16px; margin-bottom: 16px; flex-wrap: wrap; }
          .under-hood-head h3 { font-size: 22px; font-weight: 800; color: #0F172A; letter-spacing: -0.3px; }
          .under-hood-head .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #5EC4E3; }
          .under-hood p { font-size: 15px; line-height: 1.7; color: #475569; margin-bottom: 20px; max-width: 760px; }
          .under-hood-bits {
            display: flex; flex-wrap: nowrap; gap: 8px;
            overflow-x: auto; padding-bottom: 2px;
            scrollbar-width: none;
          }
          .under-hood-bits::-webkit-scrollbar { display: none; }
          .under-hood-pill {
            padding: 6px 14px; background: #fff; border: 1px solid #E2E8F0;
            border-radius: 100px; font-size: 13px; font-weight: 600; color: #0F172A;
            white-space: nowrap; flex-shrink: 0;
          }
          .under-hood-mockups-label {
            font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;
            color: #5EC4E3; margin-top: 28px; margin-bottom: 12px;
          }
          .under-hood-mockups { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
          .platform-mockup {
            background: #fff; border: 1px solid #E2E8F0; border-radius: 12px;
            padding: 0; overflow: hidden; cursor: pointer; position: relative;
            transition: all 0.2s; font: inherit; text-align: left;
          }
          .platform-mockup:hover {
            border-color: #3730A3; box-shadow: 0 8px 24px rgba(0,0,0,0.08); transform: translateY(-1px);
          }
          .platform-mockup img { display: block; width: 100%; height: auto; aspect-ratio: 16 / 10; object-fit: cover; object-position: top left; }
          .platform-mockup-label {
            position: absolute; left: 10px; bottom: 10px;
            background: rgba(15,23,42,0.85); color: #fff;
            font-size: 11px; font-weight: 700;
            padding: 5px 10px; border-radius: 100px;
          }
          @media (max-width: 768px) {
            .under-hood-mockups { grid-template-columns: 1fr; }
          }

          .lightbox-backdrop {
            position: fixed; inset: 0; background: rgba(15,23,42,0.85);
            display: flex; align-items: center; justify-content: center;
            z-index: 999999 !important; padding: 40px 24px;
            animation: lbFade 0.18s ease;
          }
          @keyframes lbFade { from { opacity: 0; } to { opacity: 1; } }
          .lightbox-inner { max-width: 1300px; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 12px; }
          .lightbox-img-wrap {
            background: #fff; border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.35);
            max-width: 100%; max-height: 82vh;
            overflow: auto;
          }
          .lightbox-img-wrap img { display: block; width: 100%; height: auto; max-width: 1300px; }
          .lightbox-caption {
            color: #fff; font-size: 14px; font-weight: 600;
            display: flex; align-items: center; gap: 12px;
          }
          .lightbox-close {
            background: #fff; color: #0F172A; border: none;
            font-family: inherit; font-weight: 700; font-size: 13px;
            padding: 6px 14px; border-radius: 100px; cursor: pointer;
          }

          @media (max-width: 768px) {
            .agents-section { padding: 72px 0; }
            .agents-head h2 { font-size: 30px; }
            .agents-grid { grid-template-columns: 1fr; }
            .agent-card { padding: 28px 24px; }
            .under-hood { padding: 32px 24px; }
          }
        `}</style>
        <div className="container">
          <div className="agents-head reveal">
            <div className="agents-eyebrow">Meet your AI team</div>
            <h2>Five named agents. Each one a specialist.</h2>
            <p>Each one trained on your protocols, your tone, your pipeline.</p>
          </div>
          <div className="agents-grid">
            {(() => {
              const mia = agents[0];
              const rest = agents.slice(1);
              return (
                <>
                  <div
                    key={mia.name}
                    className="agent-card reveal featured"
                    style={{
                      ["--agent-color" as string]: mia.color,
                      ["--agent-tint" as string]: mia.tint,
                      ["--agent-border" as string]: mia.border,
                    } as React.CSSProperties}
                  >
                    <div>
                      <span className="featured-meta">Your lead patient coordinator</span>
                      <div className="agent-row">
                        <img className="agent-portrait" src={`/agents/${mia.slug}.png`} alt={`${mia.name}, ${mia.role}`} />
                        <div>
                          <div className="agent-name">{mia.name}</div>
                          <div className="agent-role">{mia.role}</div>
                        </div>
                      </div>
                      <div className="agent-headline">{mia.headline}</div>
                      <p className="agent-body">{mia.body}</p>
                      {mia.badge && <span className="agent-badge">{mia.badge}</span>}
                    </div>
                    <button
                      type="button"
                      className="agent-mockup-trigger"
                      onClick={() => openLightbox(mia.slug)}
                      aria-label={`See ${mia.name} in action`}
                    >
                      <img src={`/mockups/${mia.slug}.png`} alt="" loading="lazy" />
                      <span className="agent-mockup-caption">See {mia.name} in action</span>
                    </button>
                  </div>
                  <div className="agents-team-divider">
                    <span>Mia&apos;s supporting team</span>
                  </div>
                  {rest.map((a) => (
                    <div
                      key={a.name}
                      className="agent-card reveal"
                      style={{
                        ["--agent-color" as string]: a.color,
                        ["--agent-tint" as string]: a.tint,
                        ["--agent-border" as string]: a.border,
                      } as React.CSSProperties}
                    >
                      <div className="agent-row">
                        <img className="agent-portrait" src={`/agents/${a.slug}.png`} alt={`${a.name}, ${a.role}`} />
                        <div>
                          <div className="agent-name">{a.name}</div>
                          <div className="agent-role">{a.role}</div>
                        </div>
                      </div>
                      <div className="agent-headline">{a.headline}</div>
                      <p className="agent-body">{a.body}</p>
                      {a.badge && <span className="agent-badge">{a.badge}</span>}
                      <button
                        type="button"
                        className="agent-mockup-trigger"
                        onClick={() => openLightbox(a.slug)}
                        aria-label={`See ${a.name} in action`}
                      >
                        <img src={`/mockups/${a.slug}.png`} alt="" loading="lazy" />
                        <span className="agent-mockup-caption">See {a.name} in action</span>
                      </button>
                    </div>
                  ))}
                </>
              );
            })()}
          </div>

          <div className="under-hood reveal">
            <div className="under-hood-head">
              <span className="label">Under the hood</span>
              <h3>A full clinic OS, not just an inbox.</h3>
            </div>
            <p>
              Your agents do not work in a vacuum. They run on the operating system underneath: pipeline, intake, protocols, follow-ups, and patient stories all in one place, built for regenerative medicine clinics.
            </p>
            <div className="under-hood-bits">
              {platformBits.map((bit) => (
                <span key={bit} className="under-hood-pill">{bit}</span>
              ))}
            </div>
            <div className="under-hood-mockups-label">Glimpses from inside ClinicTech</div>
            <div className="under-hood-mockups">
              {platformMockups.map((m) => (
                <button
                  key={m.slug}
                  type="button"
                  className="platform-mockup"
                  onClick={() => openLightbox(m.slug)}
                  aria-label={`Open ${m.label} preview`}
                >
                  <img src={`/mockups/${m.slug}.png`} alt="" loading="lazy" />
                  <span className="platform-mockup-label">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {mounted && lightbox && createPortal(
        <div
          className="lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={mockupCaptions[lightbox] ?? "Preview"}
          onClick={closeLightbox}
        >
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-img-wrap">
              <img src={`/mockups/${lightbox}.png`} alt={mockupCaptions[lightbox] ?? "Preview"} />
            </div>
            <div className="lightbox-caption">
              <span>{mockupCaptions[lightbox] ?? "Preview"}</span>
              <button type="button" className="lightbox-close" onClick={closeLightbox} autoFocus>Close</button>
            </div>
          </div>
        </div>,
        document.body
      )}


      {/* ===== DAY IN LIFE ===== */}
      <section className="daylife-section">
        <div className="container" style={{textAlign: "center"}}>
          <h2 className="section-title">Your team of agents grow your practice while you sleep.</h2>
          <div className="daylife-layout">
            {/* Left column - what the agent did */}
            <div className="daylife-col">
              <div className="daylife-label">What ClinicTech handled overnight</div>
              <div className="daylife-card reveal">
                <div className="daylife-card-header">
                  <div className="daylife-card-icon" style={{background:"rgba(34,197,94,0.1)"}}>&#9889;</div>
                  <div><div className="daylife-card-title">3 leads followed up</div><div className="daylife-card-sub">Instant SMS + email sent within 30 seconds</div></div>
                </div>
              </div>
              <div className="daylife-card reveal">
                <div className="daylife-card-header">
                  <div className="daylife-card-icon" style={{background:"rgba(55,48,163,0.08)"}}>&#128172;</div>
                  <div><div className="daylife-card-title">AI answered 7 patient questions</div><div className="daylife-card-sub">Stem cell pricing, recovery times, travel logistics</div></div>
                </div>
              </div>
              <div className="daylife-card reveal">
                <div className="daylife-card-header">
                  <div className="daylife-card-icon" style={{background:"rgba(245,158,11,0.08)"}}>&#9992;</div>
                  <div><div className="daylife-card-title">Travel confirmed for Sarah M.</div><div className="daylife-card-sub">Flight, hotel, pickup all coordinated</div></div>
                </div>
              </div>
            </div>

            {/* Center - Phone mockup */}
            <div>
              <div className="daylife-phone">
                <div className="daylife-phone-screen">
                  <div className="daylife-phone-status"><span>7:02 AM</span><span>&#128267; 100%</span></div>
                  <div className="daylife-phone-wa-header">
                    <div className="daylife-phone-wa-avatar">CT</div>
                    <div>ClinicTech <div className="daylife-phone-wa-online">online</div></div>
                  </div>
                  <div className="daylife-phone-chat">
                    <div className="daylife-phone-divider">Today</div>
                    <div className="daylife-phone-msg bot">Good morning. Here&apos;s your overnight brief:<br/><br/>&#10003; 3 new leads captured and followed up<br/>&#10003; 7 patient questions answered by AI<br/>&#10003; Sarah M.&apos;s travel confirmed<br/>&#10003; 2 review requests sent<br/><br/>1 item needs you: Michael T. wants to reschedule his consultation.<span className="msg-time">7:02</span></div>
                    <div className="daylife-phone-msg user">Reschedule Michael to Thursday 2pm<span className="msg-time">7:03</span></div>
                    <div className="daylife-phone-msg bot">Done. Michael has been notified and his calendar invite updated. Anything else?<span className="msg-time">7:03</span></div>
                    <div className="daylife-phone-msg user">No, looks good. Thanks<span className="msg-time">7:04</span></div>
                    <div className="daylife-phone-msg system">Your clinic is running. Have a great day.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - end of day */}
            <div className="daylife-col right">
              <div className="daylife-label">End of day recap</div>
              <div className="daylife-card reveal">
                <div className="daylife-card-header">
                  <div className="daylife-card-icon" style={{background:"rgba(34,197,94,0.1)"}}>&#128197;</div>
                  <div><div className="daylife-card-title">4 consultations booked</div><div className="daylife-card-sub">All self-booked through smart intake</div></div>
                </div>
              </div>
              <div className="daylife-card reveal">
                <div className="daylife-card-header">
                  <div className="daylife-card-icon" style={{background:"rgba(245,158,11,0.08)"}}>&#11088;</div>
                  <div><div className="daylife-card-title">2 five-star reviews collected</div><div className="daylife-card-sub">Auto-requested at the right moment</div></div>
                </div>
              </div>
              <div className="daylife-card reveal">
                <div className="daylife-card-header">
                  <div className="daylife-card-icon" style={{background:"rgba(94,196,227,0.12)"}}>&#128337;</div>
                  <div><div className="daylife-card-title">22 hours of admin saved this week</div><div className="daylife-card-sub">Your coordinator focused on patient care</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials-section" id="results">
        <div className="container" style={{textAlign: "center"}}>
          <h2 className="section-title">Trusted by regenerative medicine clinics across North America</h2>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card reveal">
                <div className="testimonial-stat">{t.stat}</div>
                <div className="testimonial-quote">&ldquo;{t.quote}&rdquo;</div>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name.split(" ").map(w => w[0]).join("")}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}{t.location ? `, ${t.location}` : ""}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="how-section" id="how-it-works">
        <div className="container" style={{textAlign: "center"}}>
          <h2 className="section-title">Onboarding is simple. White-glove the whole way.</h2>
          <p className="section-sub" style={{margin: "0 auto 48px", textAlign: "center"}}>Think of us as an extra member of your tech team. We set up, train, and tune your agents alongside you.</p>
          <div className="how-steps">
            <div className="how-step reveal">
              <div className="how-step-num">1</div>
              <h3>Add the knowledge base specific to your clinic</h3>
              <p>No two operating systems are the same. Each one is unique to your clinic. Your protocols, your pricing, your patient stories, your tone, all loaded in.</p>
            </div>
            <div className="how-step reveal">
              <div className="how-step-num">2</div>
              <h3>Select which agents you want to hire</h3>
              <p>Mia, Sage, Atlas, Rio, and Tomas are ready out of the box. Turn on the ones you need today. Add the rest as your clinic grows.</p>
            </div>
            <div className="how-step reveal">
              <div className="how-step-num">3</div>
              <h3>Your agents go to work while you sleep</h3>
              <p>They engage every patient, draft every reply, surface every coaching opportunity, and capture every story. Your team focuses on care. The bookings keep coming in.</p>
            </div>
          </div>
          <div className="how-cta">
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">Book a demo &rarr;</a>
          </div>
        </div>
      </section>

      {/* ===== 9. FINAL CTA ===== */}
      <section className="final-cta-section">
        <div className="container">
          <div className="final-cta-grid">
            <div className="final-cta-card reveal" style={{gridColumn: "1 / -1"}}>
              <div style={{fontSize: 48, fontWeight: 800, letterSpacing: "-1px", color: "#3730A3", lineHeight: 1, marginBottom: 12}}>78%</div>
              <h3>Of patients book with the first clinic that responds to them.</h3>
              <p>Don&apos;t lose out on more patient bookings. Let your AI team answer first, every time.</p>
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">Book a demo &rarr;</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 10. FOOTER ===== */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-brand-name">
                <img src="/clinictech-logo.png" alt="ClinicTech" style={{height: 28, filter: "brightness(0) saturate(100%) invert(13%) sepia(50%) saturate(3000%) hue-rotate(240deg)"}} />
              </div>
              <p>The growth platform built for regenerative medicine clinics.</p>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <a href="/blog">Blog</a>
              <a href="/regen-news">Regen News</a>
              <a href="/about">About</a>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/contact">Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            &copy; 2026 ClinicTech. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
