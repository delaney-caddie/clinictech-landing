import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CALENDAR_URL, AUDIT_CTA } from "@/lib/agents";

export const metadata = {
  title: "About | Caddie",
  description:
    "Meet Danika and Delaney, the founders building the technology partner regenerative medicine clinics have been missing.",
};

const beliefs = [
  {
    title: "Outcomes, not software",
    body: "We measure ourselves on the things that matter to a clinic: more patients, higher conversion, happier patients, and a practice that runs on less. Features are only interesting if they move one of those.",
  },
  {
    title: "One specialty, done properly",
    body: "Regenerative medicine has its own patient journey, its own questions, and often patients who travel for treatment. Building only for it is why our products fit on day one.",
  },
  {
    title: "A partner, not a vendor",
    body: "Every product we have shipped started as a problem a clinic owner brought to us. We build with clinics of every size, from one-person practices to multi-location networks.",
  },
];

export default function AboutPage() {
  return (
    <div className="ct-page">
      <style>{`
.about-hero {
  max-width: 820px; margin: 0 auto;
  padding: clamp(56px, 8vw, 96px) 24px 0; text-align: center;
}
.about-hero h1 { margin-left: auto; margin-right: auto; }
.about-hero p { font-size: 1.06rem; max-width: 640px; margin: 0 auto; }
.about-grid {
  display: grid; grid-template-columns: minmax(280px, 400px) 1fr;
  gap: clamp(32px, 5vw, 60px); align-items: center;
}
.about-img { border-radius: var(--r-xl); overflow: hidden; box-shadow: var(--shadow-lg); border: 1px solid var(--line); }
.about-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.about-body p { font-size: 1.02rem; margin-bottom: 16px; }
.about-body p:last-child { margin-bottom: 0; }
.about-quote {
  border-left: 3px solid var(--blue); margin: 0; padding: 6px 0 6px 20px;
  color: var(--ink); font-size: 1.08rem; font-style: italic; line-height: 1.6;
}
.about-photos { display: grid; grid-template-columns: 1.2fr 1fr; gap: 14px; margin-bottom: var(--section-y); }
.about-photos img { width: 100%; height: 100%; min-height: 220px; max-height: 340px; object-fit: cover; display: block; border-radius: var(--r-lg); border: 1px solid var(--line); box-shadow: var(--shadow-sm); }
.about-beliefs { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--grid-gap); margin-top: 32px; }
.about-belief { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg); box-shadow: var(--shadow-xs); padding: 26px 28px; }
.about-belief h3 { font-size: 1.1rem; font-weight: var(--font-subhead); margin-bottom: 10px; }
.about-belief p { margin: 0; font-size: .94rem; }
.about-ai-panel {
  color: #eef2fb;
  background:
    radial-gradient(760px 420px at 82% -12%, #6e8fff5c, #0000 62%),
    radial-gradient(640px 460px at -6% 112%, #8b5cf64d, #0000 60%),
    linear-gradient(152deg, #1a2b5c 0%, #23407e 52%, #1a2b5c 100%);
  border: 1px solid #ffffff26; border-radius: var(--r-xl);
  box-shadow: 0 14px 34px #1a2b5c30, 0 40px 90px #1a2b5c3d;
  margin-bottom: var(--section-y); padding: clamp(36px, 5vw, 64px);
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
  .about-beliefs { grid-template-columns: 1fr; }
  .about-photos { grid-template-columns: 1fr; }
  .about-cta-panel { flex-direction: column; align-items: stretch; }
}
@media (max-width: 720px) { .about-cta-panel { padding: 30px; } }
      `}</style>
      <SiteNav />
      <main>
        <section className="about-hero">
          <span className="eyebrow">Our mission</span>
          <h1>The tech partner regenerative medicine clinics have been missing.</h1>
          <p>
            Regenerative clinics deliver some of the most advanced care in
            medicine, on systems that are a decade behind. We exist to close that
            gap: to give every regenerative clinic the same technology as the top
            healthcare brands, without the price tag.
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
                With over 15 years in tech between them, Danika and Delaney started
                Caddie when a family friend needed help scaling their regenerative
                clinic. What began as one clinic&apos;s website and intake flow
                became a full platform, and then a partnership model, as more
                clinics asked for the same.
              </p>
              <p>
                Today Caddie works only with regenerative medicine clinics, from
                one-person practices to multi-location clinics operating
                worldwide, with a team where practicality, simplicity and outcomes
                come first in everything it ships.
              </p>
              <blockquote className="about-quote">
                &ldquo;Every product, feature and system we&apos;ve built solves a
                specific problem a clinic owner brought to us.&rdquo;
              </blockquote>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="about-photos">
            <img src="/photos/team-laughing.jpg" alt="A clinic team walking and laughing outside" loading="lazy" />
            <img src="/photos/doctor-colleagues.jpg" alt="A doctor smiling with colleagues" loading="lazy" />
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide">
            <span className="eyebrow">What we believe</span>
            <h2>Three things that shape everything we build.</h2>
          </div>
          <div className="about-beliefs">
            {beliefs.map((b) => (
              <article key={b.title} className="about-belief">
                <h3>{b.title}</h3>
                <p>{b.body}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <section className="about-ai-panel">
            <span className="eyebrow">AI-first, always</span>
            <h2>Better software, faster, at a fraction of the cost.</h2>
            <p>
              We are AI-first in everything we do. We build with the latest models,
              ship with modern tooling, and move at a pace traditional agencies and
              legacy software companies cannot match. That is how a clinic of any
              size gets technology that used to be reserved for the largest
              healthcare brands.
            </p>
          </section>
        </div>

        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <section className="about-cta-panel">
            <div>
              <h2>See what Caddie can do for your clinic.</h2>
              <p>
                It starts with a free audit of how your clinic runs today.
              </p>
            </div>
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
              {AUDIT_CTA}
            </a>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
