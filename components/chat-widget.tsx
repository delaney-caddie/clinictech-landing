"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

// Renders the Caddie AI chat widget on every page except the voice agent
// demo, where the Retell voice widget owns the bottom corner instead.
export function ChatWidget() {
  const pathname = usePathname();

  if (pathname?.startsWith("/voice-agent-demo")) {
    return null;
  }

  return (
    <>
      <div
        id="clinictech-widget"
        data-widget-id="17af3dba-6740-4133-a6cd-804de4a6a281"
        data-host="https://app.clinictech.io"
      ></div>
      <Script src="https://app.clinictech.io/embed-widget.js" strategy="afterInteractive" />
    </>
  );
}
