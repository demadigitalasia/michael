import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatUsd } from "@/lib/site";
import { OrderControls } from "@/components/admin/order-controls";

const STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"] as const;
type Status = (typeof STATUSES)[number];

type Address = { name?: string; line1?: string; city?: string; zip?: string; country?: string };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = STATUSES.includes(status as Status) ? (status as Status) : undefined;

  const [orders, counts] = await Promise.all([
    prisma.order.findMany({
      where: filter ? { status: filter } : undefined,
      orderBy: { placedAt: "desc" },
      include: { items: true },
    }),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const total = counts.reduce((s, c) => s + c._count._all, 0);
  const countOf = (s: Status) => counts.find((c) => c.status === s)?._count._all ?? 0;

  return (
    <div>
      <h1 className="display text-[clamp(32px,4vw,48px)] text-ink">Orders</h1>

      <nav aria-label="Filter status" className="mt-5 flex flex-wrap gap-1.5">
        <Link
          href="/admin/orders"
          aria-current={!filter ? "true" : undefined}
          className={`eyebrow rounded-full border px-3 py-1.5 ${!filter ? "border-ink bg-ink text-milk" : "border-ink/15 text-ink/60 hover:border-ink/40"}`}
        >
          All · {total}
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            aria-current={filter === s ? "true" : undefined}
            className={`eyebrow rounded-full border px-3 py-1.5 ${filter === s ? "border-ink bg-ink text-milk" : "border-ink/15 text-ink/60 hover:border-ink/40"}`}
          >
            {s} · {countOf(s)}
          </Link>
        ))}
      </nav>

      <div className="mt-6 space-y-4">
        {orders.map((o) => {
          const addr = o.shippingAddress as Address | null;
          return (
            <div key={o.id} className="rounded-[4px] border border-ink/10 bg-sketch p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-[16px] font-semibold text-ink">
                    {o.orderNumber} <span className="body-muted font-normal text-[14px]">· {o.email}</span>
                  </p>
                  <p className="eyebrow mt-1 text-ink/60">
                    {o.placedAt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} · {o.items.length} pieces · {formatUsd(o.totalCents)} · shipping {formatUsd(o.shippingCents)}
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
              <div className="mt-3 rounded-[3px] border border-ink/10 bg-paper px-3 py-2.5">
                <p className="eyebrow text-ink/50">Ship to</p>
                <p className="mt-1 font-mono text-[13px] leading-relaxed text-ink">
                  {addr?.name || "—"}
                  <br />
                  {addr?.line1 || "—"}
                  <br />
                  {addr ? `${addr.city}, ${addr.zip}, ${addr.country}` : "—"}
                </p>
              </div>
              <div className="mt-4">
                <OrderControls id={o.id} status={o.status} trackingNumber={o.trackingNumber} courier={o.courier} />
              </div>
            </div>
          );
        })}
        {orders.length === 0 && <p className="body-muted text-[14px]">No orders{filter ? ` with status ${filter}` : " yet"}.</p>}
      </div>
    </div>
  );
}
