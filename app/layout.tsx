import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "ClinicTech — We build AI employees for your clinic",
  description: "We learn how your regen clinic actually runs, start you with proven AI agents, and build custom ones as you grow.",
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
    <html lang="en" className={`${plusJakarta.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
        <Analytics />
        <div id="clinictech-widget" data-widget-id="17af3dba-6740-4133-a6cd-804de4a6a281" data-host="https://app.clinictech.io"></div>
        <script src="https://app.clinictech.io/embed-widget.js" async></script>
        <div id="clinictech-form" data-form-id="6c1b45ad-f597-4fb3-a1c5-d1a31e91ef8f" data-host="https://app.clinictech.io" data-mode="popup" data-button-text="Book a Consultation" data-button-color="#2563eb" style={{display: "none"}}></div>
        <script src="https://app.clinictech.io/embed-form.js" async></script>
      </body>
    </html>
  );
}
