// Data for the comparison pages: /vs (Caddie vs. traditional CRMs) and the
// per-competitor pages (/vs/hubspot, /vs/gohighlevel, /vs/zoho) that the
// team sends to prospects already sitting on one of those platforms.
//
// Competitor copy describes each platform's well-known positioning and
// design, hedged where specifics (tiers, add-ons, pricing) change often.
// Keep claims about competitors general and defensible.

export type VsRow = {
  label: string;
  them: string;
  caddie: string;
};

// The master table: every clinic-relevant difference between Caddie and a
// traditional CRM. The hub page shows all of these.
export const genericRows: VsRow[] = [
  {
    label: "Core design",
    them: "A database your staff operates. Leads sit in a parking lot until someone works them.",
    caddie: "Fully agentic. The platform works every lead itself, in real time.",
  },
  {
    label: "What happens to a new lead",
    them: "Logged, tagged, and waiting for a human to follow up.",
    caddie: "Answered in seconds, qualified, followed up, and booked automatically.",
  },
  {
    label: "Personalization",
    them: "Mail-merge templates. Every patient gets the same drip sequence.",
    caddie: "Full context on every patient, so no two messages are the same.",
  },
  {
    label: "Clinic knowledge",
    them: "Knows your field names, not your services.",
    caddie: "A company brain: your treatments, pricing, and tone behind every message.",
  },
  {
    label: "Technology",
    them: "Legacy code built years ago, with AI features bolted on.",
    caddie: "Built on a modern AI stack from day one.",
  },
  {
    label: "Who does the work",
    them: "Your staff, or an agency you pay to operate it.",
    caddie: "AI employees that work leads like humans do, 24/7.",
  },
  {
    label: "Phone calls",
    them: "The phone still rings at your front desk.",
    caddie: "AI voice answers patient calls day and night, and books them.",
  },
  {
    label: "Chat & forms",
    them: "Static forms and scripted chat widgets.",
    caddie: "A chatbot and smart forms that answer in real time from your real knowledge base.",
  },
  {
    label: "Getting answers",
    them: "Dashboards and reports you dig through yourself.",
    caddie: "Ask Caddie anything about your clinic and pipeline, and get an answer in real time.",
  },
  {
    label: "Improvement over time",
    them: "Static until someone rebuilds the workflows.",
    caddie: "Self-improving, closed-loop: every conversation makes the system better.",
  },
  {
    label: "HIPAA",
    them: "Compliance gated behind enterprise tiers and paid add-ons.",
    caddie: "HIPAA-compliant, without the crazy premiums.",
  },
  {
    label: "Customization",
    them: "Admin panels, workflow builders, and consultants.",
    caddie: "Fully customized to your clinic and processes, and set up for you.",
  },
  {
    label: "Integrations",
    them: "An app marketplace. You wire it together.",
    caddie: "EHR, Meta, Instagram, Gmail, Zoom, and more, connected for you.",
  },
  {
    label: "Support",
    them: "Ticket queues, chatbots, and paid support tiers.",
    caddie: "Full-time support with under 1 day turnaround.",
  },
  {
    label: "Pricing model",
    them: "Per seat, per contact, per add-on. The bill grows with you.",
    caddie: "Flat monthly pricing. No per-seat fees.",
  },
  {
    label: "Time to value",
    them: "Weeks or months of implementation before it earns its keep.",
    caddie: "Live in days, with onboarding done for you.",
  },
  {
    label: "Healthcare guardrails",
    them: "Generic tooling with no concept of a patient conversation.",
    caddie: "Healthcare-trained AI that never gives medical advice and hands off to your staff.",
  },
];

export type Competitor = {
  slug: string;
  name: string;
  heroTitle: string;
  heroSub: string;
  /** Short framing of what the competitor is genuinely built for. */
  positioning: string;
  /** Why clinics outgrow it. */
  gap: string;
  themLabel: string;
  rows: VsRow[];
  metaDescription: string;
};

export const competitors: Competitor[] = [
  {
    slug: "hubspot",
    name: "HubSpot",
    heroTitle: "Caddie vs. HubSpot",
    heroSub:
      "HubSpot is a powerful CRM for B2B sales and marketing teams. Your clinic is neither. Caddie is built for one thing: turning patient inquiries into booked consults.",
    positioning:
      "HubSpot is genuinely good at what it was designed for: pipelines, marketing campaigns, and dashboards for sales-led companies, in every industry at once.",
    gap:
      "That breadth is the problem. A clinic doesn't need a sales-ops platform to configure; it needs inquiries answered at 8pm, follow-ups that never slip, and a front desk that never puts patients on hold. In HubSpot, all of that is work your team sets up and runs. In Caddie, it is the product.",
    themLabel: "HubSpot",
    rows: [
      {
        label: "Built for",
        them: "B2B sales and marketing teams in every industry, adapted to clinics by you.",
        caddie: "Medical clinics, out of the box: treatments, consults, patients.",
      },
      {
        label: "What it does with a lead",
        them: "Stores it in a pipeline and waits for your team to run the playbook.",
        caddie: "Works it: replies in seconds, qualifies, follows up until booked or closed.",
      },
      {
        label: "Automation",
        them: "Workflow builders your team (or a consultant) assembles and maintains.",
        caddie: "AI employees that already know the job. Nothing for you to build.",
      },
      {
        label: "AI",
        them: "Assistants that draft emails and summarize records for your staff to send.",
        caddie: "Agents that hold the whole conversation, on chat, email, and phone.",
      },
      {
        label: "Patient channels",
        them: "Phone and DMs need add-ons or third-party tools.",
        caddie: "Phone, chat, web forms, email, WhatsApp, and social DMs, built in.",
      },
      {
        label: "Personalization",
        them: "Tokens and segments: {firstname} gets sequence #4.",
        caddie: "Every reply written from the patient's actual history and your clinic's brain.",
      },
      {
        label: "HIPAA & PHI",
        them: "Sensitive-data handling is typically reserved for higher tiers.",
        caddie: "HIPAA-compliant handling of PHI as the default, not an upgrade.",
      },
      {
        label: "Cost structure",
        them: "Per seat and per contact. Growth makes it more expensive.",
        caddie: "Flat monthly price, no per-seat fees.",
      },
      {
        label: "Implementation",
        them: "Onboarding fees and weeks of setup are the norm before value shows up.",
        caddie: "White-glove setup. Live in days, trained on your clinic.",
      },
      {
        label: "Support",
        them: "Tiered: faster help usually means a bigger plan.",
        caddie: "Full-time support, under 1 day turnaround, for every clinic.",
      },
    ],
    metaDescription:
      "HubSpot is built for B2B sales teams. Caddie is an agentic CRM built for clinics, with AI employees that answer, follow up, and book patients 24/7. See the comparison.",
  },
  {
    slug: "gohighlevel",
    name: "GoHighLevel",
    heroTitle: "Caddie vs. GoHighLevel",
    heroSub:
      "GoHighLevel is a toolkit built for marketing agencies to resell. Caddie is the team that does the work, built for the clinic itself, no agency in the middle.",
    positioning:
      "GoHighLevel gives marketing agencies a white-label toolbox: funnels, workflows, snapshots, and campaigns they can configure and resell to local businesses, including med spas and clinics.",
    gap:
      "Which means what you're really buying is homework. Either your staff learns to operate it, or you pay an agency every month to run it for you, and the automations are only as good as whoever built them. Caddie removes the operator entirely: the AI employees are the ones doing the work, trained on your clinic, accountable to you.",
    themLabel: "GoHighLevel",
    rows: [
      {
        label: "Built for",
        them: "Marketing agencies to white-label and resell. Clinics usually get it through a middleman.",
        caddie: "Your clinic directly. No agency between you and your patients.",
      },
      {
        label: "Who operates it",
        them: "You learn the builder, or you pay an agency retainer to run it.",
        caddie: "AI employees operate themselves. You review results, not workflows.",
      },
      {
        label: "Automation",
        them: "Snapshots and workflow builders someone has to configure and babysit.",
        caddie: "Agentic from the start: leads are worked in real time, with context.",
      },
      {
        label: "Conversations",
        them: "Scripted sequences; AI chat is a usage-billed add-on that follows prompts.",
        caddie: "Real conversations from your clinic's knowledge base, on every channel.",
      },
      {
        label: "Personalization",
        them: "The same funnel every agency client gets, with your logo on it.",
        caddie: "A company brain unique to your clinic: treatments, pricing, tone.",
      },
      {
        label: "HIPAA",
        them: "Compliance is a paid add-on you have to remember to buy.",
        caddie: "HIPAA-compliant by default, without the premium.",
      },
      {
        label: "Cost structure",
        them: "Platform fee plus usage rebilling for calls, texts, email, and AI credits.",
        caddie: "Flat monthly pricing you can actually predict.",
      },
      {
        label: "Support",
        them: "Ticket queues, and your agency as the real support line.",
        caddie: "Full-time support from the Caddie team, under 1 day turnaround.",
      },
      {
        label: "Learning curve",
        them: "Famously steep. Powerful if you invest the hours.",
        caddie: "There is nothing to learn. Ask Caddie and it answers.",
      },
      {
        label: "Improvement",
        them: "Improves when someone rebuilds the funnel.",
        caddie: "Closed-loop learning from every conversation, automatically.",
      },
    ],
    metaDescription:
      "GoHighLevel is an agency toolkit you (or your agency) operate. Caddie is an agentic CRM with AI employees that do the work themselves, built for clinics. See the comparison.",
  },
  {
    slug: "zoho",
    name: "Zoho",
    heroTitle: "Caddie vs. Zoho",
    heroSub:
      "Zoho is an economy suite of dozens of generic business apps. Caddie is one purpose-built system that runs a clinic's front office by itself.",
    positioning:
      "Zoho's pitch is breadth at a low price: CRM, forms, campaigns, desk, books, and dozens more apps that cover almost any business function, in almost any industry.",
    gap:
      "But a clinic isn't looking for forty apps to stitch together; it's looking for the phone answered, the DMs handled, and the schedule full. In Zoho, connecting those dots is configuration work that lands on you. Caddie ships as one system with the AI team already inside it.",
    themLabel: "Zoho",
    rows: [
      {
        label: "Built for",
        them: "Every business function in every industry, at economy scale.",
        caddie: "One job, done completely: a clinic's front office.",
      },
      {
        label: "Architecture",
        them: "A suite of separate apps you stitch into a workflow.",
        caddie: "One platform: CRM, portal, operating system, and AI team together.",
      },
      {
        label: "What it does with a lead",
        them: "Files it. Zia can score or draft, but your staff does the working.",
        caddie: "Works it end to end: answer, qualify, follow up, book.",
      },
      {
        label: "AI",
        them: "An assistant layer that predicts and suggests for your team.",
        caddie: "AI employees that act: conversations held, consults booked.",
      },
      {
        label: "Customization",
        them: "Admin configuration and builder tools. The work is yours.",
        caddie: "Set up for you, around your clinic's processes and tone.",
      },
      {
        label: "Patient experience",
        them: "Generic web forms and a ticketing-style help desk.",
        caddie: "Instant, personalized answers on chat, phone, email, and social.",
      },
      {
        label: "HIPAA",
        them: "Available on certain editions, with the controls left to you to configure.",
        caddie: "HIPAA-compliant handling of PHI, configured from day one.",
      },
      {
        label: "Cost structure",
        them: "Cheap per user, until the apps, add-ons, and admin time stack up.",
        caddie: "Flat monthly pricing that includes the team doing the work.",
      },
      {
        label: "Support",
        them: "Tiered plans, with premium SLAs sold separately.",
        caddie: "Full-time support, under 1 day turnaround, included.",
      },
      {
        label: "Improvement",
        them: "As good as your last admin session.",
        caddie: "Self-improving from every patient conversation.",
      },
    ],
    metaDescription:
      "Zoho is a suite of generic business apps you configure. Caddie is one agentic platform with AI employees that run your clinic's front office. See the comparison.",
  },
];

export function getCompetitor(slug: string) {
  return competitors.find((c) => c.slug === slug);
}
