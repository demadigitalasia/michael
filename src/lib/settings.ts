import { prisma } from "@/lib/prisma";

export type SiteSettings = {
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  googleSiteVerification: string;
  instagramUrl: string;
};

/** Ambil pengaturan situs (single-row, lazy create). Tidak pernah throw. */
export async function getSettings(): Promise<SiteSettings> {
  const fallback: SiteSettings = {
    metaTitle: "",
    metaDescription: "",
    ogImageUrl: "",
    googleSiteVerification: "",
    instagramUrl: "",
  };
  try {
    const s = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    if (s) return s;
    return await prisma.siteSettings.create({ data: { id: "singleton" } });
  } catch {
    return fallback; // DB down saat build/dev — fallback default
  }
}
