import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export const metadata = {
  title: "AI Employees | Caddie AI",
  description:
    "Six named agents trained on your clinic. Mia, Vidi, Rio, Juno, Quill, and Atlas handle patient coordination, content, retention, your inbox, SEO, and protocol drafting. One shared brain behind them all.",
};

const CALENDAR_URL = "https://calendly.com/danika-clinictech/clinictech-1-hour-meeting-clone";
const CUSTOM_AGENT_MAILTO =
  "mailto:delaney@clinictech.io?subject=Custom%20agent%20for%20our%20clinic";

const agents = [
  {
    name: "Mia",
    slug: "mia",
    role: "Patient Coordinator",
    color: "#2563EB",
    tint: "rgba(37,99,235,0.08)",
    border: "rgba(37,99,235,0.22)",
    portrait: "/agents/mia.png",
    mockup: "/mockups/mia.svg",
    quote: "I answer in seconds, so the first reply a patient gets is always yours.",
    headline: "Your AI receptionist. Speed to lead, solved.",
    body: "Mia answers your phone and your web chat 24/7. She replies to new inquiries in seconds, answers treatment and pricing questions, drafts emails, runs follow-ups until a lead books or says no, and confirms every appointment. Your front desk stops drowning in admin, and no lead ever waits until morning.",
    capabilities: [
      "Answers your phone and web chat 24/7, in English and Spanish",
      "Replies to new inquiries in seconds across web, SMS, and WhatsApp",
      "Answers treatment, pricing, and logistics questions on the spot",
      "Drafts emails and runs follow-up cadences until a lead books or says no",
      "Books consults and confirms every appointment automatically",
      "Hands the conversation to your team the moment it needs a human",
    ],
    example: {
      title: "Example: John Johnson, nerve damage inquiry",
      body: "John messages your site at 11 PM saying he is desperate. Mia replies within seconds, answers his pricing questions, asks about his preferred call window, drafts a follow-up, then pauses the cadence and flags it for your eyes because the tone is sensitive.",
    },
    badge: "Auto + notify",
  },
  {
    name: "Vidi",
    slug: "vidi",
    role: "Content Marketer",
    color: "#7C3AED",
    tint: "rgba(124,58,237,0.08)",
    border: "rgba(124,58,237,0.22)",
    portrait: "/agents/vidi.png",
    mockup: "/mockups/vidi.svg",
    quote: "Send me an idea in a voice note. I will turn it into a week of content.",
    headline: "A junior marketer on staff, without the hire.",
    body: "Vidi creates lifelike AI avatars of you or anyone on your team and turns your expertise into a steady stream of content. Videos with no camera or studio, on-brand graphics through your Canva, captions tuned to each platform, all generated and scheduled. You approve, Vidi publishes.",
    capabilities: [
      "Creates lifelike AI avatars of you or anyone on your team",
      "Produces talking-head videos with no camera or studio",
      "Designs on-brand graphics through your Canva",
      "Writes scripts, captions, and hooks tuned to each platform",
      "Generates and schedules content across your channels",
      "Runs every medical claim past your team before it goes live",
    ],
    example: {
      title: "Example: \"Is PRP right for knee pain?\"",
      body: "Vidi drafts a 45-second script answering the question patients ask most, generates the video with Dr. James's avatar, designs the carousel version in Canva, and writes the Instagram and TikTok captions. He reviews the claims and tweaks one line. Vidi schedules the whole series.",
    },
    badge: "Compliance-checked",
  },
  {
    name: "Rio",
    slug: "rio",
    role: "Retention Specialist",
    color: "#DB2777",
    tint: "rgba(219,39,119,0.08)",
    border: "rgba(219,39,119,0.22)",
    portrait: "/agents/rio.png",
    mockup: "/mockups/rio.svg",
    quote: "I remember every patient, and I know exactly when to ask for the review.",
    headline: "Your cheapest revenue is a patient you already treated.",
    body: "Rio keeps patients coming back. Check-ins after every treatment, review asks at the moment patients are happiest, re-engagement for the ones who went quiet, and rebooking for follow-up care. Escalates to your doctor the moment something sounds off.",
    capabilities: [
      "Checks in on day 7, 14, 30, 60, and 90 after treatment",
      "Asks for Google reviews at the moment patients are happiest",
      "Re-engages patients who went quiet with personal follow-ups",
      "Books maintenance and follow-up visits back onto your calendar",
      "Feeds strong outcomes into the stories library Mia cites from",
      "Escalates to your doctor on early warning signs",
    ],
    example: {
      title: "Example: Carla Mendez, day 30",
      body: "Carla reports pain down from 7 to 1 and says she is hiking again. Rio drafts a warm day 30 reply with a review ask, books her 6-month follow-up, and logs the outcome. Mia cites Carla's story 12 times to new leads over the next month.",
    },
    badge: "Auto + notify",
  },
  {
    name: "Juno",
    slug: "juno",
    role: "Executive Assistant",
    color: "#16A34A",
    tint: "rgba(22,163,74,0.08)",
    border: "rgba(22,163,74,0.22)",
    portrait: "/agents/juno.svg",
    mockup: "/mockups/juno.svg",
    quote: "I keep your inbox at zero and your calendar honest. Nothing sends without you.",
    headline: "Get your inbox and your evenings back.",
    body: "Juno is the executive assistant for you, not your patients. She triages your email, clears the noise, labels what matters, routes patient questions to Mia, drafts replies in your voice, and keeps your calendar conflict-free. You get a short brief of the few things that actually need you.",
    capabilities: [
      "Triages your inbox and clears the noise before you open it",
      "Labels and prioritizes what actually needs your attention",
      "Routes patient questions to Mia so they never sit unanswered",
      "Drafts replies in your voice, ready to approve",
      "Keeps your calendar conflict-free around your clinic hours",
      "Never sends anything without your approval",
    ],
    example: {
      title: "Example: Monday, 7:00 AM",
      body: "Your inbox took 74 emails over the weekend. Juno filed 49 as noise, routed 12 patient questions to Mia, drafted replies to 8 vendors and partners, and flagged 2 that genuinely need you, with the lab results on top. You clear it before your first consult.",
    },
    badge: "You approve every send",
  },
  {
    name: "Quill",
    slug: "quill",
    role: "SEO Blog Writer",
    color: "#0D9488",
    tint: "rgba(13,148,136,0.08)",
    border: "rgba(13,148,136,0.22)",
    portrait: "/agents/quill.svg",
    mockup: "/mockups/quill.svg",
    quote: "I write what your future patients are searching for, then publish it on schedule.",
    headline: "Patients search before they book. Make sure they find you.",
    body: "Quill researches the exact questions patients type into Google and AI assistants, writes full posts in your voice with your treatments and pricing as context, and publishes straight to your site on a schedule. Every post links back to your booking pages, and traffic compounds while you see patients.",
    capabilities: [
      "Researches the questions your future patients actually search",
      "Targets high-intent, low-competition keywords for your treatments",
      "Writes full posts in your voice, with your protocols as context",
      "Optimizes for Google rankings and AI assistant citations",
      "Publishes straight to your site on a schedule you set",
      "Compliance-checks medical claims before anything goes live",
    ],
    example: {
      title: "Example: \"how much does PRP for knee pain cost\"",
      body: "Quill finds the question, sees competitors rank for it and you do not, and writes a straight answer in Dr. James's voice with your real pricing ranges. It publishes Tuesday at 9 AM with links to the knee program page, and becomes one of the top pages sending new inquiries to Mia.",
    },
    badge: "Compliance-checked",
  },
  {
    name: "Atlas",
    slug: "atlas",
    role: "Protocol Architect",
    color: "#D97706",
    tint: "rgba(217,119,6,0.08)",
    border: "rgba(217,119,6,0.22)",
    portrait: "/agents/atlas.png",
    mockup: "/mockups/atlas.svg",
    quote: "I do the protocol paperwork. Your doctor does the medicine.",
    headline: "Your doctor reviews protocols instead of writing them.",
    body: "Atlas is your doctor's drafting assistant. He builds multi-phase treatment protocols from intake notes, consult notes, and similar past cases, with dosing, costs, and timing laid out per phase. Every draft waits for doctor sign-off. Nothing reaches a patient without it.",
    capabilities: [
      "Drafts multi-phase protocols from intake and consult notes",
      "Pulls from similar past cases and your clinic templates",
      "Surfaces dosing, costs, and timing per phase",
      "Flags edge cases for doctor attention",
      "Hard-locked to manual approval. Always.",
    ],
    example: {
      title: "Example: Robert Hayes, bilateral knee OA",
      body: "Atlas drafts a 3-phase, 14-week protocol from 4 similar past cases and your clinic's knee OA standard. Bilateral joint injections at week 2, boosters at weeks 6 and 10, hand-off to Rio at week 14. Dr. James L. reviews and signs off before Robert sees anything.",
    },
    badge: "Doctor approval required",
  },
];

export default function AiEmployeesPage() {
  return (
    <>
      <style>{`
        .ae-page {
          min-height: 100vh;
          background: #FAFBFD;
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
        }

        /* Hero */
        .ae-hero { padding: 140px 24px 56px; text-align: center; }
        .ae-hero-kicker {
          display: inline-block;
          font-size: 11px; font-weight: 800; text-transform: uppercase;
          letter-spacing: 1.6px; color: #5EC4E3; margin-bottom: 14px;
        }
        .ae-hero h1 {
          font-size: 48px; font-weight: 800; color: #0F172A;
          line-height: 1.12; letter-spacing: -0.6px;
          margin: 0 auto 18px; max-width: 820px;
        }
        .ae-hero p {
          font-size: 18px; color: #475569; line-height: 1.7;
          max-width: 640px; margin: 0 auto 28px;
        }
        .ae-hero-ctas { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .ae-btn-primary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 14px 28px; background: #3730A3; color: #fff;
          font-weight: 700; font-size: 15px;
          border-radius: 100px; text-decoration: none;
          transition: all 0.2s;
        }
        .ae-btn-primary:hover { background: #4338CA; box-shadow: 0 4px 16px rgba(55,48,163,0.25); transform: translateY(-1px); }
        .ae-btn-ghost {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 14px 24px; color: #3730A3; font-weight: 700; font-size: 15px;
          background: transparent; border: 1.5px solid rgba(55,48,163,0.2);
          border-radius: 100px; text-decoration: none;
        }
        .ae-btn-ghost:hover { border-color: #3730A3; background: rgba(55,48,163,0.04); }

        /* Roster strip */
        .ae-roster {
          display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;
          max-width: 880px; margin: 56px auto 0; padding: 0 24px 80px;
        }
        .ae-roster-chip {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 16px 8px 8px;
          background: #fff; border: 1px solid #E2E8F0; border-radius: 100px;
          font-size: 13px; font-weight: 700; color: #0F172A;
          text-decoration: none;
          transition: all 0.15s;
        }
        .ae-roster-chip:hover { border-color: var(--c); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .ae-roster-chip img {
          width: 28px; height: 28px; border-radius: 50%;
          border: 2px solid var(--c); background: var(--t);
          object-fit: cover;
        }
        .ae-roster-chip .role { font-weight: 500; color: #64748B; }

        /* Agent block */
        .ae-agent {
          max-width: 1100px; margin: 0 auto 64px;
          padding: 48px;
          background: #fff; border: 1px solid #E2E8F0; border-radius: 24px;
          border-top: 5px solid var(--c);
          display: grid; grid-template-columns: 1fr 1.05fr; gap: 48px;
          align-items: start;
        }
        .ae-agent-id {
          display: flex; align-items: center; gap: 16px; margin-bottom: 24px;
        }
        .ae-agent-portrait {
          width: 84px; height: 84px; border-radius: 50%;
          border: 3px solid var(--c); background: var(--t);
          object-fit: cover; flex-shrink: 0;
        }
        .ae-agent-name { font-size: 32px; font-weight: 800; color: #0F172A; line-height: 1.05; letter-spacing: -0.4px; }
        .ae-agent-role { font-size: 15px; color: #64748B; margin-top: 4px; }
        .ae-agent-quote {
          font-size: 14.5px; font-style: italic; color: var(--c);
          line-height: 1.55; margin: 0 0 18px;
        }
        .ae-brain {
          max-width: 1100px; margin: 0 auto 64px;
          padding: 48px;
          background: #fff; border: 1px solid #E2E8F0; border-radius: 24px;
          text-align: center;
        }
        .ae-brain h2 {
          font-size: 30px; font-weight: 800; color: #0F172A;
          letter-spacing: -0.4px; margin-bottom: 14px;
        }
        .ae-brain > p {
          font-size: 16px; line-height: 1.7; color: #475569;
          max-width: 680px; margin: 0 auto 32px;
        }
        .ae-brain-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; text-align: left;
        }
        .ae-brain-cell {
          background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 22px;
        }
        .ae-brain-cell strong {
          display: block; font-size: 15px; font-weight: 800; color: #0F172A; margin-bottom: 8px;
        }
        .ae-brain-cell span { font-size: 14px; line-height: 1.65; color: #475569; }
        @media (max-width: 900px) {
          .ae-brain { padding: 32px 24px; }
          .ae-brain-grid { grid-template-columns: 1fr; }
        }
        .ae-agent-badge {
          display: inline-block; margin-bottom: 18px;
          padding: 5px 14px; border-radius: 100px;
          background: var(--t); color: var(--c);
          font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;
          border: 1px solid var(--b);
        }
        .ae-agent-headline {
          font-size: 24px; font-weight: 800; color: var(--c);
          line-height: 1.25; margin-bottom: 16px;
        }
        .ae-agent-body {
          font-size: 16px; line-height: 1.7; color: #475569; margin-bottom: 28px;
        }
        .ae-agent-caps-label {
          font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px;
          color: #94A3B8; margin-bottom: 12px;
        }
        .ae-agent-caps {
          list-style: none; padding: 0; margin: 0 0 28px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .ae-agent-caps li {
          padding-left: 28px; position: relative;
          font-size: 14.5px; line-height: 1.6; color: #334155;
        }
        .ae-agent-caps li::before {
          content: "✓"; position: absolute; left: 0; top: 0;
          width: 20px; height: 20px; border-radius: 50%;
          background: var(--t); color: var(--c);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 800;
        }
        .ae-agent-example {
          background: #F8FAFC; border: 1px solid #E2E8F0;
          border-left: 3px solid var(--c);
          border-radius: 12px; padding: 18px 20px;
        }
        .ae-agent-example-title {
          font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;
          color: var(--c); margin-bottom: 8px;
        }
        .ae-agent-example p {
          font-size: 14.5px; line-height: 1.65; color: #334155;
        }
        .ae-agent-visual { display: flex; flex-direction: column; gap: 14px; }
        .ae-agent-mockup {
          background: #fff; border: 1px solid #E2E8F0; border-radius: 14px;
          overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.06);
        }
        .ae-agent-mockup img { display: block; width: 100%; height: auto; }
        .ae-agent-visual-caption {
          text-align: center; font-size: 12px; color: #94A3B8; font-weight: 600;
        }

        /* Custom agent CTA */
        .ae-custom {
          max-width: 1100px; margin: 0 auto 80px;
          background: linear-gradient(135deg, #3730A3 0%, #5EC4E3 140%);
          color: #fff; border-radius: 24px;
          padding: 56px 48px; text-align: center;
        }
        .ae-custom h2 {
          font-size: 32px; font-weight: 800; letter-spacing: -0.4px;
          margin-bottom: 16px; line-height: 1.2;
        }
        .ae-custom p {
          font-size: 17px; line-height: 1.65;
          color: rgba(255,255,255,0.92);
          max-width: 640px; margin: 0 auto 28px;
        }
        .ae-custom-cta {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 32px; background: #fff; color: #3730A3;
          font-weight: 800; font-size: 15px;
          border-radius: 100px; text-decoration: none;
        }
        .ae-custom-cta:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.15); transform: translateY(-1px); }

        /* Footer */
        .ae-footer {
          padding: 40px 24px; border-top: 1px solid #E2E8F0;
          display: flex; justify-content: space-between; align-items: center;
          max-width: 1100px; margin: 0 auto; flex-wrap: wrap; gap: 16px;
        }
        .ae-footer-links { display: flex; gap: 24px; flex-wrap: wrap; }
        .ae-footer-links a { font-size: 13px; color: #94A3B8; text-decoration: none; }
        .ae-footer-links a:hover { color: #3730A3; }

        @media (max-width: 900px) {
          .ae-agent { grid-template-columns: 1fr; gap: 32px; padding: 32px 24px; }
          .ae-hero h1 { font-size: 36px; }
          .ae-agent-name { font-size: 26px; }
          .ae-agent-headline { font-size: 20px; }
          .ae-custom { padding: 40px 24px; }
          .ae-custom h2 { font-size: 26px; }
        }
      `}</style>

      <div className="ae-page">
        <SiteNav />

        <section className="ae-hero">
          <div className="ae-hero-kicker">Our work / AI Employees</div>
          <h1>Six AI employees trained on your clinic. We build the rest as you grow.</h1>
          <p>
            Mia, Vidi, Rio, Juno, Quill, and Atlas cover the roles every clinic needs filled. They go live trained on your treatments, your tone, your pipeline, and they share one brain, so what one learns, the whole team knows. When you need a role that does not exist yet, we build it.
          </p>
          <div className="ae-hero-ctas">
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="ae-btn-primary">Book a demo &rarr;</a>
            <a href="#mia" className="ae-btn-ghost">See the lineup &darr;</a>
          </div>

          <div className="ae-roster">
            {agents.map((a) => (
              <a
                key={a.slug}
                href={`#${a.slug}`}
                className="ae-roster-chip"
                style={{ ["--c" as string]: a.color, ["--t" as string]: a.tint } as React.CSSProperties}
              >
                <img src={a.portrait} alt={a.name} />
                {a.name}
                <span className="role">· {a.role}</span>
              </a>
            ))}
          </div>
        </section>

        {agents.map((a) => (
          <section
            key={a.slug}
            id={a.slug}
            className="ae-agent"
            style={{
              ["--c" as string]: a.color,
              ["--t" as string]: a.tint,
              ["--b" as string]: a.border,
            } as React.CSSProperties}
          >
            <div>
              <div className="ae-agent-id">
                <img className="ae-agent-portrait" src={a.portrait} alt={`${a.name}, ${a.role}`} />
                <div>
                  <div className="ae-agent-name">{a.name}</div>
                  <div className="ae-agent-role">{a.role}</div>
                </div>
              </div>
              <p className="ae-agent-quote">&ldquo;{a.quote}&rdquo;</p>
              <span className="ae-agent-badge">{a.badge}</span>
              <div className="ae-agent-headline">{a.headline}</div>
              <p className="ae-agent-body">{a.body}</p>

              <div className="ae-agent-caps-label">What {a.name} handles</div>
              <ul className="ae-agent-caps">
                {a.capabilities.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>

              <div className="ae-agent-example">
                <div className="ae-agent-example-title">{a.example.title}</div>
                <p>{a.example.body}</p>
              </div>
            </div>

            <div className="ae-agent-visual">
              <div className="ae-agent-mockup">
                <img src={a.mockup} alt={`${a.name} workspace`} />
              </div>
              <div className="ae-agent-visual-caption">{a.name} at work in Caddie AI</div>
            </div>
          </section>
        ))}

        <section className="ae-brain">
          <h2>Six employees, one shared brain</h2>
          <p>
            Your agents are not six separate tools. They work from one memory: your protocols,
            your pricing, your patient stories, your tone, and the context inside the tools your
            clinic already uses. Teach it once, and the whole team knows it.
          </p>
          <div className="ae-brain-grid">
            <div className="ae-brain-cell">
              <strong>Shared knowledge</strong>
              <span>
                When Rio logs a great outcome, Mia cites it to the next lead. When Atlas drafts a
                protocol, Quill can write the patient explainer for it.
              </span>
            </div>
            <div className="ae-brain-cell">
              <strong>Connected to your tools</strong>
              <span>
                Gmail, your calendar, WhatsApp, Canva, your website. The brain pulls context from
                where your clinic already works, so nobody re-enters anything.
              </span>
            </div>
            <div className="ae-brain-cell">
              <strong>Ask anything</strong>
              <span>
                One question bar across the whole platform. Ask about a patient, a number, or a
                policy and get an answer with sources, in seconds.
              </span>
            </div>
          </div>
        </section>

        <section className="ae-custom">
          <h2>Don&apos;t see the role you need to fill?</h2>
          <p>
            Tell us what you wish a member of your team could just handle. We will build the agent for it. Trained on your process, integrated with your pipeline, working the way your clinic works.
          </p>
          <a href={CUSTOM_AGENT_MAILTO} className="ae-custom-cta">Tell us about the role &rarr;</a>
        </section>

        <div className="ae-footer">
          <Link href="/">
            <img src="/caddie-logo.svg" alt="Caddie AI" style={{ height: 20, opacity: 0.5 }} />
          </Link>
          <div className="ae-footer-links">
            <Link href="/features">Our work</Link>
            <Link href="/features/travel-concierge">Travel Concierge</Link>
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </div>
    </>
  );
}
