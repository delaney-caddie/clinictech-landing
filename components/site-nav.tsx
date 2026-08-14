"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { agents, CALENDAR_URL } from "@/lib/agents";

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
          <img className="brand-logo" src="/caddie-logo.svg" alt="Caddie" />
        </Link>
        <nav className="desktop-nav">
          <div className="nav-dropdown">
            <Link href="/ai-employees" className="nav-dropdown-trigger" style={{ textDecoration: "none" }}>
              AI Employees
            </Link>
            <div className="nav-dropdown-menu nav-menu-agents">
              {agents.map((a) => (
                <Link
                  key={a.slug}
                  href={`/ai-employees/${a.slug}`}
                  className="nav-menu-agent"
                  style={{
                    ["--agent-edge" as string]: a.bgEdge,
                    ["--agent-role" as string]: a.roleColor,
                  } as React.CSSProperties}
                >
                  <img src={a.portrait} alt="" />
                  <span>
                    <strong>{a.name}</strong>
                    <span>{a.role}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <Link href="/platform">Platform</Link>
          <Link href="/pricing">Pricing</Link>
          <div className="nav-dropdown">
            <button className="nav-dropdown-trigger" type="button">More</button>
            <div className="nav-dropdown-menu">
              <Link href="/integrations">Integrations</Link>
              <Link href="/ai-vs-humans">AI Employees vs. Humans</Link>
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
              <span>Meet the team</span>
              {agents.map((a) => (
                <Link key={a.slug} href={`/ai-employees/${a.slug}`} onClick={close}>
                  {a.name} &middot; {a.role}
                </Link>
              ))}
            </div>
            <div className="mobile-nav-group">
              <span>More</span>
              <Link href="/integrations" onClick={close}>Integrations</Link>
              <Link href="/ai-vs-humans" onClick={close}>AI Employees vs. Humans</Link>
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
