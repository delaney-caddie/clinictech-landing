import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { agents, CALENDAR_URL } from "@/lib/agents";

export const metadata = {
  title: "The Full AI Team | Caddie",
  description:
    "Eight AI employees, one platform, one company brain. Hire only the ones your clinic needs, and add more as you grow.",
};

// One-line summaries for the roster view. Deliberately plainer than the
// first-person taglines on the individual pages: this page answers "who else
// is there?" without competing with the platform story.
const summaries: Record<string, string> = {
  mia: "Answers every patient inquiry in seconds, on every channel, and books the consult.",
  iris: "Catches every comment and DM and turns interested followers into booked patients.",
  rio: "Collects reviews and testimonials, and brings past patients back onto the schedule.",
  juno: "Runs your inbox so your team does not have to.",
  vidi: "Keeps your clinic visible everywhere your patients are already looking.",
  quill: "Gets your clinic found on Google and ChatGPT, one ranked article at a time.",
  atlas: "Drafts your treatment protocols so your practitioners review instead of write.",
  sage: "Preps your team before every consult with the patient's full history.",
};

const order = ["mia", "iris", "rio", "juno", "vidi", "quill", "atlas", "sage"];

export default function TeamRosterPage() {
  const roster = order
    .map((slug) => agents.find((a) => a.slug === slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <div className="ct-page">
      <style>{`
.team-hero {
  max-width: 820px; margin: 0 auto;
  padding: clamp(56px, 8vw, 96px) 24px 0; text-align: center;
}
.team-hero h1 { margin-left: auto; margin-right: auto; }
.team-hero p { font-size: 1.06rem; max-width: 640px; margin: 0 auto; }

.roster-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: var(--grid-gap);
}
.roster-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg);
  box-shadow: var(--shadow-xs); padding: 26px 28px;
  display: grid; grid-template-columns: 96px 1fr; gap: 22px; align-items: start;
  transition: border-color .2s ease, box-shadow .2s ease;
}
.roster-card:hover { border-color: var(--agent-edge, var(--line-strong)); box-shadow: var(--shadow-md); }
.roster-card > img {
  width: 96px; height: 96px; border-radius: 999px; object-fit: cover;
  background: var(--agent-bg); border: 3px solid var(--agent-edge);
}
.roster-card strong { display: block; font-size: 1.15rem; font-weight: 700; letter-spacing: -.015em; }
.roster-role { display: block; color: var(--agent-role); font-size: .82rem; font-weight: 650; margin-top: 2px; }
.ct-page .roster-sum { margin: 10px 0 12px; font-size: .93rem; color: var(--ink-soft); }
.roster-card ul { list-style: none; margin: 0 0 12px; padding: 0; display: grid; gap: 6px; }
.roster-card li {
  font-size: .86rem; color: var(--muted-ink); display: flex; gap: 9px; align-items: baseline;
}
.roster-card li::before {
  content: ""; width: 6px; height: 6px; border-radius: 999px; flex: none;
  background: var(--agent-edge, var(--line-strong)); transform: translateY(-1px);
}
.roster-more {
  color: var(--agent-role, var(--blue-ink)); font-size: .85rem; font-weight: 620;
  text-decoration: none;
}
.roster-more:hover { text-decoration: underline; }

.roster-cta {
  border-radius: var(--r-xl); box-shadow: var(--shadow-md); color: var(--ink);
  gap: var(--grid-gap-lg);
  background:
    radial-gradient(900px 500px at 88% 0, #355cff29, #0000 62%),
    linear-gradient(138deg, #f4f7ff 0%, #e7eeff 50%, #d8e4ff 100%);
  border: 1px solid #dde6f8;
  justify-content: space-between; align-items: center;
  padding: 48px 56px; display: flex;
}
.roster-cta h2 { margin-bottom: 8px; }
.roster-cta p { color: var(--ink-soft); max-width: 560px; margin-bottom: 0; }

@media (max-width: 1020px) {
  .roster-grid { grid-template-columns: 1fr; }
  .roster-cta { flex-direction: column; align-items: stretch; }
}
@media (max-width: 520px) {
  .roster-card { grid-template-columns: 1fr; }
  .roster-cta { padding: 30px; }
}
      `}</style>

      <SiteNav />

      <main>
        <header className="team-hero">
          <span className="eyebrow">The full team</span>
          <h1>Eight AI employees. Hire only the ones you need.</h1>
          <p>
            Every one of them runs on the same platform, learns from the same
            company brain, and follows the same rules you set. Start with one and
            add more as your clinic grows.
          </p>
        </header>

        <section className="section">
          <div className="roster-grid">
            {roster.map((a) => (
              <article
                key={a.slug}
                className="roster-card"
                style={{
                  ["--agent-bg" as string]: a.bg,
                  ["--agent-edge" as string]: a.bgEdge,
                  ["--agent-role" as string]: a.roleColor,
                } as React.CSSProperties}
              >
                <img src={a.portrait} alt={`${a.name}, ${a.role}`} loading="lazy" />
                <div>
                  <strong>{a.name}</strong>
                  <span className="roster-role">{a.role}</span>
                  <p className="roster-sum">{summaries[a.slug] ?? a.cardLine}</p>
                  <ul>
                    {a.handles.slice(0, 3).map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  <Link href={`/ai-employees/${a.slug}`} className="roster-more">
                    More about {a.name} &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="roster-cta">
            <div>
              <h2>Not sure which ones you need?</h2>
              <p>
                Most clinics start with Mia and add from there. Book a demo and we
                will tell you which employees fit your pipeline.
              </p>
            </div>
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
              Book a demo
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
