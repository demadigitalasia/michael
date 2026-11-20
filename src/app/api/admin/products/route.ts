import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { cleanupMediaFiles } from "@/lib/media-cleanup";
import { z } from "zod";

const base = z.object({
  title: z.string().min(3).max(160),
  slug: z.string().min(3).max(160).regex(/^[a-z0-9-]+$/, "lowercase-and-dashes"),
  description: z.string().min(10).max(5000),
  category: z.enum(["CABOCHON", "SLAB", "ROUGH", "FINISHED_PIECE"]),
  stoneType: z.string().min(1).max(100),
  color: z.string().max(100).default(""),
  form: z.string().max(100).default(""),
  treatment: z.enum(["NATURAL", "DYED", "STABILIZED", "HEAT_TREATED", "OTHER"]),
  origin: z.string().max(160).default(""),
  lengthMm: z.number().nullable().optional(),
  widthMm: z.number().nullable().optional(),
  depthMm: z.number().nullable().optional(),
  weightCarat: z.number().nullable().optional(),
  weightGram: z.number().nullable().optional(),
  priceCents: z.number().int().min(0),
  status: z.enum(["DRAFT", "AVAILABLE", "RESERVED", "SOLD", "HIDDEN"]),
  isConcept: z.boolean().default(false),
  featured: z.boolean().default(false),
  metaTitle: z.string().max(70).default(""),
  metaDescription: z.string().max(160).default(""),
  images: z.array(z.object({ url: z.string(), alt: z.string().default("") })).min(1),
}).superRefine((product, ctx) => {
  if (!product.isConcept && product.status === "AVAILABLE" && product.weightGram == null && product.weightCarat == null) {
    ctx.addIssue({
      code: "custom",
      path: ["weightGram"],
      message: "Add a shipping weight before publishing a physical stone.",
    });
  }
});

const num = (v: FormDataEntryValue | null): number | null => {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

function parseForm(fd: FormData) {
  return base.parse({
    title: fd.get("title"),
    slug: String(fd.get("slug") ?? "").toLowerCase(),
    description: fd.get("description"),
    category: fd.get("category"),
    stoneType: fd.get("stoneType"),
    color: fd.get("color") ?? "",
    form: fd.get("form") ?? "",
    treatment: fd.get("treatment"),
    origin: fd.get("origin") ?? "",
    lengthMm: num(fd.get("lengthMm")),
    widthMm: num(fd.get("widthMm")),
    depthMm: num(fd.get("depthMm")),
    weightCarat: num(fd.get("weightCarat")),
    weightGram: num(fd.get("weightGram")),
    priceCents: Math.round(Number(fd.get("priceUsd") ?? 0) * 100),
    status: fd.get("status") ?? "DRAFT",
    isConcept: fd.get("isConcept") === "on",
    featured: fd.get("featured") === "on",
    metaTitle: String(fd.get("metaTitle") ?? "").trim(),
    metaDescription: String(fd.get("metaDescription") ?? "").trim(),
    images: JSON.parse(String(fd.get("images") ?? "[]")),
  });
}

async function guard() {
  try {
    await requireAdmin();
    return null;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  try {
    const fd = await req.formData();
    const data = parseForm(fd);
    const { images, ...product } = data;
    const row = await prisma.product.create({
      data: {
        ...product,
        publishedAt: product.status === "AVAILABLE" ? new Date() : null,
        images: { create: images.map((i, idx) => ({ url: i.url, alt: i.alt, sortOrder: idx, isPrimary: idx === 0 })) },
      },
    });
    return NextResponse.json({ ok: true, id: row.id });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    if (String(e).includes("Unique")) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    console.error(e);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  try {
    const fd = await req.formData();
    const id = String(fd.get("id") ?? "");
    const data = parseForm(fd);
    const { images, ...product } = data;
    const before = await prisma.product.findUnique({ where: { id }, select: { images: { select: { url: true } } } });
    const row = await prisma.product.update({
      where: { id },
      data: {
        ...product,
        publishedAt: product.status === "AVAILABLE" ? new Date() : undefined,
        images: {
          deleteMany: {},
          create: images.map((i, idx) => ({ url: i.url, alt: i.alt, sortOrder: idx, isPrimary: idx === 0 })),
        },
      },
    });
    // Bersihkan file foto yang dilepas dari form (bila tak dipakai tempat lain)
    const newUrls = new Set(images.map((i) => i.url));
    const removed = (before?.images ?? []).map((i) => i.url).filter((u) => !newUrls.has(u));
    await cleanupMediaFiles(removed);
    return NextResponse.json({ ok: true, id: row.id });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    if (String(e).includes("Unique")) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    console.error(e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  try {
    const { id } = (await req.json()) as { id: string };
    const urls = await prisma.productImage.findMany({ where: { productId: id }, select: { url: true } });
    await prisma.product.delete({ where: { id } });
    await cleanupMediaFiles(urls.map((u) => u.url));
    return NextResponse.json({ ok: true });
  } catch {
    // Produk dengan riwayat order menolak dihapus (FK) → snapshot order tetap utuh
    return NextResponse.json({ error: "Delete failed (order history keeps a snapshot)" }, { status: 500 });
  }
}
