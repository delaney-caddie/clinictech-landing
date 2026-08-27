"use client";

import { useEffect } from "react";
import { getAgent } from "@/lib/agents";

// One patient's path through the whole AI team. Restored from the original
// homepage — it belongs on the AI Employees page, where showing all eight
// working together is the point.
const journey: { agent: string; cards: { tag: string; text: string }[] }[] = [
  {
    agent: "vidi",
    cards: [{ tag: "Instagram", text: "Vidi posts a knee pain video on your clinic's Instagram." }],
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
      { tag: "Calendar", text: "Mia books the consult straight into your doctor's calendar." },
    ],
  },
  {
    agent: "atlas",
    cards: [{ tag: "Protocols", text: "Atlas drafts a knee pain protocol for the patient." }],
  },
  {
    agent: "juno",
    cards: [
      { tag: "Doctor review", text: "Juno flags the protocol to your doctor for review and sign-off." },
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

export function PatientJourney() {
  // Reveal each agent and their action one at a time as the section scrolls
  // past, and draw the connector line in behind them.
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

      // A fast scroll or a jump link can carry a step past the viewport
      // without the observer sampling it, which would strand it hidden.
      steps.forEach((el) => {
        if (el.classList.contains("is-revealed")) return;
        if (el.getBoundingClientRect().bottom < 0) {
          observer.unobserve(el);
          el.classList.add("is-revealed");
        }
      });

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
    <>
      <style>{`
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
.journey-node { grid-column: 2; justify-self: center; position: relative; z-index: 1; }
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
@media (max-width: 1020px) {
  .journey::before, .journey::after { left: 30px; }
  .journey-step { grid-template-columns: 64px 1fr; align-items: start; row-gap: 12px; }
  .journey-node { grid-column: 1; grid-row: 1; }
  /* Stack both cards to the right of a single portrait on narrow screens. */
  .journey-card.on-left, .journey-card.on-right { grid-column: 2; grid-row: auto; }
}
      `}</style>
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
                    step.side === "both" ? (j === 0 ? "on-left" : "on-right") : `on-${step.side}`
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
    </>
  );
}
