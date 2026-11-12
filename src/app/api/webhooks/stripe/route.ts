import { NextResponse } from "next/server";
import Stripe from "stripe";
import type StripeTypes from "stripe";
import { prisma } from "@/lib/prisma";
import { sendMail, orderConfirmationHtml } from "@/lib/mail";
import { site } from "@/lib/site";

export const runtime = "nodejs";

/**
 * Stripe webhook — SATU-SATUNYA sumber kebenaran untuk fulfillment (PRD §10):
 * checkout.session.completed → order PAID → produk SOLD → email → kosongkan cart.
 * Idempoten: kalau order sudah PAID, abaikan.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 501 });
  }
  const stripe = new Stripe(secret);

  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: StripeTypes.Event;
  try {
    const payload = await req.text();
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as StripeTypes.Checkout.Session;
    const orderNumber = session.metadata?.orderNumber;
    const cartToken = session.metadata?.cartToken;
    if (!orderNumber) return NextResponse.json({ received: true, note: "no order metadata" });

    // Idempoten
    const existing = await prisma.order.findUnique({ where: { orderNumber }, include: { items: true } });
    if (!existing) return NextResponse.json({ received: true, note: "order not found" });
    if (existing.status !== "PENDING") {
      return NextResponse.json({ received: true, note: "already processed" });
    }

    // PAID + produk SOLD
    await prisma.order.update({
      where: { orderNumber },
      data: {
        status: "PAID",
        stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
      },
    });
    for (const item of existing.items) {
      // Pembayaran menang (terms: first completed payment owns the stone)
      await prisma.product.updateMany({
        where: { id: item.productId, status: { in: ["AVAILABLE", "RESERVED"] } },
        data: { status: "SOLD", reservedUntil: null },
      });
    }
    // Kosongkan cart
    if (cartToken) {
      const cart = await prisma.cart.findUnique({ where: { token: cartToken } });
      if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    // Email konfirmasi (best-effort)
    await sendMail({
      to: existing.email,
      subject: `Order ${orderNumber} confirmed — thank you`,
      html: orderConfirmationHtml({
        orderNumber,
        items: existing.items.map((i) => ({ title: i.productTitleSnapshot, priceCents: i.priceCents })),
        totalCents: existing.totalCents,
        siteUrl: site.url,
      }),
    }).catch(() => undefined);
  }

  return NextResponse.json({ received: true });
}
