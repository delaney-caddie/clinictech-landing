import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { InvestorStrip } from "@/components/investor-strip";
import { CALENDAR_URL } from "@/lib/agents";

export const metadata = {
  title: "About | Caddie",
  description:
    "Meet Danika and Delaney, the founders bringing the automation and technology the tech industry runs on into medical.",
};

export default function AboutPage() {
  return (
    <div className="ct-page">
      <style>{`
.about-hero {
  max-width: 820px; margin: 0 auto;
  padding: clamp(56px, 8vw, 96px) 24px 0; text-align: center;
}
.about-hero h1 { margin-left: auto; margin-right: auto; }
.about-hero p { font-size: 1.06rem; max-width: 620px; margin: 0 auto; }
.about-grid {
  display: grid; grid-template-columns: minmax(280px, 400px) 1fr;
  gap: clamp(32px, 5vw, 60px); align-items: center;
}
.about-img {
  border-radius: var(--r-xl); overflow: hidden; box-shadow: var(--shadow-lg);
  border: 1px solid var(--line);
}
.about-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.about-body p { font-size: 1.02rem; margin-bottom: 16px; }
.about-body p:last-child { margin-bottom: 0; }
.about-quote {
  border-left: 3px solid var(--blue); margin: 0; padding: 6px 0 6px 20px;
  color: var(--ink); font-size: 1.08rem; font-style: italic; line-height: 1.6;
}
.about-ai-panel {
  color: #eef2fb;
  background:
    radial-gradient(760px 420px at 82% -12%, #6e8fff5c, #0000 62%),
    radial-gradient(640px 460px at -6% 112%, #8b5cf64d, #0000 60%),
    linear-gradient(152deg, #1a2b5c 0%, #23407e 52%, #1a2b5c 100%);
  border: 1px solid #ffffff26;
  border-radius: var(--r-xl);
  box-shadow: 0 14px 34px #1a2b5c30, 0 40px 90px #1a2b5c3d;
  margin-bottom: var(--section-y);
  padding: clamp(36px, 5vw, 64px);
}
.about-ai-panel .eyebrow { color: #a7c0ff; }
.about-ai-panel h2 { color: #fff; }
.about-ai-panel p { color: #c2cff0; max-width: 680px; margin-bottom: 0; font-size: 1.02rem; }
.about-cta-panel {
  border-radius: var(--r-xl); box-shadow: var(--shadow-md); color: var(--ink);
  gap: var(--grid-gap-lg); margin-bottom: var(--section-y);
  background:
    radial-gradient(900px 500px at 88% 0, #355cff29, #0000 62%),
    linear-gradient(138deg, #f4f7ff 0%, #e7eeff 50%, #d8e4ff 100%);
  border: 1px solid #dde6f8;
  justify-content: space-between; align-items: center; padding: 56px; display: flex;
}
.about-cta-panel h2 { margin-bottom: 10px; }
.about-cta-panel p { color: var(--ink-soft); max-width: 640px; margin-bottom: 0; }
@media (max-width: 1020px) {
  .about-grid { grid-template-columns: 1fr; }
  .about-img { max-width: 400px; margin: 0 auto; }
  .about-cta-panel { flex-direction: column; align-items: stretch; }
}
@media (max-width: 720px) {
  .about-cta-panel { padding: 30px; }
}
      `}</style>
      <SiteNav />
      <main>
        <section className="about-hero">
          <span className="eyebrow">Our mission</span>
          <h1>Bringing tech-industry automation into medical.</h1>
          <p>
            We&apos;re on a mission to bring the same level of automation and technology
            the tech industry runs on into medical. Clinics deliver world-class care,
            but the systems behind them are still stuck a decade back. We&apos;re here
            to close that gap.
          </p>
        </section>

        <section className="section">
          <div className="about-grid">
            <div className="about-img">
              <img src="/founders.png" alt="Danika and Delaney, founders of Caddie" />
            </div>
            <div className="about-body">
              <span className="eyebrow">The founders</span>
              <p>
                With over 15 years in tech between them, Danika and Delaney are bringing
                everything they&apos;ve learned to the medical industry. It started when
                a family friend needed help scaling their practice. The founders got to
                work and built what every medical clinic wished they&apos;d had 10 years
                ago.
              </p>
              <p>
                With their AI-first and go-to-market expertise, they&apos;ve built a team
                where practicality, simplicity, and outcomes come first in everything
                they ship.
              </p>
              <blockquote className="about-quote">
                &ldquo;Every product, feature, and system we&apos;ve built solves a
                specific problem our clinic owners brought to us.&rdquo;
              </blockquote>
            </div>
          </div>
        </section>

        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <section className="about-ai-panel">
            <span className="eyebrow">AI-first, always</span>
            <h2>Better software, faster, at a fraction of the cost.</h2>
            <p>
              We&apos;re AI-first in everything we do. We build with the latest models,
              ship with modern dev tooling, and move at a pace traditional agencies and
              legacy software companies can&apos;t match. The result is better software,
              faster, at a fraction of the cost. If you&apos;re running a clinic and
              your back office still runs on spreadsheets, phone calls, and disconnected
              systems, we built this for you.
            </p>
          </section>
        </div>

        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <section className="about-cta-panel">
            <div>
              <h2>See what Caddie can do for your clinic.</h2>
              <p>
                It starts with a short conversation about how your clinic actually runs.
              </p>
            </div>
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
              Book a demo
            </a>
          </section>
        </div>

        <InvestorStrip divider={false} standalone />
      </main>
      <SiteFooter />
    </div>
  );
}
