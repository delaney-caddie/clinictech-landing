"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { FaqSection } from "@/components/faq-section";
import { PlaybookPanel } from "@/components/playbook-panel";
import { CustomerLogos } from "@/components/customer-logos";
import { Scrolly } from "@/components/scrolly";
import { CALENDAR_URL, AUDIT_CTA } from "@/lib/agents";

// The pains a regenerative clinic owner recognises on sight. Left column
// is the revenue side, right column is the cost side.
const problemsLeft = [
  "Stem cell and PRP inquiries come in all weekend. Nobody answers until Monday.",
  "Patients comparing three clinics book with the one that replied first.",
  "Happy patients leave without a review, a testimonial or a referral.",
];

const problemsRight = [
  "You pay for a CRM, a scheduler, a forms tool and a reviews tool that don't talk to each other.",
  "Every new patient means more admin, so growing means hiring.",
];

// Results pulled from the clinic projects Caddie has already shipped
// (previously on /projects). Outcome-first, product-agnostic by design.
const results = [
  { big: "2.1% → 7.2%", label: "website conversion rate", who: "Single-location stem cell clinic" },
  { big: "+$2.1M", label: "revenue from centralised intake", who: "50+ location clinic network" },
  { big: "22 hrs/wk", label: "of coordination time saved", who: "3-location clinic group" },
  { big: "+28%", label: "returning patients", who: "US clinic treating in Mexico" },
];

// The four outcomes every Caddie engagement is measured against. These are
// the scroll panels; the sticky visual on the right changes with each.
const outcomePanels = [
  {
    eyebrow: "01 · More patients",
    title: "Attract more of the right patients",
    body: "A website built to convert, a bilingual chatbot, online scheduling and a voice assistant that never misses a call. Every channel a prospective patient uses becomes a way in — and every inquiry is captured, not lost.",
  },
  {
    eyebrow: "02 · Higher conversion",
    title: "Turn more inquiries into booked patients",
    body: "The clinic that answers first usually wins the patient. Caddie replies in seconds, answers treatment and pricing questions in your clinic’s voice, follows up until there is an answer, and books straight onto your calendar.",
  },
  {
    eyebrow: "03 · Premium experience",
    title: "Give every patient a five-star experience",
    body: "From first message to post-treatment check-in, patients feel looked after: a branded patient portal, confirmations and reminders, travel and prep guidance, and a follow-up that turns a good outcome into a review and a referral.",
  },
  {
    eyebrow: "04 · Operational efficiency",
    title: "Run a leaner, more profitable clinic",
    body: "One system replaces the patchwork of tools and the manual work between them. Admin hours drop, nothing falls through the cracks, and you grow without adding headcount — which is how Caddie clinics run on about half the operating cost.",
  },
];

// What the partnership covers, grouped the way clinics think about it.
const productGroups = [
  {
    title: "Attract new patients",
    items: ["Website builder", "Bilingual chatbot", "Online scheduling", "Voice AI assistant"],
  },
  {
    title: "Grow your reputation",
    items: ["Reviews & testimonials generator", "AI blog writer", "Social media assistant"],
  },
  {
    title: "Run your practice",
    items: ["CRM", "Brandable patient portal", "Operating system", "Integrations"],
  },
];

// PLACEHOLDER QUOTES — not real customers. Swap for real quotes before
// long; the photos are stock and the attributions are invented.
const testimonials = [
  {
    quote:
      "I run the clinic on my own with one coordinator. Before Caddie, weekend inquiries about PRP just sat there. Now they are answered in seconds and most of them are booked before I see them on Monday.",
    who: "Owner, single-practitioner regenerative clinic",
    person: "/testimonials/owner.jpg",
    clinic: "/testimonials/aesthetics-clinic.jpg",
  },
  {
    quote:
      "Our patients fly in for stem cell treatment. The portal and the follow-up made the whole journey feel premium, and our reviews went from a handful to more than we can keep up with.",
    who: "Clinic Director, 4-location regenerative medicine group",
    person: "/testimonials/clinic-director.jpg",
    clinic: "/testimonials/regen-clinic.jpg",
  },
  {
    quote:
      "We had 80 locations and 80 ways of handling intake. Caddie centralised it, and the same team now handles far more patients with far fewer mistakes. It is the first tech partner that understood regenerative medicine.",
    who: "COO, 80+ location regenerative medicine network",
    person: "/testimonials/founder.jpg",
    clinic: "/testimonials/hormone-clinic.jpg",
  },
];

// The path from this page to a signed proposal. Spelling it out removes
// the fear of a sales call, which is the real objection to booking.
const auditSteps = [
  {
    title: "Book a 30-minute call",
    body: "Pick a time that suits you. We will ask how your clinic runs today: where inquiries come from, how they are handled, and what happens after treatment.",
  },
  {
    title: "Get your free clinic audit",
    body: "We map the gaps in your patient journey and the places where the most revenue is leaking, then show you exactly which changes would have the biggest impact.",
  },
  {
    title: "Receive a proposal built for your clinic",
    body: "Everything is priced à la carte around what you actually need. No bundles you will not use, no per-seat fees, no obligation.",
  },
];

// Sticky visuals for the four outcome panels. Kept deliberately
// product-agnostic: outcomes and activity, not feature screenshots.
function OutcomeVisual({ index }: { index: number }) {
  if (index === 0)
    return (
      <div className="ov">
        <div className="ov-head"><strong>New patient inquiries</strong><span>this week</span></div>
        <div className="ov-big">31 <small>new inquiries</small></div>
        <div className="ov-bars">
          <div className="ov-bar"><span>Website</span><i style={{ width: "100%" }} /><b>12</b></div>
          <div className="ov-bar"><span>Chatbot</span><i style={{ width: "75%" }} /><b>9</b></div>
          <div className="ov-bar"><span>Phone</span><i style={{ width: "50%" }} /><b>6</b></div>
          <div className="ov-bar"><span>Instagram</span><i style={{ width: "33%" }} /><b>4</b></div>
        </div>
        <div className="ov-chip">Every channel captured</div>
      </div>
    );
  if (index === 1)
    return (
      <div className="ov">
        <div className="ov-head"><strong>Inquiry</strong><span>Sat 9:47 PM</span></div>
        <div className="ov-row done"><span className="ov-dot" /><div><b>New inquiry</b><i>Knee pain · asked about PRP pricing</i></div></div>
        <div className="ov-row done"><span className="ov-dot" /><div><b>Answered in 4 seconds</b><i>Treatment options and pricing shared</i></div></div>
        <div className="ov-row done"><span className="ov-dot" /><div><b>Consult booked</b><i>Tuesday 10:00 AM · confirmed by text</i></div></div>
        <div className="ov-chip">Booked before Monday</div>
      </div>
    );
  if (index === 2)
    return (
      <div className="ov">
        <div className="ov-head"><strong>Patient journey</strong><span>Sara M.</span></div>
        <div className="ov-row done"><span className="ov-dot" /><div><b>Welcome &amp; prep guide sent</b><i>Travel, parking and what to expect</i></div></div>
        <div className="ov-row done"><span className="ov-dot" /><div><b>Treatment day</b><i>Reminder the evening before</i></div></div>
        <div className="ov-row done"><span className="ov-dot" /><div><b>Day 7 check-in</b><i>&ldquo;Feeling great, thank you!&rdquo;</i></div></div>
        <div className="ov-stars" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <div className="ov-chip">New review + a referral</div>
      </div>
    );
  return (
    <div className="ov">
      <div className="ov-head"><strong>Operations</strong><span>before → after</span></div>
      <div className="ov-compare">
        <div><span>Tools to manage</span><b>6 → 1</b></div>
        <div><span>Admin hours per week</span><b>40 → 12</b></div>
        <div><span>Inquiries that slip through</span><b>Some → None</b></div>
        <div><span>Headcount needed to grow</span><b>+2 → +0</b></div>
      </div>
      <div className="ov-chip">About half the operating cost</div>
    </div>
  );
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
.hero h1 { font-size: clamp(2.6rem, 4.8vw, 4rem); max-width: 860px; margin: 0 auto 20px; line-height: 1.04; position: relative; z-index: 1; text-shadow: 0 1px 22px #ffffffe6, 0 1px 3px #ffffffb3; }
.hero-sub { color: var(--ink); font-size: var(--text-lg); max-width: 660px; margin: 0 auto; line-height: 1.62; position: relative; z-index: 1; text-shadow: 0 1px 16px #ffffffe6; }
.hero-actions { justify-content: center; flex-wrap: wrap; gap: 12px; margin: 28px 0 0; display: flex; position: relative; z-index: 1; }
.hero-micro {
  position: relative; z-index: 1; margin: 14px 0 0; display: flex; flex-wrap: wrap;
  justify-content: center; gap: 6px 18px; color: var(--ink-soft); font-size: .84rem; font-weight: 520;
  text-shadow: 0 1px 12px #ffffffe6;
}
.hero-micro span::before { content: "\\2713"; color: var(--green); font-weight: 700; margin-right: 6px; }

/* Hero b-roll. The clip paints under a scrim so the headline keeps its
   contrast; every element in the panel already sits at z-index 1. */
.hero-video {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; z-index: 0; pointer-events: none;
}
.hero-panel:has(.hero-video)::after {
  content: ""; position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background:
    linear-gradient(180deg, #f4f7ffbf 0%, #eaf0ffa6 46%, #dfe8ffbf 100%),
    radial-gradient(760px 430px at 50% 44%, #ffffff8c, #0000 76%);
}
@media (max-width: 720px) {
  .hero-video { display: none; }
  .hero-panel {
    background-image:
      linear-gradient(180deg, #f4f7ffbf 0%, #eaf0ffa6 46%, #dfe8ffbf 100%),
      url("/hero-poster.jpg");
    background-size: cover; background-position: center;
  }
}
@media (prefers-reduced-motion: reduce) { .hero-video { display: none; } }

/* ===== PROBLEM ===== */
.problem-section { text-align: center; }
.problem-section .section-copy { margin: 0 auto; }
.problem-layout {
  max-width: 1020px; margin: 40px auto 0;
  display: grid; grid-template-columns: 1fr minmax(280px, 400px) 1fr;
  gap: 24px; align-items: center;
}
.problem-col { display: grid; gap: 18px; }
.problem-img { border-radius: var(--r-xl); overflow: hidden; border: 1px solid var(--line); box-shadow: var(--shadow-lg); }
.problem-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.problem-bubble {
  background: var(--surface); border: 1px solid var(--line);
  box-shadow: var(--shadow-sm); color: var(--ink); text-align: left;
  padding: 14px 20px; font-size: .96rem; font-weight: 530; line-height: 1.45;
  animation: bubble-float 7s ease-in-out infinite; will-change: transform;
}
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
@media (prefers-reduced-motion: reduce) { .problem-bubble { animation: none; } }
.problem-bubble::before {
  content: ""; width: 8px; height: 8px; border-radius: 999px; background: var(--coral);
  display: inline-block; margin-right: 10px; vertical-align: 2px;
}
.problem-col:first-child .problem-bubble { border-radius: 18px 18px 4px 18px; }
.problem-col:last-child .problem-bubble { border-radius: 18px 18px 18px 4px; }

/* ===== RESULTS ===== */
.results-band {
  border-radius: var(--r-xl); color: #eef2fb; overflow: hidden;
  background:
    radial-gradient(760px 420px at 82% -12%, #6e8fff5c, #0000 62%),
    linear-gradient(150deg, #101a33 0%, #16234a 55%, #1b2c5e 100%);
  border: 1px solid #27355e; box-shadow: var(--shadow-lg);
  padding: clamp(36px, 5vw, 56px); margin-bottom: var(--section-y);
}
.results-band .eyebrow { color: #9db4ff; }
.results-band h2 { color: #fff; max-width: 720px; }
.ct-page .results-band .section-copy > p { color: #c9d4ee; }
.results-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--grid-gap); margin-top: 30px; }
.result { background: #ffffff0f; border: 1px solid #ffffff1c; border-radius: var(--r-lg); padding: 22px 24px; }
.result strong { display: block; color: #fff; font-size: clamp(1.7rem, 2.4vw, 2.1rem); font-weight: 700; letter-spacing: -.03em; line-height: 1.05; }
.result span { display: block; color: #dbe4f7; font-size: .92rem; margin-top: 8px; }
.result em { display: block; color: #93a4cc; font-size: .78rem; font-style: normal; margin-top: 10px; }
.ct-page .results-foot { margin: 22px 0 0; color: #93a4cc; font-size: .82rem; }

/* ===== OUTCOMES (scrolly visuals) ===== */
.outcomes-section .section-copy { margin: 0 auto; text-align: center; }
.outcomes-actions { margin-top: 12px; display: flex; justify-content: center; }
.ov {
  width: 100%; max-width: 420px; background: var(--surface);
  border: 1px solid var(--line-strong); border-radius: var(--r-lg);
  box-shadow: var(--shadow-lg); padding: 22px; display: grid; gap: 12px;
}
.ov-head { display: flex; align-items: baseline; gap: 10px; padding-bottom: 12px; border-bottom: 1px solid var(--line); }
.ov-head strong { font-size: .95rem; letter-spacing: -.01em; }
.ov-head span { margin-left: auto; color: var(--faint); font-size: .74rem; font-variant-numeric: tabular-nums; }
.ov-big { font-size: 2.3rem; font-weight: 700; letter-spacing: -.03em; line-height: 1; color: var(--ink); }
.ov-big small { font-size: .9rem; font-weight: 500; color: var(--muted-ink); letter-spacing: 0; margin-left: 6px; }
.ov-bars { display: grid; gap: 9px; }
.ov-bar { display: grid; grid-template-columns: 74px 1fr 26px; align-items: center; gap: 10px; font-size: .84rem; color: var(--ink-soft); }
.ov-bar i { display: block; height: 9px; border-radius: 999px; background: linear-gradient(90deg, var(--blue), #7c3aed); }
.ov-bar b { text-align: right; font-variant-numeric: tabular-nums; color: var(--ink); }
.ov-row { display: flex; gap: 11px; align-items: flex-start; }
.ov-row b { display: block; font-size: .9rem; font-weight: 620; color: var(--ink); }
.ov-row i { display: block; font-style: normal; font-size: .78rem; color: var(--muted-ink); margin-top: 2px; }
.ov-dot { width: 9px; height: 9px; border-radius: 999px; flex: none; margin-top: 5px; background: var(--line-strong); }
.ov-row.done .ov-dot { background: #1f9d6a; box-shadow: 0 0 0 3px #1f9d6a1f; }
.ov-stars { color: #f4b740; font-size: 1.2rem; letter-spacing: 4px; }
.ov-compare { display: grid; gap: 8px; }
.ov-compare > div {
  display: flex; justify-content: space-between; align-items: baseline; gap: 12px;
  background: var(--wash); border-radius: var(--r-sm); padding: 10px 13px; font-size: .86rem; color: var(--muted-ink);
}
.ov-compare b { color: var(--ink); font-variant-numeric: tabular-nums; white-space: nowrap; }
.ov-chip {
  display: inline-flex; align-items: center; gap: 7px; width: fit-content;
  background: #eaf6f0; color: #14684a; border: 1px solid #bfe3d2;
  border-radius: 999px; padding: 6px 12px; font-size: .8rem; font-weight: 600;
}
.ov-chip::before { content: ""; width: 7px; height: 7px; border-radius: 999px; background: #1f9d6a; }

/* ===== ONE PARTNER ===== */
.partner-section .section-copy { margin: 0 auto; text-align: center; }
.pg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--grid-gap); margin-top: 32px; }
.pg-card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg); box-shadow: var(--shadow-xs); padding: 26px 28px; text-align: left; }
.pg-card h3 { font-size: 1.12rem; font-weight: var(--font-subhead); margin-bottom: 14px; }
.pg-card ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.pg-card li { font-size: .93rem; color: var(--ink-soft); display: flex; gap: 10px; align-items: baseline; }
.pg-card li::before { content: ""; width: 6px; height: 6px; border-radius: 999px; background: var(--blue); flex: none; transform: translateY(-2px); }
.pg-partner {
  margin-top: var(--grid-gap); display: grid; grid-template-columns: 1fr auto; gap: 28px; align-items: center;
  background: var(--blue-wash); border: 1px solid #dde6f8; border-radius: var(--r-lg); padding: 26px 30px; text-align: left;
}
.pg-partner h3 { font-size: 1.12rem; font-weight: var(--font-subhead); margin-bottom: 6px; color: var(--blue-ink); }
.ct-page .pg-partner p { margin: 0; font-size: .95rem; color: var(--ink-soft); max-width: 60ch; }
.pg-link { margin-top: 26px; text-align: center; }
.pg-link a { color: var(--blue-ink); font-size: .95rem; font-weight: 620; text-decoration: none; }
.pg-link a:hover { text-decoration: underline; }

/* ===== RANGE ===== */
.range-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--grid-gap); margin-top: 30px; }
.range-card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg); box-shadow: var(--shadow-xs); padding: 24px 26px; }
.range-card strong { display: block; font-size: 1.9rem; font-weight: 700; letter-spacing: -.03em; line-height: 1.05; color: var(--ink); }
.range-card span { display: block; color: var(--muted-ink); font-size: .9rem; margin-top: 8px; }

/* ===== TESTIMONIALS ===== */
.testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--grid-gap); margin-top: 32px; }
.testi-card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg); box-shadow: var(--shadow-xs); margin: 0; overflow: hidden; display: flex; flex-direction: column; }
.testi-clinic { width: 100%; aspect-ratio: 16 / 8; object-fit: cover; display: block; }
.testi-body { padding: 22px 24px 24px; display: flex; flex-direction: column; gap: 13px; flex: 1; }
.testi-stars { color: #f4b740; font-size: .95rem; letter-spacing: 3px; }
.testi-card blockquote { margin: 0; color: var(--ink); font-size: .97rem; line-height: 1.6; }
.testi-card figcaption { margin-top: auto; display: flex; align-items: center; gap: 11px; color: var(--muted-ink); font-size: .82rem; font-weight: 600; }
.testi-card figcaption img { width: 38px; height: 38px; border-radius: 999px; object-fit: cover; flex: none; border: 1.5px solid var(--line-strong); }

/* ===== AUDIT STEPS ===== */
.audit-section .section-copy { margin: 0 auto; text-align: center; }
.audit-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--grid-gap); margin-top: 32px; }
.audit-step { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg); box-shadow: var(--shadow-xs); padding: 26px 28px; text-align: left; }
.audit-num {
  width: 44px; height: 44px; border-radius: 999px; background: var(--blue-wash); color: var(--blue-deep);
  border: 1px solid #dde6f8; font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: .95rem; font-weight: 600; display: grid; place-items: center; margin-bottom: 16px;
}
.audit-step h3 { font-size: 1.1rem; font-weight: var(--font-subhead); margin-bottom: 8px; }
.audit-step p { margin: 0; font-size: .93rem; }
.audit-actions { margin-top: 30px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.audit-actions span { color: var(--faint); font-size: .84rem; }

/* ===== CALCULATOR ===== */
.calculator-section {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-xl);
  box-shadow: var(--shadow-md); margin-bottom: var(--section-y);
  padding-top: 52px; padding-bottom: 52px; scroll-margin-top: 128px;
}
.calculator-inner { padding: 0 var(--card-pad); }
.calculator-grid { gap: var(--grid-gap-lg); grid-template-columns: 1fr .76fr; margin-top: 30px; display: grid; }
.calculator-grid > * { min-width: 0; }
.calculator-inputs, .calculator-result { border-radius: var(--r-lg); padding: var(--card-pad); }
.calculator-inputs { background: var(--wash); border: 1px solid var(--line); display: grid; gap: 22px; align-content: start; }
.calc-field label { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-bottom: 10px; }
.calc-field label span { color: var(--ink); font-size: .92rem; font-weight: 560; }
.calc-field label output { color: var(--blue-ink); font-variant-numeric: tabular-nums; font-weight: 620; font-size: .98rem; font-family: var(--font-geist-mono), ui-monospace, monospace; }
.calc-field input[type=range] {
  -webkit-appearance: none; appearance: none; width: 100%; height: 5px; border-radius: 999px;
  background: linear-gradient(to right, var(--blue) 0%, var(--blue) var(--fill, 50%), #d9e2f8 var(--fill, 50%), #d9e2f8 100%);
  outline: none; cursor: pointer;
}
.calc-field input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 19px; height: 19px; border-radius: 999px; background: #fff; border: 1.5px solid var(--blue-deep); box-shadow: 0 1px 4px #2447e052; cursor: grab; }
.calc-field input[type=range]::-moz-range-thumb { width: 19px; height: 19px; border-radius: 999px; background: #fff; border: 1.5px solid var(--blue-deep); box-shadow: 0 1px 4px #2447e052; cursor: grab; }
.calculator-result {
  color: var(--ink);
  background: radial-gradient(420px 300px at 86% 0, #ffffff8c, #0000 70%), linear-gradient(125deg, #dfe2fc 0%, #e9defb 45%, #d7e7fd 100%);
  border: 1px solid #e2e0f2; display: grid; align-content: center; gap: 4px;
}
.calculator-result .ui-label { color: var(--blue-ink); }
.calculator-result strong { font-variant-numeric: tabular-nums; letter-spacing: -.03em; margin-bottom: 18px; font-size: clamp(2.4rem, 4vw, 3.2rem); font-weight: 620; line-height: 1; display: block; }
.calculator-result p { color: var(--ink-soft); }
.calculator-result .fine-print { color: var(--faint); }
.calculator-cta { margin-top: 22px; }

/* ===== CTA ===== */
.cta-section {
  border-radius: var(--r-xl); box-shadow: var(--shadow-md); color: var(--ink);
  margin-bottom: var(--section-y); overflow: hidden;
  background:
    radial-gradient(900px 500px at 88% 0, #355cff29, #0000 62%),
    radial-gradient(760px 520px at 0 112%, #355cff21, #0000 64%),
    linear-gradient(138deg, #f4f7ff 0%, #e7eeff 50%, #d8e4ff 100%);
  border: 1px solid #dde6f8;
  display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(300px, .95fr); align-items: stretch;
}
.cta-copy { padding: 56px; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; }
.cta-section h2 { margin-bottom: 10px; }
.cta-section p { color: var(--ink-soft); max-width: 560px; margin-bottom: 22px; }
.cta-photo { width: 100%; height: 100%; min-height: 320px; object-fit: cover; display: block; }

/* ===== RESPONSIVE ===== */
@media (max-width: 1020px) {
  .problem-layout { grid-template-columns: 1fr; max-width: 480px; }
  .problem-img { order: -1; }
  .results-grid, .range-grid { grid-template-columns: 1fr 1fr; }
  .pg-grid, .testi-grid, .audit-steps { grid-template-columns: 1fr; }
  .pg-partner { grid-template-columns: 1fr; }
  .calculator-grid { grid-template-columns: 1fr; }
  .cta-section { grid-template-columns: 1fr; }
  .cta-photo { min-height: 240px; max-height: 320px; }
}
@media (max-width: 720px) {
  .hero { padding-top: 10px; padding-left: 10px; padding-right: 10px; }
  .hero-panel { padding: 32px 18px 26px; }
  .hero h1 { font-size: 2.25rem; line-height: 1.06; }
  .hero-sub { font-size: 1rem; }
  .hero-actions { margin: 22px 0 0; }
  .hero-actions .button { width: 100%; justify-content: center; }
  .results-grid, .range-grid { grid-template-columns: 1fr; }
  .cta-copy { padding: 30px; }
  .calculator-inner { padding: 0 14px; }
  .calculator-inputs, .calculator-result { padding: 20px 18px; }
  .calculator-result strong { font-size: 2.2rem; }
}
      `}</style>

      <SiteNav />

      <main>
        {/* ===== HERO ===== */}
        <section className="hero">
          <div className="hero-panel">
            {/* Decorative b-roll. Muted + playsInline so iOS autoplays it;
                hidden on small screens where the poster stands in. */}
            <video
              className="hero-video"
              autoPlay
              muted
              loop
              playsInline
              poster="/hero-poster.jpg"
              aria-hidden="true"
              tabIndex={-1}
            >
              <source src="/hero-broll.mp4" type="video/mp4" />
            </video>
            <div className="hero-badge">The #1 tech partner for regenerative medicine clinics</div>
            <h1>Give your clinic the same tech as the top healthcare brands. Without the price tag.</h1>
            <p className="hero-sub">
              Caddie clinics get more patients and more revenue, with half the
              operational cost of running the clinic. One partner for your front
              office, CRM, patient portal, AI assistants and more &mdash; built only
              for regenerative medicine.
            </p>
            <div className="hero-actions">
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
                {AUDIT_CTA}
              </a>
            </div>
            <div className="hero-micro">
              <span>30 minutes</span>
              <span>We map your biggest gaps and opportunities</span>
              <span>No obligation</span>
            </div>
          </div>
        </section>

        {/* ===== CUSTOMER LOGOS ===== */}
        <CustomerLogos />

        {/* ===== PROBLEM ===== */}
        <section className="section problem-section">
          <div className="section-copy wide reveal-item">
            <span className="eyebrow">Sound familiar?</span>
            <h2>You want to grow your practice, but&hellip;</h2>
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
                alt="A clinic owner on the phone at their desk"
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

        {/* ===== RESULTS ===== */}
        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <section className="results-band reveal-item">
            <div className="section-copy wide">
              <span className="eyebrow">Results</span>
              <h2>What regenerative clinics get with Caddie.</h2>
              <p>
                More patients, more revenue, and a clinic that runs on about half
                the operating cost. Here is what that has looked like in practice.
              </p>
            </div>
            <div className="results-grid">
              {results.map((r) => (
                <div key={r.label} className="result">
                  <strong>{r.big}</strong>
                  <span>{r.label}</span>
                  <em>{r.who}</em>
                </div>
              ))}
            </div>
            <p className="results-foot">
              Results from individual clinic engagements. Your audit will show you
              what is realistic for your clinic.
            </p>
          </section>
        </div>

        {/* ===== FOUR OUTCOMES ===== */}
        <section className="section outcomes-section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide reveal-item">
            <span className="eyebrow">What we focus on</span>
            <h2>Four outcomes. Everything we build points at one of them.</h2>
            <p>
              We are not here to sell you software. We are here to get you more
              patients, convert more of them, give them a premium experience, and
              run your clinic more efficiently.
            </p>
          </div>
          <Scrolly
            id="home-outcomes"
            panels={outcomePanels}
            visuals={outcomePanels.map((_, i) => <OutcomeVisual key={i} index={i} />)}
          />
          <div className="outcomes-actions reveal-item">
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
              {AUDIT_CTA}
            </a>
          </div>
        </section>

        {/* ===== ONE PARTNER ===== */}
        <section className="section partner-section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide reveal-item">
            <span className="eyebrow">Fully verticalized</span>
            <h2>One partner for everything a regenerative clinic needs.</h2>
            <p>
              Your front office, CRM, patient portal, AI assistants and more, built
              specifically for regenerative medicine and run as one connected system.
            </p>
          </div>
          <div className="pg-grid reveal-item">
            {productGroups.map((g) => (
              <article key={g.title} className="pg-card">
                <h3>{g.title}</h3>
                <ul>
                  {g.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="pg-partner reveal-item">
            <div>
              <h3>Dedicated tech partnership</h3>
              <p>
                Need something that does not exist yet? We work hands-on with your
                clinic to design, build and launch custom software around the way
                you actually operate.
              </p>
            </div>
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button secondary">
              Talk to us about a partnership
            </a>
          </div>
          <div className="pg-link reveal-item">
            <Link href="/products">See everything that is included &rarr;</Link>
          </div>
        </section>

        {/* ===== RANGE ===== */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide reveal-item">
            <span className="eyebrow">Regenerative medicine only</span>
            <h2>From one practitioner to 80+ locations worldwide.</h2>
            <p>
              We only work with regenerative medicine clinics, and every product we
              build is designed with that in mind. That focus is why it works.
            </p>
          </div>
          <div className="range-grid reveal-item">
            <div className="range-card"><strong>1 &rarr; 80+</strong><span>Locations, from solo practices to the largest regenerative networks</span></div>
            <div className="range-card"><strong>Worldwide</strong><span>Clinics across North America, Latin America and beyond</span></div>
            <div className="range-card"><strong>100%</strong><span>Regenerative medicine. No other specialty, by choice</span></div>
            <div className="range-card"><strong>HIPAA</strong><span>Compliant by design, with every conversation logged</span></div>
          </div>
        </section>

        {/* ===== TESTIMONIALS (placeholder quotes -- see const testimonials) ===== */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide reveal-item">
            <span className="eyebrow">Clinics on Caddie</span>
            <h2>What regenerative clinics are saying.</h2>
          </div>
          <div className="testi-grid reveal-item">
            {testimonials.map((t) => (
              <figure key={t.who} className="testi-card">
                <img className="testi-clinic" src={t.clinic} alt="" loading="lazy" />
                <div className="testi-body">
                  <div className="testi-stars" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                  <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption>
                    <img src={t.person} alt="" loading="lazy" />
                    <span>{t.who}</span>
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </section>

        {/* ===== HOW THE AUDIT WORKS ===== */}
        <section className="section audit-section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide reveal-item">
            <span className="eyebrow">How it starts</span>
            <h2>Your free clinic audit, in three steps.</h2>
            <p>
              Every clinic is different, so we start by understanding yours. No
              pitch deck, no generic demo.
            </p>
          </div>
          <div className="audit-steps reveal-item">
            {auditSteps.map((s, i) => (
              <article key={s.title} className="audit-step">
                <div className="audit-num">0{i + 1}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
          <div className="audit-actions reveal-item">
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
              {AUDIT_CTA}
            </a>
            <span>Free, 30 minutes, no obligation.</span>
          </div>
        </section>

        {/* ===== CALCULATOR ===== */}
        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <section className="calculator-section" id="calculator">
            <div className="calculator-inner">
              <div className="section-copy wide reveal-item">
                <span className="eyebrow">What you are missing</span>
                <h2>How much revenue is sitting in inquiries that never hear back?</h2>
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
                      type="range" min={100} max={30000} step={100} value={avgValue}
                      style={{ ["--fill" as string]: `${((avgValue - 100) / 29900) * 100}%` } as React.CSSProperties}
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
                    {fmt(upside.recovered)} from inquiries that currently go cold, plus{" "}
                    {fmt(upside.lift)} from a faster first reply on the rest.
                  </p>
                  <p className="fine-print">
                    An estimate from your inputs. Your free audit runs the real numbers.
                  </p>
                  <div className="calculator-cta">
                    <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
                      {AUDIT_CTA}
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
            <div className="cta-copy">
              <h2>Patients book with the clinic that answers first.</h2>
              <p>
                Find out where your clinic is losing patients and revenue, and what
                would fix it. The audit is free and takes 30 minutes.
              </p>
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
                {AUDIT_CTA}
              </a>
            </div>
            <img
              className="cta-photo"
              src="/patients/receptionist.jpg"
              alt="A clinic receptionist greeting a patient at the front desk"
              loading="lazy"
            />
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
