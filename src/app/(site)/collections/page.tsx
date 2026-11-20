import { ProductCard } from "@/components/product-card";
import { ArrowRight } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { Lookbook } from "@/components/lookbook";
import { StatsCounters } from "@/components/stats-counters";
import { listProducts } from "@/lib/products";
import { lookbookPhoto } from "@/lib/product-listing";
import { categories } from "@/lib/site";
import Link from "next/link";

export const revalidate = 30;

export const metadata = {
  title: "Collections",
  description: "Cabochons, slabs, rough and finished pieces — browse by category.",
};

export default async function CollectionsPage() {
  const byCat = await Promise.all(
    categories.map(async (c) => ({ cat: c, products: await listProducts({ category: c.key, limit: 8 }) })),
  );

  const lookbookPhotos = (await listProducts({ limit: 8 })).flatMap(lookbookPhoto);

  return (
    <div className="pt-24">
      {/* Hero */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-12">
        <Reveal>
          <p className="eyebrow text-ink/60">Collections</p>
          <h1 className="display mt-3 text-[clamp(44px,7vw,96px)] text-ink">Four categories</h1>
          <p className="body-muted mt-4 max-w-[56ch] text-[17px] leading-relaxed">
            Browse available physical stones by cut or form. Concept images are kept in our separate material studies.
          </p>
          <Link href="/material-studies" className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-ink underline decoration-gold decoration-2 underline-offset-4 hover:text-gold">
            View material studies <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>

      {byCat.map(({ cat, products }) => (
        <section key={cat.slug} id={cat.slug} className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-20 pt-14 sm:px-6 lg:px-12">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="display text-[clamp(32px,4vw,56px)] text-ink">{cat.label}</h2>
              <p className="eyebrow text-ink/60">{products.length} listings</p>
            </div>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-10 min-[400px]:grid-cols-2 lg:grid-cols-4">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 90}>
                <ProductCard product={p} eager={i < 4} />
              </Reveal>
            ))}
          </div>
          {products.length === 0 && (
            <p className="body-muted mt-6 text-[15px]">Nothing here right now — check back after the next cutting session.</p>
          )}
        </section>
      ))}

      {/* Lookbook reuse */}
      <Lookbook
        photos={lookbookPhotos}
        kicker="From the bench"
        title="Where they come from"
        note="A closer look at the color and texture of the materials."
      />

      {/* Stats reuse */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-12">
        <Reveal>
          <p className="eyebrow text-ink/60">Materials</p>
          <h2 className="display mt-3 text-[clamp(44px,5.4vw,84px)] text-ink">Nothing hidden, nothing guessed</h2>
        </Reveal>
        <div className="mt-10">
          <StatsCounters
            stats={[
              { value: 100, suffix: "%", label: "Treatment disclosed", note: "Dyed or stabilized is written in the listing — every time." },
              { value: 412, label: "Stones cut last year", note: "One pair of hands, one set of wheels." },
              { value: 9, suffix: " h", label: "Hours per cabochon", note: "Sketch to final polish." },
              { value: 0, label: "Undisclosed treatments", note: "Rather lose the sale than the trust." },
            ]}
          />
        </div>
      </section>

      {/* Custom CTA band */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-12">
        <Reveal>
          <div className="grid items-center gap-8 rounded-[6px] border border-ink/10 bg-sketch p-8 md:grid-cols-[1fr_auto] md:p-12">
            <div>
              <p className="eyebrow text-ink/60">Custom orders</p>
              <h2 className="display mt-3 text-[clamp(32px,4vw,56px)] text-ink">Can’t find the stone? We’ll cut it</h2>
              <p className="body-muted mt-3 max-w-[52ch] text-[15.5px] leading-relaxed">
                Bring a sketch, a photo or your own rough. We reply within two working days with questions and a
                rough price.
              </p>
            </div>
            <Link href="/custom" className="inline-flex h-[46px] items-center gap-2.5 justify-self-start rounded-full bg-ink px-5 text-[15px] font-medium text-milk transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97] md:justify-self-end">
              Start a custom piece <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
