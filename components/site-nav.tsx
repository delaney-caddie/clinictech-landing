"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function SiteNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <>
      <style>{`
        .site-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 40px; background: #fff;
          position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
          border-bottom: 1px solid #E2E8F0;
        }
        .site-nav-brand { display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .site-nav-brand img { height: 56px; width: auto; filter: brightness(0) saturate(100%) invert(13%) sepia(50%) saturate(3000%) hue-rotate(240deg); }
        .site-nav-center { display: flex; align-items: center; gap: 28px; }
        .site-nav-center a, .site-nav-center .nav-dropdown-trigger {
          font-size: 14px; color: #475569; text-decoration: none; font-weight: 500;
          transition: color 0.2s; cursor: pointer; background: none; border: none;
          font-family: inherit; padding: 6px 0; display: flex; align-items: center; gap: 4px;
        }
        .site-nav-center a:hover, .site-nav-center .nav-dropdown-trigger:hover { color: #0F172A; }
        .site-nav-center a.active { color: #0F172A; font-weight: 600; }
        .nav-chevron { font-size: 8px; color: #94A3B8; transition: transform 0.2s; }
        .nav-chevron.open { transform: rotate(180deg); }
        .nav-dropdown { position: relative; }
        .nav-dropdown-menu {
          position: absolute; top: calc(100% + 12px); left: 0;
          background: #fff; border: 1px solid #E2E8F0; border-radius: 12px;
          padding: 8px; min-width: 220px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.1);
          opacity: 0; visibility: hidden; transition: all 0.15s; pointer-events: none;
        }
        .nav-dropdown-menu.open { opacity: 1; visibility: visible; pointer-events: auto; }
        .nav-dropdown-menu a {
          display: block; padding: 10px 14px; border-radius: 8px;
          font-size: 13px; font-weight: 500; color: #475569 !important;
          transition: background 0.15s;
        }
        .nav-dropdown-menu a:hover { background: #F8FAFC; color: #0F172A !important; }
        .site-nav-right { display: flex; align-items: center; gap: 20px; }
        .site-nav-cta {
          background: #3730A3 !important; color: #fff !important; padding: 10px 24px;
          border-radius: 8px; font-weight: 600; font-size: 14px;
          text-decoration: none; transition: all 0.2s; display: inline-flex;
        }
        .site-nav-cta:hover {
          background: #4338CA !important; box-shadow: 0 4px 12px rgba(55,48,163,0.25);
        }
        .site-nav-hamburger {
          display: none; background: none; border: none; cursor: pointer;
          width: 32px; height: 32px; flex-direction: column; align-items: center;
          justify-content: center; gap: 5px; padding: 0;
        }
        .site-nav-hamburger span {
          display: block; width: 22px; height: 2px; background: #0F172A;
          border-radius: 2px; transition: all 0.3s;
        }
        .site-nav-hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(2.5px, 2.5px); }
        .site-nav-hamburger.open span:nth-child(2) { opacity: 0; }
        .site-nav-hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(2.5px, -2.5px); }
        .site-nav-mobile-menu {
          display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: #fff; z-index: 9998; padding: 100px 32px 40px;
          flex-direction: column; gap: 0; overflow-y: auto;
        }
        .site-nav-mobile-menu.open { display: flex; }
        .site-nav-mobile-menu a {
          display: block; padding: 14px 0; font-size: 16px; font-weight: 600;
          color: #475569; text-decoration: none;
          border-bottom: 1px solid #F1F5F9;
        }
        .site-nav-mobile-menu a:hover, .site-nav-mobile-menu a.active { color: #0F172A; }
        .site-nav-mobile-menu .mobile-sub { padding-left: 16px; }
        .site-nav-mobile-menu .mobile-sub a { font-size: 14px; font-weight: 500; padding: 10px 0; }
        .site-nav-mobile-menu .mobile-cta-wrap { margin-top: auto; padding-top: 20px; display: flex; flex-direction: column; gap: 12px; }
        .site-nav-mobile-menu .mobile-cta-wrap a {
          display: flex; align-items: center; justify-content: center;
          padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; border: none;
        }
        .site-nav-mobile-menu .mobile-cta-wrap .mobile-cta-primary {
          background: #3730A3; color: #fff !important;
        }
        @media (max-width: 900px) {
          .site-nav-center, .site-nav-right { display: none; }
          .site-nav-hamburger { display: flex; }
        }
        @media (max-width: 640px) {
          .site-nav { padding: 12px 16px; }
          .site-nav-brand img { height: 32px; filter: brightness(0) saturate(100%) invert(13%) sepia(50%) saturate(3000%) hue-rotate(240deg); }
        }
      `}</style>
      <nav className="site-nav">
        <Link href="/" className="site-nav-brand">
          <img src="/clinictech-logo.png" alt="ClinicTech" />
        </Link>
        <div className="site-nav-center">
          <a href="/#products">AI Assistants</a>
          <a href="/#how-it-works">How it works</a>
          <a href="/#results">Results</a>
          <div className="nav-dropdown" onMouseEnter={() => setResourcesOpen(true)} onMouseLeave={() => setResourcesOpen(false)}>
            <button className="nav-dropdown-trigger">Resources <span className={`nav-chevron ${resourcesOpen ? "open" : ""}`}>&#9660;</span></button>
            <div className={`nav-dropdown-menu ${resourcesOpen ? "open" : ""}`}>
              <Link href="/blog" onClick={() => setResourcesOpen(false)}>Blog</Link>
              <Link href="/regen-news" onClick={() => setResourcesOpen(false)}>Regen News</Link>
              <Link href="/about" onClick={() => setResourcesOpen(false)}>About</Link>
            </div>
          </div>
        </div>
        <div className="site-nav-right">
          <a href="https://calendar.app.google/YvNVdxRdiXVhjXQDA" target="_blank" rel="noopener noreferrer" className="site-nav-cta">Book a demo</a>
        </div>
        <button className={`site-nav-hamburger ${mobileOpen ? "open" : ""}`} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </nav>
      <div className={`site-nav-mobile-menu ${mobileOpen ? "open" : ""}`}>
        <Link href="/" className={pathname === "/" ? "active" : ""} onClick={() => setMobileOpen(false)}>Home</Link>
        <a href="/#products" onClick={() => setMobileOpen(false)}>AI Assistants</a>
        <a href="/#how-it-works" onClick={() => setMobileOpen(false)}>How it works</a>
        <Link href="/blog" onClick={() => setMobileOpen(false)}>Blog</Link>
        <Link href="/regen-news" onClick={() => setMobileOpen(false)}>Regen News</Link>
        <Link href="/about" onClick={() => setMobileOpen(false)}>About</Link>
        <div className="mobile-cta-wrap">
          <a href="https://calendar.app.google/YvNVdxRdiXVhjXQDA" target="_blank" rel="noopener noreferrer" className="mobile-cta-primary" onClick={() => setMobileOpen(false)}>Book a demo</a>
        </div>
      </div>
    </>
  );
}
