import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

/** Form mengirim priceUsd (mudah dibaca manusia) — disimpan sebagai cents. */
const base = z.object({
  // Hanya dua zona yang dikenal validasi checkout (lib/shipping.validRates)
  zone: z
    .string()
    .min(1)
    .max(80)
    .transform((s) => s.trim().toLowerCase())
    .pipe(z.enum(["domestic", "international"])),
  name: z.string().min(1).max(120),
  minWeightG: z.number().min(0),
  maxWeightG: z.number().min(1),
  priceUsd: z.number().min(0),
  active: z.boolean().default(true),
});

function withNumbers(raw: Record<string, unknown>) {
  for (const k of ["minWeightG", "maxWeightG", "priceUsd"] as const) {
    if (typeof raw[k] === "string") raw[k] = Number(raw[k]);
  }
  return raw;
}

function toRow({ priceUsd, ...rest }: z.infer<typeof base>) {
  return { ...rest, priceCents: Math.round(priceUsd * 100) };
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
    const data = base.parse(withNumbers((await req.json()) as Record<string, unknown>));
    const row = await prisma.shippingRate.create({ data: toRow(data) });
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
    const { id, priceUsd, ...rest } = schema.parse(withNumbers((await req.json()) as Record<string, unknown>));
    const data = priceUsd !== undefined ? { ...rest, priceCents: Math.round(priceUsd * 100) } : rest;
    if (Object.keys(data).length === 0) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    await prisma.shippingRate.update({ where: { id }, data });
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
    await prisma.shippingRate.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
