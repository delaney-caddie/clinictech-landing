"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export default function TravelConciergePage() {
  const [view, setView] = useState<"patient" | "admin">("patient");

  return (
    <>
      <style>{`
        .tc-page { min-height: 100vh; background: #fff; }

        /* Hero */
        .tc-hero {
          padding: 180px 0 100px;
          background: linear-gradient(180deg, #FAFBFD 0%, #fff 100%);
        }
        .tc-hero-inner {
          max-width: 800px; margin: 0 auto; padding: 0 24px; text-align: center;
        }
        .tc-hero-label {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1.5px; color: #5EC4E3; margin-bottom: 12px;
        }
        .tc-hero h1 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 44px; font-weight: 800; font-style: normal;
          color: #0F172A; line-height: 1.1; margin-bottom: 20px;
        }
        .tc-hero p {
          font-size: 17px; color: #64748B; line-height: 1.7; margin-bottom: 32px;
          max-width: 700px; margin-left: auto; margin-right: auto;
        }
        .tc-hero-cta {
          display: inline-flex; padding: 16px 36px;
          background: #5EC4E3; color: #fff; font-weight: 700; font-size: 16px;
          border-radius: 100px; text-decoration: none; transition: all 0.2s;
        }
        .tc-hero-cta:hover {
          background: #4AB8D9; box-shadow: 0 4px 16px rgba(20, 184, 166, 0.3);
          transform: translateY(-1px);
        }

        /* Section base */
        .tc-section {
          padding: 100px 0;
        }
        .tc-section.alt { background: #F8FAFC; }
        .tc-section-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 24px;
        }
        .tc-section-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
        }
        .tc-section-grid.reverse > :first-child { order: 2; }
        .tc-section-grid.reverse > :last-child { order: 1; }
        .tc-section-label {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1.5px; color: #5EC4E3; margin-bottom: 12px;
        }
        .tc-section h2 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 36px; font-weight: 800; font-style: normal;
          color: #0F172A; line-height: 1.15; margin-bottom: 16px;
        }
        .tc-section p.desc {
          font-size: 16px; line-height: 1.7; color: #64748B; margin-bottom: 24px;
        }

        /* Feature list */
        .tc-feature-list {
          display: flex; flex-direction: column; gap: 16px; margin-top: 24px;
        }
        .tc-feature-item {
          display: flex; gap: 12px; align-items: flex-start;
        }
        .tc-feature-icon {
          width: 36px; height: 36px; border-radius: 8px;
          background: rgba(20, 184, 166, 0.08);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; flex-shrink: 0;
        }
        .tc-feature-item h4 {
          font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 2px;
        }
        .tc-feature-item p {
          font-size: 12px; line-height: 1.5; color: #64748B;
        }

        /* Portal mockup */
        .tc-portal-mockup {
          background: #fff; border-radius: 12px; overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08); border: 1px solid #E2E8F0;
        }
        .tc-portal-toolbar {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 20px; background: #3730A3; color: #fff;
          font-size: 12px; font-weight: 700;
        }
        .tc-toolbar-dots { display: flex; gap: 5px; }
        .tc-toolbar-dots span { width: 8px; height: 8px; border-radius: 50%; }
        .tc-toolbar-dots span:nth-child(1) { background: #FF5F57; }
        .tc-toolbar-dots span:nth-child(2) { background: #FEBC2E; }
        .tc-toolbar-dots span:nth-child(3) { background: #28C840; }
        .tc-portal-toggle-wrap {
          padding: 12px 16px 0;
        }
        .tc-portal-toggle {
          display: flex; gap: 2px; background: #F1F5F9;
          border-radius: 8px; padding: 3px; width: fit-content;
        }
        .tc-portal-toggle-btn {
          padding: 6px 16px; border-radius: 6px;
          font-size: 11px; font-weight: 700; color: #94A3B8;
          background: transparent; border: none; cursor: pointer;
          transition: all 0.2s; font-family: inherit;
        }
        .tc-portal-toggle-btn.active {
          background: #5EC4E3; color: #fff;
        }

        /* Patient view */
        .tc-patient-body { padding: 20px; }
        .tc-patient-header {
          display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
        }
        .tc-patient-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(20, 184, 166, 0.08);
          display: flex; align-items: center; justify-content: center; font-size: 16px;
        }
        .tc-patient-greeting { font-size: 14px; font-weight: 700; color: #0F172A; }
        .tc-patient-sub { font-size: 10px; color: #94A3B8; }
        .tc-info-cards {
          display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
        }
        .tc-info-card {
          background: #fff; border-radius: 10px; padding: 12px;
          border: 1px solid #E2E8F0;
        }
        .tc-info-card-icon { font-size: 16px; margin-bottom: 6px; }
        .tc-info-card-label {
          font-size: 9px; text-transform: uppercase; color: #94A3B8;
          font-weight: 600; letter-spacing: 0.5px;
        }
        .tc-info-card-value { font-size: 12px; font-weight: 700; color: #0F172A; }
        .tc-timeline {
          margin-top: 12px; display: flex; flex-direction: column; gap: 8px;
        }
        .tc-timeline-title { font-size: 11px; font-weight: 700; margin-bottom: 4px; color: #0F172A; }
        .tc-timeline-item {
          display: flex; align-items: center; gap: 8px; font-size: 11px;
        }
        .tc-timeline-dot {
          width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
        }
        .tc-timeline-dot.completed { background: #22C55E; }
        .tc-timeline-dot.current { background: #5EC4E3; }
        .tc-timeline-dot.upcoming { background: #E2E8F0; }

        /* Admin view */
        .tc-admin-body { padding: 16px; }
        .tc-admin-stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 8px; margin-bottom: 12px;
        }
        .tc-admin-stat {
          background: #fff; border-radius: 8px; padding: 10px; text-align: center;
          border: 1px solid #E2E8F0;
        }
        .tc-admin-stat-value { font-size: 18px; font-weight: 800; color: #5EC4E3; }
        .tc-admin-stat-label { font-size: 9px; color: #94A3B8; text-transform: uppercase; }
        .tc-admin-table { width: 100%; }
        .tc-admin-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 10px; border-bottom: 1px solid #E2E8F0; font-size: 11px;
        }
        .tc-admin-row:last-child { border-bottom: none; }
        .tc-admin-name { font-weight: 700; color: #0F172A; }
        .tc-admin-status {
          font-size: 8px; font-weight: 700; padding: 2px 8px;
          border-radius: 100px; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .tc-admin-status.arriving { background: rgba(20, 184, 166, 0.1); color: #5EC4E3; }
        .tc-admin-status.in-treatment { background: rgba(34, 197, 94, 0.1); color: #22C55E; }
        .tc-admin-status.departing { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
        .tc-admin-status.pre-arrival { background: rgba(20, 184, 166, 0.06); color: #4AB8D9; }

        /* Pre-arrival timeline */
        .tc-arrival-mockup {
          background: #fff; border-radius: 12px; overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08); border: 1px solid #E2E8F0;
          padding: 28px;
        }
        .tc-arrival-title {
          font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 24px;
        }
        .tc-arrival-items { display: flex; flex-direction: column; gap: 0; }
        .tc-arrival-item {
          display: flex; gap: 16px; padding: 16px 0;
          border-bottom: 1px solid #F1F5F9;
        }
        .tc-arrival-item:last-child { border-bottom: none; }
        .tc-arrival-dot-col {
          display: flex; flex-direction: column; align-items: center; width: 20px;
        }
        .tc-arrival-dot {
          width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0;
        }
        .tc-arrival-dot.sent { background: #22C55E; }
        .tc-arrival-dot.scheduled { background: #5EC4E3; }
        .tc-arrival-dot.upcoming { background: #E2E8F0; }
        .tc-arrival-line {
          width: 2px; flex: 1; background: #E2E8F0; margin-top: 4px;
        }
        .tc-arrival-content { flex: 1; }
        .tc-arrival-time {
          font-size: 10px; font-weight: 700; color: #5EC4E3;
          text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;
        }
        .tc-arrival-label {
          font-size: 13px; font-weight: 700; color: #0F172A; margin-bottom: 2px;
        }
        .tc-arrival-desc { font-size: 11px; color: #94A3B8; line-height: 1.4; }

        /* Impact section */
        .tc-impact-section { padding: 80px 0; background: #fff; text-align: center; }
        .tc-impact-inner {
          max-width: 900px; margin: 0 auto; padding: 0 24px;
        }
        .tc-impact-stats {
          display: flex; gap: 24px; justify-content: center; flex-wrap: wrap;
        }
        .tc-impact-stat {
          background: #fff; border-radius: 12px; padding: 28px 36px;
          text-align: center; min-width: 180px; border: 1px solid #E2E8F0;
        }
        .tc-impact-stat-value {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 28px; font-weight: 800; color: #5EC4E3; margin-bottom: 4px;
        }
        .tc-impact-stat-label {
          font-size: 13px; color: #64748B; font-weight: 600;
        }

        /* Bottom CTA */
        .tc-bottom-cta {
          padding: 100px 24px; text-align: center;
        }
        .tc-bottom-cta-box {
          background: linear-gradient(135deg, #3730A3 0%, #1E293B 100%);
          border-radius: 24px; padding: 72px 48px; max-width: 900px;
          margin: 0 auto; position: relative; overflow: hidden;
        }
        .tc-bottom-cta-box::before {
          content: ''; position: absolute;
          top: -100px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(20, 184, 166, 0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .tc-bottom-cta-box h2 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 36px; font-weight: 800; font-style: normal;
          color: #fff; margin-bottom: 14px; position: relative;
        }
        .tc-bottom-cta-box p {
          font-size: 17px; color: rgba(255,255,255,0.7);
          margin-bottom: 32px; position: relative;
        }
        .tc-bottom-cta-box a {
          display: inline-flex; padding: 16px 40px;
          background: #5EC4E3; color: #fff; font-weight: 700;
          font-size: 16px; border-radius: 100px; text-decoration: none;
          transition: all 0.2s; position: relative;
        }
        .tc-bottom-cta-box a:hover {
          background: #4AB8D9; transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(20, 184, 166, 0.3);
        }

        /* Footer */
        .tc-footer {
          padding: 40px 24px; border-top: 1px solid #E2E8F0;
          display: flex; justify-content: space-between; align-items: center;
          max-width: 1100px; margin: 0 auto;
        }
        .tc-footer-links { display: flex; gap: 24px; }
        .tc-footer-links a { font-size: 13px; color: #94A3B8; text-decoration: none; }
        .tc-footer-links a:hover { color: #5EC4E3; }

        /* Responsive */
        @media (max-width: 900px) {
          .tc-section-grid { grid-template-columns: 1fr; gap: 40px; }
          .tc-section-grid.reverse > :first-child { order: 1; }
          .tc-section-grid.reverse > :last-child { order: 2; }
          .tc-hero h1 { font-size: 34px; }
          .tc-impact-stats { flex-direction: column; align-items: center; }
        }
        @media (max-width: 640px) {
          .tc-hero { padding: 140px 0 60px; }
          .tc-hero h1 { font-size: 28px; }
          .tc-hero p { font-size: 15px; }
          .tc-section { padding: 60px 0; }
          .tc-section h2 { font-size: 28px; }
          .tc-info-cards { grid-template-columns: 1fr; }
          .tc-admin-stats { grid-template-columns: 1fr 1fr; }
          .tc-bottom-cta-box { padding: 48px 24px; border-radius: 16px; }
          .tc-bottom-cta-box h2 { font-size: 26px; }
          .tc-footer { flex-direction: column; gap: 16px; text-align: center; }
        }
      `}</style>

      <div className="tc-page">
        <SiteNav />

        {/* Hero */}
        <section className="tc-hero">
          <div className="tc-hero-inner">
            <div className="tc-hero-label">Travel concierge platform</div>
            <h1>70% of your patients fly in. Their experience starts before they land.</h1>
            <p>International patients juggle flights, hotels, ground transportation, and pre-arrival paperwork across email chains and WhatsApp threads. ClinicTech gives them one place to manage everything, and gives your team one dashboard to track every arrival.</p>
            <a href="https://calendly.com/danika-clinictech/clinictech-1-hour-meeting-clone" target="_blank" rel="noopener noreferrer" className="tc-hero-cta">Book a discovery call</a>
          </div>
        </section>

        {/* Patient-Facing Portal */}
        <section className="tc-section alt">
          <div className="tc-section-inner">
            <div className="tc-section-grid">
              <div>
                <div className="tc-section-label">Patient Travel Hub</div>
                <h2>Everything your patient needs. One link.</h2>
                <p className="desc">Patients get a personalized travel hub with everything they need before arriving at your clinic. Recommended hotels, airport pickup scheduling, pre-arrival checklists, what to pack, local restaurant guides, and direct communication with your coordinator. No more answering the same 15 questions over WhatsApp.</p>
                <div className="tc-feature-list">
                  <div className="tc-feature-item">
                    <div className="tc-feature-icon">&#127976;</div>
                    <div>
                      <h4>Hotel recommendations</h4>
                      <p>Curated options near your clinic with your negotiated rates</p>
                    </div>
                  </div>
                  <div className="tc-feature-item">
                    <div className="tc-feature-icon">&#128663;</div>
                    <div>
                      <h4>Ground transportation</h4>
                      <p>Airport pickup scheduling with confirmed drivers</p>
                    </div>
                  </div>
                  <div className="tc-feature-item">
                    <div className="tc-feature-icon">&#128203;</div>
                    <div>
                      <h4>Pre-arrival checklist</h4>
                      <p>Medical questionnaire, packing list, preparation instructions</p>
                    </div>
                  </div>
                  <div className="tc-feature-item">
                    <div className="tc-feature-icon">&#128205;</div>
                    <div>
                      <h4>Local area guide</h4>
                      <p>Restaurants, pharmacies, and essentials near your clinic</p>
                    </div>
                  </div>
                  <div className="tc-feature-item">
                    <div className="tc-feature-icon">&#128172;</div>
                    <div>
                      <h4>Coordinator messaging</h4>
                      <p>Direct line to your team without WhatsApp chaos</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="tc-portal-mockup">
                  <div className="tc-portal-toolbar">
                    <div className="tc-toolbar-dots"><span></span><span></span><span></span></div>
                    Travel Concierge
                  </div>
                  <div className="tc-portal-toggle-wrap">
                    <div className="tc-portal-toggle">
                      <button className={`tc-portal-toggle-btn ${view === "patient" ? "active" : ""}`} onClick={() => setView("patient")}>Patient View</button>
                      <button className={`tc-portal-toggle-btn ${view === "admin" ? "active" : ""}`} onClick={() => setView("admin")}>Admin View</button>
                    </div>
                  </div>
                  {view === "patient" ? (
                    <div className="tc-patient-body">
                      <div className="tc-patient-header">
                        <div className="tc-patient-avatar">&#128100;</div>
                        <div>
                          <div className="tc-patient-greeting">Welcome, Sarah</div>
                          <div className="tc-patient-sub">Your trip to Stem Cell Clinic MX</div>
                        </div>
                      </div>
                      <div className="tc-info-cards">
                        <div className="tc-info-card">
                          <div className="tc-info-card-icon">&#9992;</div>
                          <div className="tc-info-card-label">Flight</div>
                          <div className="tc-info-card-value">AA 1247 &middot; Apr 15, 9:30am</div>
                        </div>
                        <div className="tc-info-card">
                          <div className="tc-info-card-icon">&#128663;</div>
                          <div className="tc-info-card-label">Airport Pickup</div>
                          <div className="tc-info-card-value">Confirmed &middot; Carlos M.</div>
                        </div>
                        <div className="tc-info-card">
                          <div className="tc-info-card-icon">&#127976;</div>
                          <div className="tc-info-card-label">Hotel</div>
                          <div className="tc-info-card-value">Grand Resort &middot; 2 nights</div>
                        </div>
                        <div className="tc-info-card">
                          <div className="tc-info-card-icon">&#127973;</div>
                          <div className="tc-info-card-label">Appointment</div>
                          <div className="tc-info-card-value">Apr 16, 10:00am &middot; Dr. Rivera</div>
                        </div>
                      </div>
                      <div className="tc-timeline">
                        <div className="tc-timeline-title">Your Timeline</div>
                        <div className="tc-timeline-item">
                          <div className="tc-timeline-dot completed"></div>
                          <span style={{color: "#22C55E", fontWeight: 600}}>Pre-arrival forms completed</span>
                        </div>
                        <div className="tc-timeline-item">
                          <div className="tc-timeline-dot completed"></div>
                          <span style={{color: "#22C55E", fontWeight: 600}}>Flight booked</span>
                        </div>
                        <div className="tc-timeline-item">
                          <div className="tc-timeline-dot current"></div>
                          <span>Airport pickup &middot; Apr 15</span>
                        </div>
                        <div className="tc-timeline-item">
                          <div className="tc-timeline-dot upcoming"></div>
                          <span>Treatment day &middot; Apr 16</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="tc-admin-body">
                      <div className="tc-admin-stats">
                        <div className="tc-admin-stat">
                          <div className="tc-admin-stat-value">12</div>
                          <div className="tc-admin-stat-label">Arriving</div>
                        </div>
                        <div className="tc-admin-stat">
                          <div className="tc-admin-stat-value">5</div>
                          <div className="tc-admin-stat-label">In Treatment</div>
                        </div>
                        <div className="tc-admin-stat">
                          <div className="tc-admin-stat-value">3</div>
                          <div className="tc-admin-stat-label">Departing</div>
                        </div>
                      </div>
                      <div style={{fontSize: "12px", fontWeight: 700, marginBottom: "8px", color: "#3730A3"}}>Patient Travel Status</div>
                      <div className="tc-admin-table">
                        <div className="tc-admin-row" style={{fontSize: "9px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase" as const, letterSpacing: "0.5px"}}>
                          <span>Patient</span><span>Flight</span><span>Transport</span><span>Status</span>
                        </div>
                        <div className="tc-admin-row">
                          <span className="tc-admin-name">Sarah M.</span>
                          <span>AA 1247</span>
                          <span>&#128663; Confirmed</span>
                          <span className="tc-admin-status arriving">Arriving</span>
                        </div>
                        <div className="tc-admin-row">
                          <span className="tc-admin-name">James K.</span>
                          <span>UA 892</span>
                          <span>&#128663; Confirmed</span>
                          <span className="tc-admin-status in-treatment">In Treatment</span>
                        </div>
                        <div className="tc-admin-row">
                          <span className="tc-admin-name">Maria L.</span>
                          <span>DL 445</span>
                          <span>&#128663; Scheduled</span>
                          <span className="tc-admin-status departing">Departing</span>
                        </div>
                        <div className="tc-admin-row">
                          <span className="tc-admin-name">David P.</span>
                          <span>SW 1102</span>
                          <span>&#128663; Pending</span>
                          <span className="tc-admin-status pre-arrival">Pre-Arrival</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Admin Dashboard */}
        <section className="tc-section">
          <div className="tc-section-inner">
            <div className="tc-section-grid reverse">
              <div>
                <div className="tc-section-label">Admin Dashboard</div>
                <h2>See every patient arrival at a glance.</h2>
                <p className="desc">Your travel coordinator gets a single dashboard showing who is arriving when, their flight details, hotel confirmations, pickup status, and any outstanding pre-arrival items. No spreadsheets. No digging through email chains.</p>
              </div>
              <div>
                <div className="tc-portal-mockup">
                  <div className="tc-portal-toolbar">
                    <div className="tc-toolbar-dots"><span></span><span></span><span></span></div>
                    Admin Dashboard - This Week
                  </div>
                  <div className="tc-admin-body">
                    <div className="tc-admin-stats">
                      <div className="tc-admin-stat">
                        <div className="tc-admin-stat-value">12</div>
                        <div className="tc-admin-stat-label">Arriving</div>
                      </div>
                      <div className="tc-admin-stat">
                        <div className="tc-admin-stat-value">5</div>
                        <div className="tc-admin-stat-label">In Treatment</div>
                      </div>
                      <div className="tc-admin-stat">
                        <div className="tc-admin-stat-value">3</div>
                        <div className="tc-admin-stat-label">Departing</div>
                      </div>
                    </div>
                    <div style={{fontSize: "12px", fontWeight: 700, marginBottom: "8px", color: "#3730A3"}}>Outstanding Items</div>
                    <div className="tc-admin-table">
                      <div className="tc-admin-row">
                        <span className="tc-admin-name">David P.</span>
                        <span style={{color: "#EF4444", fontWeight: 600, fontSize: "10px"}}>Missing medical form</span>
                      </div>
                      <div className="tc-admin-row">
                        <span className="tc-admin-name">Karen R.</span>
                        <span style={{color: "#F59E0B", fontWeight: 600, fontSize: "10px"}}>Hotel not confirmed</span>
                      </div>
                      <div className="tc-admin-row">
                        <span className="tc-admin-name">Tom B.</span>
                        <span style={{color: "#F59E0B", fontWeight: 600, fontSize: "10px"}}>Pickup pending</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pre-Arrival Sequences */}
        <section className="tc-section alt">
          <div className="tc-section-inner">
            <div className="tc-section-grid">
              <div>
                <div className="tc-section-label">Automated Sequences</div>
                <h2>The right information at the right time.</h2>
                <p className="desc">7 days before arrival: preparation instructions and what to expect. 3 days before: hotel confirmation and transportation details. Day of: pickup time and clinic address with directions. Every touchpoint is automatic. Every patient feels taken care of.</p>
              </div>
              <div>
                <div className="tc-arrival-mockup">
                  <div className="tc-arrival-title">Pre-Arrival Sequence</div>
                  <div className="tc-arrival-items">
                    <div className="tc-arrival-item">
                      <div className="tc-arrival-dot-col">
                        <div className="tc-arrival-dot sent"></div>
                        <div className="tc-arrival-line"></div>
                      </div>
                      <div className="tc-arrival-content">
                        <div className="tc-arrival-time">7 Days Before</div>
                        <div className="tc-arrival-label">Preparation Instructions</div>
                        <div className="tc-arrival-desc">What to expect, what to pack, dietary instructions, medication adjustments</div>
                      </div>
                    </div>
                    <div className="tc-arrival-item">
                      <div className="tc-arrival-dot-col">
                        <div className="tc-arrival-dot sent"></div>
                        <div className="tc-arrival-line"></div>
                      </div>
                      <div className="tc-arrival-content">
                        <div className="tc-arrival-time">3 Days Before</div>
                        <div className="tc-arrival-label">Travel Confirmations</div>
                        <div className="tc-arrival-desc">Hotel booking confirmed, airport pickup scheduled, local area guide</div>
                      </div>
                    </div>
                    <div className="tc-arrival-item">
                      <div className="tc-arrival-dot-col">
                        <div className="tc-arrival-dot scheduled"></div>
                        <div className="tc-arrival-line"></div>
                      </div>
                      <div className="tc-arrival-content">
                        <div className="tc-arrival-time">Day Of</div>
                        <div className="tc-arrival-label">Arrival Day Details</div>
                        <div className="tc-arrival-desc">Pickup time, driver name, clinic address with directions, coordinator contact</div>
                      </div>
                    </div>
                    <div className="tc-arrival-item">
                      <div className="tc-arrival-dot-col">
                        <div className="tc-arrival-dot upcoming"></div>
                      </div>
                      <div className="tc-arrival-content">
                        <div className="tc-arrival-time">Post-Treatment</div>
                        <div className="tc-arrival-label">Departure and Follow-Up</div>
                        <div className="tc-arrival-desc">Return transportation, post-care instructions, follow-up appointment scheduling</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact */}
        <section className="tc-impact-section">
          <div className="tc-impact-inner">
            <div className="tc-impact-stats">
              <div className="tc-impact-stat">
                <div className="tc-impact-stat-value">22 hrs/wk</div>
                <div className="tc-impact-stat-label">Saved in coordinator time</div>
              </div>
              <div className="tc-impact-stat">
                <div className="tc-impact-stat-value">+34%</div>
                <div className="tc-impact-stat-label">Increase in patient satisfaction scores</div>
              </div>
              <div className="tc-impact-stat">
                <div className="tc-impact-stat-value">Fewer</div>
                <div className="tc-impact-stat-label">No-shows, confused patients, and frantic day-of calls</div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="tc-bottom-cta">
          <div className="tc-bottom-cta-box">
            <h2>See the travel concierge in action with your clinic&apos;s branding.</h2>
            <p>Book a demo and we&apos;ll walk you through both the patient portal and admin dashboard, customized for your clinic.</p>
            <a href="https://calendly.com/danika-clinictech/clinictech-1-hour-meeting-clone" target="_blank" rel="noopener noreferrer">Book a Demo</a>
          </div>
        </section>

        <div className="tc-footer">
          <Link href="/">
            <img src="/clinictech-logo.png" alt="ClinicTech" style={{ height: 20, opacity: 0.5 }} />
          </Link>
          <div className="tc-footer-links">
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
