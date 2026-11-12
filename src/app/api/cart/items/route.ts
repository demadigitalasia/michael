import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureCart, reserveProduct } from "@/lib/cart";

export async function POST(req: Request) {
  try {
    const { productId } = (await req.json()) as { productId?: string };
    if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.status === "SOLD" || product.status === "DRAFT" || product.status === "HIDDEN") {
      return NextResponse.json({ error: "This stone is no longer available" }, { status: 409 });
    }

    const reserved = await reserveProduct(productId);
    if (!reserved) {
      return NextResponse.json({ error: "Someone is holding this stone right now" }, { status: 409 });
    }

    const token = await ensureCart();
    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: (await prisma.cart.findUniqueOrThrow({ where: { token } })).id, productId } },
      update: {},
      create: { cartId: (await prisma.cart.findUniqueOrThrow({ where: { token } })).id, productId },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });
    await prisma.cartItem.deleteMany({ where: { productId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
