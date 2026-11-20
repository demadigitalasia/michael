import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const base = z.object({
  author: z.string().min(1).max(120),
  location: z.string().max(120).default(""),
  productName: z.string().max(200).default(""),
  quote: z.string().min(3).max(1000),
  rating: z.number().min(1).max(5).default(5),
  published: z.boolean().default(true),
});

/** rating boleh datang sebagai string dari form — normalisasi sebelum validasi */
function withRating(raw: Record<string, unknown>) {
  if (typeof raw.rating === "string") raw.rating = Number(raw.rating) || 5;
  return raw;
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
    const data = base.parse(withRating((await req.json()) as Record<string, unknown>));
    const row = await prisma.review.create({ data });
    return NextResponse.json({ ok: true, id: row.id });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  try {
    const schema = base.partial().extend({ id: z.string().uuid() });
    const { id, ...data } = schema.parse(withRating((await req.json()) as Record<string, unknown>));
    if (Object.keys(data).length === 0) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    await prisma.review.update({ where: { id }, data });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  try {
    const { id } = (await req.json()) as { id: string };
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
