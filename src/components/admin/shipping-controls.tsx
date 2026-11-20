"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type AdminRate = {
  id: string;
  zone: string;
  name: string;
  minWeightG: number;
  maxWeightG: number;
  priceCents: number;
  active: boolean;
};

const field =
  "h-[38px] w-full rounded-[4px] border border-ink/20 bg-transparent px-3 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-gold";

/** Edit tarif ongkir inline (zona, nama, rentang berat, harga, aktif) + hapus. */
export function ShippingControls({ rate }: { rate: AdminRate }) {
  const router = useRouter();
  const [form, setForm] = useState({ ...rate, priceUsd: (rate.priceCents / 100).toFixed(2) });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/shipping", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: rate.id,
          zone: form.zone,
          name: form.name,
          minWeightG: form.minWeightG,
          maxWeightG: form.maxWeightG,
          priceUsd: Number(form.priceUsd),
          active: form.active,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm(`Delete shipping rate "${form.name}"?`)) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/shipping", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rate.id }),
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
    <div className="mt-3 grid gap-2">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <input aria-label="Zone" value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} placeholder="Zone" className={field} />
        <input aria-label="Rate name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Rate name" className={field} />
        <label className="grid gap-0.5">
          <span className="eyebrow text-ink/40">min (g)</span>
          <input type="number" min="0" aria-label="Min weight grams" value={form.minWeightG} onChange={(e) => setForm({ ...form, minWeightG: Number(e.target.value) })} className={field} />
        </label>
        <label className="grid gap-0.5">
          <span className="eyebrow text-ink/40">max (g)</span>
          <input type="number" min="1" aria-label="Max weight grams" value={form.maxWeightG} onChange={(e) => setForm({ ...form, maxWeightG: Number(e.target.value) })} className={field} />
        </label>
        <label className="grid gap-0.5">
          <span className="eyebrow text-ink/40">price USD</span>
          <input type="number" step="0.01" min="0" aria-label="Price USD" value={form.priceUsd} onChange={(e) => setForm({ ...form, priceUsd: e.target.value })} className={field} />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-[13px] text-ink">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="size-4 accent-[#121214]" />
          Active at checkout
        </label>
        <button onClick={save} disabled={saving} className="inline-flex h-[38px] items-center rounded-full bg-ink px-4 text-[13px] font-medium text-milk transition-transform hover:-translate-y-0.5 disabled:opacity-60">
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
