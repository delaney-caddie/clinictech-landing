import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CALENDAR_URL } from "@/lib/agents";

export const metadata = {
  title: "Integrations | Caddie",
  description:
    "Caddie can act as your EHR or connect to the EHR/EMR platform your clinic already uses. Run your front office on Caddie and keep your clinical records where they are.",
};

// The front-office / clinical split. This page's job is to make the boundary
// explicit: what runs on Caddie, and what stays in the EHR.
const caddieSide = [
  "Patient inquiries answered on every channel, 24/7",
  "Lead follow-up, qualification, and booking",
  "Marketing: socials, SEO content, and campaigns",
  "Admin: inbox, reminders, confirmations, reviews",
];

const ehrSide = [
  "Clinical notes and charting",
  "Treatment records and medical history",
  "Prescriptions and clinical documentation",
  "Everything your license and workflows require",
];

const faqs = [
  {
    q: "What is a medical EHR software?",
    a: "An EHR (electronic health record) is the system where a clinic stores its clinical records: patient charts, treatment notes, medical history, and documentation. It is the clinical system of record. Caddie can act as that system for your clinic, or sit alongside the EHR you already use and handle everything in front of it: inquiries, follow-up, booking, marketing, and admin.",
  },
  {
    q: "How long does it take for Caddie to integrate with my EHR?",
    a: "Around 2 weeks on average. The exact timeline depends on your EHR and what you want flowing between the two systems, and we scope it together during your discovery calls so you know before anything is built.",
  },
  {
    q: "What information can be pushed into or pulled out of the EHR?",
    a: "Usually all the standard information you would need: patient details, appointments, and intake information flowing in, and the records your front office needs flowing out. The specifics depend on your EHR's API documentation, which we will go over with you during the discovery calls so the boundaries are clear before we connect anything.",
  },
];

export default function IntegrationsPage() {
  return (
    <div className="ct-page">
      <style>{`
.int-hero {
  max-width: 780px; margin: 0 auto;
  padding: clamp(56px, 8vw, 96px) 24px 0; text-align: center;
}
.int-hero h1 { margin-left: auto; margin-right: auto; }
.int-hero p { font-size: 1.06rem; max-width: 640px; margin: 0 auto; }

.int-paths { display: grid; grid-template-columns: 1fr 1fr; gap: var(--grid-gap); }
.int-path {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg);
  box-shadow: var(--shadow-xs); padding: var(--card-pad);
  display: flex; flex-direction: column;
}
.int-path .eyebrow { margin-bottom: 12px; }
.int-path h3 { font-size: var(--h2-card); font-weight: var(--font-subhead); margin-bottom: 12px; }
.int-path p { font-size: .96rem; margin: 0; }

.int-split { display: grid; grid-template-columns: 1fr 1fr; gap: var(--grid-gap); margin-top: 32px; }
.int-col {
  border: 1px solid var(--line); border-radius: var(--r-lg);
  background: var(--surface); box-shadow: var(--shadow-xs); overflow: hidden;
}
.int-col-head {
  padding: 18px 24px; font-weight: 640; font-size: 1rem; color: var(--ink);
  border-bottom: 1px solid var(--line);
}
.int-col.is-caddie .int-col-head { background: var(--blue-wash); color: var(--blue-ink); }
.int-col ul { list-style: none; margin: 0; padding: 10px 24px 18px; }
.int-col li {
  padding: 10px 0; font-size: .93rem; color: var(--ink-soft);
  border-bottom: 1px solid var(--line); display: flex; gap: 10px; align-items: baseline;
}
.int-col li:last-child { border-bottom: 0; }
.int-col li::before {
  content: ""; width: 7px; height: 7px; border-radius: 999px; flex: none;
  background: var(--line-strong); transform: translateY(-1px);
}
.int-col.is-caddie li::before { background: var(--blue); }
.int-note {
  margin: 26px auto 0; max-width: 720px; text-align: center;
  color: var(--muted-ink); font-size: .95rem;
}

.int-faq { display: grid; grid-template-columns: .72fr 1fr; gap: 56px; }
.int-faq-list details { border-top: 1px solid var(--line); }
.int-faq-list details:last-child { border-bottom: 1px solid var(--line); }
.int-faq-list summary {
  color: var(--ink); cursor: pointer; letter-spacing: -.012em;
  justify-content: space-between; align-items: center; gap: 18px; padding: 22px 0;
  font-size: 1.04rem; font-weight: 560; list-style: none; transition: color .16s; display: flex;
}
.int-faq-list summary::-webkit-details-marker { display: none; }
.int-faq-list summary::after {
  color: var(--faint); content: "+"; flex: none; font-size: 1.3rem; font-weight: 400; line-height: 1;
  transition: transform .22s var(--ease), color .16s ease;
}
.int-faq-list details[open] summary::after { color: var(--blue); transform: rotate(45deg); }
.int-faq-list summary:hover { color: var(--blue); }
.int-faq-list p { max-width: 560px; margin: 0 0 24px; }

.int-cta {
  border-radius: var(--r-xl); box-shadow: var(--shadow-md); color: var(--ink);
  gap: var(--grid-gap-lg);
  background:
    radial-gradient(900px 500px at 88% 0, #355cff29, #0000 62%),
    linear-gradient(138deg, #f4f7ff 0%, #e7eeff 50%, #d8e4ff 100%);
  border: 1px solid #dde6f8;
  justify-content: space-between; align-items: center;
  padding: 56px; display: flex;
}
.int-cta h2 { margin-bottom: 10px; }
.int-cta p { color: var(--ink-soft); max-width: 640px; margin-bottom: 0; }

@media (max-width: 1020px) {
  .int-paths, .int-split { grid-template-columns: 1fr; }
  .int-faq { grid-template-columns: 1fr; gap: 28px; }
  .int-cta { flex-direction: column; align-items: stretch; }
}
@media (max-width: 720px) {
  .int-cta { padding: 30px; }
}
      `}</style>

      <SiteNav />

      <main>
        <header className="int-hero">
          <span className="eyebrow">Integrations</span>
          <h1>Works with your EHR. Or replaces it.</h1>
          <p>
            Caddie&apos;s platform can act as your clinic&apos;s EHR, or connect
            with most existing EHR and EMR platforms. Either way, your front
            office runs itself and your clinical records stay exactly where
            they belong.
          </p>
        </header>

        {/* Two ways to run Caddie */}
        <section className="section">
          <div className="int-paths">
            <article className="int-path">
              <span className="eyebrow">Option one</span>
              <h3>Caddie as your system of record</h3>
              <p>
                Run your whole clinic on Caddie: patient records, scheduling,
                communication, and the full front office in one platform, with
                your AI employees working on top of it. One system, no syncing,
                nothing to reconcile.
              </p>
            </article>
            <article className="int-path">
              <span className="eyebrow">Option two</span>
              <h3>Caddie + the EHR you already use</h3>
              <p>
                Keep your existing EHR/EMR for clinical records and connect
                Caddie in front of it. Caddie runs sales, marketing, and admin,
                and once a lead becomes a patient, their details flow into your
                EHR, where your clinical notes live from that point on.
              </p>
            </article>
          </div>
        </section>

        {/* Where the line sits */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide">
            <span className="eyebrow">A clear division of labor</span>
            <h2>Caddie runs the front office. Your EHR keeps the chart.</h2>
          </div>
          <div className="int-split">
            <div className="int-col is-caddie">
              <div className="int-col-head">Runs on Caddie</div>
              <ul>
                {caddieSide.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="int-col">
              <div className="int-col-head">Stays in your EHR</div>
              <ul>
                {ehrSide.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="int-note">
            The handoff is explicit: Caddie works the lead until they become a
            patient, then your EHR holds the clinical relationship. Your AI
            employees never chart, diagnose, or touch clinical documentation.
          </p>
        </section>

        {/* EHR FAQ */}
        <section className="section int-faq" style={{ paddingTop: 0 }}>
          <div className="section-copy">
            <span className="eyebrow">EHR questions</span>
            <h2>How the integration actually works.</h2>
            <p>
              Every clinic&apos;s stack is different. Bring your setup to a
              demo and we will map the integration against your exact EHR.
            </p>
            <div className="section-action">
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button secondary">
                Book a demo
              </a>
            </div>
          </div>
          <div className="int-faq-list">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="int-cta">
            <div>
              <h2>See it running against your stack.</h2>
              <p>Bring your EHR to a demo and we will show you where Caddie fits.</p>
            </div>
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
              Book a demo
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
