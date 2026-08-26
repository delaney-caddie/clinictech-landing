import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { FaqSection } from "@/components/faq-section";
import { CALENDAR_URL } from "@/lib/agents";
import "./platform.css";

export const metadata = {
  title: "The Platform | Caddie",
  description:
    "One platform. Your entire front office, run for you. Caddie is an agentic platform that captures leads, books patients, and runs your admin on its own, in real time.",
};

const comparisonRows = [
  {
    traditional: "Stores lead info and waits for staff to act",
    caddie: "Actions every lead in real time, on its own",
  },
  {
    traditional: "Sends the same templated messages to everyone",
    caddie: "Every message is custom to the patient",
  },
  {
    traditional: "Your team does the follow-up",
    caddie: "AI employees do the follow-up",
  },
  {
    traditional: "One more tool for your staff to manage",
    caddie: "A team that does the work for you",
  },
  {
    traditional: "Same setup for every business",
    caddie: "Built on your clinic's own company brain",
  },
];

const pillars = [
  {
    id: "crm",
    title: "Agentic CRM",
    body: "Captures every lead from every channel and works it automatically. Replies in seconds, qualifies, follows up, and books, without your team lifting a finger.",
  },
  {
    id: "portal",
    title: "Patient Portal",
    body: "A branded front door for your patients. They book, ask questions, and get instant answers any time. Coordination that used to eat your team's day now happens on its own.",
  },
  {
    id: "os",
    title: "Operating System",
    body: "Runs the behind-the-scenes work: follow-ups, confirmations, reminders, morning briefs, and task coordination across your team. This is the engine your staff runs on.",
  },
  {
    id: "brain-pillar",
    title: "The Company Brain",
    body: "The layer that makes it all yours. It learns your treatments, pricing, tone, and history, then powers every part of the platform and every AI employee. Teach it once, and everyone you hire on it already knows your clinic.",
  },
];

const brainPoints = [
  {
    title: "All your tools, connected",
    body: "Gmail, calendar, WhatsApp, your booking system, and your website. The brain reads and writes where your clinic already works.",
  },
  {
    title: "One living memory",
    body: "Your protocols, pricing, and history in one place. It gets smarter every day, and nothing gets entered twice.",
  },
  {
    title: "Custom to every patient",
    body: "Because the brain knows your clinic, every touchpoint is personal, not a template.",
  },
  {
    title: "Self-improves over time",
    body: "All agents self-improve on a daily basis, offering suggestions to help you scale your practice.",
  },
];

export default function PlatformPage() {
  return (
    <div className="ct-page">
      <SiteNav />
      <main>
        {/* Hero */}
        <section className="plat-hero">
          <span className="eyebrow">The platform</span>
          <h1>One platform. Your entire front office, run for you.</h1>
          <p>
            Most software gives you a dashboard and waits for your team to do the work.
            Caddie is different. It is an agentic platform that captures leads, books
            patients, and runs your admin on its own, in real time.
          </p>
          <div className="plat-hero-actions">
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
              Book a demo
            </a>
          </div>
        </section>

        {/* Agentic vs traditional */}
        {/* The people the platform works for */}
        <section className="section" style={{ paddingTop: 28, paddingBottom: 0 }}>
          <div className="plat-photo-row">
            <img src="/testimonials/regen-clinic.jpg" alt="A patient checking in at a clinic front desk" loading="lazy" />
            <img src="/patients/receptionist.jpg" alt="A receptionist welcoming a patient" loading="lazy" />
            <img src="/testimonials/aesthetics-clinic.jpg" alt="A consultation at an aesthetics clinic" loading="lazy" />
          </div>
        </section>

        {/* Four pillars */}
        <section className="section">
          <div className="section-copy wide">
            <span className="eyebrow">The four pillars</span>
            <h2>Everything your front office needs, in one place.</h2>
            <p>One connected system, not four separate products.</p>
          </div>
          <div className="plat-pillar-grid">
            {pillars.map((p, i) => (
              <article key={p.id} className="plat-pillar" id={p.id}>
                <span className="plat-pillar-num">0{i + 1}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </article>
            ))}
          </div>
          <figure className="plat-product">
            <img
              src="/product-analytics.jpg"
              alt="The Caddie workspace showing live pipeline results, new leads per week, lead sources, and per-agent performance"
              loading="lazy"
            />
          </figure>
          <p className="plat-product-caption">
            Your results, computed live from your workspace.
          </p>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide">
            <span className="eyebrow">Agentic vs. traditional</span>
            <h2>A traditional CRM stores your data. Caddie acts on it.</h2>
          </div>
          <div className="plat-compare">
            <div className="plat-compare-head">
              <span>Traditional CRM / operating system</span>
              <span>Caddie (agentic)</span>
            </div>
            {comparisonRows.map((row) => (
              <div key={row.traditional} className="plat-compare-row">
                <span>
                  <span className="plat-compare-mark" aria-hidden="true">&#10005;</span>
                  {row.traditional}
                </span>
                <span>
                  <span className="plat-compare-mark" aria-hidden="true">&#10003;</span>
                  {row.caddie}
                </span>
              </div>
            ))}
          </div>
          <p className="plat-compare-closing">
            The difference is simple. A CRM is a parking lot. Caddie is a workforce.
          </p>
        </section>

        {/* The company brain (moved from the homepage) */}
        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <section className="plat-brain" id="brain">
            <div className="plat-brain-copy">
              <span className="eyebrow">The company brain</span>
              <h2>No two clinics are the same.</h2>
              <p>
                Every clinic runs on its own company brain. It learns your treatments,
                your pricing, your tone, and every patient conversation. Because of
                that, every message a patient gets is unique and custom to them. Unlike
                a traditional CRM that stores data and waits, Caddie uses the brain to
                action leads in real time.
              </p>
              <div className="plat-brain-points">
                {brainPoints.map((p) => (
                  <div key={p.title} className="plat-brain-point">
                    <strong>{p.title}</strong>
                    <span>{p.body}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="plat-brain-visual" aria-hidden="true">
              {/* viewBox is wider than the node coordinates so the right-hand
                  agent labels have room and do not clip at the edge. */}
              <svg viewBox="0 0 700 520" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="bhGlow">
                    <stop offset="0%" stopColor="#5d82ff" stopOpacity=".5" />
                    <stop offset="100%" stopColor="#5d82ff" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="bhCore" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3757e8" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>

                {/* connections: tools to brain */}
                <g stroke="#a7c0ff66" strokeWidth="1.5" fill="none" strokeDasharray="3 9" strokeLinecap="round">
                  <path d="M172 80 C 250 80, 250 240, 252 250">
                    <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.8s" repeatCount="indefinite" />
                  </path>
                  <path d="M172 170 C 240 170, 240 250, 250 256">
                    <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.5s" repeatCount="indefinite" />
                  </path>
                  <path d="M172 260 C 220 260, 230 260, 248 260">
                    <animate attributeName="stroke-dashoffset" from="24" to="0" dur="2.1s" repeatCount="indefinite" />
                  </path>
                  <path d="M172 350 C 240 350, 240 270, 250 264">
                    <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.6s" repeatCount="indefinite" />
                  </path>
                  <path d="M172 440 C 250 440, 250 280, 252 270">
                    <animate attributeName="stroke-dashoffset" from="24" to="0" dur="2s" repeatCount="indefinite" />
                  </path>
                </g>
                {/* connections: brain to agents */}
                <g stroke="#a7c0ff66" strokeWidth="1.5" fill="none" strokeDasharray="3 9" strokeLinecap="round">
                  <path d="M392 250 C 440 240, 450 110, 496 100">
                    <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.7s" repeatCount="indefinite" />
                  </path>
                  <path d="M392 256 C 440 250, 450 210, 496 205">
                    <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="2s" repeatCount="indefinite" />
                  </path>
                  <path d="M392 264 C 440 270, 450 310, 496 315">
                    <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.5s" repeatCount="indefinite" />
                  </path>
                  <path d="M392 270 C 440 280, 450 410, 496 420">
                    <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="2.2s" repeatCount="indefinite" />
                  </path>
                </g>

                {/* tool nodes */}
                <g fontFamily="inherit" fontSize="14" fontWeight="600">
                  <rect x="40" y="60" width="132" height="40" rx="20" fill="#ffffff1a" stroke="#ffffff3d" />
                  <text x="106" y="85" fill="#dbe4f8" textAnchor="middle">Gmail</text>
                  <rect x="40" y="150" width="132" height="40" rx="20" fill="#ffffff1a" stroke="#ffffff3d" />
                  <text x="106" y="175" fill="#dbe4f8" textAnchor="middle">Calendar</text>
                  <rect x="40" y="240" width="132" height="40" rx="20" fill="#ffffff1a" stroke="#ffffff3d" />
                  <text x="106" y="265" fill="#dbe4f8" textAnchor="middle">WhatsApp</text>
                  <rect x="40" y="330" width="132" height="40" rx="20" fill="#ffffff1a" stroke="#ffffff3d" />
                  <text x="106" y="355" fill="#dbe4f8" textAnchor="middle">Booking system</text>
                  <rect x="40" y="420" width="132" height="40" rx="20" fill="#ffffff1a" stroke="#ffffff3d" />
                  <text x="106" y="445" fill="#dbe4f8" textAnchor="middle">Your website</text>
                </g>

                {/* brain core */}
                <circle cx="320" cy="260" r="130" fill="url(#bhGlow)">
                  <animate attributeName="r" values="122;138;122" dur="4.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="320" cy="260" r="96" fill="none" stroke="#8fb0ff33" strokeWidth="1" strokeDasharray="2 10">
                  <animateTransform attributeName="transform" type="rotate" from="0 320 260" to="360 320 260" dur="40s" repeatCount="indefinite" />
                </circle>
                <circle cx="320" cy="260" r="80" fill="none" stroke="#8fb0ff40" strokeWidth="1" strokeDasharray="18 10">
                  <animateTransform attributeName="transform" type="rotate" from="360 320 260" to="0 320 260" dur="30s" repeatCount="indefinite" />
                </circle>
                <circle cx="320" cy="260" r="64" fill="url(#bhCore)" stroke="#ffffff2e" strokeWidth="1.5" />
                <text x="320" y="252" fill="#ffffff" fontSize="16" fontWeight="700" textAnchor="middle">Your clinic&apos;s</text>
                <text x="320" y="276" fill="#ffffff" fontSize="16" fontWeight="700" textAnchor="middle">brain</text>

                {/* agent nodes */}
                <g fontSize="14" fontWeight="600">
                  <circle cx="520" cy="100" r="19" fill="#2563EB" stroke="#ffffff33" strokeWidth="1.5" />
                  <text x="552" y="105" fill="#dbe4f8">Mia</text>
                  <circle cx="520" cy="205" r="19" fill="#0EA5E9" stroke="#ffffff33" strokeWidth="1.5" />
                  <text x="552" y="210" fill="#dbe4f8">Iris</text>
                  <circle cx="520" cy="315" r="19" fill="#DB2777" stroke="#ffffff33" strokeWidth="1.5" />
                  <text x="552" y="320" fill="#dbe4f8">Rio</text>
                  <circle cx="520" cy="420" r="19" fill="none" stroke="#8fb0ff66" strokeWidth="1.5" strokeDasharray="4 5" />
                  <text x="533" y="426" fill="#8fb0ff" fontSize="17" fontWeight="700" textAnchor="middle">+</text>
                  <text x="552" y="425" fill="#8fb0ff">The whole team</text>
                </g>
              </svg>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <section className="plat-cta">
            <div>
              <h2>Get your fully branded, customized front office today.</h2>
              <p>
                Built on your clinic, your treatments, and your tone. See it running on
                your real pipeline.
              </p>
            </div>
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
              Book a demo
            </a>
          </section>
        </div>

        {/* FAQ */}
        <FaqSection />
      </main>
      <SiteFooter />
    </div>
  );
}
