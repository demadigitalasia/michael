"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Tombol hapus item dari bag — melepas reservasi + refresh badge. */
export function RemoveItem({ productId }: { productId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function remove() {
    setLoading(true);
    await fetch(`/api/cart/items?productId=${productId}`, { method: "DELETE" });
    window.dispatchEvent(new Event("cart:changed"));
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={remove}
      disabled={loading}
      className="eyebrow text-ink/50 underline decoration-ink/20 underline-offset-4 transition-colors hover:text-oxide"
    >
      {loading ? "Removing…" : "Remove"}
    </button>
  );
}
