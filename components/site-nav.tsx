"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CALENDAR_URL } from "@/lib/agents";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // The header is sticky, but keeping it permanently floating over content
  // made scrolling feel cramped. Instead: hide it while reading (scrolling
  // down), and bring it back only near the top of the page or after a
  // deliberate upward scroll, so small jitters don't pop it over the text.
  useEffect(() => {
    let lastY = window.scrollY;
    let upTravel = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      setScrolled(y > 8);
      if (y < 120) {
        upTravel = 0;
        setHidden(false);
        return;
      }
      if (delta > 0) {
        upTravel = 0;
        setHidden(true);
      } else if (delta < 0) {
        upTravel -= delta;
        if (upTravel > 260) setHidden(false);
      }
    };
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
      <header
        className={`site-header${scrolled ? " is-scrolled" : ""}${
          hidden && !mobileOpen ? " is-hidden" : ""
        }`}
      >
        <Link href="/" className="brand" onClick={close}>
          <img className="brand-logo" src="/caddie-logo.svg" alt="Caddie" />
        </Link>
        <nav className="desktop-nav">
          <Link href="/ai-employees">AI Employees</Link>
          <Link href="/platform">Platform</Link>
          <Link href="/pricing">Pricing</Link>
          <div className="nav-dropdown">
            <button className="nav-dropdown-trigger" type="button">More</button>
            <div className="nav-dropdown-menu">
              <Link href="/integrations">Integrations</Link>
              <Link href="/ai-vs-humans">Safety &amp; HIPAA</Link>
              <Link href="/vs">Caddie vs. Traditional CRMs</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
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
            <Link href="/ai-employees" onClick={close}>AI Employees</Link>
            <Link href="/platform" onClick={close}>Platform</Link>
            <Link href="/pricing" onClick={close}>Pricing</Link>
            <div className="mobile-nav-group">
              <span>More</span>
              <Link href="/integrations" onClick={close}>Integrations</Link>
              <Link href="/ai-vs-humans" onClick={close}>Safety &amp; HIPAA</Link>
              <Link href="/vs" onClick={close}>Caddie vs. Traditional CRMs</Link>
              <Link href="/about" onClick={close}>About</Link>
              <Link href="/contact" onClick={close}>Contact</Link>
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
