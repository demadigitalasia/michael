"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["NEW", "QUOTED", "IN_PROGRESS", "COMPLETED", "DECLINED"] as const;

/** Ubah status inquiry custom + catatan internal. */
export function InquiryControls({ id, status, adminNotes }: { id: string; status: string; adminNotes: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ status, adminNotes });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/admin/custom-orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="h-[38px] rounded-[4px] border border-ink/20 bg-transparent px-3 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-gold">
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <input placeholder="Internal notes…" value={form.adminNotes} onChange={(e) => setForm({ ...form, adminNotes: e.target.value })} className="h-[38px] flex-1 rounded-[4px] border border-ink/20 bg-transparent px-3 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-gold" />
      <a href={`mailto:reply?subject=Your custom inquiry`} className="hidden" aria-hidden />
      <button onClick={save} disabled={saving} className="inline-flex h-[38px] items-center rounded-full bg-ink px-4 text-[13px] font-medium text-milk transition-transform hover:-translate-y-0.5 disabled:opacity-60">
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
