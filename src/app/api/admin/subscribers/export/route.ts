import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

/** Ekspor daftar pelanggan newsletter sebagai CSV (untuk alat email). */
export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subs = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "asc" } });
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows = [
    "email,subscribed_at",
    ...subs.map((s) => `${esc(s.email)},${esc(s.createdAt.toISOString())}`),
  ];
  const csv = rows.join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="newsletter-subscribers.csv"',
      "Cache-Control": "no-store",
    },
  });
}
