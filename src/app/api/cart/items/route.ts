import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureCart, getCartToken, releaseProduct, reserveProduct } from "@/lib/cart";

export async function POST(req: Request) {
  try {
    const { productId } = (await req.json()) as { productId?: string };
    if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { id: productId, isConcept: false } });
    if (!product || product.status === "SOLD" || product.status === "DRAFT" || product.status === "HIDDEN") {
      return NextResponse.json({ error: "This stone is no longer available" }, { status: 409 });
    }
    if (product.weightGram == null && product.weightCarat == null) {
      return NextResponse.json({ error: "This listing needs a shipping weight before checkout" }, { status: 409 });
    }

    const token = await getCartToken();
    const inOwnBag = token
      ? (await prisma.cartItem.findFirst({ where: { cart: { token }, productId } })) !== null
      : false;

    // reserveProduct: AVAILABLE / hold kedaluwarsa → RESERVED (TTL 30 menit).
    // Hold milik sendiri yang masih valid: no-op, tetap dianggap ok (sudah di bag).
    const reserved = await reserveProduct(productId);
    if (!reserved && !inOwnBag) {
      return NextResponse.json({ error: "Someone is holding this stone right now" }, { status: 409 });
    }

    const cartToken = await ensureCart();
    const cart = await prisma.cart.findUniqueOrThrow({ where: { token: cartToken } });
    if (!inOwnBag) {
      await prisma.cartItem.upsert({
        where: { cartId_productId: { cartId: cart.id, productId } },
        update: {},
        create: { cartId: cart.id, productId },
      });
    }

    return NextResponse.json({ ok: true, alreadyInBag: inOwnBag });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

    // Scoped ke cart sesi ini — jangan pernah menyentuh cart pengunjung lain
    const token = await getCartToken();
    const cart = token ? await prisma.cart.findUnique({ where: { token } }) : null;
    if (!cart) return NextResponse.json({ ok: true });

    const removed = await prisma.cartItem.deleteMany({ where: { productId, cartId: cart.id } });
    // Melepas reservasi hanya bila item memang ada di cart ini (bukan hold milik orang lain)
    if (removed.count > 0) await releaseProduct(productId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
