import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CALENDAR_URL } from "@/lib/agents";

export const metadata = {
  title: "Safety & HIPAA | Caddie",
  description:
    "How Caddie keeps patient data secure: HIPAA-compliant PHI handling, full audit trails, clinic-approved knowledge, and a hard line between what the platform does and what stays with your team.",
};

// Security first: this is the page a skeptical physician reads before
// trusting an AI near patient conversations. Concrete mechanisms, not
// promises.
const securityCards = [
  {
    title: "PHI encrypted, always",
    body: "Protected health information is encrypted in transit and at rest. Patient data is never used to train shared models.",
  },
  {
    title: "Role-based access, full audit logs",
    body: "Every member of your team sees only what their role allows, and every access is logged. You can always answer who saw what, and when.",
  },
  {
    title: "Every conversation recorded",
    body: "Full transcripts of every call, chat and message are logged and searchable. Nothing the AI says to a patient is invisible to you.",
  },
  {
    title: "Answers only from approved knowledge",
    body: "Your AI employees answer from the treatments, pricing and policies your clinic has signed off on. If it is not in their knowledge, they do not say it.",
  },
  {
    title: "Never medical advice",
    body: "Hard rules, not preferences: no diagnoses, no treatment recommendations, no clinical judgment. The moment a conversation turns clinical, it goes to your staff with the full history attached.",
  },
  {
    title: "99.99% uptime, monitored",
    body: "The platform is monitored around the clock and runs on the latest frontier AI models, with each task routed to the model best suited for it.",
  },
];

// What the platform owns vs. what stays with your team. Physicians are
// protective of the patient relationship; the clearer this boundary, the
// easier the trust conversation.
const platformOwns = [
  "Answering inquiries at 2am, and in seconds at 2pm",
  "Follow-ups that would otherwise slip through the cracks",
  "Scheduling, reminders, confirmations, reschedules",
  "Inbox triage, social replies, review requests",
  "Logging every conversation for your review",
];

const teamOwns = [
  "Every clinical conversation and consult",
  "Diagnosis, treatment advice, and medical judgment",
  "The patient relationship itself",
  "Any conversation the AI is not certain about",
  "Final say over what the AI can and cannot do",
];

// Training and control: how a clinic shapes the AI before and after it
// talks to patients.
const trainingPoints = [
  {
    title: "Trained on your clinic before it goes live",
    body: "Your AI employees learn your services, pricing, policies and tone in a training environment, and talk to no patient until you have reviewed how they answer.",
  },
  {
    title: "Correct it once, in plain English",
    body: "Coach it the way you would coach a new hire. The correction applies immediately, permanently, and it does not repeat the mistake.",
  },
  {
    title: "Escalation rules you write",
    body: "Decide which topics always go to a human: pricing negotiations, complaints, specific treatments. Your rules are enforced on every conversation, on every channel.",
  },
  {
    title: "Hands off instead of guessing",
    body: "When a question falls outside its approved knowledge, it does not improvise. The conversation goes to your staff with full context — a warm handoff, not a dead end.",
  },
];

export default function SafetyPage() {
  return (
    <div className="ct-page">
      <style>{`
.avh-hero {
  max-width: 800px; margin: 0 auto;
  padding: clamp(56px, 8vw, 96px) 24px 0; text-align: center;
}
.avh-hero h1 { margin-left: auto; margin-right: auto; }
.avh-hero p { font-size: 1.06rem; max-width: 660px; margin: 0 auto; }

.sec-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--grid-gap); margin-top: 32px; }
.sec-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg);
  box-shadow: var(--shadow-xs); padding: 26px 28px;
}
.sec-card h3 { font-size: 1.06rem; font-weight: var(--font-subhead); margin-bottom: 10px; }
.sec-card p { margin: 0; font-size: .92rem; }

.avh-split { display: grid; grid-template-columns: 1fr 1fr; gap: var(--grid-gap); margin-top: 32px; }
.avh-col {
  border: 1px solid var(--line); border-radius: var(--r-lg);
  background: var(--surface); box-shadow: var(--shadow-xs); overflow: hidden;
}
.avh-col-head {
  padding: 18px 24px; font-weight: 640; font-size: 1rem;
  border-bottom: 1px solid var(--line); color: var(--ink);
}
.avh-col.is-ai .avh-col-head { background: var(--blue-wash); color: var(--blue-ink); }
.avh-col ul { list-style: none; margin: 0; padding: 10px 24px 18px; }
.avh-col li {
  padding: 10px 0; font-size: .93rem; color: var(--ink-soft);
  border-bottom: 1px solid var(--line); display: flex; gap: 10px; align-items: baseline;
}
.avh-col li:last-child { border-bottom: 0; }
.avh-col li::before {
  content: ""; width: 7px; height: 7px; border-radius: 999px; flex: none;
  background: var(--line-strong); transform: translateY(-1px);
}
.avh-col.is-ai li::before { background: var(--blue); }

.avh-loop { display: grid; grid-template-columns: 1fr 1fr; gap: var(--grid-gap); margin-top: 32px; }
.avh-loop-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg);
  box-shadow: var(--shadow-xs); padding: 28px 30px;
}
.avh-loop-card h3 { font-size: 1.08rem; font-weight: 620; margin-bottom: 10px; }
.avh-loop-card p { font-size: .94rem; margin: 0; }

.avh-dark {
  border-radius: var(--r-xl); color: #eef2fb; overflow: hidden;
  background:
    radial-gradient(760px 420px at 82% -12%, #6e8fff5c, #0000 62%),
    linear-gradient(150deg, #101a33 0%, #16234a 55%, #1b2c5e 100%);
  border: 1px solid #27355e; box-shadow: var(--shadow-lg);
  padding: clamp(36px, 5vw, 64px);
}
.avh-dark .eyebrow { color: #9db4ff; }
.avh-dark h2 { color: #fff; max-width: 640px; }
.avh-dark > p { color: #c9d4ee; max-width: 680px; font-size: 1rem; margin-bottom: 8px; }
.avh-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--grid-gap); margin-top: 34px; }
.avh-stat {
  background: #ffffff0f; border: 1px solid #ffffff1c; border-radius: var(--r-lg);
  padding: 24px 26px;
}
.avh-stat strong { display: block; color: #fff; font-size: 2rem; font-weight: 700; letter-spacing: -.03em; }
.avh-stat span { display: block; color: #b8c6e8; font-size: .88rem; margin-top: 6px; }

.avh-boundary {
  margin-top: 30px; background: var(--blue-wash); border-radius: var(--r-lg);
  color: var(--blue-ink); padding: 22px 26px; font-size: .96rem; font-weight: 560;
  line-height: 1.6;
}

.avh-cta {
  border-radius: var(--r-xl); box-shadow: var(--shadow-md); color: var(--ink);
  gap: var(--grid-gap-lg);
  background:
    radial-gradient(900px 500px at 88% 0, #355cff29, #0000 62%),
    linear-gradient(138deg, #f4f7ff 0%, #e7eeff 50%, #d8e4ff 100%);
  border: 1px solid #dde6f8;
  justify-content: space-between; align-items: center;
  padding: 56px; display: flex;
}
.avh-cta h2 { margin-bottom: 10px; }
.avh-cta p { color: var(--ink-soft); max-width: 640px; margin-bottom: 0; }

@media (max-width: 1020px) {
  .sec-grid { grid-template-columns: 1fr; }
  .avh-split, .avh-loop { grid-template-columns: 1fr; }
  .avh-stats { grid-template-columns: 1fr; }
  .avh-cta { flex-direction: column; align-items: stretch; }
}
@media (max-width: 720px) {
  .avh-cta { padding: 30px; }
}
      `}</style>

      <SiteNav />

      <main>
        <header className="avh-hero">
          <span className="eyebrow">Safety &amp; HIPAA</span>
          <h1>Patient data stays protected. Your team stays in control.</h1>
          <p>
            Doctors and clinic owners are right to be careful about patient
            confidentiality. This page explains exactly how Caddie handles
            PHI, what the platform does and does not do, and how your team
            trains and supervises it.
          </p>
        </header>

        {/* Security & HIPAA — first, because it's what this audience checks */}
        <section className="section">
          <div className="section-copy wide">
            <span className="eyebrow">HIPAA compliance</span>
            <h2>How we keep patient data secure.</h2>
            <p>
              Caddie is built to handle protected health information the way
              HIPAA requires — and every safeguard here is one you can inspect
              on a demo.
            </p>
          </div>
          <div className="sec-grid">
            {securityCards.map((c) => (
              <article key={c.title} className="sec-card">
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* The platform / your team boundary */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide">
            <span className="eyebrow">A clear line</span>
            <h2>What the platform does, and what stays with your team.</h2>
            <p>
              The boundary is explicit, and you control it. Caddie runs the
              front office; your team owns every clinical decision and the
              patient relationship.
            </p>
          </div>
          <div className="avh-split">
            <div className="avh-col is-ai">
              <div className="avh-col-head">The platform handles</div>
              <ul>
                {platformOwns.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="avh-col">
              <div className="avh-col-head">Your team keeps</div>
              <ul>
                {teamOwns.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Training & control */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide">
            <span className="eyebrow">Training &amp; control</span>
            <h2>You train it. You supervise it.</h2>
            <p>
              Trust should not rest on promises. It rests on mechanisms you can
              inspect — here are the four that govern every Caddie AI employee.
            </p>
          </div>
          <div className="avh-loop">
            {trainingPoints.map((l) => (
              <article key={l.title} className="avh-loop-card">
                <h3>{l.title}</h3>
                <p>{l.body}</p>
              </article>
            ))}
          </div>
          <div className="avh-boundary">
            In practice: the platform runs the top of the funnel — answering,
            qualifying, booking, and following up. The moment a conversation
            needs clinical judgment, or a patient walks through your door, your
            team takes over with the full history in front of them.
          </div>
        </section>

        {/* Reliability */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="avh-dark">
            <span className="eyebrow">Performance &amp; reliability</span>
            <h2>Built for the industry where a wrong answer isn&apos;t an option.</h2>
            <p>
              Caddie&apos;s AI employees are trained specifically for
              healthcare, not adapted from out-of-the-box agents. Because they
              only speak from knowledge your clinic has approved, they
              don&apos;t make answers up — when they don&apos;t know, they say
              so, and bring in your staff.
            </p>
            <div className="avh-stats">
              <div className="avh-stat">
                <strong>99.99%</strong>
                <span>Uptime, monitored around the clock</span>
              </div>
              <div className="avh-stat">
                <strong>100%</strong>
                <span>Of conversations logged and reviewable</span>
              </div>
              <div className="avh-stat">
                <strong>0</strong>
                <span>Medical advice given, ever &mdash; by design</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="avh-cta">
            <div>
              <h2>See the safeguards for yourself.</h2>
              <p>
                Book a demo and we will show you the knowledge base, the
                transcripts, the audit logs, and the handoff — live.
              </p>
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
