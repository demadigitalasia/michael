import Image from "next/image";
import Link from "next/link";
import { AddToBag } from "@/components/add-to-bag";
import { StatusBadge } from "@/components/status-badge";
import { effectiveStatus } from "@/lib/products";
import { isConceptListing, listingPhotos } from "@/lib/product-listing";
import { formatUsd } from "@/lib/site";

type ProductLike = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  status: string;
  isConcept: boolean;
  reservedUntil: Date | null;
  stoneType: string;
  weightCarat: number | null;
  weightGram: number | null;
  images: { url: string; alt: string; isPrimary: boolean }[];
};

/**
 * Kartu produk (MOTION-SPEC §4): 2 foto — hover swap (opacity .6s) + zoom .45s,
 * badge status kiri-atas, judul Geist 500 17px, harga, baris spec mono.
 */
export function ProductCard({ product, eager = false }: { product: ProductLike; eager?: boolean }) {
  const concept = isConceptListing(product);
  const status = concept ? "DEMO" : effectiveStatus(product);
  const [primary, secondary] = listingPhotos(product.images);
  const weight = product.weightCarat
    ? `${product.weightCarat} ct`
    : product.weightGram
      ? `${product.weightGram.toLocaleString("en-US")} g`
      : "";

  return (
    <article>
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-[4px] bg-phold">
          <div className="relative aspect-[4/5]">
            {primary && (
              <Image
                src={primary.url}
                alt={primary.alt || product.title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 400px) 50vw, 100vw"
                priority={eager}
                className="object-cover transition-transform duration-[450ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
              />
            )}
            {secondary && (
              <Image
                src={secondary.url}
                alt={secondary.alt || product.title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 400px) 50vw, 100vw"
                className="object-cover opacity-0 transition-opacity duration-[600ms] group-hover:opacity-100"
              />
            )}
          </div>
          <div className="absolute left-3 top-3">
            <StatusBadge status={status} />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 lg:flex-nowrap">
          <h3 className="product-title text-ink">{product.title}</h3>
          {!concept && <p className="font-mono text-[13px] font-medium tabular-nums text-ink">{formatUsd(product.priceCents)}</p>}
        </div>
        <p className="eyebrow mt-1.5 text-ink/60">{product.stoneType}{weight ? ` · ${weight}` : ""}</p>
      </Link>
      {!concept && status === "AVAILABLE" && (
        <div className="mt-4">
          <AddToBag productId={product.id} disabled={false} status={status} compact />
        </div>
      )}
    </article>
  );
}
