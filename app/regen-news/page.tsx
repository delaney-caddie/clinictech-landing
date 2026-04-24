"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

const articles = [
  { category: "Regulatory", country: "Japan", headline: "Japan grants world-first approval for two stem cell therapies", summary: "Japan has approved iPSC-derived treatments for Parkinson's disease and severe heart failure, marking the first full regulatory approval for stem cell-based regenerative therapies anywhere in the world.", source: "Science.org", url: "https://www.science.org/content/article/stem-cell-therapies-come-age-two-conditional-approvals-japan", featured: true, why: "This sets the regulatory precedent that every clinic owner has been watching. If Japan's approval framework holds, expect similar pathways to open in the US and EU within 24 months. Clinics offering MSC or PRP treatments should be positioning now for the credibility wave this creates." },
  { category: "Research", country: "US", headline: "Stem cells provide a potent new treatment for frailty in the elderly", summary: "A Nature study shows elderly patients with frailty increased endurance significantly after a single dose of mesenchymal stem cells, with results lasting over 12 months.", source: "Nature", url: "https://www.nature.com/articles/d41586-026-00584-y", featured: true, why: "Frailty is a massive addressable market. One in four people over 50 are affected. If your clinic treats aging-related conditions, this is the study to reference in patient-facing content and consultation scripts." },
  { category: "Clinical Trial", country: "US", headline: "Stem cell transplant without toxic preparation treats sickle cell disease", summary: "Stanford Medicine's Phase 1 trial demonstrates that an antibody-based preparation can replace toxic chemotherapy in stem cell transplants, dramatically reducing side effects.", source: "Stanford Medicine", url: "https://med.stanford.edu/news/all-news/2025/07/stem-cell-transplant.html" },
  { category: "Research", country: "US", headline: "New bioreactor produces 40 million immune cells per week from stem cells", summary: "Researchers have developed a cost-effective bioreactor that turns stem cells into human macrophages at industrial scale, opening new possibilities for off-the-shelf cell therapies.", source: "Phys.org", url: "https://phys.org/news/2026-04-bioreactor-stem-cells-immune-cell.html" },
  { category: "Clinical Trial", country: "US", headline: "UCLA reprogram stem cells to create renewable cancer-fighting T cells", summary: "First-in-human clinical trial shows that combining genetically engineered T cells with stem cells can produce cancer-fighting immune cells in humans, with durable responses.", source: "UCLA Health", url: "https://www.uclahealth.org/news/release/ucla-scientists-reprogram-stem-cells-create-renewable-cancer" },
  { category: "Clinical Trial", country: "US", headline: "First-ever in-utero stem cell therapy for spina bifida is safe", summary: "UC Davis researchers safely performed the world's first spina bifida treatment combining fetal surgery with placenta-derived stem cells in six patients.", source: "UC Davis Health", url: "https://health.ucdavis.edu/news/headlines/first-ever-in-utero-stem-cell-therapy-for-fetal-spina-bifida-repair-is-safe-study-finds/2026/02" },
  { category: "Research", country: "Canada", headline: "Stem cell engineering breakthrough paves way for next-generation living drugs", summary: "UBC researchers discover how to grow specialized immune cells for more accessible off-the-shelf cell therapies to treat cancer, autoimmune disorders, and infections.", source: "UBC Medicine", url: "https://www.med.ubc.ca/news/stem-cell-engineering-breakthrough-paves-way-for-next-generation-living-drugs/" },
  { category: "Industry", country: "US", headline: "Regenerative medicine marketing outpaces the science, experts warn", summary: "STAT News reports that marketing claims from regenerative medicine clinics are increasingly outpacing peer-reviewed evidence, raising concerns about patient safety and regulatory scrutiny.", source: "STAT News", url: "https://www.statnews.com/2025/12/18/regenerative-medicine-marketing-outpaces-the-science-miracles-giants/" },
  { category: "Regulatory", country: "US", headline: "NIH proposes shift in embryonic stem cell research to 'put patients first'", summary: "The NIH is seeking public input on redirecting embryonic stem cell funding toward technologies with better clinical outcomes, including iPSC-based approaches.", source: "NIH", url: "https://www.nih.gov/news-events/news-releases/nih-proposes-embryonic-stem-cell-research-shift-put-patients-first" },
];

export default function RegenNewsPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [filter, setFilter] = useState("All");

  const countries = ["All", "US", "Japan", "Canada"];
  const filtered = filter === "All" ? articles : articles.filter(a => a.country === filter);
  const featured = articles.filter(a => a.featured);
  const rest = filtered.filter(a => !a.featured);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "regen-news" }),
      });
      if (res.ok) setStatus("done");
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  return (
    <>
      <style>{`
        .rn { min-height: 100vh; background: #fff; }

        /* Hero */
        .rn-hero {
          padding: 140px 0 60px; background: #F8FAFC;
          border-bottom: 1px solid #E2E8F0;
        }
        .rn-hero-inner {
          max-width: 900px; margin: 0 auto; padding: 0 24px;
          display: grid; grid-template-columns: 1.3fr 1fr; gap: 48px; align-items: center;
        }
        .rn-hero-kicker {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1.5px; color: #3730A3; margin-bottom: 14px;
        }
        .rn-hero h1 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 36px; font-weight: 800; color: #0F172A;
          line-height: 1.15; margin-bottom: 14px;
        }
        .rn-hero p {
          font-size: 15px; color: #64748B; line-height: 1.7; margin-bottom: 24px;
        }
        .rn-subscribe {
          background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 24px;
        }
        .rn-subscribe-label {
          font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 12px;
        }
        .rn-subscribe-form { display: flex; gap: 8px; }
        .rn-subscribe-input {
          flex: 1; padding: 10px 14px; border: 1px solid #E2E8F0;
          border-radius: 8px; font-size: 14px; color: #0F172A;
          font-family: inherit; outline: none; background: #F8FAFC;
        }
        .rn-subscribe-input:focus { border-color: #3730A3; }
        .rn-subscribe-input::placeholder { color: #94A3B8; }
        .rn-subscribe-btn {
          padding: 10px 20px; background: #3730A3; color: #fff;
          border: none; border-radius: 8px; font-weight: 700; font-size: 13px;
          cursor: pointer; font-family: inherit; white-space: nowrap;
          transition: background 0.2s;
        }
        .rn-subscribe-btn:hover { background: #4338CA; }
        .rn-subscribe-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .rn-subscribe-note { font-size: 11px; color: #94A3B8; margin-top: 8px; }
        .rn-subscribe-done { font-size: 14px; color: #22C55E; font-weight: 600; }

        /* Stats bar */
        .rn-hero-stats {
          display: flex; gap: 24px; margin-top: 20px;
        }
        .rn-hero-stat {
          text-align: center;
        }
        .rn-hero-stat-num {
          font-size: 22px; font-weight: 800; color: #3730A3;
        }
        .rn-hero-stat-label { font-size: 11px; color: #94A3B8; }

        /* Content area */
        .rn-content {
          max-width: 900px; margin: 0 auto; padding: 48px 24px;
        }

        /* Filters */
        .rn-toolbar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 32px; padding-bottom: 16px; border-bottom: 1px solid #E2E8F0;
        }
        .rn-toolbar-title {
          font-size: 18px; font-weight: 700; color: #0F172A;
        }
        .rn-filters { display: flex; gap: 6px; }
        .rn-filter {
          padding: 6px 14px; border-radius: 6px; font-size: 12px;
          font-weight: 600; border: 1px solid #E2E8F0; background: #fff;
          color: #64748B; cursor: pointer; transition: all 0.15s;
          font-family: inherit;
        }
        .rn-filter:hover { border-color: #3730A3; color: #3730A3; }
        .rn-filter.active { background: #3730A3; color: #fff; border-color: #3730A3; }

        /* Featured */
        .rn-featured {
          display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px;
        }
        .rn-card {
          border: 1px solid #E2E8F0; border-radius: 12px; padding: 24px;
          transition: all 0.2s; background: #fff;
        }
        .rn-card:hover { border-color: #CBD5E1; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
        .rn-card-meta {
          display: flex; gap: 8px; align-items: center; margin-bottom: 10px;
        }
        .rn-card-cat {
          font-size: 10px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.5px; color: #3730A3; background: rgba(55,48,163,0.06);
          padding: 3px 10px; border-radius: 4px;
        }
        .rn-card-country { font-size: 10px; font-weight: 600; color: #94A3B8; }
        .rn-card h3 {
          font-size: 18px; font-weight: 700; color: #0F172A;
          line-height: 1.3; margin-bottom: 8px;
        }
        .rn-card h3 a { color: #0F172A; text-decoration: none; }
        .rn-card h3 a:hover { color: #3730A3; }
        .rn-card-summary { font-size: 13px; color: #64748B; line-height: 1.6; margin-bottom: 10px; }
        .rn-card-source { font-size: 11px; color: #94A3B8; }
        .rn-card-why {
          background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px;
          padding: 14px; margin-top: 12px;
        }
        .rn-card-why-label {
          font-size: 10px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.5px; color: #3730A3; margin-bottom: 4px;
        }
        .rn-card-why-text { font-size: 12px; color: #64748B; line-height: 1.5; }

        /* Grid */
        .rn-grid { display: grid; grid-template-columns: 1fr; gap: 0; }
        .rn-grid-item {
          display: grid; grid-template-columns: 1fr auto; gap: 16px;
          align-items: start;
          padding: 20px 0; border-bottom: 1px solid #F1F5F9;
        }
        .rn-grid-item:last-child { border-bottom: none; }
        .rn-grid-item h4 {
          font-size: 15px; font-weight: 700; color: #0F172A;
          line-height: 1.3; margin-bottom: 4px;
        }
        .rn-grid-item h4 a { color: #0F172A; text-decoration: none; }
        .rn-grid-item h4 a:hover { color: #3730A3; }
        .rn-grid-item-summary { font-size: 13px; color: #64748B; line-height: 1.5; }
        .rn-grid-item-meta {
          display: flex; gap: 8px; align-items: center; margin-top: 6px;
        }
        .rn-grid-item-source { font-size: 11px; color: #94A3B8; }

        /* Bottom CTA */
        .rn-bottom {
          max-width: 900px; margin: 0 auto; padding: 0 24px 80px;
        }
        .rn-bottom-card {
          background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px;
          padding: 40px; text-align: center;
        }
        .rn-bottom-card h2 {
          font-size: 24px; font-weight: 800; color: #0F172A; margin-bottom: 8px;
        }
        .rn-bottom-card p { font-size: 14px; color: #64748B; margin-bottom: 20px; }
        .rn-bottom-card .rn-subscribe-form {
          max-width: 420px; margin: 0 auto;
        }

        /* Footer */
        .rn-footer {
          max-width: 900px; margin: 0 auto; padding: 32px 24px;
          display: flex; justify-content: space-between; align-items: center;
          border-top: 1px solid #E2E8F0; font-size: 12px; color: #94A3B8;
        }
        .rn-footer a { color: #64748B; text-decoration: none; }
        .rn-footer a:hover { color: #3730A3; }
        .rn-footer-links { display: flex; gap: 20px; }

        @media (max-width: 900px) {
          .rn-hero-inner { grid-template-columns: 1fr; gap: 32px; }
          .rn-featured { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .rn-hero { padding: 110px 0 40px; }
          .rn-hero h1 { font-size: 28px; }
          .rn-subscribe-form { flex-direction: column; }
          .rn-toolbar { flex-direction: column; gap: 12px; align-items: flex-start; }
          .rn-footer { flex-direction: column; gap: 12px; text-align: center; }
          .rn-hero-stats { gap: 16px; }
        }
      `}</style>

      <div className="rn">
        <SiteNav />

        {/* Hero */}
        <section className="rn-hero">
          <div className="rn-hero-inner">
            <div>
              <div className="rn-hero-kicker">Regen News by ClinicTech</div>
              <h1>The weekly briefing for regenerative medicine clinic owners.</h1>
              <p>Research, regulatory moves, and market shifts that affect your clinic. We read the papers, track the trials, and follow the money so you don&apos;t have to.</p>
              <div className="rn-hero-stats">
                <div className="rn-hero-stat"><div className="rn-hero-stat-num">200+</div><div className="rn-hero-stat-label">Subscribers</div></div>
                <div className="rn-hero-stat"><div className="rn-hero-stat-num">Weekly</div><div className="rn-hero-stat-label">Every Monday</div></div>
                <div className="rn-hero-stat"><div className="rn-hero-stat-num">Free</div><div className="rn-hero-stat-label">Always</div></div>
              </div>
            </div>
            <div className="rn-subscribe">
              <div className="rn-subscribe-label">Subscribe to Regen News</div>
              {status === "done" ? (
                <div className="rn-subscribe-done">You&apos;re in. Watch for the first issue Monday.</div>
              ) : (
                <>
                  <form className="rn-subscribe-form" onSubmit={handleSubscribe}>
                    <input className="rn-subscribe-input" type="email" required placeholder="you@clinic.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <button className="rn-subscribe-btn" type="submit" disabled={status === "sending"}>{status === "sending" ? "..." : "Subscribe"}</button>
                  </form>
                  {status === "error" && <div style={{fontSize:12,color:"#EF4444",marginTop:8}}>Something went wrong. Please try again.</div>}
                  <div className="rn-subscribe-note">Free. No spam. Unsubscribe anytime.</div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="rn-content">
          <div className="rn-toolbar">
            <div className="rn-toolbar-title">This Week in Regen Med</div>
            <div className="rn-filters">
              {countries.map(c => (
                <button key={c} className={`rn-filter ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
              ))}
            </div>
          </div>

          {/* Featured */}
          <div className="rn-featured">
            {featured.map((a, i) => (
              <div key={i} className="rn-card">
                <div className="rn-card-meta">
                  <span className="rn-card-cat">{a.category}</span>
                  <span className="rn-card-country">{a.country}</span>
                </div>
                <h3><a href={a.url} target="_blank" rel="noopener noreferrer">{a.headline}</a></h3>
                <div className="rn-card-summary">{a.summary}</div>
                <div className="rn-card-source">{a.source}</div>
                {a.why && (
                  <div className="rn-card-why">
                    <div className="rn-card-why-label">Why this matters for your clinic</div>
                    <div className="rn-card-why-text">{a.why}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* List */}
          <div className="rn-grid">
            {rest.map((a, i) => (
              <div key={i} className="rn-grid-item">
                <div>
                  <h4><a href={a.url} target="_blank" rel="noopener noreferrer">{a.headline}</a></h4>
                  <div className="rn-grid-item-summary">{a.summary}</div>
                  <div className="rn-grid-item-meta">
                    <span className="rn-card-cat">{a.category}</span>
                    <span className="rn-card-country">{a.country}</span>
                    <span className="rn-grid-item-source">{a.source}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rn-bottom">
          <div className="rn-bottom-card">
            <h2>Don&apos;t miss a week.</h2>
            <p>The news that matters for regenerative medicine clinic owners. Delivered every Monday.</p>
            {status === "done" ? (
              <div className="rn-subscribe-done">You&apos;re subscribed.</div>
            ) : (
              <form className="rn-subscribe-form" onSubmit={handleSubscribe}>
                <input className="rn-subscribe-input" type="email" required placeholder="you@clinic.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button className="rn-subscribe-btn" type="submit" disabled={status === "sending"}>{status === "sending" ? "..." : "Subscribe"}</button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="rn-footer">
          <span>Regen News by <Link href="/">ClinicTech</Link></span>
          <div className="rn-footer-links">
            <Link href="/blog">Blog</Link>
            <Link href="/about">About</Link>
            <Link href="/">clinictech.io</Link>
          </div>
        </div>
      </div>
    </>
  );
}
