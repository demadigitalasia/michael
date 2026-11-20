import { prisma } from "@/lib/prisma";
import { SubscriberDelete } from "@/components/admin/subscriber-delete";
import { Download } from "@/components/icons";

export const metadata = { title: "Admin · Subscribers" };

// Halaman admin selalu dinamis — private, tak di-prerender/ter-cache
export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  const subs = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="display text-[clamp(32px,4vw,48px)] text-ink">Subscribers</h1>
        {subs.length > 0 && (
          <a
            href="/api/admin/subscribers/export"
            className="inline-flex h-[42px] items-center gap-2 rounded-full bg-ink px-4 text-[14px] font-medium text-milk transition-transform hover:-translate-y-0.5"
          >
            Export CSV <Download className="size-4" aria-hidden="true" />
          </a>
        )}
      </div>
      <p className="body-muted mt-2 max-w-[60ch] text-[14.5px]">
        Newsletter sign-ups from the site footer. Export as CSV to load into your email tool.
      </p>
      <ul className="mt-8">
        {subs.map((s) => (
          <li key={s.id} className="flex items-center justify-between border-t border-ink/10 py-3">
            <span className="text-[14px] font-medium text-ink">
              {s.email} <span className="body-muted font-normal">· joined {s.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
            </span>
            <SubscriberDelete id={s.id} email={s.email} />
          </li>
        ))}
      </ul>
      {subs.length === 0 && <p className="body-muted mt-6 text-[14px]">No subscribers yet — the footer form stores them here.</p>}
    </div>
  );
}
