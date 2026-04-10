"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { SiteNav } from "@/components/site-nav";

function HeroDnaAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'active' | 'fading' | 'done'>('active');

  useEffect(() => {
    if (typeof window !== "undefined" && (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 768)) {
      setPhase('done');
      onComplete();
      return;
    }
    const t1 = setTimeout(() => setPhase('fading'), 2500);
    const t2 = setTimeout(() => { setPhase('done'); onComplete(); }, 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  if (phase === 'done') return null;

  const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${(i * 37 + 13) % 100}%`,
    top: `${(i * 53 + 7) % 100}%`,
    size: 2 + (i % 4) * 2,
    delay: (i * 0.2) % 2.5,
    duration: 2.5 + (i % 3),
  })), []);

  return (
    <div className={`hero-dna ${phase === 'fading' ? 'hero-dna-fade' : ''}`}>
      <svg viewBox="0 0 400 500" className="hero-dna-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="hg1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3730A3" />
            <stop offset="50%" stopColor="#5EC4E3" />
            <stop offset="100%" stopColor="#7DD4ED" />
          </linearGradient>
          <linearGradient id="hg2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7DD4ED" />
            <stop offset="50%" stopColor="#5EC4E3" />
            <stop offset="100%" stopColor="#3730A3" />
          </linearGradient>
          <filter id="dnaGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        {/* Left strand */}
        <path d="M80,0 C80,50 320,80 320,130 C320,180 80,210 80,260 C80,310 320,340 320,390 C320,440 80,470 80,500" fill="none" stroke="url(#hg1)" strokeWidth="3" opacity="0.6" className="dna-strand-anim"/>
        {/* Right strand */}
        <path d="M320,0 C320,50 80,80 80,130 C80,180 320,210 320,260 C320,310 80,340 80,390 C80,440 320,470 320,500" fill="none" stroke="url(#hg2)" strokeWidth="3" opacity="0.6" className="dna-strand-anim" style={{animationDelay: "0.3s"}}/>
        {/* Rungs + nodes */}
        {Array.from({length: 12}, (_, i) => {
          const y = 20 + i * 40;
          const phase2 = (i / 11) * Math.PI * 2;
          const x1 = 200 + Math.sin(phase2) * 120;
          const x2 = 200 - Math.sin(phase2) * 120;
          return (
            <g key={i} style={{animation: `rungAppear 0.5s ease ${i * 0.1}s both`}}>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke="url(#hg1)" strokeWidth="1" opacity="0.2"/>
              <circle cx={x1} cy={y} r="5" fill="url(#hg1)" filter="url(#dnaGlow)" opacity="0.8" className="dna-node-pulse" style={{animationDelay: `${i * 0.15}s`}}/>
              <circle cx={x2} cy={y} r="5" fill="url(#hg2)" filter="url(#dnaGlow)" opacity="0.8" className="dna-node-pulse" style={{animationDelay: `${i * 0.15 + 0.5}s`}}/>
            </g>
          );
        })}
      </svg>
      {/* Particles */}
      {particles.map(p => (
        <div key={p.id} className="dna-particle" style={{left: p.left, top: p.top, width: p.size, height: p.size, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`}}/>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [introComplete, setIntroComplete] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);
  const [heroEmail, setHeroEmail] = useState("");
  const [heroEmailStatus, setHeroEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [leads, setLeads] = useState(40);
  const [procedureValue, setProcedureValue] = useState(12000);
  const [activeFeature, setActiveFeature] = useState(0);
  const [travelView, setTravelView] = useState<'patient' | 'admin'>('patient');
  const [heroTab, setHeroTab] = useState(0);
  const featureAutoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const features = useMemo(() => [
    { icon: "🌐", title: "Websites & Conversion", desc: "Modern sites built to convert international patients. Smart intake flows, self-booking, lead capture that actually works." },
    { icon: "📧", title: "Lead Capture & Automation", desc: "Forms that qualify, route by location and condition, and auto-nurture. No more leads going cold in an inbox while patients book elsewhere." },
    { icon: "📊", title: "Patient CRM & Back Office", desc: "One system for your team to manage patients, communications, scheduling, and follow-ups. Built around your workflow, not a generic template." },
    { icon: "✈️", title: "Travel Concierge Platform", desc: "A portal for international patients to manage flights, hotels, and logistics. Your team tracks every arrival from one dashboard instead of doing it manually." },
  ], []);

  // Auto-rotate features, reset on manual click
  useEffect(() => {
    featureAutoRef.current = setInterval(() => {
      setActiveFeature(v => (v + 1) % 4);
    }, 5000);
    return () => { if (featureAutoRef.current) clearInterval(featureAutoRef.current); };
  }, []);

  const handleFeatureClick = useCallback((idx: number) => {
    setActiveFeature(idx);
    if (featureAutoRef.current) clearInterval(featureAutoRef.current);
    featureAutoRef.current = setInterval(() => {
      setActiveFeature(v => (v + 1) % 4);
    }, 5000);
  }, []);

  const totalRef = useRef<HTMLDivElement>(null);

  const lostRate = 0.6;
  const recoveryRate = 0.58;
  const recovered = Math.round(leads * lostRate * recoveryRate);
  const annual = recovered * procedureValue * 12;

  const animateTotal = useCallback(() => {
    if (totalRef.current) {
      totalRef.current.style.transform = "scale(1.05)";
      setTimeout(() => {
        if (totalRef.current) {
          totalRef.current.style.transform = "scale(1)";
        }
      }, 150);
    }
  }, []);

  // Scroll reveal observer
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

    document
      .querySelectorAll(
        ".service-tab, .roi-metric, .step, .case-card, .why-stat"
      )
      .forEach((el) => {
        (el as HTMLElement).style.opacity = "0";
        (el as HTMLElement).style.transform = "translateY(20px)";
        (el as HTMLElement).style.transition = "all 0.6s ease";
        observer.observe(el);
      });

    // Stagger animation for grid items
    document
      .querySelectorAll(
        ".service-tabs, .steps, .cases-grid, .why-stats"
      )
      .forEach((grid) => {
        Array.from(grid.children).forEach((child, i) => {
          (child as HTMLElement).style.transitionDelay = `${i * 0.1}s`;
        });
      });

    return () => observer.disconnect();
  }, []);


  return (
    <>
      <style>{`
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
.hl { color: #5EC4E3; }
.hl-purple { color: #4F46E5; }
.hl-gradient {
  background: linear-gradient(135deg, #3730A3, #5EC4E3);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}

:root {
  --navy: #3730A3;
  --navy-mid: #4338CA;
  --navy-light: #4F46E5;
  --blue: #5EC4E3;
  --blue-bright: #7DD4ED;
  --blue-glow: rgba(55, 48, 163, 0.08);
  --blue-glow-strong: rgba(55, 48, 163, 0.15);
  --white: #FFFFFF;
  --gray-100: #F5F5F7;
  --gray-200: #E5E5EA;
  --gray-300: #6B6B80;
  --gray-400: #8888A0;
  --gray-500: #A0A0B8;
  --green: #22C55E;
  --green-glow: rgba(34, 197, 94, 0.1);
  --orange: #F59E0B;
  --red: #EF4444;
  --bg: #FFFFFF;
  --card-bg: #FFFFFF;
  --card-border: rgba(0, 0, 0, 0.06);
  --text-primary: #1A1A2E;
  --text-secondary: #4A4A65;
  --text-muted: #8888A0;
  --purple-glow: rgba(55, 48, 163, 0.06);
}

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  background: var(--bg);
  color: var(--text-primary);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* ===== UTILITY ===== */
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

/* ===== NAV ===== */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 20px 0;
  background: var(--navy);
  border-bottom: none;
  transition: all 0.3s;
}
nav .container {
  display: flex; align-items: center; justify-content: space-between;
}
.nav-logo {
  display: flex; align-items: center; gap: 12px;
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-weight: 800; font-size: 22px; font-style: normal; letter-spacing: 0.5px;
  text-decoration: none; color: var(--white);
}
.nav-logo svg { width: 36px; height: 36px; }
.nav-logo svg rect { fill: rgba(255,255,255,0.85); }
.nav-logo svg rect:nth-child(odd) { fill: var(--white); }
.nav-logo svg line { stroke: rgba(255,255,255,0.7); }
nav .nav-links .btn-primary,
nav .nav-links a.btn-primary {
  background: #5EC4E3;
  color: #1A1A2E !important;
  font-weight: 800;
}
nav .nav-links .btn-primary:hover,
nav .nav-links a.btn-primary:hover {
  background: #4AB8D9;
  color: #1A1A2E !important;
  box-shadow: 0 4px 16px rgba(94, 196, 227, 0.4);
}
.nav-links { display: flex; align-items: center; gap: 32px; }
.nav-links a {
  text-decoration: none; color: rgba(255,255,255,0.75);
  font-size: 14px; font-weight: 600;
  transition: color 0.2s;
}
.nav-links a:hover { color: var(--white); }
.nav-mobile-cta { display: none !important; }
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 32px;
  background: var(--navy);
  color: var(--white);
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-weight: 700; font-size: 15px;
  border: none; border-radius: 100px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-primary:hover {
  background: var(--navy-mid);
  color: var(--white);
  box-shadow: 0 4px 16px rgba(55, 48, 163, 0.3);
  transform: translateY(-1px);
}
.btn-secondary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 13px 28px;
  background: transparent;
  color: var(--navy);
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-weight: 700; font-size: 15px;
  border: 1.5px solid rgba(55, 48, 163, 0.2);
  border-radius: 100px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-secondary:hover {
  border-color: var(--navy);
  background: rgba(55, 48, 163, 0.04);
}

/* ===== HERO ===== */
.hero-fullwidth {
  position: relative;
  padding: 200px 0 80px;
  overflow: hidden;
  background: var(--white);
}
.hero-split {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
}
.hero-split-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.hero-split-right {
  position: relative;
  transform: scale(0.85);
  transform-origin: center center;
}
.hero-dna-bg {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 60%;
  z-index: 0;
  pointer-events: none;
}
.hero-dna-wave {
  width: 100%;
  height: 100%;
  animation: waveFloat 8s ease-in-out infinite alternate;
}
@keyframes waveFloat {
  0% { transform: translateY(0) scale(1); }
  100% { transform: translateY(-20px) scale(1.02); }
}
.dna-wave-path {
  animation: waveDash 6s linear infinite;
  stroke-dasharray: 200 100;
}
.dna-wave-2 {
  animation-delay: -3s;
  animation-duration: 7s;
}
@keyframes waveDash {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -600; }
}
.dna-rung-line {
  animation: rungPulse 2s ease-in-out infinite alternate;
}
@keyframes rungPulse {
  0% { opacity: 0.03; }
  100% { opacity: 0.08; }
}
.dna-bg-node {
  animation: bgNodePulse 3s ease-in-out infinite alternate;
}
@keyframes bgNodePulse {
  0% { opacity: 0.08; r: 3; }
  100% { opacity: 0.2; r: 5; }
}
.hero-centered {
  text-align: left;
}
.hero-main-title {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 56px;
  font-weight: 800;
  font-style: normal;
  line-height: 1.1;
  letter-spacing: -1px;
  color: var(--text-primary);
  margin-bottom: 24px;
  animation: fadeUp 0.8s ease 0.2s both;
}
.hero-centered-sub {
  font-size: 18px;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 580px;
  margin: 0 0 36px;
  animation: fadeUp 0.8s ease 0.4s both;
}
.hero-centered-ctas {
  display: flex;
  gap: 16px;
  justify-content: flex-start;
  animation: fadeUp 0.8s ease 0.6s both;
}
.hero-pipeline-wrap {
  position: relative;
  animation: fadeUp 0.8s ease 0.8s both;
}
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 16px 6px 8px;
  background: rgba(94, 196, 227, 0.1);
  border: 1px solid rgba(94, 196, 227, 0.25);
  border-radius: 100px;
  font-size: 13px; font-weight: 600;
  color: #0E9AC0;
  margin-bottom: 24px;
  animation: fadeUp 0.6s ease both;
}
.hero-badge .dot {
  width: 8px; height: 8px;
  background: var(--green);
  border-radius: 50%;
  animation: pulse 2s ease infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.hero h1 {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 56px;
  font-weight: 800;
  font-style: normal;
  line-height: 1.1;
  letter-spacing: 0.5px;
  margin-bottom: 24px;
  animation: fadeUp 0.6s ease 0.1s both;
}
.hero h1 .highlight {
  background: linear-gradient(135deg, var(--navy), var(--navy-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-style: normal;
}
.hero-sub {
  font-size: 18px;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 40px;
  max-width: 520px;
  animation: fadeUp 0.6s ease 0.2s both;
}
.hero-ctas {
  display: flex; gap: 16px;
  animation: fadeUp 0.6s ease 0.3s both;
}

/* Hero Visual - CRM Builder Mockup */
.hero-visual {
  position: relative;
  animation: fadeUp 0.8s ease 0.4s both;
}
.crm-builder {
  background: var(--white);
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.08);
  position: relative;
}
.crm-builder-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px;
  background: var(--navy);
  color: var(--white);
}
.crm-toolbar-left {
  display: flex; align-items: center; gap: 12px;
}
.crm-toolbar-dots {
  display: flex; gap: 5px;
}
.crm-toolbar-dots span {
  width: 10px; height: 10px; border-radius: 50%;
}
.crm-toolbar-dots span:nth-child(1) { background: #FF5F57; }
.crm-toolbar-dots span:nth-child(2) { background: #FEBC2E; }
.crm-toolbar-dots span:nth-child(3) { background: #28C840; }
.crm-toolbar-title {
  font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.9);
  letter-spacing: 0.3px;
}
.crm-toolbar-right {
  display: flex; align-items: center; gap: 8px;
}
.crm-toolbar-btn {
  padding: 5px 14px;
  background: rgba(255,255,255,0.15);
  border-radius: 6px;
  font-size: 11px; font-weight: 700; color: var(--white);
  display: flex; align-items: center; gap: 5px;
}
.crm-toolbar-btn.save {
  background: var(--white);
  color: var(--navy);
}
.crm-builder-body {
  padding: 20px;
}
.crm-pipeline-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
}
.crm-pipeline-name {
  display: flex; align-items: center; gap: 8px;
}
.crm-pipeline-name-input {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 16px; font-weight: 700;
  color: var(--text-primary);
  border: none; border-bottom: 2px solid var(--navy);
  padding: 2px 0;
  background: transparent;
  outline: none;
  width: 200px;
}
.crm-pipeline-name .edit-icon {
  color: var(--navy); font-size: 12px;
}
.crm-add-stage-btn {
  padding: 6px 14px;
  background: rgba(55, 48, 163, 0.08);
  border: 1px dashed rgba(55, 48, 163, 0.25);
  border-radius: 8px;
  font-size: 12px; font-weight: 700; color: var(--navy);
  cursor: pointer;
  display: flex; align-items: center; gap: 5px;
}
.crm-kanban {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.crm-column {
  min-width: 155px;
  flex: 1;
  background: var(--gray-100);
  border-radius: 12px;
  padding: 12px;
}
.crm-column-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 2px solid transparent;
}
.crm-column:nth-child(1) .crm-column-header { border-bottom-color: var(--navy); }
.crm-column:nth-child(2) .crm-column-header { border-bottom-color: var(--orange); }
.crm-column:nth-child(3) .crm-column-header { border-bottom-color: var(--green); }
.crm-column:nth-child(4) .crm-column-header { border-bottom-color: #8B5CF6; }
.crm-column-title {
  font-size: 12px; font-weight: 700; color: var(--text-primary);
  text-transform: uppercase; letter-spacing: 0.5px;
}
.crm-column-count {
  font-size: 10px; font-weight: 700;
  padding: 2px 7px;
  background: rgba(0,0,0,0.06);
  border-radius: 100px;
  color: var(--text-muted);
}
.crm-column-drag {
  color: var(--text-muted); font-size: 10px; cursor: grab;
  margin-right: 4px;
}
.crm-card {
  background: var(--white);
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  cursor: grab;
  transition: box-shadow 0.2s, transform 0.2s;
  position: relative;
}
.crm-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-1px);
}
.crm-card.dragging {
  box-shadow: 0 8px 24px rgba(55, 48, 163, 0.2);
  transform: rotate(-2deg) translateY(-4px);
  opacity: 0.9;
  z-index: 10;
}
.crm-card-name {
  font-size: 12px; font-weight: 700; color: var(--text-primary);
  margin-bottom: 3px;
}
.crm-card-detail {
  font-size: 10px; color: var(--text-muted);
}
.crm-card-value {
  font-size: 10px; font-weight: 700; color: var(--green);
  margin-top: 5px;
}
.crm-card-drag {
  position: absolute; top: 10px; right: 8px;
  color: var(--gray-200);
  font-size: 10px;
}
.crm-add-card {
  text-align: center;
  padding: 8px;
  border: 1px dashed rgba(0,0,0,0.1);
  border-radius: 8px;
  font-size: 11px; color: var(--text-muted);
  cursor: pointer;
}
.crm-builder-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 20px;
  border-top: 1px solid rgba(0,0,0,0.06);
  font-size: 11px; color: var(--text-muted);
}
.crm-footer-left {
  display: flex; align-items: center; gap: 12px;
}
.crm-footer-chip {
  display: flex; align-items: center; gap: 4px;
  padding: 3px 10px;
  background: var(--gray-100);
  border-radius: 100px;
  font-size: 10px; font-weight: 600;
}
.brand-tag {
  position: absolute;
  bottom: -12px; right: 24px;
  padding: 6px 14px;
  background: var(--white);
  border: 1px solid rgba(55, 48, 163, 0.15);
  border-radius: 8px;
  font-size: 11px; font-weight: 600; color: var(--text-muted);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.brand-tag span { color: var(--navy); }

/* Activity Toasts */
.activity-toast {
  position: absolute;
  background: var(--white);
  border-radius: 12px;
  padding: 10px 16px;
  display: flex; align-items: center; gap: 10px;
  box-shadow: 0 8px 30px rgba(55, 48, 163, 0.15), 0 2px 8px rgba(0,0,0,0.06);
  font-size: 12px; font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  z-index: 5;
  animation: toastIn 0.6s ease both;
  border-left: 3px solid var(--green);
}
.activity-toast:nth-child(2) {
  animation-delay: 0.8s;
}
.activity-toast:nth-child(3) {
  animation-delay: 1.6s;
}
.activity-toast .toast-icon {
  width: 28px; height: 28px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}
.toast-icon.green { background: rgba(34, 197, 94, 0.1); }
.toast-icon.purple { background: rgba(55, 48, 163, 0.08); }
.toast-icon.blue { background: rgba(94, 196, 227, 0.12); }
.activity-toast .toast-text {
  display: flex; flex-direction: column; gap: 1px;
}
.activity-toast .toast-label {
  font-size: 10px; color: var(--text-muted); font-weight: 500;
}
.activity-toast .toast-msg {
  font-size: 12px; font-weight: 700; color: var(--text-primary);
}
.toast-time {
  font-size: 9px; color: var(--text-muted); font-weight: 500;
  margin-left: auto;
}
@keyframes toastIn {
  from { opacity: 0; transform: translateX(20px) scale(0.95); }
  to { opacity: 1; transform: translateX(0) scale(1); }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ===== STAT BANNER ===== */
.stat-banner {
  padding: 60px 0;
  background: var(--gray-100);
}
.stat-banner .container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
  flex-wrap: wrap;
}
.stat-banner-number {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 48px; font-weight: 900;
  color: var(--navy);
}
.stat-banner-text {
  font-size: 20px; color: var(--text-secondary);
  max-width: 600px;
}
.stat-banner-text strong { color: var(--text-primary); font-weight: 600; }

/* ===== PROBLEM SECTION ===== */
.problem {
  padding: 120px 0 60px;
}
.section-label {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #0E9AC0;
  margin-bottom: 16px;
}
.section-title {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 40px;
  font-weight: 800;
  font-style: normal;
  line-height: 1.15;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
  max-width: 100%;
}
.section-sub {
  font-size: 17px;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 100%;
  margin-bottom: 48px;
}
.pain-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.pain-card {
  background: var(--gray-100);
  border: none;
  border-radius: 16px;
  padding: 32px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}
.pain-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--red), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}
.pain-card:hover::before { opacity: 1; }
.pain-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
}
.pain-icon {
  width: 48px; height: 48px;
  border-radius: 12px;
  background: rgba(248, 113, 113, 0.1);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 20px;
  font-size: 22px;
}
.pain-card h3 {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 18px; font-weight: 600;
  margin-bottom: 12px;
  letter-spacing: -0.3px;
}
.pain-card p {
  font-size: 14px; line-height: 1.7;
  color: var(--text-secondary);
}
.pain-stat {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--gray-200);
  font-size: 13px; font-weight: 600;
  color: var(--red);
}

/* ===== PRODUCT / WHAT YOU GET ===== */
.product {
  padding: 120px 0;
}
.product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 8px;
}
.product-card {
  background: var(--gray-100);
  border: none;
  border-radius: 20px;
  padding: 40px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}
.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.06);
}
.product-card::after {
  content: '';
  position: absolute;
  top: -50%; right: -50%;
  width: 200%; height: 200%;
  background: radial-gradient(circle at center, rgba(55, 48, 163, 0.02) 0%, transparent 50%);
  pointer-events: none;
}
.product-card-badge {
  display: inline-block;
  padding: 5px 12px;
  background: rgba(55, 48, 163, 0.08);
  border-radius: 6px;
  font-size: 11px; font-weight: 700;
  color: var(--navy);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
}
.product-card h3 {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 26px; font-weight: 700; font-style: normal;
  letter-spacing: 0.3px;
  margin-bottom: 16px;
}
.product-card > p {
  font-size: 15px; line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 28px;
  position: relative; z-index: 1;
}
.feature-list {
  list-style: none;
  display: flex; flex-direction: column; gap: 14px;
  position: relative; z-index: 1;
}
.feature-list li {
  display: flex; gap: 12px; align-items: flex-start;
  font-size: 14px; color: var(--text-secondary);
  line-height: 1.5;
}
.feature-list li .check {
  width: 20px; height: 20px; flex-shrink: 0;
  background: var(--green-glow);
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  color: var(--green);
  font-size: 12px;
  margin-top: 1px;
}
.product-card-visual {
  margin-top: 32px;
  background: var(--white);
  border: none;
  border-radius: 12px;
  padding: 20px;
  position: relative; z-index: 1;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.mini-portal-header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--gray-200);
}
.mini-portal-logo {
  width: 28px; height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--blue), var(--blue-bright));
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800;
}
.mini-portal-name {
  font-size: 13px; font-weight: 600;
}
.mini-search {
  width: 100%;
  padding: 10px 14px;
  background: var(--card-bg);
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 12px;
}
.mini-kb-items { display: flex; flex-direction: column; gap: 8px; }
.mini-kb-item {
  padding: 10px 14px;
  background: var(--card-bg);
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  font-size: 12px;
  display: flex; align-items: center; gap: 8px;
}
.mini-kb-icon {
  width: 24px; height: 24px;
  border-radius: 6px;
  background: var(--blue-glow);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px;
  flex-shrink: 0;
}
.mini-kb-text { color: var(--text-secondary); }
.mini-kb-tag {
  margin-left: auto;
  font-size: 10px; font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--green-glow);
  color: var(--green);
}

/* ===== ROI ===== */
.roi {
  padding: 120px 0;
  background: var(--gray-100);
}
.roi-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  margin-top: 48px;
}
.roi-calculator {
  background: var(--white);
  border: none;
  border-radius: 20px;
  padding: 36px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.roi-calc-title {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 18px; font-weight: 600;
  margin-bottom: 24px;
  display: flex; align-items: center; gap: 10px;
}
.roi-calc-title span {
  font-size: 14px;
  padding: 3px 10px;
  background: var(--green-glow);
  border-radius: 6px;
  color: var(--green);
  font-weight: 600;
}
.roi-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid var(--gray-200);
}
.roi-row:last-child { border-bottom: none; }
.roi-label { font-size: 14px; color: var(--text-secondary); }
.roi-value {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 16px; font-weight: 600;
}
.roi-result {
  margin-top: 20px;
  padding: 20px;
  background: var(--green-glow);
  border: 1px solid rgba(52, 211, 153, 0.2);
  border-radius: 12px;
  text-align: center;
}
.roi-result-label {
  font-size: 13px; color: var(--green);
  font-weight: 600; margin-bottom: 4px;
}
.roi-result-value {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 36px; font-weight: 700;
  color: var(--green);
  transition: transform 0.15s ease;
}
.roi-result-sub {
  font-size: 12px; color: var(--text-muted);
  margin-top: 4px;
}
.roi-metrics {
  display: flex; flex-direction: column; gap: 20px;
}
.roi-metric {
  background: var(--white);
  border: none;
  border-radius: 14px;
  padding: 24px;
  display: flex; gap: 16px; align-items: flex-start;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.roi-metric-icon {
  width: 44px; height: 44px;
  border-radius: 10px;
  background: var(--blue-glow);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.roi-metric h4 {
  font-size: 15px; font-weight: 700;
  margin-bottom: 6px;
}
.roi-metric p {
  font-size: 13px; line-height: 1.6;
  color: var(--text-secondary);
}

/* ===== SUCCESS STORIES VISUAL ===== */
.success-stories-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  margin-bottom: 40px;
}
.success-stories-visual {
  position: relative;
}
.ss-mockup {
  background: var(--white);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.06);
}
.ss-header {
  padding: 12px 18px;
  background: var(--navy);
  color: var(--white);
  display: flex; align-items: center; justify-content: space-between;
  font-size: 12px; font-weight: 700;
}
.ss-header-dots { display: flex; gap: 4px; }
.ss-header-dots span { width: 7px; height: 7px; border-radius: 50%; }
.ss-header-dots span:nth-child(1) { background: #FF5F57; }
.ss-header-dots span:nth-child(2) { background: #FEBC2E; }
.ss-header-dots span:nth-child(3) { background: #28C840; }
.ss-body {
  padding: 20px;
}
.ss-card-preview {
  background: var(--gray-100);
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 12px;
}
.ss-card-quote {
  font-size: 13px; font-style: normal; line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 12px;
  position: relative;
  padding-left: 16px;
  border-left: 3px solid #5EC4E3;
}
.ss-card-patient {
  display: flex; align-items: center; gap: 10px;
}
.ss-card-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5EC4E3, #7DD4ED);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; color: var(--white);
}
.ss-card-info {
  flex: 1;
}
.ss-card-name {
  font-size: 12px; font-weight: 700; color: var(--text-primary);
}
.ss-card-treatment {
  font-size: 10px; color: var(--text-muted);
}
.ss-card-stars {
  color: #F59E0B; font-size: 12px; letter-spacing: 1px;
}
.ss-actions {
  display: flex; gap: 8px;
}
.ss-action-btn {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  font-size: 10px; font-weight: 700;
  text-align: center;
}
.ss-action-btn.publish {
  background: #0A7AFF;
  color: var(--white);
}
.ss-action-btn.edit {
  background: var(--gray-100);
  color: var(--text-secondary);
  border: 1px solid rgba(0,0,0,0.06);
}
.ss-badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px;
  background: rgba(94, 196, 227, 0.1);
  border-radius: 100px;
  font-size: 9px; font-weight: 700; color: #0E9AC0;
  text-transform: uppercase; letter-spacing: 0.5px;
  margin-bottom: 10px;
}
.ss-queue {
  display: flex; gap: 8px;
  margin-top: 12px;
}
.ss-queue-item {
  flex: 1;
  padding: 10px;
  background: var(--gray-100);
  border-radius: 8px;
  font-size: 10px;
}
.ss-queue-name {
  font-weight: 700; color: var(--text-primary);
  margin-bottom: 2px;
}
.ss-queue-status {
  color: var(--text-muted); font-size: 9px;
}
.ss-queue-dot {
  display: inline-block; width: 5px; height: 5px; border-radius: 50%;
  margin-right: 3px;
}
.ss-queue-dot.ready { background: var(--green); }
.ss-queue-dot.draft { background: var(--orange); }

/* ===== PATIENT FUNNEL ===== */
.funnel {
  padding: 100px 0;
}
.funnel-mockup {
  background: var(--white);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.06);
  margin-top: 48px;
  margin-bottom: 40px;
}
.funnel-toolbar {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 20px;
  background: var(--navy);
  color: var(--white);
  font-size: 12px; font-weight: 700;
}
.funnel-toolbar-dots { display: flex; gap: 5px; }
.funnel-toolbar-dots span { width: 8px; height: 8px; border-radius: 50%; }
.funnel-toolbar-dots span:nth-child(1) { background: #FF5F57; }
.funnel-toolbar-dots span:nth-child(2) { background: #FEBC2E; }
.funnel-toolbar-dots span:nth-child(3) { background: #28C840; }
.funnel-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}
.funnel-body-left {
  padding: 20px;
  border-right: 1px solid rgba(0,0,0,0.06);
}
.funnel-body-right {
  padding: 20px;
}
.funnel-body-title {
  font-size: 11px; font-weight: 800; color: var(--text-primary);
  text-transform: uppercase; letter-spacing: 0.5px;
  margin-bottom: 14px;
}
.funnel-content-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 12px;
  background: var(--gray-100);
  border-radius: 10px;
  margin-bottom: 8px;
}
.funnel-content-item:last-child { margin-bottom: 0; }
.funnel-content-left {
  display: flex; align-items: center; gap: 10px;
}
.funnel-content-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}
.funnel-content-icon.blog { background: rgba(59,130,246,0.1); }
.funnel-content-icon.story { background: rgba(168,85,247,0.1); }
.funnel-content-icon.social { background: rgba(34,197,94,0.1); }
.funnel-content-name {
  font-size: 12px; font-weight: 700; color: var(--text-primary);
}
.funnel-content-meta {
  font-size: 9px; color: var(--text-muted); margin-top: 1px;
}
.funnel-content-status {
  font-size: 8px; font-weight: 700;
  padding: 3px 8px;
  border-radius: 100px;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.funnel-content-status.published { background: rgba(34,197,94,0.1); color: var(--green); }
.funnel-content-status.scheduled { background: rgba(245,158,11,0.1); color: #F59E0B; }
.funnel-content-status.draft { background: rgba(0,0,0,0.05); color: var(--text-muted); }
.funnel-review-stat {
  background: var(--gray-100);
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 8px;
  text-align: center;
}
.funnel-review-stat:last-child { margin-bottom: 0; }
.funnel-review-number {
  font-size: 24px; font-weight: 800; color: var(--text-primary);
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
}
.funnel-review-label {
  font-size: 10px; color: var(--text-muted); margin-top: 2px;
}
.funnel-review-bar {
  height: 4px; border-radius: 2px; background: rgba(0,0,0,0.06);
  margin-top: 8px; overflow: hidden;
}
.funnel-review-bar-fill {
  height: 100%; border-radius: 2px;
}
@media (max-width: 768px) {
  .funnel-body { grid-template-columns: 1fr; }
  .funnel-body-left { border-right: none; border-bottom: 1px solid rgba(0,0,0,0.06); }
}
.funnel-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 48px;
}
.funnel-card {
  background: var(--gray-100);
  border: none;
  border-radius: 16px;
  padding: 32px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}
.funnel-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
}
.funnel-card-number {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 48px; font-weight: 700;
  color: rgba(55, 48, 163, 0.08);
  position: absolute;
  top: 16px; right: 24px;
}
.funnel-card h3 {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 18px; font-weight: 600;
  margin-bottom: 10px;
  letter-spacing: -0.3px;
}
.funnel-card p {
  font-size: 14px; line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 16px;
}
.funnel-tag {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(55, 48, 163, 0.08);
  border-radius: 6px;
  font-size: 11px; font-weight: 600;
  color: var(--navy);
}

/* ===== HOW IT WORKS ===== */
.how {
  padding: 120px 0;
}
.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 48px;
}
.step {
  text-align: center;
  padding: 40px 32px;
  background: var(--gray-100);
  border: none;
  border-radius: 16px;
  position: relative;
  transition: all 0.3s;
}
.step:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
}
.step-number {
  width: 56px; height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #0E9AC0, #5EC4E3);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 22px; font-weight: 700;
  color: var(--white);
  margin: 0 auto 24px;
}
.step h3 {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 20px; font-weight: 600;
  margin-bottom: 12px;
  letter-spacing: -0.3px;
}
.step p {
  font-size: 14px; line-height: 1.7;
  color: var(--text-secondary);
}
.step-connector {
  display: none;
}

/* ===== INTEGRATIONS ===== */
.integrations {
  padding: 100px 0;
}
.integrations-center {
  text-align: center;
}
.integrations-center .section-title,
.integrations-center .section-sub {
  margin-left: auto; margin-right: auto;
}
.int-logos {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 48px;
}
.int-logo {
  width: 100px; height: 80px;
  background: var(--gray-100);
  border: none;
  border-radius: 12px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 8px;
  transition: all 0.3s;
  font-size: 10px; color: var(--text-muted); font-weight: 600;
}
.int-logo:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
}
.int-logo-icon {
  font-size: 24px;
}

/* ===== PRICING ===== */
.pricing {
  padding: 120px 0;
  background: var(--gray-100);
}
.pricing-center { text-align: center; }
.pricing-center .section-title,
.pricing-center .section-sub {
  margin-left: auto; margin-right: auto;
}
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 48px;
}
.price-card {
  background: var(--white);
  border: none;
  border-radius: 20px;
  padding: 36px;
  text-align: left;
  transition: all 0.3s;
  position: relative;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.price-card.featured {
  box-shadow: 0 4px 20px rgba(55, 48, 163, 0.12);
}
.price-card.featured::before {
  content: 'Most Popular';
  position: absolute;
  top: -12px; left: 50%; transform: translateX(-50%);
  padding: 4px 16px;
  background: linear-gradient(135deg, var(--navy), var(--navy-light));
  color: var(--white);
  font-size: 11px; font-weight: 700;
  border-radius: 100px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.price-tier {
  font-size: 13px; font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #0E9AC0;
  margin-bottom: 8px;
}
.price-tagline {
  font-size: 15px; color: var(--text-secondary);
  margin-bottom: 20px;
  min-height: 44px;
}
.price-amount {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 42px; font-weight: 700;
  margin-bottom: 4px;
}
.price-amount span {
  font-size: 16px; font-weight: 500;
  color: var(--text-muted);
}
.price-features {
  list-style: none;
  margin: 28px 0;
  display: flex; flex-direction: column; gap: 12px;
}
.price-features li {
  font-size: 13px;
  color: var(--text-secondary);
  display: flex; align-items: center; gap: 10px;
}
.price-features li::before {
  content: '\\2713';
  color: var(--green);
  font-weight: 700;
  font-size: 12px;
}
.price-cta {
  width: 100%;
  padding: 14px;
  border-radius: 100px;
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 15px; font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  text-decoration: none;
  display: block;
}
.price-cta-primary {
  background: #0A7AFF;
  color: var(--white);
  border: none;
  box-shadow: 0 4px 16px rgba(10, 122, 255, 0.25);
}
.price-cta-primary:hover {
  background: #0968D9;
  box-shadow: 0 6px 24px rgba(10, 122, 255, 0.35);
}
.price-cta-secondary {
  background: transparent;
  color: var(--navy);
  border: 1px solid rgba(55, 48, 163, 0.2);
}
.price-cta-secondary:hover {
  border-color: var(--navy);
  background: rgba(55, 48, 163, 0.06);
}

/* ===== CTA SECTION ===== */
.cta-section {
  padding: 100px 0;
  text-align: center;
}
.cta-box {
  background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%);
  border: none;
  border-radius: 24px;
  padding: 72px 48px;
  position: relative;
  overflow: hidden;
  color: var(--white);
}
.cta-box::before {
  content: '';
  position: absolute;
  top: -100px; left: 50%; transform: translateX(-50%);
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 60%);
  pointer-events: none;
}
.cta-box h2 {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 40px; font-weight: 800; font-style: normal;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
  position: relative;
}
.cta-box p {
  font-size: 17px; color: rgba(255,255,255,0.7);
  margin-bottom: 36px;
  position: relative;
}
.cta-box .btn-primary {
  font-size: 16px;
  padding: 16px 40px;
  position: relative;
  background: var(--white);
  color: var(--navy);
}
.cta-box .btn-primary:hover {
  background: var(--gray-100);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

/* ===== ABOUT US ===== */
.about-section {
  padding: 100px 0;
  background: #FAFBFD;
  border-top: 1px solid rgba(0,0,0,0.04);
}
.about-inner {
  display: flex; gap: 60px; align-items: center; max-width: 960px; margin: 0 auto;
}
.about-photo {
  flex-shrink: 0; width: 340px; height: 340px; border-radius: 20px; overflow: hidden;
  box-shadow: 0 12px 40px rgba(55, 48, 163, 0.1);
}
.about-photo img {
  width: 100%; height: 100%; object-fit: cover;
}
.about-text {
  flex: 1;
}
.about-label {
  font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;
  color: var(--blue); margin-bottom: 12px;
}
.about-text h2 {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 34px; font-weight: 800; font-style: normal; color: var(--text-primary);
  line-height: 1.15; letter-spacing: 0.5px; margin-bottom: 20px;
}
.about-text p {
  font-size: 15px; line-height: 1.7; color: var(--text-secondary);
  margin-bottom: 14px;
}
.about-text p:last-child { margin-bottom: 0; }
.about-text strong { color: var(--text-primary); }

@media (max-width: 768px) {
  .about-inner { flex-direction: column; gap: 32px; text-align: center; }
  .about-photo { width: 260px; height: 260px; margin: 0 auto; }
  .about-text h2 { font-size: 28px; }
}

/* ===== FOOTER ===== */
footer {
  padding: 48px 0;
  border-top: 1px solid rgba(0,0,0,0.06);
}
footer .container {
  display: flex; justify-content: space-between; align-items: center;
}
.footer-brand {
  display: flex; align-items: center; gap: 10px;
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-weight: 800; font-size: 18px; font-style: normal;
  color: var(--gray-400);
}
.footer-brand svg { width: 28px; height: 28px; }
.footer-links {
  display: flex; gap: 24px;
}
.footer-links a {
  font-size: 13px; color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
}
.footer-links a:hover { color: var(--navy); }

/* ===== SERVICE TABS (What We Do) ===== */
.service-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
  align-items: start;
}
.service-tabs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.service-tab {
  background: var(--gray-100);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 14px;
}
.service-tab:hover {
  background: var(--white);
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}
.service-tab.active {
  border-color: var(--navy);
  background: var(--white);
  box-shadow: 0 4px 16px rgba(55, 48, 163, 0.1);
}
.service-tab-icon {
  font-size: 22px;
  flex-shrink: 0;
}
.service-tab h3 {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.2px;
}
.service-right {
  display: flex;
  flex-direction: column;
}
.service-detail {
  padding: 16px 0 0;
  transition: all 0.3s;
}
.service-detail p {
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-secondary);
}
.service-mockup-wrap {
  max-width: 100%;
  margin-bottom: 0;
}
.service-mockup-wrap .smartforms-mockup,
.service-mockup-wrap .backoffice-mockup,
.service-mockup-wrap .portal-mockup,
.service-mockup-wrap .concierge-mockup {
  background: var(--white);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.06);
}

/* ===== WHY US STATS ===== */
.why-stats {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}
.why-stat {
  background: var(--white);
  border-radius: 16px;
  padding: 24px 32px;
  text-align: center;
  min-width: 160px;
  transition: all 0.3s;
}
.why-stat:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
}
.why-stat-value {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: var(--navy);
  margin-bottom: 4px;
}
.why-stat-label {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
}

/* ===== CASE STUDIES ===== */
.cases-section {
  padding: 120px 0;
}
.cases-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 48px;
}
.case-card {
  background: var(--gray-100);
  border-radius: 20px;
  padding: 36px;
  transition: all 0.3s;
}
.case-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
}
.case-type {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #0E9AC0;
  margin-bottom: 16px;
}
.case-quote {
  font-size: 15px;
  font-style: normal;
  line-height: 1.6;
  color: var(--text-primary);
  margin-bottom: 20px;
  padding-left: 16px;
  border-left: 3px solid var(--blue);
}
.case-problem, .case-built {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 8px;
}
.case-problem strong, .case-built strong {
  color: var(--text-primary);
}
.case-metrics-row {
  display: flex;
  gap: 16px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--gray-200);
}
.case-metric {
  flex: 1;
}
.case-metric-value {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: var(--green);
}
.case-metric-label {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 600;
}

/* ===== OLD SECTIONS (kept for backwards compat) ===== */
.backoffice-section {
  padding: 60px 0 120px;
}
.backoffice-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}
.backoffice-content {
  position: relative; z-index: 2;
}
.backoffice-features {
  display: flex; flex-direction: column; gap: 16px;
  margin-top: 28px;
}
.backoffice-feature {
  display: flex; gap: 12px; align-items: flex-start;
}
.backoffice-feature-icon {
  width: 36px; height: 36px;
  border-radius: 8px;
  background: rgba(55, 48, 163, 0.08);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.backoffice-feature h4 {
  font-size: 14px; font-weight: 700;
  margin-bottom: 2px;
}
.backoffice-feature p {
  font-size: 12px; line-height: 1.5;
  color: var(--text-secondary);
}
.backoffice-visual {
  position: relative;
}
.backoffice-mockup {
  background: var(--white);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.06);
}
.bo-toolbar {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 20px;
  background: var(--navy);
  color: var(--white);
  font-size: 12px; font-weight: 700;
}
.bo-toolbar-dots { display: flex; gap: 5px; }
.bo-toolbar-dots span { width: 8px; height: 8px; border-radius: 50%; }
.bo-toolbar-dots span:nth-child(1) { background: #FF5F57; }
.bo-toolbar-dots span:nth-child(2) { background: #FEBC2E; }
.bo-toolbar-dots span:nth-child(3) { background: #28C840; }
.bo-sidebar {
  display: flex;
}
.bo-nav {
  width: 52px;
  background: var(--gray-100);
  border-right: 1px solid rgba(0,0,0,0.06);
  display: flex; flex-direction: column; align-items: center;
  padding: 16px 0;
  gap: 16px;
}
.bo-nav-item {
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
  color: var(--text-muted);
  transition: all 0.2s;
}
.bo-nav-item.active {
  background: var(--navy);
  color: var(--white);
}
.bo-main {
  flex: 1;
  padding: 16px;
}
.bo-main-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 14px;
}
.bo-main-title {
  font-size: 14px; font-weight: 800; color: var(--text-primary);
}
.bo-main-tabs {
  display: flex; gap: 2px;
}
.bo-main-tab {
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 10px; font-weight: 700;
  color: var(--text-muted);
}
.bo-main-tab.active {
  background: var(--navy);
  color: var(--white);
}
.bo-automation-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.bo-auto-card {
  background: var(--gray-100);
  border-radius: 10px;
  padding: 12px;
  transition: all 0.2s;
}
.bo-auto-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}
.bo-auto-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 8px;
}
.bo-auto-icon {
  font-size: 16px;
}
.bo-auto-status {
  font-size: 8px; font-weight: 700;
  padding: 2px 8px;
  border-radius: 100px;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.bo-auto-status.active { background: rgba(34, 197, 94, 0.1); color: var(--green); }
.bo-auto-status.draft { background: rgba(0,0,0,0.05); color: var(--text-muted); }
.bo-auto-name {
  font-size: 11px; font-weight: 700; color: var(--text-primary);
  margin-bottom: 3px;
}
.bo-auto-desc {
  font-size: 9px; color: var(--text-muted); line-height: 1.4;
}
.bo-auto-stat {
  margin-top: 8px;
  font-size: 9px; font-weight: 700; color: var(--green);
}

/* ===== PATIENT PORTAL SECTION ===== */
.portal-section {
  padding: 120px 0;
  background: var(--gray-100);
  position: relative;
  overflow: hidden;
}
.portal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}
.portal-content {
  position: relative; z-index: 2;
}
.portal-features {
  display: flex; flex-direction: column; gap: 20px;
  margin-top: 32px;
}
.portal-feature {
  display: flex; gap: 14px; align-items: flex-start;
}
.portal-feature-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: rgba(55, 48, 163, 0.08);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.portal-feature h4 {
  font-size: 15px; font-weight: 700;
  margin-bottom: 4px;
}
.portal-feature p {
  font-size: 13px; line-height: 1.6;
  color: var(--text-secondary);
}
.portal-visual {
  position: relative;
}
.portal-mockup {
  background: var(--white);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.06);
}
.portal-mockup-nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px;
  background: var(--navy);
  color: var(--white);
}
.portal-mockup-logo {
  display: flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 700; font-style: normal;
}
.portal-mockup-logo .logo-dot {
  width: 24px; height: 24px;
  border-radius: 6px;
  background: rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 800;
}
.portal-mockup-nav-links {
  display: flex; gap: 16px;
  font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 600;
}
.portal-mockup-body {
  padding: 24px;
}
.portal-welcome {
  text-align: center;
  margin-bottom: 20px;
}
.portal-welcome h3 {
  font-size: 18px; font-weight: 800; font-style: normal;
  color: var(--text-primary);
  margin-bottom: 4px;
}
.portal-welcome p {
  font-size: 12px; color: var(--text-muted);
}
.portal-search {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px;
  background: var(--gray-100);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 10px;
  margin-bottom: 20px;
}
.portal-search-icon {
  font-size: 14px; color: var(--text-muted);
}
.portal-search-text {
  font-size: 13px; color: var(--text-muted);
}
.portal-chat {
  display: flex; flex-direction: column; gap: 12px;
}
.portal-chat-msg {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 12px; line-height: 1.5;
}
.portal-chat-msg.user {
  align-self: flex-end;
  background: var(--navy);
  color: var(--white);
  border-bottom-right-radius: 4px;
}
.portal-chat-msg.ai {
  align-self: flex-start;
  background: var(--gray-100);
  color: var(--text-primary);
  border-bottom-left-radius: 4px;
}
.portal-chat-msg .ai-badge {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 9px; font-weight: 700; color: var(--navy);
  background: rgba(55, 48, 163, 0.08);
  padding: 2px 8px;
  border-radius: 100px;
  margin-bottom: 6px;
}
.portal-chat-msg .sources {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(0,0,0,0.06);
  font-size: 10px; color: var(--text-muted);
}
.portal-chat-msg .sources span {
  color: var(--navy); font-weight: 600;
}
.portal-kb-uploads {
  display: flex; gap: 8px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(0,0,0,0.06);
}
.portal-kb-file {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 10px;
  background: var(--gray-100);
  border-radius: 8px;
  font-size: 10px; font-weight: 600; color: var(--text-secondary);
}
.portal-kb-file .file-icon {
  font-size: 12px;
}
.portal-kb-file .file-status {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--green);
}

/* Portal Notification Toasts */
.portal-toasts {
  position: absolute;
  bottom: 20px;
  right: -30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10;
}
.portal-toast {
  background: var(--white);
  border-radius: 12px;
  padding: 10px 16px;
  display: flex; align-items: center; gap: 10px;
  box-shadow: 0 8px 30px rgba(55, 48, 163, 0.15), 0 2px 8px rgba(0,0,0,0.06);
  font-size: 12px;
  white-space: nowrap;
  border-left: 3px solid var(--green);
  animation: portalToastIn 0.5s ease both;
}
.portal-toast:nth-child(2) { animation-delay: 0.6s; }
.portal-toast:nth-child(3) { animation-delay: 1.2s; }
.portal-toast .toast-icon {
  width: 28px; height: 28px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}
.portal-toast .toast-text {
  display: flex; flex-direction: column; gap: 1px;
}
.portal-toast .toast-label {
  font-size: 9px; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;
}
.portal-toast .toast-msg {
  font-size: 11px; font-weight: 700; color: var(--text-primary);
}
@keyframes portalToastIn {
  from { opacity: 0; transform: translateX(30px) scale(0.95); }
  to { opacity: 1; transform: translateX(0) scale(1); }
}

/* ===== TRAVEL CONCIERGE SECTION ===== */
.concierge-section {
  padding: 120px 0;
}
.concierge-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}
.concierge-content {
  position: relative; z-index: 2;
}
.concierge-features {
  display: flex; flex-direction: column; gap: 20px;
  margin-top: 32px;
}
.concierge-feature {
  display: flex; gap: 14px; align-items: flex-start;
}
.concierge-feature-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: rgba(55, 48, 163, 0.08);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.concierge-feature h4 {
  font-size: 15px; font-weight: 700;
  margin-bottom: 4px;
}
.concierge-feature p {
  font-size: 13px; line-height: 1.6;
  color: var(--text-secondary);
}
.concierge-visual {
  position: relative;
}
.concierge-mockup {
  background: var(--white);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.06);
}
.concierge-toggle {
  display: flex; gap: 2px;
  background: var(--gray-100);
  border-radius: 8px;
  padding: 3px;
  width: fit-content;
}
.concierge-toggle-btn {
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 11px; font-weight: 700;
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.concierge-toggle-btn.active {
  background: var(--navy);
  color: var(--white);
}
.tc-toolbar {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 20px;
  background: var(--navy);
  color: var(--white);
  font-size: 12px; font-weight: 700;
}
.tc-toolbar-dots { display: flex; gap: 5px; }
.tc-toolbar-dots span { width: 8px; height: 8px; border-radius: 50%; }
.tc-toolbar-dots span:nth-child(1) { background: #FF5F57; }
.tc-toolbar-dots span:nth-child(2) { background: #FEBC2E; }
.tc-toolbar-dots span:nth-child(3) { background: #28C840; }
.tc-patient-body {
  padding: 20px;
}
.tc-patient-header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 16px;
}
.tc-patient-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: rgba(55, 48, 163, 0.08);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
}
.tc-patient-greeting {
  font-size: 14px; font-weight: 700;
}
.tc-info-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.tc-info-card {
  background: var(--gray-100);
  border-radius: 10px;
  padding: 12px;
}
.tc-info-card-icon {
  font-size: 16px; margin-bottom: 6px;
}
.tc-info-card-label {
  font-size: 9px; text-transform: uppercase;
  color: var(--text-muted);
  font-weight: 600; letter-spacing: 0.5px;
}
.tc-info-card-value {
  font-size: 12px; font-weight: 700;
  color: var(--text-primary);
}
.tc-timeline {
  margin-top: 12px;
  display: flex; flex-direction: column; gap: 8px;
}
.tc-timeline-item {
  display: flex; align-items: center; gap: 8px;
  font-size: 11px;
}
.tc-timeline-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--navy);
  flex-shrink: 0;
}
.tc-timeline-dot.completed { background: var(--green); }
.tc-timeline-dot.upcoming { background: var(--gray-200); }
.tc-admin-body {
  padding: 16px;
}
.tc-admin-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}
.tc-admin-stat {
  background: var(--gray-100);
  border-radius: 8px;
  padding: 10px;
  text-align: center;
}
.tc-admin-stat-value {
  font-size: 18px; font-weight: 800;
  color: var(--navy);
}
.tc-admin-stat-label {
  font-size: 9px; color: var(--text-muted);
  text-transform: uppercase;
}
.tc-admin-table {
  width: 100%;
}
.tc-admin-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 10px;
  border-bottom: 1px solid rgba(0,0,0,0.04);
  font-size: 11px;
}
.tc-admin-row:last-child { border-bottom: none; }
.tc-admin-name {
  font-weight: 700; color: var(--text-primary);
}
.tc-admin-status {
  font-size: 8px; font-weight: 700;
  padding: 2px 8px;
  border-radius: 100px;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.tc-admin-status.arriving { background: rgba(94, 196, 227, 0.15); color: #0E9AC0; }
.tc-admin-status.in-treatment { background: rgba(34, 197, 94, 0.1); color: var(--green); }
.tc-admin-status.departing { background: rgba(245, 158, 11, 0.1); color: var(--orange); }

/* ===== SMART FORMS SECTION ===== */
.smartforms-section {
  padding: 120px 0;
  background: var(--gray-100);
  position: relative;
  overflow: hidden;
}
.smartforms-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}
.smartforms-content {
  position: relative; z-index: 2;
}
.smartforms-features {
  display: flex; flex-direction: column; gap: 20px;
  margin-top: 32px;
}
.smartforms-feature {
  display: flex; gap: 14px; align-items: flex-start;
}
.smartforms-feature-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: rgba(55, 48, 163, 0.08);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.smartforms-feature h4 {
  font-size: 15px; font-weight: 700;
  margin-bottom: 4px;
}
.smartforms-feature p {
  font-size: 13px; line-height: 1.6;
  color: var(--text-secondary);
}
.smartforms-visual {
  position: relative;
}
.smartforms-mockup {
  background: var(--white);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.06);
}
.sf-toolbar {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 20px;
  background: var(--navy);
  color: var(--white);
  font-size: 12px; font-weight: 700;
}
.sf-toolbar-dots { display: flex; gap: 5px; }
.sf-toolbar-dots span { width: 8px; height: 8px; border-radius: 50%; }
.sf-toolbar-dots span:nth-child(1) { background: #FF5F57; }
.sf-toolbar-dots span:nth-child(2) { background: #FEBC2E; }
.sf-toolbar-dots span:nth-child(3) { background: #28C840; }
.sf-body {
  padding: 24px;
}
.sf-form-title {
  font-size: 16px; font-weight: 800;
  text-align: center;
  margin-bottom: 4px;
}
.sf-form-sub {
  font-size: 11px; color: var(--text-muted);
  text-align: center;
  margin-bottom: 16px;
}
.sf-lead-badge {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 9px; font-weight: 700;
  color: var(--green);
  background: rgba(34, 197, 94, 0.1);
  padding: 3px 10px;
  border-radius: 100px;
  margin-bottom: 12px;
}
.sf-field {
  margin-bottom: 10px;
}
.sf-field-label {
  font-size: 10px; font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 4px;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.sf-field-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--gray-200);
  background: var(--gray-100);
  font-size: 12px;
  color: var(--text-muted);
  box-sizing: border-box;
}
.sf-field-highlight {
  border-color: var(--navy);
  background: rgba(55, 48, 163, 0.03);
  color: var(--text-primary);
}
.sf-progress {
  display: flex; align-items: center; gap: 6px;
  margin: 16px 0 4px;
}
.sf-progress-step {
  flex: 1; height: 4px;
  border-radius: 2px;
  background: var(--gray-200);
}
.sf-progress-step.active { background: var(--navy); }
.sf-progress-step.completed { background: var(--green); }
.sf-progress-labels {
  display: flex; justify-content: space-between;
  font-size: 9px; color: var(--text-muted);
  margin-bottom: 16px;
}
.sf-embed {
  margin-top: 16px;
  background: var(--gray-100);
  border-radius: 10px;
  padding: 12px;
  border: 1px dashed rgba(0,0,0,0.1);
}
.sf-embed-label {
  font-size: 9px; font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.5px;
  margin-bottom: 6px;
}
.sf-embed-code {
  font-family: monospace;
  font-size: 10px;
  color: var(--navy);
  background: var(--white);
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,0.06);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* ===== ROI INTERACTIVE ===== */
.roi-input-wrap {
  display: flex; align-items: center; gap: 14px;
}
.roi-input-value {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 16px; font-weight: 600;
  color: var(--text-primary);
  min-width: 72px;
  text-align: right;
}
.roi-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 140px;
  height: 6px;
  border-radius: 3px;
  background: var(--gray-200);
  outline: none;
  cursor: pointer;
}
.roi-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: var(--navy);
  cursor: pointer;
  box-shadow: 0 0 10px rgba(55, 48, 163, 0.4);
  transition: box-shadow 0.2s;
}
.roi-slider::-webkit-slider-thumb:hover {
  box-shadow: 0 0 18px rgba(55, 48, 163, 0.6);
}
.roi-slider::-moz-range-thumb {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: var(--blue);
  cursor: pointer;
  border: none;
  box-shadow: 0 0 10px rgba(94, 196, 227, 0.4);
}

/* ===== HERO DNA ANIMATION ===== */
.hero-dna {
  position: absolute; inset: 0; z-index: 2;
  display: flex; align-items: center; justify-content: center;
  background: radial-gradient(ellipse at center, rgba(55, 48, 163, 0.06) 0%, transparent 70%);
  animation: dnaIn 0.8s ease forwards;
  overflow: hidden; border-radius: 16px;
}
.hero-dna-fade { animation: dnaOut 1s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
@keyframes dnaIn { 0% { opacity: 0; } 100% { opacity: 1; } }
@keyframes dnaOut { 0% { opacity: 1; } 100% { opacity: 0; filter: blur(6px); transform: scale(0.96); } }
.hero-dna-svg { width: 80%; height: 80%; animation: dnaRotate 4s linear infinite; }
@keyframes dnaRotate { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(360deg); } }
.dna-strand-anim { stroke-dasharray: 30 15; animation: strandDash 2s linear infinite; }
@keyframes strandDash { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -90; } }
.dna-node-pulse { animation: dnaPulse 1.5s ease-in-out infinite alternate; }
@keyframes dnaPulse { 0% { opacity: 0.5; } 100% { opacity: 1; } }
@keyframes rungAppear { 0% { opacity: 0; } 100% { opacity: 1; } }
.dna-particle {
  position: absolute; border-radius: 50%;
  background: radial-gradient(circle, rgba(94, 196, 227, 0.6), rgba(55, 48, 163, 0.2));
  box-shadow: 0 0 6px rgba(94, 196, 227, 0.3);
  animation: dnaFloat 3s ease-in-out infinite alternate, dnaFade 3s ease-in-out infinite;
  pointer-events: none;
}
@keyframes dnaFloat { 0% { transform: translate(0, 0); } 100% { transform: translate(8px, -12px); } }
@keyframes dnaFade { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.5; } }
.crm-hidden { opacity: 0; transform: translateY(8px); }
.crm-revealed { animation: crmReveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
@keyframes crmReveal { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .hero-dna { display: none; } .crm-hidden { opacity: 1; transform: none; } }
/* ===== HERO TABS ===== */
.hero-tabs-section {
  position: relative; padding: 180px 0 80px; background: #fff; overflow: hidden;
}
.hero-tabs-text { text-align: center; max-width: 720px; margin: 0 auto; padding: 0 24px; }
.hero-tabs-kicker {
  font-size: 12px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 2px; color: #0E9AC0; margin-bottom: 16px;
}
.hero-tabs-title {
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  font-size: 48px; font-weight: 800; line-height: 1.1; letter-spacing: -0.5px;
  color: #0F172A; margin-bottom: 20px;
}
.hero-tabs-sub {
  font-size: 17px; line-height: 1.7; color: #64748B; margin-bottom: 32px;
}
.hero-tabs-ctas {
  display: flex; gap: 12px; justify-content: center;
}
.hero-cta-primary {
  display: inline-flex; align-items: center; padding: 14px 32px;
  background: #3730A3; color: #fff; font-weight: 700; font-size: 15px;
  border-radius: 100px; text-decoration: none; transition: all 0.2s;
}
.hero-cta-primary:hover { background: #4338CA; box-shadow: 0 4px 16px rgba(55, 48, 163, 0.3); transform: translateY(-1px); }
.hero-cta-secondary {
  display: inline-flex; align-items: center; padding: 13px 28px;
  background: transparent; color: #0F172A; font-weight: 700; font-size: 15px;
  border: 1.5px solid #E2E8F0; border-radius: 100px; text-decoration: none; transition: all 0.2s;
}
.hero-cta-secondary:hover { border-color: #94A3B8; background: #F8FAFC; }
.hero-tabs-container {
  max-width: 1100px; margin: 48px auto 0; padding: 0 24px;
}
.hero-tab-nav {
  display: flex; justify-content: center; gap: 0; border-bottom: 1px solid #E2E8F0;
  margin-bottom: 0;
}
.hero-tab-btn {
  padding: 14px 28px; font-size: 14px; font-weight: 600;
  color: #94A3B8; background: none; border: none; cursor: pointer;
  border-bottom: 2px solid transparent; transition: all 0.2s;
  font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
  white-space: nowrap;
}
.hero-tab-btn:hover { color: #475569; }
.hero-tab-btn.active { color: #3730A3; border-bottom-color: #3730A3; }
.hero-tab-panel {
  background: #F8FAFC; border-radius: 0 0 16px 16px; border: 1px solid #E2E8F0;
  border-top: none; padding: 32px;
  display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start;
  animation: heroTabFade 0.3s ease;
}
@keyframes heroTabFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

/* Hero tab mockups */
.ht-form-mockup {
  background: #fff; border: 1px solid #E2E8F0; border-radius: 12px;
  overflow: hidden;
}
.ht-form-header {
  padding: 12px 16px; background: #0F172A; color: #fff;
  font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 10px;
}
.ht-form-dots { display: flex; gap: 5px; }
.ht-form-dots span { width: 8px; height: 8px; border-radius: 50%; }
.ht-form-dots span:nth-child(1) { background: #FF5F57; }
.ht-form-dots span:nth-child(2) { background: #FEBC2E; }
.ht-form-dots span:nth-child(3) { background: #28C840; }
.ht-form-body { padding: 20px; }
.ht-form-title { font-size: 15px; font-weight: 700; color: #0F172A; margin-bottom: 2px; }
.ht-form-sub { font-size: 11px; color: #94A3B8; margin-bottom: 14px; }
.ht-form-badge {
  display: inline-flex; align-items: center; gap: 4px; font-size: 10px;
  font-weight: 700; color: #22C55E; background: rgba(34, 197, 94, 0.1);
  padding: 4px 10px; border-radius: 100px; margin-bottom: 14px;
}
.ht-field { margin-bottom: 10px; }
.ht-field-label { font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.ht-field-input {
  width: 100%; padding: 9px 12px; border-radius: 8px; border: 1px solid #E2E8F0;
  background: #F8FAFC; font-size: 12px; color: #0F172A; box-sizing: border-box;
}
.ht-field-input.filled { border-color: #3730A3; background: rgba(55, 48, 163, 0.03); }
.ht-steps { display: flex; gap: 6px; margin-top: 14px; }
.ht-step { flex: 1; height: 3px; border-radius: 2px; background: #E2E8F0; }
.ht-step.active { background: #3730A3; }
.ht-step.done { background: #22C55E; }
.ht-step-labels { display: flex; justify-content: space-between; font-size: 9px; color: #94A3B8; margin-top: 4px; margin-bottom: 14px; }
.ht-continue-btn {
  width: 100%; padding: 10px; background: #3730A3; color: #fff;
  border: none; border-radius: 8px; font-size: 13px; font-weight: 700;
  cursor: default; margin-bottom: 14px;
}
.ht-embed { background: #F8FAFC; border: 1px dashed #E2E8F0; border-radius: 8px; padding: 10px; }
.ht-embed-label { font-size: 9px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.ht-embed-code {
  font-family: monospace; font-size: 10px; color: #3730A3; background: #fff;
  padding: 6px 10px; border-radius: 6px; border: 1px solid #E2E8F0;
  overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
}

/* Lead pipeline cards */
.ht-lead-cards { display: flex; flex-direction: column; gap: 12px; }
.ht-lead-card {
  background: #fff; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;
}
.ht-lead-badge {
  display: inline-block; font-size: 10px; font-weight: 700; padding: 3px 10px;
  border-radius: 100px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.3px;
}
.ht-lead-badge.hot { background: rgba(34, 197, 94, 0.1); color: #22C55E; }
.ht-lead-badge.warm { background: rgba(245,158,11,0.1); color: #D97706; }
.ht-lead-badge.cold { background: rgba(148,163,184,0.15); color: #64748B; }
.ht-lead-name { font-size: 13px; font-weight: 700; color: #0F172A; margin-bottom: 2px; }
.ht-lead-desc { font-size: 11px; color: #94A3B8; line-height: 1.4; }

/* Portal mockup for tab 2 */
.ht-portal {
  background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden;
}
.ht-portal-nav {
  padding: 12px 16px; background: #0F172A; color: #fff;
  display: flex; align-items: center; justify-content: space-between;
  font-size: 12px; font-weight: 700;
}
.ht-portal-links { display: flex; gap: 14px; font-size: 10px; color: rgba(255,255,255,0.5); font-weight: 600; }
.ht-portal-body { padding: 18px; }
.ht-portal-welcome { font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 4px; }
.ht-portal-sub { font-size: 11px; color: #94A3B8; margin-bottom: 14px; }
.ht-portal-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.ht-portal-card {
  background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px;
}
.ht-portal-card-label { font-size: 9px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.ht-portal-card-value { font-size: 12px; font-weight: 600; color: #0F172A; }
.ht-portal-card-sub { font-size: 10px; color: #94A3B8; margin-top: 2px; }
.ht-portal-progress {
  margin-top: 12px; background: #F8FAFC; border: 1px solid #E2E8F0;
  border-radius: 8px; padding: 12px;
}
.ht-portal-progress-label { font-size: 10px; font-weight: 700; color: #0F172A; margin-bottom: 8px; }
.ht-portal-progress-bar { height: 6px; background: #E2E8F0; border-radius: 3px; overflow: hidden; }
.ht-portal-progress-fill { height: 100%; width: 65%; background: #3730A3; border-radius: 3px; }
.ht-portal-progress-text { font-size: 10px; color: #3730A3; font-weight: 600; margin-top: 4px; }

/* Timeline for tab 2 right side */
.ht-timeline { display: flex; flex-direction: column; gap: 0; }
.ht-timeline-title { font-size: 13px; font-weight: 700; color: #0F172A; margin-bottom: 16px; }
.ht-timeline-item { display: flex; gap: 12px; padding-bottom: 18px; }
.ht-timeline-item:last-child { padding-bottom: 0; }
.ht-timeline-dot-col { display: flex; flex-direction: column; align-items: center; width: 14px; }
.ht-timeline-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; border: 2px solid #3730A3; background: #fff; }
.ht-timeline-dot.filled { background: #3730A3; }
.ht-timeline-line { width: 1px; flex: 1; background: #E2E8F0; margin-top: 4px; }
.ht-timeline-content { flex: 1; }
.ht-timeline-time { font-size: 10px; font-weight: 700; color: #0E9AC0; text-transform: uppercase; letter-spacing: 0.5px; }
.ht-timeline-label { font-size: 12px; font-weight: 600; color: #0F172A; }
.ht-timeline-desc { font-size: 11px; color: #94A3B8; }

/* Travel tab mockups */
.ht-travel-portal {
  background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden;
}
.ht-travel-header {
  padding: 12px 16px; background: #0F172A; color: #fff;
  font-size: 12px; font-weight: 700;
}
.ht-travel-body { padding: 18px; }
.ht-travel-title { font-size: 15px; font-weight: 700; color: #0F172A; margin-bottom: 12px; }
.ht-travel-countdown {
  display: inline-flex; align-items: center; gap: 6px; font-size: 11px;
  font-weight: 700; color: #5EC4E3; background: rgba(55, 48, 163,0.08);
  padding: 4px 12px; border-radius: 100px; margin-bottom: 14px;
}
.ht-travel-checklist { display: flex; flex-direction: column; gap: 10px; }
.ht-travel-check {
  display: flex; align-items: center; gap: 10px; font-size: 12px; color: #0F172A;
}
.ht-travel-check-dot {
  width: 18px; height: 18px; border-radius: 50%; display: flex;
  align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0;
}
.ht-travel-check-dot.done { background: rgba(55, 48, 163,0.1); color: #22C55E; }
.ht-travel-check-dot.pending { background: #F1F5F9; color: #94A3B8; }
.ht-travel-check-text { font-weight: 600; }
.ht-travel-check-sub { font-size: 10px; color: #94A3B8; margin-left: 28px; margin-top: -4px; }

/* Admin dashboard mockup */
.ht-admin {
  background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden;
}
.ht-admin-header {
  padding: 12px 16px; background: #0F172A; color: #fff;
  font-size: 12px; font-weight: 700;
}
.ht-admin-body { padding: 18px; }
.ht-admin-title { font-size: 13px; font-weight: 700; color: #0F172A; margin-bottom: 12px; }
.ht-admin-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 0; border-bottom: 1px solid #F1F5F9; font-size: 12px;
}
.ht-admin-row:last-child { border-bottom: none; }
.ht-admin-name { font-weight: 700; color: #0F172A; }
.ht-admin-date { color: #94A3B8; font-size: 11px; }
.ht-admin-status {
  font-size: 9px; font-weight: 700; padding: 3px 8px;
  border-radius: 100px; text-transform: uppercase; letter-spacing: 0.3px;
}
.ht-admin-status.confirmed { background: rgba(55, 48, 163,0.1); color: #22C55E; }
.ht-admin-status.pending { background: rgba(245,158,11,0.1); color: #D97706; }
.ht-admin-status.transit { background: rgba(99,102,241,0.1); color: #6366F1; }
.ht-admin-coord {
  margin-top: 12px; padding-top: 12px; border-top: 1px solid #F1F5F9;
  font-size: 11px; color: #94A3B8; display: flex; align-items: center; gap: 6px;
}
.ht-admin-coord-dot { width: 8px; height: 8px; border-radius: 50%; background: #22C55E; }

/* ===== RESPONSIVE ===== */
/* ===== TABLET ===== */
@media (max-width: 900px) {
  .hero-split { grid-template-columns: 1fr; gap: 40px; }
  .hero-split-left { align-items: center; text-align: center; }
  .hero-centered { text-align: center; }
  .hero-centered-sub { margin: 0 auto 36px; }
  .hero-main-title { font-size: 44px; }
  .hero-centered-ctas { flex-direction: column; align-items: center; }
  .pain-grid, .product-grid, .steps, .pricing-grid, .funnel-grid {
    grid-template-columns: 1fr;
  }
  .service-layout { grid-template-columns: 1fr; }
  .service-tabs { flex-direction: row; flex-wrap: wrap; }
  .service-tabs .service-tab { flex: 1 1 45%; text-align: center; flex-direction: column; gap: 8px; }
  .cases-grid { grid-template-columns: 1fr; }
  .why-stats { gap: 16px; }
  .backoffice-grid, .portal-grid, .concierge-grid, .smartforms-grid, .success-stories-showcase {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .portal-toasts { display: none; }
  .roi-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .hero-ctas { flex-direction: column; }
  .nav-links { display: none; }
  .nav-mobile-cta { display: inline-flex !important; }
  .hero-tabs-title { font-size: 36px; }
  .hero-tab-nav { overflow-x: auto; justify-content: flex-start; padding: 0 16px; }
  .hero-tab-btn { padding: 12px 20px; font-size: 13px; }
  .hero-tab-panel { grid-template-columns: 1fr; gap: 24px; padding: 24px; }
  .stat-banner .container { flex-direction: column; gap: 8px; }
  .section-title { font-size: 32px; }
}

/* ===== MOBILE ===== */
@media (max-width: 600px) {
  .container { padding: 0 16px; }

  /* Nav */
  nav { padding: 14px 0; }
  .nav-logo { font-size: 18px; gap: 8px; }
  .nav-logo svg { width: 28px; height: 28px; }

  /* Hero */
  .hero-fullwidth { min-height: 80vh; }
  .hero-tabs-section { padding: 140px 0 60px; }
  .hero-tabs-title { font-size: 28px; }
  .hero-tabs-sub { font-size: 15px; }
  .hero-tabs-ctas { flex-direction: column; align-items: center; gap: 10px; }
  .hero-tabs-ctas a { width: 100%; justify-content: center; }
  .hero-main-title { font-size: 32px; letter-spacing: 0; }
  .hero-centered-sub { font-size: 15px; }
  .hero-centered-ctas { flex-direction: column; gap: 10px; }
  .hero-centered-ctas .btn-primary,
  .hero-centered-ctas .btn-secondary { width: 100%; justify-content: center; }
  .hero-dna-bg { opacity: 0.5; }
  .hero-badge { font-size: 11px; padding: 4px 12px 4px 6px; }
  .hero-sub { font-size: 15px; line-height: 1.6; }
  .hero-ctas { gap: 10px; }
  .hero-ctas .btn-primary,
  .hero-ctas .btn-secondary { width: 100%; justify-content: center; padding: 14px 20px; font-size: 14px; }

  /* CRM Builder mockup */
  .hero-split-right { display: none; }
  .crm-builder { display: none; }
  .activity-toast { display: none; }
  .brand-tag { display: none; }

  /* Stat banner */
  .stat-banner { padding: 40px 0; }
  .stat-banner-number { font-size: 36px; }
  .stat-banner-text { font-size: 16px; }

  /* Sections */
  .problem, .product, .funnel { padding: 60px 0; }
  .cases-section { padding: 60px 0; }
  .service-layout { grid-template-columns: 1fr; }
  .service-tabs { flex-direction: column; }
  .service-tabs .service-tab { flex: none; padding: 14px 16px; }
  .service-tab h3 { font-size: 13px; }
  .service-detail p { font-size: 14px; }
  .why-stat { min-width: 120px; padding: 16px 20px; }
  .why-stat-value { font-size: 20px; }
  .case-card { padding: 24px; }
  .case-quote { font-size: 14px; }
  .case-metric-value { font-size: 16px; }
  .backoffice-section, .portal-section, .concierge-section, .smartforms-section { padding: 60px 0; }
  .section-label { font-size: 11px; letter-spacing: 1.5px; }
  .section-title { font-size: 26px; letter-spacing: 0; line-height: 1.2; }
  .section-sub { font-size: 14px; margin-bottom: 32px; }

  /* Pain cards */
  .pain-card { padding: 24px; }
  .pain-card h3 { font-size: 16px; }
  .pain-card p { font-size: 13px; }

  /* Back office section */
  .backoffice-grid, .portal-grid, .concierge-grid, .smartforms-grid { gap: 28px; }
  .backoffice-mockup { overflow-x: auto; }
  .bo-sidebar { min-width: 320px; }
  .backoffice-feature h4 { font-size: 13px; }
  .backoffice-feature p { font-size: 11px; }

  /* Portal mockup */
  .portal-mockup { overflow: hidden; }
  .portal-chat-msg { max-width: 95%; font-size: 11px; }
  .portal-kb-uploads { flex-wrap: wrap; }

  /* Travel Concierge mockup */
  .concierge-mockup { overflow-x: auto; }
  .tc-info-cards { grid-template-columns: 1fr; }
  .tc-admin-stats { grid-template-columns: 1fr 1fr; }
  .tc-admin-row { flex-wrap: wrap; gap: 4px; }

  /* Smart Forms mockup */
  .smartforms-mockup { overflow: hidden; }
  .sf-embed-code { font-size: 9px; }

  /* Success stories */
  .success-stories-showcase { gap: 28px; }
  .ss-actions { flex-direction: column; gap: 6px; }
  .ss-queue { flex-direction: column; gap: 6px; }

  /* ROI */
  .roi { padding: 60px 0; }
  .roi-calculator { padding: 24px; }
  .roi-result-value { font-size: 28px; }
  .roi-metric { padding: 16px; }
  .roi-slider { width: 100px; }

  /* Funnel cards */
  .funnel-card { padding: 24px; }
  .funnel-card h3 { font-size: 16px; }

  /* Steps */
  .how { padding: 60px 0; }
  .step { padding: 28px 20px; }
  .step h3 { font-size: 17px; }

  /* Integrations */
  .int-logos { gap: 10px; }
  .int-logo { width: 80px; height: 64px; font-size: 9px; }

  /* CTA */
  .cta-section { padding: 60px 0; }
  .cta-box { padding: 40px 20px; border-radius: 16px; }
  .cta-box h2 { font-size: 26px; letter-spacing: 0; }
  .cta-box p { font-size: 14px; }
  .cta-box .btn-primary { font-size: 14px; padding: 14px 28px; }

  /* Footer */
  footer .container { flex-direction: column; gap: 16px; text-align: center; }
  .footer-links { justify-content: center; }
}
      `}</style>

      <SiteNav />

      {/* HERO - Tabbed product preview */}
      <section className="hero-tabs-section">
        {/* Flowing DNA background */}
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
              return <line key={i} x1={x} y1="300" x2={x} y2="450" stroke="rgba(94, 196, 227, 0.06)" strokeWidth="2" className="dna-rung-line" style={{animationDelay: `${i * 0.2}s`}}/>;
            })}
            {Array.from({length: 12}, (_, i) => {
              const x = 80 + i * 100;
              return (
                <g key={i}>
                  <circle cx={x} cy={350 + Math.sin(i * 0.8) * 60} r="4" fill="rgba(55, 48, 163, 0.15)" className="dna-bg-node" style={{animationDelay: `${i * 0.15}s`}}/>
                  <circle cx={x + 30} cy={400 - Math.sin(i * 0.8) * 60} r="3" fill="rgba(94, 196, 227, 0.12)" className="dna-bg-node" style={{animationDelay: `${i * 0.15 + 0.5}s`}}/>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="hero-tabs-text">
          <div className="hero-tabs-kicker">Built for regenerative medicine</div>
          <h1 className="hero-tabs-title">Everything your clinic needs to <span className="hl">capture</span><span className="hl">,</span> <span className="hl">keep</span><span className="hl">,</span> and <span className="hl">grow</span> patients.</h1>
          <p className="hero-tabs-sub">Custom digital infrastructure for stem cell and regenerative medicine clinics. Intake forms, patient portals, travel coordination, and automated follow-up. Live in weeks, not months.</p>
          <div className="hero-tabs-ctas">
            <a href="https://calendar.app.google/YvNVdxRdiXVhjXQDA" target="_blank" rel="noopener noreferrer" className="hero-cta-primary">Book a discovery call</a>
            <a href="/features" className="hero-cta-secondary">Explore features</a>
          </div>
        </div>

        <div className="hero-tabs-container">
          <div className="hero-tab-nav">
            <button className={`hero-tab-btn ${heroTab === 0 ? "active" : ""}`} onClick={() => setHeroTab(0)}>Lead capture &amp; conversion</button>
            <button className={`hero-tab-btn ${heroTab === 1 ? "active" : ""}`} onClick={() => setHeroTab(1)}>Patient experience</button>
            <button className={`hero-tab-btn ${heroTab === 2 ? "active" : ""}`} onClick={() => setHeroTab(2)}>Travel concierge</button>
          </div>

          {/* Tab 1: Lead Capture */}
          {heroTab === 0 && (
            <div className="hero-tab-panel" key="tab0">
              <div className="ht-form-mockup">
                <div className="ht-form-header">
                  <div className="ht-form-dots"><span></span><span></span><span></span></div>
                  Smart Intake Form
                </div>
                <div className="ht-form-body">
                  <div className="ht-form-title">Start your journey</div>
                  <div className="ht-form-sub">Tell us about yourself to get started</div>
                  <div className="ht-form-badge">&#10003; Lead captured at step 1</div>
                  <div className="ht-field">
                    <div className="ht-field-label">Full Name</div>
                    <div className="ht-field-input filled">Sarah Mitchell</div>
                  </div>
                  <div className="ht-field">
                    <div className="ht-field-label">Email</div>
                    <div className="ht-field-input filled">sarah@email.com</div>
                  </div>
                  <div className="ht-field">
                    <div className="ht-field-label">Condition of interest</div>
                    <div className="ht-field-input">Select a condition...</div>
                  </div>
                  <div className="ht-steps">
                    <div className="ht-step done"></div>
                    <div className="ht-step active"></div>
                    <div className="ht-step"></div>
                    <div className="ht-step"></div>
                  </div>
                  <div className="ht-step-labels">
                    <span>Contact Info</span><span>Condition</span><span>History</span><span>Schedule</span>
                  </div>
                  <div className="ht-continue-btn">Continue</div>
                  <div className="ht-embed">
                    <div className="ht-embed-label">Embed on your website</div>
                    <div className="ht-embed-code">&lt;script src=&quot;clinictech.io/forms/your-clinic&quot;&gt;&lt;/script&gt;</div>
                  </div>
                </div>
              </div>
              <div className="ht-lead-cards">
                <div className="ht-lead-card">
                  <div className="ht-lead-badge hot">Hot lead</div>
                  <div className="ht-lead-name">Sarah M. - Knee stem cell</div>
                  <div className="ht-lead-desc">Completed form 2 min ago. Auto follow-up sent.</div>
                </div>
                <div className="ht-lead-card">
                  <div className="ht-lead-badge warm">Warm lead</div>
                  <div className="ht-lead-name">Michael T. - PRP inquiry</div>
                  <div className="ht-lead-desc">Abandoned at step 2. Entered 30-day nurture sequence.</div>
                </div>
                <div className="ht-lead-card">
                  <div className="ht-lead-badge cold">Cold lead</div>
                  <div className="ht-lead-name">Jennifer K. - General inquiry</div>
                  <div className="ht-lead-desc">Email captured. Entered 90-day drip.</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Patient Experience */}
          {heroTab === 1 && (
            <div className="hero-tab-panel" key="tab1">
              <div className="ht-portal">
                <div className="ht-portal-nav">
                  <span>Your Clinic Portal</span>
                  <div className="ht-portal-links"><span>Treatment</span><span>Documents</span><span>Messages</span></div>
                </div>
                <div className="ht-portal-body">
                  <div className="ht-portal-welcome">Welcome back, Sarah</div>
                  <div className="ht-portal-sub">Stem Cell Therapy - Knee - Day 14 of recovery</div>
                  <div className="ht-portal-cards">
                    <div className="ht-portal-card">
                      <div className="ht-portal-card-label">Treatment</div>
                      <div className="ht-portal-card-value">Stem Cell - Knee</div>
                      <div className="ht-portal-card-sub">Apr 1, 2026 - Dr. Rivera</div>
                    </div>
                    <div className="ht-portal-card">
                      <div className="ht-portal-card-label">Recovery Protocol</div>
                      <div className="ht-portal-card-value">Week 2: Light walking</div>
                      <div className="ht-portal-card-sub">Ice 2x daily, no heavy lifting</div>
                    </div>
                    <div className="ht-portal-card">
                      <div className="ht-portal-card-label">Next Appointment</div>
                      <div className="ht-portal-card-value">Apr 22 - Follow-up</div>
                      <div className="ht-portal-card-sub">Dr. Rivera - 10:00 AM</div>
                    </div>
                    <div className="ht-portal-card">
                      <div className="ht-portal-card-label">Messages</div>
                      <div className="ht-portal-card-value" style={{color:"#5EC4E3"}}>1 new message</div>
                      <div className="ht-portal-card-sub">From your care team</div>
                    </div>
                  </div>
                  <div className="ht-portal-progress">
                    <div className="ht-portal-progress-label">Track your progress - Pain level</div>
                    <div className="ht-portal-progress-bar"><div className="ht-portal-progress-fill"></div></div>
                    <div className="ht-portal-progress-text">Pain: 7/10 → 3/10 (improving)</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="ht-timeline-title">12-month patient lifecycle</div>
                <div className="ht-timeline">
                  <div className="ht-timeline-item">
                    <div className="ht-timeline-dot-col"><div className="ht-timeline-dot filled"></div><div className="ht-timeline-line"></div></div>
                    <div className="ht-timeline-content"><div className="ht-timeline-time">Week 1</div><div className="ht-timeline-label">Post-treatment check-in</div><div className="ht-timeline-desc">How are you feeling? Any questions?</div></div>
                  </div>
                  <div className="ht-timeline-item">
                    <div className="ht-timeline-dot-col"><div className="ht-timeline-dot filled"></div><div className="ht-timeline-line"></div></div>
                    <div className="ht-timeline-content"><div className="ht-timeline-time">Week 4</div><div className="ht-timeline-label">Progress check + education</div><div className="ht-timeline-desc">Recovery milestone content</div></div>
                  </div>
                  <div className="ht-timeline-item">
                    <div className="ht-timeline-dot-col"><div className="ht-timeline-dot"></div><div className="ht-timeline-line"></div></div>
                    <div className="ht-timeline-content"><div className="ht-timeline-time">Month 3</div><div className="ht-timeline-label">Testimonial request</div><div className="ht-timeline-desc">Capture their story at peak satisfaction</div></div>
                  </div>
                  <div className="ht-timeline-item">
                    <div className="ht-timeline-dot-col"><div className="ht-timeline-dot"></div><div className="ht-timeline-line"></div></div>
                    <div className="ht-timeline-content"><div className="ht-timeline-time">Month 6</div><div className="ht-timeline-label">Referral program invite</div><div className="ht-timeline-desc">Turn happy patients into referral sources</div></div>
                  </div>
                  <div className="ht-timeline-item">
                    <div className="ht-timeline-dot-col"><div className="ht-timeline-dot"></div></div>
                    <div className="ht-timeline-content"><div className="ht-timeline-time">Month 12</div><div className="ht-timeline-label">Annual check-in + reengagement</div><div className="ht-timeline-desc">New treatments, wellness check, follow-up</div></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Travel Concierge */}
          {heroTab === 2 && (
            <div className="hero-tab-panel" key="tab2">
              <div className="ht-travel-portal">
                <div className="ht-travel-header">Patient Travel Portal</div>
                <div className="ht-travel-body">
                  <div className="ht-travel-title">Your trip to Puerto Vallarta</div>
                  <div className="ht-travel-countdown">&#9200; 5 days until treatment</div>
                  <div className="ht-travel-checklist">
                    <div>
                      <div className="ht-travel-check">
                        <div className="ht-travel-check-dot done">&#10003;</div>
                        <span className="ht-travel-check-text">Flight confirmed</span>
                      </div>
                      <div className="ht-travel-check-sub">AA 1247 - Apr 15, 9:30am</div>
                    </div>
                    <div>
                      <div className="ht-travel-check">
                        <div className="ht-travel-check-dot done">&#10003;</div>
                        <span className="ht-travel-check-text">Hotel booked</span>
                      </div>
                      <div className="ht-travel-check-sub">Grand Resort - 2 nights</div>
                    </div>
                    <div>
                      <div className="ht-travel-check">
                        <div className="ht-travel-check-dot done">&#10003;</div>
                        <span className="ht-travel-check-text">Airport pickup scheduled</span>
                      </div>
                      <div className="ht-travel-check-sub">Driver: Carlos M. - Confirmed</div>
                    </div>
                    <div>
                      <div className="ht-travel-check">
                        <div className="ht-travel-check-dot pending">&#8226;</div>
                        <span className="ht-travel-check-text">Pre-arrival form</span>
                      </div>
                      <div className="ht-travel-check-sub">Complete before Apr 12</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ht-admin">
                <div className="ht-admin-header">Admin Dashboard - Upcoming Arrivals</div>
                <div className="ht-admin-body">
                  <div className="ht-admin-title">This week</div>
                  <div className="ht-admin-row">
                    <span className="ht-admin-name">Sarah M.</span>
                    <span className="ht-admin-date">Apr 15</span>
                    <span className="ht-admin-status confirmed">Confirmed</span>
                  </div>
                  <div className="ht-admin-row">
                    <span className="ht-admin-name">James K.</span>
                    <span className="ht-admin-date">Apr 16</span>
                    <span className="ht-admin-status pending">Pending docs</span>
                  </div>
                  <div className="ht-admin-row">
                    <span className="ht-admin-name">Maria L.</span>
                    <span className="ht-admin-date">Apr 17</span>
                    <span className="ht-admin-status transit">In transit</span>
                  </div>
                  <div className="ht-admin-coord">
                    <div className="ht-admin-coord-dot"></div>
                    Coordinator: Ana R. - 3 patients assigned this week
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="problem" id="services" style={{paddingBottom: "120px"}}>
        <div className="container">
          <div className="section-label">What We Do</div>
          <h2 className="section-title">Custom builds for every part of your <span className="hl">patient journey.</span></h2>
          <p className="section-sub">Every clinic is different. We start by understanding your patient flow, your team, and where the biggest gaps are. Then we build exactly what you need.</p>
          <div className="service-layout">
          <div className="service-tabs">
            {features.map((f, i) => (
              <button key={i} className={`service-tab ${activeFeature === i ? 'active' : ''}`} onClick={() => handleFeatureClick(i)}>
                <div className="service-tab-icon">{f.icon}</div>
                <h3>{f.title}</h3>
              </button>
            ))}
          </div>
          <div className="service-right">
          <div className="service-mockup-wrap">
            {activeFeature === 0 && (
              <div className="smartforms-mockup">
                <div className="sf-toolbar">
                  <div className="sf-toolbar-dots"><span></span><span></span><span></span></div>
                  Smart Intake Form
                </div>
                <div className="sf-body">
                  <div className="sf-form-title">Start Your Journey</div>
                  <div className="sf-form-sub">Tell us about yourself to get started</div>
                  <div className="sf-lead-badge">{"✅"} Lead captured after this step</div>
                  <div className="sf-field">
                    <div className="sf-field-label">Full Name</div>
                    <div className="sf-field-input sf-field-highlight">Sarah Mitchell</div>
                  </div>
                  <div className="sf-field">
                    <div className="sf-field-label">Email</div>
                    <div className="sf-field-input sf-field-highlight">sarah@email.com</div>
                  </div>
                  <div className="sf-progress">
                    <div className="sf-progress-step completed"></div>
                    <div className="sf-progress-step active"></div>
                    <div className="sf-progress-step"></div>
                    <div className="sf-progress-step"></div>
                  </div>
                  <div className="sf-progress-labels">
                    <span>Contact Info</span>
                    <span>Condition</span>
                    <span>History</span>
                    <span>Schedule</span>
                  </div>
                  <div className="sf-embed">
                    <div className="sf-embed-label">{"</>"} Embed on your website</div>
                    <div className="sf-embed-code">&lt;script src=&quot;clinictech.io/forms/your-clinic&quot;&gt;&lt;/script&gt;</div>
                  </div>
                </div>
              </div>
            )}
            {activeFeature === 1 && (
              <div className="backoffice-mockup">
                <div className="bo-toolbar">
                  <div className="bo-toolbar-dots"><span></span><span></span><span></span></div>
                  Your Clinic - Automations
                </div>
                <div className="bo-sidebar">
                  <div className="bo-nav">
                    <div className="bo-nav-item active">{"⚡"}</div>
                    <div className="bo-nav-item">{"👥"}</div>
                    <div className="bo-nav-item">{"📊"}</div>
                    <div className="bo-nav-item">{"📝"}</div>
                    <div className="bo-nav-item">{"⚙️"}</div>
                  </div>
                  <div className="bo-main">
                    <div className="bo-main-header">
                      <div className="bo-main-title">Automations</div>
                      <div className="bo-main-tabs">
                        <div className="bo-main-tab active">Active</div>
                        <div className="bo-main-tab">Drafts</div>
                        <div className="bo-main-tab">All</div>
                      </div>
                    </div>
                    <div className="bo-automation-grid">
                      <div className="bo-auto-card">
                        <div className="bo-auto-header">
                          <span className="bo-auto-icon">{"📧"}</span>
                          <span className="bo-auto-status active">Active</span>
                        </div>
                        <div className="bo-auto-name">Lead Follow-Up</div>
                        <div className="bo-auto-desc">Email + SMS within 5 min of form submission</div>
                        <div className="bo-auto-stat">{"\u2191"} 47 leads contacted this week</div>
                      </div>
                      <div className="bo-auto-card">
                        <div className="bo-auto-header">
                          <span className="bo-auto-icon">{"📝"}</span>
                          <span className="bo-auto-status active">Active</span>
                        </div>
                        <div className="bo-auto-name">Weekly Blog Post</div>
                        <div className="bo-auto-desc">AI-generated from your knowledge base</div>
                        <div className="bo-auto-stat">{"\u2191"} 12 posts published</div>
                      </div>
                      <div className="bo-auto-card">
                        <div className="bo-auto-header">
                          <span className="bo-auto-icon">{"⭐"}</span>
                          <span className="bo-auto-status active">Active</span>
                        </div>
                        <div className="bo-auto-name">Review Requests</div>
                        <div className="bo-auto-desc">Auto-sent 7 days post-treatment</div>
                        <div className="bo-auto-stat">{"\u2191"} 23 reviews collected</div>
                      </div>
                      <div className="bo-auto-card">
                        <div className="bo-auto-header">
                          <span className="bo-auto-icon">{"🔄"}</span>
                          <span className="bo-auto-status draft">Draft</span>
                        </div>
                        <div className="bo-auto-name">Patient Reactivation</div>
                        <div className="bo-auto-desc">Re-engage patients inactive 90 days</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeFeature === 2 && (
              <div className="portal-mockup">
                <div className="portal-mockup-nav">
                  <div className="portal-mockup-logo">
                    <div className="logo-dot">Y</div>
                    Your Clinic Portal
                  </div>
                  <div className="portal-mockup-nav-links">
                    <span>Treatments</span>
                    <span>FAQ</span>
                    <span>Book</span>
                  </div>
                </div>
                <div className="portal-mockup-body">
                  <div className="portal-welcome">
                    <h3>How can we help you?</h3>
                    <p>Ask anything about our treatments, recovery, or booking</p>
                  </div>
                  <div className="portal-search">
                    <span className="portal-search-icon">{"🔍"}</span>
                    <span className="portal-search-text">Search treatments, FAQs, recovery info...</span>
                  </div>
                  <div className="portal-chat">
                    <div className="portal-chat-msg user">
                      What should I expect after PRP treatment for my knee?
                    </div>
                    <div className="portal-chat-msg ai">
                      <div className="ai-badge">{"✨"} AI-Powered Answer</div>
                      PRP recovery for knee treatment typically involves 1-2 days of rest, with most patients returning to light activity within a week. Full benefits develop over 4-6 weeks.
                      <div className="sources">
                        Sources: <span>PRP Recovery Guide</span> &middot; <span>Post-Treatment FAQ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeFeature === 3 && (
              <div className="concierge-mockup">
                <div className="tc-toolbar">
                  <div className="tc-toolbar-dots"><span></span><span></span><span></span></div>
                  Travel Concierge
                </div>
                <div style={{padding: "12px 16px 0"}}>
                  <div className="concierge-toggle">
                    <button className={`concierge-toggle-btn ${travelView === 'patient' ? 'active' : ''}`} onClick={() => setTravelView('patient')}>Patient View</button>
                    <button className={`concierge-toggle-btn ${travelView === 'admin' ? 'active' : ''}`} onClick={() => setTravelView('admin')}>Admin View</button>
                  </div>
                </div>
                {travelView === 'patient' ? (
                  <div className="tc-patient-body">
                    <div className="tc-patient-header">
                      <div className="tc-patient-avatar">{"👤"}</div>
                      <div>
                        <div className="tc-patient-greeting">Welcome, Sarah</div>
                        <div style={{fontSize: "10px", color: "var(--text-muted)"}}>Your trip to Stem Cell Clinic MX</div>
                      </div>
                    </div>
                    <div className="tc-info-cards">
                      <div className="tc-info-card">
                        <div className="tc-info-card-icon">{"✈️"}</div>
                        <div className="tc-info-card-label">Flight</div>
                        <div className="tc-info-card-value">AA 1247 &middot; Apr 15, 9:30am</div>
                      </div>
                      <div className="tc-info-card">
                        <div className="tc-info-card-icon">{"🚗"}</div>
                        <div className="tc-info-card-label">Airport Pickup</div>
                        <div className="tc-info-card-value">Confirmed &middot; Driver: Carlos M.</div>
                      </div>
                      <div className="tc-info-card">
                        <div className="tc-info-card-icon">{"🏨"}</div>
                        <div className="tc-info-card-label">Hotel</div>
                        <div className="tc-info-card-value">Grand Resort &middot; 2 nights</div>
                      </div>
                      <div className="tc-info-card">
                        <div className="tc-info-card-icon">{"🏥"}</div>
                        <div className="tc-info-card-label">Appointment</div>
                        <div className="tc-info-card-value">Apr 16, 10:00am &middot; Dr. Rivera</div>
                      </div>
                    </div>
                    <div className="tc-timeline">
                      <div style={{fontSize: "11px", fontWeight: 700, marginBottom: "4px"}}>Your Timeline</div>
                      <div className="tc-timeline-item">
                        <div className="tc-timeline-dot completed"></div>
                        <span style={{color: "var(--green)", fontWeight: 600}}>Pre-arrival forms completed</span>
                      </div>
                      <div className="tc-timeline-item">
                        <div className="tc-timeline-dot completed"></div>
                        <span style={{color: "var(--green)", fontWeight: 600}}>Flight booked</span>
                      </div>
                      <div className="tc-timeline-item">
                        <div className="tc-timeline-dot"></div>
                        <span>Airport pickup &middot; Apr 15</span>
                      </div>
                      <div className="tc-timeline-item">
                        <div className="tc-timeline-dot upcoming"></div>
                        <span>Treatment day &middot; Apr 16</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="tc-admin-body">
                    <div className="tc-admin-stats">
                      <div className="tc-admin-stat">
                        <div className="tc-admin-stat-value">12</div>
                        <div className="tc-admin-stat-label">Arriving this week</div>
                      </div>
                      <div className="tc-admin-stat">
                        <div className="tc-admin-stat-value">5</div>
                        <div className="tc-admin-stat-label">In treatment</div>
                      </div>
                      <div className="tc-admin-stat">
                        <div className="tc-admin-stat-value">3</div>
                        <div className="tc-admin-stat-label">Departing</div>
                      </div>
                    </div>
                    <div style={{fontSize: "12px", fontWeight: 700, marginBottom: "8px"}}>Patient Travel Status</div>
                    <div className="tc-admin-table">
                      <div className="tc-admin-row" style={{fontSize: "9px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px"}}>
                        <span>Patient</span><span>Flight</span><span>Transport</span><span>Status</span>
                      </div>
                      <div className="tc-admin-row">
                        <span className="tc-admin-name">Sarah M.</span>
                        <span>AA 1247</span>
                        <span>{"🚗"} Confirmed</span>
                        <span className="tc-admin-status arriving">Arriving</span>
                      </div>
                      <div className="tc-admin-row">
                        <span className="tc-admin-name">James K.</span>
                        <span>UA 892</span>
                        <span>{"🚗"} Confirmed</span>
                        <span className="tc-admin-status in-treatment">In Treatment</span>
                      </div>
                      <div className="tc-admin-row">
                        <span className="tc-admin-name">Maria L.</span>
                        <span>DL 445</span>
                        <span>{"🚗"} Scheduled</span>
                        <span className="tc-admin-status departing">Departing</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="service-detail">
            <p>{features[activeFeature].desc}</p>
          </div>
          </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="stat-banner">
        <div className="container" style={{flexDirection: "column", gap: "32px"}}>
          <div style={{textAlign: "center"}}>
            <div className="section-label" style={{textAlign: "center"}}>Why Us</div>
            <h2 className="section-title" style={{textAlign: "center", marginLeft: "auto", marginRight: "auto"}}>We only work with <span className="hl">stem cell and regenerative medicine</span> clinics.</h2>
            <p className="section-sub" style={{textAlign: "center", marginLeft: "auto", marginRight: "auto", marginBottom: "0"}}>We&apos;re not a generic agency. We&apos;ve audited dozens of clinic websites in this space. We understand the patient journey from &ldquo;I just discovered stem cell therapy&rdquo; to &ldquo;I&apos;m booking my flight.&rdquo;</p>
          </div>
          <div className="why-stats">
            <div className="why-stat">
              <div className="why-stat-value">100%</div>
              <div className="why-stat-label">Regen Med Focus</div>
            </div>
            <div className="why-stat">
              <div className="why-stat-value">US/CA/MX</div>
              <div className="why-stat-label">Clinics Served</div>
            </div>
            <div className="why-stat">
              <div className="why-stat-value">EN/ES</div>
              <div className="why-stat-label">Bilingual Team</div>
            </div>
            <div className="why-stat">
              <div className="why-stat-value">Weeks</div>
              <div className="why-stat-label">Not Months to Launch</div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="roi" id="roi">
        <div className="container">
          <div className="section-label">The ROI</div>
          <h2 className="section-title">The math is simple. The <span className="hl">impact</span> is not.</h2>
          <p className="section-sub">Average stem cell procedure: $5,000 to $25,000. How many lost leads can you afford per month?</p>
          <div className="roi-grid">
            <div className="roi-calculator">
              <div className="roi-calc-title">Revenue Recovery Calculator <span>Interactive</span></div>
              <div className="roi-row">
                <div className="roi-label">Your monthly leads</div>
                <div className="roi-input-wrap">
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={leads}
                    className="roi-slider"
                    onChange={(e) => {
                      setLeads(parseInt(e.target.value));
                      animateTotal();
                    }}
                  />
                  <div className="roi-input-value">{leads}</div>
                </div>
              </div>
              <div className="roi-row">
                <div className="roi-label">Your avg procedure value</div>
                <div className="roi-input-wrap">
                  <input
                    type="range"
                    min="2000"
                    max="50000"
                    value={procedureValue}
                    step="1000"
                    className="roi-slider"
                    onChange={(e) => {
                      setProcedureValue(parseInt(e.target.value));
                      animateTotal();
                    }}
                  />
                  <div className="roi-input-value">${procedureValue.toLocaleString()}</div>
                </div>
              </div>
              <div className="roi-row">
                <div className="roi-label">Leads lost to slow follow-up</div>
                <div className="roi-value" style={{color:"var(--red)"}}>~60%</div>
              </div>
              <div className="roi-row">
                <div className="roi-label">Leads recovered with ClinicTech</div>
                <div className="roi-value" style={{color:"var(--green)"}}>+{recovered}/mo</div>
              </div>
              <div className="roi-result">
                <div className="roi-result-label">Additional Annual Revenue</div>
                <div className="roi-result-value" ref={totalRef}>${annual.toLocaleString()}+</div>
                <div className="roi-result-sub">from leads you&apos;re already getting</div>
              </div>
            </div>
            <div className="roi-metrics">
              <div className="roi-metric">
                <div className="roi-metric-icon">{"⚡"}</div>
                <div>
                  <h4>3-5x more consultations booked</h4>
                  <p>Automated follow-up within minutes, not hours. Clinics using instant response see dramatically higher booking rates from the same lead volume.</p>
                </div>
              </div>
              <div className="roi-metric">
                <div className="roi-metric-icon">{"🔁"}</div>
                <div>
                  <h4>40% increase in patient reactivation</h4>
                  <p>Automated reengagement brings past patients back for additional treatments, referrals, and follow-up procedures they didn&apos;t know you offered.</p>
                </div>
              </div>
              <div className="roi-metric">
                <div className="roi-metric-icon">{"⏰"}</div>
                <div>
                  <h4>15+ hours/week saved on admin</h4>
                  <p>Stop copy-pasting between tools. Your back office runs itself so you can focus on patients, not spreadsheets.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how" id="how">
        <div className="container">
          <div className="section-label" style={{textAlign:"center"}}>How It Works</div>
          <h2 className="section-title" style={{textAlign:"center",marginLeft:"auto",marginRight:"auto"}}>Live in <span className="hl">weeks.</span> Not months.</h2>
          <p className="section-sub" style={{textAlign:"center",marginLeft:"auto",marginRight:"auto"}}>No six-month implementation. No bloated SOWs. Three steps and your custom systems are running.</p>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Discovery call</h3>
              <p>We learn your patient flow, your team, and where leads are falling off. 15 minutes, no pitch. If there&apos;s a fit, we scope a proposal within days.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>We build it</h3>
              <p>Custom to your clinic. Your brand, your workflow, your integrations. We handle everything from design to deployment. Most projects go live in 2-4 weeks.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>You grow</h3>
              <p>Leads get captured and followed up automatically. Patients engage through your portal. Your team spends time on care, not admin. We optimize as you scale.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="cases-section" id="results">
        <div className="container">
          <div className="section-label" style={{textAlign: "center"}}>Results</div>
          <h2 className="section-title" style={{textAlign: "center", marginLeft: "auto", marginRight: "auto"}}>What happens when clinics <span className="hl">work with us.</span></h2>
          <p className="section-sub" style={{textAlign: "center", marginLeft: "auto", marginRight: "auto"}}>From single-location practices to networks with 50+ clinics.</p>
          <div className="cases-grid">
            <div className="case-card">
              <div className="case-type">Single Location &middot; Mexico</div>
              <div className="case-quote">&ldquo;We were getting leads but barely converting. ClinicTech rebuilt our intake flow and added automated follow-ups. In the first month, we went from booking 11 consultations to 34.&rdquo;</div>
              <div className="case-problem"><strong>Problem:</strong> Generic contact form going to an inbox. No qualification, no routing, no follow-up. Leads sat for 24-48 hours before anyone responded.</div>
              <div className="case-built"><strong>What we built:</strong> Smart intake form, auto-scheduling, condition-based email sequences.</div>
              <div className="case-metrics-row">
                <div className="case-metric">
                  <div className="case-metric-value">2.1% → 7.2%</div>
                  <div className="case-metric-label">Conversion rate</div>
                </div>
                <div className="case-metric">
                  <div className="case-metric-value">+$138k</div>
                  <div className="case-metric-label">Revenue/mo</div>
                </div>
              </div>
            </div>
            <div className="case-card">
              <div className="case-type">3 Locations &middot; Mexico</div>
              <div className="case-quote">&ldquo;70% of our patients fly in from the US and Canada. Our team was spending 25 hours a week on travel logistics. ClinicTech built us a concierge portal that patients actually love using.&rdquo;</div>
              <div className="case-problem"><strong>Problem:</strong> Travel logistics handled through email chains and WhatsApp. Patients constantly asking about hotels, pickup times, and what to bring.</div>
              <div className="case-built"><strong>What we built:</strong> Patient travel portal, admin dashboard, automated pre-arrival sequences.</div>
              <div className="case-metrics-row">
                <div className="case-metric">
                  <div className="case-metric-value">22 hrs/wk</div>
                  <div className="case-metric-label">Coordinator time saved</div>
                </div>
                <div className="case-metric">
                  <div className="case-metric-value">+34%</div>
                  <div className="case-metric-label">Patient satisfaction</div>
                </div>
              </div>
            </div>
            <div className="case-card">
              <div className="case-type">50+ Locations &middot; North America</div>
              <div className="case-quote">&ldquo;We needed a system that could route patients to the right clinic based on location, condition, and availability. ClinicTech built a centralized intake that serves all our locations from one flow.&rdquo;</div>
              <div className="case-problem"><strong>Problem:</strong> Each location ran its own website and forms. No centralized view of the patient pipeline. Thousands of warm leads sitting dormant.</div>
              <div className="case-built"><strong>What we built:</strong> Centralized intake with multi-location routing, patient CRM, automated reengagement campaigns.</div>
              <div className="case-metrics-row">
                <div className="case-metric">
                  <div className="case-metric-value">94%</div>
                  <div className="case-metric-label">Lead routing accuracy</div>
                </div>
                <div className="case-metric">
                  <div className="case-metric-value">+$2.1M</div>
                  <div className="case-metric-label">Revenue across network</div>
                </div>
              </div>
            </div>
            <div className="case-card">
              <div className="case-type">Single Location &middot; US → Mexico</div>
              <div className="case-quote">&ldquo;Our site looked outdated and our intake was a basic form. ClinicTech redesigned everything and built a back office that replaced our spreadsheets. My team finally has one place to manage patients.&rdquo;</div>
              <div className="case-problem"><strong>Problem:</strong> Patient records split across a spreadsheet, GoHighLevel, and email. No one had a complete view of who needed follow-up.</div>
              <div className="case-built"><strong>What we built:</strong> Website redesign, custom patient CRM, automated follow-up workflows.</div>
              <div className="case-metrics-row">
                <div className="case-metric">
                  <div className="case-metric-value">18 hrs/wk</div>
                  <div className="case-metric-label">Admin hours saved</div>
                </div>
                <div className="case-metric">
                  <div className="case-metric-value">+28%</div>
                  <div className="case-metric-label">Returning patients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ABOUT US */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="about-inner">
            <div className="about-photo">
              <img src="/founders.png" alt="Delaney and Danika, co-founders of ClinicTech" />
            </div>
            <div className="about-text">
              <div className="about-label">Built by Delaney and Danika</div>
              <h2><span className="hl-gradient">Operators</span> building<br/>for operators.</h2>
              <p>We&apos;re operators who&apos;ve spent the last two years building AI products from the ground up. We started in recruiting tech, learned what works (and what doesn&apos;t), and followed the signal to where AI can make the biggest impact: underserved verticals with real operational pain.</p>
              <p><strong>Delaney</strong> leads product and engineering, building full-stack applications with the latest AI tooling. <strong>Danika</strong> drives go-to-market strategy, bringing operational experience from Shopify and Rewind to help teams actually adopt and get value from what we build.</p>
              <p>We&apos;re AI-first in everything we do. We build with the latest models, ship with modern dev tooling, and move at a pace that traditional agencies and legacy software companies can&apos;t match. The result is better software, faster, at a fraction of the cost.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-section" id="demo">
        <div className="container">
          <div className="cta-box">
            <h2>Let&apos;s talk about your<br/>clinic goals.</h2>
            <p>15-minute discovery call. We&apos;ll learn about your patient flow, where leads are falling off, and what&apos;s eating up your team&apos;s time. If there&apos;s a fit, we&apos;ll scope a proposal within days.</p>
            <a href="https://calendar.app.google/YvNVdxRdiXVhjXQDA" target="_blank" rel="noopener noreferrer" className="btn-primary">{"Book a Discovery Call \u2192"}</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="footer-brand">
            <img src="/clinictech-logo.png" alt="ClinicTech" style={{height: 24, width: "auto", opacity: 0.6}} />
          </div>
          <div className="footer-links">
            <a href="/features">Features</a>
            <a href="/about">About</a>
            <a href="/blog">Blog</a>
            <a href="#">Privacy</a>
          </div>
        </div>
      </footer>
    </>
  );
}
