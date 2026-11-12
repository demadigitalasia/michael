import { prisma } from "@/lib/prisma";
import { formatUsd } from "@/lib/site";
import { OrderControls } from "@/components/admin/order-controls";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { placedAt: "desc" }, include: { items: true } });

  return (
    <div>
      <h1 className="display text-[clamp(32px,4vw,48px)] text-ink">Orders</h1>
      <div className="mt-8 space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="rounded-[4px] border border-ink/10 bg-sketch p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="text-[16px] font-semibold text-ink">
                  {o.orderNumber} <span className="body-muted font-normal text-[14px]">· {o.email}</span>
                </p>
                <p className="eyebrow mt-1 text-ink/60">
                  {o.placedAt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} · {o.items.length} pieces · {formatUsd(o.totalCents)}
                </p>
              </div>
              <span className="eyebrow rounded-full border border-ink/15 px-3 py-1 text-ink/70">{o.status}</span>
            </div>
            <ul className="mt-3 space-y-1">
              {o.items.map((i) => (
                <li key={i.id} className="text-[14px] text-ink">
                  {i.productTitleSnapshot} <span className="body-muted">· {formatUsd(i.priceCents)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <OrderControls id={o.id} status={o.status} trackingNumber={o.trackingNumber} courier={o.courier} />
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="body-muted text-[14px]">No orders yet.</p>}
      </div>
    </div>
  );
}
