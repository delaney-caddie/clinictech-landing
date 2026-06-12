"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SiteNav } from "@/components/site-nav";

const CALENDAR_URL = "https://calendar.app.google/YvNVdxRdiXVhjXQDA";

const agents = [
  {
    name: "Mia",
    slug: "mia",
    role: "Patient Coordinator",
    color: "#2563EB",
    headline: "Never lose a patient to a slow reply.",
    body: "Answers new leads the moment they come in, runs follow-up cadences, books consults, cites real patient stories when it helps the sale, and loops your team in the moment a conversation needs a human.",
    keyFact: "Replies in seconds, day or night, in English and Spanish.",
    badge: null as string | null,
  },
  {
    name: "Atlas",
    slug: "atlas",
    role: "Protocol Architect",
    color: "#D97706",
    headline: "Highly customized protocols. Your doctor reviews instead of writes.",
    body: "Drafts multi-phase treatment protocols from intake notes, consult notes, and similar patient cases. Every draft waits for doctor sign-off. Nothing reaches a patient without it.",
    keyFact: "Every draft waits for doctor sign-off. No exceptions.",
    badge: "Doctor approval required",
  },
  {
    name: "Rio",
    slug: "rio",
    role: "Care Advocate",
    color: "#DB2777",
    headline: "Turn happy patients into your marketing engine.",
    body: "Phased post-treatment check-ins on day 7, 14, 30, 60, and 90. Asks for reviews and case studies when outcomes are strong. Escalates to your doctor the moment something sounds off.",
    keyFact: "Check-ins on day 7, 14, 30, 60, and 90, on schedule.",
    badge: null,
  },
  {
    name: "Sage",
    slug: "sage",
    role: "Sales Coach",
    color: "#16A34A",
    headline: "Turn more consults into booked patients.",
    body: "Delivers a daily pipeline brief, watches what Mia does, and proposes new rules you can accept in one click. Sage talks to your team, never to patients.",
    keyFact: "Internal only. Your team sees everything Sage suggests.",
    badge: "Internal only",
  },
  {
    name: "Tomas",
    slug: "tomas",
    role: "Growth Marketer",
    color: "#7C3AED",
    headline: "Turn ad spend into booked patients.",
    body: "Plans and runs your Google, Meta, and LinkedIn campaigns. Writes ad copy built for regenerative medicine patients. Every lead lands in your pipeline where Mia picks it up.",
    keyFact: "Optimizes one number: cost per booked consult.",
    badge: "Budget-capped",
  },
];

const investorLogos = [
  { src: "/logos/shopify.png", alt: "Shopify" },
  { src: "/logos/deepmind.png", alt: "Google DeepMind" },
  { src: "/logos/rewind.png", alt: "Rewind" },
  { src: "/logos/fellow.png", alt: "Fellow" },
  { src: "/logos/y-combinator.png", alt: "Y Combinator" },
  { src: "/logos/noibu.webp", alt: "Noibu" },
  { src: "/logos/mistral.avif", alt: "Mistral" },
];

const impactStories = [
  {
    name: "Dr. Carlos M.",
    role: "Medical Director, regenerative clinic, Tijuana",
    stat: "22 hrs",
    statLabel: "of admin saved every week",
    quote:
      "I used to spend half my day on WhatsApp coordinating travel for international patients. Flights, hotels, pickups. Now patients handle it themselves through the portal. I actually get to focus on patient care instead of logistics.",
  },
  {
    name: "Sofia R.",
    role: "Patient Coordinator, multi-location stem cell network",
    stat: "3 sec",
    statLabel: "first reply, down from a day",
    quote:
      "Our response time dropped from over a day to under 3 seconds. That alone changed everything. Patients were booking with competitors because we were too slow. Now we are always the first clinic to reply.",
  },
];

const outcomes = [
  {
    title: "Stop missing patient bookings",
    body: "Every inquiry gets an answer in seconds, and every lead gets followed up until they book or say no. No more patients lost to a slow reply.",
    punch: "+25% patient conversion",
  },
  {
    title: "Have a practice available 24/7",
    body: "Nights, weekends, and other time zones stop being dead hours. Patients get answers and book consults whenever they reach out.",
    punch: "Around the clock, no extra shifts",
  },
  {
    title: "Cut old tech and personnel costs",
    body: "One build replaces a stack of subscriptions and hours of manual admin. Stop paying for software nobody uses and work nobody should be doing.",
    punch: "Run your clinic with 50%+ more efficiency",
  },
  {
    title: "Run patient acquisition on autopilot",
    body: "From ad click to follow-up to booked consult, the funnel runs itself and optimizes against the only number that matters: cost per booked consult.",
    punch: "From ad spend to booked consults, hands off",
  },
  {
    title: "Let your staff do 5x more with less",
    body: "Agents take the admin, the chasing, and the coordination. Your team keeps the judgment calls and the patient care.",
    punch: "5x more output from the team you already have",
  },
  {
    title: "Keep an extended tech team on call",
    body: "When you spot the next bottleneck, you do not hire or go software shopping. You tell us, and we build the agent for it.",
    punch: "Automation built as you need it",
  },
];

const faqs = [
  {
    q: "What do we actually get when we work with ClinicTech?",
    a: "AI employees built for your clinic: agents that answer and follow up with patients, book consults, handle intake, run post-treatment check-ins, and automate the admin in between. And the team that builds, maintains, and improves them as your clinic changes.",
  },
  {
    q: "How is this different from buying software?",
    a: "Software hands you a fixed set of features and hopes they fit. We start from your problems. You tell us where the clinic loses time and patients, and we build agents around how you already work. There is no platform to configure and no tool to train your staff on.",
  },
  {
    q: "Do clinical decisions ever happen without a doctor?",
    a: "No. Anything clinical, like a treatment protocol draft, waits for doctor sign-off before it reaches a patient. We enforce that rule in the build itself, not just in policy, and agents hand conversations to your team the moment one needs a human.",
  },
  {
    q: "Is patient data handled safely?",
    a: "Yes. Everything we build is HIPAA-conscious from the ground up. Patient data is routed under a business associate agreement, access is permission-gated, and every agent action is recorded for audit.",
  },
  {
    q: "How long until something is live?",
    a: "It starts with a conversation about how your clinic actually runs. From there we build your first agents around the problems costing you the most. Most clinics have something live within the first couple of weeks.",
  },
  {
    q: "What if we need something you have not built before?",
    a: "That is the point of working with us. Most of what we build starts as a clinic telling us about a problem no off-the-shelf tool solves. Your clinic is never boxed in by what we shipped last quarter.",
  },
];

function useCountUp(target: number, decimals = 0, duration = 1400) {
  const ref = useRef<HTMLElement | null>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(target * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, display: value.toFixed(decimals) };
}

function Stat({ target, prefix = "", suffix = "", label }: { target: number; prefix?: string; suffix?: string; label: string }) {
  const { ref, display } = useCountUp(target);
  return (
    <div>
      <strong ref={ref as React.RefObject<HTMLElement>}>{prefix}{display}{suffix}</strong>
      <span>{label}</span>
    </div>
  );
}

const DEMO_INTERVAL = 9000;

export default function LandingPage() {
  const [activeAgent, setActiveAgent] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Calculator state
  const [inquiries, setInquiries] = useState(60);
  const [avgValue, setAvgValue] = useState(9000);
  const [closeRate, setCloseRate] = useState(30);
  const [coldShare, setColdShare] = useState(25);

  const upside = useMemo(() => {
    const yearly = inquiries * 12;
    const recovered = yearly * (coldShare / 100) * (closeRate / 100) * avgValue;
    const lift = yearly * (1 - coldShare / 100) * (closeRate / 100) * avgValue * 0.15;
    return { recovered, lift, total: recovered + lift };
  }, [inquiries, avgValue, closeRate, coldShare]);

  const fmt = (n: number) =>
    "$" + Math.round(n).toLocaleString("en-US");

  useEffect(() => { setMounted(true); }, []);

  // Auto-advance the agent demo
  useEffect(() => {
    const id = setInterval(() => {
      setActiveAgent((i) => (i + 1) % agents.length);
    }, DEMO_INTERVAL);
    return () => clearInterval(id);
  }, [activeAgent]);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal-item").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Lightbox keyboard + scroll lock
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  const openLightbox = useCallback((slug: string) => setLightbox(slug), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const agent = agents[activeAgent];

  return (
    <div className="ct-page">
      <style>{`
/* ===== HERO ===== */
.hero { max-width: 1440px; margin: 0 auto; padding: 16px clamp(12px,1.6vw,24px) 0; position: relative; }
.hero-panel {
  color: var(--ink);
  background:
    radial-gradient(900px 500px at 88% 0, #355cff29, #0000 62%),
    radial-gradient(760px 520px at 0 112%, #355cff21, #0000 64%),
    linear-gradient(138deg, #f4f7ff 0%, #e7eeff 50%, #d8e4ff 100%);
  border: 1px solid #dde6f8;
  border-radius: clamp(22px, 2.6vw, 34px);
  grid-template-columns: minmax(0,1.04fr) minmax(0,.96fr);
  gap: clamp(28px, 4vw, 64px);
  padding: clamp(34px, 4.8vw, 72px);
  display: grid; position: relative; overflow: hidden;
  box-shadow: 0 10px 28px #1c2e6e12, 0 36px 90px #1c2e6e1a;
}
.hero-panel::before {
  content: ""; pointer-events: none;
  background-image: radial-gradient(#355cff33 1px, #0000 1.5px);
  background-size: 26px 26px;
  position: absolute; inset: 0;
  -webkit-mask-image: radial-gradient(640px 480px at 78% 38%, #000, #0000 75%);
  mask-image: radial-gradient(640px 480px at 78% 38%, #000, #0000 75%);
}
.hero-copy { z-index: 1; align-self: center; position: relative; }
.hero-badge {
  box-shadow: var(--shadow-xs); color: var(--blue-deep); letter-spacing: -.005em;
  background: #ffffffd9; border: 1px solid #355cff2e; border-radius: 999px;
  align-items: center; gap: 9px; margin-bottom: 26px; padding: 8px 15px;
  font-size: .84rem; font-weight: 600; display: inline-flex;
}
.hero-badge::before {
  background: var(--green); content: ""; border-radius: 999px; width: 6px; height: 6px;
  animation: 2.4s ease-in-out infinite ct-pulse; box-shadow: 0 0 0 3px #1f9d6a29;
}
.hero h1 {
  font-size: clamp(2.7rem, 4.5vw, 4rem); max-width: 560px; margin-bottom: 22px; line-height: 1.04;
}
.hero-copy > p:not(.eyebrow) { color: var(--ink-soft); font-size: var(--text-lg); max-width: 470px; line-height: 1.62; }
.hero-actions { flex-wrap: wrap; gap: 12px; margin: 30px 0 0; display: flex; }
.hero-stats {
  z-index: 1; border-top: 1px solid #1c2e6e24; grid-column: 1/-1;
  gap: clamp(36px, 6vw, 72px); margin: 0; padding-top: clamp(22px, 2.6vw, 30px);
  display: flex; position: relative;
}
.hero-stats div { gap: 6px; display: grid; }
.hero-stats strong {
  color: var(--ink); font-variant-numeric: tabular-nums; letter-spacing: -.02em;
  font-size: clamp(1.4rem, 2vw, 1.7rem); font-weight: 620; line-height: 1;
}
.hero-stats span { color: var(--muted-ink); letter-spacing: -.005em; font-size: .84rem; font-weight: 500; }
.hero-visual { z-index: 1; align-self: center; min-height: 440px; position: relative; display: grid; align-content: center; gap: 12px; }

/* Hero console */
.hv-signals { display: grid; gap: 8px; margin-bottom: 4px; }
.hv-signal {
  background: #ffffffd9; border: 1px solid #355cff24; border-radius: 999px;
  box-shadow: var(--shadow-xs); color: var(--ink-soft);
  align-items: center; gap: 9px; padding: 8px 16px; width: fit-content;
  font-size: .82rem; font-weight: 500; display: inline-flex;
}
.hv-signal::before { content: ""; background: var(--blue); border-radius: 999px; width: 5px; height: 5px; flex: none; }
.hv-signal:nth-child(2) { margin-left: 22px; }
.hv-signal:nth-child(3) { margin-left: 44px; }
.hv-card {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--r-lg); box-shadow: var(--shadow-lg); padding: 22px;
}
.hv-card-kicker {
  color: var(--faint); font-family: var(--font-geist-mono), ui-monospace, monospace;
  letter-spacing: .08em; text-transform: uppercase; font-size: .68rem; font-weight: 500;
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;
}
.hv-card-kicker em { font-style: normal; color: var(--green); }
.hv-card h3 { font-size: 1.22rem; margin-bottom: 6px; }
.hv-card > p { font-size: .88rem; line-height: 1.55; margin-bottom: 16px; }
.hv-meta { display: flex; gap: 18px; align-items: center; border-top: 1px solid var(--line); padding-top: 14px; margin-bottom: 14px; }
.hv-score {
  width: 52px; height: 52px; border-radius: 999px; flex: none;
  background: conic-gradient(var(--blue) 338deg, #d9e2f8 0);
  display: grid; place-items: center;
}
.hv-score span {
  width: 42px; height: 42px; border-radius: 999px; background: var(--surface);
  display: grid; place-items: center; font-weight: 640; font-size: .92rem;
  font-variant-numeric: tabular-nums; color: var(--ink);
}
.hv-meta-item { display: grid; gap: 2px; }
.hv-meta-item strong { font-size: .92rem; font-weight: 620; color: var(--ink); letter-spacing: -.01em; }
.hv-meta-item span { font-size: .74rem; color: var(--faint); }
.hv-booked {
  background: var(--mint); border: 1px solid #1f9d6a3d; border-radius: var(--r-sm);
  color: #14684a; align-items: center; gap: 8px; padding: 10px 14px; margin-bottom: 12px;
  font-size: .84rem; font-weight: 560; display: flex;
}
.hv-next {
  background: var(--blue-wash); border-radius: var(--r-sm); color: var(--blue-ink);
  justify-content: space-between; align-items: center; gap: 10px; padding: 12px 14px;
  font-size: .86rem; font-weight: 560; display: flex;
}
.hv-next span:last-child { transition: transform .2s var(--ease); }
.hv-card:hover .hv-next span:last-child { transform: translateX(2px); }

/* ===== PROOF BAR ===== */
.proof-bar {
  border-bottom: 1px solid var(--line);
  grid-template-columns: 1fr 1.05fr;
  grid-template-areas: "label ." "logos copy";
  align-items: center; gap: 18px 48px; padding-top: 34px; padding-bottom: 34px;
  display: grid;
}
.proof-bar .ui-label { color: var(--faint); grid-area: label; margin-bottom: 0; }
.proof-bar-logos { grid-area: logos; display: flex; flex-wrap: wrap; align-items: center; gap: 18px 32px; }
.proof-bar-logos img { height: 28px; width: auto; max-width: 110px; object-fit: contain; opacity: .82; filter: grayscale(1); }
.proof-bar-copy { grid-area: copy; align-self: center; font-size: .96rem; margin-bottom: 0; }
.proof-bar-copy strong { color: var(--ink); font-weight: 600; }

/* ===== DEMO (agents) ===== */
.workflow-intro-section { text-align: center; padding-bottom: 28px; }
.workflow-intro-section .section-copy { margin: 0 auto; }
.demo-section { gap: 26px; display: grid; padding-top: 0; }
.demo-shell {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--r-xl); box-shadow: var(--shadow-md); color: var(--ink); padding: 28px;
}
.demo-tabs { grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 26px; display: grid; }
.demo-tab {
  background: var(--wash); border: 1px solid var(--line); color: var(--muted-ink);
  text-align: left; border-radius: 12px; align-items: center; gap: 12px;
  padding: 14px 18px; font-size: .95rem; font-weight: 560; font-family: inherit;
  transition: background .18s, border-color .18s, box-shadow .18s, color .18s;
  display: flex; position: relative; overflow: hidden; cursor: pointer;
}
.demo-tab:hover { border-color: var(--line-strong); color: var(--ink); }
.demo-tab.is-active { background: var(--surface); border-color: var(--line-strong); box-shadow: var(--shadow-sm); color: var(--ink); }
.demo-tab-index {
  color: var(--faint); font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: .7rem; font-weight: 500;
}
.demo-tab.is-active .demo-tab-index { color: var(--blue); }
.demo-tab-role { color: var(--faint); font-size: .74rem; font-weight: 500; display: block; }
.demo-tab-progress { background: none; height: 2px; position: absolute; bottom: 0; left: 0; right: 0; }
.demo-tab-progress.is-running::after {
  background: var(--blue); content: ""; height: 100%; display: block;
  animation: ${DEMO_INTERVAL}ms linear both tab-progress;
}
@keyframes tab-progress { from { width: 0; } to { width: 100%; } }
.demo-panel {
  animation: panel-swap .32s var(--ease);
  grid-template-columns: minmax(240px, 340px) 1fr;
  align-items: center; gap: 36px; display: grid;
}
.demo-copy { grid-template-rows: auto 1fr auto; align-items: flex-start; gap: 18px; min-height: 0; padding: 12px 0 12px 4px; display: grid; }
.demo-agent-row { display: flex; align-items: center; gap: 12px; }
.demo-portrait {
  width: 52px; height: 52px; border-radius: 999px; object-fit: cover; flex: none;
  border: 2px solid var(--agent-color, var(--blue)); background: var(--wash);
}
.demo-copy h3 { font-size: 1.6rem; font-weight: var(--font-heading); letter-spacing: -.022em; margin-bottom: 0; }
.demo-agent-role { color: var(--faint); font-size: .86rem; font-weight: 500; }
.demo-copy p { margin-bottom: 0; color: var(--muted-ink); }
.demo-copy strong {
  border-left: 2px solid var(--agent-color, var(--blue)); color: var(--ink);
  padding: 4px 0 4px 16px; font-weight: 530; line-height: 1.5; display: block;
}
.demo-badge {
  width: fit-content; border: 1px solid var(--line-strong); border-radius: 999px;
  color: var(--ink-soft); padding: 4px 12px; font-size: .76rem; font-weight: 600;
}
.demo-screenshot-frame {
  aspect-ratio: 1500/980; background: var(--wash); border: 1px solid var(--line);
  border-radius: var(--r); box-shadow: var(--shadow-sm); align-self: center;
  overflow: hidden; padding: 0; cursor: zoom-in; display: block; width: 100%;
}
.demo-screenshot { object-fit: cover; object-position: top left; width: 100%; height: 100%; display: block; }
.demo-carousel-controls { color: var(--faint); justify-content: flex-end; align-items: center; gap: 14px; margin-top: 20px; display: flex; }
.demo-carousel-controls > span {
  font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-variant-numeric: tabular-nums; font-size: .8rem; font-weight: 500;
}
.demo-carousel-controls > div { gap: 8px; display: flex; }
.demo-carousel-controls button {
  background: var(--surface); border: 1px solid var(--line-strong); color: var(--ink);
  height: 36px; width: 36px; border-radius: 999px; font-size: 1rem; cursor: pointer;
  justify-content: center; align-items: center; display: inline-flex;
  transition: background .16s ease, border-color .16s ease, transform .16s var(--ease);
}
.demo-carousel-controls button:hover { background: var(--wash); border-color: #0d111742; transform: translateY(-1px); }
.demo-custom-note {
  border-top: 1px solid var(--line); margin-top: 24px; padding-top: 20px;
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px;
}
.demo-custom-note p { margin: 0; font-size: .94rem; }
.demo-custom-note p strong { color: var(--ink); font-weight: 600; }

/* ===== SPLIT (overnight) ===== */
.split-section {
  grid-template-columns: minmax(0,.82fr) minmax(360px,1fr);
  align-items: center; gap: 56px; display: grid;
}
.overnight-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg);
  box-shadow: var(--shadow-lg); overflow: hidden;
}
.overnight-head {
  background: var(--navy); color: #fff; padding: 14px 20px;
  display: flex; justify-content: space-between; align-items: center;
}
.overnight-head span:first-child { font-size: .88rem; font-weight: 600; letter-spacing: -.01em; }
.overnight-head span:last-child {
  color: #aab5c7; font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: .72rem; font-variant-numeric: tabular-nums;
}
.overnight-rows { padding: 10px 20px; }
.overnight-row {
  display: flex; gap: 12px; align-items: flex-start; padding: 13px 0;
  border-bottom: 1px solid var(--line); font-size: .9rem;
}
.overnight-row:last-child { border-bottom: 0; }
.overnight-check {
  flex: none; width: 20px; height: 20px; border-radius: 999px; margin-top: 1px;
  background: var(--mint); color: #14684a; font-size: .68rem; font-weight: 700;
  display: grid; place-items: center;
}
.overnight-row div strong { display: block; color: var(--ink); font-weight: 600; font-size: .9rem; letter-spacing: -.01em; }
.overnight-row div span { color: var(--faint); font-size: .8rem; }
.overnight-needs-you {
  margin: 6px 20px 20px; background: var(--blue-wash); border-radius: var(--r-sm);
  color: var(--blue-ink); padding: 12px 14px; font-size: .86rem; font-weight: 560;
}

/* ===== PILLARS (how it works) ===== */
.pillar-grid { gap: var(--grid-gap); display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 28px; }
.pillar-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg);
  box-shadow: var(--shadow-xs); min-height: 300px; padding: var(--card-pad);
  flex-direction: column; display: flex;
  transition: border-color .2s ease, box-shadow .2s ease, transform .2s var(--ease);
}
.pillar-card:hover { border-color: var(--line-strong); box-shadow: var(--shadow-md); transform: translateY(-2px); }
.pillar-num {
  color: var(--faint); font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: .72rem; font-weight: 500; letter-spacing: .08em; margin-bottom: 14px;
}
.pillar-card h3 { margin-bottom: 16px; font-size: var(--h2-card); font-weight: var(--font-subhead); }
.pillar-card p { margin-bottom: 24px; font-size: .96rem; }
.pillar-card strong {
  background: var(--blue-wash); border-radius: var(--r-sm); color: var(--blue-ink);
  margin-top: auto; padding: 13px 14px; font-weight: 560; display: block; font-size: .9rem;
}
.pillar-actions { margin-top: 28px; display: flex; flex-wrap: wrap; gap: 12px; }
.outcome-card { min-height: 0; }
.outcome-card h3 { font-size: 1.18rem; }
.outcome-card strong { font-size: .88rem; }

/* ===== PROOF STORY ===== */
.proof-story {
  border-radius: var(--r-xl); box-shadow: var(--shadow-md); color: var(--ink);
  margin-bottom: var(--section-y);
  background:
    radial-gradient(560px 360px at 14% 0, #fff9, #0000 70%),
    linear-gradient(125deg, #d8f0e4 0%, #d6e5fb 38%, #ebe3fb 70%, #fbe7dc 100%);
  border: 1px solid #e4e2ee;
  grid-template-columns: .85fr 1fr auto; align-items: center; gap: 32px;
  padding: 56px; display: grid;
}
.proof-story .eyebrow { margin-bottom: 10px; }
.proof-story h2 { margin-bottom: 0; }
.proof-story p { color: var(--ink-soft); margin-bottom: 0; }

/* ===== IMPACT GRID ===== */
.impact-grid { gap: var(--grid-gap); display: grid; grid-template-columns: repeat(2, 1fr); margin-top: 28px; }
.impact-grid article {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg);
  box-shadow: var(--shadow-xs); padding: var(--card-pad);
  display: flex; flex-direction: column; gap: 14px;
  transition: border-color .2s ease, box-shadow .2s ease, transform .2s var(--ease);
}
.impact-grid article:hover { border-color: var(--line-strong); box-shadow: var(--shadow-md); transform: translateY(-2px); }
.impact-stat { display: flex; align-items: baseline; gap: 10px; }
.impact-stat strong {
  color: var(--blue); font-size: 2rem; font-weight: 620; letter-spacing: -.03em;
  font-variant-numeric: tabular-nums; line-height: 1;
}
.impact-stat span { color: var(--faint); font-size: .84rem; font-weight: 500; }
.impact-grid blockquote { margin: 0; color: var(--muted-ink); font-size: .96rem; line-height: 1.65; flex: 1; }
.impact-author { border-top: 1px solid var(--line); padding-top: 14px; }
.impact-author strong { display: block; color: var(--ink); font-size: .9rem; font-weight: 600; }
.impact-author span { color: var(--faint); font-size: .82rem; }

/* ===== CALCULATOR ===== */
.calculator-section {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-xl);
  box-shadow: var(--shadow-md); margin-bottom: var(--section-y);
  padding-top: 52px; padding-bottom: 52px; scroll-margin-top: 128px;
}
.calculator-grid { gap: var(--grid-gap-lg); grid-template-columns: 1fr .76fr; margin-top: 30px; display: grid; }
.calculator-inputs, .calculator-result { border-radius: var(--r-lg); padding: var(--card-pad); }
.calculator-inputs { background: var(--wash); border: 1px solid var(--line); display: grid; gap: 22px; align-content: start; }
.calc-field label { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-bottom: 10px; }
.calc-field label span { color: var(--ink); font-size: .92rem; font-weight: 560; }
.calc-field label output {
  color: var(--blue-ink); font-variant-numeric: tabular-nums; font-weight: 620; font-size: .98rem;
  font-family: var(--font-geist-mono), ui-monospace, monospace;
}
.calc-field input[type=range] {
  -webkit-appearance: none; appearance: none; width: 100%; height: 5px; border-radius: 999px;
  background: linear-gradient(to right, var(--blue) 0%, var(--blue) var(--fill, 50%), #d9e2f8 var(--fill, 50%), #d9e2f8 100%);
  outline: none; cursor: pointer;
}
.calc-field input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none; width: 19px; height: 19px; border-radius: 999px;
  background: #fff; border: 1.5px solid var(--blue-deep);
  box-shadow: 0 1px 4px #2447e052; cursor: grab;
}
.calc-field input[type=range]::-moz-range-thumb {
  width: 19px; height: 19px; border-radius: 999px; background: #fff;
  border: 1.5px solid var(--blue-deep); box-shadow: 0 1px 4px #2447e052; cursor: grab;
}
.calculator-result {
  color: var(--ink);
  background:
    radial-gradient(420px 300px at 86% 0, #ffffff8c, #0000 70%),
    linear-gradient(125deg, #dfe2fc 0%, #e9defb 45%, #d7e7fd 100%);
  border: 1px solid #e2e0f2; display: grid; align-content: center; gap: 4px;
}
.calculator-result .ui-label { color: var(--blue-ink); }
.calculator-result strong {
  font-variant-numeric: tabular-nums; letter-spacing: -.03em; margin-bottom: 18px;
  font-size: clamp(2.4rem, 4vw, 3.2rem); font-weight: 620; line-height: 1; display: block;
}
.calculator-result p { color: var(--ink-soft); }
.calculator-result .fine-print { color: var(--faint); }
.calculator-cta { margin-top: 22px; }

/* ===== FAQ ===== */
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

/* ===== CTA ===== */
.cta-section {
  border-radius: var(--r-xl); box-shadow: var(--shadow-md); color: var(--ink);
  gap: var(--grid-gap-lg); margin-bottom: var(--section-y);
  background:
    radial-gradient(900px 500px at 88% 0, #355cff29, #0000 62%),
    radial-gradient(760px 520px at 0 112%, #355cff21, #0000 64%),
    linear-gradient(138deg, #f4f7ff 0%, #e7eeff 50%, #d8e4ff 100%);
  border: 1px solid #dde6f8;
  justify-content: space-between; align-items: center; padding: 56px; display: flex;
}
.cta-section h2 { margin-bottom: 10px; }
.cta-section p { color: var(--ink-soft); max-width: 640px; margin-bottom: 0; }

/* ===== LIGHTBOX ===== */
.lightbox-backdrop {
  position: fixed; inset: 0; background: #0d1117d9;
  display: flex; align-items: center; justify-content: center;
  z-index: 999999; padding: 40px 24px; animation: lb-fade .18s ease;
}
@keyframes lb-fade { from { opacity: 0; } to { opacity: 1; } }
.lightbox-inner { max-width: 1300px; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.lightbox-img-wrap {
  background: #fff; border-radius: var(--r); box-shadow: var(--shadow-lg);
  max-width: 100%; max-height: 82vh; overflow: auto;
}
.lightbox-img-wrap img { display: block; width: 100%; height: auto; max-width: 1300px; }
.lightbox-caption { color: #fff; font-size: .9rem; font-weight: 560; display: flex; align-items: center; gap: 12px; }
.lightbox-close {
  background: #fff; color: var(--ink); border: none; font-family: inherit;
  font-weight: 600; font-size: .82rem; padding: 6px 14px; border-radius: 999px; cursor: pointer;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1020px) {
  .hero-panel, .split-section, .faq-section, .calculator-grid { grid-template-columns: 1fr; }
  .proof-bar { grid-template-columns: 1fr; grid-template-areas: "label" "logos" "copy"; }
  .hero-visual { min-height: 420px; }
  .pillar-grid { grid-template-columns: 1fr; }
  .outcome-grid { grid-template-columns: repeat(2, 1fr); }
  .proof-story { grid-template-columns: 1fr; padding: 40px; }
  .impact-grid { grid-template-columns: 1fr; }
  .demo-tabs { grid-template-columns: repeat(5, 1fr); }
  .demo-tab { flex-direction: column; align-items: flex-start; gap: 4px; padding: 10px 12px; font-size: .86rem; }
  .demo-tab-role { display: none; }
  .demo-panel { grid-template-columns: 1fr; }
  .cta-section { flex-direction: column; align-items: stretch; }
}
@media (max-width: 720px) {
  .hero { padding-top: 10px; padding-left: 10px; padding-right: 10px; }
  .hero-panel { gap: 22px; padding: 28px 22px; }
  .hero h1 { font-size: 2.3rem; line-height: 1.06; }
  .hero-copy > p:not(.eyebrow) { font-size: 1rem; }
  .hero-actions { margin: 22px 0 0; }
  .hero-actions .button { min-height: 42px; padding-left: 13px; padding-right: 13px; font-size: .9rem; }
  .hero-stats { flex-wrap: wrap; gap: 20px 28px; margin-top: 4px; padding-top: 24px; }
  .hero-stats strong { font-size: 1.15rem; }
  .hero-stats span { font-size: .7rem; }
  .hero-visual { min-height: 380px; }
  .demo-shell { padding: 18px; }
  .demo-copy { min-height: auto; padding-left: 0; }
  .demo-tabs { gap: 6px; grid-template-columns: repeat(5, 1fr); }
  .demo-tab { justify-content: center; align-items: center; padding: 9px 6px; }
  .demo-tab-index { display: none; }
  .proof-story, .cta-section { padding: 30px; }
  .outcome-grid { grid-template-columns: 1fr; }
  .calculator-result strong { font-size: 2.2rem; }
}
      `}</style>

      <SiteNav />

      <main>
        {/* ===== HERO ===== */}
        <section className="hero">
          <div className="hero-panel">
            <div className="hero-copy reveal-item is-visible">
              <div className="hero-badge">Built for regenerative medicine clinics</div>
              <h1>We build AI employees for your clinic.</h1>
              <p>
                We don&apos;t hand you a fixed set of tools and hope they fit. We learn how your
                clinic actually runs, build agents for the problems costing you the most, and
                keep building as your needs grow.
              </p>
              <div className="hero-actions">
                <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
                  Book a demo
                </a>
                <a href="#why" className="button secondary">See what you get</a>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hv-signals" aria-hidden="true">
                <span className="hv-signal">New inquiry, 9:14 PM</span>
                <span className="hv-signal">Asked about stem cell pricing</span>
                <span className="hv-signal">Traveling from the US</span>
              </div>
              <div className="hv-card">
                <div className="hv-card-kicker">
                  <span>Qualified lead</span>
                  <em>Mia replied in 3 seconds</em>
                </div>
                <h3>Knee stem cell therapy</h3>
                <p>
                  US patient traveling for treatment. Pricing shared, travel logistics explained,
                  free consultation offered.
                </p>
                <div className="hv-meta">
                  <div className="hv-score" aria-hidden="true"><span>94</span></div>
                  <div className="hv-meta-item">
                    <strong>Hot lead</strong>
                    <span>Fit score</span>
                  </div>
                  <div className="hv-meta-item">
                    <strong>$12K</strong>
                    <span>Est. value</span>
                  </div>
                  <div className="hv-meta-item">
                    <strong>EN / ES</strong>
                    <span>Languages</span>
                  </div>
                </div>
                <div className="hv-booked">
                  <span>&#10003;</span> Consultation booked for Apr 22 at 10:00 AM with Dr. Rivera
                </div>
                <div className="hv-next">
                  <span>Next step: Sage briefs your coordinator</span>
                  <span aria-hidden="true">&rarr;</span>
                </div>
              </div>
            </div>

            <div className="hero-stats">
              <Stat target={25} prefix="+" suffix="%" label="Patient conversion" />
              <Stat target={50} suffix="%+" label="More operating efficiency" />
              <Stat target={5} suffix="x" label="Staff output, same headcount" />
              <div>
                <strong>24/7</strong>
                <span>Practice availability</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PROOF BAR ===== */}
        <div className="proof-bar">
          <span className="ui-label">Backed by investors from</span>
          <div className="proof-bar-logos">
            {investorLogos.map((logo) => (
              <img key={logo.alt} src={logo.src} alt={logo.alt} loading="lazy" />
            ))}
          </div>
          <p className="proof-bar-copy">
            <strong>Operators and investors</strong>{" "}
            behind some of the world&apos;s best software and AI companies back ClinicTech.
          </p>
        </div>

        {/* ===== OUTCOMES ===== */}
        <section className="section" id="why">
          <div className="section-copy wide reveal-item">
            <span className="eyebrow">Why clinics work with us</span>
            <h2>Hire outcomes, not software.</h2>
            <p>
              We are not selling you a platform to figure out. Tell us where your clinic loses
              time and patients, and we build AI employees to fix exactly that. This is what
              clinics hire us for.
            </p>
          </div>
          <div className="pillar-grid outcome-grid reveal-item">
            {outcomes.map((o) => (
              <article key={o.title} className="pillar-card outcome-card">
                <h3>{o.title}</h3>
                <p>{o.body}</p>
                <strong>{o.punch}</strong>
              </article>
            ))}
          </div>
        </section>

        {/* ===== EXAMPLE AGENTS INTRO + DEMO ===== */}
        <section className="section workflow-intro-section" id="agents" style={{ paddingTop: 0 }}>
          <div className="section-copy wide reveal-item">
            <span className="eyebrow">Example builds</span>
            <h2>Agents we have built for clinics like yours.</h2>
            <p>
              Every clinic runs differently, so no two builds are the same. These five are real
              examples of AI employees we have built for regenerative medicine clinics, each one
              shaped around a problem the clinic needed solved.
            </p>
          </div>
        </section>

        <section className="section demo-section">
          <div className="demo-shell reveal-item">
            <div className="demo-tabs" role="tablist" aria-label="ClinicTech agents">
              {agents.map((a, i) => (
                <button
                  key={a.slug}
                  type="button"
                  role="tab"
                  aria-selected={i === activeAgent}
                  className={`demo-tab${i === activeAgent ? " is-active" : ""}`}
                  onClick={() => setActiveAgent(i)}
                >
                  <span className="demo-tab-index">0{i + 1}</span>
                  <span>
                    {a.name}
                    <span className="demo-tab-role">{a.role}</span>
                  </span>
                  <span className={`demo-tab-progress${i === activeAgent ? " is-running" : ""}`} key={`p-${activeAgent}`} />
                </button>
              ))}
            </div>

            <div
              className="demo-panel"
              key={agent.slug}
              style={{ ["--agent-color" as string]: agent.color } as React.CSSProperties}
            >
              <div className="demo-copy">
                <div>
                  <div className="demo-agent-row">
                    <img className="demo-portrait" src={`/agents/${agent.slug}.png`} alt={`${agent.name}, ${agent.role}`} />
                    <div>
                      <h3>{agent.name}</h3>
                      <span className="demo-agent-role">{agent.role}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "grid", gap: 16 }}>
                  <p style={{ color: "var(--ink)", fontWeight: 560, fontSize: "1.06rem" }}>{agent.headline}</p>
                  <p>{agent.body}</p>
                  {agent.badge && <span className="demo-badge">{agent.badge}</span>}
                </div>
                <strong>{agent.keyFact}</strong>
              </div>
              <button
                type="button"
                className="demo-screenshot-frame"
                onClick={() => openLightbox(agent.slug)}
                aria-label={`See ${agent.name} in action`}
              >
                <img className="demo-screenshot" src={`/mockups/${agent.slug}.png`} alt={`${agent.name} inside ClinicTech`} loading="lazy" />
              </button>
            </div>

            <div className="demo-carousel-controls">
              <span>0{activeAgent + 1} / 0{agents.length}</span>
              <div>
                <button type="button" aria-label="Previous agent" onClick={() => setActiveAgent((activeAgent + agents.length - 1) % agents.length)}>&larr;</button>
                <button type="button" aria-label="Next agent" onClick={() => setActiveAgent((activeAgent + 1) % agents.length)}>&rarr;</button>
              </div>
            </div>

            <div className="demo-custom-note">
              <p>
                <strong>This is not a menu.</strong> Your agents get built around your problems,
                your protocols, and your tone. Tell us where your clinic loses the most time.
              </p>
              <a className="button secondary small" href="mailto:delaney@clinictech.io?subject=Custom%20agent%20for%20our%20clinic">
                Tell us about the role
              </a>
            </div>
          </div>
        </section>

        {/* ===== SPLIT: WHILE YOU SLEEP ===== */}
        <section className="section split-section">
          <div className="section-copy reveal-item">
            <span className="eyebrow">While you sleep</span>
            <h2>Your clinic keeps selling after the lights go out.</h2>
            <p>
              Most clinics reply the next morning. By then, 78% of patients have already booked
              with whoever answered first. Your agents work the inbox overnight, answer in
              English and Spanish, and hand you a brief with your coffee.
            </p>
            <div className="section-action">
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button dark">
                See it in action
              </a>
            </div>
          </div>
          <div className="overnight-card reveal-item">
            <div className="overnight-head">
              <span>Overnight brief</span>
              <span>7:02 AM</span>
            </div>
            <div className="overnight-rows">
              <div className="overnight-row">
                <span className="overnight-check">&#10003;</span>
                <div>
                  <strong>3 new leads followed up</strong>
                  <span>First reply sent within 30 seconds of each inquiry</span>
                </div>
              </div>
              <div className="overnight-row">
                <span className="overnight-check">&#10003;</span>
                <div>
                  <strong>7 patient questions answered</strong>
                  <span>Stem cell pricing, recovery times, travel logistics</span>
                </div>
              </div>
              <div className="overnight-row">
                <span className="overnight-check">&#10003;</span>
                <div>
                  <strong>Travel confirmed for Sarah M.</strong>
                  <span>Flight, hotel, and pickup all coordinated</span>
                </div>
              </div>
              <div className="overnight-row">
                <span className="overnight-check">&#10003;</span>
                <div>
                  <strong>2 review requests sent</strong>
                  <span>Rio asked at the right moment, day 30 check-ins</span>
                </div>
              </div>
            </div>
            <div className="overnight-needs-you">
              1 item needs you: Michael T. wants to reschedule his consultation.
            </div>
          </div>
        </section>

        {/* ===== HOW WE WORK TOGETHER ===== */}
        <section className="section" id="how-it-works">
          <div className="section-copy wide reveal-item">
            <span className="eyebrow">How we work together</span>
            <h2>Most platforms sell you a feature list. We build you a team.</h2>
            <p>
              It starts with a conversation about how your clinic actually runs. From there we put
              the right AI employees in place, and build new ones as your team grows.
            </p>
          </div>
          <div className="pillar-grid reveal-item">
            <article className="pillar-card">
              <span className="pillar-num">STEP 01</span>
              <h3>We learn your clinic</h3>
              <p>
                How patients find you. How protocols get built. How follow-up happens. Where your
                staff loses hours every week. We sit with you until we understand it the way you do.
              </p>
              <strong>Week one starts with a conversation, not an import.</strong>
            </article>
            <article className="pillar-card">
              <span className="pillar-num">STEP 02</span>
              <h3>We build your first agents</h3>
              <p>
                We start where the bleeding is: missed bookings, slow follow-up, admin overload.
                Your first agents go live trained on your protocols, your tone, and your pipeline.
              </p>
              <strong>Built around your problems, not our roadmap.</strong>
            </article>
            <article className="pillar-card">
              <span className="pillar-num">STEP 03</span>
              <h3>We keep building</h3>
              <p>
                As you grow, as you spot a gap, as you imagine a role that does not exist yet, we
                build the agent to fill it. You are never boxed in by what we shipped last quarter.
              </p>
              <strong>An extended tech team, on call as you grow.</strong>
            </article>
          </div>
          <div className="pillar-actions reveal-item">
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
              Book a demo
            </a>
          </div>
        </section>

        {/* ===== PROOF STORY ===== */}
        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="proof-story reveal-item">
            <div>
              <span className="eyebrow">ClinicTech success story</span>
              <h2>An extra 5 consults a month from leads that would have gone cold.</h2>
            </div>
            <p>
              Dr. James L. was getting inquiries but barely booking any. After switching his
              clinic&apos;s intake to ClinicTech, the follow-up sequences run themselves, and
              inquiries that used to die in the inbox now turn into booked consultations.
            </p>
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button secondary">
              Book a demo
            </a>
          </div>
        </div>

        {/* ===== IMPACT GRID ===== */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy reveal-item">
            <span className="eyebrow">Customer impact</span>
            <h2>Trusted by regenerative medicine clinics across North America.</h2>
          </div>
          <div className="impact-grid reveal-item">
            {impactStories.map((s) => (
              <article key={s.name}>
                <div className="impact-stat">
                  <strong>{s.stat}</strong>
                  <span>{s.statLabel}</span>
                </div>
                <blockquote>&ldquo;{s.quote}&rdquo;</blockquote>
                <div className="impact-author">
                  <strong>{s.name}</strong>
                  <span>{s.role}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ===== CALCULATOR ===== */}
        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <section className="calculator-section" id="calculator">
            <div style={{ padding: "0 var(--card-pad)" }}>
              <div className="section-copy wide reveal-item">
                <span className="eyebrow">What you are missing</span>
                <h2>How much revenue is sitting in leads that never hear back?</h2>
              </div>
              <div className="calculator-grid reveal-item">
                <div className="calculator-inputs">
                  <div className="calc-field">
                    <label>
                      <span>New patient inquiries per month</span>
                      <output>{inquiries}</output>
                    </label>
                    <input
                      type="range" min={10} max={300} step={5} value={inquiries}
                      style={{ ["--fill" as string]: `${((inquiries - 10) / 290) * 100}%` } as React.CSSProperties}
                      onChange={(e) => setInquiries(Number(e.target.value))}
                    />
                  </div>
                  <div className="calc-field">
                    <label>
                      <span>Average treatment value</span>
                      <output>{fmt(avgValue)}</output>
                    </label>
                    <input
                      type="range" min={2000} max={30000} step={500} value={avgValue}
                      style={{ ["--fill" as string]: `${((avgValue - 2000) / 28000) * 100}%` } as React.CSSProperties}
                      onChange={(e) => setAvgValue(Number(e.target.value))}
                    />
                  </div>
                  <div className="calc-field">
                    <label>
                      <span>Consult to treatment rate</span>
                      <output>{closeRate}%</output>
                    </label>
                    <input
                      type="range" min={10} max={80} step={1} value={closeRate}
                      style={{ ["--fill" as string]: `${((closeRate - 10) / 70) * 100}%` } as React.CSSProperties}
                      onChange={(e) => setCloseRate(Number(e.target.value))}
                    />
                  </div>
                  <div className="calc-field">
                    <label>
                      <span>Inquiries that currently go cold</span>
                      <output>{coldShare}%</output>
                    </label>
                    <input
                      type="range" min={0} max={60} step={1} value={coldShare}
                      style={{ ["--fill" as string]: `${(coldShare / 60) * 100}%` } as React.CSSProperties}
                      onChange={(e) => setColdShare(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="calculator-result">
                  <span className="ui-label">Estimated annual upside</span>
                  <strong>{fmt(upside.total)}</strong>
                  <p>
                    {fmt(upside.recovered)} from leads that currently go cold, plus{" "}
                    {fmt(upside.lift)} from a faster first reply on the rest.
                  </p>
                  <p className="fine-print">
                    Estimate based on your inputs and a 15% conversion lift from instant follow-up.
                    Bring your real numbers to a demo and we will run them properly.
                  </p>
                  <div className="calculator-cta">
                    <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
                      Get the breakdown
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ===== FAQ ===== */}
        <section className="section faq-section">
          <div className="section-copy reveal-item">
            <span className="eyebrow">FAQ</span>
            <h2>Clear answers for clinics considering ClinicTech.</h2>
            <p>
              Anything else? Bring it to a demo and we will answer it against your clinic&apos;s
              real pipeline.
            </p>
            <div className="section-action">
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button secondary">
                Book a demo
              </a>
            </div>
          </div>
          <div className="faq-list reveal-item">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ===== CTA ===== */}
        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <section className="cta-section reveal-item">
            <div>
              <h2>Patients book with the clinic that answers first.</h2>
              <p>
                78% of patients book with the first clinic that responds. Every day of slow
                replies is consults booked somewhere else. Put a team on it tonight.
              </p>
            </div>
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
              Book a demo
            </a>
          </section>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="site-footer">
        <div>
          <img
            src="/clinictech-logo.png"
            alt="ClinicTech"
            style={{ height: 30, width: "auto", filter: "brightness(0) saturate(100%) invert(13%) sepia(50%) saturate(3000%) hue-rotate(240deg)" }}
          />
          <p>
            We build AI employees for regenerative medicine clinics. Named, capable, accountable,
            and working your pipeline around the clock.
          </p>
        </div>
        <nav className="footer-group" aria-label="Working with us">
          <h2>Working with us</h2>
          <a href="/#why">Why ClinicTech</a>
          <a href="/#agents">Example agents</a>
          <a href="/#how-it-works">How it works</a>
          <a href="/voice-agent-demo">Voice demo</a>
        </nav>
        <nav className="footer-group" aria-label="Resources">
          <h2>Resources</h2>
          <a href="/blog">Blog</a>
          <a href="/regen-news">Regen news</a>
          <a href="/about">About</a>
        </nav>
        <nav className="footer-group" aria-label="Legal">
          <h2>Legal</h2>
          <a href="/privacy">Privacy policy</a>
          <a href="/terms">Terms of service</a>
          <a href="/contact">Contact</a>
        </nav>
        <div className="footer-bottom">
          <span>&copy; 2026 ClinicTech. All rights reserved.</span>
          <span>Mia. Atlas. Rio. Sage. Tomas.</span>
        </div>
      </footer>

      {mounted && lightbox && createPortal(
        <div
          className="lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Preview"
          onClick={closeLightbox}
        >
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-img-wrap">
              <img src={`/mockups/${lightbox}.png`} alt="ClinicTech preview" />
            </div>
            <div className="lightbox-caption">
              <span>{agents.find((a) => a.slug === lightbox)?.name ?? "ClinicTech"} inside ClinicTech</span>
              <button type="button" className="lightbox-close" onClick={closeLightbox} autoFocus>Close</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
