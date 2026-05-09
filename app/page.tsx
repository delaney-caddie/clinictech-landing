"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { SiteNav } from "@/components/site-nav";

const CALENDAR_URL = "https://calendar.app.google/YvNVdxRdiXVhjXQDA";

const productTabs = [
  { label: "Unified Inbox", title: "Unified Inbox", desc: "Streamline all your communication in one place. Connect Facebook, Instagram, WhatsApp, SMS, email, and website chat into a single inbox. Every patient message, every channel, one view. No more switching between five apps to respond to one inquiry." },
  { label: "RegenCRM", title: "RegenCRM", desc: "Visualize your entire patient pipeline. See every lead move through stages from inquiry to consultation to treatment to follow-up. Drag-and-drop Kanban board built for the regenerative medicine patient journey." },
  { label: "AI Patient Concierge", title: "AI Patient Concierge", desc: "Trained on your protocols, pricing, and conditions treated. Answers questions about stem cell therapy, PRP, exosomes, and travel logistics in English and Spanish, 24/7. Books consultations before the patient closes the tab." },
  { label: "Automated Follow-Ups", title: "Automated Follow-Ups", desc: "Multi-channel sequences tuned for regenerative medicine. Instant reply on inquiry, education emails mid-funnel, reactivation for quiet leads. Your coordinator stops chasing and starts closing." },
  { label: "Review Generation", title: "Review Generation", desc: "Automated review requests sent at the perfect moment post-treatment. Patients leave 5-star reviews on Google while the experience is still fresh. Negative feedback gets routed privately before it goes public." },
  { label: "Online Scheduling", title: "Online Scheduling", desc: "Patients self-book consultations directly into your calendar. Smart intake qualifies by condition, budget, and travel readiness. Your front desk wakes up to a full schedule." },
  { label: "Protocol Builder", title: "Protocol Builder", desc: "Document treatment protocols, dosing, and recovery timelines in a structured format. Share with patients pre-treatment and use as a reference across your clinical team." },
  { label: "Boost Your Online Presence", title: "Boost Your Online Presence", desc: "AI-powered blog content, optimized Google Business Profile, and local SEO tools. Dominate search results for your treatments and your city. Get found before your competitors." },
  { label: "Travel Concierge", title: "Travel Concierge", desc: "A portal for international patients to manage flights, hotels, airport pickups, and local logistics. Your team tracks every arrival from one dashboard instead of coordinating over WhatsApp." },
];

const testimonials = [
  { name: "Dr. Carlos M.", role: "Medical Director", location: "Regenerative clinic, Tijuana", stat: "22 hrs/wk saved", quote: "I used to spend half my day on WhatsApp coordinating travel for international patients. Flights, hotels, pickups. Now patients handle it themselves through the portal. I actually get to focus on patient care instead of logistics." },
  { name: "Sofia R.", role: "Patient Coordinator", location: "Multi-location stem cell network", stat: "3 second response time", quote: "Our response time dropped from over a day to under 3 seconds. That alone changed everything. Patients were booking with competitors because we were too slow. Now we are always the first clinic to reply." },
  { name: "Dr. James L.", role: "Clinic Owner", location: "Regenerative medicine, US", stat: "+5 bookings/month", quote: "We were getting inquiries but barely booking any. After switching our intake to ClinicTech, we picked up an extra 5 consultations a month just from leads that would have gone cold. The follow-up sequences run themselves." },
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState(0);
  const tabAutoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoRotate = useCallback(() => {
    if (tabAutoRef.current) clearInterval(tabAutoRef.current);
    tabAutoRef.current = setInterval(() => {
      setActiveTab(prev => (prev + 1) % productTabs.length);
    }, 4000);
  }, []);

  useEffect(() => {
    startAutoRotate();
    return () => { if (tabAutoRef.current) clearInterval(tabAutoRef.current); };
  }, [startAutoRotate]);

  const handleTabClick = useCallback((idx: number) => {
    setActiveTab(idx);
    startAutoRotate();
  }, [startAutoRotate]);

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
  display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; margin-top: 48px;
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
              78% of patients book with the clinic that earns their trust first. <span className="hl">Be that clinic.</span>
            </h1>
            <p className="hero-sub">
              Auto-replies don&apos;t close patients. ClinicTech is the growth platform that works while you sleep: answering clinical questions, following up on cold leads, coordinating travel, and running your intake. In English and Spanish, 24/7.
            </p>
            <div className="hero-ctas">
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">Get my free audit &rarr;</a>
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
              <div className="problem-card-icon" style={{background: "rgba(239,68,68,0.08)"}}>&#9200;</div>
              <h3>Leads go cold before you respond</h3>
              <p>The average regen med inquiry waits 24+ hours for a reply. Most patients have already booked with a competitor by the time you call back.</p>
            </div>
            <div className="problem-card reveal">
              <div className="problem-card-icon" style={{background: "rgba(245,158,11,0.08)"}}>&#128233;</div>
              <h3>Your intake form is a black hole</h3>
              <p>Generic contact forms land in an inbox. No qualification, no routing, no follow-up sequence. Warm leads die in someone&apos;s unread folder.</p>
            </div>
            <div className="problem-card reveal">
              <div className="problem-card-icon" style={{background: "rgba(94,196,227,0.12)"}}>&#9992;&#65039;</div>
              <h3>International patients need hand-holding</h3>
              <p>70% of stem cell patients travel for treatment. Every flight, hotel, and pickup question routes back to your coordinator&apos;s WhatsApp.</p>
            </div>
            <div className="problem-card reveal">
              <div className="problem-card-icon" style={{background: "rgba(55,48,163,0.08)"}}>&#128268;</div>
              <h3>Your tools don&apos;t talk to each other</h3>
              <p>Website, CRM, email, scheduler, spreadsheets. Your team copy-pastes between five tabs just to book one consultation.</p>
            </div>
          </div>
        </div>
      </section>


      <section className="product-tabs-section" id="products">
        <div className="container" style={{textAlign: "center"}}>
          <h2 className="section-title">Your clinic runs on five tools that don&apos;t talk to each other. ClinicTech replaces all of them.</h2>
          <div className="tabs-row">
            {productTabs.map((tab, i) => (
              <button key={i} className={`tab-btn ${activeTab === i ? "active" : ""}`} onClick={() => handleTabClick(i)}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="tab-content" key={activeTab}>
            <div>
              <h3>{productTabs[activeTab].title}</h3>
              <p>{productTabs[activeTab].desc}</p>
            </div>
            <div className="tab-mockup">
              <div className="tab-mockup-bar">
                <div className="tab-mockup-dots"><span></span><span></span><span></span></div>
                {productTabs[activeTab].title}
              </div>
              <div className="tab-mockup-body">
                {/* Unified Inbox */}
                {activeTab === 0 && (<>
                  <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap" as const}}>
                    <span style={{fontSize:9,fontWeight:700,padding:"4px 10px",borderRadius:100,background:"#1877F2",color:"#fff"}}>Facebook</span>
                    <span style={{fontSize:9,fontWeight:700,padding:"4px 10px",borderRadius:100,background:"linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",color:"#fff"}}>Instagram</span>
                    <span style={{fontSize:9,fontWeight:700,padding:"4px 10px",borderRadius:100,background:"#25D366",color:"#fff"}}>WhatsApp</span>
                    <span style={{fontSize:9,fontWeight:700,padding:"4px 10px",borderRadius:100,background:"#3730A3",color:"#fff"}}>SMS</span>
                    <span style={{fontSize:9,fontWeight:700,padding:"4px 10px",borderRadius:100,background:"#64748B",color:"#fff"}}>Email</span>
                    <span style={{fontSize:9,fontWeight:700,padding:"4px 10px",borderRadius:100,background:"#0F172A",color:"#fff"}}>Web Chat</span>
                  </div>
                  <div className="tab-mockup-row"><span style={{fontSize:9,background:"#25D366",color:"#fff",padding:"2px 6px",borderRadius:4,fontWeight:700,marginRight:6}}>WA</span><span className="tab-mockup-name">Sarah M.</span><span className="tab-mockup-detail">How much is knee treatment?</span><span style={{fontSize:9,color:"#94A3B8"}}>2m ago</span></div>
                  <div className="tab-mockup-row"><span style={{fontSize:9,background:"#1877F2",color:"#fff",padding:"2px 6px",borderRadius:4,fontWeight:700,marginRight:6}}>FB</span><span className="tab-mockup-name">James K.</span><span className="tab-mockup-detail">Sent a message</span><span style={{fontSize:9,color:"#94A3B8"}}>14m ago</span></div>
                  <div className="tab-mockup-row"><span style={{fontSize:9,background:"#3730A3",color:"#fff",padding:"2px 6px",borderRadius:4,fontWeight:700,marginRight:6}}>SMS</span><span className="tab-mockup-name">Maria L.</span><span className="tab-mockup-detail">Yes I want to book</span><span style={{fontSize:9,color:"#94A3B8"}}>1h ago</span></div>
                  <div className="tab-mockup-row"><span style={{fontSize:9,background:"#64748B",color:"#fff",padding:"2px 6px",borderRadius:4,fontWeight:700,marginRight:6}}>Email</span><span className="tab-mockup-name">Robert T.</span><span className="tab-mockup-detail">Re: Travel logistics</span><span style={{fontSize:9,color:"#94A3B8"}}>3h ago</span></div>
                </>)}
                {/* RegenCRM - Kanban */}
                {activeTab === 1 && (<div style={{display:"flex",gap:8,overflow:"hidden"}}>
                  {[{title:"New Lead",color:"#3730A3",patients:["Sarah M.","James K."]},{title:"Consulted",color:"#D97706",patients:["Maria L."]},{title:"Booked",color:"#22C55E",patients:["Robert T.","Lisa W."]},{title:"Treated",color:"#6366F1",patients:["David R."]}].map((col,i) => (
                    <div key={i} style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase" as const,letterSpacing:"0.5px",color:col.color,borderBottom:`2px solid ${col.color}`,paddingBottom:6,marginBottom:8}}>{col.title} <span style={{color:"#94A3B8"}}>{col.patients.length}</span></div>
                      {col.patients.map((p,j) => (
                        <div key={j} style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:"8px 10px",marginBottom:6,fontSize:10}}>
                          <div style={{fontWeight:700,color:"#0F172A"}}>{p}</div>
                          <div style={{color:"#94A3B8",fontSize:9,marginTop:2}}>Knee Stem Cell</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>)}
                {/* AI Patient Concierge */}
                {activeTab === 2 && (<div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <div className="tab-mockup-msg user">What does stem cell therapy for my knee involve? How much does it cost?</div>
                  <div className="tab-mockup-msg bot"><span style={{fontSize:9,fontWeight:700,color:"#3730A3",background:"rgba(55,48,163,0.06)",padding:"2px 6px",borderRadius:100,marginBottom:4,display:"inline-block"}}>AI</span><br/>Our knee stem cell therapy uses MSCs harvested from your bone marrow. The procedure takes 2-3 hours and costs $8,000-$15,000. We coordinate travel from the US including airport pickup and hotel.</div>
                  <div className="tab-mockup-msg user">Can I book a consultation?</div>
                  <div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:8,padding:"8px 12px",fontSize:10,color:"#15803D",fontWeight:600}}>&#10003; Consultation booked: Apr 22, 10 AM</div>
                </div>)}
                {/* Automated Follow-Ups */}
                {activeTab === 3 && (<>
                  <div className="tab-mockup-row"><span style={{fontWeight:700,color:"#0F172A",fontSize:11}}>Hot Lead Sequence</span><span className="tab-mockup-badge green">Active</span></div>
                  <div style={{display:"flex",gap:4,margin:"4px 0 8px",paddingLeft:12,flexWrap:"wrap" as const}}>
                    <span style={{fontSize:9,padding:"3px 8px",background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:4,color:"#15803D"}}>Instant SMS</span>
                    <span style={{fontSize:9,padding:"3px 8px",background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:4,color:"#15803D"}}>Day 1 Email</span>
                    <span style={{fontSize:9,padding:"3px 8px",background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:4,color:"#15803D"}}>Day 3 Call</span>
                  </div>
                  <div className="tab-mockup-row"><span style={{fontWeight:700,color:"#0F172A",fontSize:11}}>Warm Nurture (30-day)</span><span className="tab-mockup-badge amber">Active</span></div>
                  <div className="tab-mockup-row"><span style={{fontWeight:700,color:"#0F172A",fontSize:11}}>Cold Drip (90-day)</span><span className="tab-mockup-badge gray">Active</span></div>
                  <div className="tab-mockup-row"><span style={{fontWeight:700,color:"#0F172A",fontSize:11}}>Patient Reactivation (12-mo)</span><span className="tab-mockup-badge blue">Active</span></div>
                </>)}
                {/* Review Generation */}
                {activeTab === 4 && (<>
                  <div className="tab-mockup-stat"><div className="tab-mockup-stat-num">4.9</div><div className="tab-mockup-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div><div className="tab-mockup-stat-label">Average across 312 reviews</div></div>
                  <div className="tab-mockup-row"><span className="tab-mockup-name">Sarah M.</span><span className="tab-mockup-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span><span className="tab-mockup-badge green">Posted</span></div>
                  <div className="tab-mockup-row"><span className="tab-mockup-name">James K.</span><span className="tab-mockup-detail">Request sent</span><span className="tab-mockup-badge amber">Pending</span></div>
                  <div className="tab-mockup-row"><span className="tab-mockup-name">Maria L.</span><span className="tab-mockup-detail">Negative</span><span className="tab-mockup-badge blue">Routed</span></div>
                </>)}
                {/* Online Scheduling - Calendar */}
                {activeTab === 5 && (<>
                  <div style={{display:"grid",gridTemplateColumns:"40px repeat(5,1fr)",gap:3,fontSize:9}}>
                    <div></div>
                    {["Mon","Tue","Wed","Thu","Fri"].map(d => <div key={d} style={{textAlign:"center",fontWeight:700,color:"#94A3B8",paddingBottom:4}}>{d}</div>)}
                    <div style={{color:"#94A3B8",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:4}}>9am</div>
                    <div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:4,padding:4,textAlign:"center",color:"#15803D",fontWeight:600}}>Sarah M.</div>
                    <div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:4,padding:4,textAlign:"center",color:"#15803D",fontWeight:600}}>James K.</div>
                    <div style={{background:"#F8FAFC",border:"1px dashed #E2E8F0",borderRadius:4,padding:4}}></div>
                    <div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:4,padding:4,textAlign:"center",color:"#15803D",fontWeight:600}}>Maria L.</div>
                    <div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:4,padding:4,textAlign:"center",color:"#15803D",fontWeight:600}}>Robert T.</div>
                    <div style={{color:"#94A3B8",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:4}}>11am</div>
                    <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:4,padding:4,textAlign:"center",color:"#92400E",fontWeight:600}}>Lisa W.</div>
                    <div style={{background:"#F8FAFC",border:"1px dashed #E2E8F0",borderRadius:4,padding:4}}></div>
                    <div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:4,padding:4,textAlign:"center",color:"#15803D",fontWeight:600}}>David R.</div>
                    <div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:4,padding:4,textAlign:"center",color:"#15803D",fontWeight:600}}>Anna P.</div>
                    <div style={{background:"#F8FAFC",border:"1px dashed #E2E8F0",borderRadius:4,padding:4}}></div>
                    <div style={{color:"#94A3B8",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:4}}>2pm</div>
                    <div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:4,padding:4,textAlign:"center",color:"#15803D",fontWeight:600}}>Tom B.</div>
                    <div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:4,padding:4,textAlign:"center",color:"#15803D",fontWeight:600}}>Karen R.</div>
                    <div style={{background:"#F8FAFC",border:"1px dashed #E2E8F0",borderRadius:4,padding:4}}></div>
                    <div style={{background:"#F8FAFC",border:"1px dashed #E2E8F0",borderRadius:4,padding:4}}></div>
                    <div style={{background:"#F8FAFC",border:"1px dashed #E2E8F0",borderRadius:4,padding:4}}></div>
                  </div>
                  <div style={{fontSize:10,color:"#22C55E",fontWeight:600,marginTop:8,textAlign:"center" as const}}>+12 self-booked this week</div>
                </>)}
                {/* Protocol Builder */}
                {activeTab === 6 && (<>
                  <div className="tab-mockup-checklist">
                    <div className="tab-mockup-check"><span className="tab-mockup-check-icon">&#10003;</span> Pre-treatment instructions sent</div>
                    <div className="tab-mockup-check"><span className="tab-mockup-check-icon">&#10003;</span> Consent form signed digitally</div>
                    <div className="tab-mockup-check"><span className="tab-mockup-check-icon">&#10003;</span> Stem cell knee protocol assigned</div>
                    <div className="tab-mockup-check"><span className="tab-mockup-check-icon">&#10003;</span> Post-care recovery plan shared</div>
                    <div className="tab-mockup-check"><span style={{color:"#94A3B8"}}>&#9711;</span> Week 4 follow-up scheduled</div>
                  </div>
                </>)}
                {/* Boost Online Presence */}
                {activeTab === 7 && (<>
                  <div className="tab-mockup-stat"><div className="tab-mockup-stat-num">+190%</div><div className="tab-mockup-stat-label">Organic traffic growth</div></div>
                  <div className="tab-mockup-row"><span className="tab-mockup-name">Google Business</span><span className="tab-mockup-badge green">Optimized</span></div>
                  <div className="tab-mockup-row"><span className="tab-mockup-name">SEO Blog Posts</span><span className="tab-mockup-detail">12 published</span><span className="tab-mockup-badge green">Live</span></div>
                  <div className="tab-mockup-row"><span className="tab-mockup-name">Local Citations</span><span className="tab-mockup-detail">34 directories</span><span className="tab-mockup-badge green">Synced</span></div>
                </>)}
                {/* Travel Concierge */}
                {activeTab === 8 && (<>
                  <div className="tab-mockup-checklist">
                    <div className="tab-mockup-check"><span className="tab-mockup-check-icon">&#10003;</span> Flight: AA 1247, Apr 15 9:30am</div>
                    <div className="tab-mockup-check"><span className="tab-mockup-check-icon">&#10003;</span> Hotel: Grand Resort, 2 nights</div>
                    <div className="tab-mockup-check"><span className="tab-mockup-check-icon">&#10003;</span> Pickup: Carlos M. confirmed</div>
                    <div className="tab-mockup-check"><span style={{color:"#D97706"}}>&#9711;</span> Pre-arrival form: pending</div>
                  </div>
                  <div style={{marginTop:8,fontSize:10,color:"#94A3B8",textAlign:"center" as const}}>3 patients arriving this week</div>
                </>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DAY IN LIFE ===== */}
      <section className="daylife-section">
        <div className="container" style={{textAlign: "center"}}>
          <h2 className="section-title">What your clinic looks like on ClinicTech</h2>
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
          <h2 className="section-title">From setup to growth in 3 simple steps.</h2>
          <div className="how-steps">
            <div className="how-step reveal">
              <div className="how-step-num">1</div>
              <h3>Get an audit of your current website</h3>
              <p>Free 15-minute audit. We analyze your intake flow, response time, Google visibility, and conversion rate against top regen med clinics in your market.</p>
            </div>
            <div className="how-step reveal">
              <div className="how-step-num">2</div>
              <h3>We build your growth engine</h3>
              <p>Custom to your clinic. Your brand, your protocols, your integrations. Most clinics go live in 2 to 4 weeks.</p>
            </div>
            <div className="how-step reveal">
              <div className="how-step-num">3</div>
              <h3>Watch your practice grow</h3>
              <p>Leads get captured and followed up automatically. Patients book themselves. Your team spends time on care, not admin.</p>
            </div>
          </div>
          <div className="how-cta">
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">Get my free audit &rarr;</a>
          </div>
        </div>
      </section>

      {/* ===== 9. FINAL CTA ===== */}
      <section className="final-cta-section">
        <div className="container">
          <div className="final-cta-grid">
            <div className="final-cta-card reveal">
              <h3>Get a free clinic audit</h3>
              <p>15-minute call. We audit your site, your intake flow, and your Google presence against top regen med clinics.</p>
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">Book a free audit &rarr;</a>
            </div>
            <div className="final-cta-card reveal">
              <h3>See how it works</h3>
              <p>Watch a 3-minute walkthrough of the platform. See RegenCRM, the AI concierge, automated follow-ups, and the travel portal in action.</p>
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="btn-outline-white">See the demo &rarr;</a>
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
