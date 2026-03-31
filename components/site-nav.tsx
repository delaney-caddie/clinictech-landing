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
          padding: 20px 40px; background: #fff; border-bottom: 1px solid rgba(0,0,0,0.06);
          position: sticky; top: 0; z-index: 100;
        }
        .site-nav-brand { display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .site-nav-brand img { height: 22px; width: auto; }
        .site-nav-links { display: flex; align-items: center; gap: 28px; }
        .site-nav-links a {
          font-size: 13px; color: #64748B; text-decoration: none; font-weight: 500;
          transition: color 0.2s;
        }
        .site-nav-links a:hover { color: #3730A3; }
        .site-nav-links a.active { color: #0F172A; font-weight: 600; }
        .site-nav-links .site-nav-cta {
          background: #3730A3; color: #fff !important; padding: 8px 18px;
          border-radius: 8px; font-weight: 600; font-size: 13px;
        }
        .site-nav-links .site-nav-cta:hover { background: #2e2890; }
        @media (max-width: 640px) {
          .site-nav { padding: 16px 20px; }
          .site-nav-links { gap: 16px; }
          .site-nav-links a:not(.site-nav-cta) { display: none; }
        }
      `}</style>
      <nav className="site-nav">
        <Link href="/" className="site-nav-brand">
          <img src="/clinictech-logo.png" alt="ClinicTech" />
        </Link>
        <div className="site-nav-links">
          <Link href="/#product" className={pathname === "/" ? "active" : ""}>Product</Link>
          <Link href="/#roi">ROI</Link>
          <Link href="/blog" className={pathname.startsWith("/blog") ? "active" : ""}>Blog</Link>
          <Link href="/about" className={pathname === "/about" ? "active" : ""}>About</Link>
          <a href="https://calendar.app.google/YvNVdxRdiXVhjXQDA" target="_blank" rel="noopener noreferrer" className="site-nav-cta">Book a Demo</a>
        </div>
      </nav>
    </>
  );
}
