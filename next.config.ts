import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // CSP frame-ancestors takes precedence over the X-Frame-Options: DENY that Catalyst Slate adds by default.
          { key: "Content-Security-Policy", value: "frame-ancestors 'self' https://*.onslate.in" },
        ],
      },
    ];
  },
};

export default nextConfig;
