import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
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
            Traditional CRMs were built to be databases your staff operates.
            Caddie was built to do the operating itself. Here is every
            difference that matters to a clinic, side by side.
          </p>
        </header>

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
