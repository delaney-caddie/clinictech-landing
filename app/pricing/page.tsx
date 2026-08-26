import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PlaybookPanel } from "@/components/playbook-panel";
import { CALENDAR_URL } from "@/lib/agents";

export const metadata = {
  title: "Pricing | Caddie",
  description:
    "Everything your front office needs, in one platform. Every quote is built around the AI employees your clinic actually needs — book a demo for yours.",
};

// No public prices by design: quotes are custom-sized per clinic, so the page
// sells what's included and routes to a demo. Real numbers live in the
// proposal deck.
const plans = [
  {
    title: "Clinic OS + AI Employees",
    note: "The platform, and the team that runs on it",
    lead: true,
    items: [
      "Agentic CRM that works every lead automatically",
      "Branded patient portal and operating system",
      "AI employees for the roles you need — start with one, add more as you grow",
      "Every channel: phone, text, email, web chat, WhatsApp and social",
      "Your company brain, built around your treatments, pricing and tone",
      "HIPAA-compliant handling of PHI",
      "Onboarding and setup done for you",
      "Full-time support with under 1 day turnaround",
    ],
  },
  {
    title: "EHR add-on",
    note: "Run your clinical records on Caddie too",
    lead: false,
    items: [
      "Caddie as your clinical system of record",
      "Charting, treatment records and documentation",
      "One system, so nothing needs syncing or reconciling",
      "Or keep your existing EHR and connect it to Caddie instead",
      "Integration takes about two weeks on average",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="ct-page">
      <style>{`
.pricing-hero {
  max-width: 820px; margin: 0 auto;
  padding: clamp(56px, 8vw, 96px) 24px 0; text-align: center;
}
.pricing-hero h1 { margin-left: auto; margin-right: auto; }
.pricing-hero p { font-size: 1.06rem; max-width: 620px; margin: 0 auto; }

.plan-grid {
  display: grid; grid-template-columns: 1.1fr .9fr; gap: var(--grid-gap);
  max-width: 1020px; margin: 0 auto;
  align-items: start;
}
.plan-card {
  background: var(--surface); border: 1px solid var(--line-strong);
  border-radius: var(--r-xl); box-shadow: var(--shadow-sm);
  padding: clamp(26px, 3vw, 38px);
  display: flex; flex-direction: column;
}
.plan-card.lead { border-color: var(--blue); box-shadow: 0 0 0 1px var(--blue), var(--shadow-md); }
.plan-card h2 { font-size: 1.4rem; margin-bottom: 4px; }
.ct-page .plan-note { color: var(--muted-ink); font-size: .92rem; margin: 0 0 20px; }
.plan-card ul { list-style: none; margin: 0 0 26px; padding: 0; display: grid; gap: 11px; }
.plan-card li {
  font-size: .94rem; color: var(--ink-soft); line-height: 1.5;
  display: flex; gap: 11px; align-items: baseline;
}
.plan-card li::before {
  content: "\\2713"; flex: none;
  width: 19px; height: 19px; border-radius: 999px;
  background: var(--blue-wash); color: var(--blue-deep);
  font-size: .64rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  transform: translateY(2px);
}
.plan-card .button { margin-top: auto; align-self: flex-start; }

/* Scoped with .ct-page so it outranks the global paragraph margin reset. */
.ct-page .pricing-footline {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  width: fit-content; max-width: 100%; margin: 36px auto 0;
  background: var(--blue-wash); border: 1px solid #dde6f8; border-radius: 999px;
  color: var(--blue-ink); padding: 13px 24px;
  font-size: .96rem; font-weight: 560; text-align: center;
}
@media (max-width: 1020px) {
  .plan-grid { grid-template-columns: 1fr; }
}
      `}</style>

      <SiteNav />

      <main>
        <section className="pricing-hero">
          <span className="eyebrow">Pricing</span>
          <h1>Everything your front office needs, in one platform.</h1>
          <p>
            Every clinic runs differently, so every quote is built around the AI
            employees you actually need. Book a demo and we will price it against
            your real pipeline.
          </p>
        </section>

        <section className="section" style={{ paddingTop: 40 }}>
          <div className="plan-grid">
            {plans.map((p) => (
              <article key={p.title} className={`plan-card${p.lead ? " lead" : ""}`}>
                <h2>{p.title}</h2>
                <p className="plan-note">{p.note}</p>
                <ul>
                  {p.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a
                  href={CALENDAR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button"
                >
                  Book a demo
                </a>
              </article>
            ))}
          </div>
          <p className="pricing-footline">
            Book a demo to receive your custom quote. No per-seat fees and no
            setup cost.
          </p>
        </section>

        <PlaybookPanel />
      </main>

      <SiteFooter />
    </div>
  );
}
