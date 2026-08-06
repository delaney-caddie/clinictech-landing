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
        .contact-hero h1 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 44px; font-weight: 800; color: #0F172A;
          margin: 0; line-height: 1.1;
        }
        .contact-form-wrap {
          max-width: 700px; margin: 0 auto; padding: 0 24px 100px;
          display: flex; justify-content: center;
        }
        /* The embed is fixed-width (600px); keep it from overflowing on phones. */
        .contact-form-wrap > div { max-width: 100%; }
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
          <h1>Get in touch with the Caddie team</h1>
        </div>
        <div className="contact-form-wrap">
          <div
            id="clinictech-form"
            data-form-id="9e17265b-42e5-41b5-9df9-fa1674679fb5"
            data-host="https://app.clinictech.io"
            data-mode="inline"
            data-width="600px"
            data-height="700px"
          ></div>
        </div>
        <div className="contact-footer">
          <Link href="/">
            <img src="/caddie-logo.svg" alt="Caddie AI" style={{ height: 20, opacity: 0.5 }} />
          </Link>
          <div className="contact-footer-links">
            <Link href="/platform">Platform</Link>
            <Link href="/about">About</Link>
            <Link href="/pricing">Pricing</Link>
          </div>
        </div>
      </div>
    </>
  );
}
