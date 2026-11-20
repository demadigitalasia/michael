import { prisma } from "@/lib/prisma";
import { ReviewControls } from "@/components/admin/review-controls";
import { ReviewCreate } from "@/components/admin/review-create";

export const metadata = { title: "Admin · Reviews" };

// Halaman admin selalu dinamis — private, tak di-prerender/ter-cache
export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });
  const live = reviews.filter((r) => r.published).length;

  return (
    <div>
      <h1 className="display text-[clamp(32px,4vw,48px)] text-ink">Reviews</h1>
      <p className="body-muted mt-2 max-w-[60ch] text-[14.5px]">
        Testimonials shown on the homepage social wall. {reviews.length} total · {live} published.
      </p>
      <div className="mt-6">
        <ReviewCreate />
      </div>
      <div className="mt-8 space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className={`rounded-[4px] border p-5 ${r.published ? "border-ink/10 bg-sketch" : "border-dashed border-ink/25 bg-transparent"}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-[16px] font-semibold text-ink">
                {r.author}
                {r.location && <span className="body-muted font-normal text-[14px]"> · {r.location}</span>}
              </p>
              <span className={`eyebrow rounded-full border px-3 py-1 ${r.published ? "border-ink/15 text-ink/70" : "border-oxide/40 text-oxide"}`}>
                {r.published ? "published" : "hidden"}
              </span>
            </div>
            <ReviewControls
              review={{
                id: r.id,
                author: r.author,
                location: r.location,
                productName: r.productName,
                quote: r.quote,
                rating: r.rating,
                published: r.published,
              }}
            />
          </div>
        ))}
        {reviews.length === 0 && <p className="body-muted text-[14px]">No reviews yet — add the first one.</p>}
      </div>
    </div>
  );
}
