import { SiteNav } from "@/components/site-nav";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - Caddie AI Inc.",
  description: "Caddie AI Inc. privacy policy. Learn how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <style>{`
        .legal-page { min-height: 100vh; background: #fff; }
        .legal-hero { padding: 140px 0 40px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; }
        .legal-hero-inner { max-width: 720px; margin: 0 auto; padding: 0 24px; }
        .legal-hero h1 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 36px; font-weight: 800; color: #0F172A; margin-bottom: 8px;
        }
        .legal-hero p { font-size: 14px; color: #94A3B8; }
        .legal-content {
          max-width: 720px; margin: 0 auto; padding: 48px 24px 80px;
          font-size: 15px; line-height: 1.8; color: #475569;
        }
        .legal-content h2 {
          font-family: var(--font-jakarta), 'Plus Jakarta Sans', sans-serif;
          font-size: 22px; font-weight: 700; color: #0F172A;
          margin: 40px 0 12px; padding-top: 24px; border-top: 1px solid #F1F5F9;
        }
        .legal-content h2:first-child { margin-top: 0; border-top: none; padding-top: 0; }
        .legal-content h3 {
          font-size: 17px; font-weight: 700; color: #0F172A; margin: 24px 0 8px;
        }
        .legal-content p { margin-bottom: 16px; }
        .legal-content ul { margin: 0 0 16px 20px; }
        .legal-content li { margin-bottom: 8px; }
        .legal-content a { color: #3730A3; text-decoration: underline; }
        .legal-content strong { color: #0F172A; }
        .legal-footer {
          max-width: 720px; margin: 0 auto; padding: 32px 24px;
          border-top: 1px solid #E2E8F0; display: flex;
          justify-content: space-between; align-items: center;
          font-size: 12px; color: #94A3B8;
        }
        .legal-footer a { color: #64748B; text-decoration: none; margin-left: 16px; }
        .legal-footer a:hover { color: #3730A3; }
        @media (max-width: 640px) {
          .legal-hero { padding: 110px 0 32px; }
          .legal-hero h1 { font-size: 28px; }
        }
      `}</style>
      <div className="legal-page">
        <SiteNav />
        <div className="legal-hero">
          <div className="legal-hero-inner">
            <h1>Privacy Policy</h1>
            <p>Last updated: April 28, 2026</p>
          </div>
        </div>
        <div className="legal-content">
          <h2>Overview</h2>
          <p>Caddie AI Inc. (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the Services described below. This Privacy Policy describes how we collect, use, and share information when you use our website (hirecaddie.ai), our platform (app.clinictech.io), embedded forms, chat widgets, and related services (collectively, the &ldquo;Services&rdquo;).</p>

          <h2>Information We Collect</h2>
          <h3>Information you provide directly</h3>
          <ul>
            <li><strong>Contact information:</strong> Name, email address, phone number, and clinic name when you fill out a form, subscribe to our newsletter, or book a demo.</li>
            <li><strong>SMS consent:</strong> When you provide your phone number through a clinic intake form, website contact form, or during a clinic consultation and check the consent checkbox, you agree to receive text messages related to appointment reminders, lead follow-ups, intake form links, and treatment information.</li>
            <li><strong>Account information:</strong> Email and password when you create a Caddie AI Inc. account.</li>
            <li><strong>Communications:</strong> Messages you send through our chat widget, contact forms, or support channels.</li>
          </ul>
          <h3>Information collected automatically</h3>
          <ul>
            <li><strong>Usage data:</strong> Pages visited, time on site, clicks, device type, browser, and operating system.</li>
            <li><strong>Location data:</strong> Approximate location based on IP address (city, region, country). We do not collect precise GPS location.</li>
            <li><strong>Cookies and analytics:</strong> We use Vercel Analytics and may use cookies or similar technologies to understand how our Services are used.</li>
          </ul>
          <h3>Information collected on behalf of clinics</h3>
          <p>When clinics use Caddie AI Inc. to manage their patients, we process patient data (names, contact info, treatment details, travel logistics) on behalf of the clinic. In this case, the clinic is the data controller and we are the data processor. This data is governed by the clinic&apos;s own privacy policy and any agreements between the clinic and its patients.</p>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>To provide and improve our Services</li>
            <li>To send appointment reminders, intake form links, and treatment information via SMS (with your consent)</li>
            <li>To send follow-up messages about consultations you have requested</li>
            <li>To send our Regen News newsletter (if you subscribe)</li>
            <li>To respond to your inquiries and provide customer support</li>
            <li>To analyze usage patterns and improve our website and platform</li>
            <li>To detect and prevent fraud or abuse</li>
          </ul>

          <h2>SMS and Text Messaging</h2>
          <p>By providing your phone number and checking the consent checkbox on our intake forms or contact forms, you consent to receive text messages from Caddie AI Inc. or clinics using our platform. These messages may include:</p>
          <ul>
            <li>Appointment reminders and confirmations</li>
            <li>Lead follow-up messages related to your inquiry</li>
            <li>Links to intake forms and treatment information</li>
            <li>Post-treatment check-ins and recovery updates</li>
          </ul>
          <p><strong>Message frequency:</strong> Message frequency varies based on your interactions. Typically 2-8 messages per month.</p>
          <p><strong>Message and data rates may apply.</strong> Your carrier&apos;s standard messaging rates apply.</p>
          <p><strong>Opt-out:</strong> You can opt out of text messages at any time by replying <strong>STOP</strong> to any message. You will receive a confirmation that you have been unsubscribed.</p>
          <p><strong>Help:</strong> Reply <strong>HELP</strong> to any message for support information, or contact us at contact@hirecaddie.ai.</p>
          <p><strong>We do not share your phone number or SMS consent data with third parties for their marketing purposes.</strong></p>

          <h2>How We Share Information</h2>
          <p>We do not sell your personal information. We may share information in the following circumstances:</p>
          <ul>
            <li><strong>With clinics:</strong> When you submit an inquiry through a clinic&apos;s embedded form or chat widget, your information is shared with that clinic so they can respond to your inquiry.</li>
            <li><strong>Service providers:</strong> We use third-party services to help us operate (hosting, analytics, email delivery, SMS delivery). These providers only access data as needed to perform their services and are contractually bound to protect it.</li>
            <li><strong>Legal requirements:</strong> We may disclose information if required by law, court order, or governmental regulation.</li>
          </ul>

          <h2>Data Security</h2>
          <p>We use industry-standard security measures to protect your data, including encryption in transit (TLS) and at rest. Our platform infrastructure is hosted on secure cloud providers with SOC 2 compliance. However, no method of transmission or storage is 100% secure.</p>

          <h2>Data Retention</h2>
          <p>We retain your information for as long as your account is active or as needed to provide our Services. If you request deletion, we will remove your data within 30 days, except where we are required to retain it by law.</p>

          <h2>Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of marketing communications</li>
            <li>Opt out of text messages by replying STOP</li>
          </ul>
          <p>To exercise any of these rights, contact us at <a href="mailto:contact@hirecaddie.ai">contact@hirecaddie.ai</a>.</p>

          <h2>Children&apos;s Privacy</h2>
          <p>Our Services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children.</p>

          <h2>Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page with a new &ldquo;Last updated&rdquo; date.</p>

          <h2>Contact Us</h2>
          <p>If you have questions about this Privacy Policy, contact us at:</p>
          <p>
            Caddie AI Inc.<br/>
            Email: <a href="mailto:contact@hirecaddie.ai">contact@hirecaddie.ai</a><br/>
            Website: <a href="https://hirecaddie.ai">hirecaddie.ai</a>
          </p>
        </div>
        <div className="legal-footer">
          <span>&copy; 2026 Caddie AI Inc.</span>
          <div>
            <Link href="/terms">Terms</Link>
            <Link href="/">Home</Link>
          </div>
        </div>
      </div>
    </>
  );
}
