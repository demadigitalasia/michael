import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { site } from "@/lib/site";
import { physicalListingWhere } from "@/lib/product-listing";

const purchasableListing = physicalListingWhere;

const CART_COOKIE = "ml_cart";

export async function getCartToken(): Promise<string | null> {
  return (await cookies()).get(CART_COOKIE)?.value ?? null;
}

export async function ensureCart(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(CART_COOKIE)?.value;
  if (existing) {
    const cart = await prisma.cart.findUnique({ where: { token: existing } });
    if (cart && cart.expiresAt > new Date()) return cart.token;
  }
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // cookie cart 7 hari
  await prisma.cart.create({ data: { token, expiresAt } });
  jar.set(CART_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return token;
}

export async function getCartItems(token: string | null) {
  if (!token) return [] as Array<{
    productId: string; slug: string; title: string; priceCents: number;
    image: string | null; reservedUntil: Date | null;
    weightGram: number | null; weightCarat: number | null;
  }>;
  const cart = await prisma.cart.findUnique({
    where: { token },
    include: {
      items: {
        where: { product: purchasableListing },
        include: { product: { include: { images: { orderBy: { sortOrder: "asc" } } } } },
      },
    },
  });
  if (!cart) return [];
  return cart.items.map((i) => ({
    productId: i.productId,
    slug: i.product.slug,
    title: i.product.title,
    priceCents: i.product.priceCents,
    image: i.product.images[0]?.url ?? null,
    reservedUntil: i.product.reservedUntil,
    weightGram: i.product.weightGram,
    weightCarat: i.product.weightCarat,
  }));
}

export async function getCartCount(): Promise<number> {
  try {
    const token = await getCartToken();
    if (!token) return 0;
    return await prisma.cartItem.count({ where: { cart: { token }, product: purchasableListing } });
  } catch {
    return 0;
  }
}

/**
 * Reservasi item saat masuk cart (PRD §6.3): AVAILABLE → RESERVED dengan TTL,
 * diatribusikan ke cart pemegang agar sesi lain tak bisa checkout dengan hold kita.
 * Item RESERVED yang kedaluwarsa otomatis boleh diambil lagi (dicek di sini);
 * hold milik cart ini yang masih valid diperpanjang (bukan gagal).
 */
export async function reserveProduct(productId: string, cartId: string): Promise<boolean> {
  const now = new Date();
  const reservedUntil = new Date(now.getTime() + site.reservationMinutes * 60 * 1000);
  const claim = await prisma.product.updateMany({
    where: {
      id: productId,
      ...purchasableListing,
      AND: [
        {
          OR: [
            { weightGram: { not: null } },
            { weightCarat: { not: null } },
          ],
        },
        {
          OR: [
            { status: "AVAILABLE" },
            { status: "RESERVED", reservedUntil: { lte: now } },
          ],
        },
      ],
    },
    data: { status: "RESERVED", reservedUntil, reservedByCartId: cartId },
  });
  if (claim.count > 0) return true;
  // Hold milik cart ini yang masih valid → perpanjang TTL
  const extend = await prisma.product.updateMany({
    where: { id: productId, status: "RESERVED", reservedByCartId: cartId, reservedUntil: { gt: now } },
    data: { reservedUntil },
  });
  return extend.count > 0;
}

export async function releaseProduct(productId: string): Promise<void> {
  await prisma.product.updateMany({
    where: { id: productId, status: "RESERVED" },
    data: { status: "AVAILABLE", reservedUntil: null, reservedByCartId: null },
  });
}
