import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({
    where: { status: { in: ["AVAILABLE", "RESERVED", "SOLD"] }, publishedAt: { not: null } },
    select: { slug: true, updatedAt: true },
  });

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
