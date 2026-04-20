"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export default function ContactPage() {
  useEffect(() => {
    if (document.querySelector('script[src="https://app.clinictech.io/embed-form.js"]')) return;
    const script = document.createElement("script");
    script.src = "https://app.clinictech.io/embed-form.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <style>{`
        .contact-page { min-height: 100vh; background: #fff; }
        .contact-hero {
          padding: 180px 0 60px; text-align: center;
        }
        .contact-hero-label {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 2px; color: #0E9AC0; margin-bottom: 16px;
        }
        .contact-hero h1 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 44px; font-weight: 800; color: #0F172A;
          margin-bottom: 16px; line-height: 1.1;
        }
        .contact-hero p {
          font-size: 17px; color: #64748B; max-width: 500px;
          margin: 0 auto; line-height: 1.7;
        }
        .contact-form-wrap {
          max-width: 700px; margin: 0 auto; padding: 0 24px 100px;
        }
        .contact-footer {
          padding: 40px 24px; border-top: 1px solid rgba(0,0,0,0.06);
          display: flex; justify-content: space-between; align-items: center;
          max-width: 700px; margin: 0 auto;
        }
        .contact-footer-links { display: flex; gap: 24px; }
        .contact-footer-links a { font-size: 13px; color: #94A3B8; text-decoration: none; }
        .contact-footer-links a:hover { color: #3730A3; }
        @media (max-width: 640px) {
          .contact-hero { padding: 140px 0 40px; }
          .contact-hero h1 { font-size: 30px; }
          .contact-footer { flex-direction: column; gap: 16px; text-align: center; }
        }
      `}</style>
      <div className="contact-page">
        <SiteNav />
        <div className="contact-hero">
          <div className="contact-hero-label">Book a Demo</div>
          <h1>See it live with your clinic&apos;s branding.</h1>
          <p>15 minutes. We&apos;ll walk you through the platform and show you exactly what it looks like for your clinic.</p>
        </div>
        <div className="contact-form-wrap">
          <div
            id="clinictech-form"
            data-form-id="6c1b45ad-f597-4fb3-a1c5-d1a31e91ef8f"
            data-host="https://app.clinictech.io"
            data-mode="inline"
          ></div>
        </div>
        <div className="contact-footer">
          <Link href="/">
            <img src="/clinictech-logo.png" alt="ClinicTech" style={{ height: 20, opacity: 0.5 }} />
          </Link>
          <div className="contact-footer-links">
            <Link href="/features">Features</Link>
            <Link href="/about">About</Link>
            <Link href="/blog">Blog</Link>
          </div>
        </div>
      </div>
    </>
  );
}
