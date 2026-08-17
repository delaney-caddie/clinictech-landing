"use client";

import { useEffect } from "react";

const FUNNEL_SCRIPT_SRC = "https://app.caddie.app/embed-funnel.js";

// Playbook lead capture, wired to the Caddie CRM brochure funnel. The embed
// script scans for its container when it executes, so it is re-injected on
// every mount: this panel renders on both the homepage and the pricing page,
// and after a client-side navigation the container is new but an
// already-loaded script would never run again.
export function PlaybookPanel() {
  useEffect(() => {
    // The embed script guards itself with a window flag, so only the first
    // injection ever executes; its MutationObserver then initializes any
    // container that appears later (e.g. after a client-side navigation).
    if (!document.querySelector(`script[src="${FUNNEL_SCRIPT_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = FUNNEL_SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }

    // The embed auto-sizes the iframe from heights the funnel reports, but
    // the funnel only reports changes LARGER than 4px, so late font loads
    // can leave 1-4px of overflow: a scrollbar that scrolls almost nothing.
    // scrolling="no" makes that stray overflow invisible instead. (Do NOT
    // "fix" this by padding the reported height: the funnel's body fills
    // the iframe viewport, so any buffer feeds back into the next
    // measurement and the iframe grows forever.)
    const watcher = window.setInterval(() => {
      const f = document.querySelector("iframe[data-clinictech-funnel]");
      if (f) {
        f.setAttribute("scrolling", "no");
        window.clearInterval(watcher);
      }
    }, 200);

    return () => {
      window.clearInterval(watcher);
    };
  }, []);

  return (
    <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
      <style>{`
.playbook-panel {
  border-radius: var(--r-xl); box-shadow: var(--shadow-md); color: var(--ink);
  margin-bottom: var(--section-y);
  background:
    radial-gradient(560px 360px at 14% 0, #fff9, #0000 70%),
    linear-gradient(125deg, #d8f0e4 0%, #d6e5fb 38%, #ebe3fb 70%, #fbe7dc 100%);
  border: 1px solid #e4e2ee;
  grid-template-columns: 1.05fr .95fr; align-items: center; gap: 40px;
  padding: 56px; display: grid;
}
.playbook-panel .eyebrow { margin-bottom: 10px; }
.playbook-panel h2 { margin-bottom: 10px; }
.playbook-panel p { color: var(--ink-soft); margin-bottom: 0; max-width: 460px; }
.playbook-embed { min-height: 250px; display: flex; justify-content: center; }
/* The embed renders at a fixed 480px; never let it overflow the panel. */
.playbook-embed > div { max-width: 100%; }
.playbook-embed iframe { max-width: 100% !important; }
@media (max-width: 1020px) {
  .playbook-panel { grid-template-columns: 1fr; }
  .playbook-embed { justify-content: flex-start; }
}
@media (max-width: 720px) {
  .playbook-panel { padding: 30px; }
}
      `}</style>
      <section className="playbook-panel" id="playbook">
        <div>
          <span className="eyebrow">The AI clinic playbook</span>
          <h2>Not ready for a demo? Start with the AI playbook for clinics.</h2>
          <p>
            A short, practical guide on how you can use AI to turn more inquiries
            into booked patients.
          </p>
        </div>
        <div className="playbook-embed">
          {/* Caddie brochure funnel */}
          <div
            id="clinictech-brochure"
            data-funnel-id="b1318c2c-3230-4011-addd-ce963dc7f5e9"
            data-host="https://app.caddie.app"
            data-mode="inline"
            data-width="480px"
          ></div>
        </div>
      </section>
    </div>
  );
}
