import type { Metadata } from "next";
import { Antonio, Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Michael Lapidary · One stone at a time",
    template: "%s · Michael Lapidary",
  },
  description:
    "Cabochons, slabs and rough cut by hand from semi-precious stone. Custom pendants, matched pairs, carvings and intarsia — cut at our bench, shipped insured worldwide.",
  openGraph: {
    type: "website",
    siteName: "Michael Lapidary",
    url: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${antonio.variable} ${geist.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
