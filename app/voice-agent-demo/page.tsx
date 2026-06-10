import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export const metadata = {
  title: "Voice agent demo — ClinicTech",
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
        .vad-kicker {
          display: inline-block;
          font-size: 11px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 1.6px;
          color: #3E6AEF;
          background: rgba(62, 106, 239, 0.08);
          padding: 6px 14px; border-radius: 100px;
          margin-bottom: 18px;
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

        @media (max-width: 720px) {
          .vad-hero { padding: 120px 20px 40px; }
          .vad-hero h1 { font-size: 36px; letter-spacing: -0.4px; }
          .vad-hero p { font-size: 16px; }
          .vad-card { padding: 40px 24px; }
          .vad-card h2 { font-size: 22px; }
          .vad-orb { width: 140px; height: 140px; }
          .vad-orb-inner { width: 60px; height: 60px; font-size: 24px; }
        }
      `}</style>

      <div className="vad-page">
        <SiteNav />

        <section className="vad-hero">
          <span className="vad-kicker">Live demo</span>
          <h1>Talk to our AI receptionist.</h1>
          <p>
            A real conversation, in your browser, right now. Ask about ClinicTech, ask about regenerative treatments, ask what it would be like to have her on your team. She is one of the agents we build for clinics.
          </p>
        </section>

        <section className="vad-card">
          <div className="vad-orb">
            <div className="vad-orb-inner">&#127908;</div>
          </div>
          <h2>Tap the button to start the call.</h2>
          <p>
            Look for &quot;Talk to our AI receptionist&quot; in the bottom corner. Make sure your microphone is enabled in the browser when prompted.
          </p>
          <span className="hint">&#8628; Bottom-right of the page</span>
        </section>

        <section className="vad-notes">
          <p>
            This page is in early testing. If the call does not start or the widget shows an error, the public key may not yet be authorized for this domain. <Link href="/">Back to homepage</Link>.
          </p>
        </section>
      </div>

      {/* Hide the ClinicTech chat widget on this page so the Retell voice widget is the only floating CTA */}
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
      ` }} />
      <script dangerouslySetInnerHTML={{ __html: `
        // Belt-and-suspenders: also remove any DOM nodes the chat widget injected.
        (function() {
          function nuke() {
            try {
              document.querySelectorAll(
                '#clinictech-widget, [id^="clinictech-widget-"], [class*="clinictech-widget"], iframe[src*="app.clinictech.io"], iframe[src*="clinictech.io/embed"]'
              ).forEach(function(el) { el.remove(); });
            } catch (e) {}
          }
          nuke();
          [400, 1200, 3000].forEach(function(ms) { setTimeout(nuke, ms); });
          try {
            new MutationObserver(nuke).observe(document.documentElement, { childList: true, subtree: true });
          } catch (e) {}
        })();
      ` }} />

      <script
        id="retell-widget"
        src="https://dashboard.retellai.com/retell-widget-v2.js"
        type="module"
        data-voice-public-key="public_key_1b257bbeaa7704429e87e"
        data-voice-agent-id="agent_9115fb18ba4d5489414ae0c06f"
        data-title="Talk to our AI receptionist"
        data-bot-name="Your AI receptionist"
        data-fab-text="Talk to our AI receptionist"
        data-color="#3E6AEF"
      ></script>
      <style dangerouslySetInnerHTML={{ __html: `
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
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          var phrases = [
            /^\\s*powered by retell/i,
            /^\\s*your retell ?ai( assistant)?\\s*$/i,
            /^\\s*retell ?ai assistant\\s*$/i,
          ];
          var skipTags = { SCRIPT: 1, STYLE: 1, META: 1, LINK: 1, HEAD: 1, HTML: 1, BODY: 1, MAIN: 1, SECTION: 1, HEADER: 1, FOOTER: 1, NAV: 1, ARTICLE: 1 };
          var observed = new WeakSet();
          function hide(el) {
            if (!el || el.nodeType !== 1) return;
            if (skipTags[el.tagName]) return;
            if (el.children && el.children.length > 6) return;
            if (el.dataset && el.dataset.retellHidden) return;
            try { el.dataset && (el.dataset.retellHidden = '1'); } catch (e) {}
            el.style.setProperty('display', 'none', 'important');
            el.style.setProperty('visibility', 'hidden', 'important');
          }
          function scanTextNodesIn(root) {
            if (!root || !root.createTreeWalker) return;
            try {
              var walker = root.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
                acceptNode: function(n) {
                  var p = n.parentElement;
                  if (p && skipTags[p.tagName]) return NodeFilter.FILTER_REJECT;
                  return NodeFilter.FILTER_ACCEPT;
                }
              });
              var node, hits = [];
              while ((node = walker.nextNode())) {
                var t = (node.textContent || '').trim();
                if (!t || t.length > 80) continue;
                for (var i = 0; i < phrases.length; i++) {
                  if (phrases[i].test(t)) { hits.push(node); break; }
                }
              }
              hits.forEach(function(n) {
                var el = n.parentElement;
                var depth = 0;
                while (el && depth < 3 && !skipTags[el.tagName]) {
                  hide(el); el = el.parentElement; depth++;
                }
              });
            } catch (e) {}
          }
          function walkRoots(root) {
            if (!root) return;
            scanTextNodesIn(root);
            try {
              var all = root.querySelectorAll ? root.querySelectorAll('*') : [];
              for (var i = 0; i < all.length; i++) {
                var el = all[i];
                if (el.tagName === 'A' && el.href && /retell\\.(ai|com|io)/i.test(el.href)) hide(el);
                if (el.shadowRoot && !observed.has(el.shadowRoot)) {
                  observed.add(el.shadowRoot);
                  walkRoots(el.shadowRoot);
                  try {
                    new MutationObserver(function() { walkRoots(el.shadowRoot); })
                      .observe(el.shadowRoot, { childList: true, subtree: true, characterData: true });
                  } catch (e) {}
                }
              }
            } catch (e) {}
          }
          function runAll() { walkRoots(document); }
          try {
            runAll();
            new MutationObserver(runAll).observe(document.documentElement, { childList: true, subtree: true });
            [800, 2000, 4000, 8000].forEach(function(ms) { setTimeout(runAll, ms); });
          } catch (e) {}
        })();
      ` }} />
    </>
  );
}
