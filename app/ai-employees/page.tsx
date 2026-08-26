import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { FaqSection } from "@/components/faq-section";
import { getAgent, CALENDAR_URL } from "@/lib/agents";

export const metadata = {
  title: "AI Employees | Caddie",
  description:
    "Meet the AI employees your clinic has been missing. Turn every lead, call and follow-up into revenue with AI employees that never clock out.",
};

const mia = getAgent("mia")!;

const miaChannels = ["Phone", "Email", "Web form", "Chatbot", "WhatsApp", "Social media"];

// The five moments that decide whether an inquiry becomes a patient. A real
// sequence, so the numbered markers carry meaning.
const journeySteps = [
  {
    eyebrow: "Capture and respond",
    title: "The first reply, in seconds",
    body: "A new inquiry arrives and your AI employee answers immediately, not the next morning. Slow replies and missed calls stop costing you patients.",
  },
  {
    eyebrow: "Keep the conversation moving",
    title: "Real questions, real answers",
    body: "It asks what your coordinator would ask, collects the details you need, and keeps the patient engaged until they are ready to book.",
  },
  {
    eyebrow: "Autonomous scheduling",
    title: "Straight onto your calendar",
    body: "When the patient is ready, the appointment is booked on your real calendar. No callback request, no queue, no handoff to a human first.",
  },
  {
    eyebrow: "Protect the appointment",
    title: "Confirmed, reminded, prepared",
    body: "Confirmations and reminders go out on their own, pre-appointment questions get answered, and the patient arrives knowing what to expect.",
  },
  {
    eyebrow: "Reviews and returns",
    title: "One visit becomes the next",
    body: "After the visit it asks happy patients for the review, then keeps in touch so your clinic is the one they come back to.",
  },
];

const coachBlocks = [
  {
    title: "It knows how your clinic actually runs",
    body: "Your services, your pricing, your policies, and the playbooks your team follows — not a generic script with your clinic's name inserted.",
  },
  {
    title: "Correct it once, in plain English",
    body: "Coach it the way you'd coach a new hire. The correction applies immediately, it doesn't repeat the mistake, and it tells you where it thinks it could do better.",
  },
  {
    title: "You can see everything it does",
    body: "Full visibility into how your AI employee is performing, a training environment to work in before it ever talks to a patient, and escalation rules that decide when a human should take over.",
  },
];

const builtInBlocks = [
  {
    title: "One inbox, every channel",
    body: "Calls, texts, email and social — your AI employee works all of them from a single place, and so does your team.",
  },
  {
    title: "It remembers the whole conversation",
    body: "Every reply is written from the patient's history with your clinic, so nobody is ever asked to repeat themselves.",
  },
  {
    title: "It books. It doesn't just reply.",
    body: "Live access to your calendar, patient records and workflows means it can book, confirm and follow up itself — no human handoff to finish the task.",
  },
];

const diffRows = [
  ["One channel, usually web chat", "Phone, text, email, web and social from one inbox"],
  ["Answers the question, then stops", "Qualifies, books, confirms and follows up"],
  ["Booking means a callback request", "Booked on your real calendar, in the conversation"],
  ["Nothing happens after the visit", "Reviews collected and past patients reactivated"],
  ["A generic script you fill in", "Your services, pricing, policies and tone"],
  ["Fixes need a support ticket", "Coach it in plain English; it applies instantly"],
  ["Static until someone rebuilds it", "Improves from every conversation"],
  ["You hope it said the right thing", "Every transcript logged and reviewable"],
];

// PLACEHOLDER figures — modelled, not measured. When a clinic is willing to
// be cited, swap in their numbers and retitle the section "Proven results".
const gains = [
  { big: "15%", label: "more patient bookings" },
  { big: "20%", label: "more revenue" },
  { big: "80%", label: "of admin hours saved" },
  { big: "80%", label: "lower operating costs" },
];

export default function AiEmployeesIndexPage() {
  return (
    <div className="ct-page">
      <style>{`
.aie-hero {
  max-width: 1180px; margin: 0 auto;
  padding: clamp(56px, 7vw, 88px) 24px 0;
  display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(320px, .9fr);
  gap: clamp(32px, 5vw, 72px); align-items: center;
}
.aie-hero h1 { margin-bottom: 18px; }
.aie-hero > div > p { font-size: 1.06rem; max-width: 54ch; }
.aie-hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 26px; }

/* Mia showcase card */
.aie-mia {
  background: var(--surface); border: 1px solid var(--line-strong);
  border-radius: var(--r-xl); box-shadow: var(--shadow-lg);
  padding: 30px; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
}
.aie-mia img {
  width: 148px; height: 148px; border-radius: 999px; object-fit: cover;
  background: var(--agent-bg); border: 4px solid var(--agent-edge);
}
.aie-mia strong { font-size: 1.35rem; font-weight: 700; letter-spacing: -.02em; }
.aie-mia .role { color: var(--agent-role); font-size: .9rem; font-weight: 650; margin-top: -8px; }
.aie-mia-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; }
.aie-mia-chips span {
  background: var(--agent-bg); color: var(--agent-role);
  border-radius: 999px; padding: 6px 12px; font-size: .8rem; font-weight: 600;
}
.aie-mia .talk { color: var(--muted-ink); font-size: .85rem; }

/* Journey steps */
.aie-steps { max-width: 860px; margin: 40px auto 0; }
.aie-step {
  display: grid; grid-template-columns: 72px 1fr; gap: 22px;
  padding: 30px 0; border-top: 1px solid var(--line);
}
.aie-step:first-child { border-top: 0; }
.aie-num {
  width: 52px; height: 52px; border-radius: 999px;
  background: var(--blue-wash); color: var(--blue-deep);
  border: 1px solid #dde6f8;
  font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: 1.05rem; font-weight: 600;
  display: grid; place-items: center;
}
.aie-step .eyebrow { margin-bottom: 6px; }
.aie-step h3 { font-size: 1.35rem; font-weight: var(--font-subhead); margin-bottom: 8px; letter-spacing: -.018em; }
.aie-step p { margin: 0; font-size: .98rem; max-width: 58ch; }

/* Card trios */
.aie-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--grid-gap); margin-top: 32px; }
.aie-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg);
  box-shadow: var(--shadow-xs); padding: 26px 28px;
}
.aie-card h3 { font-size: 1.1rem; font-weight: var(--font-subhead); margin-bottom: 10px; }
.aie-card p { margin: 0; font-size: .93rem; }

/* Built in, not bolted on: dark panel for rhythm */
.aie-dark {
  border-radius: var(--r-xl); color: #eef2fb; overflow: hidden;
  background:
    radial-gradient(760px 420px at 82% -12%, #6e8fff5c, #0000 62%),
    linear-gradient(150deg, #101a33 0%, #16234a 55%, #1b2c5e 100%);
  border: 1px solid #27355e; box-shadow: var(--shadow-lg);
  padding: clamp(36px, 5vw, 60px);
}
.aie-dark .eyebrow { color: #9db4ff; }
.aie-dark h2 { color: #fff; }
.aie-dark > p { color: #c9d4ee; max-width: 640px; font-size: 1rem; }
.aie-dark-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--grid-gap); margin-top: 30px; }
.aie-dark-card {
  background: #ffffff0f; border: 1px solid #ffffff1c; border-radius: var(--r-lg);
  padding: 24px 26px;
}
.aie-dark-card h3 { color: #fff; font-size: 1.06rem; font-weight: 620; margin-bottom: 9px; }
.aie-dark-card p { color: #c9d4ee; margin: 0; font-size: .92rem; }

/* Difference table */
.aie-diff-wrap { overflow-x: auto; margin-top: 32px; }
.aie-diff {
  min-width: 640px; background: var(--surface);
  border: 1px solid var(--line); border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm); overflow: hidden;
}
.aie-diff-head, .aie-diff-row { display: grid; grid-template-columns: 1fr 1fr; }
.aie-diff-head span { padding: 15px 22px; font-size: .84rem; font-weight: 650; }
.aie-diff-head span:first-child { background: #fdf1f0; color: #a13c33; }
.aie-diff-head span:last-child { background: #128454; color: #fff; }
.aie-diff-row { border-top: 1px solid var(--line); }
.aie-diff-row span { padding: 13px 22px; font-size: .93rem; line-height: 1.5; color: #8a4740; background: #fdf1f066; }
.aie-diff-row span:last-child { background: #e9f8f166; color: #10502f; border-left: 1px solid var(--line); }

/* Gains */
.aie-gains { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--grid-gap); margin-top: 32px; }
.aie-gain {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg);
  box-shadow: var(--shadow-xs); padding: 26px 28px;
}
.aie-gain strong { display: block; color: var(--blue-deep); font-size: 2.2rem; font-weight: 700; letter-spacing: -.03em; }
.aie-gain span { display: block; color: var(--muted-ink); font-size: .9rem; margin-top: 6px; }
.ct-page .aie-gains-note { margin-top: 16px; color: var(--faint); font-size: .84rem; max-width: 68ch; }

/* Featured quote: clinic photo alongside the words, person in the byline */
.aie-quote {
  max-width: 1000px; margin: 0 auto;
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--r-lg); box-shadow: var(--shadow-sm); overflow: hidden;
  display: grid; grid-template-columns: minmax(0, .82fr) minmax(0, 1.18fr);
  align-items: stretch;
}
.aie-quote-clinic { width: 100%; height: 100%; min-height: 300px; object-fit: cover; display: block; }
.aie-quote-body {
  padding: clamp(28px, 3.4vw, 44px);
  display: flex; flex-direction: column; justify-content: center; gap: 16px;
}
.aie-quote blockquote {
  margin: 0; color: var(--ink); font-size: clamp(1.1rem, 1.7vw, 1.32rem);
  line-height: 1.55; font-weight: 530; letter-spacing: -.01em;
}
.aie-quote figcaption {
  display: flex; align-items: center; gap: 12px;
  color: var(--muted-ink); font-size: .9rem; font-weight: 600;
}
.aie-quote figcaption img {
  width: 44px; height: 44px; border-radius: 999px; object-fit: cover; flex: none;
  border: 1.5px solid var(--line-strong);
}
.aie-quote .stars { color: #f4b740; letter-spacing: 4px; font-size: 1.05rem; }

/* Roster hand-off */
.aie-roster {
  border-radius: var(--r-xl); box-shadow: var(--shadow-md); color: var(--ink);
  gap: var(--grid-gap-lg);
  background:
    radial-gradient(900px 500px at 88% 0, #355cff29, #0000 62%),
    linear-gradient(138deg, #f4f7ff 0%, #e7eeff 50%, #d8e4ff 100%);
  border: 1px solid #dde6f8;
  justify-content: space-between; align-items: center;
  padding: 48px 56px; display: flex;
}
.aie-roster h2 { margin-bottom: 8px; }
.aie-roster p { color: var(--ink-soft); max-width: 560px; margin-bottom: 0; }

@media (max-width: 1020px) {
  .aie-hero { grid-template-columns: 1fr; }
  .aie-cards, .aie-dark-grid { grid-template-columns: 1fr; }
  .aie-gains { grid-template-columns: 1fr 1fr; }
  .aie-quote { grid-template-columns: 1fr; }
  .aie-quote-clinic { min-height: 220px; max-height: 280px; }
  .aie-roster { flex-direction: column; align-items: stretch; }
}
@media (max-width: 720px) {
  .aie-step { grid-template-columns: 44px 1fr; gap: 14px; }
  .aie-num { width: 38px; height: 38px; font-size: .9rem; }
  .aie-gains { grid-template-columns: 1fr; }
  .aie-diff-head span, .aie-diff-row span { padding: 11px 14px; font-size: .86rem; }
  .aie-roster { padding: 30px; }
}
      `}</style>

      <SiteNav />

      <main>
        {/* Hero: the pitch, and Mia front and centre */}
        <section
          className="aie-hero"
          style={{
            ["--agent-bg" as string]: mia.bg,
            ["--agent-edge" as string]: mia.bgEdge,
            ["--agent-role" as string]: mia.roleColor,
          } as React.CSSProperties}
        >
          <div>
            <span className="eyebrow">AI Employees</span>
            <h1>Meet the AI employees your clinic has been missing.</h1>
            <p>
              Turn every lead, call and follow-up into revenue with AI employees
              that never clock out.
            </p>
            <div className="aie-hero-actions">
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
                Book a demo
              </a>
              <Link href="/ai-employees/mia?call=1" className="button secondary">
                Start a call with Mia
              </Link>
            </div>
          </div>
          <div className="aie-mia">
            <img src={mia.portrait} alt={`${mia.name}, ${mia.role}`} />
            <strong>{mia.name}</strong>
            <span className="role">AI {mia.role}</span>
            <div className="aie-mia-chips">
              {miaChannels.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            <span className="talk">Talk to her live, right now. No booking required.</span>
          </div>
        </section>

        {/* The patient journey */}
        <section className="section">
          <div className="section-copy wide">
            <span className="eyebrow">Across the whole patient journey</span>
            <h2>Where clinics lose patients, and what your AI employee does at each step.</h2>
            <p>
              Five moments decide whether an inquiry becomes a patient.
              Here&apos;s what happens at each one.
            </p>
          </div>
          <div className="aie-steps">
            {journeySteps.map((s, i) => (
              <div key={s.title} className="aie-step">
                <div className="aie-num">{i + 1}</div>
                <div>
                  <span className="eyebrow">{s.eyebrow}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Control, coaching and customization */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide">
            <span className="eyebrow">Control, coaching and customization</span>
            <h2>An AI employee you can actually train.</h2>
            <p>
              Custom playbooks, corrections that are applied permanently, and
              escalation rules you set. You stay in control and it does the work.
            </p>
          </div>
          <div className="aie-cards">
            {coachBlocks.map((b) => (
              <article key={b.title} className="aie-card">
                <h3>{b.title}</h3>
                <p>{b.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Built in, not bolted on */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="aie-dark">
            <span className="eyebrow">Built in, not bolted on</span>
            <h2>AI that finishes the job.</h2>
            <p>
              It works inside the tools you already run, with the context and the
              access it needs to move a patient forward on its own.
            </p>
            <div className="aie-dark-grid">
              {builtInBlocks.map((b) => (
                <article key={b.title} className="aie-dark-card">
                  <h3>{b.title}</h3>
                  <p>{b.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Difference table */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide">
            <span className="eyebrow">Side by side</span>
            <h2>The #1 AI team for medical practices.</h2>
          </div>
          <div className="aie-diff-wrap">
            <div className="aie-diff">
              <div className="aie-diff-head">
                <span>Other AI tools</span>
                <span>Your Caddie employees</span>
              </div>
              {diffRows.map(([before, after]) => (
                <div key={before} className="aie-diff-row">
                  <span>{before}</span>
                  <span>{after}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What clinics stand to gain (modelled figures until real ones land) */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide">
            <span className="eyebrow">The upside</span>
            <h2>What clinics stand to gain.</h2>
          </div>
          <div className="aie-gains">
            {gains.map((g) => (
              <div key={g.label} className="aie-gain">
                <strong>{g.big}</strong>
                <span>{g.label}</span>
              </div>
            ))}
          </div>
          <p className="aie-gains-note">
            Modelled outcomes based on clinic response-time and no-show
            benchmarks. Your numbers depend on your pipeline &mdash; we&apos;ll
            model them against it on a demo.
          </p>
        </section>

        {/* Customer quote (placeholder — swap before production) */}
        <section className="section" style={{ paddingTop: 0 }}>
          {/* Attribution matches the same testimonial on the homepage, so one
              face is never shown as two different people across the site. */}
          <figure className="aie-quote">
            <img
              className="aie-quote-clinic"
              src="/testimonials/dental-clinic.jpg"
              alt=""
              loading="lazy"
            />
            <div className="aie-quote-body">
              <div className="stars" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <blockquote>
                &ldquo;We did not add a person and we are booking more consults
                than we ever have. It is the first software we have bought that
                did the work instead of creating more of it.&rdquo;
              </blockquote>
              <figcaption>
                <img src="/testimonials/owner.jpg" alt="" loading="lazy" />
                <span>Owner, multi-location dental practices</span>
              </figcaption>
            </div>
          </figure>
        </section>

        {/* FAQ */}
        <FaqSection />

        {/* The rest of the team */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="aie-roster">
            <div>
              <span className="eyebrow">The rest of the team</span>
              <h2>Mia is one of eight.</h2>
              <p>
                Every AI employee runs on the same platform and the same company
                brain. Hire the ones your clinic actually needs.
              </p>
            </div>
            <Link href="/ai-employees/team" className="button">
              See other AI employees
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
