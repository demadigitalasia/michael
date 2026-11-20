import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // DB tak selalu ter-reach saat prerender — fallback hanya halaman statis
  let products: Array<{ slug: string; updatedAt: Date }> = [];
  try {
    products = await prisma.product.findMany({
      where: { status: { in: ["AVAILABLE", "RESERVED", "SOLD"] }, publishedAt: { not: null } },
      select: { slug: true, updatedAt: true },
    });
  } catch (e) {
    console.error("[sitemap] DB tidak ter-reach saat prerender:", e instanceof Error ? e.message : e);
  }

  const staticPages = ["", "/shop", "/collections", "/custom", "/the-workshop", "/care", "/journal", "/contact", "/material-studies", "/privacy", "/terms"].map((p) => ({
    url: `${site.url}${p}`,
    lastModified: new Date(),
    changeFrequency: p === "" ? ("daily" as const) : ("weekly" as const),
    priority: p === "" ? 1 : 0.7,
  }));

  return [
    ...staticPages,
    ...products.map((p) => ({
      url: `${site.url}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
