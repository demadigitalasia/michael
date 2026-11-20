"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "@/components/icons";

export type AdminProduct = {
  id: string; slug: string; title: string; description: string; category: string;
  stoneType: string; color: string; form: string; treatment: string; origin: string;
  lengthMm: number | null; widthMm: number | null; depthMm: number | null;
  weightCarat: number | null; weightGram: number | null;
  priceCents: number; status: string; isConcept: boolean; featured: boolean;
  metaTitle: string; metaDescription: string;
  images: { url: string; alt: string }[];
};

type Img = { url: string; alt: string };

const field = "h-[42px] w-full rounded-[4px] border border-ink/20 bg-transparent px-3 text-[14px] text-ink focus:outline-none focus:ring-1 focus:ring-gold";
const label = "eyebrow text-ink/60";

/** Form produk admin: semua atribut PRD §6.2 + upload multi-foto (drag & drop). */
export function ProductForm({ product }: { product?: AdminProduct }) {
  const router = useRouter();
  const [images, setImages] = useState<Img[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setImages((prev) => [...prev, ...data.urls.map((url: string) => ({ url, alt: "" }))]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onDelete() {
    if (!product) return;
    if (!window.confirm(`Delete "${product.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setDeleting(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (images.length === 0) {
      setError("Add at least one photo");
      return;
    }
    if (!images[0].alt.trim()) {
      setError("Add alt text for the primary photo — it powers accessibility & SEO");
      return;
    }
    setSaving(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("images", JSON.stringify(images));
    try {
      const res = await fetch("/api/admin/products", {
        method: product ? "PUT" : "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="grid gap-4">
        {product && <input type="hidden" name="id" value={product.id} />}
        <label className="grid gap-1.5">
          <span className={label}>Title</span>
          <input name="title" required defaultValue={product?.title} className={field} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className={label}>Slug</span>
            <input name="slug" required pattern="[a-z0-9-]+" defaultValue={product?.slug} className={field} />
          </label>
          <label className="grid gap-1.5">
            <span className={label}>Stone type</span>
            <input name="stoneType" required placeholder="e.g. Laguna agate" defaultValue={product?.stoneType} className={field} />
          </label>
        </div>
        <label className="grid gap-1.5">
          <span className={label}>Description</span>
          <textarea name="description" required rows={4} defaultValue={product?.description} className="rounded-[4px] border border-ink/20 bg-transparent p-3 text-[14px] leading-relaxed text-ink focus:outline-none focus:ring-1 focus:ring-gold" />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="grid gap-1.5">
            <span className={label}>Category</span>
            <select name="category" required defaultValue={product?.category} className={field}>
              <option value="CABOCHON">Cabochon</option>
              <option value="SLAB">Slab</option>
              <option value="ROUGH">Rough</option>
              <option value="FINISHED_PIECE">Finished piece</option>
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className={label}>Treatment</span>
            <select name="treatment" required defaultValue={product?.treatment ?? "NATURAL"} className={field}>
              <option value="NATURAL">Natural</option>
              <option value="DYED">Dyed</option>
              <option value="STABILIZED">Stabilized</option>
              <option value="HEAT_TREATED">Heat treated</option>
              <option value="OTHER">Other</option>
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className={label}>Form / cut</span>
            <input name="form" placeholder="oval, freeform…" defaultValue={product?.form} className={field} />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="grid gap-1.5"><span className={label}>Length mm</span><input name="lengthMm" type="number" step="0.1" defaultValue={product?.lengthMm ?? ""} className={field} /></label>
          <label className="grid gap-1.5"><span className={label}>Width mm</span><input name="widthMm" type="number" step="0.1" defaultValue={product?.widthMm ?? ""} className={field} /></label>
          <label className="grid gap-1.5"><span className={label}>Depth mm</span><input name="depthMm" type="number" step="0.1" defaultValue={product?.depthMm ?? ""} className={field} /></label>
        </div>
        <label className="flex items-start gap-2">
          <input type="checkbox" name="isConcept" defaultChecked={product?.isConcept ?? false} className="mt-0.5 size-4 accent-[#121214]" />
          <span>
            <span className="block text-[14px] font-medium text-ink">AI material study — not for sale</span>
            <span className="body-muted mt-1 block text-[13px]">Use for concept images that do not show an exact physical specimen.</span>
          </span>
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="grid gap-1.5"><span className={label}>Weight carat</span><input name="weightCarat" type="number" min="0" step="0.01" defaultValue={product?.weightCarat ?? ""} className={field} /></label>
          <label className="grid gap-1.5"><span className={label}>Weight gram</span><input name="weightGram" type="number" min="0" step="0.1" defaultValue={product?.weightGram ?? ""} className={field} /></label>
          <label className="grid gap-1.5"><span className={label}>Price USD</span><input name="priceUsd" type="number" step="0.01" required defaultValue={product ? product.priceCents / 100 : ""} className={field} /></label>
        </div>
        <p className="body-muted -mt-2 text-[13px]">A physical stone needs a weight in carats or grams before it can be published for sale.</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="grid gap-1.5"><span className={label}>Origin</span><input name="origin" placeholder="Chihuahua, Mexico" defaultValue={product?.origin} className={field} /></label>
          <label className="grid gap-1.5"><span className={label}>Color</span><input name="color" defaultValue={product?.color} className={field} /></label>
          <label className="grid gap-1.5">
            <span className={label}>Status</span>
            <select name="status" required defaultValue={product?.status ?? "DRAFT"} className={field}>
              <option value="DRAFT">Draft</option>
              <option value="AVAILABLE">Available</option>
              <option value="RESERVED">Reserved</option>
              <option value="SOLD">Sold</option>
              <option value="HIDDEN">Hidden</option>
            </select>
          </label>
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="featured" defaultChecked={product?.featured} className="size-4 accent-[#121214]" />
          <span className="text-[14px] text-ink">Featured on homepage</span>
        </label>
        <div className="grid gap-4 border-t border-ink/10 pt-4">
          <p className="eyebrow text-ink/60">SEO (optional — leave empty for automatic)</p>
          <label className="grid gap-1.5">
            <span className={label}>Meta title (maks 60)</span>
            <input name="metaTitle" maxLength={60} defaultValue={product?.metaTitle ?? ""} placeholder={product?.title ?? ""} className={field} />
          </label>
          <label className="grid gap-1.5">
            <span className={label}>Meta description (maks 160)</span>
            <textarea name="metaDescription" maxLength={160} rows={2} defaultValue={product?.metaDescription ?? ""} className="rounded-[4px] border border-ink/20 bg-transparent p-3 text-[14px] leading-relaxed text-ink focus:outline-none focus:ring-1 focus:ring-gold" />
          </label>
        </div>
      </div>

      {/* Foto */}
      <div>
        <p className={label}>Photos (first = primary)</p>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            void uploadFiles(e.dataTransfer.files);
          }}
          onClick={() => fileRef.current?.click()}
          className="mt-2 grid cursor-pointer place-items-center rounded-[4px] border border-dashed border-ink/30 bg-sketch p-6 text-center"
        >
          <span className="eyebrow text-ink/60">{uploading ? "Uploading…" : "Drop photos here or click — jpg/png/webp, ≤15 MB"}</span>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple hidden onChange={(e) => void uploadFiles(e.target.files)} />
        </div>
        <ul className="mt-3 space-y-2">
          {images.map((img, i) => (
            <li key={img.url + i} className="rounded-[4px] border border-ink/10 p-2">
              <div className="flex items-center gap-3">
                <span className="relative size-12 flex-none overflow-hidden rounded-[3px] bg-phold">
                  <Image src={img.url} alt="" fill sizes="48px" className="object-cover" unoptimized={img.url.endsWith(".svg")} />
                </span>
                <span className="eyebrow flex-1 truncate text-ink/60">{i === 0 ? "PRIMARY" : img.url.split("/").pop()}</span>
                <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))} className="eyebrow text-oxide">Remove</button>
              </div>
              <input
                value={img.alt}
                onChange={(e) => setImages(images.map((im, j) => (j === i ? { ...im, alt: e.target.value } : im)))}
                placeholder={i === 0 ? "Alt text — describe the stone (required)" : "Alt text (optional)"}
                aria-label={`Alt text for photo ${i + 1}`}
                className="mt-2 h-[36px] w-full rounded-[4px] border border-ink/15 bg-transparent px-2.5 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </li>
          ))}
        </ul>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 inline-flex h-[46px] w-full items-center justify-center gap-2.5 rounded-full bg-ink px-5 text-[15px] font-medium text-milk transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-60"
        >
          {saving ? "Saving…" : <>{product ? "Save changes" : "Publish stone"} <ArrowRight className="size-4" aria-hidden="true" /></>}
        </button>
        {product && (
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="mt-2 inline-flex h-[40px] w-full items-center justify-center rounded-full border border-oxide/40 px-5 text-[13px] font-medium text-oxide transition-colors hover:bg-oxide/10 disabled:opacity-60"
          >
            {deleting ? "Deleting…" : "Delete stone"}
          </button>
        )}
        {error && <p className="mt-3 text-[13px] text-oxide">{error}</p>}
      </div>
    </form>
  );
}
