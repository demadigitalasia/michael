import { prisma } from "@/lib/prisma";
import type { Prisma, Category } from "@prisma/client";
import { conceptListingWhere, physicalListingWhere } from "@/lib/product-listing";

/**
 * Status efektif item one-of-a-kind (PRD §6.3):
 * RESERVED dengan reservedUntil kedaluwarsa = otomatis tersedia lagi (tanpa cron).
 */
export function effectiveStatus(p: { status: string; reservedUntil: Date | null }): string {
  if (p.status === "RESERVED" && p.reservedUntil && p.reservedUntil <= new Date()) return "AVAILABLE";
  return p.status;
}

const publicWhere: Prisma.ProductWhereInput = {
  status: { in: ["AVAILABLE", "RESERVED", "SOLD"] },
  publishedAt: { not: null },
};

/** DB tak selalu ter-reach saat build (prerender di container tanpa akses DB) —
 * fallback data kosong; ISR revalidate mengisi saat request pertama setelah live.
 * Pola yang sama dengan lib/settings.ts. */
async function safeDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.error("[db] query gagal saat prerender — fallback kosong:", e instanceof Error ? e.message : e);
    return fallback;
  }
}

export async function listProducts(opts?: {
  category?: string;
  limit?: number;
  excludeSold?: boolean;
  conceptOnly?: boolean;
}) {
  const listingType = opts?.conceptOnly ? conceptListingWhere : physicalListingWhere;
  const where: Prisma.ProductWhereInput = { ...publicWhere, ...listingType };
  if (opts?.category) where.category = opts.category as Category;
  if (opts?.excludeSold) where.status = { in: ["AVAILABLE", "RESERVED"] };
  return safeDb(
    () =>
      prisma.product.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        take: opts?.limit,
        include: { images: { orderBy: { sortOrder: "asc" } } },
      }),
    [],
  );
}

export async function getFeatured() {
  // Homepage hanya menampilkan stone yang benar-benar AVAILABLE
  const p = await safeDb(
    () =>
      prisma.product.findFirst({
        where: { ...publicWhere, ...physicalListingWhere, featured: true, status: "AVAILABLE" },
        include: { images: { orderBy: { sortOrder: "asc" } } },
      }),
    null,
  );
  if (p) return p;
  // fallback: produk terbaru yang masih tersedia
  return safeDb(
    () =>
      prisma.product.findFirst({
        where: { ...publicWhere, ...physicalListingWhere, status: "AVAILABLE" },
        orderBy: { publishedAt: "desc" },
        include: { images: { orderBy: { sortOrder: "asc" } } },
      }),
    null,
  );
}

export async function getProductBySlug(slug: string) {
  return safeDb(
    () =>
      prisma.product.findUnique({
        where: { slug },
        include: { images: { orderBy: { sortOrder: "asc" } } },
      }),
    null,
  );
}

export async function countByCategory() {
  const rows = await safeDb(
    () =>
      prisma.product.groupBy({
        by: ["category"],
        where: { ...publicWhere, ...physicalListingWhere, status: { in: ["AVAILABLE", "RESERVED"] } },
        _count: { _all: true },
      }),
    [] as Array<{ category: Category; _count: { _all: number } }>,
  );
  return Object.fromEntries(rows.map((r) => [r.category, r._count._all]));
}

export async function getRelated(product: { id: string; stoneType: string; category: string }, limit = 4) {
  const sameStone = await safeDb(
    () =>
      prisma.product.findMany({
        where: { ...publicWhere, ...physicalListingWhere, id: { not: product.id }, stoneType: product.stoneType },
        take: limit,
        include: { images: { orderBy: { sortOrder: "asc" } } },
      }),
    [],
  );
  if (sameStone.length >= limit) return sameStone;
  const sameCat = await safeDb(
    () =>
      prisma.product.findMany({
        where: {
          ...publicWhere,
          ...physicalListingWhere,
          id: { notIn: [product.id, ...sameStone.map((s) => s.id)] },
          category: product.category as Category,
        },
        take: limit - sameStone.length,
        include: { images: { orderBy: { sortOrder: "asc" } } },
      }),
    [],
  );
  return [...sameStone, ...sameCat];
}

export function getPublishedReviews(limit?: number) {
  return safeDb(
    () =>
      prisma.review.findMany({
        where: { published: true },
        orderBy: { createdAt: "asc" },
        ...(limit ? { take: limit } : {}),
      }),
    [],
  );
}
