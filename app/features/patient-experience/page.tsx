import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export const metadata = {
  title: "Patient Experience & Reengagement - ClinicTech",
  description: "Give every patient a modern, branded portal. Recovery protocols, results tracking, document sharing, and automated lifecycle sequences that drive retention.",
};

export default function PatientExperiencePage() {
  return (
    <>
      <style>{`
        .pe-page { min-height: 100vh; background: #fff; font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif; }

        /* Hero */
        .pe-hero {
          padding: 180px 0 100px;
          background: linear-gradient(180deg, #FAFBFD 0%, #fff 100%);
        }
        .pe-hero-inner {
          max-width: 800px; margin: 0 auto; padding: 0 24px; text-align: center;
        }
        .pe-hero-label {
          font-size: 12px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1.5px; color: #5EC4E3; margin-bottom: 12px;
        }
        .pe-hero h1 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 44px; font-weight: 800; font-style: normal;
          color: #0F172A; line-height: 1.1; margin-bottom: 20px;
        }
        .pe-hero p {
          font-size: 17px; color: #64748B; line-height: 1.7; margin-bottom: 32px;
          max-width: 700px; margin-left: auto; margin-right: auto;
        }
        .pe-hero-cta {
          display: inline-flex; padding: 16px 36px;
          background: #5EC4E3; color: #fff; font-weight: 700; font-size: 16px;
          border-radius: 100px; text-decoration: none; transition: all 0.2s;
        }
        .pe-hero-cta:hover {
          background: #4AB8D9; box-shadow: 0 4px 16px rgba(20, 184, 166, 0.3);
          transform: translateY(-1px);
        }

        /* Section base */
        .pe-section {
          padding: 100px 0;
        }
        .pe-section.alt { background: #F8FAFC; }
        .pe-section-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 24px;
        }
        .pe-section-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
        }
        .pe-section-grid.reverse > :first-child { order: 2; }
        .pe-section-grid.reverse > :last-child { order: 1; }
        .pe-section-label {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1.5px; color: #5EC4E3; margin-bottom: 12px;
        }
        .pe-section h2 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 36px; font-weight: 800; font-style: normal;
          color: #0F172A; line-height: 1.15; margin-bottom: 16px;
        }
        .pe-section p.desc {
          font-size: 16px; line-height: 1.7; color: #64748B; margin-bottom: 28px;
        }

        /* Feature breakouts */
        .pe-feature-cards {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 24px;
        }
        .pe-feature-card {
          background: #fff; border: 1px solid #E2E8F0; border-radius: 10px; padding: 24px;
          transition: all 0.3s;
        }
        .pe-feature-card:hover {
          transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        }
        .pe-feature-card h4 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; font-weight: 700; font-style: normal; color: #0F172A;
          margin-bottom: 8px; display: flex; align-items: center; gap: 8px;
        }
        .pe-feature-card p {
          font-size: 13px; line-height: 1.6; color: #64748B;
        }

        /* Portal Mockup */
        .pe-portal-mockup {
          background: #fff; border-radius: 12px; overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08); border: 1px solid #E2E8F0;
        }
        .pe-portal-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px; background: #5EC4E3; color: #fff;
        }
        .pe-portal-logo {
          display: flex; align-items: center; gap: 8px;
          font-size: 14px; font-weight: 700; font-style: normal;
        }
        .pe-portal-logo .logo-dot {
          width: 24px; height: 24px; border-radius: 6px;
          background: rgba(255,255,255,0.2); display: flex;
          align-items: center; justify-content: center;
          font-size: 10px; font-weight: 800;
        }
        .pe-portal-nav-links {
          display: flex; gap: 16px; font-size: 11px;
          color: rgba(255,255,255,0.6); font-weight: 600;
        }
        .pe-portal-body { padding: 24px; }
        .pe-portal-welcome {
          margin-bottom: 20px;
        }
        .pe-portal-welcome h3 {
          font-size: 18px; font-weight: 800; font-style: normal;
          color: #0F172A; margin-bottom: 4px;
        }
        .pe-portal-welcome p { font-size: 12px; color: #94A3B8; }
        .pe-portal-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
        }
        .pe-portal-card {
          background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px;
        }
        .pe-portal-card-icon { font-size: 18px; margin-bottom: 6px; }
        .pe-portal-card-label {
          font-size: 9px; text-transform: uppercase; color: #94A3B8;
          font-weight: 600; letter-spacing: 0.5px; margin-bottom: 2px;
        }
        .pe-portal-card-value {
          font-size: 12px; font-weight: 700; color: #0F172A;
        }
        .pe-portal-card-sub {
          font-size: 10px; color: #94A3B8; margin-top: 2px;
        }

        /* Results tracking mockup */
        .pe-results-mockup {
          background: #fff; border-radius: 12px; overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08); border: 1px solid #E2E8F0;
          padding: 28px;
        }
        .pe-results-title {
          font-size: 14px; font-weight: 700; font-style: normal; color: #0F172A; margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
        }
        .pe-results-chart {
          display: flex; align-items: flex-end; gap: 16px;
          height: 120px; padding: 0 8px; margin-bottom: 12px;
        }
        .pe-results-bar-group {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;
        }
        .pe-results-bar {
          width: 100%; border-radius: 6px 6px 0 0;
          background: linear-gradient(180deg, #5EC4E3, #5EEAD4);
          transition: height 0.3s;
        }
        .pe-results-bar-label {
          font-size: 9px; color: #94A3B8; font-weight: 600;
        }
        .pe-results-bar-value {
          font-size: 10px; font-weight: 700; color: #5EC4E3;
        }
        .pe-results-legend {
          display: flex; gap: 16px; font-size: 10px; color: #94A3B8;
          padding-top: 12px; border-top: 1px solid #E2E8F0;
        }
        .pe-results-legend-dot {
          display: inline-block; width: 8px; height: 8px; border-radius: 2px;
          margin-right: 4px;
        }

        /* Stats callouts */
        .pe-stat-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
          margin-top: 32px;
        }
        .pe-stat-card {
          background: #fff; border: 1px solid #E2E8F0; border-radius: 10px; padding: 24px;
          text-align: center;
        }
        .pe-stat-card .stat-value {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 28px; font-weight: 800; font-style: normal; color: #5EC4E3; margin-bottom: 4px;
        }
        .pe-stat-card .stat-label {
          font-size: 13px; color: #64748B; line-height: 1.4;
        }

        /* Timeline mockup */
        .pe-timeline-mockup {
          background: #fff; border-radius: 12px; overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08); border: 1px solid #E2E8F0;
          padding: 28px;
        }
        .pe-timeline-title {
          font-size: 14px; font-weight: 700; font-style: normal; color: #0F172A; margin-bottom: 24px;
        }
        .pe-timeline-items { display: flex; flex-direction: column; gap: 0; }
        .pe-timeline-item {
          display: flex; gap: 16px; padding: 16px 0;
          border-bottom: 1px solid #E2E8F0;
        }
        .pe-timeline-item:last-child { border-bottom: none; }
        .pe-timeline-dot-col {
          display: flex; flex-direction: column; align-items: center; width: 20px;
        }
        .pe-timeline-dot {
          width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0;
        }
        .pe-timeline-dot.active { background: #5EC4E3; }
        .pe-timeline-dot.future { background: #E2E8F0; }
        .pe-timeline-line {
          width: 2px; flex: 1; background: #E2E8F0; margin-top: 4px;
        }
        .pe-timeline-content { flex: 1; }
        .pe-timeline-time {
          font-size: 10px; font-weight: 700; color: #5EC4E3;
          text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;
        }
        .pe-timeline-label {
          font-size: 13px; font-weight: 700; font-style: normal; color: #0F172A; margin-bottom: 2px;
        }
        .pe-timeline-desc {
          font-size: 11px; color: #94A3B8; line-height: 1.4;
        }

        /* Reengagement section */
        .pe-reengage-stat {
          background: #fff; border: 1px solid #E2E8F0; border-radius: 10px; padding: 24px 28px;
          border-left: 4px solid #5EC4E3; margin-top: 24px;
        }
        .pe-reengage-stat .stat-value {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 24px; font-weight: 800; font-style: normal; color: #5EC4E3; margin-bottom: 4px;
        }
        .pe-reengage-stat .stat-text {
          font-size: 14px; color: #64748B; line-height: 1.5;
        }

        /* Math section */
        .pe-math-section {
          padding: 80px 0; background: #F8FAFC; text-align: center;
        }
        .pe-math-inner {
          max-width: 700px; margin: 0 auto; padding: 0 24px;
        }
        .pe-math-inner h2 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 32px; font-weight: 800; font-style: normal;
          color: #0F172A; margin-bottom: 16px; line-height: 1.2;
        }
        .pe-math-inner p {
          font-size: 17px; line-height: 1.7; color: #64748B;
        }

        /* Bottom CTA */
        .pe-bottom-cta {
          padding: 100px 24px; text-align: center;
        }
        .pe-bottom-cta-box {
          background: linear-gradient(135deg, #0F766E 0%, #5EC4E3 100%);
          border-radius: 24px; padding: 72px 48px; max-width: 900px;
          margin: 0 auto; position: relative; overflow: hidden;
        }
        .pe-bottom-cta-box::before {
          content: ''; position: absolute;
          top: -100px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 60%);
          pointer-events: none;
        }
        .pe-bottom-cta-box h2 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 36px; font-weight: 800; font-style: normal;
          color: #fff; margin-bottom: 14px; position: relative;
        }
        .pe-bottom-cta-box p {
          font-size: 17px; color: rgba(255,255,255,0.7);
          margin-bottom: 32px; position: relative;
        }
        .pe-bottom-cta-box a {
          display: inline-flex; padding: 16px 40px;
          background: #fff; color: #0F766E; font-weight: 700;
          font-size: 16px; border-radius: 100px; text-decoration: none;
          transition: all 0.2s; position: relative;
        }
        .pe-bottom-cta-box a:hover {
          background: #F0FDFA; transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }

        /* Footer */
        .pe-footer {
          padding: 40px 24px; border-top: 1px solid #E2E8F0;
          display: flex; justify-content: space-between; align-items: center;
          max-width: 1100px; margin: 0 auto;
        }
        .pe-footer-links { display: flex; gap: 24px; }
        .pe-footer-links a { font-size: 13px; color: #94A3B8; text-decoration: none; }
        .pe-footer-links a:hover { color: #5EC4E3; }

        /* Responsive */
        @media (max-width: 900px) {
          .pe-section-grid { grid-template-columns: 1fr; gap: 40px; }
          .pe-section-grid.reverse > :first-child { order: 1; }
          .pe-section-grid.reverse > :last-child { order: 2; }
          .pe-hero h1 { font-size: 34px; }
          .pe-stat-row { grid-template-columns: 1fr; }
          .pe-feature-cards { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .pe-hero { padding: 140px 0 60px; }
          .pe-hero h1 { font-size: 28px; }
          .pe-hero p { font-size: 15px; }
          .pe-section { padding: 60px 0; }
          .pe-section h2 { font-size: 28px; }
          .pe-portal-grid { grid-template-columns: 1fr; }
          .pe-bottom-cta-box { padding: 48px 24px; border-radius: 16px; }
          .pe-bottom-cta-box h2 { font-size: 26px; }
          .pe-math-inner h2 { font-size: 26px; }
          .pe-footer { flex-direction: column; gap: 16px; text-align: center; }
        }
      `}</style>

      <div className="pe-page">
        <SiteNav />

        {/* Hero */}
        <section className="pe-hero">
          <div className="pe-hero-inner">
            <div className="pe-hero-label">Patient Experience Platform</div>
            <h1>The patient experience doesn&apos;t end when they leave your clinic.</h1>
            <p>Your patients just spent $15,000 on a procedure. They&apos;re navigating recovery protocols, tracking how they feel week over week, and wondering if this is working. Most clinics hand them a printed sheet and say &ldquo;call us if you need anything.&rdquo; ClinicTech gives every patient a modern, branded portal that keeps them connected to your clinic through every phase of their journey.</p>
            <a href="https://calendly.com/danika-clinictech/clinictech-1-hour-meeting-clone" target="_blank" rel="noopener noreferrer" className="pe-hero-cta">Book a Discovery Call</a>
          </div>
        </section>

        {/* Patient Portal */}
        <section className="pe-section alt">
          <div className="pe-section-inner">
            <div className="pe-section-grid">
              <div>
                <div className="pe-section-label">Patient Portal</div>
                <h2>One place for everything. Branded as your clinic.</h2>
                <p className="desc">Patients log into a portal that looks and feels like your clinic, not a generic health app. Treatment details, recovery protocols, upcoming appointments, documents, and direct messaging with your team. Everything they need is in one place, accessible from their phone. No digging through email for that PDF your coordinator sent three weeks ago.</p>
                <div className="pe-feature-cards">
                  <div className="pe-feature-card">
                    <h4>Recovery Protocols &amp; Post-Care</h4>
                    <p>Step-by-step post-treatment instructions organized by treatment type. Day 1 looks different from Week 4. Patients always know what to do and when.</p>
                  </div>
                  <div className="pe-feature-card">
                    <h4>Results Tracking</h4>
                    <p>Patients log pain levels, mobility, energy, and quality of life over time. They see their progress visualized. Your team sees the same data for informed follow-ups.</p>
                  </div>
                  <div className="pe-feature-card">
                    <h4>Document Sharing</h4>
                    <p>Lab results, imaging, consent forms, treatment summaries, supplement protocols. Shared securely instead of emailed as attachments or handed over on paper.</p>
                  </div>
                  <div className="pe-feature-card">
                    <h4>Direct Messaging</h4>
                    <p>Patients message your team directly through the portal. Organized, trackable, and professional. No texts to personal phones or buried emails.</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="pe-portal-mockup">
                  <div className="pe-portal-nav">
                    <div className="pe-portal-logo">
                      <div className="logo-dot">Y</div>
                      Your Clinic Portal
                    </div>
                    <div className="pe-portal-nav-links">
                      <span>My Treatment</span>
                      <span>Documents</span>
                      <span>Messages</span>
                    </div>
                  </div>
                  <div className="pe-portal-body">
                    <div className="pe-portal-welcome">
                      <h3>Welcome back, Sarah</h3>
                      <p>Stem Cell Therapy / Knee / Day 14 of recovery</p>
                    </div>
                    <div className="pe-portal-grid">
                      <div className="pe-portal-card">
                        <div className="pe-portal-card-label">Today&apos;s Protocol</div>
                        <div className="pe-portal-card-value">Light walking, ice 2x</div>
                        <div className="pe-portal-card-sub">Week 2 of recovery plan</div>
                      </div>
                      <div className="pe-portal-card">
                        <div className="pe-portal-card-label">Pain Level Trend</div>
                        <div className="pe-portal-card-value" style={{color: "#5EC4E3"}}>7 to 3 (improving)</div>
                        <div className="pe-portal-card-sub">Down 57% since treatment</div>
                      </div>
                      <div className="pe-portal-card">
                        <div className="pe-portal-card-label">Next Appointment</div>
                        <div className="pe-portal-card-value">Apr 22 - Follow-up</div>
                        <div className="pe-portal-card-sub">Dr. Rivera - 10:00 AM</div>
                      </div>
                      <div className="pe-portal-card">
                        <div className="pe-portal-card-label">Documents</div>
                        <div className="pe-portal-card-value">3 new files</div>
                        <div className="pe-portal-card-sub">Lab results ready to view</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why This Matters */}
        <section className="pe-section">
          <div className="pe-section-inner">
            <div className="pe-section-grid reverse">
              <div>
                <div className="pe-section-label">Why This Matters</div>
                <h2>Patient satisfaction is your growth engine.</h2>
                <p className="desc">In regenerative medicine, your reputation IS your marketing. Patients who feel supported and informed through recovery become your best referral sources. Patients who feel abandoned after paying $15,000 become your worst reviews. The difference between a 5-star Google review and a BBB complaint is usually not the treatment outcome. It&apos;s the experience around it.</p>
                <div className="pe-stat-row">
                  <div className="pe-stat-card">
                    <div className="stat-value">3x</div>
                    <div className="stat-label">more likely to refer when patients feel informed during recovery</div>
                  </div>
                  <div className="pe-stat-card">
                    <div className="stat-value">72%</div>
                    <div className="stat-label">of patients say post-treatment communication is the biggest gap</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="pe-results-mockup">
                  <div className="pe-results-title">Sarah&apos;s Recovery Progress</div>
                  <div className="pe-results-chart">
                    <div className="pe-results-bar-group">
                      <div className="pe-results-bar-value">7/10</div>
                      <div className="pe-results-bar" style={{height: "70%"}}></div>
                      <div className="pe-results-bar-label">Week 1</div>
                    </div>
                    <div className="pe-results-bar-group">
                      <div className="pe-results-bar-value">5/10</div>
                      <div className="pe-results-bar" style={{height: "50%"}}></div>
                      <div className="pe-results-bar-label">Week 2</div>
                    </div>
                    <div className="pe-results-bar-group">
                      <div className="pe-results-bar-value">3/10</div>
                      <div className="pe-results-bar" style={{height: "30%"}}></div>
                      <div className="pe-results-bar-label">Week 4</div>
                    </div>
                    <div className="pe-results-bar-group">
                      <div className="pe-results-bar-value">2/10</div>
                      <div className="pe-results-bar" style={{height: "20%"}}></div>
                      <div className="pe-results-bar-label">Week 8</div>
                    </div>
                    <div className="pe-results-bar-group">
                      <div className="pe-results-bar-value">1/10</div>
                      <div className="pe-results-bar" style={{height: "10%"}}></div>
                      <div className="pe-results-bar-label">Week 12</div>
                    </div>
                  </div>
                  <div className="pe-results-legend">
                    <span><span className="pe-results-legend-dot" style={{background: "linear-gradient(180deg, #5EC4E3, #5EEAD4)"}}></span> Pain Level (lower is better)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lifecycle Sequences */}
        <section className="pe-section alt">
          <div className="pe-section-inner">
            <div className="pe-section-grid">
              <div>
                <div className="pe-section-label">12-Month Lifecycle</div>
                <h2>Stay in their life without adding to your team&apos;s plate.</h2>
                <p className="desc">After treatment, patients enter a 12-month automated sequence that feels personal but runs itself. Post-procedure check-ins timed to recovery milestones. Educational content about complementary treatments. Testimonial requests sent when patients are seeing results and feeling great. Referral invitations when satisfaction peaks.</p>
                <div className="pe-feature-cards">
                  <div className="pe-feature-card">
                    <h4>Check-In Cadence</h4>
                    <p>Week 1, Week 4, Month 3, Month 6, Month 12. Each touchpoint tailored to where the patient is in recovery.</p>
                  </div>
                  <div className="pe-feature-card">
                    <h4>Testimonial Capture</h4>
                    <p>Automated requests timed to when patients are experiencing positive outcomes. A simple flow that captures their story.</p>
                  </div>
                  <div className="pe-feature-card">
                    <h4>Referral Program</h4>
                    <p>Happy patients refer friends and family. Automated invitations with tracking so you know which patients drive new business.</p>
                  </div>
                  <div className="pe-feature-card">
                    <h4>Treatment Education</h4>
                    <p>The patient who came in for knees doesn&apos;t know you also treat shoulders, hips, and autoimmune conditions. Targeted content expands lifetime value.</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="pe-timeline-mockup">
                  <div className="pe-timeline-title">12-Month Patient Lifecycle</div>
                  <div className="pe-timeline-items">
                    <div className="pe-timeline-item">
                      <div className="pe-timeline-dot-col">
                        <div className="pe-timeline-dot active"></div>
                        <div className="pe-timeline-line"></div>
                      </div>
                      <div className="pe-timeline-content">
                        <div className="pe-timeline-time">Week 1</div>
                        <div className="pe-timeline-label">Post-Treatment Check-In</div>
                        <div className="pe-timeline-desc">How are you feeling? Any questions about recovery?</div>
                      </div>
                    </div>
                    <div className="pe-timeline-item">
                      <div className="pe-timeline-dot-col">
                        <div className="pe-timeline-dot active"></div>
                        <div className="pe-timeline-line"></div>
                      </div>
                      <div className="pe-timeline-content">
                        <div className="pe-timeline-time">Week 4</div>
                        <div className="pe-timeline-label">Progress Check + Education</div>
                        <div className="pe-timeline-desc">Recovery milestone content + complementary treatments info</div>
                      </div>
                    </div>
                    <div className="pe-timeline-item">
                      <div className="pe-timeline-dot-col">
                        <div className="pe-timeline-dot active"></div>
                        <div className="pe-timeline-line"></div>
                      </div>
                      <div className="pe-timeline-content">
                        <div className="pe-timeline-time">Month 3</div>
                        <div className="pe-timeline-label">Testimonial Request</div>
                        <div className="pe-timeline-desc">Patients seeing results - capture their story</div>
                      </div>
                    </div>
                    <div className="pe-timeline-item">
                      <div className="pe-timeline-dot-col">
                        <div className="pe-timeline-dot future"></div>
                        <div className="pe-timeline-line"></div>
                      </div>
                      <div className="pe-timeline-content">
                        <div className="pe-timeline-time">Month 6</div>
                        <div className="pe-timeline-label">Referral Program Invite</div>
                        <div className="pe-timeline-desc">Satisfaction peaks - invite them to refer</div>
                      </div>
                    </div>
                    <div className="pe-timeline-item">
                      <div className="pe-timeline-dot-col">
                        <div className="pe-timeline-dot future"></div>
                      </div>
                      <div className="pe-timeline-content">
                        <div className="pe-timeline-time">Month 12</div>
                        <div className="pe-timeline-label">Annual Check-In + Reengagement</div>
                        <div className="pe-timeline-desc">New treatments, follow-up options, wellness check</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reengagement */}
        <section className="pe-section">
          <div className="pe-section-inner">
            <div style={{maxWidth: 700}}>
              <div className="pe-section-label">Reengagement Campaigns</div>
              <h2>Bring back the patients you&apos;ve already won.</h2>
              <p className="desc">Every clinic has hundreds of past patients sitting in a spreadsheet or old CRM who haven&apos;t been contacted in months. ClinicTech identifies dormant patients and runs targeted reengagement campaigns: new treatment announcements, seasonal wellness check-ins, and &ldquo;how are you feeling?&rdquo; sequences. These patients already trust you. They just need a reason to come back.</p>
              <div className="pe-reengage-stat">
                <div className="stat-value">40% increase in returning patients</div>
                <div className="stat-text">with automated reengagement.</div>
              </div>
            </div>
          </div>
        </section>

        {/* The Math */}
        <section className="pe-math-section">
          <div className="pe-math-inner">
            <h2>A single returning patient is worth $5,000-$25,000 in additional revenue with zero acquisition cost.</h2>
            <p>How many past patients are sitting in your database right now?</p>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="pe-bottom-cta">
          <div className="pe-bottom-cta-box">
            <h2>See the patient portal live with your clinic&apos;s branding.</h2>
            <p>Book a 15-minute demo. We&apos;ll show you exactly how your patients will experience recovery, results tracking, and ongoing engagement.</p>
            <a href="https://calendly.com/danika-clinictech/clinictech-1-hour-meeting-clone" target="_blank" rel="noopener noreferrer">Book a 15-Minute Demo</a>
          </div>
        </section>

        <div className="pe-footer">
          <Link href="/">
            <img src="/clinictech-logo.png" alt="ClinicTech" style={{ height: 20, opacity: 0.5 }} />
          </Link>
          <div className="pe-footer-links">
            <Link href="/features">Features</Link>
            <Link href="/about">About</Link>
            <Link href="/blog">Blog</Link>
            <a href="#">Privacy</a>
          </div>
        </div>
      </div>
    </>
  );
}
