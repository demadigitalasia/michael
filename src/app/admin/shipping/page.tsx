import { prisma } from "@/lib/prisma";
import { formatUsd } from "@/lib/site";
import { ShippingControls } from "@/components/admin/shipping-controls";
import { ShippingCreate } from "@/components/admin/shipping-create";

export const metadata = { title: "Admin · Shipping" };

// Halaman admin selalu dinamis — private, tak di-prerender/ter-cache
export const dynamic = "force-dynamic";

export default async function AdminShippingPage() {
  const rates = await prisma.shippingRate.findMany({ orderBy: [{ zone: "asc" }, { minWeightG: "asc" }] });

  // Kelompokkan per zona untuk keterbacaan
  const zones = new Map<string, typeof rates>();
  for (const r of rates) {
    const list = zones.get(r.zone) ?? [];
    list.push(r);
    zones.set(r.zone, list);
  }

  return (
    <div>
      <h1 className="display text-[clamp(32px,4vw,48px)] text-ink">Shipping</h1>
      <p className="body-muted mt-2 max-w-[60ch] text-[14.5px]">
        Rates offered at checkout. The buyer picks a rate whose weight range covers their order —
        keep ranges continuous within a zone (e.g. 0–500, 500–5000).
      </p>
      <div className="mt-6">
        <ShippingCreate />
      </div>
      <div className="mt-8 space-y-8">
        {[...zones.entries()].map(([zone, list]) => (
          <section key={zone}>
            <h2 className="eyebrow text-ink/60">{zone}</h2>
            <div className="mt-3 space-y-3">
              {list.map((r) => (
                <div key={r.id} className={`rounded-[4px] border p-4 ${r.active ? "border-ink/10 bg-sketch" : "border-dashed border-ink/25 bg-transparent"}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-[15px] font-semibold text-ink">
                      {r.name} <span className="body-muted font-normal text-[14px]">· {formatUsd(r.priceCents)}</span>
                    </p>
                    <span className={`eyebrow rounded-full border px-3 py-1 ${r.active ? "border-ink/15 text-ink/70" : "border-oxide/40 text-oxide"}`}>
                      {r.active ? "active" : "off"}
                    </span>
                  </div>
                  <ShippingControls
                    rate={{ id: r.id, zone: r.zone, name: r.name, minWeightG: r.minWeightG, maxWeightG: r.maxWeightG, priceCents: r.priceCents, active: r.active }}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
        {rates.length === 0 && <p className="body-muted text-[14px]">No rates yet — add the first one.</p>}
      </div>
    </div>
  );
}
