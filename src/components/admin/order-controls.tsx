"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Ubah status pesanan + input tracking (memicu email shipped ke pembeli). */
export function OrderControls({
  id,
  status,
  trackingNumber,
  courier,
}: {
  id: string;
  status: string;
  trackingNumber: string | null;
  courier: string | null;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ status, trackingNumber: trackingNumber ?? "", courier: courier ?? "" });

  const field = "h-[38px] rounded-[4px] border border-ink/20 bg-transparent px-3 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-gold";

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...form }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={field}>
        {["PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"].map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <input placeholder="Courier" value={form.courier} onChange={(e) => setForm({ ...form, courier: e.target.value })} className={field} />
      <input placeholder="Tracking number" value={form.trackingNumber} onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })} className={field} />
      <button onClick={save} disabled={saving} className="inline-flex h-[38px] items-center rounded-full bg-ink px-4 text-[13px] font-medium text-milk transition-transform hover:-translate-y-0.5 disabled:opacity-60">
        {saving ? "Saving…" : "Save & notify →"}
      </button>
    </div>
  );
}
