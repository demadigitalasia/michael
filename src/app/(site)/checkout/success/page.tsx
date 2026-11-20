import Link from "next/link";
import { ArrowLeft } from "@/components/icons";
import { prisma } from "@/lib/prisma";
import { formatUsd } from "@/lib/site";

export const metadata = { title: "Order confirmed" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  const order = orderNumber
    ? await prisma.order.findUnique({ where: { orderNumber }, include: { items: true } })
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-36 sm:px-6">
      <p className="eyebrow text-ink/60">{order ? `Order ${order.orderNumber}` : "Thank you"}</p>
      <h1 className="display mt-3 text-[clamp(44px,7vw,96px)] text-ink">It’s yours.</h1>
      <p className="body-muted mt-4 max-w-[52ch] text-[17px] leading-relaxed">
        {order
          ? `Payment received — ${formatUsd(order.totalCents)} — and your stones are being packed. A confirmation email is on its way to ${order.email}, with tracking to follow once it ships.`
          : "Payment received. A confirmation email is on its way with your order details and tracking to follow."}
      </p>

      {order && (
        <div className="mt-10 rounded-[6px] border border-ink/10 bg-sketch p-8">
          <p className="eyebrow text-ink/60">In this parcel</p>
          <ul className="mt-4 space-y-2">
            {order.items.map((i) => (
              <li key={i.id} className="flex justify-between border-b border-ink/10 pb-2 text-[15px]">
                <Link href={`/products/${i.productSlugSnapshot}`} className="text-ink hover:text-gold">
                  {i.productTitleSnapshot}
                </Link>
                <span className="font-mono text-[13px] tabular-nums">{formatUsd(i.priceCents)}</span>
              </li>
            ))}
          </ul>
          <p className="eyebrow mt-4 text-ink/60">Status: {order.status.toLowerCase()}</p>
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/shop" className="inline-flex h-[46px] items-center gap-2.5 rounded-full bg-ink px-5 text-[15px] font-medium text-milk transition-transform duration-200 hover:-translate-y-0.5">
          Back to the bench <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
        <Link href="/care" className="inline-flex h-[46px] items-center gap-2.5 rounded-full border border-ink/20 px-5 text-[15px] font-medium text-ink transition-colors hover:border-ink/50">
          Care guides
        </Link>
      </div>
    </div>
  );
}
