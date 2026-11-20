import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { sendMail, shippedHtml } from "@/lib/mail";
import { site } from "@/lib/site";
import { z } from "zod";

const schema = z.object({
  id: z.string().uuid(),
  status: z.enum(["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]),
  trackingNumber: z.string().max(100).optional().default(""),
  courier: z.string().max(100).optional().default(""),
});

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const data = schema.parse(await req.json());

    const before = await prisma.order.findUnique({
      where: { id: data.id },
      include: { items: { select: { productId: true } } },
    });
    const order = await prisma.order.update({
      where: { id: data.id },
      data: { status: data.status, trackingNumber: data.trackingNumber || null, courier: data.courier || null },
    });

    // Batal → lepas reservasi produk yang masih RESERVED (PRD §6.3)
    if (before && before.status !== "CANCELLED" && data.status === "CANCELLED") {
      for (const item of before.items) {
        await prisma.product.updateMany({
          where: { id: item.productId, status: "RESERVED" },
          data: { status: "AVAILABLE", reservedUntil: null },
        });
      }
    }

    // Refund → batu kembali AVAILABLE supaya bisa dijual lagi (bukan SOLD selamanya)
    if (before && before.status !== "REFUNDED" && data.status === "REFUNDED") {
      for (const item of before.items) {
        await prisma.product.updateMany({
          where: { id: item.productId, status: { in: ["SOLD", "RESERVED"] } },
          data: { status: "AVAILABLE", reservedUntil: null, reservedByCartId: null },
        });
      }
    }

    // Transisi ke SHIPPED → kirim email tracking (sekali saja)
    if (before?.status !== "SHIPPED" && data.status === "SHIPPED" && data.trackingNumber) {
      await sendMail({
        to: order.email,
        subject: `Order ${order.orderNumber} shipped — tracking inside`,
        html: shippedHtml({ orderNumber: order.orderNumber, trackingNumber: data.trackingNumber, courier: data.courier || "the courier", siteUrl: site.url }),
      }).catch(() => undefined);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    if (e instanceof Error && e.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
