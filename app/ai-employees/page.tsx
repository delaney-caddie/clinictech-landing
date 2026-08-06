import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { agents, CALENDAR_URL } from "@/lib/agents";
import "./agents.css";

export const metadata = {
  title: "AI Employees | Caddie",
  description:
    "Meet the team of AI employees running clinic front offices around the clock. Hire the ones you need. Each is built on your company brain and gets to work from day one.",
};

export default function AiEmployeesIndexPage() {
  return (
    <div className="ct-page">
      <SiteNav />
      <main>
        <section className="emp-hero">
          <span className="eyebrow">AI Employees</span>
          <h1>Meet your AI employees.</h1>
          <p>
            A team built to run your front office around the clock. Hire the ones you
            need. Each is built on your company brain and gets to work from day one.
          </p>
          <div className="emp-hero-actions">
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
              Book a demo
            </a>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 28 }}>
          <div className="emp-grid">
            {agents.map((a) => (
              <Link
                key={a.slug}
                href={`/ai-employees/${a.slug}`}
                className="emp-card"
                style={{
                  ["--agent-color" as string]: a.color,
                  ["--agent-edge" as string]: a.bgEdge,
                  ["--agent-role" as string]: a.roleColor,
                } as React.CSSProperties}
              >
                <img src={a.portrait} alt={`${a.name}, ${a.role}`} />
                <div className="emp-card-body">
                  <strong>{a.name}</strong>
                  <span className="emp-card-role">{a.role}</span>
                  <span className="emp-card-quote">&ldquo;{a.cardLine}&rdquo;</span>
                  <span className="emp-card-more">Learn more &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <section className="emp-closing">
            <div>
              <h2>Do not see the role you need?</h2>
              <p>
                We build new AI employees around the problems clinics bring us. Tell us
                where your clinic loses the most time.
              </p>
            </div>
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
              Book a demo
            </a>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
