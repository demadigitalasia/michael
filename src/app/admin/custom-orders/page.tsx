import { prisma } from "@/lib/prisma";
import { InquiryControls } from "@/components/admin/inquiry-controls";

export default async function AdminCustomOrdersPage() {
  const inquiries = await prisma.customOrder.findMany({ orderBy: { createdAt: "desc" } });
  const isNew = (s: string) => s === "NEW";

  return (
    <div>
      <h1 className="display text-[clamp(32px,4vw,48px)] text-ink">Custom inbox</h1>
      <div className="mt-8 space-y-4">
        {inquiries.map((i) => (
          <div key={i.id} className={`rounded-[4px] border p-5 ${isNew(i.status) ? "border-gold/60 bg-gold/10" : "border-ink/10 bg-sketch"}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="text-[16px] font-semibold text-ink">
                  {i.name} <span className="body-muted font-normal text-[14px]">· <a href={`mailto:${i.email}`} className="underline underline-offset-4">{i.email}</a></span>
                </p>
                <p className="eyebrow mt-1 text-ink/60">
                  {i.serviceType.toLowerCase()} · budget {i.budgetUsd ? `$${i.budgetUsd}` : "—"} · timeline {i.timeline || "—"} · {i.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
              <span className={`eyebrow rounded-full border px-3 py-1 ${isNew(i.status) ? "border-oxide text-oxide" : "border-ink/15 text-ink/70"}`}>{i.status}</span>
            </div>
            <p className="mt-3 max-w-[70ch] whitespace-pre-wrap text-[14.5px] leading-relaxed text-ink">{i.description}</p>
            <InquiryControls id={i.id} status={i.status} adminNotes={i.adminNotes} />
          </div>
        ))}
        {inquiries.length === 0 && <p className="body-muted text-[14px]">Inbox kosong — belum ada inquiry.</p>}
      </div>
    </div>
  );
}
