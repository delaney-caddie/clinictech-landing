"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function LandingPage() {
  const [leads, setLeads] = useState(40);
  const [procedureValue, setProcedureValue] = useState(12000);
  const totalRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

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
        ".pain-card, .product-card, .roi-metric, .funnel-card, .step, .price-card, .int-logo"
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
        ".pain-grid, .product-grid, .funnel-grid, .steps, .pricing-grid, .int-logos"
      )
      .forEach((grid) => {
        Array.from(grid.children).forEach((child, i) => {
          (child as HTMLElement).style.transitionDelay = `${i * 0.1}s`;
        });
      });

    return () => observer.disconnect();
  }, []);

  // Nav scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const nav = navRef.current;
      if (!nav) return;
      if (window.scrollY > 50) {
        nav.style.padding = "12px 0";
        nav.style.borderBottomColor = "rgba(94, 196, 227, 0.15)";
      } else {
        nav.style.padding = "20px 0";
        nav.style.borderBottomColor = "rgba(94, 196, 227, 0.1)";
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

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
  font-family: var(--font-nunito), 'Nunito', sans-serif;
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
  font-family: var(--font-nunito), 'Nunito', sans-serif;
  font-weight: 800; font-size: 22px; font-style: italic; letter-spacing: 0.5px;
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
.nav-mobile-cta { display: none; }
@media (max-width: 900px) {
  .nav-mobile-cta { display: inline-flex; }
}
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 32px;
  background: var(--navy);
  color: var(--white);
  font-family: var(--font-nunito), 'Nunito', sans-serif;
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
  font-family: var(--font-nunito), 'Nunito', sans-serif;
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
.hero {
  padding: 160px 0 120px;
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute;
  top: -200px; right: -200px;
  width: 800px; height: 800px;
  background: radial-gradient(circle, rgba(55, 48, 163, 0.04) 0%, transparent 70%);
  pointer-events: none;
}
.hero::after {
  content: '';
  position: absolute;
  bottom: -100px; left: -100px;
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(55, 48, 163, 0.03) 0%, transparent 70%);
  pointer-events: none;
}
.hero .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
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
  font-family: var(--font-nunito), 'Nunito', sans-serif;
  font-size: 56px;
  font-weight: 800;
  font-style: italic;
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
  font-style: italic;
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
  font-family: var(--font-nunito), 'Nunito', sans-serif;
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
  font-family: var(--font-nunito), 'Nunito', sans-serif;
  font-size: 48px; font-weight: 700;
  color: #0E9AC0;
}
.stat-banner-text {
  font-size: 20px; color: var(--text-secondary);
  max-width: 600px;
}
.stat-banner-text strong { color: var(--text-primary); font-weight: 600; }

/* ===== PROBLEM SECTION ===== */
.problem {
  padding: 120px 0;
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
  font-family: var(--font-nunito), 'Nunito', sans-serif;
  font-size: 40px;
  font-weight: 800;
  font-style: italic;
  line-height: 1.15;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
  max-width: 700px;
}
.section-sub {
  font-size: 17px;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 600px;
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
  font-family: var(--font-nunito), 'Nunito', sans-serif;
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
  font-family: var(--font-nunito), 'Nunito', sans-serif;
  font-size: 26px; font-weight: 700; font-style: italic;
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
  font-family: var(--font-nunito), 'Nunito', sans-serif;
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
  font-family: var(--font-nunito), 'Nunito', sans-serif;
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
  font-family: var(--font-nunito), 'Nunito', sans-serif;
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
  font-size: 13px; font-style: italic; line-height: 1.6;
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
  font-family: var(--font-nunito), 'Nunito', sans-serif;
  font-size: 48px; font-weight: 700;
  color: rgba(55, 48, 163, 0.08);
  position: absolute;
  top: 16px; right: 24px;
}
.funnel-card h3 {
  font-family: var(--font-nunito), 'Nunito', sans-serif;
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
  font-family: var(--font-nunito), 'Nunito', sans-serif;
  font-size: 22px; font-weight: 700;
  color: var(--white);
  margin: 0 auto 24px;
}
.step h3 {
  font-family: var(--font-nunito), 'Nunito', sans-serif;
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
  font-family: var(--font-nunito), 'Nunito', sans-serif;
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
  font-family: var(--font-nunito), 'Nunito', sans-serif;
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
  font-family: var(--font-nunito), 'Nunito', sans-serif;
  font-size: 40px; font-weight: 800; font-style: italic;
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
  font-family: var(--font-nunito), 'Nunito', sans-serif;
  font-weight: 800; font-size: 18px; font-style: italic;
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

/* ===== BACK OFFICE SECTION ===== */
.backoffice-section {
  padding: 120px 0;
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
  font-size: 14px; font-weight: 700; font-style: italic;
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
  font-size: 18px; font-weight: 800; font-style: italic;
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

/* ===== ROI INTERACTIVE ===== */
.roi-input-wrap {
  display: flex; align-items: center; gap: 14px;
}
.roi-input-value {
  font-family: var(--font-nunito), 'Nunito', sans-serif;
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

/* ===== RESPONSIVE ===== */
/* ===== TABLET ===== */
@media (max-width: 900px) {
  .hero .container {
    grid-template-columns: 1fr;
    gap: 48px;
  }
  .hero h1 { font-size: 40px; }
  .pain-grid, .product-grid, .steps, .pricing-grid, .funnel-grid {
    grid-template-columns: 1fr;
  }
  .backoffice-grid, .portal-grid, .success-stories-showcase {
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
  .hero { padding: 120px 0 60px; }
  .hero h1 { font-size: 28px; letter-spacing: 0; line-height: 1.2; }
  .hero-badge { font-size: 11px; padding: 4px 12px 4px 6px; }
  .hero-sub { font-size: 15px; line-height: 1.6; }
  .hero-ctas { gap: 10px; }
  .hero-ctas .btn-primary,
  .hero-ctas .btn-secondary { width: 100%; justify-content: center; padding: 14px 20px; font-size: 14px; }

  /* CRM Builder mockup */
  .crm-builder { display: none; }
  .activity-toast { display: none; }
  .brand-tag { display: none; }

  /* Stat banner */
  .stat-banner { padding: 40px 0; }
  .stat-banner-number { font-size: 36px; }
  .stat-banner-text { font-size: 16px; }

  /* Sections */
  .problem, .product, .funnel { padding: 60px 0; }
  .backoffice-section, .portal-section { padding: 60px 0; }
  .section-label { font-size: 11px; letter-spacing: 1.5px; }
  .section-title { font-size: 26px; letter-spacing: 0; line-height: 1.2; }
  .section-sub { font-size: 14px; margin-bottom: 32px; }

  /* Pain cards */
  .pain-card { padding: 24px; }
  .pain-card h3 { font-size: 16px; }
  .pain-card p { font-size: 13px; }

  /* Back office section */
  .backoffice-grid, .portal-grid { gap: 28px; }
  .backoffice-mockup { overflow-x: auto; }
  .bo-sidebar { min-width: 320px; }
  .backoffice-feature h4 { font-size: 13px; }
  .backoffice-feature p { font-size: 11px; }

  /* Portal mockup */
  .portal-mockup { overflow: hidden; }
  .portal-chat-msg { max-width: 95%; font-size: 11px; }
  .portal-kb-uploads { flex-wrap: wrap; }

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

      {/* NAV */}
      <nav ref={navRef}>
        <div className="container">
          <a href="#" className="nav-logo">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="8" height="8" rx="1.5" fill="#5EC4E3"/>
              <rect x="16" y="2" width="8" height="8" rx="1.5" fill="#7DD4ED"/>
              <rect x="16" y="16" width="8" height="8" rx="1.5" fill="#5EC4E3"/>
              <rect x="26" y="10" width="8" height="8" rx="1.5" fill="#7DD4ED"/>
              <rect x="26" y="24" width="8" height="8" rx="1.5" fill="#5EC4E3"/>
              <line x1="10" y1="6" x2="16" y2="6" stroke="#7DD4ED" strokeWidth="2"/>
              <line x1="20" y1="10" x2="20" y2="16" stroke="#7DD4ED" strokeWidth="2"/>
              <line x1="24" y1="20" x2="26" y2="14" stroke="#7DD4ED" strokeWidth="2"/>
              <line x1="24" y1="20" x2="26" y2="28" stroke="#7DD4ED" strokeWidth="2"/>
            </svg>
            ClinicTech
          </a>
          <div className="nav-links">
            <a href="#product">Product</a>
            <a href="#roi">ROI</a>
            <a href="https://calendar.app.google/YvNVdxRdiXVhjXQDA" target="_blank" rel="noopener noreferrer" className="btn-primary">Book a Demo</a>
          </div>
          <a href="https://calendar.app.google/YvNVdxRdiXVhjXQDA" target="_blank" rel="noopener noreferrer" className="btn-primary nav-mobile-cta" style={{padding: "10px 20px", fontSize: 13}}>Book a Demo</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="dot"></span>
              Built for Regenerative Medicine Clinics
            </div>
            <h1>Your Clinic. Your Brand.<br/><span className="highlight">Your Growth Engine.</span></h1>
            <p className="hero-sub">A fully custom back-office platform and patient portal for regenerative medicine clinics. Branded to you, connected to your tools, live in days.</p>
            <div className="hero-ctas">
              <a href="https://calendar.app.google/YvNVdxRdiXVhjXQDA" target="_blank" rel="noopener noreferrer" className="btn-primary">{"Book a 15-Min Walkthrough \u2192"}</a>
              <a href="#product" className="btn-secondary">See How It Works</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="crm-builder">
              <div className="crm-builder-toolbar">
                <div className="crm-toolbar-left">
                  <div className="crm-toolbar-dots"><span></span><span></span><span></span></div>
                  <div className="crm-toolbar-title">Pipeline Builder</div>
                </div>
                <div className="crm-toolbar-right">
                  <div className="crm-toolbar-btn">{"\u21A9"} Undo</div>
                  <div className="crm-toolbar-btn save">{"\u2713"} Save Pipeline</div>
                </div>
              </div>
              <div className="crm-builder-body">
                <div className="crm-pipeline-header">
                  <div className="crm-pipeline-name">
                    <input className="crm-pipeline-name-input" defaultValue="Patient Pipeline" readOnly />
                    <span className="edit-icon">{"\u270E"}</span>
                  </div>
                  <div className="crm-add-stage-btn">+ Add Stage</div>
                </div>
                <div className="crm-kanban">
                  <div className="crm-column">
                    <div className="crm-column-header">
                      <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
                        <span className="crm-column-drag">{"\u2807"}</span>
                        <span className="crm-column-title">New Lead</span>
                      </div>
                      <span className="crm-column-count">4</span>
                    </div>
                    <div className="crm-card">
                      <span className="crm-card-drag">{"\u2807"}</span>
                      <div className="crm-card-name">Jennifer M.</div>
                      <div className="crm-card-detail">Knee Stem Cell Therapy</div>
                      <div className="crm-card-value">$12,000</div>
                    </div>
                    <div className="crm-card">
                      <span className="crm-card-drag">{"\u2807"}</span>
                      <div className="crm-card-name">Michael T.</div>
                      <div className="crm-card-detail">PRP Consultation</div>
                      <div className="crm-card-value">$5,000</div>
                    </div>
                    <div className="crm-add-card">+ Add</div>
                  </div>
                  <div className="crm-column">
                    <div className="crm-column-header">
                      <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
                        <span className="crm-column-drag">{"\u2807"}</span>
                        <span className="crm-column-title">Consult Booked</span>
                      </div>
                      <span className="crm-column-count">3</span>
                    </div>
                    <div className="crm-card dragging">
                      <span className="crm-card-drag">{"\u2807"}</span>
                      <div className="crm-card-name">Robert K.</div>
                      <div className="crm-card-detail">Hip Regeneration</div>
                      <div className="crm-card-value">$18,000</div>
                    </div>
                    <div className="crm-card">
                      <span className="crm-card-drag">{"\u2807"}</span>
                      <div className="crm-card-name">Sarah L.</div>
                      <div className="crm-card-detail">Shoulder PRP</div>
                      <div className="crm-card-value">$6,500</div>
                    </div>
                  </div>
                  <div className="crm-column">
                    <div className="crm-column-header">
                      <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
                        <span className="crm-column-drag">{"\u2807"}</span>
                        <span className="crm-column-title">Treatment</span>
                      </div>
                      <span className="crm-column-count">2</span>
                    </div>
                    <div className="crm-card">
                      <span className="crm-card-drag">{"\u2807"}</span>
                      <div className="crm-card-name">Lisa W.</div>
                      <div className="crm-card-detail">{"Stem Cell \u2014 Knee"}</div>
                      <div className="crm-card-value">$15,000</div>
                    </div>
                  </div>
                  <div className="crm-column">
                    <div className="crm-column-header">
                      <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
                        <span className="crm-column-drag">{"\u2807"}</span>
                        <span className="crm-column-title">Follow-Up</span>
                      </div>
                      <span className="crm-column-count">5</span>
                    </div>
                    <div className="crm-card">
                      <span className="crm-card-drag">{"\u2807"}</span>
                      <div className="crm-card-name">David R.</div>
                      <div className="crm-card-detail">Post-PRP Check-in</div>
                      <div className="crm-card-value">$8,000</div>
                    </div>
                    <div className="crm-add-card">+ Add</div>
                  </div>
                </div>
              </div>
              <div className="crm-builder-footer">
                <div className="crm-footer-left">
                  <div className="crm-footer-chip">{"🎨"} Your Brand</div>
                  <div className="crm-footer-chip">{"⚡"} Auto-Follow-Up On</div>
                  <div className="crm-footer-chip">{"📊"} 14 Active Leads</div>
                </div>
                <span>Drag stages to reorder</span>
              </div>
            </div>
            <div className="brand-tag">Branded as <span>Your Clinic</span></div>

            <div className="activity-toast" style={{bottom:"90px",left:"-30px"}}>
              <div className="toast-icon green">{"⚡"}</div>
              <div className="toast-text">
                <span className="toast-label">Automation</span>
                <span className="toast-msg">Auto-followed up with 3 leads today</span>
              </div>
              <span className="toast-time">2m ago</span>
            </div>
            <div className="activity-toast" style={{top:"60px",left:"-20px",borderLeftColor:"var(--navy)"}}>
              <div className="toast-icon purple">{"⭐"}</div>
              <div className="toast-text">
                <span className="toast-label">Patient Engagement</span>
                <span className="toast-msg">Sent testimonial request to Sarah L.</span>
              </div>
              <span className="toast-time">12m ago</span>
            </div>
            <div className="activity-toast" style={{bottom:"160px",right:"-20px",left:"auto",borderLeftColor:"var(--blue)"}}>
              <div className="toast-icon blue">{"📅"}</div>
              <div className="toast-text">
                <span className="toast-label">Booking</span>
                <span className="toast-msg">Jennifer M. booked consultation</span>
              </div>
              <span className="toast-time">Just now</span>
            </div>
          </div>
        </div>
      </section>

      {/* STAT BANNER */}
      <section className="stat-banner">
        <div className="container">
          <div className="stat-banner-number">78%</div>
          <div className="stat-banner-text">of patients book with <strong>the first clinic that responds.</strong> If your follow-up takes hours, you&apos;re funding your competitor&apos;s growth.</div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="problem" id="problem">
        <div className="container">
          <div className="section-label">The Problem</div>
          <h2 className="section-title">You didn&apos;t go into regenerative medicine to manage a tech stack.</h2>
          <p className="section-sub">You&apos;re duct-taping together scheduling software, a CRM you barely use, and a website that doesn&apos;t convert. Meanwhile, the multi-location networks have custom software and your leads are going there.</p>
          <div className="pain-grid">
            <div className="pain-card">
              <div className="pain-icon">{"⏱️"}</div>
              <h3>Leads Fall Through the Cracks</h3>
              <p>Someone fills out your contact form at 9pm. By the time you see it the next morning, they&apos;ve already booked with the clinic that replied in 10 minutes.</p>
              <div className="pain-stat">Avg response time without automation: 47 hours</div>
            </div>
            <div className="pain-card">
              <div className="pain-icon">{"🔄"}</div>
              <h3>No Patient Reengagement</h3>
              <p>Past patients who loved their results never hear from you again. No follow-up, no referral prompts, no content to share. Your best marketing channel sits untapped.</p>
              <div className="pain-stat">80% of revenue comes from 20% of patients</div>
            </div>
            <div className="pain-card">
              <div className="pain-icon">{"🛠️"}</div>
              <h3>Manual Everything</h3>
              <p>Copy-pasting between tools, manually tracking who needs a callback, updating spreadsheets. You&apos;re spending admin hours on work that should run itself.</p>
              <div className="pain-stat">15+ hrs/week spent on manual follow-up</div>
            </div>
          </div>
        </div>
      </section>

      {/* BACK OFFICE */}
      <section className="backoffice-section" id="product">
        <div className="container">
          <div className="backoffice-grid">
            <div className="backoffice-content">
              <div className="section-label">Back Office</div>
              <h2 className="section-title">Design your own back office. Automate everything.</h2>
              <p className="section-sub">Build the dashboard you actually want. Every workflow, every follow-up, every notification is completely custom to your process and runs on autopilot.</p>
              <div className="backoffice-features">
                <div className="backoffice-feature">
                  <div className="backoffice-feature-icon">{"⚡"}</div>
                  <div>
                    <h4>Custom Automations</h4>
                    <p>Auto-follow-up leads via email + SMS. Trigger reminders, assign tasks, and move deals through your pipeline automatically.</p>
                  </div>
                </div>
                <div className="backoffice-feature">
                  <div className="backoffice-feature-icon">{"📝"}</div>
                  <div>
                    <h4>AI Blog &amp; Content Generation</h4>
                    <p>Auto-generate SEO blog posts from your knowledge base. Push to your website weekly to drive organic traffic.</p>
                  </div>
                </div>
                <div className="backoffice-feature">
                  <div className="backoffice-feature-icon">{"🔗"}</div>
                  <div>
                    <h4>Connect Your Tools</h4>
                    <p>Calendar, CRM, GoHighLevel, Gmail, Salesforce — everything syncs in one branded dashboard.</p>
                  </div>
                </div>
                <div className="backoffice-feature">
                  <div className="backoffice-feature-icon">{"📊"}</div>
                  <div>
                    <h4>Your KPIs, Your Way</h4>
                    <p>Real-time analytics tailored to the metrics that matter to your clinic. No generic dashboards.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="backoffice-visual">
              <div className="backoffice-mockup">
                <div className="bo-toolbar">
                  <div className="bo-toolbar-dots"><span></span><span></span><span></span></div>
                  Your Clinic — Back Office
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
                        <div className="bo-auto-desc">AI-generated from your knowledge base, pushed to site</div>
                        <div className="bo-auto-stat">{"\u2191"} 12 posts published</div>
                      </div>
                      <div className="bo-auto-card">
                        <div className="bo-auto-header">
                          <span className="bo-auto-icon">{"⭐"}</span>
                          <span className="bo-auto-status active">Active</span>
                        </div>
                        <div className="bo-auto-name">Review Requests</div>
                        <div className="bo-auto-desc">Auto-sent 7 days post-treatment to happy patients</div>
                        <div className="bo-auto-stat">{"\u2191"} 23 reviews collected</div>
                      </div>
                      <div className="bo-auto-card">
                        <div className="bo-auto-header">
                          <span className="bo-auto-icon">{"🔄"}</span>
                          <span className="bo-auto-status draft">Draft</span>
                        </div>
                        <div className="bo-auto-name">Patient Reactivation</div>
                        <div className="bo-auto-desc">Re-engage patients who haven&apos;t visited in 90 days</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PATIENT PORTAL */}
      <section className="portal-section">
        <div className="container">
          <div className="portal-grid">
            <div className="portal-visual">
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
                      What should I expect after PRP treatment for my knee? How long is recovery?
                    </div>
                    <div className="portal-chat-msg ai">
                      <div className="ai-badge">{"✨"} AI-Powered Answer</div>
                      PRP recovery for knee treatment typically involves 1-2 days of rest, with most patients returning to light activity within a week. You may experience mild swelling at the injection site for 2-3 days. Full benefits usually develop over 4-6 weeks as tissue regeneration occurs.
                      <div className="sources">
                        Sources: <span>PRP Recovery Guide</span> &middot; <span>Post-Treatment FAQ</span>
                      </div>
                    </div>
                  </div>
                  <div className="portal-kb-uploads">
                    <div className="portal-kb-file">
                      <span className="file-icon">{"📄"}</span>
                      Treatment Guide.pdf
                      <span className="file-status"></span>
                    </div>
                    <div className="portal-kb-file">
                      <span className="file-icon">{"📄"}</span>
                      Recovery FAQ.pdf
                      <span className="file-status"></span>
                    </div>
                    <div className="portal-kb-file">
                      <span className="file-icon">{"📄"}</span>
                      Pricing Info.pdf
                      <span className="file-status"></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="portal-toasts">
                <div className="portal-toast">
                  <div className="toast-icon green">{"💬"}</div>
                  <div className="toast-text">
                    <span className="toast-label">Patient Query</span>
                    <span className="toast-msg">{"AI answered: \"PRP recovery time?\""}</span>
                  </div>
                </div>
                <div className="portal-toast" style={{borderLeftColor:"var(--navy)"}}>
                  <div className="toast-icon purple">{"📄"}</div>
                  <div className="toast-text">
                    <span className="toast-label">Knowledge Base</span>
                    <span className="toast-msg">3 documents uploaded &amp; indexed</span>
                  </div>
                </div>
                <div className="portal-toast" style={{borderLeftColor:"var(--orange)"}}>
                  <div className="toast-icon" style={{background:"rgba(245, 158, 11, 0.1)"}}>{"📅"}</div>
                  <div className="toast-text">
                    <span className="toast-label">Conversion</span>
                    <span className="toast-msg">Patient booked after AI chat</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="portal-content">
              <div className="section-label">Patient Portal</div>
              <h2 className="section-title">Your branded portal. AI-powered answers. 24/7.</h2>
              <p className="section-sub">Upload your knowledge base and let leads and patients ask questions. AI generates instant, accurate answers from your own content.</p>
              <div className="portal-features">
                <div className="portal-feature">
                  <div className="portal-feature-icon">{"📚"}</div>
                  <div>
                    <h4>Upload Your Knowledge Base</h4>
                    <p>Drop in treatment guides, FAQs, recovery info, pricing docs. The AI learns your content and answers patients accurately.</p>
                  </div>
                </div>
                <div className="portal-feature">
                  <div className="portal-feature-icon">{"🤖"}</div>
                  <div>
                    <h4>AI-Generated Answers</h4>
                    <p>Patients ask questions in natural language. AI responds instantly with answers sourced from your uploaded documents.</p>
                  </div>
                </div>
                <div className="portal-feature">
                  <div className="portal-feature-icon">{"🎨"}</div>
                  <div>
                    <h4>Fully Branded to You</h4>
                    <p>Your logo, colors, domain. Patients see your clinic — not a third-party tool. Builds trust from the first interaction.</p>
                  </div>
                </div>
                <div className="portal-feature">
                  <div className="portal-feature-icon">{"📅"}</div>
                  <div>
                    <h4>Convert Queries to Bookings</h4>
                    <p>AI chat seamlessly guides patients to book a consultation. Turn curiosity into appointments, automatically.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="roi" id="roi">
        <div className="container">
          <div className="section-label">The ROI</div>
          <h2 className="section-title">The math is simple. The impact is not.</h2>
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

      {/* PATIENT FUNNEL */}
      <section className="funnel" id="funnel">
        <div className="container">
          <div className="section-label">Patient-Powered Growth</div>
          <h2 className="section-title">Turn your patients into your top of funnel.</h2>
          <p className="section-sub">Your best marketing isn&apos;t ads. It&apos;s your existing patients. ClinicTech auto-generates content and campaigns from your patient data and knowledge base.</p>
          <div className="success-stories-showcase">
            <div className="success-stories-visual">
              <div className="ss-mockup">
                <div className="ss-header">
                  <div className="ss-header-dots"><span></span><span></span><span></span></div>
                  Success Story Generator
                </div>
                <div className="ss-body">
                  <div className="ss-badge">{"✨"} AI-Generated &middot; Ready to Publish</div>
                  <div className="ss-card-preview">
                    <div className="ss-card-quote">&ldquo;After years of knee pain, I was skeptical about stem cell therapy. Six weeks after my treatment, I&apos;m hiking again. The team made the entire process seamless.&rdquo;</div>
                    <div className="ss-card-patient">
                      <div className="ss-card-avatar">JM</div>
                      <div className="ss-card-info">
                        <div className="ss-card-name">Jennifer M.</div>
                        <div className="ss-card-treatment">Knee Stem Cell Therapy &middot; 6 weeks post</div>
                      </div>
                      <div className="ss-card-stars">{"★★★★★"}</div>
                    </div>
                  </div>
                  <div className="ss-actions">
                    <div className="ss-action-btn publish">{"📤"} Publish to Website</div>
                    <div className="ss-action-btn edit">{"✏️"} Edit Story</div>
                    <div className="ss-action-btn edit">{"📱"} Share to Social</div>
                  </div>
                  <div className="ss-queue">
                    <div className="ss-queue-item">
                      <div className="ss-queue-name"><span className="ss-queue-dot ready"></span>Robert K.</div>
                      <div className="ss-queue-status">PRP Treatment &middot; Ready</div>
                    </div>
                    <div className="ss-queue-item">
                      <div className="ss-queue-name"><span className="ss-queue-dot draft"></span>Sarah L.</div>
                      <div className="ss-queue-status">Shoulder PRP &middot; Draft</div>
                    </div>
                    <div className="ss-queue-item">
                      <div className="ss-queue-name"><span className="ss-queue-dot ready"></span>David R.</div>
                      <div className="ss-queue-status">Hip Regen &middot; Ready</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 style={{fontSize:"26px",fontWeight:800,fontStyle:"italic",marginBottom:"12px"}}>Patient Success Stories</h3>
              <p style={{fontSize:"15px",lineHeight:1.7,color:"var(--text-secondary)",marginBottom:"20px"}}>Auto-generated, anonymized success story templates ready to post to your website or social channels. Compliant, compelling, and done for you.</p>
              <div className="backoffice-features" style={{marginTop:0}}>
                <div className="backoffice-feature">
                  <div className="backoffice-feature-icon">{"🤖"}</div>
                  <div>
                    <h4>AI-Written from Patient Data</h4>
                    <p>Generates compelling stories from treatment outcomes. Anonymized and HIPAA-compliant by default.</p>
                  </div>
                </div>
                <div className="backoffice-feature">
                  <div className="backoffice-feature-icon">{"📤"}</div>
                  <div>
                    <h4>One-Click Publish</h4>
                    <p>Push to your website, social media, or email campaigns. Branded graphics included.</p>
                  </div>
                </div>
                <div className="backoffice-feature">
                  <div className="backoffice-feature-icon">{"📊"}</div>
                  <div>
                    <h4>Pipeline of Stories</h4>
                    <p>Queue of ready-to-publish stories auto-generated as patients complete treatment milestones.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="funnel-grid">
            <div className="funnel-card">
              <div className="funnel-card-number">02</div>
              <h3>Boost Your SEO: Auto-Generated Blog Posts</h3>
              <p>Fresh, keyword-optimized blog posts generated every week from your knowledge base and treatment offerings. Published straight to your website to drive organic traffic and rank for the searches your patients are already making.</p>
              <div className="funnel-tag">Weekly Auto-Publish</div>
            </div>
            <div className="funnel-card">
              <div className="funnel-card-number">03</div>
              <h3>Review &amp; Referral Prompts</h3>
              <p>Automated prompts triggered after positive outcomes. Patients get a nudge to leave a review or refer a friend at the exact right moment.</p>
              <div className="funnel-tag">Automated Triggers</div>
            </div>
            <div className="funnel-card">
              <div className="funnel-card-number">04</div>
              <h3>Social Proof Assets</h3>
              <p>Branded graphics, testimonial cards, and shareable content your patients can post themselves. Turn word-of-mouth into a scalable channel.</p>
              <div className="funnel-tag">{"Drag & Drop"}</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how" id="how">
        <div className="container">
          <div className="section-label" style={{textAlign:"center"}}>How It Works</div>
          <h2 className="section-title" style={{textAlign:"center",marginLeft:"auto",marginRight:"auto"}}>Live in weeks. Not months.</h2>
          <p className="section-sub" style={{textAlign:"center",marginLeft:"auto",marginRight:"auto"}}>No consultants. No developers. No six-month implementation. Three steps and your custom platform is running.</p>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>We brand it to you</h3>
              <p>Your logo, your colors, your domain. The back office and patient portal look and feel like your own custom-built platform from day one.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>You build your workflow</h3>
              <p>Drag and drop your lead stages, follow-up sequences, and portal content. Connect your calendar, email, and CRM. Completely tailored to your process.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Watch your pipeline grow</h3>
              <p>Leads get followed up automatically. Patients engage through your portal. Content generates itself. You see everything in one place.</p>
            </div>
          </div>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className="integrations" id="integrations">
        <div className="container">
          <div className="integrations-center">
            <div className="section-label">Integrations</div>
            <h2 className="section-title">Connects to tools you already use.</h2>
            <p className="section-sub">ClinicTech wraps around your existing workflow. No rip-and-replace, no learning curve.</p>
            <div className="int-logos">
              <div className="int-logo"><div className="int-logo-icon">{"📅"}</div>Google Cal</div>
              <div className="int-logo"><div className="int-logo-icon">{"📧"}</div>Gmail</div>
              <div className="int-logo"><div className="int-logo-icon">{"📊"}</div>HubSpot</div>
              <div className="int-logo"><div className="int-logo-icon">{"⚡"}</div>Salesforce</div>
              <div className="int-logo"><div className="int-logo-icon">{"🚀"}</div>GoHighLevel</div>
              <div className="int-logo"><div className="int-logo-icon">{"📋"}</div>Attio</div>
              <div className="int-logo"><div className="int-logo-icon">{"💬"}</div>Slack</div>
              <div className="int-logo"><div className="int-logo-icon">{"📱"}</div>SMS</div>
              <div className="int-logo"><div className="int-logo-icon">{"🌐"}</div>Your Website</div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-section" id="demo">
        <div className="container">
          <div className="cta-box">
            <h2>See what your clinic&apos;s<br/>custom platform looks like.</h2>
            <p>15-minute walkthrough. We&apos;ll brand a live preview to your clinic.</p>
            <a href="https://calendar.app.google/YvNVdxRdiXVhjXQDA" target="_blank" rel="noopener noreferrer" className="btn-primary">{"Book Your Walkthrough \u2192"}</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="footer-brand">
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="8" height="8" rx="1.5" fill="#5EC4E3"/>
              <rect x="16" y="2" width="8" height="8" rx="1.5" fill="#7DD4ED"/>
              <rect x="16" y="16" width="8" height="8" rx="1.5" fill="#5EC4E3"/>
              <rect x="26" y="10" width="8" height="8" rx="1.5" fill="#7DD4ED"/>
              <rect x="26" y="24" width="8" height="8" rx="1.5" fill="#5EC4E3"/>
              <line x1="10" y1="6" x2="16" y2="6" stroke="#7DD4ED" strokeWidth="2"/>
              <line x1="20" y1="10" x2="20" y2="16" stroke="#7DD4ED" strokeWidth="2"/>
              <line x1="24" y1="20" x2="26" y2="14" stroke="#7DD4ED" strokeWidth="2"/>
              <line x1="24" y1="20" x2="26" y2="28" stroke="#7DD4ED" strokeWidth="2"/>
            </svg>
            ClinicTech
          </div>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}
