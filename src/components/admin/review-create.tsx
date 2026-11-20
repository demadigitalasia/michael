"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "@/components/icons";

const field =
  "h-[42px] w-full rounded-[4px] border border-ink/20 bg-transparent px-3 text-[14px] text-ink focus:outline-none focus:ring-1 focus:ring-gold";

/** Form tambah testimoni baru (tersembunyi sampai diklik). */
export function ReviewCreate() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: fd.get("author"),
          location: fd.get("location") ?? "",
          productName: fd.get("productName") ?? "",
          quote: fd.get("quote"),
          rating: Number(fd.get("rating") ?? 5),
          published: fd.get("published") === "on",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Create failed");
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="eyebrow text-ink underline underline-offset-4 hover:text-ink/70">
        + Add review
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-[4px] border border-ink/15 bg-sketch p-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-1">
          <span className="eyebrow text-ink/60">Author *</span>
          <input name="author" required maxLength={120} className={field} />
        </label>
        <label className="grid gap-1">
          <span className="eyebrow text-ink/60">Location</span>
          <input name="location" maxLength={120} className={field} />
        </label>
        <label className="grid gap-1">
          <span className="eyebrow text-ink/60">Product</span>
          <input name="productName" maxLength={200} className={field} />
        </label>
      </div>
      <label className="grid gap-1">
        <span className="eyebrow text-ink/60">Quote *</span>
        <textarea name="quote" required rows={3} maxLength={1000} className="rounded-[4px] border border-ink/20 bg-transparent p-3 text-[14px] leading-relaxed text-ink focus:outline-none focus:ring-1 focus:ring-gold" />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-[13px] text-ink">
          <span className="eyebrow text-ink/60">Rating</span>
          <select name="rating" defaultValue="5" className="h-[38px] rounded-[4px] border border-ink/20 bg-transparent px-2 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-gold">
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} {r === 1 ? "star" : "stars"}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-[13px] text-ink">
          <input type="checkbox" name="published" defaultChecked className="size-4 accent-[#121214]" />
          Published on site
        </label>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={() => setOpen(false)} className="eyebrow text-ink/60 underline underline-offset-4">Cancel</button>
          <button type="submit" disabled={saving} className="inline-flex h-[40px] items-center gap-1.5 rounded-full bg-ink px-4 text-[13px] font-medium text-milk transition-transform hover:-translate-y-0.5 disabled:opacity-60">
            {saving ? "Saving…" : <>Add review <ArrowRight className="size-4" aria-hidden="true" /></>}
          </button>
        </div>
      </div>
      {error && <p className="text-[13px] text-oxide">{error}</p>}
    </form>
  );
}
