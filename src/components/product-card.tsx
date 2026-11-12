import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { effectiveStatus } from "@/lib/products";
import { formatUsd } from "@/lib/site";

type ProductLike = {
  slug: string;
  title: string;
  priceCents: number;
  status: string;
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
  const status = effectiveStatus(product);
  const primary = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const secondary = product.images.find((i) => i !== primary) ?? null;
  const weight = product.weightCarat
    ? `${product.weightCarat} ct`
    : product.weightGram
      ? `${product.weightGram.toLocaleString("en-US")} g`
      : "";

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-[4px] bg-phold">
        <div className="relative aspect-[4/5]">
          {primary && (
            <Image
              src={primary.url}
              alt={primary.alt || product.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              priority={eager}
              className="object-cover transition-transform duration-[450ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
            />
          )}
          {secondary && (
            <Image
              src={secondary.url}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover opacity-0 transition-opacity duration-[600ms] group-hover:opacity-100"
            />
          )}
        </div>
        <div className="absolute left-3 top-3">
          <StatusBadge status={status as never} />
        </div>
        {status === "SOLD" && (
          <span className="absolute bottom-3 right-3">
            <span className="eyebrow inline-flex items-center border border-oxide bg-paper/80 px-3 py-1.5 text-oxide backdrop-blur-[6px]">
              Sold
            </span>
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="product-title text-ink">{product.title}</h3>
        <p className="font-mono text-[13px] font-medium tabular-nums text-ink">
          {formatUsd(product.priceCents)}
        </p>
      </div>
      <p className="eyebrow mt-1.5 text-ink/60">{product.stoneType}{weight ? ` · ${weight}` : ""}</p>
    </Link>
  );
}
