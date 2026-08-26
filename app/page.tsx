"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { FaqSection } from "@/components/faq-section";
import { PlaybookPanel } from "@/components/playbook-panel";
import { InvestorStrip } from "@/components/investor-strip";
import { getAgent, CALENDAR_URL } from "@/lib/agents";

const problemsLeft = [
  "A patient called after hours. Nobody called back.",
  "Messages on Instagram and Facebook sit unread for days.",
  "No-shows leave gaps in your schedule every week.",
];

const problemsRight = [
  "Your happiest patients leave without being asked for a review.",
  "You can't hire because payroll costs are already too high.",
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

// The five scroll panels in "AI that keeps your calendar full". The sticky
// visual on the right swaps to match whichever panel is centred in view.
const featPanels = [
  {
    eyebrow: "Speed",
    title: "Respond to every lead before your competition does",
    body: "Your AI employee replies like your best coordinator — in seconds, at any hour. No patient waits until Monday morning for a reply.",
  },
  {
    eyebrow: "Conversion",
    title: "Turn interest into booked appointments",
    body: "An inquiry lands at 10pm on a Saturday. Your AI employee answers the treatment questions, qualifies the patient, books the consult and confirms it. No one on your team has to be available.",
  },
  {
    eyebrow: "Context",
    title: "Every patient conversation in one place",
    body: "Phone, text, email, web chat, Instagram, WhatsApp and your EHR, consolidated. One patient, one thread — so every reply includes the patient's full history.",
  },
  {
    eyebrow: "Attendance",
    title: "Cut no-shows in half",
    body: "Personalized reminders and confirmations go out ahead of every appointment, so more patients arrive for the appointments they booked.",
  },
  {
    eyebrow: "Reputation",
    title: "Collect reviews on autopilot",
    body: "Your AI employee follows up with happy patients after every visit and asks for the review and testimonial — while you sleep.",
  },
];

// PLACEHOLDER QUOTES — not real customers. Swap for real quotes (or ship
// fewer, real ones) before this merges to production.
const testimonials = [
  {
    quote:
      "We used to miss weekend inquiries. Someone would message on a Friday night, and by the time we called on Monday they had already booked with another clinic. That does not happen now.",
    who: "Practice Manager, aesthetics clinic",
  },
  {
    quote:
      "I was worried it would sound like a robot to our patients. It sounds like our front desk staff, and it answers the same way every time.",
    who: "Founder, regenerative medicine clinic",
  },
  {
    quote:
      "No-shows were costing us more than our advertising. The reminders alone covered the cost of Caddie.",
    who: "Owner, multi-location practice",
  },
  {
    quote:
      "We had years of happy patients and eleven reviews, because no one had time to ask. We have more than tripled that, and it takes none of our staff's time.",
    who: "Clinic Director, hormone therapy",
  },
];

const diffRows = [
  ["After-hours inquiries go to voicemail", "Every inquiry answered in seconds, day or night"],
  ["Follow-up depends on who remembers", "Every lead worked until it books or closes"],
  ["Conversations scattered across phone, inbox, DMs and your EHR", "One thread per patient, every channel, full context"],
  ["No-shows reduce the appointments you booked", "Reminders and confirmations cut no-shows in half"],
  ["Reviews are collected only when someone has time", "Review requests go out automatically after every visit"],
  ["Past patients are never contacted again", "Reactivation runs continuously in the background"],
  ["Growing means hiring more staff", "Growing means adding another AI employee"],
  ["A generic CRM built for every industry", "An operating system built only for clinics"],
];

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


// The five staged product moments behind the scroll panels. Each is plain
// markup, so swapping any of them for a real screenshot or loop later is a
// one-block change that doesn't touch the scroll wiring.
function FeatVisual({ index }: { index: number }) {
  const mia = getAgent("mia")!;
  const head = (title: string, time?: string) => (
    <div className="fv-head" style={agentVars("mia")}>
      <img src={mia.portrait} alt="" aria-hidden="true" />
      <strong>{title}</strong>
      {time && <span>{time}</span>}
    </div>
  );
  if (index === 0)
    return (
      <div className="fv">
        {head("New inquiry", "9:47 PM")}
        <div className="fv-msg">Hi — do you treat knee pain without surgery? What would it cost?</div>
        <div className="fv-msg out">
          We do. Our regenerative program starts with a consult — happy to walk you
          through the options and pricing. Want me to find you a time?
        </div>
        <div className="fv-chip">Replied in 4 seconds</div>
      </div>
    );
  if (index === 1)
    return (
      <div className="fv">
        {head("Saturday", "10:04 PM")}
        <div className="fv-msg">Could I book a consult? I have been reading about hormone therapy.</div>
        <div className="fv-msg out">
          Absolutely. A couple of quick questions so the doctor has context, then
          I will get you booked.
        </div>
        <div className="fv-cal">
          <div>
            <strong>Consult booked</strong>
            <span>Tuesday &middot; 10:00 AM</span>
          </div>
        </div>
        <div className="fv-chip">Confirmed by text</div>
      </div>
    );
  if (index === 2)
    return (
      <div className="fv">
        <div className="fv-head">
          <strong>Sarah M.</strong>
          <span>one thread</span>
        </div>
        <div className="fv-tags">
          <span className="fv-tag">Phone</span>
          <span className="fv-tag">Instagram</span>
          <span className="fv-tag">Email</span>
          <span className="fv-tag">Web chat</span>
          <span className="fv-tag">EHR</span>
        </div>
        <div className="fv-row"><span className="fv-tag">Instagram</span><span>Asked about PRP pricing on Tuesday</span></div>
        <div className="fv-row"><span className="fv-tag">Phone</span><span>Called after hours; consult booked</span></div>
        <div className="fv-row"><span className="fv-tag">EHR</span><span>Intake form completed and on file</span></div>
      </div>
    );
  if (index === 3)
    return (
      <div className="fv">
        {head("Before the visit")}
        <div className="fv-msg out">
          Hi Sarah — a reminder that your consult is tomorrow at 10:00 AM. Reply R
          if you need to reschedule.
        </div>
        <div className="fv-msg">Perfect, see you then!</div>
        <div className="fv-chip">No-shows cut in half</div>
      </div>
    );
  return (
    <div className="fv">
      {head("After the visit")}
      <div className="fv-msg out">
        Thanks for coming in today, Sarah! If you had a good experience, would you
        mind leaving us a quick review?
      </div>
      <div className="fv-stars" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <div className="fv-chip">New 5-star review</div>
    </div>
  );
}

export default function LandingPage() {
  // Calculator state
  const [inquiries, setInquiries] = useState(60);
  const [avgValue, setAvgValue] = useState(9000);
  const [closeRate, setCloseRate] = useState(30);
  const [coldShare, setColdShare] = useState(25);

  // Which of the five feature panels is centred in the viewport.
  const [featActive, setFeatActive] = useState(0);

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

  // Scrollytelling: mark the feature panel nearest the viewport centre as
  // active so the sticky visual can swap to match it.
  useEffect(() => {
    const steps = Array.from(document.querySelectorAll<HTMLElement>(".feat-step"));
    if (!steps.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = steps.indexOf(e.target as HTMLElement);
            if (i >= 0) setFeatActive(i);
          }
        });
      },
      // A narrow band around the viewport centre: exactly one panel is inside
      // it at a time, so the active step never flickers between two panels.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    steps.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
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

/* Video b-roll slot (unused until the clip ships). The video paints under
   a scrim so the headline keeps contrast; every element in the panel already
   sits at z-index 1. */
.hero-video {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; z-index: 0;
}
.hero-video + * { position: relative; }
.hero-panel:has(.hero-video)::after {
  content: ""; position: absolute; inset: 0; z-index: 0;
  background: linear-gradient(180deg, #f4f7ffd9 0%, #e7eeffb3 55%, #d8e4ffd9 100%);
}

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

/* ===== MEET MIA ===== *//* ===== MEET MIA ===== */
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

/* ===== AI THAT KEEPS YOUR CALENDAR FULL ===== */
.feat-section .section-copy { margin: 0 auto; text-align: center; }
.feat-layout {
  display: grid; grid-template-columns: minmax(0, 1fr) minmax(360px, 440px);
  gap: clamp(32px, 5vw, 80px); align-items: start;
  max-width: 1080px; margin: 24px auto 0;
}
.feat-step {
  min-height: 58vh; padding: 32px 0;
  display: flex; flex-direction: column; justify-content: center; gap: 12px;
  opacity: .32; transition: opacity .35s ease;
}
.feat-step.is-active { opacity: 1; }
.feat-step h3 {
  font-size: clamp(1.45rem, 2.4vw, 1.9rem); font-weight: var(--font-subhead);
  letter-spacing: -.022em; line-height: 1.15; margin: 0; max-width: 20ch;
}
.feat-step p { font-size: 1rem; line-height: 1.62; margin: 0; max-width: 46ch; }
.feat-inline { display: none; }
.feat-sticky {
  position: sticky; top: 92px; display: grid;
  min-height: min(560px, calc(100vh - 120px));
}
.feat-visual {
  grid-area: 1 / 1; display: flex; align-items: center; justify-content: center;
  opacity: 0; transform: translateY(14px); pointer-events: none;
  transition: opacity .4s ease, transform .45s var(--ease);
}
.feat-visual.is-active { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .feat-step, .feat-visual { transition: none; }
  .feat-visual { transform: none; }
}
.feat-actions { margin-top: 12px; display: flex; justify-content: center; }

/* The staged product moments */
.fv {
  width: 100%; max-width: 430px; background: var(--surface);
  border: 1px solid var(--line-strong); border-radius: var(--r-lg);
  box-shadow: var(--shadow-lg); padding: 22px; display: grid; gap: 12px;
}
.fv-head {
  display: flex; align-items: center; gap: 10px;
  padding-bottom: 12px; border-bottom: 1px solid var(--line);
}
.fv-head img {
  width: 34px; height: 34px; border-radius: 999px; object-fit: cover;
  border: 2px solid var(--agent-edge, var(--line-strong));
  background: var(--agent-bg, var(--wash));
}
.fv-head strong { font-size: .92rem; letter-spacing: -.01em; }
.fv-head span {
  margin-left: auto; color: var(--faint); font-size: .74rem;
  font-variant-numeric: tabular-nums;
}
.fv-msg {
  max-width: 88%; width: fit-content;
  background: var(--wash); border: 1px solid var(--line);
  border-radius: 16px 16px 16px 5px; padding: 10px 14px;
  font-size: .9rem; line-height: 1.5; color: var(--ink);
}
.fv-msg.out {
  margin-left: auto; border-radius: 16px 16px 5px 16px;
  background: var(--blue); border-color: var(--blue); color: #fff;
}
.fv-chip {
  display: inline-flex; align-items: center; gap: 7px; width: fit-content;
  background: #eaf6f0; color: #14684a; border: 1px solid #bfe3d2;
  border-radius: 999px; padding: 6px 12px; font-size: .8rem; font-weight: 600;
}
.fv-chip::before {
  content: ""; width: 7px; height: 7px; border-radius: 999px; background: #1f9d6a;
}
.fv-cal {
  display: flex; align-items: center; gap: 12px;
  background: var(--blue-wash); border: 1px solid #dde6f8;
  border-left: 3px solid var(--blue); border-radius: var(--r-sm);
  padding: 12px 14px;
}
.fv-cal strong { font-size: .92rem; color: var(--ink); }
.fv-cal span { display: block; color: var(--muted-ink); font-size: .78rem; margin-top: 2px; }
.fv-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.fv-tag {
  background: var(--wash); border: 1px solid var(--line); border-radius: 999px;
  color: var(--muted-ink); padding: 3px 10px; font-size: .72rem; font-weight: 600;
  flex: none;
}
.fv-row {
  display: flex; gap: 10px; align-items: baseline;
  padding: 8px 0; border-bottom: 1px dashed var(--line);
  font-size: .86rem; color: var(--ink-soft);
}
.fv-row:last-child { border-bottom: 0; padding-bottom: 0; }
.fv-stars { color: #f4b740; font-size: 1.2rem; letter-spacing: 4px; }

/* ===== BUILT FOR HEALTHCARE ===== */
.hc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--grid-gap); margin-top: 32px; }
.hc-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg);
  box-shadow: var(--shadow-xs); padding: var(--card-pad);
}
.hc-card h3 { margin-bottom: 10px; font-size: 1.18rem; font-weight: var(--font-subhead); }
.hc-card p { margin: 0; font-size: .95rem; }
.hc-link { margin-top: 22px; }
.hc-link a { color: var(--blue-ink); font-size: .94rem; font-weight: 620; text-decoration: none; }
.hc-link a:hover { text-decoration: underline; }

/* ===== TESTIMONIALS ===== */
.testi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--grid-gap); margin-top: 32px; }
.testi-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg);
  box-shadow: var(--shadow-xs); padding: 26px 28px; margin: 0;
  display: flex; flex-direction: column; gap: 13px;
}
.testi-stars { color: #f4b740; font-size: .95rem; letter-spacing: 3px; }
.testi-card blockquote { margin: 0; color: var(--ink); font-size: 1.01rem; line-height: 1.62; }
.testi-card figcaption { margin-top: auto; color: var(--muted-ink); font-size: .84rem; font-weight: 600; }

/* ===== THE CADDIE DIFFERENCE ===== */
.diff-wrap { overflow-x: auto; margin-top: 32px; }
.diff-table {
  min-width: 640px; background: var(--surface);
  border: 1px solid var(--line); border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm); overflow: hidden;
}
.diff-head, .diff-row { display: grid; grid-template-columns: 1fr 1fr; }
.diff-head span { padding: 15px 22px; font-size: .84rem; font-weight: 650; letter-spacing: -.005em; }
.diff-head span:first-child { background: #fdf1f0; color: #a13c33; }
.diff-head span:last-child { background: #128454; color: #fff; }
.diff-row { border-top: 1px solid var(--line); }
.diff-row span { padding: 13px 22px; font-size: .93rem; line-height: 1.5; color: #8a4740; background: #fdf1f066; }
.diff-row span:last-child { background: #e9f8f166; color: #10502f; border-left: 1px solid var(--line); }

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
  .problem-layout { grid-template-columns: 1fr; max-width: 480px; }
  .problem-img { order: -1; }
  .calculator-grid { grid-template-columns: 1fr; }
  /* Scrollytelling collapses: no sticky rail, each panel carries its visual. */
  .feat-layout { grid-template-columns: 1fr; }
  .feat-sticky { display: none; }
  .feat-step { min-height: 0; opacity: 1; padding: 26px 0; }
  .feat-inline { display: block; margin-top: 16px; }
  .hc-grid, .testi-grid { grid-template-columns: 1fr; }
  .cta-section { flex-direction: column; align-items: stretch; }
}
@media (max-width: 720px) {
  .hero { padding-top: 10px; padding-left: 10px; padding-right: 10px; }
  .hero-panel { padding: 32px 18px 26px; }
  .hero h1 { font-size: 2.3rem; line-height: 1.06; }
  .hero-sub { font-size: 1rem; }
  .hero-actions { margin: 22px 0 0; }
  .diff-head span, .diff-row span { padding: 11px 14px; font-size: .86rem; }
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
            <h1>Increase patient bookings and revenue without adding headcount</h1>
            <p className="hero-sub">
              Turn more conversations into revenue with 24/7 AI employees that run
              the full patient journey &mdash; from a patient&apos;s first message to a
              booked appointment, a confirmation, and follow-up after the visit.
            </p>
            <div className="hero-actions">
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
                Book a demo
              </a>
            </div>
            {/* Video b-roll slot: when the clip is ready, add
                <video className="hero-video" autoPlay muted loop playsInline
                       poster="/hero-poster.jpg" src="/hero-broll.mp4" />
                as the first child of .hero-panel. The .hero-video and
                .hero-scrim styles below already handle sizing and contrast,
                and everything else in the panel sits above them. */}
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

        {/* ===== AI THAT KEEPS YOUR CALENDAR FULL ===== */}
        <section className="section feat-section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide reveal-item">
            <span className="eyebrow">What changes with Caddie</span>
            <h2>AI that keeps your calendar full.</h2>
            <p>Five things your front office should never miss, and won&apos;t.</p>
          </div>
          <div className="feat-layout">
            <div className="feat-steps">
              {featPanels.map((f, i) => (
                <div
                  key={f.title}
                  className={`feat-step${featActive === i ? " is-active" : ""}`}
                >
                  <span className="eyebrow">{f.eyebrow}</span>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                  {/* On narrow screens the sticky rail is hidden and each panel
                      carries its own visual instead. */}
                  <div className="feat-inline">
                    <FeatVisual index={i} />
                  </div>
                </div>
              ))}
            </div>
            <div className="feat-sticky" aria-hidden="true">
              {featPanels.map((f, i) => (
                <div
                  key={f.title}
                  className={`feat-visual${featActive === i ? " is-active" : ""}`}
                >
                  <FeatVisual index={i} />
                </div>
              ))}
            </div>
          </div>
          <div className="feat-actions reveal-item">
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

        {/* ===== BUILT FOR HEALTHCARE ===== */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide reveal-item">
            <span className="eyebrow">Security &amp; compliance</span>
            <h2>AI built for healthcare, designed to convert.</h2>
            <p>
              Generic AI tools are built for every industry at once. Caddie is
              built only for clinics, with clear limits on what it will and
              will not do.
            </p>
          </div>
          <div className="hc-grid reveal-item">
            <article className="hc-card">
              <h3>HIPAA-compliant by design</h3>
              <p>
                PHI encrypted in transit and at rest, role-based access with
                full audit logs, and every AI conversation recorded so your
                team can review exactly what was said. Patient data is never
                used to train shared models.
              </p>
            </article>
            <article className="hc-card">
              <h3>Every AI employee is built around the patient journey</h3>
              <p>
                They are trained for healthcare, not adapted from a
                general-purpose sales tool. They never give medical advice,
                they answer only from the knowledge your clinic has approved,
                and the moment a conversation turns clinical they hand it to
                your staff with the full history attached.
              </p>
            </article>
          </div>
          <div className="hc-link reveal-item">
            <Link href="/ai-vs-humans">
              How we keep AI employees safe and reliable &rarr;
            </Link>
          </div>
        </section>

        {/* ===== TESTIMONIALS (placeholder quotes -- see const testimonials) ===== */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide reveal-item">
            <span className="eyebrow">Clinics on Caddie</span>
            <h2>What clinics are saying about Caddie.</h2>
          </div>
          <div className="testi-grid reveal-item">
            {testimonials.map((t) => (
              <figure key={t.who} className="testi-card">
                <div className="testi-stars" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption>{t.who}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ===== THE CADDIE DIFFERENCE ===== */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide reveal-item">
            <span className="eyebrow">The Caddie difference</span>
            <h2>From missed opportunities to an operating system that scales.</h2>
          </div>
          <div className="diff-wrap reveal-item">
            <div className="diff-table">
              <div className="diff-head">
                <span>Before Caddie</span>
                <span>With your Caddie employees</span>
              </div>
              {diffRows.map(([before, after]) => (
                <div key={before} className="diff-row">
                  <span>{before}</span>
                  <span>{after}</span>
                </div>
              ))}
            </div>
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
