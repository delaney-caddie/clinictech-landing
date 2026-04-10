"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function SiteNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <style>{`
        .site-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 40px; background: #3730A3;
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: all 0.3s;
        }
        .site-nav-brand { display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .site-nav-brand img { height: 70px; width: auto; }
        .site-nav-links { display: flex; align-items: center; gap: 32px; }
        .site-nav-links a {
          font-size: 14px; color: rgba(255,255,255,0.75); text-decoration: none; font-weight: 600;
          transition: color 0.2s;
        }
        .site-nav-links a:hover { color: #fff; }
        .site-nav-links a.active { color: #fff; }
        .site-nav-links .site-nav-cta {
          background: #5EC4E3; color: #1A1A2E !important; padding: 14px 32px;
          border-radius: 100px; font-weight: 800; font-size: 15px;
        }
        .site-nav-links .site-nav-cta:hover {
          background: #4AB8D9; color: #1A1A2E !important;
          box-shadow: 0 4px 16px rgba(94, 196, 227, 0.4);
        }
        .site-nav-hamburger {
          display: none; background: none; border: none; cursor: pointer;
          width: 32px; height: 32px; flex-direction: column; align-items: center;
          justify-content: center; gap: 5px; padding: 0;
        }
        .site-nav-hamburger span {
          display: block; width: 22px; height: 2px; background: #fff;
          border-radius: 2px; transition: all 0.3s;
        }
        .site-nav-hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(2.5px, 2.5px); }
        .site-nav-hamburger.open span:nth-child(2) { opacity: 0; }
        .site-nav-hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(2.5px, -2.5px); }
        .site-nav-mobile-menu {
          display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: #3730A3; z-index: 99; padding: 120px 32px 40px;
          flex-direction: column; gap: 0;
        }
        .site-nav-mobile-menu.open { display: flex; }
        .site-nav-mobile-menu a {
          display: block; padding: 16px 0; font-size: 18px; font-weight: 700;
          color: rgba(255,255,255,0.75); text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .site-nav-mobile-menu a:hover, .site-nav-mobile-menu a.active { color: #fff; }
        .site-nav-mobile-menu .mobile-cta-wrap { margin-top: auto; padding-top: 24px; }
        .site-nav-mobile-menu .mobile-cta-wrap a {
          display: flex; align-items: center; justify-content: center;
          background: #5EC4E3; color: #1A1A2E !important; padding: 14px 32px;
          border-radius: 100px; font-weight: 800; font-size: 15px; border: none;
        }
        @media (max-width: 900px) {
          .site-nav-links { display: none; }
          .site-nav-hamburger { display: flex; }
        }
        @media (max-width: 640px) {
          .site-nav { padding: 14px 16px; }
          .site-nav-brand img { height: 50px; }
        }
      `}</style>
      <nav className="site-nav">
        <Link href="/" className="site-nav-brand">
          <img src="/clinictech-logo.png" alt="ClinicTech" />
        </Link>
        <div className="site-nav-links">
          <Link href="/" className={pathname === "/" ? "active" : ""}>Home</Link>
          <Link href="/features/lead-capture" className={pathname === "/features/lead-capture" ? "active" : ""}>Capture</Link>
          <Link href="/features/patient-experience" className={pathname === "/features/patient-experience" ? "active" : ""}>Keep</Link>
          <Link href="/features/travel-concierge" className={pathname === "/features/travel-concierge" ? "active" : ""}>Grow</Link>
          <Link href="/about" className={pathname === "/about" ? "active" : ""}>About</Link>
          <Link href="/blog" className={pathname.startsWith("/blog") ? "active" : ""}>Blog</Link>
          <a href="https://calendar.app.google/YvNVdxRdiXVhjXQDA" target="_blank" rel="noopener noreferrer" className="site-nav-cta">Book a Call</a>
        </div>
        <button className={`site-nav-hamburger ${mobileOpen ? "open" : ""}`} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </nav>
      <div className={`site-nav-mobile-menu ${mobileOpen ? "open" : ""}`}>
        <Link href="/" className={pathname === "/" ? "active" : ""} onClick={() => setMobileOpen(false)}>Home</Link>
        <Link href="/features/lead-capture" className={pathname === "/features/lead-capture" ? "active" : ""} onClick={() => setMobileOpen(false)}>Capture</Link>
        <Link href="/features/patient-experience" className={pathname === "/features/patient-experience" ? "active" : ""} onClick={() => setMobileOpen(false)}>Keep</Link>
        <Link href="/features/travel-concierge" className={pathname === "/features/travel-concierge" ? "active" : ""} onClick={() => setMobileOpen(false)}>Grow</Link>
        <Link href="/about" className={pathname === "/about" ? "active" : ""} onClick={() => setMobileOpen(false)}>About</Link>
        <Link href="/blog" className={pathname.startsWith("/blog") ? "active" : ""} onClick={() => setMobileOpen(false)}>Blog</Link>
        <div className="mobile-cta-wrap">
          <a href="https://calendar.app.google/YvNVdxRdiXVhjXQDA" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}>Book a Call</a>
        </div>
      </div>
    </>
  );
}
