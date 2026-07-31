"use client";

import { useEffect } from "react";

// OpenAI ads pixel (`oaiq`) is loaded in app/layout.tsx. This component wires up
// the two funnel events we care about for the ad campaign:
//   1. "lead_created"          — someone clicks any "Book a demo" (Calendly) button
//   2. "appointment_scheduled" — someone actually completes a booking in Calendly
//
// Both are standard oaiq event names (of type "customer_action"). Custom names
// are rejected by the pixel's validation and dropped, so we use the standard set.
//
// We use event delegation (a single document-level click listener) so we don't
// have to modify every "Book a demo" button. Any <a> pointing at calendly.com is
// treated as a demo CTA.

declare global {
  interface Window {
    oaiq?: (...args: unknown[]) => void;
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
    };
  }
}

export default function AdsTracking() {
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
