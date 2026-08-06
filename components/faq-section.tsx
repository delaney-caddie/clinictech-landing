import { CALENDAR_URL } from "@/lib/agents";

const faqs = [
  {
    q: "What is a healthcare CRM?",
    a: "A healthcare CRM is software that helps clinics manage every patient relationship, from the first inquiry to long-term follow-up. It captures leads, tracks conversations, and organizes patient communication in one place. Caddie is an agentic healthcare CRM, which means it does not just store patient information. It acts on it in real time, replying to inquiries, booking consults, and running follow-ups on its own.",
  },
  {
    q: "What is patient management software?",
    a: "Patient management software is a system that handles the day-to-day operations of a clinic, including scheduling, patient communication, reminders, and records. Traditional patient management software waits for your staff to do the work. Caddie is different. It comes with a team of AI employees that run these tasks for you around the clock, so your front office keeps moving even when your team is with patients.",
  },
  {
    q: "Does Caddie integrate with EHR and EMR systems?",
    a: "Yes. Caddie is built to connect with the tools your clinic already runs on, including many EHR and EMR systems. Because every clinic's setup is different, the best way to confirm your specific system connects is to speak to the team.",
  },
  {
    q: "Do your AI employees handle all patient scheduling?",
    a: "Yes. Caddie's AI employees handle patient scheduling from end to end. They answer inquiries, book appointments, send confirmations, and manage reminders and reschedules automatically, so your calendar stays full without your front desk doing the manual work.",
  },
  {
    q: "Does Caddie use AI voice agents?",
    a: "Yes. Caddie uses AI voice agents. Our patient coordinator, Mia, responds to patient inquiries across every channel, including phone. She answers calls, replies to questions about treatments and pricing, and books consults, so no patient reaches a dead end no matter how they get in touch.",
  },
  {
    q: "What is an AI-first clinic?",
    a: "An AI-first clinic is a practice that uses AI to run its front office and back office, instead of relying on manual work and disconnected systems. It means patients get instant answers, follow-ups never slip, and staff spend their time on care instead of admin. Caddie makes any clinic AI-first without adding headcount.",
  },
  {
    q: "What types of clinics does Caddie support?",
    a: "All types. Caddie supports clinics of every kind, including regenerative, aesthetic, med spa, and specialty practices. Because every setup is built on your own company brain, Caddie shapes itself around how your specific clinic runs, no matter your specialty.",
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
