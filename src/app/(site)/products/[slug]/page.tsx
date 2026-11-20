import Link from "next/link";
import { ArrowLeft, Plus } from "@/components/icons";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductGallery } from "@/components/product-gallery";
import { isConceptListing, listingPhotos } from "@/lib/product-listing";
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

  const concept = isConceptListing(product);
  const status = concept ? "DEMO" : effectiveStatus(product);
  const photos = listingPhotos(product.images);
  const related = await getRelated(product);
  const weight =
    product.weightCarat != null ? `${product.weightCarat} ct` : product.weightGram != null ? `${product.weightGram.toLocaleString("en-US")} g` : null;

  const specs = [
    ["Stone", product.stoneType],
    ["Weight", weight],
    ["Dimensions", product.lengthMm && product.widthMm ? `${product.lengthMm} × ${product.widthMm}${product.depthMm ? ` × ${product.depthMm}` : ""} mm` : null],
    ["Form", product.form || null],
    ["Treatment", concept ? "Unverified" : TREATMENT_LABEL[product.treatment] ?? product.treatment],
    ["Origin", product.origin || null],
    ["Status", concept ? "Concept only" : status === "AVAILABLE" ? "One of a kind — available" : status === "RESERVED" ? "Reserved" : "Sold"],
  ].filter(([, v]) => v != null) as [string, string][];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: photos.map(({ url }) => `${site.url}${url}`),
    brand: { "@type": "Brand", name: site.name },
    ...(!concept && {
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: (product.priceCents / 100).toFixed(2),
        availability: status === "SOLD" ? "https://schema.org/SoldOut" : status === "RESERVED" ? "https://schema.org/LimitedAvailability" : "https://schema.org/InStock",
      },
    }),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid items-start gap-8 lg:grid-cols-[1.22fr_1fr] lg:gap-12">
        <ProductGallery photos={photos} title={product.title} />
        <div>
          <p className="eyebrow text-ink/60">{product.stoneType}</p>
          <h1 className="display mt-3 text-[clamp(36px,4.5vw,64px)] text-ink">{product.title}</h1>
          {!concept && (
            <p className="mt-4 font-display text-4xl font-bold tracking-tight text-ink">{formatUsd(product.priceCents)}</p>
          )}
          <div className="mt-4">
            <StatusBadge status={status} />
          </div>
          {concept ? (
            <p className="body-muted mt-5 max-w-[38ch] text-[15px] leading-relaxed">
              AI material study only. This image illustrates a material, not a specific stone. It is unavailable for purchase.
            </p>
          ) : (
            <>
              <div className="mt-8">
                <AddToBag productId={product.id} disabled={false} status={status} />
              </div>
              <p className="eyebrow mt-6 text-ink/60">
                Insured worldwide shipping · 14-day returns · Origin note included
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-10 max-w-3xl lg:mt-14">
        <p className="text-[17px] leading-relaxed text-ink">{product.description}</p>

        {/* Spec rows */}
        <dl className="mt-8 border-t border-ink/15">
          {specs.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[minmax(5rem,0.4fr)_1fr] gap-4 border-b border-ink/10 py-3">
              <dt className="eyebrow pt-1 text-ink/60">{k}</dt>
              <dd className="text-[15px] text-ink">{v}</dd>
            </div>
          ))}
        </dl>

        {/* About accordion */}
        {!concept && (
          <div className="mt-8">
            <details className="group border-b border-ink/10 py-4" open>
              <summary className="flex cursor-pointer list-none items-center justify-between text-[17px] font-semibold text-ink">
                How it is made <Plus className="size-4 transition-transform group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="body-muted mt-3 text-[14.5px] leading-relaxed">
                {product.title} was cut at our bench from rough of known origin — slabbed, preformed, ground,
                sanded through the grits and polished on leather. It is photographed exactly as it is, with no
                retouching of the face.
              </p>
            </details>
            <details className="group border-b border-ink/10 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-[17px] font-semibold text-ink">
                Shipping & returns <Plus className="size-4 transition-transform group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="body-muted mt-3 text-[14.5px] leading-relaxed">
                Ships tracked and insured within 1–2 business days. Returns accepted within 14 days, unworn and
                as shipped — see the Care page for the full policy.
              </p>
            </details>
          </div>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24">
          <Reveal>
            <p className="eyebrow text-ink/60">Same stone, more pieces</p>
            <h2 className="display mt-3 text-[clamp(36px,4.5vw,64px)] text-ink">You may also like</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-10 min-[400px]:grid-cols-2 lg:grid-cols-4">
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
          Back to all pieces <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
      </Reveal>
    </div>
  );
}
