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
        <Link href="/contact">Contact</Link>
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
