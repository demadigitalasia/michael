import { prisma } from "@/lib/prisma";
import { InquiryControls } from "@/components/admin/inquiry-controls";

export default async function AdminCustomOrdersPage() {
  const inquiries = await prisma.customOrder.findMany({ orderBy: { createdAt: "desc" } });
  const isNew = (s: string) => s === "NEW";

  return (
    <div>
      <h1 className="display text-[clamp(32px,4vw,48px)] text-ink">Custom inbox</h1>
      <div className="mt-8 space-y-4">
        {inquiries.map((i) => {
          const refs = Array.isArray(i.referenceImages)
            ? (i.referenceImages as unknown[]).filter((u): u is string => typeof u === "string" && /^https?:\/\//.test(u))
            : [];
          return (
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
              {refs.length > 0 && (
                <div className="mt-3">
                  <p className="eyebrow text-ink/50">Reference links</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {refs.map((u) => (
                      <a
                        key={u}
                        href={u}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={u}
                        className="block size-16 overflow-hidden rounded-[3px] border border-ink/10 bg-phold"
                      >
                        {/* remote URL — next/image dibatasi lokal, pakai img polos */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={u} alt="Reference" className="size-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <InquiryControls id={i.id} status={i.status} adminNotes={i.adminNotes} />
            </div>
          );
        })}
        {inquiries.length === 0 && <p className="body-muted text-[14px]">Inbox is empty — no inquiries yet.</p>}
      </div>
    </div>
  );
}
