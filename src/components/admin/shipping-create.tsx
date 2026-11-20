"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "@/components/icons";

const field =
  "h-[42px] w-full rounded-[4px] border border-ink/20 bg-transparent px-3 text-[14px] text-ink focus:outline-none focus:ring-1 focus:ring-gold";

/** Form tambah tarif ongkir baru. */
export function ShippingCreate() {
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
      const res = await fetch("/api/admin/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zone: fd.get("zone"),
          name: fd.get("name"),
          minWeightG: Number(fd.get("minWeightG") ?? 0),
          maxWeightG: Number(fd.get("maxWeightG") ?? 2000),
          priceUsd: Number(fd.get("priceUsd") ?? 0),
          active: fd.get("active") === "on",
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
        + Add rate
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-[4px] border border-ink/15 bg-sketch p-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="grid gap-1">
          <span className="eyebrow text-ink/60">Zone *</span>
          {/* Hanya dua zona yang dikenali validasi checkout (lib/shipping) — jangan free-text */}
          <select name="zone" required defaultValue="" className={field}>
            <option value="" disabled>
              Zone…
            </option>
            <option value="domestic">Domestic — Indonesia</option>
            <option value="international">International</option>
          </select>
        </label>
        <label className="grid gap-1">
          <span className="eyebrow text-ink/60">Rate name *</span>
          <input name="name" required maxLength={120} placeholder="Domestic tracked" className={field} />
        </label>
        <label className="grid gap-1">
          <span className="eyebrow text-ink/60">Min weight (g)</span>
          <input name="minWeightG" type="number" min="0" defaultValue={0} className={field} />
        </label>
        <label className="grid gap-1">
          <span className="eyebrow text-ink/60">Max weight (g)</span>
          <input name="maxWeightG" type="number" min="1" defaultValue={500} className={field} />
        </label>
        <label className="grid gap-1">
          <span className="eyebrow text-ink/60">Price USD *</span>
          <input name="priceUsd" type="number" step="0.01" min="0" required className={field} />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-[13px] text-ink">
          <input type="checkbox" name="active" defaultChecked className="size-4 accent-[#121214]" />
          Active at checkout
        </label>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={() => setOpen(false)} className="eyebrow text-ink/60 underline underline-offset-4">Cancel</button>
          <button type="submit" disabled={saving} className="inline-flex h-[40px] items-center gap-1.5 rounded-full bg-ink px-4 text-[13px] font-medium text-milk transition-transform hover:-translate-y-0.5 disabled:opacity-60">
            {saving ? "Saving…" : <>Add rate <ArrowRight className="size-4" aria-hidden="true" /></>}
          </button>
        </div>
      </div>
      {error && <p className="text-[13px] text-oxide">{error}</p>}
    </form>
  );
}
