"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteNav() {
  const pathname = usePathname();

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
        .site-nav-mobile-cta { display: none !important; }
        @media (max-width: 900px) {
          .site-nav-links a:not(.site-nav-cta) { display: none; }
          .site-nav-mobile-cta { display: inline-flex !important; }
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
          <Link href="/projects" className={pathname.startsWith("/projects") ? "active" : ""}>Projects</Link>
          <Link href="/about" className={pathname === "/about" ? "active" : ""}>About</Link>
          <Link href="/blog" className={pathname.startsWith("/blog") ? "active" : ""}>Blog</Link>
          <a href="https://calendar.app.google/YvNVdxRdiXVhjXQDA" target="_blank" rel="noopener noreferrer" className="site-nav-cta">Book a Call</a>
        </div>
        <a href="https://calendar.app.google/YvNVdxRdiXVhjXQDA" target="_blank" rel="noopener noreferrer" className="site-nav-cta site-nav-mobile-cta" style={{padding: "10px 20px", fontSize: 13}}>Book a Call</a>
      </nav>
    </>
  );
}
