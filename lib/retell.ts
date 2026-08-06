// Configuration for the live voice demo that runs on Mia's page
// (/ai-employees/mia). It is powered by a Retell AI agent embedded through
// Retell's hosted widget script.
//
// Retell dashboard pointers, for whoever has to fix this next:
//   Agent      -> agent_3c3e0140740af0c25e467d5020 (version 0)
//   Public key -> public_key_1b257bbeaa7704429e87e
//
// The public key is domain-locked in the Retell dashboard. If the widget
// loads but the call never connects, the site's domain is missing from that
// key's allowed origins — add every domain the site is served from.

export const RETELL_SCRIPT_URL = "https://dashboard.retellai.com/retell-widget-v2.js";

export const RETELL_VOICE_AGENT_ID = "agent_3c3e0140740af0c25e467d5020";
export const RETELL_VOICE_PUBLIC_KEY = "public_key_1b257bbeaa7704429e87e";

export const RETELL_WIDGET_ATTRS: Record<string, string> = {
  id: "retell-widget",
  "data-voice-public-key": RETELL_VOICE_PUBLIC_KEY,
  "data-voice-agent-id": RETELL_VOICE_AGENT_ID,
  "data-agent-version": "0",
  "data-title": "Mia, Caddie AI",
  "data-bot-name": "AI patient coordinator",
  "data-fab-text": "Talk to Mia",
  "data-color": "#3E6AEF",
};
