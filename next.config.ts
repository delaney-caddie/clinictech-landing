import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Old routes from the pre-platform site. Permanent so search engines
    // carry any equity over to the new pages.
    return [
      { source: "/features", destination: "/platform", permanent: true },
      { source: "/features/ai-employees", destination: "/ai-employees", permanent: true },
      { source: "/features/lead-capture", destination: "/platform", permanent: true },
      { source: "/features/patient-experience", destination: "/platform", permanent: true },
      { source: "/features/travel-concierge", destination: "/platform", permanent: true },
      // The blog was retired pending a replacement, so these point at the
      // homepage rather than at /blog, which no longer exists.
      { source: "/regen-news", destination: "/", permanent: true },
      { source: "/blog", destination: "/", permanent: false },
      { source: "/blog/:slug", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
