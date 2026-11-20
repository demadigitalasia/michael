import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { RemoveItem } from "@/components/remove-item";
import { ReservationTimer } from "@/components/reservation-timer";
import { getCartItems, getCartToken } from "@/lib/cart";
import { formatUsd, site } from "@/lib/site";

export const metadata = { title: "Bag" };

export default async function CartPage() {
  const token = await getCartToken();
  const items = await getCartItems(token);
  const subtotal = items.reduce((s, i) => s + i.priceCents, 0);
  const reservedCount = items.filter((i) => i.reservedUntil && i.reservedUntil > new Date()).length;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-12">
      <p className="eyebrow text-ink/60">
        Bag · {items.length} {items.length === 1 ? "piece" : "pieces"}
        {reservedCount > 0 ? ` · ${reservedCount} reserved for you` : ""}
      </p>
      <h1 className="display mt-3 text-[clamp(44px,7vw,96px)] text-ink">Your bag</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-[6px] border border-ink/10 bg-sketch p-10">
          <p className="body-muted max-w-[46ch] text-[15.5px] leading-relaxed">
            The bag is empty. Every stone on the shop is one of a kind — when one speaks to you, hold it for 30
            minutes while you decide.
          </p>
          <Link href="/shop" className="mt-6 inline-flex h-[46px] items-center gap-2.5 rounded-full bg-ink px-5 text-[15px] font-medium text-milk transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]">
            Browse the bench <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          {/* Items */}
          <ul className="flex flex-col">
            {items.map((i) => (
              <li key={i.productId} className="grid grid-cols-[96px_1fr_auto] items-start gap-5 border-t border-ink/15 py-5">
                <Link href={`/products/${i.slug}`} className="relative block aspect-square overflow-hidden rounded-[4px] bg-phold">
                  {i.image && <Image src={i.image} alt={i.title} fill sizes="96px" className="object-cover" />}
                </Link>
                <div>
                  <Link href={`/products/${i.slug}`} className="product-title block text-ink hover:text-gold">
                    {i.title}
                  </Link>
                  <p className="eyebrow mt-1 text-ink/60">One of a kind · {site.reservationMinutes} min hold</p>
                  <div className="mt-2">
                    <ReservationTimer reservedUntil={i.reservedUntil} productId={i.productId} />
                  </div>
                  <div className="mt-3">
                    <RemoveItem productId={i.productId} />
                  </div>
                </div>
                <p className="font-mono text-[14px] font-medium tabular-nums text-ink">{formatUsd(i.priceCents)}</p>
              </li>
            ))}
          </ul>

          {/* Ringkasan */}
          <aside className="h-fit rounded-[6px] border border-ink/10 bg-sketch p-8">
            <h2 className="display text-2xl text-ink">Summary</h2>
            <dl className="mt-6 space-y-3">
              <div className="flex justify-between">
                <dt className="body-muted text-[15px]">Subtotal</dt>
                <dd className="font-mono text-[14px] font-medium tabular-nums text-ink">{formatUsd(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="body-muted text-[15px]">Shipping</dt>
                <dd className="eyebrow text-ink/60">At checkout</dd>
              </div>
            </dl>
            <Link
              href="/checkout"
              className="mt-8 inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-ink text-[15px] font-medium text-milk transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
            >
              Continue to checkout <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <p className="eyebrow mt-4 text-ink/50">Reserved items are yours for {site.reservationMinutes} minutes</p>
          </aside>
        </div>
      )}
    </div>
  );
}
