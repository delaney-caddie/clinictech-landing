import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { FaqSection } from "@/components/faq-section";
import { CALENDAR_URL, AUDIT_CTA } from "@/lib/agents";
import "./products.css";

export const metadata = {
  title: "Products | Caddie",
  description:
    "Everything a regenerative medicine clinic needs to attract new patients, grow its reputation and run the practice, from one tech partner. Plus a dedicated partnership option for custom software.",
};

// Three groups, one line each. Product detail is deliberately light: the
// site's job is to pique interest and book the audit, not to demo features.
const groups = [
  {
    id: "attract",
    num: "01",
    eyebrow: "More patients",
    title: "Attract new patients",
    lead: "Every channel a prospective patient uses becomes a way into your clinic, and every inquiry gets an answer.",
    outcome: "More inquiries, and none of them lost.",
    items: [
      { name: "Website builder", body: "A clinic website designed to convert visitors into inquiries, not just to look good." },
      { name: "Bilingual chatbot", body: "Answers treatment and pricing questions in English and Spanish, any hour, and captures the lead." },
      { name: "Online scheduling", body: "Patients book real appointments on your real calendar without waiting for a callback." },
      { name: "Voice AI assistant", body: "Answers the phone when your team cannot, handles questions and books the consult on the call." },
    ],
  },
  {
    id: "reputation",
    num: "02",
    eyebrow: "Premium experience",
    title: "Grow your reputation",
    lead: "Turn good outcomes into reviews, testimonials and referrals, and keep your clinic visible to the patients searching for it.",
    outcome: "More five-star reviews, more referrals, more patients who arrive already trusting you.",
    items: [
      { name: "Reviews & testimonials generator", body: "Asks happy patients at the right moment, so reviews and testimonials keep arriving without staff time." },
      { name: "AI blog writer", body: "Keeps your site publishing the treatment and condition content patients search for." },
      { name: "Social media assistant", body: "Keeps your channels active and replies to comments and messages in your clinic's voice." },
    ],
  },
  {
    id: "run",
    num: "03",
    eyebrow: "Operational efficiency",
    title: "Run your practice",
    lead: "One connected system instead of a patchwork of tools, so the clinic runs on less admin and fewer mistakes.",
    outcome: "Fewer tools, fewer admin hours, and growth without adding headcount.",
    items: [
      { name: "CRM", body: "Every lead and patient conversation in one place, worked automatically until it becomes a booking." },
      { name: "Brandable patient portal", body: "Your clinic's own front door for patients: bookings, questions, prep and follow-up under your brand." },
      { name: "AI protocol builder", body: "Builds treatment protocols from your clinic's own approach, ready for your doctors to review and sign off." },
      { name: "Operating system", body: "Confirmations, reminders, follow-ups and task coordination that run on their own, every day." },
      { name: "Integrations", body: "Connects to the EHR, calendar and tools you already run, or replaces the ones you would rather retire." },
    ],
  },
];

const partnershipPoints = [
  "A dedicated team that learns how your clinic actually operates",
  "Custom software designed, built and launched around your workflows",
  "Ongoing iteration as your clinic grows and your needs change",
  "Available to single clinics and multi-location networks",
];

export default function ProductsPage() {
  return (
    <div className="ct-page">
      <SiteNav />
      <main>
        {/* Hero */}
        <section className="prod-hero">
          <span className="eyebrow">Products</span>
          <h1>Everything a regenerative clinic needs, from one partner.</h1>
          <p>
            Your front office, CRM, patient portal, AI assistants and more, built
            only for regenerative medicine and run as one connected system. Use
            what you need; every clinic is set up differently.
          </p>
          <div className="prod-hero-actions">
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
              {AUDIT_CTA}
            </a>
          </div>
        </section>

        {/* Photo band: real front-office moments */}
        <section className="section" style={{ paddingTop: 28, paddingBottom: 0 }}>
          <div className="prod-photo-row">
            <img src="/photos/clinic-glass.jpg" alt="A modern glass clinic building" loading="lazy" />
            <img src="/photos/team-walking.jpg" alt="A clinic team standing outside their building" loading="lazy" />
            <img src="/photos/clinic-lush.jpg" alt="A clinic building surrounded by greenery" loading="lazy" />
          </div>
        </section>

        {/* The three groups */}
        {groups.map((g) => (
          <section key={g.id} id={g.id} className="section prod-group">
            <div className="prod-group-head">
              <span className="prod-num">{g.num}</span>
              <div>
                <span className="eyebrow">{g.eyebrow}</span>
                <h2>{g.title}</h2>
                <p>{g.lead}</p>
              </div>
            </div>
            {/* Columns follow the group size so no card is orphaned on its own row. */}
            <div className="prod-grid" style={{ ["--cols" as string]: g.items.length }}>
              {g.items.map((it) => (
                <article key={it.name} className="prod-card">
                  <h3>{it.name}</h3>
                  <p>{it.body}</p>
                </article>
              ))}
            </div>
            <p className="prod-outcome">
              <span>The outcome</span> {g.outcome}
            </p>
          </section>
        ))}

        {/* Dedicated tech partnership */}
        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <section className="prod-partner" id="partnership">
            <div className="prod-partner-copy">
              <span className="eyebrow">Dedicated tech partnership</span>
              <h2>Need something that does not exist yet? We build it with you.</h2>
              <p>
                Some clinics need more than products off the shelf. With a dedicated
                tech partnership, we work hands-on with your team to design, build and
                launch custom software around the way your clinic operates, then keep
                improving it with you.
              </p>
              <ul>
                {partnershipPoints.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
                Talk to us about a partnership
              </a>
            </div>
            <figure className="prod-partner-shot">
              <img
                src="/product-analytics.jpg"
                alt="A Caddie workspace showing live pipeline results and lead sources"
                loading="lazy"
              />
              <figcaption>Built for one clinic. Running every day.</figcaption>
            </figure>
          </section>
        </div>

        {/* Regen-only note */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="prod-only">
            <div>
              <h2>Built only for regenerative medicine.</h2>
              <p>
                We do not build for other specialties, by choice. Every product on
                this page was designed around how regenerative clinics attract,
                convert and care for patients, from one-person practices to
                multi-location clinics operating worldwide.
              </p>
            </div>
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
              {AUDIT_CTA}
            </a>
          </div>
        </section>

        <FaqSection />
      </main>
      <SiteFooter />
    </div>
  );
}
