import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export const metadata = {
  title: "About Us - ClinicTech",
  description: "Meet Delaney and Danika, the co-founders building ClinicTech - a custom back-office platform for regenerative medicine clinics.",
};

export default function AboutPage() {
  return (
    <>
      <style>{`
        .about-page { min-height: 100vh; background: #FAFBFD; }
        .about-hero { max-width: 880px; margin: 0 auto; padding: 160px 40px 0; text-align: center; }
        .about-hero-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #5EC4E3; margin-bottom: 12px; }
        .about-hero h1 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 44px; font-weight: 800; font-style: normal;
          color: #0F172A; line-height: 1.15; letter-spacing: 0.5px; margin-bottom: 20px;
        }
        .about-hero p { font-size: 17px; color: #64748B; max-width: 600px; margin: 0 auto; line-height: 1.6; }
        .about-content { max-width: 880px; margin: 0 auto; padding: 60px 40px; }
        .about-grid { display: flex; gap: 60px; align-items: center; }
        .about-img { flex-shrink: 0; width: 360px; height: 360px; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 40px rgba(55, 48, 163, 0.1); }
        .about-img img { width: 100%; height: 100%; object-fit: cover; }
        .about-body { flex: 1; }
        .about-body p { font-size: 16px; line-height: 1.75; color: #475569; margin-bottom: 16px; }
        .about-body p:last-child { margin-bottom: 0; }
        .about-body strong { color: #0F172A; }
        .about-cta { max-width: 880px; margin: 0 auto; padding: 0 40px 80px; }
        .about-cta-box {
          background: linear-gradient(135deg, #3730A3 0%, #5EC4E3 100%);
          border-radius: 20px; padding: 48px; text-align: center;
        }
        .about-cta-box h2 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 28px; font-weight: 800; font-style: normal;
          color: #fff; margin-bottom: 10px;
        }
        .about-cta-box p { font-size: 16px; color: rgba(255,255,255,0.8); margin-bottom: 24px; }
        .about-cta-btn {
          display: inline-block; background: #fff; color: #3730A3;
          font-weight: 700; font-size: 15px; padding: 14px 32px;
          border-radius: 12px; text-decoration: none; transition: all 0.2s;
        }
        .about-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
        .about-footer { padding: 40px; border-top: 1px solid rgba(0,0,0,0.06); display: flex; justify-content: space-between; align-items: center; max-width: 880px; margin: 0 auto; }
        .about-footer-links { display: flex; gap: 24px; }
        .about-footer-links a { font-size: 13px; color: #94A3B8; text-decoration: none; }
        .about-footer-links a:hover { color: #3730A3; }
        .about-logo-bar { padding: 40px 0; background: #fff; border-top: 1px solid rgba(0,0,0,0.04); border-bottom: 1px solid rgba(0,0,0,0.04); overflow: hidden; }
        .about-logo-bar-label {
          text-align: center; font-size: 12px; font-weight: 600; color: #94A3B8;
          text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 24px;
        }
        .about-logo-bar-track {
          display: flex; align-items: center; gap: 64px;
          animation: aboutLogoScroll 25s linear infinite;
          width: max-content;
        }
        .about-logo-bar-track img { height: 36px; max-width: 140px; width: auto; object-fit: contain; flex-shrink: 0; }
        @keyframes aboutLogoScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (max-width: 768px) {
          .about-hero { padding: 140px 20px 0; }
          .about-hero h1 { font-size: 30px; }
          .about-content { padding: 40px 20px; }
          .about-grid { flex-direction: column; gap: 32px; }
          .about-img { width: 280px; height: 280px; margin: 0 auto; }
          .about-cta { padding: 0 20px 60px; }
          .about-cta-box { padding: 32px 20px; }
          .about-nav { padding: 16px 20px; }
          .about-footer { flex-direction: column; gap: 16px; text-align: center; padding: 32px 20px; }
        }
      `}</style>
      <div className="about-page">
        <SiteNav />

        <div className="about-hero">
          <div className="about-hero-label">About Us</div>
          <h1>Built by <span style={{color: "#5EC4E3"}}>operators,</span><br/>for operators.</h1>
          <p>We started building because we saw how much time clinic teams waste on disconnected tools and manual processes. There&apos;s a better way.</p>
        </div>

        <div className="about-content">
          <div className="about-grid">
            <div className="about-img">
              <img src="/founders.png" alt="Delaney and Danika, co-founders of ClinicTech" />
            </div>
            <div className="about-body">
              <p>We&apos;re <strong>Delaney and Danika</strong>, co-founders who&apos;ve spent the last two years building AI products from the ground up. We started in recruiting tech, learned what works (and what doesn&apos;t), and followed the signal to where AI can make the biggest impact: underserved verticals with real operational pain.</p>
              <p><strong>Delaney</strong> leads product and engineering, building full-stack applications with the latest AI tooling. <strong>Danika</strong> drives go-to-market strategy, bringing operational experience from Shopify and Rewind to help teams actually adopt and get value from what we build.</p>
              <p>We&apos;re AI-first in everything we do. We build with the latest models, ship with modern dev tooling, and move at a pace that traditional agencies and legacy software companies can&apos;t match. The result is better software, faster, at a fraction of the cost. If you&apos;re running a clinic and your back office still runs on spreadsheets, phone calls, and disconnected systems - we built this for you.</p>
            </div>
          </div>
        </div>

        <div className="about-logo-bar">
          <div className="about-logo-bar-label">Backed by investors from</div>
          <div className="about-logo-bar-track">
            <img src="/logos/shopify.png" alt="Shopify" />
            <img src="/logos/deepmind.png" alt="Google DeepMind" style={{height: 44, maxWidth: 180}} />
            <img src="/logos/rewind.png" alt="Rewind" style={{height: 44, maxWidth: 160}} />
            <img src="/logos/fellow.png" alt="Fellow" />
            <img src="/logos/y-combinator.png" alt="Y Combinator" />
            <img src="/logos/noibu.webp" alt="Noibu" />
            <img src="/logos/mistral.avif" alt="Mistral" />
            <img src="/logos/shopify.png" alt="Shopify" />
            <img src="/logos/deepmind.png" alt="Google DeepMind" style={{height: 44, maxWidth: 180}} />
            <img src="/logos/rewind.png" alt="Rewind" style={{height: 44, maxWidth: 160}} />
            <img src="/logos/fellow.png" alt="Fellow" />
            <img src="/logos/y-combinator.png" alt="Y Combinator" />
            <img src="/logos/noibu.webp" alt="Noibu" />
            <img src="/logos/mistral.avif" alt="Mistral" />
          </div>
        </div>

        <div className="about-cta">
          <div className="about-cta-box">
            <h2>Let&apos;s chat.</h2>
            <p>15 minutes. We&apos;ll show you what your clinic&apos;s custom platform looks like.</p>
            <a href="https://calendar.app.google/YvNVdxRdiXVhjXQDA" target="_blank" rel="noopener noreferrer" className="about-cta-btn">Book a Conversation &rarr;</a>
          </div>
        </div>

        <div className="about-footer">
          <Link href="/" className="about-nav-brand">
            <img src="/clinictech-logo.png" alt="ClinicTech" style={{ height: 20, opacity: 0.5 }} />
          </Link>
          <div className="about-footer-links">
            <Link href="/blog">Blog</Link>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </>
  );
}
