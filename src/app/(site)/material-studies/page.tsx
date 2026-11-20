import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { listProducts } from "@/lib/products";

export const revalidate = 30;

export const metadata = {
  title: "Material studies",
  description: "AI-generated material concepts for visual reference. These images do not represent stones for sale.",
};

export default async function MaterialStudiesPage() {
  const studies = await listProducts({ conceptOnly: true });

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-12">
      <Reveal>
        <p className="eyebrow text-ink/60">Material studies · {studies.length} concepts</p>
        <h1 className="display mt-3 text-[clamp(44px,7vw,96px)] text-ink">Concepts, not specimens.</h1>
        <p className="body-muted mt-4 max-w-[58ch] text-[17px] leading-relaxed">
          These AI-generated images explore color and texture. They are not photographs of exact stones, do not describe verified inventory, and are not available to buy.
        </p>
        <Link href="/shop" className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-ink underline decoration-gold decoration-2 underline-offset-4 hover:text-gold">
          Shop physical stones <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-x-4 gap-y-10 min-[400px]:grid-cols-2 lg:grid-cols-4">
        {studies.map((study, i) => (
          <Reveal key={study.id} delay={(i % 4) * 90}>
            <ProductCard product={study} eager={i < 4} />
          </Reveal>
        ))}
      </div>

      {studies.length === 0 && (
        <p className="body-muted mt-16 text-center text-[15px]">There are no material studies to show right now.</p>
      )}
    </div>
  );
}
