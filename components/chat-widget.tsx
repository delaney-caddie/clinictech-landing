"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { agents } from "@/lib/agents";

// Pages that run the Retell voice widget, which owns the bottom corner there.
const VOICE_DEMO_PATHS = agents
  .filter((a) => a.voiceDemo)
  .map((a) => `/ai-employees/${a.slug}`);

// Renders the Caddie AI chat widget on every page except the ones hosting a
// live voice demo.
export function ChatWidget() {
  const pathname = usePathname();

  if (pathname && VOICE_DEMO_PATHS.includes(pathname)) {
    return null;
  }

  return (
    <>
      <div
        id="clinictech-widget"
        data-widget-id="0681049b-2240-4e1e-9dfc-6cc91151fdd5"
        data-host="https://app.clinictech.io"
      ></div>
      <Script src="https://app.clinictech.io/embed-widget.js" strategy="afterInteractive" />
    </>
  );
}
