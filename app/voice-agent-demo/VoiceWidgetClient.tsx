"use client";

import { useEffect } from "react";

const RETELL_SCRIPT_URL = "https://dashboard.retellai.com/retell-widget-v2.js";
const RETELL_ATTRS: Record<string, string> = {
  id: "retell-widget",
  "data-voice-public-key": "public_key_1b257bbeaa7704429e87e",
  "data-voice-agent-id": "agent_9115fb18ba4d5489414ae0c06f",
  "data-title": "Talk to our AI receptionist",
  "data-bot-name": "Your AI receptionist",
  "data-fab-text": "Talk to our AI receptionist",
  "data-color": "#3E6AEF",
};

const CHAT_WIDGET_SELECTOR =
  '#clinictech-widget, [id^="clinictech-widget-"], [class*="clinictech-widget"], iframe[src*="app.clinictech.io"], iframe[src*="clinictech.io/embed"]';

const RETELL_BRANDING_PHRASES = [
  /^\s*powered by retell/i,
  /^\s*your retell ?ai( assistant)?\s*$/i,
  /^\s*retell ?ai assistant\s*$/i,
];

const SKIP_TAGS: Record<string, true> = {
  SCRIPT: true,
  STYLE: true,
  META: true,
  LINK: true,
  HEAD: true,
  HTML: true,
  BODY: true,
  MAIN: true,
  SECTION: true,
  HEADER: true,
  FOOTER: true,
  NAV: true,
  ARTICLE: true,
};

export function VoiceWidgetClient() {
  // Mount the Retell widget script on entry, tear it down on navigation away.
  useEffect(() => {
    // Avoid duplicate inject if a previous mount left one behind.
    document.querySelectorAll('script[src*="retell-widget"]').forEach((s) => s.remove());

    const script = document.createElement("script");
    script.src = RETELL_SCRIPT_URL;
    script.type = "module";
    for (const [k, v] of Object.entries(RETELL_ATTRS)) {
      if (k === "id") script.id = v;
      else script.setAttribute(k, v);
    }
    document.body.appendChild(script);

    return () => {
      // Remove the script
      script.remove();
      // Best-effort cleanup of any widget DOM (so other pages don't show stranded Retell UI)
      document
        .querySelectorAll('[id^="retell"], iframe[src*="retellai"], iframe[src*="retell.ai"]')
        .forEach((el) => el.remove());
    };
  }, []);

  // Remove the ClinicTech chat widget DOM while this page is mounted.
  useEffect(() => {
    function nuke() {
      try {
        document.querySelectorAll(CHAT_WIDGET_SELECTOR).forEach((el) => el.remove());
      } catch {}
    }
    nuke();
    const timers = [400, 1200, 3000].map((ms) => window.setTimeout(nuke, ms));
    const obs = new MutationObserver(nuke);
    obs.observe(document.documentElement, { childList: true, subtree: true });
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      obs.disconnect();
    };
  }, []);

  // Hide Retell attribution / "Your RetellAI assistant" subtitle until whitelabel is wired up.
  useEffect(() => {
    const observedShadow = new WeakSet<ShadowRoot>();

    function hide(el: Element | null) {
      if (!el || el.nodeType !== 1) return;
      const tag = el.tagName;
      if (SKIP_TAGS[tag]) return;
      if (el.children && el.children.length > 6) return;
      const dataset = (el as HTMLElement).dataset;
      if (dataset && dataset.retellHidden) return;
      try {
        if (dataset) dataset.retellHidden = "1";
      } catch {}
      (el as HTMLElement).style.setProperty("display", "none", "important");
      (el as HTMLElement).style.setProperty("visibility", "hidden", "important");
    }

    function scanTextNodesIn(root: Document | ShadowRoot) {
      try {
        const walker = (root as Document).createTreeWalker(root as unknown as Node, NodeFilter.SHOW_TEXT, {
          acceptNode(n: Node) {
            const p = (n as Text).parentElement;
            if (p && SKIP_TAGS[p.tagName]) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          },
        });
        let node: Node | null;
        const hits: Text[] = [];
        while ((node = walker.nextNode())) {
          const t = (node.textContent || "").trim();
          if (!t || t.length > 80) continue;
          for (const phrase of RETELL_BRANDING_PHRASES) {
            if (phrase.test(t)) {
              hits.push(node as Text);
              break;
            }
          }
        }
        for (const n of hits) {
          let el: Element | null = n.parentElement;
          let depth = 0;
          while (el && depth < 3 && !SKIP_TAGS[el.tagName]) {
            hide(el);
            el = el.parentElement;
            depth++;
          }
        }
      } catch {}
    }

    function walkRoots(root: Document | ShadowRoot) {
      scanTextNodesIn(root);
      try {
        const all = (root as Document).querySelectorAll ? (root as Document).querySelectorAll("*") : [];
        for (let i = 0; i < all.length; i++) {
          const el = all[i] as HTMLElement;
          if (el.tagName === "A" && (el as HTMLAnchorElement).href && /retell\.(ai|com|io)/i.test((el as HTMLAnchorElement).href)) {
            hide(el);
          }
          if (el.shadowRoot && !observedShadow.has(el.shadowRoot)) {
            observedShadow.add(el.shadowRoot);
            walkRoots(el.shadowRoot);
            try {
              new MutationObserver(() => walkRoots(el.shadowRoot!)).observe(el.shadowRoot, {
                childList: true,
                subtree: true,
                characterData: true,
              });
            } catch {}
          }
        }
      } catch {}
    }

    function runAll() {
      walkRoots(document);
    }

    runAll();
    const obs = new MutationObserver(runAll);
    obs.observe(document.documentElement, { childList: true, subtree: true });
    const timers = [800, 2000, 4000, 8000].map((ms) => window.setTimeout(runAll, ms));

    return () => {
      obs.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return null;
}
