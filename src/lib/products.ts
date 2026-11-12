import { prisma } from "@/lib/prisma";
import type { Prisma, Category } from "@prisma/client";

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

export async function listProducts(opts?: {
  category?: string;
  limit?: number;
  excludeSold?: boolean;
}) {
  const where: Prisma.ProductWhereInput = { ...publicWhere };
  if (opts?.category) where.category = opts.category as Category;
  if (opts?.excludeSold) where.status = { in: ["AVAILABLE", "RESERVED"] };
  return prisma.product.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    take: opts?.limit,
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getFeatured() {
  // Homepage hanya menampilkan stone yang benar-benar AVAILABLE
  const p = await prisma.product.findFirst({
    where: { ...publicWhere, featured: true, status: "AVAILABLE" },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  if (p) return p;
  // fallback: produk terbaru yang masih tersedia
  return prisma.product.findFirst({
    where: { ...publicWhere, status: "AVAILABLE" },
    orderBy: { publishedAt: "desc" },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function countByCategory() {
  const rows = await prisma.product.groupBy({
    by: ["category"],
    where: { ...publicWhere, status: { in: ["AVAILABLE", "RESERVED"] } },
    _count: { _all: true },
  });
  return Object.fromEntries(rows.map((r) => [r.category, r._count._all]));
}

export async function getRelated(product: { id: string; stoneType: string; category: string }, limit = 4) {
  const sameStone = await prisma.product.findMany({
    where: { ...publicWhere, id: { not: product.id }, stoneType: product.stoneType },
    take: limit,
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  if (sameStone.length >= limit) return sameStone;
  const sameCat = await prisma.product.findMany({
    where: {
      ...publicWhere,
      id: { notIn: [product.id, ...sameStone.map((s) => s.id)] },
      category: product.category as Category,
    },
    take: limit - sameStone.length,
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  return [...sameStone, ...sameCat];
}

export function specLines(p: {
  lengthMm: number | null; widthMm: number | null; depthMm: number | null;
  weightCarat: number | null; weightGram: number | null; treatment: string; origin: string;
}): string[] {
  const lines: string[] = [];
  if (p.lengthMm && p.widthMm) {
    const dims = `${p.lengthMm} × ${p.widthMm}${p.depthMm ? ` × ${p.depthMm}` : ""} mm`;
    lines.push(dims);
  }
  if (p.weightCarat) lines.push(`${p.weightCarat} ct`);
  if (p.weightGram) lines.push(`${p.weightGram.toLocaleString("en-US")} g`);
  if (p.treatment) lines.push(p.treatment.toLowerCase().replace("_", " "));
  if (p.origin) lines.push(p.origin);
  return lines;
}
