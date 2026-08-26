import Link from "next/link";
import { agents } from "@/lib/agents";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <img src="/caddie-logo.svg" alt="Caddie" style={{ height: 38, width: "auto" }} />
        <p>
          An agentic CRM and operating system for clinics, with a team of AI
          employees built in that runs your front office around the clock.
        </p>
        <div className="footer-social">
          <a
            href="https://www.linkedin.com/company/caddieai/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Caddie on LinkedIn"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.44v6.3zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/caddie.ai/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Caddie on Instagram"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.39C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.39 2.12.66.67 1.33 1.09 2.12 1.39.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.12-1.39.67-.66 1.09-1.33 1.39-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.39-2.12C21.32 1.35 20.65.93 19.86.63 19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0z" />
              <path d="M12 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4z" />
              <circle cx="18.41" cy="5.59" r="1.44" />
            </svg>
          </a>
        </div>
      </div>
      <nav className="footer-group" aria-label="Platform">
        <h2>Platform</h2>
        <Link href="/platform">The platform</Link>
        <Link href="/platform#crm">Agentic CRM</Link>
        <Link href="/platform#portal">Patient Portal</Link>
        <Link href="/platform#os">Operating System</Link>
        <Link href="/platform#brain">Company Brain</Link>
      </nav>
      <nav className="footer-group" aria-label="AI Employees">
        <h2>AI Employees</h2>
        {agents.map((a) => (
          <Link key={a.slug} href={`/ai-employees/${a.slug}`}>
            {a.name}
          </Link>
        ))}
      </nav>
      <nav className="footer-group" aria-label="Company">
        <h2>Company</h2>
        <Link href="/about">About</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/integrations">Integrations</Link>
        <Link href="/ai-vs-humans">Safety &amp; HIPAA</Link>
        <Link href="/contact">Contact</Link>
      </nav>
      <nav className="footer-group" aria-label="Caddie vs. traditional CRMs">
        <h2>Caddie vs. traditional CRMs</h2>
        <Link href="/vs">Why clinics switch</Link>
        <Link href="/vs/hubspot">Caddie vs. HubSpot</Link>
        <Link href="/vs/gohighlevel">Caddie vs. GoHighLevel</Link>
        <Link href="/vs/zoho">Caddie vs. Zoho</Link>
      </nav>
      <nav className="footer-group" aria-label="Legal">
        <h2>Legal</h2>
        <Link href="/privacy">Privacy policy</Link>
        <Link href="/terms">Terms of service</Link>
      </nav>
      <div className="footer-bottom">
        <span>&copy; 2026 Caddie. All rights reserved.</span>
        <span>{agents.map((a) => a.name).join(". ")}.</span>
      </div>
    </footer>
  );
}
