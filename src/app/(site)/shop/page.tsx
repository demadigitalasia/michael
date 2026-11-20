import { ProductCard } from "@/components/product-card";
import { ArrowRight } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { Ticker } from "@/components/ticker";
import { listProducts } from "@/lib/products";
import { categories } from "@/lib/site";
import Link from "next/link";

export const revalidate = 30;

export const metadata = {
  title: "Shop all pieces",
  description:
    "Cabochons, slabs, rough and finished pieces — one of a kind, cut at our bench. Filter by category and take one home.",
};

export default async function ShopPage() {
  const products = await listProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-12">
      {/* Hero katalog */}
      <Reveal>
        <p className="eyebrow text-ink/60">Shop · {products.length} physical pieces</p>
        <h1 className="display mt-3 text-[clamp(44px,7vw,96px)] text-ink">All pieces</h1>
        <p className="body-muted mt-4 max-w-[56ch] text-[17px] leading-relaxed">
          Browse one-of-a-kind cabochons, slabs, rough and finished work. Every piece here is a physical stone with its own listing.
        </p>
      </Reveal>

      {/* Baris kategori */}
      <nav aria-label="Categories" className="mt-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/collections#${c.slug}`}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-ink/15 px-4 text-[14px] font-medium text-ink/80 transition-colors duration-150 hover:border-ink/40 hover:text-ink"
          >
            {c.label} <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        ))}
      </nav>

      {/* Grid */}
      <div className="mt-12 grid grid-cols-1 gap-x-4 gap-y-10 min-[400px]:grid-cols-2 lg:grid-cols-4">
        {products.map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) * 90}>
            <ProductCard product={p} eager={i < 4} />
          </Reveal>
        ))}
      </div>

      {products.length === 0 && (
        <div className="mt-16 rounded-[6px] border border-ink/10 bg-sketch p-8 text-center md:p-12">
          <p className="eyebrow text-ink/55">No physical stones listed</p>
          <h2 className="display mt-3 text-[clamp(30px,4vw,48px)] text-ink">The next cut is still at the bench</h2>
          <p className="body-muted mx-auto mt-4 max-w-[48ch] text-[15px] leading-relaxed">
            Browse the material studies for visual references, or tell us what you would like us to cut.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/material-studies" className="inline-flex h-[46px] items-center gap-2 rounded-full border border-ink/20 px-5 text-[14px] font-medium text-ink transition-colors hover:border-ink/50">
              View material studies <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/custom" className="inline-flex h-[46px] items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-medium text-milk transition-transform hover:-translate-y-0.5">
              Start a custom piece <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}

      {/* Ticker */}
      <div className="mt-20 border-t border-ink/10 pt-10">
        <Ticker size={36} />
      </div>

      {/* Band custom */}
      <Reveal className="mt-16">
        <div className="rounded-[6px] border border-ink/10 bg-sketch p-8 md:p-12">
          <p className="eyebrow text-ink/60">Custom orders</p>
          <h2 className="display mt-3 text-[clamp(32px,4vw,56px)] text-ink">Not quite it? We’ll cut it</h2>
          <p className="body-muted mt-4 max-w-[56ch] text-[15.5px] leading-relaxed">
            Change the stone, the shape or the finish — or start from your own rough. Custom work begins with a
            short conversation, no obligation.
          </p>
          <Link href="/custom" className="mt-6 inline-flex h-[46px] items-center gap-2.5 rounded-full bg-ink px-5 text-[15px] font-medium text-milk transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]">
            Start a custom piece <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
