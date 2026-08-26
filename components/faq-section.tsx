import { CALENDAR_URL } from "@/lib/agents";

const faqs = [
  {
    q: "Can Caddie replace my CRM?",
    a: "Yes. Caddie's operating system includes an agentic CRM built to replace the generic ones clinics get stuck with — GoHighLevel, Zoho and the rest. The difference isn't the database, it's that Caddie works the leads inside it instead of storing them until someone has time.",
  },
  {
    q: "Does Caddie integrate with EHR and EMR systems?",
    a: "Yes. Caddie connects with most existing EHR and EMR platforms, and can act as your system of record instead if you'd rather run everything in one place. Integration takes about two weeks on average, scoped with you during discovery.",
  },
  {
    q: "Does Caddie integrate with patient management software?",
    a: "Yes. Scheduling, records and patient communication tools connect to Caddie so your AI employees can read context and write back — booking real appointments on your real calendar, not a parallel one.",
  },
  {
    q: "Do your AI employees handle all patient scheduling?",
    a: "They can, and you set the rules. Run them around the clock, only after hours, only on certain channels, or only for certain appointment types. You decide what they own and what always goes to a human.",
  },
  {
    q: "Do Caddie AI employees handle voice calls?",
    a: "Yes. Mia answers your clinic's phone, handles treatment and pricing questions, and books consults on the call. You can talk to her yourself on her page before you ever speak to us.",
  },
  {
    q: "What is an AI-first clinic?",
    a: "A practice where the front office runs on AI instead of on manual work and disconnected tools. Patients get instant answers at any hour, follow-ups never slip, and staff spend their day on care rather than admin. Caddie makes a clinic AI-first without adding headcount.",
  },
  {
    q: "What types of clinics does Caddie support?",
    a: "All of them — regenerative medicine, hormone therapy, IVF, dental, aesthetics, med spa and specialty practices. Because every setup is built on your own company brain, Caddie shapes itself around how your clinic actually runs. Talk to our team about your specialty and goals.",
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
        <h2>Clear answers for clinics considering Caddie.</h2>
        <p>
          Anything else? Bring it to a demo and we will answer it against your
          clinic&apos;s real pipeline.
        </p>
        <div className="section-action">
          <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button secondary">
            Book a demo
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
