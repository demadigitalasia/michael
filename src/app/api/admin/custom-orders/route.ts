import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  id: z.string().uuid(),
  status: z.enum(["NEW", "QUOTED", "IN_PROGRESS", "COMPLETED", "DECLINED"]),
  adminNotes: z.string().max(4000).optional().default(""),
});

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const data = schema.parse(await req.json());
    await prisma.customOrder.update({
      where: { id: data.id },
      data: { status: data.status, adminNotes: data.adminNotes },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    if (e instanceof Error && e.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
