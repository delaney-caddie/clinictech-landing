// Single source of truth for the Caddie AI employee roster.
// Used by the homepage lineup, the AI Employees index, the agent detail
// pages, and the site footer. Copy lives here so every surface stays in sync.

export type Agent = {
  slug: string;
  name: string;
  role: string;
  color: string;
  /** Pastel background color of the portrait image. */
  bg: string;
  /** Slightly darker tone of the portrait background, for image contours. */
  bgEdge: string;
  /** Darker tone of the portrait background, readable as text. */
  roleColor: string;
  portrait: string;
  /** First-person tagline used on the agent's own page hero. */
  tagline: string;
  /** First-person one-liner for teaser cards (defaults to tagline). */
  cardLine: string;
  /** Plain third-person description of what they do. */
  summary: string;
  /** Short task bullets. */
  handles: string[];
  /** KPI stats tied to this role. */
  metrics: string[];
  /** Without / With comparison rows. */
  comparison: { without: string; with: string }[];
  /** How this agent hands off to the rest of the team. */
  teamNote: string;
  /** Show the live voice test button on this agent's page. */
  voiceDemo?: boolean;
};

export const CALENDAR_URL =
  "https://calendly.com/caddie-ai/demo";

export const agents: Agent[] = [
  {
    slug: "mia",
    name: "Mia",
    role: "Patient Coordinator",
    color: "#2563EB",
    bg: "#DDEEFF",
    bgEdge: "#A7BFD6",
    roleColor: "#486685",
    portrait: "/agents/mia.jpg",
    tagline: "I answer in seconds, so the first reply a patient gets is always yours.",
    cardLine: "I answer in seconds, so the first reply a patient gets is always yours.",
    summary:
      "Mia is your AI receptionist. She answers all patient inquiries via phone, email and web chat 24/7, replies to new inquiries in seconds, answers treatment and pricing questions, runs follow-ups until a lead books or says no, and confirms every appointment.",
    handles: [
      "Instant replies to new inquiries, day or night",
      "Treatment, pricing, and prep questions",
      "Follow-up sequences until the patient books or declines",
      "Appointment booking and confirmations",
      "Handoff to your team the moment a human is needed",
    ],
    metrics: [
      "78% of patients book with the clinic that responds first. With Mia, that is you.",
      "Leads are 5x more likely to book when you respond within 5 minutes.",
      "No-shows usually run 15 to 30%. Personalized reminders and confirmations cut that by 50%.",
    ],
    comparison: [
      { without: "Leads wait until morning for a reply", with: "Every lead gets an answer in seconds" },
      { without: "Follow-ups slip through the cracks", with: "Every lead is worked until it converts or closes" },
      { without: "Front desk buried in questions", with: "Staff freed for in-person patient care" },
      { without: "No-shows eat your revenue", with: "Reminders and confirmations cut no-shows in half" },
    ],
    teamNote:
      "Mia closes the loop for the whole team: warm leads from Iris, reactivated patients from Rio, and new visitors from Quill all land with her to get booked.",
    voiceDemo: true,
  },
  {
    slug: "iris",
    name: "Iris",
    role: "Social Media Inquiry Specialist",
    color: "#0EA5E9",
    bg: "#FFDEBF",
    bgEdge: "#D6AC85",
    roleColor: "#855427",
    portrait: "/agents/iris.jpg",
    tagline: "I catch every comment and DM, and turn interested followers into booked patients.",
    cardLine: "I catch every comment and DM, and turn interested followers into booked patients.",
    summary:
      "Iris watches your social media around the clock. She tracks every comment and DM from interested leads, replies in your voice, and moves the conversation toward a booking, so the interest your content creates never goes to waste.",
    handles: [
      "Monitors comments and DMs across your social channels",
      "Spots and prioritizes high-intent leads",
      "Auto-responds to interested followers in your clinic's voice",
      "Moves conversations toward a booked consult",
      "Hands warm leads to Mia to close and book",
    ],
    metrics: [
      "Personalized messages get 20% more responses.",
      "11% of patient inquiries come in outside business hours. Iris catches every one.",
    ],
    comparison: [
      { without: "Comments and DMs sit unanswered for days", with: "Every interested lead gets a reply fast" },
      { without: "Interest from your content goes cold", with: "Followers turn into booked patients" },
      { without: "Someone has to babysit the inbox", with: "It runs itself, 24/7" },
    ],
    teamNote: "Iris warms up the interest Vidi's content creates, then hands each lead to Mia to close and book.",
  },
  {
    slug: "rio",
    name: "Rio",
    role: "Retention Specialist",
    color: "#DB2777",
    bg: "#B5D6C5",
    bgEdge: "#87B49D",
    roleColor: "#376F52",
    portrait: "/agents/rio.jpg",
    tagline: "I collect reviews and testimonials and bring past patients back to keep your schedule full.",
    cardLine: "I bring past patients back and keep your schedule full.",
    summary:
      "Rio works your existing patient base. He runs post-treatment check-ins, reactivation campaigns, and review requests at the right moments, so patients come back and refer others, and your calendar stays full.",
    handles: [
      "Post-treatment check-ins and follow-through",
      "Reactivation of patients who went quiet",
      "Review and testimonial requests from happy patients",
      "Win-back sequences for lapsed patients",
    ],
    metrics: [
      "77% of patients use online reviews as their first step when searching for a new healthcare provider.",
      "Patients are 2x more likely to book with clinics that showcase authentic patient reviews and testimonials.",
    ],
    comparison: [
      { without: "Past patients drift away", with: "Patients come back on a schedule" },
      { without: "Reviews rarely get asked for", with: "Review requests go out at the perfect moment" },
    ],
    teamNote: "When Rio reopens a conversation, Mia takes it from there and gets the patient back on the calendar.",
  },
  {
    slug: "juno",
    name: "Juno",
    role: "Executive Assistant",
    color: "#16A34A",
    bg: "#FEE0FC",
    bgEdge: "#D5ABD3",
    roleColor: "#844C80",
    portrait: "/agents/juno.jpg",
    tagline: "I manage your inbox so you don't have to.",
    cardLine: "I manage your email inbox and replies so you don't have to.",
    summary:
      "Juno keeps your inbox organized. She drafts email replies, flags priority versus spam, and drafts daily summaries for your to-do's. She handles the busywork so you can stay focused on the decisions only you can make.",
    handles: [
      "Daily morning brief of what happened and what needs you",
      "Drafts replies for you",
      "Filters spam, newsletters and cold outreach automatically",
      "Labels every email: To reply, FYI, Marketing and more",
      "Surfaces the messages that genuinely need you, first",
    ],
    metrics: ["Cut email admin time by 80%."],
    comparison: [
      { without: "100s of emails waiting for your response", with: "A clean inbox with 0 unreads" },
      { without: "High priority emails get missed in the noise", with: "You get a daily brief of what needs your attention" },
      { without: "You deal with admin after hours and weekends", with: "Your inbox is cleared by 9am" },
    ],
    teamNote: "Juno routes patient questions to Mia and keeps your morning brief focused on the few things that actually need you.",
  },
  {
    slug: "vidi",
    name: "Vidi",
    role: "Content Marketer",
    color: "#7C3AED",
    bg: "#9AC3DF",
    bgEdge: "#6699BB",
    roleColor: "#144D74",
    portrait: "/agents/vidi.jpg",
    tagline: "I keep your clinic visible and top of mind, everywhere your patients look.",
    cardLine: "I keep your clinic visible and top of mind, everywhere your patients look.",
    summary:
      "Vidi creates and schedules content that keeps your clinic in front of the right audience. Posts, campaigns, and creative that build trust and drive new inquiries, all in your clinic's voice.",
    handles: [
      "Social and marketing content creation",
      "Content scheduling and consistency",
      "Campaigns that drive new inquiries",
      "On-brand creative in your clinic's voice",
    ],
    metrics: [
      "More inquiries at the top of your funnel.",
      "A consistent presence that builds patient trust.",
    ],
    comparison: [
      { without: "Marketing goes quiet for weeks", with: "A steady, on-brand presence" },
      { without: "Content is an afterthought", with: "Content runs on a schedule" },
      { without: "Inquiries dry up", with: "A full top of funnel" },
    ],
    teamNote: "Vidi fills the top of the funnel, and Iris catches every comment and DM the content brings in.",
  },
  {
    slug: "quill",
    name: "Quill",
    role: "SEO Blog Writer",
    color: "#0D9488",
    bg: "#D6FEFE",
    bgEdge: "#9FD5D5",
    roleColor: "#418484",
    portrait: "/agents/quill.jpg",
    tagline: "I get your clinic found on Google and ChatGPT, one ranked article at a time.",
    cardLine: "I get your clinic found on Google and ChatGPT, one ranked article at a time.",
    summary:
      "Quill writes SEO and AEO-optimized articles that rank, so patients searching for your treatments find your clinic first. Research, writing, and publishing, handled.",
    handles: [
      "Keyword research around your treatments",
      "SEO and AEO-optimized blog articles",
      "Publishing on a consistent schedule",
      "Content that answers what patients search for",
      "Long-term organic growth for your clinic",
    ],
    metrics: [
      "More organic traffic from patients actively searching.",
      "A compounding source of new inquiries.",
    ],
    comparison: [
      { without: "Competitors own the search results", with: "Your clinic ranks for what patients search" },
      { without: "Blog sits empty", with: "Fresh, ranked content on a schedule" },
      { without: "You pay for every lead", with: "Organic leads compound over time" },
    ],
    teamNote: "Quill brings patients to your site, where Mia is ready to answer.",
  },
  {
    slug: "atlas",
    name: "Atlas",
    role: "Protocol Architect",
    color: "#D97706",
    bg: "#FEEDB7",
    bgEdge: "#D5C07C",
    roleColor: "#846C1F",
    portrait: "/agents/atlas.jpg",
    tagline: "I draft all of your treatment protocols so all you have to do is review them.",
    cardLine: "I draft treatment protocols so all you have to do is review them.",
    summary:
      "Atlas drafts multi-phase treatment protocols from intake notes, consult notes, and similar past cases, with dosing, costs, and timing laid out per phase. Every draft waits for doctor sign-off. Nothing reaches a patient without it.",
    handles: [
      "Structuring treatments, protocols, and pricing for doctor review",
      "Enforcing doctor sign-off on anything clinical",
    ],
    metrics: ["Hours of protocol writing become minutes of review."],
    comparison: [
      {
        without: "Spend hours drafting protocols for each patient",
        with: "Spend minutes reviewing and approving protocols",
      },
    ],
    teamNote:
      "Atlas builds each draft from the consult notes and history already in your company brain, so nothing gets entered twice.",
  },
  {
    slug: "sage",
    name: "Sage",
    role: "Sales Coach",
    color: "#DC2626",
    bg: "#DDFFDA",
    bgEdge: "#A8D6A4",
    roleColor: "#4A8544",
    portrait: "/agents/sage.jpg",
    tagline: "I prep your team before every sales call, so they walk in ready to convert.",
    cardLine: "I prep your team before every sales call, so they walk in ready to convert.",
    summary:
      "Sage is your team's sales coach. She briefs staff before every sales call with full context on the patient, their history, and what matters to them. After the call, she evaluates what converted and what did not, so your whole team learns from every conversation.",
    handles: [
      "Pre-call briefs with full patient context",
      "Talking points shaped around each patient's treatments and questions",
      "Call reviews that show which calls convert best",
      "Coaching tips so every staff member sells like your best closer",
    ],
    metrics: [
      "Every call starts with full patient context, not a cold open.",
      "Winning patterns from your best calls, shared across the whole team.",
    ],
    comparison: [
      { without: "Staff walk into calls blind", with: "Every call starts with a full patient brief" },
      { without: "No one knows why some calls convert", with: "Sage shows what works and coaches to it" },
      { without: "Your best closer's skills stay in their head", with: "Winning patterns get shared with the team" },
    ],
    teamNote:
      "Sage pulls everything Mia and Iris learned about a patient from the company brain, so your team walks into every call informed.",
  },
];

export function getAgent(slug: string): Agent | undefined {
  return agents.find((a) => a.slug === slug);
}
