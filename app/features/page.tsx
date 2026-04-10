import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export const metadata = {
  title: "Features - ClinicTech",
  description:
    "Everything your clinic needs to capture, convert, and keep patients. Three integrated systems. One platform. Built exclusively for regenerative medicine.",
};

export default function FeaturesPage() {
  return (
    <>
      <style>{`
        .feat-hub {
          min-height: 100vh;
          background: #FAFBFD;
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
        }

        /* Hero */
        .feat-hero {
          padding: 160px 24px 72px;
          text-align: center;
          background: linear-gradient(180deg, #FAFBFD 0%, #fff 100%);
        }
        .feat-hero-kicker {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.6px;
          color: #5EC4E3;
          margin-bottom: 16px;
        }
        .feat-hero h1 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 46px;
          font-weight: 800;
          font-style: normal;
          color: #0F172A;
          line-height: 1.12;
          letter-spacing: -0.4px;
          margin: 0 auto 20px;
          max-width: 780px;
        }
        .feat-hero-sub {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 18px;
          color: #64748B;
          max-width: 580px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* Cards grid */
        .feat-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 24px 100px;
        }
        .feat-card {
          background: #fff;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.25s, transform 0.25s;
        }
        .feat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
        }
        .feat-card h2 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 22px;
          font-weight: 700;
          font-style: normal;
          color: #0F172A;
          margin: 0 0 12px;
          line-height: 1.25;
        }
        .feat-card-desc {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          line-height: 1.7;
          color: #64748B;
          margin: 0 0 20px;
          flex: 1;
        }
        .feat-card-stat {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #5EC4E3;
          background: rgba(20, 184, 166, 0.06);
          border-radius: 6px;
          padding: 10px 14px;
          margin-bottom: 20px;
        }
        .feat-card-link {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          font-weight: 700;
          color: #5EC4E3;
          text-decoration: none;
          transition: gap 0.2s;
        }
        .feat-card-link:hover {
          gap: 8px;
        }

        /* Bottom CTA */
        .feat-cta-section {
          padding: 0 24px 100px;
        }
        .feat-cta-box {
          background: #3730A3;
          border-radius: 12px;
          padding: 64px 48px;
          max-width: 880px;
          margin: 0 auto;
          text-align: center;
        }
        .feat-cta-box h2 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 32px;
          font-weight: 700;
          font-style: normal;
          color: #fff;
          margin: 0 0 24px;
          line-height: 1.2;
        }
        .feat-cta-btn {
          display: inline-block;
          padding: 14px 36px;
          background: #5EC4E3;
          color: #fff;
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          font-size: 15px;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .feat-cta-btn:hover {
          background: #4AB8D9;
        }

        /* Footer */
        .feat-footer {
          padding: 40px 24px;
          border-top: 1px solid #E2E8F0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1080px;
          margin: 0 auto;
        }
        .feat-footer-links {
          display: flex;
          gap: 24px;
        }
        .feat-footer-links a {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          color: #94A3B8;
          text-decoration: none;
        }
        .feat-footer-links a:hover {
          color: #5EC4E3;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .feat-cards {
            grid-template-columns: 1fr;
            max-width: 480px;
          }
          .feat-hero h1 {
            font-size: 34px;
          }
        }
        @media (max-width: 640px) {
          .feat-hero {
            padding: 120px 20px 56px;
          }
          .feat-hero h1 {
            font-size: 28px;
          }
          .feat-hero-sub {
            font-size: 15px;
          }
          .feat-card {
            padding: 28px 22px;
          }
          .feat-cta-box {
            padding: 44px 24px;
            border-radius: 10px;
          }
          .feat-cta-box h2 {
            font-size: 24px;
          }
          .feat-footer {
            flex-direction: column;
            gap: 16px;
            text-align: center;
            padding: 32px 20px;
          }
        }
      `}</style>

      <div className="feat-hub">
        <SiteNav />
        {/* Hero */}
        <div className="feat-hero">
          <div className="feat-hero-kicker">Features</div>
          <h1>Everything your clinic needs to capture, convert, and keep patients.</h1>
          <p className="feat-hero-sub">
            Three integrated systems. One platform. Built exclusively for regenerative medicine.
          </p>
        </div>

        {/* Feature cards */}
        <div className="feat-cards">
          <div className="feat-card">
            <h2>Lead Capture &amp; Conversion</h2>
            <p className="feat-card-desc">
              Smart intake forms, AI chat widget, and automated follow-up sequences that turn website visitors into booked consultations.
            </p>
            <div className="feat-card-stat">3-5x more consultations booked</div>
            <Link href="/features/lead-capture" className="feat-card-link">
              Explore lead capture -&gt;
            </Link>
          </div>

          <div className="feat-card">
            <h2>Patient Experience</h2>
            <p className="feat-card-desc">
              Patient portal, recovery tracking, document sharing, 12-month lifecycle sequences, testimonial capture, and referral programs.
            </p>
            <div className="feat-card-stat">40% increase in returning patients</div>
            <Link href="/features/patient-experience" className="feat-card-link">
              Explore patient experience -&gt;
            </Link>
          </div>

          <div className="feat-card">
            <h2>Travel Concierge</h2>
            <p className="feat-card-desc">
              Patient travel portal, admin dashboard, and automated pre-arrival sequences for clinics serving international patients.
            </p>
            <div className="feat-card-stat">22 hrs/week saved in coordinator time</div>
            <Link href="/features/travel-concierge" className="feat-card-link">
              Explore travel concierge -&gt;
            </Link>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="feat-cta-section">
          <div className="feat-cta-box">
            <h2>See it live with your clinic&apos;s branding.</h2>
            <a
              href="https://calendar.app.google/YvNVdxRdiXVhjXQDA"
              target="_blank"
              rel="noopener noreferrer"
              className="feat-cta-btn"
            >
              Book a 15-minute demo
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="feat-footer">
          <Link href="/">
            <img
              src="/clinictech-logo.png"
              alt="ClinicTech"
              style={{ height: 20, opacity: 0.5 }}
            />
          </Link>
          <div className="feat-footer-links">
            <Link href="/features">Features</Link>
            <Link href="/about">About</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </div>
    </>
  );
}
