import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { prisma } from "@/lib/prisma";
import { effectiveStatus } from "@/lib/products";
import { formatUsd } from "@/lib/site";

// Halaman admin selalu dinamis — private, tak di-prerender/ter-cache
export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [toShip, newInquiryCount, newOrders, newInquiries, soldCount, revenueAgg, products] = await Promise.all([
    // Kartu KPI: hitung semua (bukan take:5 — angka kartu harus akurat)
    prisma.order.count({ where: { status: { in: ["PAID", "PROCESSING"] } } }),
    prisma.customOrder.count({ where: { status: "NEW" } }),
    // List ringkasan (5 terbaru)
    prisma.order.findMany({ where: { status: { in: ["PAID", "PROCESSING"] } }, orderBy: { placedAt: "desc" }, take: 5, include: { items: true } }),
    prisma.customOrder.findMany({ where: { status: "NEW" }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.product.count({ where: { status: "SOLD" } }),
    prisma.order.aggregate({ where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } }, _sum: { totalCents: true } }),
    prisma.product.findMany({ orderBy: { updatedAt: "desc" }, take: 5, include: { images: { take: 1, orderBy: { sortOrder: "asc" } } } }),
  ]);

  const cards = [
    { label: "Orders to ship", value: String(toShip), href: "/admin/orders" },
    { label: "New inquiries", value: String(newInquiryCount), href: "/admin/custom-orders" },
    { label: "Stones sold", value: String(soldCount), href: "/admin/products" },
    { label: "Revenue", value: formatUsd(revenueAgg._sum.totalCents ?? 0), href: "/admin/orders" },
  ];

  return (
    <div>
      <h1 className="display text-[clamp(32px,4vw,48px)] text-ink">Overview</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-[4px] border border-ink/10 bg-sketch p-5 transition-colors hover:border-ink/30">
            <p className="eyebrow text-ink/60">{c.label}</p>
            <p className="mt-2 font-display text-3xl font-bold tabular-nums text-ink">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="text-[17px] font-semibold text-ink">Recent orders</h2>
            <Link href="/admin/orders" className="eyebrow inline-flex items-center gap-1 text-ink/60 underline underline-offset-4">All <ArrowRight className="size-3.5" aria-hidden="true" /></Link>
          </div>
          <ul className="mt-4">
            {newOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between border-t border-ink/10 py-3">
                <span className="text-[14px] font-medium text-ink">
                  {o.orderNumber} <span className="body-muted font-normal">· {o.items.length} pc · {o.email}</span>
                </span>
                <span className="eyebrow text-gold">{o.status.toLowerCase()}</span>
              </li>
            ))}
            {newOrders.length === 0 && <li className="border-t border-ink/10 py-3 body-muted text-[14px]">No open orders.</li>}
          </ul>
        </section>

        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="text-[17px] font-semibold text-ink">Latest products</h2>
            <Link href="/admin/products" className="eyebrow inline-flex items-center gap-1 text-ink/60 underline underline-offset-4">Manage <ArrowRight className="size-3.5" aria-hidden="true" /></Link>
          </div>
          <ul className="mt-4">
            {products.map((p) => (
              <li key={p.id} className="flex items-center justify-between border-t border-ink/10 py-3">
                <span className="text-[14px] font-medium text-ink">{p.title}</span>
                <span className="eyebrow text-ink/60">{effectiveStatus(p).toLowerCase()}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {newInquiries.length > 0 && (
        <section className="mt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[17px] font-semibold text-ink">New custom inquiries</h2>
            <Link href="/admin/custom-orders" className="eyebrow inline-flex items-center gap-1 text-ink/60 underline underline-offset-4">Inbox <ArrowRight className="size-3.5" aria-hidden="true" /></Link>
          </div>
          <ul className="mt-4">
            {newInquiries.map((i) => (
              <li key={i.id} className="flex items-center justify-between border-t border-ink/10 py-3">
                <span className="text-[14px] font-medium text-ink">{i.name} <span className="body-muted font-normal">· {i.serviceType.toLowerCase()}</span></span>
                <span className="eyebrow text-oxide">new</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
