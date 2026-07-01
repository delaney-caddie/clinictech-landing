import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export const metadata = {
  title: "AI Employees — ClinicTech",
  description:
    "Five named agents trained on your clinic. Mia, Vidi, Rio, Sage, and Atlas handle patient coordination, content, post-treatment care, sales coaching, and protocol drafting. We build custom agents on top.",
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
    headline: "Never lose a patient to a slow reply.",
    body: "Mia is your 24/7 receptionist. She answers new leads the moment they come in, runs follow-up cadences, books consults, cites real patient stories when it helps the sale, and loops your team in the moment a conversation needs a human.",
    capabilities: [
      "Works as your 24/7 receptionist across web, SMS, and WhatsApp",
      "Drafts and sends first-touch replies within seconds",
      "Runs Hot / Warm / Cold follow-up cadences",
      "Books consults straight onto your calendar",
      "Cites patient stories from your library when it helps the sale",
      "Pauses and pings you the moment something is sensitive",
    ],
    example: {
      title: "Example: John Johnson, nerve damage inquiry",
      body: "John messages your site at 11 PM saying he is desperate. Mia replies within seconds, asks about his preferred call window, drafts a follow-up, then pauses the cadence and flags it for your eyes because the tone is sensitive.",
    },
    badge: "Auto + notify",
  },
  {
    name: "Vidi",
    slug: "vidi",
    role: "Content Creator",
    color: "#7C3AED",
    tint: "rgba(124,58,237,0.08)",
    border: "rgba(124,58,237,0.22)",
    headline: "Become the expert your patients already trust.",
    body: "Vidi generates a lifelike AI avatar of you or your clinic, writes the scripts and captions, and turns your expertise into educational video that positions you as the authority in regenerative medicine. You approve the script, Vidi produces and schedules the video. No camera, no studio.",
    capabilities: [
      "Generates a lifelike AI avatar of you or your clinic",
      "Writes educational video scripts in your voice",
      "Drafts captions and hooks tuned for each platform",
      "Produces talking-head videos without a camera or studio",
      "Runs every medical claim past your team before it goes live",
    ],
    example: {
      title: "Example: \"Is stem cell right for knee OA?\"",
      body: "Vidi drafts a 45-second script answering the question patients ask most, generates the video with Dr. James's avatar, and writes the Instagram and TikTok captions with hooks. He reviews the claims and tweaks one line. Vidi publishes it under his name, plus three more in the series, on schedule.",
    },
    badge: "Compliance-checked",
  },
  {
    name: "Rio",
    slug: "rio",
    role: "Care Advocate",
    color: "#DB2777",
    tint: "rgba(219,39,119,0.08)",
    border: "rgba(219,39,119,0.22)",
    headline: "Turn happy patients into your marketing engine.",
    body: "Rio walks with every patient after treatment. Phased check-ins on Day 7, 14, 30, 60, and 90. Asks for reviews and case studies when outcomes are strong. Escalates to your doctor the moment something sounds off.",
    capabilities: [
      "Sends Day 7, 14, 30, 60, and 90 check-ins automatically",
      "Captures Google reviews, written stories, video testimonials, case studies",
      "Tiers story asks based on outcome strength",
      "Escalates to your doctor on early warning signs",
      "Feeds the patient stories library Mia cites from",
    ],
    example: {
      title: "Example: Carla Mendez, Day 30",
      body: "Carla reports pain down from 7 to 1 and says she is hiking again. Rio drafts a warm Day 30 reply with a tiered story ask: Google review now, written piece next week, optional video at Day 60. Mia ends up citing Carla's story 12 times in the next month.",
    },
    badge: "Auto + notify",
  },
  {
    name: "Sage",
    slug: "sage",
    role: "Sales Coach",
    color: "#16A34A",
    tint: "rgba(22,163,74,0.08)",
    border: "rgba(22,163,74,0.22)",
    headline: "Turn more consults into booked patients.",
    body: "Sage watches the pipeline every day, spots patterns, surfaces coaching opportunities, and proposes new rules you can accept in one click. Internal only.",
    capabilities: [
      "Daily pipeline brief, ranked by priority",
      "Flags deals stuck past your healthy stage time",
      "Spots conversion patterns across condition + source + week",
      "Proposes new rules Mia adopts on a click",
      "Tracks rule acceptance and what is moving the number",
    ],
    example: {
      title: "Example: Sunday-night spike",
      body: "Sage notices that 7 of your last 10 high-scoring nerve damage leads came in Sunday 6 PM to Monday noon. Mia's average first-touch on Sundays is 14 minutes. Sage suggests a tighter weekend cadence rule. One click and Mia adopts it.",
    },
    badge: "Internal only",
  },
  {
    name: "Atlas",
    slug: "atlas",
    role: "Protocol Architect",
    color: "#D97706",
    tint: "rgba(217,119,6,0.08)",
    border: "rgba(217,119,6,0.22)",
    headline: "Highly customized protocols. Doctor reviews instead of writes.",
    body: "Atlas drafts multi-phase treatment protocols from intake notes, consult notes, and similar patient cases. Every draft waits for doctor sign-off. Nothing reaches a patient without it.",
    capabilities: [
      "Drafts multi-phase protocols from intake + consult notes",
      "Pulls from similar past cases and your clinic templates",
      "Surfaces dosing, costs, and timing per phase",
      "Flags edge cases for doctor attention",
      "Hard-locked to manual approval. Always.",
    ],
    example: {
      title: "Example: Robert Hayes, bilateral knee OA",
      body: "Atlas drafts a 3-phase, 14-week protocol from 4 similar past cases and your clinic's Knee OA standard. Bilateral stem cell injection at week 2, PRP boosters at weeks 6 and 10, hand-off to Rio at week 14. Dr. James L. reviews and signs off before Robert sees anything.",
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
          <h1>Five agents trained on your clinic. We build the rest as you grow.</h1>
          <p>
            Mia, Vidi, Rio, Sage, and Atlas handle the roles every regen clinic needs filled. They go live on day one, trained on your protocols, your tone, your pipeline. When you need a role that does not exist yet, we build it.
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
                <img src={`/agents/${a.slug}.png`} alt={a.name} />
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
                <img className="ae-agent-portrait" src={`/agents/${a.slug}.png`} alt={`${a.name}, ${a.role}`} />
                <div>
                  <div className="ae-agent-name">{a.name}</div>
                  <div className="ae-agent-role">{a.role}</div>
                </div>
              </div>
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
                <img src={`/mockups/${a.slug}.png`} alt={`${a.name} workspace`} />
              </div>
              <div className="ae-agent-visual-caption">{a.name} at work in ClinicTech</div>
            </div>
          </section>
        ))}

        <section className="ae-custom">
          <h2>Don&apos;t see the role you need to fill?</h2>
          <p>
            Tell us what you wish a member of your team could just handle. We will build the agent for it. Trained on your process, integrated with your pipeline, working the way your clinic works.
          </p>
          <a href={CUSTOM_AGENT_MAILTO} className="ae-custom-cta">Tell us about the role &rarr;</a>
        </section>

        <div className="ae-footer">
          <Link href="/">
            <img src="/clinictech-logo.png" alt="ClinicTech" style={{ height: 20, opacity: 0.5 }} />
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
