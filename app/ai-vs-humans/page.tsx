import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CALENDAR_URL } from "@/lib/agents";

export const metadata = {
  title: "AI Employees vs. Humans | Caddie",
  description:
    "Caddie's AI employees aren't here to replace your team. They take the admin busywork so your staff can do their best work: patient care. Here's exactly where the AI ends and the human begins.",
};

// What the AI owns vs. what stays human. Physicians are protective of the
// patient relationship — the clearer this boundary, the easier the trust
// conversation, so this page leads with it.
const aiOwns = [
  "Answering inquiries at 2am, and in seconds at 2pm",
  "Follow-ups that would otherwise slip through the cracks",
  "Scheduling, reminders, confirmations, reschedules",
  "Inbox triage, social replies, review requests",
  "Content, SEO, and the marketing no one has time for",
];

const humanOwns = [
  "Every clinical conversation and consult",
  "Diagnosis, treatment advice, and medical judgment",
  "The patient relationship itself",
  "Any conversation the AI isn't certain about",
  "Final say over what the AI can and cannot do",
];

const benefits = [
  {
    title: "Full context, every time",
    body: "Every interaction draws on the patient's full history with your clinic. No patient ever repeats themselves because a different shift picked up the phone.",
  },
  {
    title: "Infinite memory",
    body: "Your treatments, pricing, policies, and every past conversation, held in one brain that never forgets a detail or loses a sticky note.",
  },
  {
    title: "Working 24/7",
    body: "Nights, weekends, holidays. No sick days, no turnover, no retraining a new hire every six months.",
  },
  {
    title: "Self-improving",
    body: "Every conversation makes the team sharper. Corrections stick permanently, and what works propagates to every future interaction.",
  },
  {
    title: "Customizable to your clinic",
    body: "Personality, voice, tone, and behavior are yours to set. Your AI employees sound like your clinic, not like a bot.",
  },
  {
    title: "Fully accountable",
    body: "Every word of every conversation is recorded and reviewable. You can audit exactly what was said to any patient, any time.",
  },
];

// Trust is built through mechanisms, not promises. Each of these is a
// concrete control the clinic holds.
const loopPoints = [
  {
    title: "You approve what they know",
    body: "AI employees answer only from your clinic's approved knowledge base: the treatments, pricing, and policies you have signed off on. They don't improvise, which is how we keep them from making things up. If it's not in their knowledge, they don't say it.",
  },
  {
    title: "They hand off instead of guessing",
    body: "The moment a conversation turns clinical or falls outside what they know, they stop and route it to your staff with full context. A warm handoff, not a dead end, and never a made-up answer.",
  },
  {
    title: "You see every conversation",
    body: "Full transcripts of every call, chat, and message are logged and searchable. Spot-check daily or audit monthly. Nothing the AI says to a patient is invisible to you.",
  },
  {
    title: "You set the escalation rules",
    body: "Decide which topics always go to a human: pricing negotiations, complaints, specific treatments. Your rules are enforced on every conversation, on every channel.",
  },
];

const stats = [
  { big: "99.99%", label: "Uptime, monitored around the clock" },
  { big: "24/7", label: "Coverage without overtime or burnout" },
  { big: "100%", label: "Of conversations logged and reviewable" },
];

export default function AiVsHumansPage() {
  return (
    <div className="ct-page">
      <style>{`
.avh-hero {
  max-width: 800px; margin: 0 auto;
  padding: clamp(56px, 8vw, 96px) 24px 0; text-align: center;
}
.avh-hero h1 { margin-left: auto; margin-right: auto; }
.avh-hero p { font-size: 1.06rem; max-width: 660px; margin: 0 auto; }

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

.avh-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--grid-gap); margin-top: 32px; }
.avh-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg);
  box-shadow: var(--shadow-xs); padding: 26px 28px;
}
.avh-card h3 { font-size: 1.05rem; font-weight: 620; margin-bottom: 10px; }
.avh-card p { font-size: .92rem; margin: 0; }

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

.avh-loop { display: grid; grid-template-columns: 1fr 1fr; gap: var(--grid-gap); margin-top: 32px; }
.avh-loop-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg);
  box-shadow: var(--shadow-xs); padding: 28px 30px;
}
.avh-loop-card h3 { font-size: 1.08rem; font-weight: 620; margin-bottom: 10px; }
.avh-loop-card p { font-size: .94rem; margin: 0; }

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
  .avh-split, .avh-loop { grid-template-columns: 1fr; }
  .avh-grid, .avh-stats { grid-template-columns: 1fr; }
  .avh-cta { flex-direction: column; align-items: stretch; }
}
@media (max-width: 720px) {
  .avh-cta { padding: 30px; }
}
      `}</style>

      <SiteNav />

      <main>
        <header className="avh-hero">
          <span className="eyebrow">AI employees vs. humans</span>
          <h1>Not here to replace your team. Here to give them their best work back.</h1>
          <p>
            Caddie&apos;s AI employees take on the admin busywork no one has
            time for, so your humans can do the work only humans should do:
            patient care.
          </p>
        </header>

        {/* The dividing line */}
        <section className="section">
          <div className="section-copy wide">
            <span className="eyebrow">A clear line</span>
            <h2>Where the AI ends and your team begins.</h2>
            <p>
              Physicians are protective of the patient relationship, and they
              should be. So the boundary is explicit, and you control it.
            </p>
          </div>
          <div className="avh-split">
            <div className="avh-col is-ai">
              <div className="avh-col-head">Your AI employees take on</div>
              <ul>
                {aiOwns.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="avh-col">
              <div className="avh-col-head">Your team keeps</div>
              <ul>
                {humanOwns.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide">
            <span className="eyebrow">Why it works</span>
            <h2>What an AI employee brings that a job posting can&apos;t.</h2>
          </div>
          <div className="avh-grid">
            {benefits.map((b) => (
              <article key={b.title} className="avh-card">
                <h3>{b.title}</h3>
                <p>{b.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Performance & uptime */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="avh-dark">
            <span className="eyebrow">Performance &amp; uptime</span>
            <h2>Built for the industry where a wrong answer isn&apos;t an option.</h2>
            <p>
              Caddie&apos;s AI employees run on the latest frontier AI models,
              and the platform routes each task to the model best suited for
              it, so every job runs as accurately and efficiently as possible.
              They are trained specifically for healthcare, not adapted from
              out-of-the-box agents, and they operate inside hard rules: never
              medical advice, never a diagnosis, never information they
              shouldn&apos;t share.
            </p>
            <p>
              And because they only speak from knowledge your clinic has
              approved, they don&apos;t make answers up. When they don&apos;t
              know, they say so, and bring in your staff.
            </p>
            <div className="avh-stats">
              {stats.map((s) => (
                <div key={s.big} className="avh-stat">
                  <strong>{s.big}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Human in the loop */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide">
            <span className="eyebrow">Human in the loop</span>
            <h2>You are always in control of what the AI says and does.</h2>
            <p>
              Trust shouldn&apos;t rest on promises. It rests on mechanisms
              you can inspect. Here are the four that govern every Caddie AI
              employee.
            </p>
          </div>
          <div className="avh-loop">
            {loopPoints.map((l) => (
              <article key={l.title} className="avh-loop-card">
                <h3>{l.title}</h3>
                <p>{l.body}</p>
              </article>
            ))}
          </div>
          <div className="avh-boundary">
            In practice: your AI team runs the top of the funnel, answering,
            qualifying, booking, and following up. The moment a conversation
            needs clinical judgment, or a patient walks through your door, your
            humans take over with the full history in front of them. The AI
            sets the table. Your team owns the relationship.
          </div>
        </section>

        {/* CTA */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="avh-cta">
            <div>
              <h2>See the guardrails for yourself.</h2>
              <p>
                Book a demo and we will show you the knowledge base, the
                transcripts, and the handoff, live.
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
