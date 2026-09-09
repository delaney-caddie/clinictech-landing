import { CALENDAR_URL, AUDIT_CTA } from "@/lib/agents";

// Deliberately general: sizes, geography, how an engagement starts, and the
// data question every clinic owner asks. Product detail lives on the call.
const faqs = [
  {
    q: "What sizes of clinic do you work with?",
    a: "All of them. Our smallest clients are single-practitioner clinics with one coordinator; our largest are multi-location regenerative medicine networks operating worldwide. The setup is different at each end, which is why every engagement starts with an audit of your clinic rather than a standard package.",
  },
  {
    q: "Which countries do you work in?",
    a: "We work with regenerative medicine clinics worldwide. Our clients today are across North America and Latin America, including clinics that treat international patients, and the platform supports English and Spanish out of the box.",
  },
  {
    q: "Do you only work with regenerative medicine clinics?",
    a: "Yes, by choice. Every product we build is designed around how regenerative clinics attract, convert and care for patients — from stem cell and PRP inquiries to patients who travel for treatment. That focus is what makes it work, so we do not take on other specialties.",
  },
  {
    q: "What happens in the free clinic audit?",
    a: "A 30-minute call where we look at how your clinic runs today: where inquiries come from, how quickly they are answered, what happens between the first message and the treatment, and what happens after. We map the gaps and the places where the most revenue is leaking, then show you which changes would have the biggest impact. There is no obligation.",
  },
  {
    q: "How is Caddie priced?",
    a: "À la carte, around what your clinic actually needs. After the audit we put together a proposal for your clinic — no bundles you will not use, no per-seat fees. Pricing scales with the size of the clinic, and we offer a dedicated tech partnership for clinics that need custom software built and launched with them.",
  },
  {
    q: "Do we have to replace the software we already use?",
    a: "No. Caddie can connect to the EHR, calendar and tools you already run, or replace the ones you would rather retire. We decide that together during the audit, based on what is working for you and what is not.",
  },
  {
    q: "How long does it take to get up and running?",
    a: "Most clinics are live within a few weeks of the proposal. Onboarding and setup are done for you, and integrations with an existing EHR take about two weeks on average.",
  },
  {
    q: "Is our patient data secure?",
    a: "Yes. Caddie is HIPAA-compliant by design: patient data is encrypted in transit and at rest, access is role-based with full audit logs, every conversation is recorded and reviewable, and patient data is never used to train shared models. The details are on our Safety & HIPAA page.",
  },
];

export function FaqSection() {
  return (
    <section className="section faq-section">
      <style>{`
.faq-section { grid-template-columns: .72fr 1fr; gap: 56px; display: grid; }
.faq-list { display: grid; }
.faq-list details { border-top: 1px solid var(--line); }
.faq-list details:last-child { border-bottom: 1px solid var(--line); }
.faq-list summary {
  color: var(--ink); cursor: pointer; letter-spacing: -.012em;
  justify-content: space-between; align-items: center; gap: 18px; padding: 22px 0;
  font-size: 1.04rem; font-weight: 560; list-style: none; transition: color .16s; display: flex;
}
.faq-list summary::-webkit-details-marker { display: none; }
.faq-list summary::after {
  color: var(--faint); content: "+"; flex: none; font-size: 1.3rem; font-weight: 400; line-height: 1;
  transition: transform .22s var(--ease), color .16s ease;
}
.faq-list details[open] summary::after { color: var(--blue); transform: rotate(45deg); }
.faq-list summary:hover { color: var(--blue); }
.faq-list p { max-width: 560px; margin: 0 0 24px; }
@media (max-width: 1020px) {
  .faq-section { grid-template-columns: 1fr; gap: 28px; }
}
      `}</style>
      <div className="section-copy">
        <span className="eyebrow">FAQ</span>
        <h2>Questions clinics ask before they book.</h2>
        <p>
          Anything else? Bring it to your audit and we will answer it against
          how your clinic actually runs.
        </p>
        <div className="section-action">
          <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button secondary">
            {AUDIT_CTA}
          </a>
        </div>
      </div>
      <div className="faq-list">
        {faqs.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
