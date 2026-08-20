"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { FaqSection } from "@/components/faq-section";
import { PlaybookPanel } from "@/components/playbook-panel";
import { InvestorStrip } from "@/components/investor-strip";
import { agents, getAgent, CALENDAR_URL } from "@/lib/agents";

const problemsLeft = [
  "You start your day with 100+ unread emails",
  "Patient called after hours without a response",
  "Your social media hasn't been updated in weeks",
];

const problemsRight = [
  "Your staff is buried in admin",
  "You can't hire because payroll is getting out of control",
];

// Every channel Mia picks up. Shown as chips in the "Meet Mia" callout.
const miaChannels = [
  "Phone",
  "Email",
  "Web form",
  "Chatbot",
  "WhatsApp",
  "Social media",
];

const outcomes = [
  {
    title: "More patients booked",
    body: "Caddie replies to every inquiry in seconds and follows up until the patient books or says no.",
    proof: "Leads are 5x more likely to book when you respond within 5 minutes.",
  },
  {
    title: "Lower operating costs",
    body: "Your AI employees handle the busywork, so you scale volume without adding headcount.",
    proof: "Cut admin hours and grow without adding more headcount.",
  },
  {
    title: "A 5-star patient experience",
    body: "Every patient gets instant answers and constant follow-through, even when the clinic is slammed.",
    proof: "Personalized messages get 20% more responses.",
  },
];

// The patient journey diagram. `agent: "patient"` marks a patient step.
// A step with two cards shares one portrait, with a card either side of it.
const journey: { agent: string; cards: { tag: string; text: string }[] }[] = [
  {
    agent: "vidi",
    cards: [
      { tag: "Instagram", text: "Vidi posts a knee pain video on your clinic's Instagram." },
    ],
  },
  {
    agent: "iris",
    cards: [
      {
        tag: "Comments & DMs",
        text: "A patient comments asking about your knee pain treatments. Iris replies in your clinic's voice.",
      },
    ],
  },
  {
    agent: "mia",
    cards: [
      {
        tag: "Phone",
        text: "The patient calls for pricing. Mia already has the knee pain context and shares pricing on the spot.",
      },
      {
        tag: "Calendar",
        text: "Mia books the consult straight into your doctor's calendar.",
      },
    ],
  },
  {
    agent: "atlas",
    cards: [{ tag: "Protocols", text: "Atlas drafts a knee pain protocol for the patient." }],
  },
  {
    agent: "juno",
    cards: [
      {
        tag: "Doctor review",
        text: "Juno flags the protocol to your doctor for review and sign-off.",
      },
    ],
  },
  {
    agent: "sage",
    cards: [
      {
        tag: "Call prep",
        text: "Sage preps your concierge with the protocol and full patient context before the call.",
      },
    ],
  },
  {
    agent: "patient",
    cards: [{ tag: "In clinic", text: "The patient comes in and gets treatment." }],
  },
  {
    agent: "rio",
    cards: [{ tag: "Follow-up", text: "Rio follows up for a 5-star review and testimonial." }],
  },
];

// Precompute which side each single-card step sits on so the zigzag keeps
// alternating around the two-sided steps.
const journeySteps = (() => {
  let onLeft = true;
  return journey.map((step) => {
    if (step.cards.length > 1) {
      onLeft = true;
      return { ...step, side: "both" as const };
    }
    const side = onLeft ? ("left" as const) : ("right" as const);
    onLeft = !onLeft;
    return { ...step, side };
  });
})();

function agentVars(slug: string | null) {
  const a = slug ? getAgent(slug) : undefined;
  if (!a) return {};
  return {
    ["--agent-color" as string]: a.color,
    ["--agent-bg" as string]: a.bg,
    ["--agent-edge" as string]: a.bgEdge,
    ["--agent-role" as string]: a.roleColor,
  } as React.CSSProperties;
}

export default function LandingPage() {
  // Calculator state
  const [inquiries, setInquiries] = useState(60);
  const [avgValue, setAvgValue] = useState(9000);
  const [closeRate, setCloseRate] = useState(30);
  const [coldShare, setColdShare] = useState(25);

  const upside = useMemo(() => {
    // Conservative model: an instant, persistent first reply re-engages about
    // 40% of inquiries that currently go cold, and lifts conversion by 10% on
    // the rest. Both convert at the clinic's own consult-to-treatment rate.
    const RECOVERY = 0.4;
    const LIFT = 0.1;
    const yearly = inquiries * 12;
    const recoveredTx = yearly * (coldShare / 100) * RECOVERY * (closeRate / 100);
    const liftTx = yearly * (1 - coldShare / 100) * (closeRate / 100) * LIFT;
    const totalTx = recoveredTx + liftTx;
    return {
      total: totalTx * avgValue,
      recovered: recoveredTx * avgValue,
      lift: liftTx * avgValue,
    };
  }, [inquiries, avgValue, closeRate, coldShare]);

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

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

  // Patient journey: reveal each agent and their action one at a time as the
  // section scrolls past, and draw the connector line in behind them.
  useEffect(() => {
    const journeyEl = document.querySelector<HTMLElement>(".journey");
    if (!journeyEl) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const steps = Array.from(journeyEl.querySelectorAll<HTMLElement>(".journey-step"));

    if (reduceMotion) {
      steps.forEach((s) => s.classList.add("is-revealed"));
      journeyEl.style.setProperty("--journey-progress", "1");
      return;
    }

    // Several steps fit on screen at once, so a plain observer would pop them
    // all in together. Cascade whatever arrives in the same batch instead, in
    // document order, so they always read as one-after-the-other.
    const observer = new IntersectionObserver(
      (entries) => {
        const arriving = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement)
          .sort((a, b) => steps.indexOf(a) - steps.indexOf(b));

        arriving.forEach((el, i) => {
          observer.unobserve(el);
          window.setTimeout(() => el.classList.add("is-revealed"), i * 160);
        });
      },
      { threshold: 0.35, rootMargin: "0px 0px -22% 0px" }
    );
    steps.forEach((s) => observer.observe(s));

    // Grow the progress line from the first portrait to the last as you scroll.
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = journeyEl.getBoundingClientRect();
      const vh = window.innerHeight;

      // A fast scroll or a jump link can carry a step past the viewport without
      // the observer ever sampling it as visible, which would strand it hidden.
      // Anything already above the fold gets revealed outright.
      steps.forEach((el) => {
        if (el.classList.contains("is-revealed")) return;
        if (el.getBoundingClientRect().bottom < 0) {
          observer.unobserve(el);
          el.classList.add("is-revealed");
        }
      });

      // 0 when the section's top sits at 75% of the viewport, 1 once its
      // bottom has risen to 55%, so the line finishes with the last step.
      const startsAt = vh * 0.75;
      const travel = rect.height + vh * 0.2;
      const progress = travel > 0 ? (startsAt - rect.top) / travel : 1;
      journeyEl.style.setProperty(
        "--journey-progress",
        String(Math.max(0, Math.min(1, progress)))
      );
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

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
  padding: clamp(40px, 5vw, 76px) clamp(24px, 4vw, 64px) clamp(34px, 4vw, 56px);
  display: grid; justify-items: center; text-align: center;
  position: relative; overflow: hidden;
  box-shadow: 0 10px 28px #1c2e6e12, 0 36px 90px #1c2e6e1a;
}
.hero-panel::before {
  content: ""; pointer-events: none;
  background-image: radial-gradient(#355cff33 1px, #0000 1.5px);
  background-size: 26px 26px;
  position: absolute; inset: 0;
  -webkit-mask-image: radial-gradient(720px 420px at 50% 0%, #000, #0000 78%);
  mask-image: radial-gradient(720px 420px at 50% 0%, #000, #0000 78%);
}
.hero-badge {
  box-shadow: var(--shadow-xs); color: var(--blue-deep); letter-spacing: -.005em;
  background: #ffffffd9; border: 1px solid #355cff2e; border-radius: 999px;
  align-items: center; gap: 9px; margin-bottom: 26px; padding: 8px 15px;
  font-size: .84rem; font-weight: 600; display: inline-flex;
  position: relative; z-index: 1;
}
.hero-badge::before {
  background: var(--green); content: ""; border-radius: 999px; width: 6px; height: 6px;
  animation: 2.4s ease-in-out infinite ct-pulse; box-shadow: 0 0 0 3px #1f9d6a29;
}
.hero h1 { font-size: clamp(2.7rem, 5vw, 4.2rem); max-width: 800px; margin: 0 auto 20px; line-height: 1.04; position: relative; z-index: 1; }
.hero-sub { color: var(--ink-soft); font-size: var(--text-lg); max-width: 620px; margin: 0 auto; line-height: 1.62; position: relative; z-index: 1; }
.hero-actions { justify-content: center; flex-wrap: wrap; gap: 12px; margin: 28px 0 0; display: flex; position: relative; z-index: 1; }

/* Hero lineup */
.hero-lineup {
  width: 100%; margin-top: clamp(34px, 4vw, 52px);
  display: grid; grid-template-columns: repeat(8, 1fr); gap: 10px;
  position: relative; z-index: 1;
}
.lineup-card {
  background: #ffffffd9; border: 1px solid #355cff24; border-radius: 16px;
  box-shadow: var(--shadow-xs); padding: 12px 8px 14px;
  display: grid; justify-items: center; gap: 8px; text-decoration: none;
  transition: transform .2s var(--ease), box-shadow .2s ease, border-color .2s ease;
}
.lineup-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--agent-edge, var(--blue)); }
.lineup-card img {
  width: 100%; max-width: 92px; aspect-ratio: 1; border-radius: 14px; object-fit: cover;
  border: 2px solid var(--agent-edge, var(--line-strong));
}
.lineup-card strong { color: var(--ink); font-size: .95rem; font-weight: 620; letter-spacing: -.01em; line-height: 1; }
.lineup-card span { color: var(--agent-role, var(--muted-ink)); font-size: .72rem; font-weight: 550; line-height: 1.25; text-align: center; }

/* ===== PROBLEM ===== */
.problem-section { text-align: center; }
.problem-section .section-copy { margin: 0 auto; }
.problem-layout {
  max-width: 1020px; margin: 40px auto 0;
  display: grid; grid-template-columns: 1fr minmax(280px, 400px) 1fr;
  gap: 24px; align-items: center;
}
.problem-col { display: grid; gap: 18px; }
.problem-img {
  border-radius: var(--r-xl); overflow: hidden;
  border: 1px solid var(--line); box-shadow: var(--shadow-lg);
}
.problem-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.problem-bubble {
  background: var(--surface); border: 1px solid var(--line);
  box-shadow: var(--shadow-sm); color: var(--ink); text-align: left;
  padding: 14px 20px; font-size: .96rem; font-weight: 530; line-height: 1.45;
  animation: bubble-float 7s ease-in-out infinite;
  will-change: transform;
}
/* Stagger the drift so the bubbles never move in lockstep. */
.problem-col:first-child .problem-bubble:nth-child(1) { animation-duration: 6.5s; animation-delay: -.4s; }
.problem-col:first-child .problem-bubble:nth-child(2) { animation-duration: 8s; animation-delay: -2.6s; }
.problem-col:first-child .problem-bubble:nth-child(3) { animation-duration: 7.2s; animation-delay: -4.1s; }
.problem-col:last-child .problem-bubble:nth-child(1) { animation-duration: 7.6s; animation-delay: -1.5s; }
.problem-col:last-child .problem-bubble:nth-child(2) { animation-duration: 6.8s; animation-delay: -3.3s; }
@keyframes bubble-float {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
  33% { transform: translate3d(3px, -7px, 0) rotate(.5deg); }
  66% { transform: translate3d(-3px, -3px, 0) rotate(-.4deg); }
}
@media (prefers-reduced-motion: reduce) {
  .problem-bubble { animation: none; }
}
.problem-bubble::before {
  content: ""; width: 8px; height: 8px; border-radius: 999px; background: var(--coral);
  display: inline-block; margin-right: 10px; vertical-align: 2px;
}
.problem-col:first-child .problem-bubble { border-radius: 18px 18px 4px 18px; }
.problem-col:last-child .problem-bubble { border-radius: 18px 18px 18px 4px; }

/* ===== OUTCOMES ===== */
.outcome-grid { gap: var(--grid-gap); display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 28px; }
.outcome-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg);
  box-shadow: var(--shadow-xs); padding: var(--card-pad);
  display: flex; flex-direction: column;
  transition: border-color .2s ease, box-shadow .2s ease, transform .2s var(--ease);
}
.outcome-card:hover { border-color: var(--line-strong); box-shadow: var(--shadow-md); transform: translateY(-2px); }
.outcome-num {
  color: var(--faint); font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: .72rem; font-weight: 500; letter-spacing: .08em; margin-bottom: 14px;
}
.outcome-card h3 { margin-bottom: 12px; font-size: var(--h2-card); font-weight: var(--font-subhead); }
.outcome-card p { margin-bottom: 22px; font-size: .96rem; }
.outcome-card strong {
  background: var(--blue-wash); border-radius: var(--r-sm); color: var(--blue-ink);
  margin-top: auto; padding: 13px 14px; font-weight: 560; display: block; font-size: .9rem;
}
.outcome-actions { margin-top: 28px; display: flex; justify-content: center; }

/* ===== MEET MIA ===== */
/* Tinted with Mia's own palette via agentVars(), so the callout matches her
   portrait and her page rather than introducing a new accent colour. */
.mia-callout {
  margin-top: 28px; display: grid; grid-template-columns: 1fr auto; gap: 40px;
  align-items: center; background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--r-lg); box-shadow: var(--shadow-xs);
  padding: var(--card-pad);
}
.mia-callout-main { display: flex; gap: 28px; align-items: flex-start; }
.mia-callout-portrait {
  width: 132px; height: 132px; border-radius: 999px; object-fit: cover; flex: none;
  background: var(--agent-bg); border: 3px solid var(--agent-edge);
}
.mia-callout-copy { min-width: 0; }
.mia-callout-lead {
  font-size: var(--h2-card); font-weight: var(--font-subhead);
  color: var(--ink); margin-bottom: 16px; line-height: 1.35;
}
.mia-channels {
  display: flex; flex-wrap: wrap; gap: 8px; list-style: none;
  padding: 0; margin: 0 0 18px;
}
.mia-channels li {
  background: var(--agent-bg); color: var(--agent-role); border-radius: var(--r-sm);
  padding: 7px 13px; font-size: .87rem; font-weight: 560;
}
.mia-callout-close { font-size: .96rem; margin: 0; }
.mia-callout-cta {
  display: flex; flex-direction: column; align-items: stretch;
  gap: 12px; text-align: center; flex: none;
}
.mia-callout-cta span { color: var(--faint); font-size: .82rem; max-width: 210px; }

@media (max-width: 900px) {
  .mia-callout { grid-template-columns: 1fr; gap: 28px; }
  .mia-callout-cta { text-align: left; align-items: flex-start; }
  .mia-callout-cta span { max-width: none; }
}
@media (max-width: 620px) {
  .mia-callout-main { flex-direction: column; gap: 20px; }
  .mia-callout-portrait { width: 104px; height: 104px; }
  .mia-callout-cta .button { width: 100%; text-align: center; }
}

/* ===== PATIENT JOURNEY ===== */
.journey-section { text-align: center; }
.journey-section .section-copy { margin: 0 auto; }
.journey {
  max-width: 860px; margin: 44px auto 0; position: relative;
  display: grid; gap: 26px; text-align: left;
  --journey-progress: 0;
}
/* Dashed track, then a solid line that draws in over it as you scroll. */
.journey::before {
  content: ""; position: absolute; top: 28px; bottom: 28px; left: 50%;
  border-left: 2px dashed #b9c6e6; transform: translateX(-1px);
}
.journey::after {
  content: ""; position: absolute; top: 28px; bottom: 28px; left: 50%;
  width: 2px; margin-left: -1px; border-radius: 2px;
  background: linear-gradient(180deg, var(--blue), #7c3aed);
  transform: scaleY(var(--journey-progress)); transform-origin: top;
  box-shadow: 0 0 10px #355cff59;
}

/* Each agent and their action fade in as the step scrolls into view. */
.journey-node img { transition: opacity .5s var(--ease), transform .5s var(--ease); }
.journey-card { transition: opacity .55s var(--ease), transform .55s var(--ease); }
.journey-step .journey-node img { opacity: 0; transform: scale(.55); }
.journey-step .journey-card { opacity: 0; }
.journey-step .journey-card.on-left { transform: translateX(-26px); }
.journey-step .journey-card.on-right { transform: translateX(26px); }
.journey-step.is-revealed .journey-node img { opacity: 1; transform: scale(1); }
.journey-step.is-revealed .journey-card { opacity: 1; transform: translateX(0); transition-delay: .12s; }
.journey-step.is-revealed .journey-card.on-right { transition-delay: .22s; }
@media (prefers-reduced-motion: reduce) {
  .journey::after { display: none; }
  .journey-step .journey-node img,
  .journey-step .journey-card { opacity: 1; transform: none; transition: none; }
}
.journey-step {
  display: grid; grid-template-columns: 1fr 64px 1fr;
  align-items: center; gap: 18px; position: relative;
}
.journey-node {
  grid-column: 2; justify-self: center; position: relative; z-index: 1;
}
.journey-node img {
  width: 60px; height: 60px; border-radius: 999px; object-fit: cover; display: block;
  border: 2.5px solid var(--agent-edge, var(--line-strong));
  background: var(--agent-bg, var(--wash));
  box-shadow: 0 0 0 5px var(--paper), var(--shadow-sm);
}
.journey-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm); padding: 16px 20px;
}
.journey-card.on-left { grid-column: 1; grid-row: 1; }
.journey-card.on-right { grid-column: 3; grid-row: 1; }
.journey-tag {
  color: var(--agent-role, var(--faint)); letter-spacing: .06em; text-transform: uppercase;
  font-size: .68rem; font-weight: 700; display: block; margin-bottom: 5px;
  font-family: var(--font-geist-mono), ui-monospace, monospace;
}
.journey-card p { margin: 0; color: var(--ink); font-size: .94rem; font-weight: 510; line-height: 1.55; }
.journey-actions { margin-top: 36px; display: flex; justify-content: center; }

/* ===== WHY CADDIE VS A TRADITIONAL CRM ===== */
.crm-section { text-align: center; }
.crm-section .section-copy { margin: 0 auto; }
.crm-shot {
  margin: 40px auto 0; max-width: 980px;
  border: 1px solid var(--line); border-radius: var(--r-lg);
  box-shadow: var(--shadow-lg); overflow: hidden; background: var(--surface);
}
.crm-shot img { display: block; width: 100%; height: auto; }

/* ===== HIPAA / TRUST ===== */
.hipaa-strip {
  display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(300px, .85fr);
  gap: 48px; align-items: center;
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--r-lg); box-shadow: var(--shadow-xs);
  padding: var(--card-pad);
}
.hipaa-copy h2 { margin-bottom: 14px; }
.hipaa-copy p { font-size: .96rem; margin-bottom: 18px; }
.hipaa-link { color: var(--blue-ink); font-size: .92rem; font-weight: 620; text-decoration: none; }
.hipaa-link:hover { text-decoration: underline; }
.hipaa-points { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
.hipaa-points li {
  background: var(--blue-wash); border-radius: var(--r-sm); color: var(--blue-ink);
  padding: 13px 16px; font-size: .9rem; font-weight: 560;
  display: flex; align-items: center; gap: 10px;
}
.hipaa-points li::before {
  content: ""; width: 8px; height: 8px; border-radius: 999px;
  background: var(--blue-ink); flex: none; opacity: .55;
}

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

/* ===== RESPONSIVE ===== */
@media (max-width: 1020px) {
  .hero-lineup { grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .problem-layout { grid-template-columns: 1fr; max-width: 480px; }
  .problem-img { order: -1; }
  .outcome-grid { grid-template-columns: 1fr; }
  .calculator-grid { grid-template-columns: 1fr; }
  .hipaa-strip { grid-template-columns: 1fr; gap: 26px; }
  .journey::before, .journey::after { left: 30px; }
  .journey-step { grid-template-columns: 64px 1fr; align-items: start; row-gap: 12px; }
  .journey-node { grid-column: 1; grid-row: 1; }
  /* Stack both cards to the right of a single portrait on narrow screens. */
  .journey-card.on-left, .journey-card.on-right { grid-column: 2; grid-row: auto; }
  .cta-section { flex-direction: column; align-items: stretch; }
}
@media (max-width: 720px) {
  .hero { padding-top: 10px; padding-left: 10px; padding-right: 10px; }
  .hero-panel { padding: 32px 18px 26px; }
  .hero h1 { font-size: 2.3rem; line-height: 1.06; }
  .hero-sub { font-size: 1rem; }
  .hero-actions { margin: 22px 0 0; }
  .hero-lineup { grid-template-columns: repeat(2, 1fr); }
  .lineup-card img { max-width: 120px; }
  .cta-section { padding: 30px; }
  .calculator-result strong { font-size: 2.2rem; }
}
      `}</style>

      <SiteNav />

      <main>
        {/* ===== HERO ===== */}
        <section className="hero">
          <div className="hero-panel">
            <div className="hero-badge">Your front office, running while you sleep</div>
            <h1>Increase patient bookings without adding headcount</h1>
            <p className="hero-sub">
              Get an AI team who handles patient inquiries, your inbox, socials, SEO,
              lead gen, protocols and marketing around the clock.
            </p>
            <div className="hero-actions">
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
                Book a demo
              </a>
            </div>
            <div className="hero-lineup">
              {agents.map((a) => (
                <Link
                  key={a.slug}
                  href={`/ai-employees/${a.slug}`}
                  className="lineup-card"
                  style={agentVars(a.slug)}
                >
                  <img src={a.portrait} alt={`${a.name}, ${a.role}`} />
                  <strong>{a.name}</strong>
                  <span>{a.role}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PROOF BAR ===== */}
        <InvestorStrip />

        {/* ===== PROBLEM ===== */}
        <section className="section problem-section">
          <div className="section-copy wide reveal-item">
            <span className="eyebrow">Sound familiar?</span>
            <h2>You want to scale your practice, but&hellip;</h2>
          </div>
          <div className="problem-layout reveal-item">
            <div className="problem-col">
              {problemsLeft.map((p) => (
                <div key={p} className="problem-bubble">{p}</div>
              ))}
            </div>
            <div className="problem-img">
              <img
                src="/clinic-owner-stressed.jpg"
                alt="A stressed clinic owner on the phone at their desk"
                loading="lazy"
              />
            </div>
            <div className="problem-col">
              {problemsRight.map((p) => (
                <div key={p} className="problem-bubble">{p}</div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== OUTCOMES ===== */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide reveal-item">
            <span className="eyebrow">What changes with Caddie</span>
            <h2>Caddie employees handle the busywork so you can focus on patient care.</h2>
          </div>
          <div className="outcome-grid reveal-item">
            {outcomes.map((o, i) => (
              <article key={o.title} className="outcome-card">
                <span className="outcome-num">0{i + 1}</span>
                <h3>{o.title}</h3>
                <p>{o.body}</p>
                <strong>{o.proof}</strong>
              </article>
            ))}
          </div>
          <div className="outcome-actions reveal-item">
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
              Book a demo
            </a>
          </div>
        </section>

        {/* ===== MEET MIA ===== */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide reveal-item">
            <span className="eyebrow">Your AI team</span>
            <h2>Meet Mia, your AI Patient Coordinator.</h2>
          </div>
          <div className="mia-callout reveal-item" style={agentVars("mia")}>
            <div className="mia-callout-main">
              <img
                className="mia-callout-portrait"
                src="/agents/mia.jpg"
                alt="Mia, the AI patient coordinator"
                loading="lazy"
              />
              <div className="mia-callout-copy">
                <p className="mia-callout-lead">
                  Mia responds to every patient inquiry in seconds, so you never
                  miss a potential patient.
                </p>
                <ul className="mia-channels">
                  {miaChannels.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <p className="mia-callout-close">
                  She works around the clock, so if someone calls at 8pm on a
                  Saturday, they get booked in immediately.
                </p>
              </div>
            </div>
            <div className="mia-callout-cta">
              <Link href="/ai-employees/mia?call=1" className="button">
                Start a call with Mia
              </Link>
              <span>Talk to her live, right now. No booking required.</span>
              <Link href="/ai-employees" className="button secondary">
                Meet the rest of the team
              </Link>
            </div>
          </div>
        </section>

        {/* ===== WHY CADDIE VS A TRADITIONAL CRM ===== */}
        <section className="section crm-section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide reveal-item">
            <span className="eyebrow">The platform</span>
            <h2>Why modern clinics use Caddie instead of a traditional CRM.</h2>
            <p>
              Caddie&apos;s AI employees run on our agentic CRM platform. Unlike
              traditional CRMs that store leads and wait for your staff to work
              them, Caddie&apos;s platform is fully agentic: it actions leads in
              real time with context, so every response a patient gets is custom
              to your clinic and their needs. And every part of it is built for
              healthcare, from the protocol builder to post-procedure follow-up
              questionnaires, not adapted from a one-size-fits-all CRM.
            </p>
          </div>
          <figure className="crm-shot reveal-item">
            <img
              src="/product-analytics.jpg"
              alt="The Caddie workspace showing live pipeline results, new leads per week, lead sources, and per-agent performance"
              loading="lazy"
            />
          </figure>
        </section>

        {/* ===== PATIENT JOURNEY (the platform, 24/7) ===== */}
        <section className="section journey-section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide reveal-item">
            <span className="eyebrow">Around the clock</span>
            <h2>One platform running your entire front office 24/7.</h2>
            <p>
              AI employees work while you sleep, so you never miss a potential
              patient booking. Here is one patient&apos;s journey through your
              AI team.
            </p>
          </div>
          <div className="journey">
            {journeySteps.map((step, i) => {
              const a = getAgent(step.agent);
              return (
                <div
                  key={i}
                  className={`journey-step is-${step.side}`}
                  style={
                    a
                      ? agentVars(step.agent)
                      : ({
                          ["--agent-bg" as string]: "#C1CFFE",
                          ["--agent-edge" as string]: "#8799D5",
                          ["--agent-role" as string]: "#46538A",
                        } as React.CSSProperties)
                  }
                >
                  <div className="journey-node">
                    {a ? (
                      <img src={a.portrait} alt={`${a.name}, ${a.role}`} title={a.name} />
                    ) : (
                      <img src="/patient.jpg" alt="The patient" title="Patient" />
                    )}
                  </div>
                  {step.cards.map((card, j) => (
                    <div
                      key={card.tag}
                      className={`journey-card ${
                        step.side === "both"
                          ? j === 0
                            ? "on-left"
                            : "on-right"
                          : `on-${step.side}`
                      }`}
                    >
                      <span className="journey-tag">{card.tag}</span>
                      <p>{card.text}</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          <div className="journey-actions reveal-item">
            <Link href="/platform" className="button secondary">See the platform</Link>
          </div>
        </section>

        {/* ===== HIPAA / TRUST ===== */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="hipaa-strip reveal-item">
            <div className="hipaa-copy">
              <span className="eyebrow">Security &amp; compliance</span>
              <h2>Built for healthcare. HIPAA-compliant by design.</h2>
              <p>
                Caddie&apos;s platform and AI employees are built to handle
                protected health information the way HIPAA requires. PHI is
                encrypted in transit and at rest, access is role-based and
                audit-logged, and every AI conversation is recorded so your
                team can review exactly what was said. Patient data is never
                used to train shared models.
              </p>
              <Link href="/ai-vs-humans" className="hipaa-link">
                How we keep AI employees safe and reliable &rarr;
              </Link>
            </div>
            <ul className="hipaa-points">
              <li>PHI encrypted in transit and at rest</li>
              <li>Role-based access with full audit logs</li>
              <li>Every conversation recorded and reviewable</li>
              <li>Never used to train shared models</li>
            </ul>
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
                    Estimate based on your inputs. Bring your real numbers to a demo and
                    we will run them properly.
                  </p>
                  <div className="calculator-cta">
                    <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
                      Book a demo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ===== PLAYBOOK LEAD-GEN ===== */}
        <PlaybookPanel />

        {/* ===== FAQ ===== */}
        <FaqSection />

        {/* ===== CTA ===== */}
        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <section className="cta-section reveal-item">
            <div>
              <h2>Patients book with the clinic that answers first.</h2>
              <p>
                Every day of slow replies is consults booked somewhere else. Put a team
                of AI employees on it tonight.
              </p>
            </div>
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
              Book a demo
            </a>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
