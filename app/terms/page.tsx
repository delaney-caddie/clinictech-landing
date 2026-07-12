import { SiteNav } from "@/components/site-nav";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service - Caddie AI Inc.",
  description: "Caddie AI Inc. terms of service. Messaging program terms, opt-out instructions, and usage guidelines.",
};

export default function TermsPage() {
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
            <h1>Terms of Service</h1>
            <p>Last updated: April 28, 2026</p>
          </div>
        </div>
        <div className="legal-content">
          <h2>Agreement to Terms</h2>
          <p>By accessing or using Caddie AI Inc.&apos;s website (hirecaddie.ai), platform (app.clinictech.io), or any related services (collectively, the &ldquo;Services&rdquo;), you agree to be bound by these Terms of Service. The Services are operated by Caddie AI Inc.</p>

          <h2>Description of Services</h2>
          <p>Caddie AI Inc. provides a CRM and patient engagement platform for regenerative medicine and wellness clinics. Our Services include smart intake forms, automated follow-up sequences, patient portals, review generation, online scheduling, and travel concierge tools.</p>

          <h2>SMS Messaging Program</h2>
          <h3>Program name</h3>
          <p>Caddie AI Inc. Patient Messaging</p>

          <h3>Program description</h3>
          <p>Caddie AI Inc. sends text messages on behalf of regenerative medicine and wellness clinics to their patients and leads. Messages include appointment reminders, lead follow-ups, intake form links, treatment information, and post-treatment check-ins.</p>

          <h3>Consent</h3>
          <p>By providing your phone number and checking the SMS consent checkbox on an intake form or website contact form powered by Caddie AI Inc., or during a clinic consultation, you consent to receive text messages from Caddie AI Inc. or the clinic you are engaging with. Consent is not required as a condition of purchasing any goods or services.</p>

          <h3>Message frequency</h3>
          <p>Message frequency varies based on your interactions with the clinic. You may receive between 2 and 8 messages per month.</p>

          <h3>Message and data rates</h3>
          <p>Message and data rates may apply. Your carrier&apos;s standard messaging and data rates apply to all text messages sent and received.</p>

          <h3>Opt-out</h3>
          <p>You can opt out of text messages at any time by replying <strong>STOP</strong> to any message you receive. After opting out, you will receive a single confirmation message and will not receive further texts unless you opt in again.</p>

          <h3>Help</h3>
          <p>For help with text messaging, reply <strong>HELP</strong> to any message, or contact us at <a href="mailto:contact@hirecaddie.ai">contact@hirecaddie.ai</a>.</p>

          <h3>Supported carriers</h3>
          <p>Messages are sent via standard SMS through supported US carriers. Carrier support may vary.</p>

          <h3>Privacy</h3>
          <p>Your phone number and SMS consent information will not be shared with third parties for their marketing purposes. See our <Link href="/privacy">Privacy Policy</Link> for full details on how we handle your data.</p>

          <h2>User Accounts</h2>
          <p>When you create an account, you are responsible for maintaining the security of your credentials and for all activity under your account. You must notify us immediately of any unauthorized use.</p>

          <h2>Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Services for any unlawful purpose</li>
            <li>Send unsolicited messages (spam) through the platform</li>
            <li>Attempt to gain unauthorized access to any part of the Services</li>
            <li>Interfere with or disrupt the Services or servers</li>
            <li>Violate any applicable local, state, national, or international law</li>
          </ul>

          <h2>Intellectual Property</h2>
          <p>The Services, including all content, features, and functionality, are owned by Caddie AI Inc. and are protected by copyright, trademark, and other intellectual property laws.</p>

          <h2>Disclaimer of Warranties</h2>
          <p>The Services are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, either express or implied. We do not warrant that the Services will be uninterrupted, error-free, or secure.</p>

          <h2>Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, Caddie AI Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Services.</p>

          <h2>HIPAA</h2>
          <p>Caddie AI Inc. implements security measures aligned with HIPAA requirements. Clinics using our platform to handle protected health information (PHI) should contact us to execute a Business Associate Agreement (BAA).</p>

          <h2>Termination</h2>
          <p>We may terminate or suspend your access to the Services at any time, with or without cause, with or without notice. Upon termination, your right to use the Services will immediately cease.</p>

          <h2>Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on this page. Continued use of the Services after changes constitutes acceptance of the new Terms.</p>

          <h2>Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the Province of Ontario, Canada, without regard to its conflict of law provisions.</p>

          <h2>Contact Us</h2>
          <p>If you have questions about these Terms, contact us at:</p>
          <p>
            Caddie AI Inc.<br/>
            Email: <a href="mailto:contact@hirecaddie.ai">contact@hirecaddie.ai</a><br/>
            Website: <a href="https://hirecaddie.ai">hirecaddie.ai</a>
          </p>
        </div>
        <div className="legal-footer">
          <span>&copy; 2026 Caddie AI Inc.</span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/">Home</Link>
          </div>
        </div>
      </div>
    </>
  );
}
