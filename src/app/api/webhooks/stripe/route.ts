import { NextResponse } from "next/server";
import Stripe from "stripe";
import type StripeTypes from "stripe";
import { prisma } from "@/lib/prisma";
import { sendMail, orderConfirmationHtml, refundHtml } from "@/lib/mail";
import { effectiveStatus } from "@/lib/products";
import { site } from "@/lib/site";

export const runtime = "nodejs";

/**
 * Stripe webhook — SATU-SATUNYA sumber kebenaran untuk fulfillment (PRD §10):
 * checkout.session.completed → order PAID → produk SOLD → email → kosongkan cart.
 * Idempoten: kalau order sudah PAID, abaikan.
 * Re-validasi: batu bisa sudah terjual ke pembeli lain selama menunggu pembayaran —
 * pembeli yang kalah race di-refund otomatis dan ordernya CANCELLED (terms:
 * first completed payment owns the stone).
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

    // Cart pemegang hold sesuai metadata (bisa sudah terhapus — hold TTL 30 menit)
    const cart = cartToken ? await prisma.cart.findUnique({ where: { token: cartToken } }) : null;
    const holderCartId = cart?.id ?? null;

    // Re-validasi ketersediaan tiap item sebelum fulfill
    const conflicts: string[] = [];
    for (const item of existing.items) {
      const p = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!p) {
        conflicts.push(item.productTitleSnapshot);
        continue;
      }
      const eff = effectiveStatus(p);
      if (eff === "SOLD" || (eff === "RESERVED" && p.reservedByCartId && p.reservedByCartId !== holderCartId)) {
        conflicts.push(item.productTitleSnapshot);
      }
    }

    if (conflicts.length > 0) {
      // Kalah race: refund pembayaran lalu batalkan order (PENDING dipertahankan
      // bila refund gagal, supaya retry webhook dari Stripe mencoba lagi).
      const paymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : null;
      if (paymentIntent) {
        try {
          await stripe.refunds.create({ payment_intent: paymentIntent });
        } catch (err) {
          console.error(`Order ${orderNumber}: refund gagal — tunggu retry Stripe`, err);
          return NextResponse.json({ error: "Refund failed" }, { status: 500 });
        }
      }
      await prisma.order.update({ where: { orderNumber }, data: { status: "CANCELLED" } });
      console.error(`Order ${orderNumber}: item tak lagi tersedia (${conflicts.join(", ")}) — direfund & dibatalkan`);
      await sendMail({
        to: existing.email,
        subject: `Order ${orderNumber} — refund on its way`,
        html: refundHtml({ orderNumber, totalCents: existing.totalCents, siteUrl: site.url }),
      }).catch(() => undefined);
      return NextResponse.json({ received: true, note: "refunded: items no longer available" });
    }

    // Fulfillment atomik: PAID + produk SOLD + kosongkan cart dalam satu transaksi —
    // retry webhook setelah crash tidak meninggalkan kondisi setengah jadi.
    const paymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : null;
    await prisma.$transaction(async (tx) => {
      const fresh = await tx.order.findUnique({ where: { orderNumber }, select: { status: true } });
      if (!fresh || fresh.status !== "PENDING") return; // diproses webhook lain — idempoten
      await tx.order.update({
        where: { orderNumber },
        data: { status: "PAID", stripePaymentIntentId: paymentIntent },
      });
      for (const item of existing.items) {
        await tx.product.updateMany({
          where: { id: item.productId, status: { in: ["AVAILABLE", "RESERVED"] } },
          data: { status: "SOLD", reservedUntil: null, reservedByCartId: null },
        });
      }
      if (cart) await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    });

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

    // Housekeeping ringan (sekali per webhook, murah): cart kedaluwarsa dibuang
    // (cascade items) dan order PENDING >24 jam dibatalkan — Stripe sessionExpired.
    const staleBefore = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await prisma.cart.deleteMany({ where: { expiresAt: { lt: staleBefore } } }).catch(() => undefined);
    await prisma.order
      .updateMany({ where: { status: "PENDING", placedAt: { lt: staleBefore } }, data: { status: "CANCELLED" } })
      .catch(() => undefined);
  }

  return NextResponse.json({ received: true });
}
