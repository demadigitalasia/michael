"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Hapus satu pelanggan newsletter (dengan konfirmasi). */
export function SubscriberDelete({ id, email }: { id: string; email: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    if (!window.confirm(`Remove ${email} from the list?`)) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/subscribers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
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
    <span className="flex items-center gap-3">
      {error && <span className="text-[12px] text-oxide">{error}</span>}
      <button onClick={remove} disabled={deleting} className="eyebrow text-oxide underline underline-offset-4 disabled:opacity-60">
        {deleting ? "…" : "Remove"}
      </button>
    </span>
  );
}
