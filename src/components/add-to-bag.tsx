"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Tombol Add to Bag — memanggil /api/cart/items (mereview produk: AVAILABLE → RESERVED,
 * TTL 30 menit, PRD §6.3) lalu menuju /cart.
 */
export function AddToBag({
  productId,
  disabled,
  status,
}: {
  productId: string;
  disabled: boolean;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "SOLD") {
    return (
      <button
        disabled
        className="inline-flex h-[52px] w-full cursor-not-allowed items-center justify-center rounded-full bg-ink/20 text-[15px] font-medium text-ink/50"
      >
        Sold — one of a kind
      </button>
    );
  }

  const label = status === "RESERVED" ? "Reserved — try anyway" : "Add to bag";

  async function add() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not add to bag");
        router.refresh();
        return;
      }
      window.dispatchEvent(new Event("cart:changed"));
      router.push("/cart");
    } catch {
      setError("Network error — try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={add}
        disabled={loading || disabled}
        className="inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-ink text-[15px] font-medium text-milk transition-transform duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-60"
      >
        {loading ? "Reserving…" : `${label} →`}
      </button>
      {error && <p className="mt-2 text-[13px] text-oxide">{error}</p>}
      {!error && status !== "RESERVED" && (
        <p className="eyebrow mt-3 text-ink/50">Held for 30 minutes once in your bag</p>
      )}
    </div>
  );
}
