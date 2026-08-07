import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { agents, getAgent, CALENDAR_URL } from "@/lib/agents";
import { RetellVoiceWidget, VoiceDemoButton } from "@/components/retell-voice-widget";
import "../agents.css";

export function generateStaticParams() {
  return agents.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) return {};
  return {
    title: `${agent.name}, ${agent.role} | Caddie`,
    description: agent.summary,
  };
}

export default async function AgentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) notFound();

  const teammates = agents.filter((a) => a.slug !== agent.slug);
  const metricCols =
    agent.metrics.length === 1 ? "cols-1" : agent.metrics.length === 2 ? "cols-2" : "";

  return (
    <div
      className="ct-page"
      style={{
        ["--agent-color" as string]: agent.color,
        ["--agent-bg" as string]: agent.bg,
        ["--agent-edge" as string]: agent.bgEdge,
        ["--agent-role" as string]: agent.roleColor,
      } as React.CSSProperties}
    >
      <SiteNav />
      <main>
        {/* Hero */}
        <section className="agent-hero">
          <div className="agent-hero-panel">
            <div>
              <span className="agent-hero-role">{agent.role}</span>
              <h1>{agent.name}</h1>
              <p className="agent-tagline">&ldquo;{agent.tagline}&rdquo;</p>
              <div className="agent-hero-actions">
                <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
                  Book a demo
                </a>
              </div>
            </div>
            <img
              className="agent-hero-portrait"
              src={agent.portrait}
              alt={`${agent.name}, ${agent.role}`}
            />
          </div>
        </section>

        {/* Live voice demo (Retell widget, currently Mia only) */}
        {agent.voiceDemo && (
          <section className="section agent-voice" id="voice-demo">
            <div className="agent-voice-card">
              <div className="agent-voice-kicker">
                <span className="agent-voice-live">Live demo</span>
              </div>
              <h2>Talk to {agent.name} right now.</h2>
              <p>
                A real conversation, in your browser. Start the call, allow microphone access
                when prompted, and ask {agent.name} anything a patient would ask.
              </p>
              <VoiceDemoButton agentName={agent.name} />
              <p className="agent-voice-fineprint">
                {agent.name} does not diagnose, give medical advice, quote exact pricing, or
                interpret test results. Anything in that territory she gently routes back to the
                clinical team.
              </p>
            </div>
          </section>
        )}

        {/* What they do + what they handle */}
        <section className="section agent-section-grid">
          <div className="section-copy">
            <span className="eyebrow">What {agent.name} does</span>
            <h2>The work, off your team&apos;s plate.</h2>
            <p>{agent.summary}</p>
          </div>
          <ul className="agent-handle-list">
            {agent.handles.map((h) => (
              <li key={h}>
                <span className="agent-handle-check">&#10003;</span>
                {h}
              </li>
            ))}
          </ul>
        </section>

        {/* Metrics */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide">
            <span className="eyebrow">The metrics {agent.name} moves</span>
            <h2>Results you can measure.</h2>
          </div>
          <div className={`agent-metric-grid ${metricCols}`}>
            {agent.metrics.map((m) => (
              <div key={m} className="agent-metric">{m}</div>
            ))}
          </div>
        </section>

        {/* Without / With */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-copy wide">
            <span className="eyebrow">Caddie vs. the status quo</span>
            <h2>Life without {agent.name}, and life with {agent.name}.</h2>
          </div>
          <div className="agent-compare">
            <div className="agent-compare-head">
              <span>Without {agent.name}</span>
              <span>With {agent.name}</span>
            </div>
            {agent.comparison.map((row) => (
              <div key={row.without} className="agent-compare-row">
                <span>
                  <span className="agent-compare-mark" aria-hidden="true">&#10005;</span>
                  {row.without}
                </span>
                <span>
                  <span className="agent-compare-mark" aria-hidden="true">&#10003;</span>
                  {row.with}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Team handoff */}
        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <section className="agent-team-note">
            <span className="eyebrow">How {agent.name} works with the team</span>
            <h2>One brain. One team.</h2>
            <p>{agent.teamNote}</p>
            <div className="agent-team-others">
              {teammates.map((t) => (
                <Link key={t.slug} href={`/ai-employees/${t.slug}`}>
                  <img src={t.portrait} alt="" loading="lazy" />
                  {t.name}
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <section className="emp-closing">
            <div>
              <h2>Put {agent.name} to work at your clinic.</h2>
              <p>
                See {agent.name} running on your clinic&apos;s real pipeline.{" "}
                It starts with a short conversation.
              </p>
            </div>
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
              Book a demo
            </a>
          </section>
        </div>
      </main>
      <SiteFooter />

      {/* Mounts the Retell voice widget and its floating call button. */}
      {agent.voiceDemo && <RetellVoiceWidget />}
    </div>
  );
}
