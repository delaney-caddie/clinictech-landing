import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PlaybookPanel } from "@/components/playbook-panel";
import { FaqSection } from "@/components/faq-section";
import { CALENDAR_URL, AUDIT_CTA } from "@/lib/agents";

export const metadata = {
  title: "Pricing | Caddie",
  description:
    "Caddie is priced à la carte around what your regenerative clinic actually needs. It starts with a free clinic audit, then a proposal built for your clinic.",
};

// No public prices by design: every clinic is priced from its audit.
const steps = [
  {
    title: "A free audit of your clinic",
    body: "A 30-minute call where we look at how your clinic runs today — where inquiries come from, how they are handled, and what happens after treatment — and find the gaps and the biggest areas of impact.",
  },
  {
    title: "A proposal built for your clinic",
    body: "From the audit we put together a proposal with only what will move the needle for you. Priced à la carte, so you never pay for products you will not use.",
  },
  {
    title: "Launch, then keep improving",
    body: "Onboarding and setup are done for you. As your clinic grows, add what you need — or move to a dedicated tech partnership when you want software built around you.",
  },
];

const included = [
  "Only the products your clinic needs, nothing bundled in",
  "No per-seat fees, so growing your team does not grow your bill",
  "Onboarding and setup done for you",
  "Support with under one day turnaround",
  "HIPAA-compliant handling of patient data",
  "A dedicated tech partnership option for custom software",
];

const sizes = [
  {
    photo: "/photos/clinic-park.jpg",
    title: "Single-practitioner clinics",
    body: "One doctor, one coordinator. Usually starts with capturing and converting every inquiry, and a patient experience that feels bigger than the clinic.",
  },
  {
    photo: "/photos/clinic-lush.jpg",
    title: "Multi-provider clinics",
    body: "Several practitioners, a growing front office. Usually one connected system replacing a patchwork of tools, and follow-up that runs on its own.",
  },
  {
    photo: "/photos/clinic-glass.jpg",
    title: "Multi-location networks",
    body: "Up to 80+ locations worldwide. Centralised intake and routing, group-wide visibility, and often a dedicated partnership for custom software.",
  },
];

export default function PricingPage() {
  return (
    <div className="ct-page">
      <style>{`
.pricing-hero {
  max-width: 840px; margin: 0 auto;
  padding: clamp(56px, 8vw, 96px) 24px 0; text-align: center;
}
.pricing-hero h1 { margin-left: auto; margin-right: auto; }
.pricing-hero p { font-size: 1.06rem; max-width: 640px; margin: 0 auto; }
.pricing-hero-actions { display: flex; flex-direction: column; align-items: center; gap: 10px; margin-top: 28px; }
.pricing-hero-actions span { color: var(--faint); font-size: .84rem; }

.pr-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--grid-gap); max-width: 1080px; margin: 0 auto; }
.pr-step { background: var(--surface); border: 1px solid var(--line-strong); border-radius: var(--r-lg); box-shadow: var(--shadow-sm); padding: 28px 30px; }
.pr-step.lead { border-color: var(--blue); box-shadow: 0 0 0 1px var(--blue), var(--shadow-md); }
.pr-num {
  width: 44px; height: 44px; border-radius: 999px; background: var(--blue-wash); color: var(--blue-deep);
  border: 1px solid #dde6f8; font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: .95rem; font-weight: 600; display: grid; place-items: center; margin-bottom: 16px;
}
.pr-step h2 { font-size: 1.2rem; margin-bottom: 8px; }
.pr-step p { margin: 0; font-size: .94rem; }

.pr-split { display: grid; grid-template-columns: 1fr 1fr; gap: var(--grid-gap-lg); align-items: start; max-width: 1080px; margin: 0 auto; }
.pr-why h2 { margin-bottom: 12px; }
.pr-why p { margin-bottom: 14px; }
.pr-included { background: var(--wash); border: 1px solid var(--line); border-radius: var(--r-lg); padding: 28px 30px; }
.pr-included h3 { font-size: 1rem; font-weight: 650; margin-bottom: 14px; }
.pr-included ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 11px; }
.pr-included li { font-size: .94rem; color: var(--ink-soft); line-height: 1.5; display: flex; gap: 11px; align-items: baseline; }
.pr-included li::before {
  content: "\\2713"; flex: none; width: 19px; height: 19px; border-radius: 999px;
  background: var(--blue-wash); color: var(--blue-deep); font-size: .64rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; transform: translateY(2px);
}

.pr-sizes { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--grid-gap); margin-top: 30px; }
.pr-size { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg); box-shadow: var(--shadow-xs); overflow: hidden; }
.pr-size img { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; display: block; }
.pr-size > div { padding: 22px 26px 26px; }
.pr-size h3 { font-size: 1.08rem; font-weight: var(--font-subhead); margin-bottom: 8px; }
.pr-size p { margin: 0; font-size: .93rem; }

.pr-cta {
  border-radius: var(--r-xl); box-shadow: var(--shadow-md); color: var(--ink);
  gap: var(--grid-gap-lg); margin-bottom: var(--section-y);
  background:
    radial-gradient(900px 500px at 88% 0, #355cff29, #0000 62%),
    linear-gradient(138deg, #f4f7ff 0%, #e7eeff 50%, #d8e4ff 100%);
  border: 1px solid #dde6f8;
  justify-content: space-between; align-items: center; padding: 56px; display: flex;
}
.pr-cta h2 { margin-bottom: 10px; }
.pr-cta p { color: var(--ink-soft); max-width: 640px; margin-bottom: 0; }
@media (max-width: 1020px) {
  .pr-steps, .pr-sizes { grid-template-columns: 1fr; }
  .pr-split { grid-template-columns: 1fr; }
  .pr-cta { flex-direction: column; align-items: stretch; }
}
@media (max-width: 720px) { .pr-cta { padding: 30px; } }
      `}</style>

      <SiteNav />

      <main>
        <section className="pricing-hero">
          <span className="eyebrow">Pricing</span>
          <h1>Priced à la carte, around your clinic.</h1>
          <p>
            Every clinic is unique and has specific needs, so we do not sell
            packages. We start with a free audit of your practice, find the gaps
            and the biggest areas of impact, and put together a proposal for
            your clinic from there.
          </p>
          <div className="pricing-hero-actions">
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
              {AUDIT_CTA}
            </a>
            <span>Free, 30 minutes, no obligation.</span>
          </div>
        </section>

        {/* How it works */}
        <section className="section" style={{ paddingTop: 44 }}>
          <div className="pr-steps">
            {steps.map((s, i) => (
              <article key={s.title} className={`pr-step${i === 0 ? " lead" : ""}`}>
                <div className="pr-num">0{i + 1}</div>
                <h2>{s.title}</h2>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Why a la carte + what is always included */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="pr-split">
            <div className="pr-why">
              <span className="eyebrow">Why à la carte</span>
              <h2>Because no two regenerative clinics need the same thing.</h2>
              <p>
                A single-practitioner clinic and an 80-location network have very
                different gaps. A fixed package would over-charge one and
                under-serve the other, so we price each clinic from its audit
                instead.
              </p>
              <p>
                You get a clear proposal with only what will make a difference for
                your clinic, and you can add more as you grow.
              </p>
            </div>
            <div className="pr-included">
              <h3>Always included</h3>
              <ul>
                {included.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Sizes */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide">
            <span className="eyebrow">Who we work with</span>
            <h2>From one practitioner to 80+ locations worldwide.</h2>
            <p>
              We only work with regenerative medicine clinics, and all of our
              products are built with that in mind.
            </p>
          </div>
          <div className="pr-sizes">
            {sizes.map((s) => (
              <article key={s.title} className="pr-size">
                <img src={s.photo} alt="" loading="lazy" />
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <section className="pr-cta">
            <div>
              <h2>Start with your free clinic audit.</h2>
              <p>
                Thirty minutes to find out where your clinic is losing patients and
                revenue, and what would fix it. Your proposal follows from there.
              </p>
            </div>
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
              {AUDIT_CTA}
            </a>
          </section>
        </div>

        <PlaybookPanel />
        <FaqSection />
      </main>

      <SiteFooter />
    </div>
  );
}
