import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Loupe } from "@/components/loupe";
import { AddToBag } from "@/components/add-to-bag";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { StatusBadge } from "@/components/status-badge";
import { effectiveStatus, getProductBySlug, getRelated } from "@/lib/products";
import { formatUsd, site } from "@/lib/site";

export const revalidate = 30;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Not found" };
  const title = p.metaTitle || p.title;
  const description = p.metaDescription || p.description.slice(0, 155);
  const ogImg = p.images[0]?.url;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImg ? [{ url: ogImg }] : undefined,
      type: "website",
    },
  };
}

const TREATMENT_LABEL: Record<string, string> = {
  NATURAL: "Natural — no treatment",
  DYED: "Dyed (disclosed)",
  STABILIZED: "Stabilized (disclosed)",
  HEAT_TREATED: "Heat treated (disclosed)",
  OTHER: "Other treatment — see notes",
};

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status === "DRAFT" || product.status === "HIDDEN") notFound();

  const status = effectiveStatus(product);
  const related = await getRelated(product);
  const weight =
    product.weightCarat != null ? `${product.weightCarat} ct` : product.weightGram != null ? `${product.weightGram.toLocaleString("en-US")} g` : null;

  const specs = [
    ["Stone", product.stoneType],
    ["Weight", weight],
    ["Dimensions", product.lengthMm && product.widthMm ? `${product.lengthMm} × ${product.widthMm}${product.depthMm ? ` × ${product.depthMm}` : ""} mm` : null],
    ["Form", product.form || null],
    ["Treatment", TREATMENT_LABEL[product.treatment] ?? product.treatment],
    ["Origin", product.origin || null],
    ["Status", status === "AVAILABLE" ? "One of a kind — available" : status === "RESERVED" ? "Reserved" : "Sold"],
  ].filter(([, v]) => v != null) as [string, string][];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((i) => `${site.url}${i.url}`),
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: (product.priceCents / 100).toFixed(2),
      availability: status === "SOLD" ? "https://schema.org/SoldOut" : status === "RESERVED" ? "https://schema.org/LimitedAvailability" : "https://schema.org/InStock",
    },
  };

  const primary = product.images.find((i) => i.isPrimary) ?? product.images[0];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero produk: 2 foto berdampingan (1 foto = tampil penuh) */}
      <div className={product.images.length > 1 ? "grid gap-4 lg:grid-cols-2" : "grid"}>
        <div className="relative overflow-hidden rounded-[4px] bg-phold">
          <div className="relative aspect-[4/5] lg:aspect-auto lg:h-[560px]">
            {primary && <Loupe src={primary.url} alt={primary.alt || product.title} sizes={product.images.length > 1 ? "(min-width:1024px) 46vw, 100vw" : "100vw"} />}
          </div>
        </div>
        {product.images.length > 1 && (
          <div className="relative hidden overflow-hidden rounded-[4px] bg-phold lg:block">
            <div className="relative aspect-[4/5] lg:h-[560px]">
              <Image
                src={product.images[1]?.url ?? primary?.url ?? ""}
                alt={product.images[1]?.alt ?? product.title}
                fill
                sizes="46vw"
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="eyebrow text-ink/60">{product.stoneType}</p>
          <h1 className="display mt-3 text-[clamp(36px,4.5vw,64px)] text-ink">{product.title}</h1>
          <p className="mt-4 font-display text-4xl font-bold tracking-tight text-ink">{formatUsd(product.priceCents)}</p>
          <div className="mt-4">
            <StatusBadge status={status as never} />
          </div>
          <div className="mt-8">
            <AddToBag productId={product.id} disabled={false} status={status} />
          </div>
          <p className="eyebrow mt-6 text-ink/50">
            Insured worldwide shipping · 14-day returns · Origin note included
          </p>
        </div>

        <div>
          <p className="text-[17px] leading-relaxed text-ink">{product.description}</p>

          {/* Spec rows */}
          <dl className="mt-8 border-t border-ink/15">
            {specs.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[140px_1fr] gap-4 border-b border-ink/10 py-3">
                <dt className="eyebrow pt-1 text-ink/60">{k}</dt>
                <dd className="text-[15px] text-ink">{v}</dd>
              </div>
            ))}
          </dl>

          {/* About accordion */}
          <div className="mt-8">
            <details className="group border-b border-ink/10 py-4" open>
              <summary className="flex cursor-pointer list-none items-center justify-between text-[17px] font-semibold text-ink">
                How it is made <span className="transition-transform group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="body-muted mt-3 text-[14.5px] leading-relaxed">
                {product.title} was cut at our bench from rough of known origin — slabbed, preformed, ground,
                sanded through the grits and polished on leather. It is photographed exactly as it is, with no
                retouching of the face.
              </p>
            </details>
            <details className="group border-b border-ink/10 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-[17px] font-semibold text-ink">
                Shipping & returns <span className="transition-transform group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="body-muted mt-3 text-[14.5px] leading-relaxed">
                Ships tracked and insured within 1–2 business days. Returns accepted within 14 days, unworn and
                as shipped — see the Care page for the full policy.
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24">
          <Reveal>
            <p className="eyebrow text-ink/60">Same stone, more pieces</p>
            <h2 className="display mt-3 text-[clamp(36px,4.5vw,64px)] text-ink">You may also like</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 90}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <Reveal className="mt-20">
        <Link href="/shop" className="inline-flex items-center gap-2 text-[15px] font-medium text-ink underline decoration-gold decoration-2 underline-offset-4 hover:text-gold">
          Back to all pieces <span aria-hidden>→</span>
        </Link>
      </Reveal>
    </div>
  );
}
