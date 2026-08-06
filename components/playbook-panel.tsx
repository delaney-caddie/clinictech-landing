"use client";

import { useState } from "react";

export function PlaybookPanel() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, source: "playbook" }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

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
.playbook-form { display: flex; flex-wrap: wrap; gap: 10px; }
.playbook-form input {
  flex: 1 1 160px; min-height: 46px; border-radius: 999px; border: 1px solid var(--line-strong);
  background: #ffffffe6; color: var(--ink); padding: 0 20px; font-size: .94rem; font-family: inherit;
  outline: none; transition: border-color .16s ease, box-shadow .16s ease;
}
.playbook-form input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px #355cff24; }
.playbook-form .button { flex: none; }
.playbook-note { margin-top: 12px; font-size: .88rem; font-weight: 560; color: var(--blue-ink); }
@media (max-width: 1020px) {
  .playbook-panel { grid-template-columns: 1fr; }
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
        <div>
          {state === "done" ? (
            <p className="playbook-note">
              You&apos;re on the list. The playbook is on its way to your inbox.
            </p>
          ) : (
            <form className="playbook-form" onSubmit={submit}>
              <input
                type="text"
                placeholder="First name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-label="First name"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email"
              />
              <button type="submit" className="button" disabled={state === "sending"}>
                {state === "sending" ? "Sending..." : "Send me the playbook"}
              </button>
              {state === "error" && (
                <p className="playbook-note" style={{ color: "var(--coral)" }}>
                  Something went wrong. Try again in a moment.
                </p>
              )}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
