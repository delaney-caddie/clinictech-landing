import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { VoiceWidgetClient } from "./VoiceWidgetClient";

export const metadata = {
  title: "Voice agent demo — Caddie AI",
  description: "Talk to one of our AI receptionists. Real conversation, in your browser, right now.",
};

export default function VoiceAgentDemoPage() {
  return (
    <>
      <style>{`
        .vad-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #FAFBFD 0%, #fff 60%);
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
        }
        .vad-hero {
          max-width: 880px; margin: 0 auto;
          padding: 140px 24px 48px;
          text-align: center;
        }
        .vad-kicker-row {
          display: inline-flex; align-items: center; gap: 8px;
          margin-bottom: 18px;
        }
        .vad-kicker {
          display: inline-block;
          font-size: 11px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 1.6px;
          color: #3E6AEF;
          background: rgba(62, 106, 239, 0.08);
          padding: 6px 14px; border-radius: 100px;
        }
        .vad-beta {
          display: inline-block;
          font-size: 11px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 1.6px;
          color: #fff;
          background: linear-gradient(135deg, #F59E0B 0%, #EF4444 120%);
          padding: 6px 14px; border-radius: 100px;
          box-shadow: 0 4px 14px rgba(239, 68, 68, 0.25);
        }
        .vad-disclaimer {
          font-size: 14px !important;
          color: #94A3B8 !important;
          margin-top: 20px !important;
          font-style: italic;
        }
        .vad-hero h1 {
          font-size: 52px; font-weight: 800;
          color: #0F172A; line-height: 1.1; letter-spacing: -0.8px;
          margin: 0 auto 18px;
        }
        .vad-hero p {
          font-size: 18px; line-height: 1.65; color: #475569;
          max-width: 640px; margin: 0 auto 32px;
        }

        .vad-card {
          max-width: 720px; margin: 0 auto;
          background: linear-gradient(135deg, #3E6AEF 0%, #5EC4E3 130%);
          color: #fff; border-radius: 24px;
          padding: 56px 48px; text-align: center;
          position: relative; overflow: hidden;
        }
        .vad-card::before {
          content: ""; position: absolute; top: -50%; right: -20%;
          width: 520px; height: 520px;
          background: radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 65%);
          pointer-events: none;
        }
        .vad-orb {
          width: 180px; height: 180px; border-radius: 50%;
          background: rgba(255,255,255,0.12);
          margin: 0 auto 28px;
          display: flex; align-items: center; justify-content: center;
          position: relative; z-index: 1;
          box-shadow: 0 0 0 12px rgba(255,255,255,0.06), 0 0 0 32px rgba(255,255,255,0.03);
        }
        .vad-orb::before,
        .vad-orb::after {
          content: ""; position: absolute; inset: 0; border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.35);
          animation: vadPulse 2.6s ease-out infinite;
        }
        .vad-orb::after { animation-delay: 1.3s; }
        @keyframes vadPulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.55); opacity: 0; }
        }
        .vad-orb-inner {
          width: 72px; height: 72px; border-radius: 50%;
          background: #fff; color: #3E6AEF;
          display: flex; align-items: center; justify-content: center;
          font-size: 30px; font-weight: 800;
          box-shadow: 0 12px 40px rgba(0,0,0,0.18);
        }
        .vad-card h2 {
          font-size: 26px; font-weight: 800; letter-spacing: -0.3px;
          margin-bottom: 14px; line-height: 1.25;
        }
        .vad-card p {
          font-size: 16px; line-height: 1.65;
          color: rgba(255,255,255,0.92);
          max-width: 460px; margin: 0 auto 24px;
        }
        .vad-card .hint {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 18px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 100px;
          font-size: 14px; font-weight: 600;
          backdrop-filter: blur(4px);
        }

        .vad-notes {
          max-width: 640px; margin: 56px auto 0;
          padding: 0 24px 80px;
          text-align: center;
          color: #94A3B8; font-size: 13px; line-height: 1.7;
        }
        .vad-notes a { color: #3E6AEF; text-decoration: none; font-weight: 700; }
        .vad-notes a:hover { text-decoration: underline; }

        /* Animated pointer that draws attention to the FAB in the corner */
        .vad-pointer {
          position: fixed;
          right: 24px;
          bottom: 96px;
          z-index: 9998;
          display: flex; flex-direction: column; align-items: flex-end; gap: 6px;
          pointer-events: none;
          animation: vadPointerFloat 1.6s ease-in-out infinite alternate;
        }
        .vad-pointer-label {
          background: #0F172A; color: #fff;
          font-weight: 700; font-size: 13px;
          padding: 8px 14px; border-radius: 100px;
          box-shadow: 0 8px 24px rgba(15,23,42,0.25);
          white-space: nowrap;
          position: relative;
        }
        .vad-pointer-label::after {
          content: "";
          position: absolute;
          bottom: -5px; right: 22px;
          width: 10px; height: 10px;
          background: #0F172A;
          transform: rotate(45deg);
        }
        .vad-pointer-arrow {
          font-size: 36px;
          line-height: 1;
          color: #3E6AEF;
          font-weight: 800;
          margin-right: 28px;
          text-shadow: 0 4px 12px rgba(62,106,239,0.35);
          animation: vadPointerBob 1s ease-in-out infinite alternate;
        }
        @keyframes vadPointerFloat {
          0% { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }
        @keyframes vadPointerBob {
          0% { transform: translateY(0); }
          100% { transform: translateY(6px); }
        }

        @media (max-width: 720px) {
          .vad-hero { padding: 120px 20px 40px; }
          .vad-hero h1 { font-size: 36px; letter-spacing: -0.4px; }
          .vad-hero p { font-size: 16px; }
          .vad-card { padding: 40px 24px; }
          .vad-card h2 { font-size: 22px; }
          .vad-orb { width: 140px; height: 140px; }
          .vad-orb-inner { width: 60px; height: 60px; font-size: 24px; }
          .vad-pointer { right: 16px; bottom: 80px; }
          .vad-pointer-label { font-size: 12px; padding: 6px 12px; }
        }
      `}</style>

      <div className="vad-page">
        <SiteNav />

        <section className="vad-hero">
          <div className="vad-kicker-row">
            <span className="vad-beta">Beta</span>
            <span className="vad-kicker">Live demo</span>
          </div>
          <h1>Meet Mia, our AI patient coordinator.</h1>
          <p>
            Mia is the agent we have built for clinics that need to be the first to respond. She talks with people who are living with pain, injuries, or chronic conditions, helps them understand at a high level whether your clinic&apos;s treatments might be right for them, answers questions about what a consultation looks like, and books them in with the clinical team.
          </p>
          <p className="vad-disclaimer">
            She does not diagnose, give medical advice, quote exact pricing, or interpret test results. Anything in that territory she gently routes back to the clinical team.
          </p>
        </section>

        <section className="vad-card">
          <h2>Tap the blue pill in the bottom-right corner.</h2>
          <p>
            Look for &quot;Talk to our AI receptionist&quot; floating in the bottom-right of your screen. Tap it, allow microphone access when prompted, and start the conversation.
          </p>
        </section>

        <div className="vad-pointer">
          <div className="vad-pointer-label">Click here to talk!</div>
          <div className="vad-pointer-arrow">&#8595;</div>
        </div>

        <section className="vad-notes">
          <p>
            This page is in early testing. If the call does not start or the widget shows an error, the public key may not yet be authorized for this domain. <Link href="/">Back to homepage</Link>.
          </p>
        </section>
      </div>

      {/* Hide the Caddie AI chat widget on this page so the Retell voice widget is the only floating CTA */}
      <style dangerouslySetInnerHTML={{ __html: `
        #clinictech-widget,
        [id^="clinictech-widget-"],
        [class*="clinictech-widget"],
        iframe[src*="app.clinictech.io"],
        iframe[src*="clinictech.io/embed"] {
          display: none !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
        a[href*="retellai.com"],
        a[href*="retell.ai"],
        [class*="powered-by-retell" i],
        [data-component="branding"],
        [data-testid*="branding" i],
        [data-testid*="powered" i] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      ` }} />

      {/* Loads the Retell widget, removes the chat widget, and hides Retell branding.
          Runs as client effects so it works on client-side navigation too. */}
      <VoiceWidgetClient />
    </>
  );
}
