import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ISR klasik (revalidate) dipakai untuk katalog — cacheComponents dinonaktifkan */
  cacheComponents: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
