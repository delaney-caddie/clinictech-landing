"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export default function LeadCapturePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [leads, setLeads] = useState(40);
  const [procedureValue, setProcedureValue] = useState(12000);
  const totalRef = useRef<HTMLDivElement>(null);

  const lostRate = 0.6;
  const recoveryRate = 0.58;
  const recovered = Math.round(leads * lostRate * recoveryRate);
  const annual = recovered * procedureValue * 12;

  const animateTotal = useCallback(() => {
    if (totalRef.current) {
      totalRef.current.style.transform = "scale(1.05)";
      setTimeout(() => { if (totalRef.current) totalRef.current.style.transform = "scale(1)"; }, 150);
    }
  }, []);

  return (
    <>
      <style>{`
        .lc-page { min-height: 100vh; background: #fff; }

        /* Hero */
        .lc-hero { padding: 180px 0 100px; background: #fff; }
        .lc-hero-inner {
          max-width: 800px; margin: 0 auto; padding: 0 24px; text-align: center;
        }
        .lc-kicker {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 2px; color: #0E9AC0; margin-bottom: 16px;
        }
        .lc-hero h1 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 48px; font-weight: 800; font-style: normal;
          color: #0F172A; line-height: 1.08; margin-bottom: 20px;
        }
        .lc-hero-sub {
          font-size: 18px; color: #64748B; line-height: 1.7; margin-bottom: 32px;
          max-width: 640px; margin-left: auto; margin-right: auto;
        }
        .lc-hero-cta {
          display: inline-flex; padding: 16px 36px;
          background: #3730A3; color: #fff; font-weight: 700; font-size: 16px;
          border-radius: 100px; text-decoration: none; transition: all 0.2s;
        }
        .lc-hero-cta:hover { background: #4338CA; box-shadow: 0 4px 16px rgba(55,48,163,0.3); transform: translateY(-1px); }
        .lc-hero-stat {
          margin-top: 32px; font-size: 14px; color: #64748B;
        }
        .lc-hero-stat strong { color: #3730A3; font-weight: 700; }

        /* Before/After */
        .lc-ba { padding: 80px 0 100px; background: #F8FAFC; }
        .lc-ba-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .lc-ba-title {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 32px; font-weight: 800; color: #0F172A; text-align: center;
          margin-bottom: 48px; line-height: 1.2;
        }
        .lc-ba-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
        .lc-ba-col {
          background: #fff; border: 1px solid #E2E8F0; padding: 0;
          border-radius: 16px;
        }
        .lc-ba-col:first-child { border-radius: 16px 0 0 16px; border-right: none; }
        .lc-ba-col:last-child { border-radius: 0 16px 16px 0; }
        .lc-ba-col-label {
          font-size: 12px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1.5px; text-align: center; padding: 20px 0 16px;
        }
        .lc-ba-col:first-child .lc-ba-col-label { color: #94A3B8; }
        .lc-ba-col:last-child .lc-ba-col-label { color: #3730A3; }
        /* Calendar visual */
        .lc-ba-visual {
          padding: 20px 16px 24px; position: relative;
        }
        .lc-ba-cal-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 12px;
        }
        .lc-ba-cal-month { font-size: 15px; font-weight: 700; color: #0F172A; }
        .lc-ba-cal-view { font-size: 11px; color: #94A3B8; }
        .lc-ba-cal {
          display: grid; grid-template-columns: 36px repeat(5, 1fr); gap: 4px;
        }
        .lc-ba-cal-day {
          font-size: 9px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.5px; color: #94A3B8; text-align: center;
          padding: 0 0 6px;
        }
        .lc-ba-cal-time {
          font-size: 10px; color: #94A3B8; font-weight: 600;
          display: flex; align-items: center; justify-content: flex-end;
          padding-right: 6px;
        }
        .lc-ba-cal-cell {
          border-radius: 6px; padding: 6px 4px; text-align: center;
          font-size: 7px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.3px; min-height: 36px;
          display: flex; align-items: center; justify-content: center;
        }
        .lc-ba-cal-cell.bad { background: #FEF2F2; border: 1px solid #FECACA; color: #991B1B; }
        .lc-ba-cal-cell.meh { background: #FFFBEB; border: 1px solid #FDE68A; color: #92400E; }
        .lc-ba-cal-cell.empty { background: #F8FAFC; border: 1px dashed #E2E8F0; }
        .lc-ba-cal-cell.line { background: #F8FAFC; }
        .lc-ba-cal-cell.line::after {
          content: ''; display: block; width: 70%; height: 3px;
          background: #E2E8F0; border-radius: 2px;
        }
        .lc-ba-cal-cell.good { background: #F0FDF4; border: 1px solid #BBF7D0; color: #15803D; }
        .lc-ba-cal-cell.deposit { background: #FFFBEB; border: 1px solid #FDE68A; color: #92400E; }
        /* Closing rate */
        .lc-ba-closing {
          position: absolute; bottom: 16px; right: 16px;
          background: #fff; border: 1px solid #E2E8F0; border-radius: 10px;
          padding: 10px 14px; display: flex; align-items: center; gap: 8px;
          z-index: 1;
        }
        .lc-ba-closing-label { font-size: 11px; color: #64748B; }
        .lc-ba-closing-value {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 26px; font-weight: 800; color: #0F172A;
        }
        .lc-ba-closing-change {
          font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 4px;
        }
        .lc-ba-closing-change.down { background: #FEE2E2; color: #DC2626; }
        .lc-ba-closing-change.up { background: #DCFCE7; color: #16A34A; }
        /* Filter card floater */
        .lc-ba-filter-float {
          position: absolute; top: 14px; left: 10px; z-index: 2;
          background: #fff; border: 1px solid #BBF7D0; border-radius: 12px;
          padding: 14px 18px; box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          width: 220px;
        }
        .lc-ba-filter-logo {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; font-weight: 800; color: #0F172A; margin-bottom: 10px;
        }
        .lc-ba-filter-logo-icon {
          width: 24px; height: 24px; border-radius: 6px; background: #3730A3;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 800; color: #fff;
        }
        .lc-ba-filter-row {
          display: flex; align-items: center; gap: 8px;
          padding: 4px 0; font-size: 11px; color: #0F172A;
        }
        .lc-ba-filter-toggle {
          width: 28px; height: 14px; border-radius: 7px; background: #E2E8F0; flex-shrink: 0;
        }
        .lc-ba-filter-toggle.on { background: #3730A3; position: relative; }
        .lc-ba-filter-toggle.on::after {
          content: ''; position: absolute; top: 2px; right: 2px;
          width: 10px; height: 10px; border-radius: 50%; background: #fff;
        }
        /* Bullet points */
        .lc-ba-bullets { padding: 24px 28px; }
        .lc-ba-bullet {
          display: flex; gap: 12px; align-items: flex-start;
          padding: 8px 0; font-size: 13px; line-height: 1.5; color: #334155;
        }
        .lc-ba-bullet strong { color: #0F172A; }
        .lc-ba-bullet-icon {
          width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; margin-top: 1px;
        }
        .lc-ba-bullet-icon.red { background: #FEE2E2; color: #DC2626; }
        .lc-ba-bullet-icon.green { background: #DCFCE7; color: #16A34A; }

        /* Three tabs */
        .lc-tabs { padding: 100px 0; background: #fff; }
        .lc-tabs-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
        .lc-tabs-header { text-align: center; margin-bottom: 48px; }
        .lc-tabs-title {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 36px; font-weight: 800; color: #0F172A;
          margin-bottom: 12px; line-height: 1.15;
        }
        .lc-tabs-sub { font-size: 16px; color: #64748B; }
        .lc-tab-nav {
          display: flex; gap: 0; border-bottom: 1px solid #E2E8F0;
          justify-content: center; margin-bottom: 48px;
        }
        .lc-tab-btn {
          padding: 14px 28px; font-size: 14px; font-weight: 600; color: #94A3B8;
          background: none; border: none; cursor: pointer;
          border-bottom: 2px solid transparent; transition: all 0.2s;
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
        }
        .lc-tab-btn:hover { color: #475569; }
        .lc-tab-btn.active { color: #3730A3; border-bottom-color: #3730A3; }
        .lc-tab-content {
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
          animation: lcFade 0.3s ease;
        }
        @keyframes lcFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .lc-tab-text h3 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 28px; font-weight: 800; color: #0F172A;
          margin-bottom: 16px; line-height: 1.2;
        }
        .lc-tab-text p {
          font-size: 15px; line-height: 1.7; color: #64748B; margin-bottom: 20px;
        }
        .lc-stat-callout {
          background: #F8FAFC; border-radius: 10px; padding: 16px 20px;
          border-left: 3px solid #3730A3;
          font-size: 14px; font-weight: 600; color: #0F172A; line-height: 1.5;
        }

        /* Mockups */
        .lc-mockup {
          background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden;
          box-shadow: 0 12px 40px rgba(0,0,0,0.06);
        }
        .lc-mockup-bar {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 16px; background: #0F172A; color: #fff;
          font-size: 11px; font-weight: 700;
        }
        .lc-mockup-dots { display: flex; gap: 4px; }
        .lc-mockup-dots span { width: 7px; height: 7px; border-radius: 50%; }
        .lc-mockup-dots span:nth-child(1) { background: #FF5F57; }
        .lc-mockup-dots span:nth-child(2) { background: #FEBC2E; }
        .lc-mockup-dots span:nth-child(3) { background: #28C840; }
        .lc-mockup-body { padding: 20px; }

        /* Form mockup */
        .lc-form-title { font-size: 15px; font-weight: 700; color: #0F172A; margin-bottom: 2px; }
        .lc-form-sub { font-size: 11px; color: #94A3B8; margin-bottom: 12px; }
        .lc-form-badge {
          display: inline-flex; align-items: center; gap: 4px; font-size: 10px;
          font-weight: 700; color: #22C55E; background: rgba(34,197,94,0.08);
          padding: 4px 10px; border-radius: 100px; margin-bottom: 12px;
        }
        .lc-form-field { margin-bottom: 8px; }
        .lc-form-field-label { font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
        .lc-form-field-input {
          width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid #E2E8F0;
          background: #F8FAFC; font-size: 11px; color: #0F172A; box-sizing: border-box;
        }
        .lc-form-field-input.active { border-color: #3730A3; background: rgba(55,48,163,0.02); }
        .lc-form-steps { display: flex; gap: 4px; margin: 12px 0 4px; }
        .lc-form-step { flex: 1; height: 3px; border-radius: 2px; background: #E2E8F0; }
        .lc-form-step.done { background: #22C55E; }
        .lc-form-step.current { background: #3730A3; }
        .lc-form-step-labels { display: flex; justify-content: space-between; font-size: 8px; color: #94A3B8; margin-bottom: 12px; }
        .lc-form-btn {
          width: 100%; padding: 9px; background: #3730A3; color: #fff; border: none;
          border-radius: 6px; font-size: 12px; font-weight: 700;
        }

        /* Scoring mockup */
        .lc-score-cards { display: flex; flex-direction: column; gap: 10px; }
        .lc-score-card {
          background: #fff; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px 16px;
          display: flex; align-items: center; gap: 14px;
        }
        .lc-score-badge {
          font-size: 9px; font-weight: 700; padding: 4px 12px; border-radius: 100px;
          text-transform: uppercase; letter-spacing: 0.3px; flex-shrink: 0;
        }
        .lc-score-badge.hot { background: rgba(34,197,94,0.1); color: #22C55E; }
        .lc-score-badge.warm { background: rgba(245,158,11,0.1); color: #D97706; }
        .lc-score-badge.cold { background: rgba(148,163,184,0.12); color: #94A3B8; }
        .lc-score-info { flex: 1; }
        .lc-score-name { font-size: 13px; font-weight: 700; color: #0F172A; }
        .lc-score-detail { font-size: 11px; color: #94A3B8; }
        .lc-score-action {
          font-size: 10px; font-weight: 600; color: #3730A3; flex-shrink: 0;
        }

        /* Sequence mockup */
        .lc-seq { padding: 20px; }
        .lc-seq-title { font-size: 13px; font-weight: 700; color: #0F172A; margin-bottom: 16px; }
        .lc-seq-track { margin-bottom: 16px; }
        .lc-seq-track:last-child { margin-bottom: 0; }
        .lc-seq-track-header {
          display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
        }
        .lc-seq-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .lc-seq-dot.hot { background: #22C55E; }
        .lc-seq-dot.warm { background: #F59E0B; }
        .lc-seq-dot.cold { background: #94A3B8; }
        .lc-seq-label { font-size: 12px; font-weight: 700; color: #0F172A; }
        .lc-seq-days { font-size: 11px; color: #94A3B8; margin-left: auto; }
        .lc-seq-bar { height: 6px; border-radius: 3px; background: #F1F5F9; overflow: hidden; margin-bottom: 6px; }
        .lc-seq-fill { height: 100%; border-radius: 3px; }
        .lc-seq-fill.hot { background: #22C55E; width: 25%; }
        .lc-seq-fill.warm { background: #F59E0B; width: 55%; }
        .lc-seq-fill.cold { background: #94A3B8; width: 100%; }
        .lc-seq-steps { display: flex; gap: 4px; flex-wrap: wrap; }
        .lc-seq-step {
          padding: 3px 8px; background: #F8FAFC; border: 1px solid #E2E8F0;
          border-radius: 4px; font-size: 9px; font-weight: 600; color: #64748B;
        }

        /* Feature cards */
        .lc-features { padding: 80px 0 100px; background: #F8FAFC; }
        .lc-features-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
        .lc-features-title {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 32px; font-weight: 800; color: #0F172A;
          text-align: center; margin-bottom: 48px; line-height: 1.2;
        }
        .lc-features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .lc-feature-card {
          background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 28px;
          transition: all 0.2s;
        }
        .lc-feature-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.05); transform: translateY(-2px); }
        .lc-feature-card h4 {
          font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 8px;
        }
        .lc-feature-card p { font-size: 13px; line-height: 1.6; color: #64748B; }

        /* Financial Pre-Qualification */
        .lc-finprequal { padding: 120px 0; background: #fff; }
        .lc-finprequal-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 24px;
          display: grid; grid-template-columns: 1fr 1.1fr; gap: 80px; align-items: center;
        }
        .lc-finprequal h2 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 40px; font-weight: 800; color: #0F172A;
          margin-bottom: 20px; line-height: 1.1;
        }
        .lc-finprequal p.desc {
          font-size: 16px; line-height: 1.7; color: #64748B; margin-bottom: 24px;
        }
        .lc-us-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 600; color: #64748B;
          background: #EFF6FF; border: 1px solid #BFDBFE;
          padding: 6px 14px; border-radius: 100px;
        }
        /* Card composition */
        .lc-fin-comp {
          background: #F8FAFC; border-radius: 20px; padding: 28px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
        }
        .lc-fin-card {
          background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 24px;
        }
        .lc-fin-card-kicker {
          font-size: 10px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1.2px; color: #94A3B8; margin-bottom: 10px;
        }
        .lc-fin-card h4 {
          font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 14px;
        }
        .lc-fin-toggle-row {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px;
        }
        .lc-fin-toggle {
          width: 40px; height: 22px; border-radius: 11px; background: #3730A3;
          position: relative; flex-shrink: 0;
        }
        .lc-fin-toggle::after {
          content: ''; position: absolute; top: 3px; right: 3px;
          width: 16px; height: 16px; border-radius: 50%; background: #fff;
        }
        .lc-fin-toggle-text { font-size: 13px; font-weight: 600; color: #0F172A; }
        .lc-fin-toggle-sub { font-size: 11px; color: #94A3B8; }
        /* Lead result card */
        /* Credit score gauge */
        .lc-fin-gauge-card { text-align: center; position: relative; }
        .lc-fin-instant-badge {
          display: inline-block; font-size: 10px; font-weight: 700;
          color: #15803D; background: #F0FDF4; border: 1px solid #BBF7D0;
          padding: 4px 14px; border-radius: 6px; margin-bottom: 14px;
        }
        .lc-fin-gauge-ring {
          width: 140px; height: 80px; margin: 0 auto 8px; position: relative; overflow: hidden;
        }
        .lc-fin-gauge-svg { width: 140px; height: 80px; margin: 0 auto; display: block; }
        .lc-fin-gauge-score {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 36px; font-weight: 800; color: #0F172A;
        }
        .lc-fin-gauge-label {
          font-size: 15px; font-weight: 700; color: #22C55E;
        }
        .lc-fin-silent-note {
          font-size: 11px; color: #94A3B8; margin-top: 10px;
          font-style: normal;
        }
        /* Qualify/Disqualify branch */
        .lc-fin-branch {
          display: flex; flex-direction: column; gap: 8px;
          margin-top: 14px;
        }
        .lc-fin-branch-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 600; color: #0F172A;
        }
        .lc-fin-branch-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .lc-fin-branch-dot.green { background: #22C55E; }
        .lc-fin-branch-dot.red { background: #EF4444; }
        /* Form card */
        .lc-fin-form-header {
          display: flex; align-items: center; gap: 10px; margin-bottom: 4px;
        }
        .lc-fin-form-logo {
          width: 32px; height: 32px; border-radius: 8px; background: #3730A3;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 800; color: #fff;
        }
        .lc-fin-form-title { font-size: 15px; font-weight: 700; color: #0F172A; }
        .lc-fin-form-step { font-size: 11px; color: #94A3B8; margin-bottom: 14px; }
        .lc-fin-form-progress { display: flex; gap: 6px; margin-bottom: 18px; }
        .lc-fin-form-bar { flex: 1; height: 3px; border-radius: 2px; background: #E2E8F0; }
        .lc-fin-form-bar.done { background: #3730A3; }
        .lc-fin-form-bar.current { background: #5EC4E3; }
        .lc-fin-form-label { font-size: 12px; font-weight: 600; color: #0F172A; margin-bottom: 6px; }
        .lc-fin-form-label span { color: #EF4444; }
        .lc-fin-form-input {
          width: 100%; padding: 10px 14px; border: 1px solid #E2E8F0; border-radius: 8px;
          font-size: 14px; color: #0F172A; margin-bottom: 12px; box-sizing: border-box;
          background: #fff;
        }
        .lc-fin-form-btn {
          width: 100%; padding: 12px; background: #3730A3; color: #fff; border: none;
          border-radius: 10px; font-size: 15px; font-weight: 700; cursor: default;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .lc-fin-form-captured {
          text-align: center; font-size: 12px; color: #94A3B8; margin-top: 10px;
        }
        /* Bottom badges row */
        .lc-fin-badges-row {
          display: flex; gap: 20px; grid-column: 1 / -1; padding: 4px 0 0;
        }
        .lc-fin-badge-item {
          display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #0F172A;
        }
        .lc-fin-badge-dot { width: 10px; height: 10px; border-radius: 50%; }
        .lc-fin-badge-dot.green { background: #22C55E; }
        .lc-fin-badge-dot.red { background: #EF4444; }
        .lc-fin-badge-dot.amber { background: #F59E0B; }
        /* Scoring card */
        .lc-fin-scoring-card {
          grid-column: 2; background: #F8FAFC; border: 1px solid #E2E8F0;
          border-radius: 14px; padding: 20px 24px;
        }
        .lc-fin-scoring-title {
          font-size: 10px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1.2px; color: #3730A3; margin-bottom: 14px;
        }
        .lc-fin-scoring-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 0;
        }
        .lc-fin-scoring-label { font-size: 14px; font-weight: 600; color: #0F172A; }
        .lc-fin-scoring-bars { display: flex; gap: 4px; }
        .lc-fin-scoring-pip {
          width: 24px; height: 8px; border-radius: 4px;
        }
        .lc-fin-scoring-pip.filled { background: #3730A3; }
        .lc-fin-scoring-pip.empty { background: #E2E8F0; }

        /* 2D Matrix */
        .lc-matrix-section { padding: 100px 0; background: #F8FAFC; }
        .lc-matrix-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
        .lc-matrix-text { max-width: 700px; margin-bottom: 48px; }
        .lc-matrix-text h2 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 36px; font-weight: 800; color: #0F172A;
          margin-bottom: 16px; line-height: 1.15;
        }
        .lc-matrix-text p { font-size: 16px; line-height: 1.7; color: #64748B; }
        .lc-matrix {
          background: #fff; border: 1px solid #E2E8F0; border-radius: 12px;
          overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04);
        }
        .lc-matrix-header {
          display: grid; grid-template-columns: 100px repeat(3, 1fr);
          background: #F8FAFC; border-bottom: 1px solid #E2E8F0;
        }
        .lc-matrix-header-cell {
          padding: 12px 16px; font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.5px; color: #64748B; text-align: center;
        }
        .lc-matrix-header-cell:first-child { text-align: left; }
        .lc-matrix-row {
          display: grid; grid-template-columns: 100px repeat(3, 1fr);
          border-bottom: 1px solid #F1F5F9;
        }
        .lc-matrix-row:last-child { border-bottom: none; }
        .lc-matrix-label {
          padding: 16px; font-size: 12px; font-weight: 700;
          display: flex; align-items: center; gap: 6px;
        }
        .lc-matrix-dot { width: 8px; height: 8px; border-radius: 50%; }
        .lc-matrix-dot.hot { background: #22C55E; }
        .lc-matrix-dot.warm { background: #F59E0B; }
        .lc-matrix-dot.cold { background: #94A3B8; }
        .lc-matrix-cell {
          padding: 14px 12px; text-align: center; font-size: 11px;
          font-weight: 600; border-left: 1px solid #F1F5F9;
        }
        .lc-matrix-cell.high { background: rgba(34,197,94,0.06); color: #15803D; }
        .lc-matrix-cell.mid { background: rgba(245,158,11,0.04); color: #B45309; }
        .lc-matrix-cell.low { background: rgba(148,163,184,0.06); color: #64748B; }

        /* ROI */
        .lc-roi { padding: 100px 0; background: #fff; }
        .lc-roi-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 24px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
        }
        .lc-roi-text h2 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 36px; font-weight: 800; color: #0F172A;
          margin-bottom: 16px; line-height: 1.15;
        }
        .lc-roi-calc {
          background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 32px;
        }
        .lc-roi-calc-title {
          font-size: 16px; font-weight: 700; margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
        }
        .lc-roi-calc-title span {
          font-size: 12px; padding: 3px 8px; background: rgba(34,197,94,0.1);
          border-radius: 4px; color: #22C55E; font-weight: 600;
        }
        .lc-roi-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 0; border-bottom: 1px solid #E2E8F0;
        }
        .lc-roi-row:last-child { border-bottom: none; }
        .lc-roi-label { font-size: 14px; color: #64748B; }
        .lc-roi-value { font-size: 15px; font-weight: 600; }
        .lc-roi-input-wrap { display: flex; align-items: center; gap: 12px; }
        .lc-roi-input-value {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; font-weight: 600; color: #0F172A; min-width: 68px; text-align: right;
        }
        .lc-roi-slider {
          -webkit-appearance: none; appearance: none; width: 130px; height: 5px;
          border-radius: 3px; background: #E2E8F0; outline: none; cursor: pointer;
        }
        .lc-roi-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none; width: 18px; height: 18px;
          border-radius: 50%; background: #3730A3; cursor: pointer;
          box-shadow: 0 0 8px rgba(55,48,163,0.3);
        }
        .lc-roi-result {
          margin-top: 16px; padding: 16px; background: rgba(34,197,94,0.06);
          border: 1px solid rgba(52,211,153,0.2); border-radius: 10px; text-align: center;
        }
        .lc-roi-result-label { font-size: 12px; color: #22C55E; font-weight: 600; margin-bottom: 2px; }
        .lc-roi-result-value {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 32px; font-weight: 800; color: #22C55E; transition: transform 0.15s ease;
        }
        .lc-roi-result-sub { font-size: 11px; color: #94A3B8; margin-top: 2px; }

        /* Mock chat */
        .lc-chat-section { padding: 80px 0 100px; background: #F8FAFC; }
        .lc-chat-inner { max-width: 700px; margin: 0 auto; padding: 0 24px; }
        .lc-chat-title {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 28px; font-weight: 800; color: #0F172A;
          text-align: center; margin-bottom: 32px;
        }
        .lc-chat-window {
          background: #fff; border: 1px solid #E2E8F0; border-radius: 16px;
          overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.06);
        }
        .lc-chat-bar {
          padding: 12px 20px; background: #0F172A; color: #fff;
          font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 8px;
        }
        .lc-chat-online { width: 8px; height: 8px; border-radius: 50%; background: #22C55E; }
        .lc-chat-msgs { padding: 24px 20px; display: flex; flex-direction: column; gap: 16px; }
        .lc-chat-msg {
          max-width: 80%; padding: 14px 18px; border-radius: 14px;
          font-size: 14px; line-height: 1.5;
        }
        .lc-chat-msg.user {
          align-self: flex-end; background: #3730A3; color: #fff;
          border-bottom-right-radius: 4px;
        }
        .lc-chat-msg.system {
          align-self: flex-start; background: #F8FAFC; color: #0F172A;
          border: 1px solid #E2E8F0; border-bottom-left-radius: 4px;
        }
        .lc-chat-msg.system strong { color: #3730A3; }
        .lc-chat-msg .msg-label {
          font-size: 10px; font-weight: 700; color: #94A3B8;
          text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;
        }

        /* Bottom CTA */
        .lc-bottom-cta { padding: 100px 24px; text-align: center; }
        .lc-bottom-cta-box {
          background: linear-gradient(135deg, #3730A3 0%, #4338CA 100%);
          border-radius: 24px; padding: 72px 48px; max-width: 900px;
          margin: 0 auto; position: relative; overflow: hidden;
        }
        .lc-bottom-cta-box::before {
          content: ''; position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 60%);
          pointer-events: none;
        }
        .lc-bottom-cta-box h2 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 36px; font-weight: 800; color: #fff; margin-bottom: 14px; position: relative;
        }
        .lc-bottom-cta-box p {
          font-size: 17px; color: rgba(255,255,255,0.7); margin-bottom: 32px; position: relative;
        }
        .lc-bottom-cta-box a {
          display: inline-flex; padding: 16px 40px;
          background: #fff; color: #3730A3; font-weight: 700; font-size: 16px;
          border-radius: 100px; text-decoration: none; transition: all 0.2s; position: relative;
        }
        .lc-bottom-cta-box a:hover { background: #F8FAFC; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }

        /* Footer */
        .lc-footer {
          padding: 40px 24px; border-top: 1px solid rgba(0,0,0,0.06);
          display: flex; justify-content: space-between; align-items: center;
          max-width: 1100px; margin: 0 auto;
        }
        .lc-footer-links { display: flex; gap: 24px; }
        .lc-footer-links a { font-size: 13px; color: #94A3B8; text-decoration: none; }
        .lc-footer-links a:hover { color: #3730A3; }

        /* Responsive */
        @media (max-width: 900px) {
          .lc-hero h1 { font-size: 36px; }
          .lc-ba-grid { grid-template-columns: 1fr; }
          .lc-ba-cols { grid-template-columns: 1fr; }
          .lc-ba-col:first-child { border-radius: 16px 16px 0 0; border-right: 1px solid #E2E8F0; border-bottom: none; }
          .lc-ba-col:last-child { border-radius: 0 0 16px 16px; }
          .lc-ba-cal-cell { font-size: 6px; padding: 4px 2px; }
          .lc-ba-filter-float { position: relative; top: auto; left: auto; width: 100%; margin-bottom: 14px; }
          .lc-tab-content, .lc-roi-inner, .lc-finprequal-inner { grid-template-columns: 1fr; gap: 40px; }
          .lc-tab-nav { overflow-x: auto; justify-content: flex-start; }
          .lc-fin-comp { grid-template-columns: 1fr; }
          .lc-fin-scoring-card { grid-column: 1; }
          .lc-features-grid { grid-template-columns: 1fr; }
          .lc-matrix-header, .lc-matrix-row { grid-template-columns: 80px repeat(3, 1fr); }
        }
        @media (max-width: 640px) {
          .lc-hero { padding: 140px 0 60px; }
          .lc-hero h1 { font-size: 30px; }
          .lc-hero-sub { font-size: 15px; }
          .lc-ba, .lc-tabs, .lc-features, .lc-roi, .lc-finprequal, .lc-matrix-section, .lc-chat-section { padding: 60px 0; }
          .lc-ba-title, .lc-tabs-title, .lc-features-title { font-size: 26px; }
          .lc-tab-text h3 { font-size: 22px; }
          .lc-finprequal h2, .lc-matrix-text h2, .lc-roi-text h2 { font-size: 28px; }
          .lc-roi-calc { padding: 20px; }
          .lc-roi-result-value { font-size: 26px; }
          .lc-roi-slider { width: 100px; }
          .lc-matrix-cell { font-size: 9px; padding: 10px 6px; }
          .lc-bottom-cta-box { padding: 48px 24px; border-radius: 16px; }
          .lc-bottom-cta-box h2 { font-size: 26px; }
          .lc-footer { flex-direction: column; gap: 16px; text-align: center; }
        }
      `}</style>

      <div className="lc-page">
        <SiteNav />

        {/* Hero */}
        <section className="lc-hero">
          <div className="lc-hero-inner">
            <div className="lc-kicker">Lead capture &amp; conversion</div>
            <h1>One form, instant increase in patient bookings.</h1>
            <p className="lc-hero-sub">67% of leads abandon your form before finishing. Your competitors respond in minutes while your team checks an inbox hours later. Caddie AI captures every inquiry, scores them instantly, and follows up automatically.</p>
            <a href="https://calendly.com/danika-clinictech/clinictech-1-hour-meeting-clone" target="_blank" rel="noopener noreferrer" className="lc-hero-cta">Book a discovery call</a>
          </div>
        </section>

        {/* Before / After */}
        <section className="lc-ba">
          <div className="lc-ba-inner">
            <h2 className="lc-ba-title">Turn a simple form into your clinic&apos;s growth engine</h2>
            <div className="lc-ba-cols">
              {/* OLD WAY */}
              <div className="lc-ba-col">
                <div className="lc-ba-col-label">The Old Way</div>
                <div className="lc-ba-visual">
                  <div className="lc-ba-cal-header">
                    <div className="lc-ba-cal-month">April 2026</div>
                    <div className="lc-ba-cal-view">Week view</div>
                  </div>
                  <div className="lc-ba-cal">
                    <div></div>
                    <div className="lc-ba-cal-day">Mon</div>
                    <div className="lc-ba-cal-day">Tue</div>
                    <div className="lc-ba-cal-day">Wed</div>
                    <div className="lc-ba-cal-day">Thu</div>
                    <div className="lc-ba-cal-day">Fri</div>

                    <div className="lc-ba-cal-time">9am</div>
                    <div className="lc-ba-cal-cell line"></div>
                    <div className="lc-ba-cal-cell bad">Wrong Country</div>
                    <div className="lc-ba-cal-cell line"></div>
                    <div className="lc-ba-cal-cell bad">Unqualified</div>
                    <div className="lc-ba-cal-cell bad">No Budget</div>

                    <div className="lc-ba-cal-time">11am</div>
                    <div className="lc-ba-cal-cell meh">No Show</div>
                    <div className="lc-ba-cal-cell meh">Fake Lead</div>
                    <div className="lc-ba-cal-cell bad">Unqualified</div>
                    <div className="lc-ba-cal-cell line"></div>
                    <div className="lc-ba-cal-cell bad">No Show</div>

                    <div className="lc-ba-cal-time">1pm</div>
                    <div className="lc-ba-cal-cell bad">No Budget</div>
                    <div className="lc-ba-cal-cell line"></div>
                    <div className="lc-ba-cal-cell meh">No Show</div>
                    <div className="lc-ba-cal-cell bad">Wrong Country</div>
                    <div className="lc-ba-cal-cell bad">No Budget</div>

                    <div className="lc-ba-cal-time">3pm</div>
                    <div className="lc-ba-cal-cell meh">Fake Lead</div>
                    <div className="lc-ba-cal-cell meh">No Show</div>
                    <div className="lc-ba-cal-cell line"></div>
                    <div className="lc-ba-cal-cell line"></div>
                    <div className="lc-ba-cal-cell empty"></div>
                  </div>
                  <div className="lc-ba-closing">
                      <div>
                        <div className="lc-ba-closing-label">Closing rate</div>
                        <div className="lc-ba-closing-value">12%</div>
                      </div>
                      <div className="lc-ba-closing-change down">-82%</div>
                    </div>
                </div>
                <div className="lc-ba-bullets">
                  <div className="lc-ba-bullet"><div className="lc-ba-bullet-icon red">&#10005;</div> <span><strong>Losing 70%+ leads.</strong> They leave before scheduling</span></div>
                  <div className="lc-ba-bullet"><div className="lc-ba-bullet-icon red">&#10005;</div> <span><strong>Wasting 100+ hours</strong> with non-qualified bookings</span></div>
                  <div className="lc-ba-bullet"><div className="lc-ba-bullet-icon red">&#10005;</div> <span><strong>Poor closing rate.</strong> No way to route leads to reps</span></div>
                  <div className="lc-ba-bullet"><div className="lc-ba-bullet-icon red">&#10005;</div> <span><strong>Hoping for the best.</strong> No clear data on what works</span></div>
                  <div className="lc-ba-bullet"><div className="lc-ba-bullet-icon red">&#10005;</div> <span><strong>Too many tools.</strong> Calendar, spreadsheet, notes, CRM</span></div>
                </div>
              </div>

              {/* NEW WAY */}
              <div className="lc-ba-col">
                <div className="lc-ba-col-label">With Caddie AI</div>
                <div className="lc-ba-visual">
                  {/* Floating filter card */}
                  <div className="lc-ba-filter-float">
                    <div className="lc-ba-filter-logo"><div className="lc-ba-filter-logo-icon">CA</div> Smart intake filters</div>
                    <div className="lc-ba-filter-row"><div className="lc-ba-filter-toggle on"></div> Budget pre-qualification</div>
                    <div className="lc-ba-filter-row"><div className="lc-ba-filter-toggle on"></div> Treatment match scoring</div>
                    <div className="lc-ba-filter-row"><div className="lc-ba-filter-toggle on"></div> AI lead scoring</div>
                    <div className="lc-ba-filter-row"><div className="lc-ba-filter-toggle"></div> Country filtering</div>
                  </div>

                  <div className="lc-ba-cal-header">
                    <div className="lc-ba-cal-month">April 2026</div>
                    <div className="lc-ba-cal-view">Week view</div>
                  </div>
                  <div className="lc-ba-cal">
                    <div></div>
                    <div className="lc-ba-cal-day">Mon</div>
                    <div className="lc-ba-cal-day">Tue</div>
                    <div className="lc-ba-cal-day">Wed</div>
                    <div className="lc-ba-cal-day">Thu</div>
                    <div className="lc-ba-cal-day">Fri</div>

                    <div className="lc-ba-cal-time">9am</div>
                    <div className="lc-ba-cal-cell good">Qualified</div>
                    <div className="lc-ba-cal-cell good">Booked $12K</div>
                    <div className="lc-ba-cal-cell good">Booked $8K</div>
                    <div className="lc-ba-cal-cell deposit">Deposit $1K</div>
                    <div className="lc-ba-cal-cell good">Booked $15K</div>

                    <div className="lc-ba-cal-time">11am</div>
                    <div className="lc-ba-cal-cell good">Booked $22K</div>
                    <div className="lc-ba-cal-cell good">Qualified</div>
                    <div className="lc-ba-cal-cell good">Booked $18K</div>
                    <div className="lc-ba-cal-cell good">Booked $10K</div>
                    <div className="lc-ba-cal-cell good">Qualified</div>

                    <div className="lc-ba-cal-time">1pm</div>
                    <div className="lc-ba-cal-cell good">Booked $9K</div>
                    <div className="lc-ba-cal-cell good">Booked $14K</div>
                    <div className="lc-ba-cal-cell empty"></div>
                    <div className="lc-ba-cal-cell empty"></div>
                    <div className="lc-ba-cal-cell empty"></div>

                    <div className="lc-ba-cal-time">3pm</div>
                    <div className="lc-ba-cal-cell empty"></div>
                    <div className="lc-ba-cal-cell empty"></div>
                    <div className="lc-ba-cal-cell empty"></div>
                    <div className="lc-ba-cal-cell empty"></div>
                    <div className="lc-ba-cal-cell empty"></div>
                  </div>
                  <div className="lc-ba-closing">
                      <div>
                        <div className="lc-ba-closing-label">Closing rate</div>
                        <div className="lc-ba-closing-value">46%</div>
                      </div>
                      <div className="lc-ba-closing-change up">+64%</div>
                    </div>
                </div>
                <div className="lc-ba-bullets">
                  <div className="lc-ba-bullet"><div className="lc-ba-bullet-icon green">&#10003;</div> <span><strong>Capture 70%+ leads.</strong> Name and email before anything else</span></div>
                  <div className="lc-ba-bullet"><div className="lc-ba-bullet-icon green">&#10003;</div> <span><strong>Save 100+ hours.</strong> Auto-disqualify unfit leads upfront</span></div>
                  <div className="lc-ba-bullet"><div className="lc-ba-bullet-icon green">&#10003;</div> <span><strong>46% closing rate.</strong> Only qualified leads reach your team</span></div>
                  <div className="lc-ba-bullet"><div className="lc-ba-bullet-icon green">&#10003;</div> <span><strong>AI-powered scoring.</strong> Hot, warm, and cold lead tiers</span></div>
                  <div className="lc-ba-bullet"><div className="lc-ba-bullet-icon green">&#10003;</div> <span><strong>All-in-one platform.</strong> Intake, pipeline, follow-up, portal</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Three tabs */}
        <section className="lc-tabs">
          <div className="lc-tabs-inner">
            <div className="lc-tabs-header">
              <div className="lc-kicker">How it works</div>
              <h2 className="lc-tabs-title">Capture. Score. Nurture to consultation.</h2>
              <p className="lc-tabs-sub">Three layers that turn anonymous visitors into booked patients.</p>
            </div>

            <div className="lc-tab-nav">
              <button className={`lc-tab-btn ${activeTab === 0 ? "active" : ""}`} onClick={() => setActiveTab(0)}>Capture every inquiry</button>
              <button className={`lc-tab-btn ${activeTab === 1 ? "active" : ""}`} onClick={() => setActiveTab(1)}>Score &amp; qualify automatically</button>
              <button className={`lc-tab-btn ${activeTab === 2 ? "active" : ""}`} onClick={() => setActiveTab(2)}>Nurture to consultation</button>
            </div>

            {activeTab === 0 && (
              <div className="lc-tab-content" key="t0">
                <div className="lc-tab-text">
                  <h3>Turn abandoned forms into booked consultations.</h3>
                  <p>Our multi-step intake captures name and email on step one, before the patient ever hits submit. Condition, medical history, and scheduling preferences come after. Even if they abandon at step two, you have a lead. Traditional forms give you nothing unless the patient completes every field.</p>
                  <div className="lc-stat-callout">Recover the 60-70% of visitors who abandon flat forms. Capture 3-5x more inquiries from the same ad spend.</div>
                </div>
                <div className="lc-mockup">
                  <div className="lc-mockup-bar">
                    <div className="lc-mockup-dots"><span></span><span></span><span></span></div>
                    Smart Intake Form
                  </div>
                  <div className="lc-mockup-body">
                    <div className="lc-form-title">Start Your Journey</div>
                    <div className="lc-form-sub">Tell us about yourself to get started</div>
                    <div className="lc-form-badge">&#10003; Lead captured at step 1</div>
                    <div className="lc-form-field">
                      <div className="lc-form-field-label">Full Name</div>
                      <div className="lc-form-field-input active">Sarah Mitchell</div>
                    </div>
                    <div className="lc-form-field">
                      <div className="lc-form-field-label">Email</div>
                      <div className="lc-form-field-input active">sarah@email.com</div>
                    </div>
                    <div className="lc-form-field">
                      <div className="lc-form-field-label">Condition</div>
                      <div className="lc-form-field-input">Select a condition...</div>
                    </div>
                    <div className="lc-form-steps">
                      <div className="lc-form-step done"></div>
                      <div className="lc-form-step current"></div>
                      <div className="lc-form-step"></div>
                      <div className="lc-form-step"></div>
                    </div>
                    <div className="lc-form-step-labels"><span>Contact</span><span>Condition</span><span>History</span><span>Schedule</span></div>
                    <div className="lc-form-btn">Continue</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="lc-tab-content" key="t1">
                <div className="lc-tab-text">
                  <h3>Know exactly who&apos;s ready to book, right now.</h3>
                  <p>Every lead is automatically scored as Hot, Warm, or Cold based on how they engaged, what condition they&apos;re inquiring about, and how far they got in the intake. Your team sees a prioritized list, not a messy inbox. Hot leads get flagged immediately.</p>
                  <div className="lc-stat-callout">Stop wasting consult time on tire-kickers. Your team only talks to patients who are ready.</div>
                </div>
                <div>
                  <div className="lc-score-cards">
                    <div className="lc-score-card">
                      <div className="lc-score-badge hot">Hot</div>
                      <div className="lc-score-info">
                        <div className="lc-score-name">Sarah M. - Knee Stem Cell</div>
                        <div className="lc-score-detail">Completed full intake, $15k procedure</div>
                      </div>
                      <div className="lc-score-action">Auto-booked</div>
                    </div>
                    <div className="lc-score-card">
                      <div className="lc-score-badge warm">Warm</div>
                      <div className="lc-score-info">
                        <div className="lc-score-name">Michael T. - PRP Inquiry</div>
                        <div className="lc-score-detail">Abandoned at step 2, email captured</div>
                      </div>
                      <div className="lc-score-action">Nurturing</div>
                    </div>
                    <div className="lc-score-card">
                      <div className="lc-score-badge cold">Cold</div>
                      <div className="lc-score-info">
                        <div className="lc-score-name">Jennifer K. - General</div>
                        <div className="lc-score-detail">Email only, browsed pricing page</div>
                      </div>
                      <div className="lc-score-action">90-day drip</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="lc-tab-content" key="t2">
                <div className="lc-tab-text">
                  <h3>Automated follow-up that runs while you sleep.</h3>
                  <p>Every lead gets a sequence tailored to how ready they are. Hot leads get a 5-day high-touch cadence. Warm leads get nurtured over 30 days. Cold leads stay in a 90-day drip until they&apos;re ready. No manual work. No leads falling through cracks.</p>
                  <div className="lc-stat-callout">Clinics using automated follow-up within 5 minutes see 3-5x higher booking rates from the same lead volume.</div>
                </div>
                <div className="lc-mockup">
                  <div className="lc-mockup-bar">
                    <div className="lc-mockup-dots"><span></span><span></span><span></span></div>
                    Follow-Up Sequences
                  </div>
                  <div className="lc-seq">
                    <div className="lc-seq-title">Active Sequences</div>
                    <div className="lc-seq-track">
                      <div className="lc-seq-track-header">
                        <div className="lc-seq-dot hot"></div>
                        <div className="lc-seq-label">Hot Leads</div>
                        <div className="lc-seq-days">5-day cadence</div>
                      </div>
                      <div className="lc-seq-bar"><div className="lc-seq-fill hot"></div></div>
                      <div className="lc-seq-steps">
                        <div className="lc-seq-step">Instant SMS</div>
                        <div className="lc-seq-step">Day 1 Email</div>
                        <div className="lc-seq-step">Day 3 Call</div>
                        <div className="lc-seq-step">Day 5 Final</div>
                      </div>
                    </div>
                    <div className="lc-seq-track">
                      <div className="lc-seq-track-header">
                        <div className="lc-seq-dot warm"></div>
                        <div className="lc-seq-label">Warm Leads</div>
                        <div className="lc-seq-days">30-day nurture</div>
                      </div>
                      <div className="lc-seq-bar"><div className="lc-seq-fill warm"></div></div>
                      <div className="lc-seq-steps">
                        <div className="lc-seq-step">Education</div>
                        <div className="lc-seq-step">Case study</div>
                        <div className="lc-seq-step">Offer</div>
                        <div className="lc-seq-step">Check-in</div>
                      </div>
                    </div>
                    <div className="lc-seq-track">
                      <div className="lc-seq-track-header">
                        <div className="lc-seq-dot cold"></div>
                        <div className="lc-seq-label">Cold Leads</div>
                        <div className="lc-seq-days">90-day drip</div>
                      </div>
                      <div className="lc-seq-bar"><div className="lc-seq-fill cold"></div></div>
                      <div className="lc-seq-steps">
                        <div className="lc-seq-step">Newsletter</div>
                        <div className="lc-seq-step">Success stories</div>
                        <div className="lc-seq-step">Seasonal offers</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Feature cards with sharp headlines */}
        <section className="lc-features">
          <div className="lc-features-inner">
            <h2 className="lc-features-title">Built for clinics that want to fill up their calendars</h2>
            <div className="lc-features-grid">
              <div className="lc-feature-card">
                <h4>Fill your calendar with qualified patients</h4>
                <p>Every lead is scored automatically. Your team only spends time on patients who are qualified and ready to book. Everyone else gets nurtured until they are.</p>
              </div>
              <div className="lc-feature-card">
                <h4>3-5x more consultations from the same traffic</h4>
                <p>Partial capture grabs name and email at step one. Even if they leave, they enter a re-engagement sequence. Traditional forms give you nothing.</p>
              </div>
              <div className="lc-feature-card">
                <h4>Your hottest leads, flagged instantly</h4>
                <p>Hot lead alerts hit your team the moment a high-intent patient completes intake. No more digging through an inbox to find the ones who are ready.</p>
              </div>
              <div className="lc-feature-card">
                <h4>Every lead nurtured to consultation, automatically</h4>
                <p>5-day sequences for hot leads. 30-day nurture for warm. 90-day drip for cold. Every lead gets the right message at the right time, automatically.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Financial Pre-Qualification */}
        <section className="lc-finprequal" id="financial-prequalification">
          <div className="lc-finprequal-inner">
            <div>
              <div className="lc-kicker">Credit score enrichment is live</div>
              <h2>Qualify their financial readiness, before they get on a call</h2>
              <p className="desc">Caddie AI runs a silent credit soft-pull in the background while your patient fills out the intake form. No extra steps, no SSN field, no friction. By the time they hit submit, your team already knows if they can afford a $15,000 procedure. Only qualified patients reach your calendar.</p>
              <div className="lc-us-badge">&#127482;&#127480; Available for U.S.-based leads</div>
            </div>

            <div className="lc-fin-comp">
              {/* Top left: Intake settings */}
              <div className="lc-fin-card">
                <div className="lc-fin-card-kicker">Intake Settings</div>
                <h4>Financial screening</h4>
                <div className="lc-fin-toggle-row">
                  <div className="lc-fin-toggle"></div>
                  <div>
                    <div className="lc-fin-toggle-text">Affordability / Pre-qualification</div>
                    <div className="lc-fin-toggle-sub">Active on: Patient intake form</div>
                  </div>
                </div>
              </div>

              {/* Top right: Patient intake form */}
              <div className="lc-fin-card">
                <div className="lc-fin-form-header">
                  <div className="lc-fin-form-logo">CA</div>
                  <div>
                    <div className="lc-fin-form-title">Patient intake form</div>
                    <div className="lc-fin-form-step">Step 1 of 3</div>
                  </div>
                </div>
                <div className="lc-fin-form-progress">
                  <div className="lc-fin-form-bar done"></div>
                  <div className="lc-fin-form-bar current"></div>
                  <div className="lc-fin-form-bar"></div>
                </div>
                <div className="lc-fin-form-label">Full name <span>*</span></div>
                <div className="lc-fin-form-input">Sarah Mitchell</div>
                <div className="lc-fin-form-label">Email <span>*</span></div>
                <div className="lc-fin-form-input">sarah@email.com</div>
                <div className="lc-fin-form-btn">Continue &rarr;</div>
                <div className="lc-fin-form-captured">Lead captured at this step</div>
              </div>

              {/* Bottom left: Credit score gauge */}
              <div className="lc-fin-card lc-fin-gauge-card">
                <div className="lc-fin-instant-badge">Instant Check</div>
                <svg className="lc-fin-gauge-svg" viewBox="0 0 140 80">
                  {/* Gray track */}
                  <path d="M 15 70 A 55 55 0 0 1 125 70" fill="none" stroke="#E2E8F0" strokeWidth="10" strokeLinecap="round"/>
                  {/* Green fill up to needle - 823/850 is ~92% of the arc */}
                  <path d="M 15 70 A 55 55 0 0 1 120 52" fill="none" stroke="#22C55E" strokeWidth="10" strokeLinecap="round"/>
                  {/* Needle dot */}
                  <circle cx="120" cy="52" r="6" fill="#fff" stroke="#64748B" strokeWidth="2"/>
                </svg>
                <div className="lc-fin-gauge-score">823</div>
                <div className="lc-fin-gauge-label">Excellent</div>
                <div className="lc-fin-branch">
                  <div className="lc-fin-branch-item"><div className="lc-fin-branch-dot green"></div> Qualify</div>
                  <div className="lc-fin-branch-item"><div className="lc-fin-branch-dot red"></div> Disqualify</div>
                </div>
                <div className="lc-fin-silent-note">Runs silently in the background. No impact on patient credit.</div>
              </div>

              {/* Bottom right: Lead scoring */}
              <div className="lc-fin-scoring-card">
                <div className="lc-fin-scoring-title">Lead Scoring</div>
                <div className="lc-fin-scoring-row">
                  <div className="lc-fin-scoring-label">Budget fit</div>
                  <div className="lc-fin-scoring-bars">
                    <div className="lc-fin-scoring-pip filled"></div>
                    <div className="lc-fin-scoring-pip filled"></div>
                    <div className="lc-fin-scoring-pip filled"></div>
                  </div>
                </div>
                <div className="lc-fin-scoring-row">
                  <div className="lc-fin-scoring-label">Intent signals</div>
                  <div className="lc-fin-scoring-bars">
                    <div className="lc-fin-scoring-pip filled"></div>
                    <div className="lc-fin-scoring-pip filled"></div>
                    <div className="lc-fin-scoring-pip empty"></div>
                  </div>
                </div>
                <div className="lc-fin-scoring-row">
                  <div className="lc-fin-scoring-label">Timeline</div>
                  <div className="lc-fin-scoring-bars">
                    <div className="lc-fin-scoring-pip filled"></div>
                    <div className="lc-fin-scoring-pip empty"></div>
                    <div className="lc-fin-scoring-pip empty"></div>
                  </div>
                </div>
              </div>

              {/* Badge row */}
              <div className="lc-fin-badges-row">
                <div className="lc-fin-badge-item"><div className="lc-fin-badge-dot green"></div> Qualify</div>
                <div className="lc-fin-badge-item"><div className="lc-fin-badge-dot red"></div> Disqualify</div>
                <div className="lc-fin-badge-item"><div className="lc-fin-badge-dot amber"></div> Nurture</div>
              </div>
            </div>
          </div>
        </section>

        {/* ROI */}
        <section className="lc-roi">
          <div className="lc-roi-inner">
            <div className="lc-roi-text">
              <div className="lc-kicker">The math</div>
              <h2>One converted patient covers your entire annual subscription.</h2>
            </div>
            <div>
              <div className="lc-roi-calc">
                <div className="lc-roi-calc-title">Revenue Recovery Calculator <span>Interactive</span></div>
                <div className="lc-roi-row">
                  <div className="lc-roi-label">Monthly leads</div>
                  <div className="lc-roi-input-wrap">
                    <input type="range" min="10" max="200" value={leads} className="lc-roi-slider" onChange={(e) => { setLeads(parseInt(e.target.value)); animateTotal(); }} />
                    <div className="lc-roi-input-value">{leads}</div>
                  </div>
                </div>
                <div className="lc-roi-row">
                  <div className="lc-roi-label">Avg procedure value</div>
                  <div className="lc-roi-input-wrap">
                    <input type="range" min="2000" max="50000" value={procedureValue} step="1000" className="lc-roi-slider" onChange={(e) => { setProcedureValue(parseInt(e.target.value)); animateTotal(); }} />
                    <div className="lc-roi-input-value">${procedureValue.toLocaleString()}</div>
                  </div>
                </div>
                <div className="lc-roi-row">
                  <div className="lc-roi-label">Lost to slow follow-up</div>
                  <div className="lc-roi-value" style={{color:"#EF4444"}}>~60%</div>
                </div>
                <div className="lc-roi-row">
                  <div className="lc-roi-label">Recovered with Caddie AI</div>
                  <div className="lc-roi-value" style={{color:"#22C55E"}}>+{recovered}/mo</div>
                </div>
                <div className="lc-roi-result">
                  <div className="lc-roi-result-label">Additional Annual Revenue</div>
                  <div className="lc-roi-result-value" ref={totalRef}>${annual.toLocaleString()}+</div>
                  <div className="lc-roi-result-sub">from leads you&apos;re already getting</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="lc-bottom-cta">
          <div className="lc-bottom-cta-box">
            <h2>See it live with your clinic&apos;s branding.</h2>
            <p>15-minute demo. We&apos;ll show you the smart intake, AI scoring, and follow-up sequences customized for your clinic.</p>
            <a href="https://calendly.com/danika-clinictech/clinictech-1-hour-meeting-clone" target="_blank" rel="noopener noreferrer">Book a discovery call</a>
          </div>
        </section>

        <div className="lc-footer">
          <Link href="/">
            <img src="/caddie-logo.svg" alt="Caddie AI" style={{ height: 20, opacity: 0.5 }} />
          </Link>
          <div className="lc-footer-links">
            <Link href="/features">Features</Link>
            <Link href="/about">About</Link>
            <Link href="/blog">Blog</Link>
            <a href="#">Privacy</a>
          </div>
        </div>
      </div>
    </>
  );
}
