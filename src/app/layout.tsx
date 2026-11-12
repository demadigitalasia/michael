import type { Metadata } from "next";
import { Antonio, Geist, Geist_Mono } from "next/font/google";
import { getSettings } from "@/lib/settings";
import { site } from "@/lib/site";
import "./globals.css";

const antonio = Antonio({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-antonio",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Metadata global — kini dikontrol dari admin Settings (fallback ke nilai default). */
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const title = s.metaTitle || "Michael Lapidary · One stone at a time";
  const description =
    s.metaDescription ||
    "Cabochons, slabs and rough cut by hand from semi-precious stone. Custom pendants, matched pairs, carvings and intarsia — cut at our bench, shipped insured worldwide.";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: "%s · Michael Lapidary",
    },
    description,
    openGraph: {
      type: "website",
      siteName: site.name,
      url: siteUrl,
      title,
      description,
      images: s.ogImageUrl ? [{ url: s.ogImageUrl }] : undefined,
    },
    verification: s.googleSiteVerification
      ? { google: s.googleSiteVerification }
      : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${antonio.variable} ${geist.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
