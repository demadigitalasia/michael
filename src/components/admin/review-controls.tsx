"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type AdminReview = {
  id: string;
  author: string;
  location: string;
  productName: string;
  quote: string;
  rating: number;
  published: boolean;
};

const field =
  "h-[38px] w-full rounded-[4px] border border-ink/20 bg-transparent px-3 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-gold";

/** Edit kartu testimoni secara inline + toggle publish + hapus. */
export function ReviewControls({ review }: { review: AdminReview }) {
  const router = useRouter();
  const [form, setForm] = useState(review);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(partial?: Partial<AdminReview>) {
    setSaving(true);
    setError(null);
    try {
      const body = { ...form, ...partial };
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setForm(body);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm(`Delete the review from "${form.author}"?`)) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: review.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setDeleting(false);
    }
  }

  return (
    <div className="mt-4 grid gap-2">
      <div className="grid gap-2 sm:grid-cols-3">
        <input aria-label="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className={field} />
        <input aria-label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className={field} />
        <input aria-label="Product name" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} placeholder="Product" className={field} />
      </div>
      <textarea
        aria-label="Quote"
        value={form.quote}
        onChange={(e) => setForm({ ...form, quote: e.target.value })}
        rows={2}
        className="rounded-[4px] border border-ink/20 bg-transparent p-3 text-[13px] leading-relaxed text-ink focus:outline-none focus:ring-1 focus:ring-gold"
      />
      <div className="flex flex-wrap items-center gap-2">
        <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} aria-label="Rating" className="h-[38px] rounded-[4px] border border-ink/20 bg-transparent px-2 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-gold">
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} {r === 1 ? "star" : "stars"}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-[13px] text-ink">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="size-4 accent-[#121214]" />
          Published on site
        </label>
        <button onClick={() => save()} disabled={saving} className="inline-flex h-[38px] items-center rounded-full bg-ink px-4 text-[13px] font-medium text-milk transition-transform hover:-translate-y-0.5 disabled:opacity-60">
          {saving ? "Saving…" : "Save"}
        </button>
        <button onClick={remove} disabled={deleting} className="inline-flex h-[38px] items-center rounded-full border border-oxide/40 px-4 text-[13px] font-medium text-oxide transition-colors hover:bg-oxide/10 disabled:opacity-60">
          {deleting ? "Deleting…" : "Delete"}
        </button>
        {error && <span className="text-[12px] text-oxide">{error}</span>}
      </div>
    </div>
  );
}
