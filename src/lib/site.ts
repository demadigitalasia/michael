export const site = {
  name: "Michael Lapidary",
  shortName: "MICHAEL LAPIDARY",
  tagline: "CUT BY HAND / KEPT FOR LIFE.",
  description:
    "Cabochons, slabs and rough cut by hand from semi-precious stone. One stone at a time at our bench.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: process.env.ADMIN_EMAIL ?? "hello@michaellapidary.com",
  /** Reservasi item saat masuk cart/checkout (PRD §6.3) */
  reservationMinutes: 30,
} as const;

export const categories = [
  { slug: "cabochons", label: "Cabochons", key: "CABOCHON" },
  { slug: "slabs", label: "Slabs", key: "SLAB" },
  { slug: "rough", label: "Rough", key: "ROUGH" },
  { slug: "finished-pieces", label: "Finished pieces", key: "FINISHED_PIECE" },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export function categoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function formatUsd(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}
