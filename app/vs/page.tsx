import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { VsClinicFeatures } from "@/components/vs-clinic-features";
import { CALENDAR_URL } from "@/lib/agents";
import { genericRows, competitors } from "@/lib/vs";

export const metadata = {
  title: "Caddie vs. Traditional CRMs | Caddie",
  description:
    "Traditional CRMs are parking lots for leads. Caddie is a fully agentic platform with AI employees that answer, follow up, and book patients in real time. See every difference.",
};

export default function VsPage() {
  return (
    <div className="ct-page">
      <SiteNav />

      <main>
        <header className="vs-hero">
          <span className="eyebrow">Caddie vs. traditional CRMs</span>
          <h1>A CRM stores your leads. Caddie books them.</h1>
          <p>
            Caddie either integrates with your existing CRM or replaces it
            altogether &mdash; most clinics retire theirs within a month. Either
            way, here is why it beats a traditional CRM, side by side.
          </p>
        </header>

        {/* Integrate or replace */}
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="vs-frame">
            <article>
              <h3>Integrates with your CRM</h3>
              <p>
                Keep what you run today. Caddie connects in front of it, works
                the leads, and writes everything back &mdash; so you get the AI
                team without a migration project on day one.
              </p>
            </article>
            <article>
              <h3>Or replaces it altogether</h3>
              <p>
                When you are ready, Caddie becomes the system of record: CRM,
                patient portal and operating system in one. We migrate your
                contacts and conversations during onboarding.
              </p>
            </article>
          </div>
        </section>

        {/* The master table */}
        <section className="section">
          <div className="vs-table">
            <div className="vs-table-head">
              <span className="vs-label" aria-hidden="true"></span>
              <span>Traditional CRMs</span>
              <span>Caddie</span>
            </div>
            {genericRows.map((r) => (
              <div key={r.label} className="vs-table-row">
                <span className="vs-label">{r.label}</span>
                <span>{r.them}</span>
                <span>{r.caddie}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Built for healthcare */}
        <VsClinicFeatures />

        {/* Per-competitor pages */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide">
            <span className="eyebrow">On one of these already?</span>
            <h2>See the comparison for your exact platform.</h2>
          </div>
          <div className="vs-links">
            {competitors.map((c) => (
              <Link key={c.slug} href={`/vs/${c.slug}`} className="vs-link-card">
                <strong>Caddie vs. {c.name}</strong>
                <span>{c.heroSub}</span>
                <em>See the full comparison &rarr;</em>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="vs-cta">
            <div>
              <h2>See the difference on your own pipeline.</h2>
              <p>
                Book a demo and watch Caddie work your real leads while your
                current CRM watches them sit.
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
