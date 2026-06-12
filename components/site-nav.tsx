"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CALENDAR_URL = "https://calendar.app.google/YvNVdxRdiXVhjXQDA";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);

  return (
    <>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <Link href="/" className="brand" onClick={close}>
          <img
            className="brand-logo"
            src="/clinictech-logo.png"
            alt="ClinicTech"
            style={{ filter: "brightness(0) saturate(100%) invert(13%) sepia(50%) saturate(3000%) hue-rotate(240deg)" }}
          />
        </Link>
        <nav className="desktop-nav">
          <a href="/#agents">Agents</a>
          <a href="/#how-it-works">How it works</a>
          <Link href="/features">Our work</Link>
          <Link href="/voice-agent-demo">Voice demo</Link>
          <div className="nav-dropdown">
            <button className="nav-dropdown-trigger" type="button">Resources</button>
            <div className="nav-dropdown-menu">
              <Link href="/blog">Blog</Link>
              <Link href="/regen-news">Regen news</Link>
              <Link href="/about">About</Link>
            </div>
          </div>
        </nav>
        <div className="header-actions">
          <a
            href={CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="button small"
          >
            Book a demo
          </a>
          <button
            className="mobile-nav-toggle"
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3 6h14M3 10h14M3 14h14" />
              </svg>
            )}
          </button>
        </div>
      </header>
      {mobileOpen && (
        <div className="mobile-nav-panel">
          <div className="mobile-nav-links">
            <a href="/#agents" onClick={close}>Agents</a>
            <a href="/#how-it-works" onClick={close}>How it works</a>
            <Link href="/features" onClick={close}>Our work</Link>
            <Link href="/voice-agent-demo" onClick={close}>Voice demo</Link>
            <div className="mobile-nav-group">
              <span>Resources</span>
              <Link href="/blog" onClick={close}>Blog</Link>
              <Link href="/regen-news" onClick={close}>Regen news</Link>
              <Link href="/about" onClick={close}>About</Link>
            </div>
            <div className="mobile-nav-actions">
              <a
                href={CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="button"
                onClick={close}
              >
                Book a demo
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
