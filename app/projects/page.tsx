import { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "Projects - ClinicTech",
  description: "Detailed examples of what we've built for regenerative medicine clinics, with screenshots, metrics, and impact.",
};

export default function ProjectsPage() {
  return (
    <>
      <style>{`
        .projects-hero {
          padding: 180px 0 60px;
          text-align: center;
        }
        .projects-hero h1 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 44px;
          font-weight: 800;
          font-style: normal;
          color: #1A1A2E;
          margin-bottom: 16px;
        }
        .projects-hero p {
          font-size: 18px;
          color: #4A4A65;
          max-width: 600px;
          margin: 0 auto 48px;
          line-height: 1.7;
        }
        .projects-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 24px 120px;
        }
        .project-card {
          background: #F5F5F7;
          border-radius: 20px;
          padding: 36px;
          transition: all 0.3s;
        }
        .project-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        }
        .project-type {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #0E9AC0;
          margin-bottom: 12px;
        }
        .project-card h2 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #1A1A2E;
          margin-bottom: 12px;
        }
        .project-card p {
          font-size: 14px;
          line-height: 1.7;
          color: #4A4A65;
          margin-bottom: 20px;
        }
        .project-metrics {
          display: flex;
          gap: 20px;
          padding-top: 16px;
          border-top: 1px solid #E5E5EA;
        }
        .project-metric-value {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #22C55E;
        }
        .project-metric-label {
          font-size: 11px;
          color: #8888A0;
          font-weight: 600;
        }
        .projects-cta {
          text-align: center;
          padding: 0 24px 100px;
        }
        .projects-cta p {
          font-size: 17px;
          color: #4A4A65;
          margin-bottom: 24px;
        }
        .projects-cta a {
          display: inline-flex;
          padding: 14px 32px;
          background: #3730A3;
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .projects-cta a:hover {
          background: #4338CA;
          box-shadow: 0 4px 16px rgba(55, 48, 163, 0.3);
        }
        @media (max-width: 768px) {
          .projects-grid { grid-template-columns: 1fr; }
          .projects-hero h1 { font-size: 32px; }
        }
      `}</style>
      <SiteNav />
      <div className="projects-hero">
        <h1>What we&apos;ve built.</h1>
        <p>Detailed examples of each product we&apos;ve built for regenerative medicine clinics, with screenshots, metrics, and impact on the business.</p>
      </div>
      <div className="projects-grid">
        <div className="project-card">
          <div className="project-type">Website + Intake Flow</div>
          <h2>Single-Location Clinic Redesign</h2>
          <p>Rebuilt the website and intake flow for a Mexico-based stem cell clinic. Smart forms, auto-scheduling, and condition-based follow-up sequences replaced a generic contact form.</p>
          <div className="project-metrics">
            <div>
              <div className="project-metric-value">2.1% → 7.2%</div>
              <div className="project-metric-label">Conversion rate</div>
            </div>
            <div>
              <div className="project-metric-value">+$138k/mo</div>
              <div className="project-metric-label">Revenue</div>
            </div>
          </div>
        </div>
        <div className="project-card">
          <div className="project-type">Travel Concierge Platform</div>
          <h2>Multi-Location Travel Portal</h2>
          <p>Built a patient-facing travel portal and admin dashboard for a 3-location clinic network. Patients manage flights, hotels, and logistics. The team tracks every arrival from one view.</p>
          <div className="project-metrics">
            <div>
              <div className="project-metric-value">22 hrs/wk</div>
              <div className="project-metric-label">Time saved</div>
            </div>
            <div>
              <div className="project-metric-value">+34%</div>
              <div className="project-metric-label">Patient satisfaction</div>
            </div>
          </div>
        </div>
        <div className="project-card">
          <div className="project-type">Centralized CRM + Routing</div>
          <h2>50+ Location Intake System</h2>
          <p>Centralized intake with multi-location routing, patient CRM, and automated reengagement campaigns for a large clinic network across North America.</p>
          <div className="project-metrics">
            <div>
              <div className="project-metric-value">94%</div>
              <div className="project-metric-label">Routing accuracy</div>
            </div>
            <div>
              <div className="project-metric-value">+$2.1M</div>
              <div className="project-metric-label">Revenue</div>
            </div>
          </div>
        </div>
        <div className="project-card">
          <div className="project-type">Website + Back Office</div>
          <h2>US Clinic with Mexico Treatments</h2>
          <p>Website redesign and custom patient CRM that replaced spreadsheets, GoHighLevel, and email. Automated follow-up workflows brought back returning patients.</p>
          <div className="project-metrics">
            <div>
              <div className="project-metric-value">18 hrs/wk</div>
              <div className="project-metric-label">Admin saved</div>
            </div>
            <div>
              <div className="project-metric-value">+28%</div>
              <div className="project-metric-label">Returning patients</div>
            </div>
          </div>
        </div>
      </div>
      <div className="projects-cta">
        <p>Want to see what we&apos;d build for your clinic?</p>
        <a href="https://calendar.app.google/YvNVdxRdiXVhjXQDA" target="_blank" rel="noopener noreferrer">Book a Discovery Call</a>
      </div>
    </>
  );
}
