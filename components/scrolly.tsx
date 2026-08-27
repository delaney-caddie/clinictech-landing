"use client";

import { useEffect, useState } from "react";

export type ScrollyPanel = {
  eyebrow: string;
  title: string;
  body: string;
};

/**
 * Scroll-linked feature section: the copy panels scroll normally while a
 * sticky visual on the right swaps to match whichever panel is centred in
 * the viewport. Below 1020px the sticky rail is dropped and each panel
 * carries its own visual inline instead.
 *
 * `visuals` is passed as ready-made JSX so a server component can supply it.
 * `id` scopes the observer, so two of these can coexist on one page.
 */
export function Scrolly({
  id,
  panels,
  visuals,
}: {
  id: string;
  panels: ScrollyPanel[];
  visuals: React.ReactNode[];
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const steps = Array.from(
      document.querySelectorAll<HTMLElement>(`[data-scrolly="${id}"] .scrolly-step`)
    );
    if (!steps.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = steps.indexOf(e.target as HTMLElement);
            if (i >= 0) setActive(i);
          }
        });
      },
      // A narrow band around the viewport centre: exactly one panel sits
      // inside it at a time, so the active step never flickers between two.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    steps.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [id]);

  return (
    <div className="scrolly-layout" data-scrolly={id}>
      <style>{`
.scrolly-layout {
  display: grid; grid-template-columns: minmax(0, 1fr) minmax(360px, 440px);
  gap: clamp(32px, 5vw, 80px); align-items: start;
  max-width: 1080px; margin: 24px auto 0;
}
.scrolly-step {
  min-height: 58vh; padding: 32px 0;
  display: flex; flex-direction: column; justify-content: center; gap: 12px;
  opacity: .32; transition: opacity .35s ease;
}
.scrolly-step.is-active { opacity: 1; }
.scrolly-step h3 {
  font-size: clamp(1.45rem, 2.4vw, 1.9rem); font-weight: var(--font-subhead);
  letter-spacing: -.022em; line-height: 1.15; margin: 0; max-width: 20ch;
}
.scrolly-step p { font-size: 1rem; line-height: 1.62; margin: 0; max-width: 46ch; }
.scrolly-inline { display: none; }
.scrolly-sticky {
  position: sticky; top: 92px; display: grid;
  min-height: min(560px, calc(100vh - 120px));
}
.scrolly-visual {
  grid-area: 1 / 1; display: flex; align-items: center; justify-content: center;
  opacity: 0; transform: translateY(14px); pointer-events: none;
  transition: opacity .4s ease, transform .45s var(--ease);
}
.scrolly-visual.is-active { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .scrolly-step, .scrolly-visual { transition: none; }
  .scrolly-visual { transform: none; }
}
@media (max-width: 1020px) {
  .scrolly-layout { grid-template-columns: 1fr; }
  .scrolly-sticky { display: none; }
  .scrolly-step { min-height: 0; opacity: 1; padding: 26px 0; }
  .scrolly-inline { display: block; margin-top: 16px; }
}
      `}</style>

      <div className="scrolly-steps">
        {panels.map((f, i) => (
          <div
            key={f.title}
            className={`scrolly-step${active === i ? " is-active" : ""}`}
          >
            <span className="eyebrow">{f.eyebrow}</span>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
            <div className="scrolly-inline">{visuals[i]}</div>
          </div>
        ))}
      </div>
      <div className="scrolly-sticky" aria-hidden="true">
        {panels.map((f, i) => (
          <div
            key={f.title}
            className={`scrolly-visual${active === i ? " is-active" : ""}`}
          >
            {visuals[i]}
          </div>
        ))}
      </div>
    </div>
  );
}
