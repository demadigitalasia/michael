import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { effectiveStatus } from "@/lib/products";
import { formatUsd } from "@/lib/site";
import { ProductForm } from "@/components/admin/product-form";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>;
}) {
  const { edit, new: isNew } = await searchParams;
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
  });
  const editing = edit ? products.find((p) => p.id === edit) : undefined;

  if (edit && editing) {
    return (
      <div>
        <div className="flex items-baseline justify-between">
          <h1 className="display text-[clamp(28px,3.5vw,40px)] text-ink">Edit — {editing.title}</h1>
          <Link href="/admin/products" className="eyebrow inline-flex items-center gap-1 text-ink/60 underline underline-offset-4"><ArrowLeft className="size-3.5" aria-hidden="true" /> Back to list</Link>
        </div>
        <div className="mt-8">
          <ProductForm product={editing} />
        </div>
      </div>
    );
  }

  if (isNew) {
    return (
      <div>
        <div className="flex items-baseline justify-between">
          <h1 className="display text-[clamp(28px,3.5vw,40px)] text-ink">New stone</h1>
          <Link href="/admin/products" className="eyebrow inline-flex items-center gap-1 text-ink/60 underline underline-offset-4"><ArrowLeft className="size-3.5" aria-hidden="true" /> Back to list</Link>
        </div>
        <div className="mt-8">
          <ProductForm />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="display text-[clamp(32px,4vw,48px)] text-ink">Products</h1>
        <Link href="/admin/products?new=1" className="inline-flex h-[42px] items-center gap-2 rounded-full bg-ink px-4 text-[14px] font-medium text-milk transition-transform hover:-translate-y-0.5">
          New stone <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      <table className="mt-8 w-full border-collapse">
        <thead>
          <tr className="border-b border-ink/20 text-left">
            <th className="eyebrow py-2 text-ink/60">Stone</th>
            <th className="eyebrow py-2 text-ink/60">Category</th>
            <th className="eyebrow py-2 text-ink/60">Price</th>
            <th className="eyebrow py-2 text-ink/60">Status</th>
            <th className="eyebrow py-2 text-ink/60"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-ink/10">
              <td className="py-3 pr-4">
                <span className="flex items-center gap-3">
                  <span className="relative size-10 flex-none overflow-hidden rounded-[3px] bg-phold">
                    {p.images[0] && (
                      <Image
                        src={p.images[0].url}
                        alt=""
                        width={40}
                        height={40}
                        className="object-cover"
                        unoptimized={p.images[0].url.endsWith(".svg")}
                      />
                    )}
                  </span>
                  <span className="text-[14px] font-medium text-ink">{p.title}</span>
                </span>
              </td>
              <td className="py-3 pr-4 eyebrow text-ink/60">{p.category.toLowerCase().replace("_", " ")}</td>
              <td className="py-3 pr-4 font-mono text-[13px] tabular-nums">{p.isConcept ? "—" : formatUsd(p.priceCents)}</td>
              <td className="py-3 pr-4 eyebrow text-ink/60">{p.isConcept ? "material study" : effectiveStatus(p).toLowerCase()}</td>
              <td className="py-3 text-right">
                <Link href={`/admin/products?edit=${p.id}`} className="eyebrow text-ink underline underline-offset-4">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && <p className="body-muted mt-6 text-[14px]">No stones yet — publish the first one.</p>}
    </div>
  );
}
