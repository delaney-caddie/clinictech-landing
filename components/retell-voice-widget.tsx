"use client";

import { useEffect, useState } from "react";
import { RETELL_SCRIPT_URL, RETELL_WIDGET_ATTRS } from "@/lib/retell";

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

/**
 * The widget renders its floating button inside a shadow root, so a plain
 * document.querySelector never sees it. Walk open shadow roots looking for the
 * button the widget styles with its own `_fabBase_*` CSS-module class.
 */
function findRetellFab(): HTMLButtonElement | null {
  const roots: (Document | ShadowRoot)[] = [document];
  const seen = new WeakSet<ShadowRoot>();

  for (let i = 0; i < roots.length; i++) {
    let elements: Element[];
    try {
      elements = Array.from(roots[i].querySelectorAll("*"));
    } catch {
      continue;
    }
    for (const el of elements) {
      if (el.tagName === "BUTTON" && /(^|\s)_fabBase_/.test(el.className)) {
        return el as HTMLButtonElement;
      }
      const shadow = (el as HTMLElement).shadowRoot;
      if (shadow && !seen.has(shadow)) {
        seen.add(shadow);
        roots.push(shadow);
      }
    }
  }
  return null;
}

/** True once the widget button is mounted and not already showing an open panel. */
function isRetellFabClosed(fab: HTMLButtonElement) {
  return !/(^|\s)_fabOpen_/.test(fab.className);
}

/**
 * Button that opens the Retell widget. The widget exposes no JS API, so this
 * clicks its floating button for the visitor. It stays hidden until the widget
 * has actually mounted, so we never show a button that cannot do anything.
 */
export function VoiceDemoButton({ agentName }: { agentName: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const started = Date.now();

    function poll() {
      if (cancelled) return;
      if (findRetellFab()) {
        setReady(true);
        return;
      }
      // The script is third-party; give it a generous window, then give up
      // and let the fallback copy point at the corner instead.
      if (Date.now() - started > 20000) return;
      window.setTimeout(poll, 400);
    }
    poll();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <p className="agent-voice-fallback">
        Look for the &ldquo;Talk to {agentName}&rdquo; pill in the bottom-right corner of your screen.
      </p>
    );
  }

  return (
    <button
      type="button"
      className="button agent-voice-start"
      onClick={() => {
        const fab = findRetellFab();
        if (fab && isRetellFabClosed(fab)) fab.click();
        fab?.scrollIntoView({ block: "nearest" });
      }}
    >
      Start a call with {agentName}
    </button>
  );
}

/**
 * Mounts the Retell voice widget for the page it is rendered on, and cleans up
 * the DOM it leaves behind. Render it once per page.
 */
export function RetellVoiceWidget() {
  // The Retell widget mounts its own runtime into document.body (React-owned in
  // the App Router) and offers no teardown API. A client-side route change away
  // from this page leaves that mutated DOM behind, and Next's React reconciler
  // crashes with insertBefore/removeChild errors. Force a full page load on any
  // in-site navigation so the browser destroys the widget runtime cleanly.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      const target = anchor.getAttribute("target");
      if (target && target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // Leave same-page navigation (in-page anchors) to the browser.
      if (url.pathname === window.location.pathname) return;
      e.preventDefault();
      window.location.assign(url.href);
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Mount the Retell widget script on entry, tear it down on navigation away.
  useEffect(() => {
    // Avoid duplicate inject if a previous mount left one behind.
    document.querySelectorAll('script[src*="retell-widget"]').forEach((s) => s.remove());

    const script = document.createElement("script");
    script.src = RETELL_SCRIPT_URL;
    script.type = "module";
    for (const [k, v] of Object.entries(RETELL_WIDGET_ATTRS)) {
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

  // Remove the Caddie AI chat widget DOM while this page is mounted, so the
  // voice widget is the only thing in the bottom-right corner.
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
