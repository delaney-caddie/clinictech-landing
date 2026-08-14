import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CALENDAR_URL } from "@/lib/agents";
import { competitors, getCompetitor } from "@/lib/vs";

export function generateStaticParams() {
  return competitors.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCompetitor(slug);
  if (!c) return {};
  return {
    title: `${c.heroTitle} | Caddie`,
    description: c.metaDescription,
  };
}

export default async function VsCompetitorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCompetitor(slug);
  if (!c) notFound();

  return (
    <div className="ct-page">
      <SiteNav />

      <main>
        <header className="vs-hero">
          <span className="eyebrow">Comparison</span>
          <h1>{c.heroTitle}</h1>
          <p>{c.heroSub}</p>
        </header>

        {/* Fair framing: what it's for, why clinics outgrow it */}
        <section className="section">
          <div className="vs-frame">
            <article>
              <h3>What {c.name} is built for</h3>
              <p>{c.positioning}</p>
            </article>
            <article>
              <h3>Why clinics outgrow it</h3>
              <p>{c.gap}</p>
            </article>
          </div>
        </section>

        {/* The table */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide">
            <span className="eyebrow">Side by side</span>
            <h2>{c.name} vs. Caddie, for a clinic.</h2>
          </div>
          <div className="vs-table">
            <div className="vs-table-head">
              <span className="vs-label" aria-hidden="true"></span>
              <span>{c.themLabel}</span>
              <span>Caddie</span>
            </div>
            {c.rows.map((r) => (
              <div key={r.label} className="vs-table-row">
                <span className="vs-label">{r.label}</span>
                <span>{r.them}</span>
                <span>{r.caddie}</span>
              </div>
            ))}
          </div>
          <div className="vs-switch">
            Switching is not a project: we migrate your contacts and
            conversations during onboarding, connect your channels and EHR,
            and your AI team is live in days. Your patients never notice the
            move, except that someone finally answers at 8pm.
          </div>
        </section>

        {/* CTA */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="vs-cta">
            <div>
              <h2>Watch Caddie work your real leads.</h2>
              <p>
                Book a demo, bring your {c.name} setup, and compare them on
                your own pipeline. Or see how Caddie compares to{" "}
                {competitors
                  .filter((x) => x.slug !== c.slug)
                  .map((x, i) => (
                    <span key={x.slug}>
                      {i > 0 && " and "}
                      <Link href={`/vs/${x.slug}`}>{x.name}</Link>
                    </span>
                  ))}
                .
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
