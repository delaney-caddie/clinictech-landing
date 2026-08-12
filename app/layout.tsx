import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { ChatWidget } from "@/components/chat-widget";
import AdsTracking from "@/components/ads-tracking";
import "./globals.css";

// OpenAI ads pixel. `debug: true` logs pixel activity to the browser console so
// you can verify it fires; set it to false once the campaign is confirmed live.
const OAIQ_PIXEL_ID = "Q7jZAvziW4BW326qSLUh2Z";

// Meta (Facebook/Instagram) ads pixel.
const META_PIXEL_ID = "2123085865271776";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const SITE_URL = "https://caddie.app";
const TITLE = "Caddie | AI Employees Scaling Your Clinic 24/7";
const DESCRIPTION =
  "Caddie is an agentic CRM and operating system for clinics, with a team of AI employees built in that runs your front office around the clock.";

export const metadata: Metadata = {
  // Without metadataBase, Next resolves the social preview image against
  // localhost, so shared links render with no image at all.
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Caddie",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Calendly popup widget styles (used by the "Book a demo" buttons) */}
        <link
          rel="stylesheet"
          href="https://assets.calendly.com/assets/external/widget.css"
        />
      </head>
      <body className="font-sans antialiased">
        {/* OpenAI ads pixel: loads the oaiq SDK and initializes the pixel. */}
        <Script id="oaiq-base" strategy="afterInteractive">
          {`!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");oaiq("init",{pixelId:"${OAIQ_PIXEL_ID}",debug:true});`}
        </Script>
        {/* Meta ads pixel: loads fbevents.js and fires the first PageView.
            Client-side route changes do not re-run this script, so subsequent
            PageViews are fired from AdsTracking. */}
        <Script id="meta-pixel-base" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
        {/* Calendly popup widget script. */}
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="afterInteractive"
        />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
        <AdsTracking />
        <Analytics />
        <ChatWidget />
        <div id="clinictech-form" data-form-id="6c1b45ad-f597-4fb3-a1c5-d1a31e91ef8f" data-host="https://app.clinictech.io" data-mode="popup" data-button-text="Book a Consultation" data-button-color="#2563eb" style={{display: "none"}}></div>
        <Script src="https://app.clinictech.io/embed-form.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
