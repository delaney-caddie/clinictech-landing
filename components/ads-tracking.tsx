"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// The OpenAI (`oaiq`) and Meta (`fbq`) ads pixels are loaded in app/layout.tsx.
// This component wires up the two funnel events we care about for the ad
// campaigns, firing the equivalent event into both pixels:
//   1. clicked "Book a demo"     -> oaiq "lead_created"          / Meta "Lead"
//   2. completed a Calendly book -> oaiq "appointment_scheduled" / Meta "Schedule"
//
// oaiq rejects custom event names, and "Lead"/"Schedule" are Meta standard
// events, so both sides use their own standard set.
//
// We use event delegation (a single document-level click listener) so we don't
// have to modify every "Book a demo" button. Any <a> pointing at calendly.com is
// treated as a demo CTA.
//
// This component also fires Meta PageView on client-side navigation: the inline
// snippet in the layout runs once per full page load, so without this every
// route change after the first would go unrecorded.

declare global {
  interface Window {
    oaiq?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
    };
  }
}

export default function AdsTracking() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // Meta PageView on route change. The layout snippet already fired the first
  // one, so skip the initial render to avoid double-counting it.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  useEffect(() => {
    // 1) Track clicks on any Calendly "Book a demo" link, and open Calendly as
    //    an on-page popup so we can detect the completed booking below.
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.(
        'a[href*="calendly.com"]'
      ) as HTMLAnchorElement | null;
      if (!link) return;

      // Fire the intent event (funnel step: clicked "Book a demo" = a lead).
      window.oaiq?.("measure", "lead_created", { type: "customer_action" });
      window.fbq?.("track", "Lead");

      // If the Calendly widget script has loaded, open the popup on this page
      // (required so the "event_scheduled" message can fire our conversion).
      // If it hasn't loaded for any reason, do nothing and let the link
      // navigate to Calendly normally — the button still works.
      if (window.Calendly?.initPopupWidget) {
        e.preventDefault();
        window.Calendly.initPopupWidget({ url: link.href });
      }
    };

    // 2) Calendly posts a window message when a booking is completed. Fire the
    //    conversion only for that event, and only from Calendly's origin.
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com") return;
      const data = e.data as { event?: string } | null;
      if (data && typeof data === "object" && data.event === "calendly.event_scheduled") {
        window.oaiq?.("measure", "appointment_scheduled", { type: "customer_action" });
        window.fbq?.("track", "Schedule");
      }
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("message", handleMessage);
    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return null;
}
