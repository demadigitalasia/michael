import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ISR klasik (revalidate) dipakai untuk katalog — cacheComponents dinonaktifkan */
  cacheComponents: false,
  images: {
    // Semua gambar dilayani lokal (/media/*, /products/*) — tanpa remote host
    // agar next/image tidak bisa dipakai sebagai open proxy optimasi.
    remotePatterns: [],
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
