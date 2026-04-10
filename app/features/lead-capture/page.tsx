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

  const tabs = [
    { label: "Smart Intake Form", icon: "\u{1F4CB}" },
    { label: "AI Chat Widget", icon: "\u{1F4AC}" },
    { label: "Automated Follow-Up Sequences", icon: "\u{1F4E7}" },
  ];

  return (
    <>
      <style>{`
        .lc-page { min-height: 100vh; background: #fff; }

        /* Hero */
        .lc-hero {
          padding: 180px 0 100px;
          background: linear-gradient(180deg, #FAFBFD 0%, #fff 100%);
        }
        .lc-hero-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 24px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
        }
        .lc-hero-label {
          font-size: 12px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1.5px; color: #5EC4E3; margin-bottom: 12px;
        }
        .lc-hero h1 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 44px; font-weight: 800; font-style: normal;
          color: #0F172A; line-height: 1.1; margin-bottom: 20px;
        }
        .lc-hero p {
          font-size: 17px; color: #64748B; line-height: 1.7; margin-bottom: 32px;
        }
        .lc-hero-cta {
          display: inline-flex; padding: 16px 36px;
          background: #5EC4E3; color: #fff; font-weight: 700; font-size: 16px;
          border-radius: 100px; text-decoration: none; transition: all 0.2s;
        }
        .lc-hero-cta:hover {
          background: #4AB8D9; box-shadow: 0 4px 16px rgba(20, 184, 166, 0.3);
          transform: translateY(-1px);
        }

        /* Mockup (reused from main) */
        .lc-mockup {
          background: #fff; border-radius: 12px; overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08); border: 1px solid #E2E8F0;
        }
        .lc-mockup-toolbar {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 20px; background: #3730A3; color: #fff;
          font-size: 12px; font-weight: 700;
        }
        .lc-toolbar-dots { display: flex; gap: 5px; }
        .lc-toolbar-dots span { width: 8px; height: 8px; border-radius: 50%; }
        .lc-toolbar-dots span:nth-child(1) { background: #FF5F57; }
        .lc-toolbar-dots span:nth-child(2) { background: #FEBC2E; }
        .lc-toolbar-dots span:nth-child(3) { background: #28C840; }
        .lc-mockup-body { padding: 24px; }
        .lc-form-title { font-size: 16px; font-weight: 800; text-align: center; margin-bottom: 4px; }
        .lc-form-sub { font-size: 11px; color: #94A3B8; text-align: center; margin-bottom: 16px; }
        .lc-lead-badge {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 9px; font-weight: 700; color: #5EC4E3;
          background: rgba(20, 184, 166, 0.1); padding: 3px 10px;
          border-radius: 100px; margin-bottom: 12px;
        }
        .lc-field { margin-bottom: 10px; }
        .lc-field-label {
          font-size: 10px; font-weight: 700; color: #0F172A;
          margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .lc-field-input {
          width: 100%; padding: 10px 12px; border-radius: 8px;
          border: 1px solid #E2E8F0; background: #F8FAFC;
          font-size: 12px; color: #94A3B8; box-sizing: border-box;
        }
        .lc-field-highlight { border-color: #5EC4E3; background: rgba(20, 184, 166, 0.03); color: #0F172A; }
        .lc-progress { display: flex; align-items: center; gap: 6px; margin: 16px 0 4px; }
        .lc-progress-step { flex: 1; height: 4px; border-radius: 2px; background: #E2E8F0; }
        .lc-progress-step.active { background: #5EC4E3; }
        .lc-progress-step.completed { background: #22C55E; }
        .lc-progress-labels {
          display: flex; justify-content: space-between;
          font-size: 9px; color: #94A3B8; margin-bottom: 16px;
        }

        /* Tabbed Section */
        .lc-tabs-section {
          padding: 100px 0; background: #F8FAFC;
        }
        .lc-tabs-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 24px;
        }
        .lc-tabs-label {
          font-size: 12px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1.5px; color: #5EC4E3; margin-bottom: 12px;
          text-align: center;
        }
        .lc-tabs-title {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 40px; font-weight: 800; font-style: normal;
          color: #0F172A; text-align: center; margin-bottom: 48px;
          line-height: 1.15;
        }
        .lc-tab-nav {
          display: flex; gap: 8px; justify-content: center; margin-bottom: 48px;
        }
        .lc-tab-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 24px; border-radius: 12px; border: 2px solid transparent;
          background: #fff; cursor: pointer; transition: all 0.2s;
          font-family: inherit; font-size: 14px; font-weight: 700; color: #64748B;
        }
        .lc-tab-btn:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
        .lc-tab-btn.active {
          border-color: #5EC4E3; box-shadow: 0 4px 16px rgba(20, 184, 166, 0.1);
        }
        .lc-tab-btn .tab-icon { font-size: 20px; }
        .lc-tab-content {
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
        }
        .lc-tab-text h3 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 28px; font-weight: 800; font-style: normal;
          color: #0F172A; margin-bottom: 16px; line-height: 1.2;
        }
        .lc-tab-text p {
          font-size: 16px; line-height: 1.7; color: #64748B; margin-bottom: 24px;
        }
        .lc-stat-callout {
          background: #fff; border-radius: 12px; padding: 20px 24px;
          border-left: 4px solid #5EC4E3;
          font-size: 15px; font-weight: 600; color: #0F172A; line-height: 1.5;
        }

        /* Chat mockup */
        .lc-chat-mockup {
          background: #fff; border-radius: 12px; overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08); border: 1px solid #E2E8F0;
        }
        .lc-chat-header {
          padding: 14px 20px; background: #3730A3; color: #fff;
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; font-weight: 700;
        }
        .lc-chat-header .chat-dot {
          width: 8px; height: 8px; border-radius: 50%; background: #22C55E;
        }
        .lc-chat-body { padding: 20px; display: flex; flex-direction: column; gap: 12px; }
        .lc-chat-msg {
          max-width: 85%; padding: 12px 16px; border-radius: 12px;
          font-size: 13px; line-height: 1.5;
        }
        .lc-chat-msg.user {
          align-self: flex-end; background: #5EC4E3; color: #fff;
          border-bottom-right-radius: 4px;
        }
        .lc-chat-msg.ai {
          align-self: flex-start; background: #F8FAFC; color: #0F172A;
          border-bottom-left-radius: 4px;
        }
        .lc-chat-msg .ai-badge {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 9px; font-weight: 700; color: #5EC4E3;
          background: rgba(20, 184, 166, 0.08); padding: 2px 8px;
          border-radius: 100px; margin-bottom: 6px;
        }
        .lc-chat-capture {
          margin-top: 12px; padding: 12px 16px; background: rgba(20, 184, 166, 0.06);
          border: 1px solid rgba(20, 184, 166, 0.15); border-radius: 10px;
          font-size: 11px; color: #5EC4E3; font-weight: 600;
          display: flex; align-items: center; gap: 6px;
        }

        /* Sequence mockup */
        .lc-seq-mockup {
          background: #fff; border-radius: 12px; overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08); border: 1px solid #E2E8F0;
          padding: 28px;
        }
        .lc-seq-track { margin-bottom: 20px; }
        .lc-seq-track:last-child { margin-bottom: 0; }
        .lc-seq-track-header {
          display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
        }
        .lc-seq-dot {
          width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
        }
        .lc-seq-dot.hot { background: #EF4444; }
        .lc-seq-dot.warm { background: #F59E0B; }
        .lc-seq-dot.cold { background: #64748B; }
        .lc-seq-track-label { font-size: 13px; font-weight: 700; color: #0F172A; }
        .lc-seq-track-days { font-size: 11px; color: #94A3B8; margin-left: auto; }
        .lc-seq-bar {
          height: 8px; border-radius: 4px; background: #F1F5F9; overflow: hidden;
        }
        .lc-seq-bar-fill { height: 100%; border-radius: 4px; }
        .lc-seq-bar-fill.hot { background: linear-gradient(90deg, #EF4444, #F87171); width: 30%; }
        .lc-seq-bar-fill.warm { background: linear-gradient(90deg, #F59E0B, #FBBF24); width: 55%; }
        .lc-seq-bar-fill.cold { background: linear-gradient(90deg, #64748B, #94A3B8); width: 100%; }
        .lc-seq-steps {
          display: flex; gap: 4px; margin-top: 8px;
        }
        .lc-seq-step {
          padding: 4px 10px; background: #F1F5F9; border-radius: 6px;
          font-size: 9px; font-weight: 600; color: #64748B;
        }

        /* Financial Pre-Qualification */
        .lc-finprequal {
          padding: 100px 0; background: #F8FAFC;
        }
        .lc-finprequal-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 24px;
        }
        .lc-finprequal-top {
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start;
          margin-bottom: 48px;
        }
        .lc-finprequal-label {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1.5px; color: #0E9AC0; margin-bottom: 12px;
        }
        .lc-finprequal h2 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 36px; font-weight: 800; font-style: normal;
          color: #0F172A; margin-bottom: 16px; line-height: 1.15;
        }
        .lc-finprequal p.desc {
          font-size: 16px; line-height: 1.7; color: #64748B; margin-bottom: 16px;
        }
        .lc-us-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 600; color: #64748B;
          background: #EFF6FF; border: 1px solid #BFDBFE;
          padding: 6px 14px; border-radius: 100px;
        }
        /* Financial lead cards */
        .lc-fin-cards { display: flex; flex-direction: column; gap: 12px; }
        .lc-fin-card {
          background: #fff; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;
        }
        .lc-fin-card-badges { display: flex; gap: 6px; margin-bottom: 8px; }
        .lc-fin-card-intent {
          display: inline-block; font-size: 9px; font-weight: 700; padding: 3px 10px;
          border-radius: 100px; text-transform: uppercase; letter-spacing: 0.3px;
        }
        .lc-fin-card-intent.hot { background: rgba(34,197,94,0.1); color: #22C55E; }
        .lc-fin-card-intent.warm { background: rgba(245,158,11,0.1); color: #D97706; }
        .lc-fin-card-intent.cold { background: rgba(148,163,184,0.15); color: #64748B; }
        .lc-fin-card-fin {
          display: inline-flex; align-items: center; gap: 3px;
          font-size: 9px; font-weight: 700; padding: 3px 10px;
          border-radius: 100px; text-transform: uppercase; letter-spacing: 0.3px;
          border-width: 1.5px; border-style: solid;
        }
        .lc-fin-card-fin.qualified { border-color: #22C55E; color: #22C55E; }
        .lc-fin-card-fin.review { border-color: #D97706; color: #D97706; }
        .lc-fin-card-fin.not-qual { border-color: #94A3B8; color: #94A3B8; }
        .lc-fin-card-name { font-size: 13px; font-weight: 700; color: #0F172A; margin-bottom: 2px; }
        .lc-fin-card-detail { font-size: 11px; color: #94A3B8; }
        .lc-fin-card-action { font-size: 11px; color: #64748B; margin-top: 6px; font-weight: 500; }
        /* Feature detail cards */
        .lc-finprequal-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
        }
        .lc-finprequal-card {
          background: #fff; border: 1px solid #E2E8F0; border-radius: 10px; padding: 24px;
        }
        .lc-finprequal-card h4 {
          font-size: 15px; font-weight: 700; color: #0F172A; margin-bottom: 8px;
        }
        .lc-finprequal-card p {
          font-size: 13px; line-height: 1.6; color: #64748B;
        }

        /* Smart Lead Scoring (2D Matrix) */
        .lc-scoring-section {
          padding: 100px 0; background: #fff;
        }
        .lc-scoring-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 24px;
        }
        .lc-scoring-text {
          max-width: 700px; margin-bottom: 48px;
        }
        .lc-scoring-text h2 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 36px; font-weight: 800; font-style: normal;
          color: #0F172A; margin-bottom: 16px; line-height: 1.15;
        }
        .lc-scoring-text p {
          font-size: 16px; line-height: 1.7; color: #64748B;
        }
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
          text-transform: uppercase; letter-spacing: 0.5px; color: #64748B;
          text-align: center;
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
        .lc-matrix-label-dot {
          width: 8px; height: 8px; border-radius: 50%;
        }
        .lc-matrix-label-dot.hot { background: #22C55E; }
        .lc-matrix-label-dot.warm { background: #F59E0B; }
        .lc-matrix-label-dot.cold { background: #94A3B8; }
        .lc-matrix-cell {
          padding: 14px 12px; text-align: center; font-size: 11px;
          font-weight: 600; color: #0F172A; border-left: 1px solid #F1F5F9;
        }
        .lc-matrix-cell.high { background: rgba(34,197,94,0.06); color: #15803D; }
        .lc-matrix-cell.mid { background: rgba(245,158,11,0.04); color: #B45309; }
        .lc-matrix-cell.low { background: rgba(148,163,184,0.06); color: #64748B; }
        .lc-pipeline-mockup {
          background: #fff; border-radius: 12px; overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08); border: 1px solid #E2E8F0;
        }
        .lc-pipeline-header {
          padding: 12px 20px; background: #3730A3; color: #fff;
          font-size: 12px; font-weight: 700;
          display: flex; align-items: center; gap: 12px;
        }
        .lc-pipeline-body { padding: 20px; display: flex; gap: 12px; }
        .lc-pipe-col { flex: 1; }
        .lc-pipe-col-header {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.5px; margin-bottom: 10px; padding-bottom: 8px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .lc-pipe-col-header.hot { border-bottom: 2px solid #5EC4E3; color: #5EC4E3; }
        .lc-pipe-col-header.warm { border-bottom: 2px solid #F59E0B; color: #F59E0B; }
        .lc-pipe-col-header.cold { border-bottom: 2px solid #94A3B8; color: #94A3B8; }
        .lc-pipe-count {
          font-size: 10px; padding: 2px 7px; background: rgba(0,0,0,0.06);
          border-radius: 100px; color: #94A3B8;
        }
        .lc-pipe-card {
          background: #F8FAFC; border-radius: 8px; padding: 10px 12px; margin-bottom: 8px;
          border: 1px solid #E2E8F0;
        }
        .lc-pipe-card-name { font-size: 12px; font-weight: 700; color: #0F172A; margin-bottom: 2px; }
        .lc-pipe-card-detail { font-size: 10px; color: #94A3B8; }
        .lc-pipe-card-value { font-size: 10px; font-weight: 700; color: #5EC4E3; margin-top: 4px; }
        .lc-pipe-card-score {
          display: inline-block; font-size: 8px; font-weight: 700;
          padding: 2px 6px; border-radius: 100px; margin-top: 4px;
        }
        .lc-pipe-card-score.hot { background: rgba(20, 184, 166, 0.1); color: #5EC4E3; }
        .lc-pipe-card-score.warm { background: rgba(245,158,11,0.1); color: #F59E0B; }
        .lc-pipe-card-score.cold { background: rgba(148,163,184,0.1); color: #94A3B8; }

        /* ROI Section */
        .lc-roi-section {
          padding: 100px 0; background: #F8FAFC;
        }
        .lc-roi-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 24px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
        }
        .lc-roi-text h2 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 36px; font-weight: 800; font-style: normal;
          color: #0F172A; margin-bottom: 16px; line-height: 1.15;
        }
        .lc-roi-text p {
          font-size: 16px; line-height: 1.7; color: #64748B;
        }
        .lc-roi-calc {
          background: #fff; border-radius: 20px; padding: 36px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid #E2E8F0;
        }
        .lc-roi-calc-title {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 18px; font-weight: 600; margin-bottom: 24px;
          display: flex; align-items: center; gap: 10px;
        }
        .lc-roi-calc-title span {
          font-size: 14px; padding: 3px 10px;
          background: rgba(20, 184, 166, 0.1); border-radius: 6px;
          color: #5EC4E3; font-weight: 600;
        }
        .lc-roi-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 0; border-bottom: 1px solid #E2E8F0;
        }
        .lc-roi-row:last-child { border-bottom: none; }
        .lc-roi-label { font-size: 14px; color: #64748B; }
        .lc-roi-value { font-size: 16px; font-weight: 600; }
        .lc-roi-input-wrap { display: flex; align-items: center; gap: 14px; }
        .lc-roi-input-value {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 16px; font-weight: 600; color: #0F172A;
          min-width: 72px; text-align: right;
        }
        .lc-roi-slider {
          -webkit-appearance: none; appearance: none;
          width: 140px; height: 6px; border-radius: 3px;
          background: #E2E8F0; outline: none; cursor: pointer;
        }
        .lc-roi-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 20px; height: 20px; border-radius: 50%;
          background: #5EC4E3; cursor: pointer;
          box-shadow: 0 0 10px rgba(20, 184, 166, 0.4);
        }
        .lc-roi-result {
          margin-top: 20px; padding: 20px;
          background: rgba(20, 184, 166, 0.06);
          border: 1px solid rgba(20, 184, 166, 0.2);
          border-radius: 12px; text-align: center;
        }
        .lc-roi-result-label { font-size: 13px; color: #5EC4E3; font-weight: 600; margin-bottom: 4px; }
        .lc-roi-result-value {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 36px; font-weight: 700; color: #5EC4E3;
          transition: transform 0.15s ease;
        }
        .lc-roi-result-sub { font-size: 12px; color: #94A3B8; margin-top: 4px; }

        /* Bottom CTA */
        .lc-bottom-cta {
          padding: 100px 24px; text-align: center;
        }
        .lc-bottom-cta-box {
          background: linear-gradient(135deg, #3730A3 0%, #1E293B 100%);
          border-radius: 24px; padding: 72px 48px; max-width: 900px;
          margin: 0 auto; position: relative; overflow: hidden;
        }
        .lc-bottom-cta-box::before {
          content: ''; position: absolute;
          top: -100px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(20, 184, 166, 0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .lc-bottom-cta-box h2 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 36px; font-weight: 800; font-style: normal;
          color: #fff; margin-bottom: 14px; position: relative;
        }
        .lc-bottom-cta-box p {
          font-size: 17px; color: rgba(255,255,255,0.7);
          margin-bottom: 32px; position: relative;
        }
        .lc-bottom-cta-box a {
          display: inline-flex; padding: 16px 40px;
          background: #5EC4E3; color: #fff; font-weight: 700;
          font-size: 16px; border-radius: 100px; text-decoration: none;
          transition: all 0.2s; position: relative;
        }
        .lc-bottom-cta-box a:hover {
          background: #4AB8D9; transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(20, 184, 166, 0.3);
        }

        /* Footer */
        .lc-footer {
          padding: 40px 24px; border-top: 1px solid #E2E8F0;
          display: flex; justify-content: space-between; align-items: center;
          max-width: 1100px; margin: 0 auto;
        }
        .lc-footer-links { display: flex; gap: 24px; }
        .lc-footer-links a { font-size: 13px; color: #94A3B8; text-decoration: none; }
        .lc-footer-links a:hover { color: #5EC4E3; }

        /* Responsive */
        @media (max-width: 900px) {
          .lc-hero-inner, .lc-tab-content, .lc-roi-inner {
            grid-template-columns: 1fr; gap: 40px;
          }
          .lc-finprequal-top { grid-template-columns: 1fr; gap: 32px; }
          .lc-finprequal-grid { grid-template-columns: 1fr; }
          .lc-matrix-header, .lc-matrix-row { grid-template-columns: 80px repeat(3, 1fr); }
          .lc-hero h1 { font-size: 34px; }
          .lc-tabs-title { font-size: 30px; }
          .lc-tab-nav { flex-direction: column; align-items: center; }
        }
        @media (max-width: 640px) {
          .lc-hero { padding: 140px 0 60px; }
          .lc-hero h1 { font-size: 28px; }
          .lc-hero p { font-size: 15px; }
          .lc-tabs-section, .lc-scoring-section, .lc-roi-section, .lc-finprequal { padding: 60px 0; }
          .lc-tabs-title { font-size: 26px; }
          .lc-scoring-text h2, .lc-roi-text h2, .lc-finprequal h2 { font-size: 28px; }
          .lc-matrix-cell { font-size: 9px; padding: 10px 6px; }
          .lc-matrix-label { font-size: 10px; padding: 10px 8px; }
          .lc-roi-calc { padding: 24px; }
          .lc-roi-result-value { font-size: 28px; }
          .lc-roi-slider { width: 100px; }
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
            <div>
              <div className="lc-hero-label">Lead Capture &amp; Conversion</div>
              <h1>Every visitor is a potential patient. Stop letting them disappear.</h1>
              <p>Most clinic websites convert under 2% of visitors. Flat contact forms, no follow-up, no qualification. ClinicTech captures leads the moment they engage, scores them automatically, and follows up before your competitors even check their inbox.</p>
              <a href="https://calendar.app.google/YvNVdxRdiXVhjXQDA" target="_blank" rel="noopener noreferrer" className="lc-hero-cta">Book a Discovery Call</a>
            </div>
            <div>
              <div className="lc-mockup">
                <div className="lc-mockup-toolbar">
                  <div className="lc-toolbar-dots"><span></span><span></span><span></span></div>
                  Smart Intake Form
                </div>
                <div className="lc-mockup-body">
                  <div className="lc-form-title">Start Your Journey</div>
                  <div className="lc-form-sub">Tell us about yourself to get started</div>
                  <div className="lc-lead-badge">&#10004; Lead captured after this step</div>
                  <div className="lc-field">
                    <div className="lc-field-label">Full Name</div>
                    <div className="lc-field-input lc-field-highlight">Sarah Mitchell</div>
                  </div>
                  <div className="lc-field">
                    <div className="lc-field-label">Email</div>
                    <div className="lc-field-input lc-field-highlight">sarah@email.com</div>
                  </div>
                  <div className="lc-progress">
                    <div className="lc-progress-step completed"></div>
                    <div className="lc-progress-step active"></div>
                    <div className="lc-progress-step"></div>
                    <div className="lc-progress-step"></div>
                  </div>
                  <div className="lc-progress-labels">
                    <span>Contact Info</span>
                    <span>Condition</span>
                    <span>History</span>
                    <span>Schedule</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabbed Section */}
        <section className="lc-tabs-section">
          <div className="lc-tabs-inner">
            <div className="lc-tabs-label">How It Works</div>
            <h2 className="lc-tabs-title">Three layers of lead capture. One platform.</h2>

            <div className="lc-tab-nav">
              {tabs.map((tab, i) => (
                <button key={i} className={`lc-tab-btn ${activeTab === i ? "active" : ""}`} onClick={() => setActiveTab(i)}>
                  <span className="tab-icon">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="lc-tab-content">
              {activeTab === 0 && (
                <>
                  <div className="lc-tab-text">
                    <h3>Capture leads before they finish the form.</h3>
                    <p>Our multi-step intake captures name and email on step one, before the patient ever hits submit. Condition, medical history, and scheduling preferences come after. Even if they abandon at step two, you have a lead. Traditional forms give you nothing unless the patient completes every field.</p>
                    <div className="lc-stat-callout">67% of leads abandon forms before completion. We capture them at step one.</div>
                  </div>
                  <div>
                    <div className="lc-mockup">
                      <div className="lc-mockup-toolbar">
                        <div className="lc-toolbar-dots"><span></span><span></span><span></span></div>
                        Multi-Step Intake
                      </div>
                      <div className="lc-mockup-body">
                        <div className="lc-lead-badge">&#10004; Lead captured after this step</div>
                        <div className="lc-field">
                          <div className="lc-field-label">Full Name</div>
                          <div className="lc-field-input lc-field-highlight">Sarah Mitchell</div>
                        </div>
                        <div className="lc-field">
                          <div className="lc-field-label">Email</div>
                          <div className="lc-field-input lc-field-highlight">sarah@email.com</div>
                        </div>
                        <div className="lc-progress">
                          <div className="lc-progress-step completed"></div>
                          <div className="lc-progress-step active"></div>
                          <div className="lc-progress-step"></div>
                          <div className="lc-progress-step"></div>
                        </div>
                        <div className="lc-progress-labels">
                          <span>Contact Info</span>
                          <span>Condition</span>
                          <span>History</span>
                          <span>Schedule</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {activeTab === 1 && (
                <>
                  <div className="lc-tab-text">
                    <h3>A 24/7 patient coordinator that actually knows your clinic.</h3>
                    <p>Trained on your website content, treatment pages, and FAQs. Answers questions about procedures, pricing, and logistics in real time. When a visitor is ready, it captures their info and routes the lead to your team. No generic chatbot scripts. No $3,000/month tools with under 1% engagement.</p>
                    <div className="lc-stat-callout">Replaces $2,500-$4,000/month chatbot tools with higher engagement at a fraction of the cost.</div>
                  </div>
                  <div>
                    <div className="lc-chat-mockup">
                      <div className="lc-chat-header">
                        <div className="chat-dot"></div>
                        Your Clinic AI Assistant
                      </div>
                      <div className="lc-chat-body">
                        <div className="lc-chat-msg user">
                          I&apos;m interested in stem cell therapy for my knee. What does the procedure involve and how much does it cost?
                        </div>
                        <div className="lc-chat-msg ai">
                          <div className="ai-badge">&#10024; AI-Powered</div>
                          Great question! Our stem cell therapy for knees involves harvesting cells from your own bone marrow, processing them in our lab, and injecting them directly into the affected joint. The procedure takes about 2-3 hours.<br/><br/>
                          Pricing typically ranges from $8,000-$15,000 depending on the treatment plan. Would you like me to set up a free consultation with Dr. Rivera to discuss your specific case?
                        </div>
                        <div className="lc-chat-capture">&#10004; Lead info captured - Routed to intake team</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {activeTab === 2 && (
                <>
                  <div className="lc-tab-text">
                    <h3>The leads you already have are worth more than the ones you&apos;re buying.</h3>
                    <p>Every lead gets a sequence tailored to how ready they are. Hot leads get a 5-day high-touch cadence. Warm leads get nurtured over 30 days. Cold leads stay in a 90-day drip until they&apos;re ready. No manual work. No leads falling through cracks.</p>
                    <div className="lc-stat-callout">Clinics using automated follow-up within 5 minutes see 3-5x higher booking rates from the same lead volume.</div>
                  </div>
                  <div>
                    <div className="lc-seq-mockup">
                      <div style={{fontSize: "14px", fontWeight: 700, marginBottom: "20px", color: "#3730A3"}}>Automated Follow-Up Sequences</div>
                      <div className="lc-seq-track">
                        <div className="lc-seq-track-header">
                          <div className="lc-seq-dot hot"></div>
                          <div className="lc-seq-track-label">Hot Leads</div>
                          <div className="lc-seq-track-days">5-day cadence</div>
                        </div>
                        <div className="lc-seq-bar"><div className="lc-seq-bar-fill hot"></div></div>
                        <div className="lc-seq-steps">
                          <div className="lc-seq-step">Day 0: Instant SMS</div>
                          <div className="lc-seq-step">Day 1: Email</div>
                          <div className="lc-seq-step">Day 3: Call</div>
                          <div className="lc-seq-step">Day 5: Final</div>
                        </div>
                      </div>
                      <div className="lc-seq-track">
                        <div className="lc-seq-track-header">
                          <div className="lc-seq-dot warm"></div>
                          <div className="lc-seq-track-label">Warm Leads</div>
                          <div className="lc-seq-track-days">30-day nurture</div>
                        </div>
                        <div className="lc-seq-bar"><div className="lc-seq-bar-fill warm"></div></div>
                        <div className="lc-seq-steps">
                          <div className="lc-seq-step">Week 1: Education</div>
                          <div className="lc-seq-step">Week 2: Case study</div>
                          <div className="lc-seq-step">Week 3: Offer</div>
                          <div className="lc-seq-step">Week 4: Check-in</div>
                        </div>
                      </div>
                      <div className="lc-seq-track">
                        <div className="lc-seq-track-header">
                          <div className="lc-seq-dot cold"></div>
                          <div className="lc-seq-track-label">Cold Leads</div>
                          <div className="lc-seq-track-days">90-day drip</div>
                        </div>
                        <div className="lc-seq-bar"><div className="lc-seq-bar-fill cold"></div></div>
                        <div className="lc-seq-steps">
                          <div className="lc-seq-step">Monthly newsletter</div>
                          <div className="lc-seq-step">Success stories</div>
                          <div className="lc-seq-step">Seasonal offers</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Financial Pre-Qualification */}
        <section className="lc-finprequal" id="financial-prequalification">
          <div className="lc-finprequal-inner">
            <div className="lc-finprequal-top">
              <div>
                <div className="lc-finprequal-label">Financial pre-qualification</div>
                <h2>Know if they can afford treatment before the call.</h2>
                <p className="desc">Stem cell procedures run $5,000 to $25,000+ with no insurance coverage. Your team shouldn&apos;t spend 30 minutes on a consultation only to hear &ldquo;I need to think about it&rdquo; because the patient can&apos;t afford it. ClinicTech runs a soft-pull financial pre-qualification silently during intake, so your team sees affordability signals alongside every lead. No impact on the patient&apos;s credit score. No friction in the booking flow.</p>
                <div className="lc-us-badge">&#127482;&#127480; Available for U.S.-based leads</div>
              </div>
              <div className="lc-fin-cards">
                <div className="lc-fin-card">
                  <div className="lc-fin-card-badges"><span className="lc-fin-card-intent hot">Hot</span><span className="lc-fin-card-fin qualified">Qualified</span></div>
                  <div className="lc-fin-card-name">Sarah M.</div>
                  <div className="lc-fin-card-detail">Knee Stem Cell Therapy | $15,000</div>
                  <div className="lc-fin-card-action">Completed intake 3 min ago. Auto follow-up sent. Consultation auto-booked.</div>
                </div>
                <div className="lc-fin-card">
                  <div className="lc-fin-card-badges"><span className="lc-fin-card-intent warm">Warm</span><span className="lc-fin-card-fin review">Review</span></div>
                  <div className="lc-fin-card-name">Michael T.</div>
                  <div className="lc-fin-card-detail">PRP + Stem Cell Combo | $22,000</div>
                  <div className="lc-fin-card-action">Abandoned at step 3. Routed to financial coordinator. Payment plan info sent.</div>
                </div>
                <div className="lc-fin-card">
                  <div className="lc-fin-card-badges"><span className="lc-fin-card-intent cold">Cold</span><span className="lc-fin-card-fin not-qual">Not Qualified</span></div>
                  <div className="lc-fin-card-name">Jennifer K.</div>
                  <div className="lc-fin-card-detail">General Inquiry | $8,000</div>
                  <div className="lc-fin-card-action">Email captured. Entered 90-day drip with financing resources.</div>
                </div>
              </div>
            </div>
            <div className="lc-finprequal-grid">
              <div className="lc-finprequal-card">
                <h4>Runs during intake</h4>
                <p>The soft-pull check runs silently while the patient fills out your intake form. No extra steps, no separate application, no SSN field. The patient experience is unchanged.</p>
              </div>
              <div className="lc-finprequal-card">
                <h4>Affordability signals, not credit scores</h4>
                <p>Your team sees a simple badge: Qualified, Review, or Not Qualified. No interpreting credit scores or debt ratios. The system handles the logic based on your procedure pricing.</p>
              </div>
              <div className="lc-finprequal-card">
                <h4>Route and prioritize automatically</h4>
                <p>Qualified leads go straight to your consultation calendar. Review leads get routed to a financial coordinator with payment plan info. Unqualified leads enter a different sequence with financing resources.</p>
              </div>
              <div className="lc-finprequal-card">
                <h4>No impact on patient credit</h4>
                <p>Soft pulls don&apos;t affect the patient&apos;s credit score and aren&apos;t visible to other lenders. Same type of check banks use for pre-approval offers. FCRA compliant.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Smart Lead Scoring - 2D Matrix */}
        <section className="lc-scoring-section">
          <div className="lc-scoring-inner">
            <div className="lc-scoring-text">
              <h2>Intent and affordability. See both before the call.</h2>
              <p>Every lead is automatically scored on two dimensions. Intent scoring (Hot, Warm, Cold) is based on how they engaged, what condition they&apos;re inquiring about, and how far they got in the intake. Financial qualification (Qualified, Review, Not Qualified) runs a soft-pull affordability check on U.S.-based leads in the background. Your team sees a prioritized pipeline with both signals, so the highest-value leads always get attention first.</p>
            </div>
            <div className="lc-matrix">
              <div className="lc-matrix-header">
                <div className="lc-matrix-header-cell">Intent</div>
                <div className="lc-matrix-header-cell">Qualified</div>
                <div className="lc-matrix-header-cell">Review</div>
                <div className="lc-matrix-header-cell">Not Qualified</div>
              </div>
              <div className="lc-matrix-row">
                <div className="lc-matrix-label"><span className="lc-matrix-label-dot hot"></span> Hot</div>
                <div className="lc-matrix-cell high">Auto-book consultation</div>
                <div className="lc-matrix-cell mid">Route to financial coordinator</div>
                <div className="lc-matrix-cell low">Send financing resources</div>
              </div>
              <div className="lc-matrix-row">
                <div className="lc-matrix-label"><span className="lc-matrix-label-dot warm"></span> Warm</div>
                <div className="lc-matrix-cell mid">Priority nurture sequence</div>
                <div className="lc-matrix-cell mid">Nurture + payment plan info</div>
                <div className="lc-matrix-cell low">Standard nurture</div>
              </div>
              <div className="lc-matrix-row">
                <div className="lc-matrix-label"><span className="lc-matrix-label-dot cold"></span> Cold</div>
                <div className="lc-matrix-cell low">Add to re-engagement</div>
                <div className="lc-matrix-cell low">90-day drip</div>
                <div className="lc-matrix-cell low">Low priority drip</div>
              </div>
            </div>
          </div>
        </section>

        {/* ROI */}
        <section className="lc-roi-section">
          <div className="lc-roi-inner">
            <div className="lc-roi-text">
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
                  <div className="lc-roi-label">Recovered with ClinicTech</div>
                  <div className="lc-roi-value" style={{color:"#5EC4E3"}}>+{recovered}/mo</div>
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
            <p>Book a 15-minute demo and we&apos;ll walk you through the smart intake, AI chat, and follow-up sequences, customized for your clinic.</p>
            <a href="https://calendar.app.google/YvNVdxRdiXVhjXQDA" target="_blank" rel="noopener noreferrer">Book a Discovery Call</a>
          </div>
        </section>

        <div className="lc-footer">
          <Link href="/">
            <img src="/clinictech-logo.png" alt="ClinicTech" style={{ height: 20, opacity: 0.5 }} />
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
