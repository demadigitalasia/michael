import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCartItems, getCartToken, ensureCart, releaseProduct, reserveProduct } from "@/lib/cart";
import { effectiveStatus } from "@/lib/products";
import { shipmentWeightGrams, validRates } from "@/lib/shipping";
import { prisma } from "@/lib/prisma";
import { site } from "@/lib/site";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  line1: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  zip: z.string().min(1).max(20),
  country: z.string().min(1).max(80),
  rateId: z.string().uuid(),
});

function orderNumber() {
  return `ML-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured yet — set STRIPE_SECRET_KEY in .env" },
        { status: 501 },
      );
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Validasi & re-reserve (perpanjang TTL saat mulai checkout)
    const body = schema.parse(await req.json());
    const token = await ensureCart();
    const items = await getCartItems(token);
    if (items.length === 0) return NextResponse.json({ error: "Bag is empty" }, { status: 400 });

    // Status diperiksa per item: SOLD/tersembunyi ditolak; hold kedaluwarsa di-re-reserve.
    const invalid: { id: string; title: string }[] = [];
    for (const item of items) {
      const p = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { status: true, reservedUntil: true },
      });
      if (!p || ["SOLD", "DRAFT", "HIDDEN"].includes(effectiveStatus(p))) {
        invalid.push({ id: item.productId, title: item.title });
        continue;
      }
      if (effectiveStatus(p) === "AVAILABLE") {
        const ok = await reserveProduct(item.productId); // AVAILABLE / hold kedaluwarsa
        if (!ok) invalid.push({ id: item.productId, title: item.title });
      }
    }
    if (invalid.length > 0) {
      // Bersihkan item invalid dari cart agar UI tidak lagi menawarkan barang yang hilang
      await prisma.cartItem.deleteMany({
        where: { cart: { token }, productId: { in: invalid.map((i) => i.id) } },
      });
      return NextResponse.json(
        { error: `No longer available: ${invalid.map((i) => i.title).join(", ")}` },
        { status: 409 },
      );
    }

    // Tarif harus cocok zona alamat & window berat — aturan sama dengan UI (lib/shipping)
    const rate = await prisma.shippingRate.findFirst({ where: { id: body.rateId, active: true } });
    if (!rate) return NextResponse.json({ error: "Invalid shipping rate" }, { status: 400 });
    const totalGrams = shipmentWeightGrams(items);
    if (validRates([rate], body.country, totalGrams).length === 0) {
      return NextResponse.json(
        { error: "That shipping option doesn't match your address or parcel weight" },
        { status: 400 },
      );
    }

    const subtotal = items.reduce((s, i) => s + i.priceCents, 0);
    const number = orderNumber();
    const shippingAddress = { name: body.name, line1: body.line1, city: body.city, zip: body.zip, country: body.country };

    // Order dibuat dengan status PENDING — webhook yang mengangkat ke PAID (idempoten)
    const order = await prisma.order.create({
      data: {
        orderNumber: number,
        email: body.email,
        status: "PENDING",
        subtotalCents: subtotal,
        shippingCents: rate.priceCents,
        totalCents: subtotal + rate.priceCents,
        shippingAddress,
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            productTitleSnapshot: i.title,
            productSlugSnapshot: i.slug,
            priceCents: i.priceCents,
          })),
        },
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: body.email,
      line_items: [
        ...items.map((i) => ({
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: i.priceCents,
            product_data: { name: i.title, description: "One of a kind — cut at our bench" },
          },
        })),
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: rate.priceCents,
            product_data: { name: `Shipping — ${rate.name}` },
          },
        },
      ],
      success_url: `${site.url}/checkout/success?order=${order.orderNumber}`,
      cancel_url: `${site.url}/cart`,
      metadata: {
        cartToken: token,
        orderNumber: order.orderNumber,
        rateId: rate.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: "Please complete every field" }, { status: 400 });
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Opsional: bersih-bersih item yang tidak tersedia saat GET (utility untuk cron manual)
export async function DELETE() {
  const token = await getCartToken();
  const items = await getCartItems(token);
  for (const i of items) {
    const p = await prisma.product.findUnique({ where: { id: i.productId } });
    if (p && p.status === "SOLD") await releaseProduct(p.id);
  }
  return NextResponse.json({ ok: true });
}
