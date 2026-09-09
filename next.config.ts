import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Old routes from the pre-platform site. Permanent so search engines
    // carry any equity over to the new pages.
    return [
      { source: "/features", destination: "/products", permanent: true },
      { source: "/features/:slug", destination: "/products", permanent: true },
      // The repositioning retired the platform, agent and comparison pages.
      { source: "/platform", destination: "/products", permanent: true },
      { source: "/ai-employees", destination: "/products", permanent: true },
      { source: "/ai-employees/:slug*", destination: "/products", permanent: true },
      { source: "/vs", destination: "/products", permanent: true },
      { source: "/vs/:slug", destination: "/products", permanent: true },
      // The blog was retired pending a replacement, so these point at the
      // homepage rather than at /blog, which no longer exists.
      { source: "/regen-news", destination: "/", permanent: true },
      // The standalone voice demo now lives on Mia's own page.
      { source: "/voice-agent-demo", destination: "/products", permanent: true },
      { source: "/blog", destination: "/", permanent: false },
      { source: "/blog/:slug", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
