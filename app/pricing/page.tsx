import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PlaybookPanel } from "@/components/playbook-panel";
import { agents, getAgent, CALENDAR_URL } from "@/lib/agents";

export const metadata = {
  title: "Pricing | Caddie",
  description:
    "Flexible pricing, built around your clinic. Only pay for the AI employees you want. Start with one, or hire a full team. Your plan flexes as your clinic grows.",
};

const mia = getAgent("mia")!;

const options = [
  {
    title: "A la carte",
    body: "Hire a single AI employee for the role where your clinic loses the most time. Add more whenever you are ready.",
    visual: "single" as const,
  },
  {
    title: "The full AI team",
    body: "The whole team running your front office together: inquiries, inbox, socials, SEO, protocols, retention and sales support.",
    visual: "team" as const,
  },
  {
    title: "Custom AI employees for your practice",
    body: "We work with your team to build one-off agents for the specific use cases your clinic needs.",
    visual: "custom" as const,
  },
];

export default function PricingPage() {
  return (
    <div className="ct-page">
      <style>{`
.pricing-hero {
  max-width: 820px; margin: 0 auto;
  padding: clamp(56px, 8vw, 96px) 24px 0; text-align: center;
}
.pricing-hero h1 { margin-left: auto; margin-right: auto; }
.pricing-hero p { font-size: 1.06rem; max-width: 620px; margin: 0 auto; }
.pricing-points {
  gap: var(--grid-gap); display: grid; grid-template-columns: repeat(3, 1fr);
  margin-top: 52px;
}
.pricing-point {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg);
  box-shadow: var(--shadow-xs); padding: var(--card-pad); text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  transition: border-color .2s ease, box-shadow .2s ease, transform .2s var(--ease);
}
.pricing-point:hover { border-color: var(--line-strong); box-shadow: var(--shadow-md); transform: translateY(-2px); }
.pricing-visual { min-height: 96px; display: flex; align-items: center; justify-content: center; }
.pricing-avatar {
  width: 84px; height: 84px; border-radius: 999px; object-fit: cover;
  border: 2.5px solid var(--agent-edge, var(--line-strong));
  background: var(--agent-bg, var(--wash));
  box-shadow: var(--shadow-sm);
}
.pricing-team { display: flex; }
.pricing-team img {
  width: 52px; height: 52px; border-radius: 999px; object-fit: cover;
  border: 2px solid #fff; box-shadow: var(--shadow-sm);
}
.pricing-team img + img { margin-left: -14px; }
.pricing-custom { display: flex; align-items: center; }
.pricing-custom img {
  width: 52px; height: 52px; border-radius: 999px; object-fit: cover;
  border: 2px solid #fff; box-shadow: var(--shadow-sm); opacity: .55;
}
.pricing-custom img + img { margin-left: -14px; }
.pricing-custom-plus {
  width: 52px; height: 52px; border-radius: 999px; margin-left: -14px; flex: none;
  background: var(--surface); border: 2px dashed var(--line-strong);
  color: var(--blue); font-size: 1.4rem; font-weight: 600;
  display: grid; place-items: center; position: relative; z-index: 1;
}
/* Scoped with .ct-page so it outranks the global paragraph margin reset. */
.ct-page .pricing-included {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  width: fit-content; max-width: 100%; margin: 32px auto 0;
  background: var(--blue-wash); border: 1px solid #dde6f8; border-radius: 999px;
  color: var(--blue-ink); padding: 13px 24px;
  font-size: .96rem; font-weight: 560; text-align: center;
}
.ct-page .pricing-included::before {
  content: "\\2713"; flex: none;
  width: 20px; height: 20px; border-radius: 999px;
  background: var(--mint); color: #14684a;
  font-size: .68rem; font-weight: 700; line-height: 1;
  display: flex; align-items: center; justify-content: center;
}
.pricing-point h3 { margin-bottom: 0; font-size: 1.18rem; }
.pricing-point p { margin-bottom: 0; font-size: .94rem; flex: 1; }
.pricing-point .button { margin-top: 8px; }
@media (max-width: 1020px) {
  .pricing-points { grid-template-columns: 1fr; }
}
      `}</style>
      <SiteNav />
      <main>
        <section className="pricing-hero">
          <span className="eyebrow">Pricing</span>
          <h1>Flexible pricing, built around your clinic.</h1>
          <p>
            Caddie is priced so you only pay for the AI employees you want. Start with
            one, or hire a full team. Your plan flexes as your clinic grows.
          </p>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="pricing-points">
            {options.map((o) => (
              <article key={o.title} className="pricing-point">
                <div className="pricing-visual">
                  {o.visual === "single" && (
                    <img
                      className="pricing-avatar"
                      src={mia.portrait}
                      alt={`${mia.name}, ${mia.role}`}
                      style={{
                        ["--agent-edge" as string]: mia.bgEdge,
                        ["--agent-bg" as string]: mia.bg,
                      } as React.CSSProperties}
                    />
                  )}
                  {o.visual === "team" && (
                    <div className="pricing-team">
                      {agents.map((a) => (
                        <img key={a.slug} src={a.portrait} alt={a.name} title={a.name} />
                      ))}
                    </div>
                  )}
                  {o.visual === "custom" && (
                    <div className="pricing-custom">
                      <img src={mia.portrait} alt="" aria-hidden="true" />
                      <img src={getAgent("atlas")!.portrait} alt="" aria-hidden="true" />
                      <span className="pricing-custom-plus" aria-label="Your custom agent">+</span>
                    </div>
                  )}
                </div>
                <h3>{o.title}</h3>
                <p>{o.body}</p>
                <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="button">
                  Speak to the team
                </a>
              </article>
            ))}
          </div>
          <p className="pricing-included">
            Every agent comes with your own custom clinic CRM and Operating System.
          </p>
        </section>

        <PlaybookPanel />
      </main>
      <SiteFooter />
    </div>
  );
}
