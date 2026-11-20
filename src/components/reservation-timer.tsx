"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Timer } from "@/components/icons";

/**
 * Timer reservasi (PRD §6.3): hitung mundur dari reservedUntil (TTL 30 menit).
 * Tampilan mono — gaya "held for 29:41". Saat hold habis: pesan jelas +
 * tombol re-reserve (bukan menghilang diam-diam).
 */
export function ReservationTimer({
  reservedUntil,
  productId,
}: {
  reservedUntil: string | Date | null;
  productId?: string;
}) {
  const router = useRouter();
  const [left, setLeft] = useState<number | null>(null);
  const [reReserving, setReReserving] = useState(false);

  useEffect(() => {
    if (!reservedUntil) return;
    const until = new Date(reservedUntil).getTime();
    const tick = () => setLeft(Math.max(0, until - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [reservedUntil]);

  async function reReserve() {
    if (!productId) return;
    setReReserving(true);
    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        window.dispatchEvent(new Event("cart:changed"));
        router.refresh();
      }
    } finally {
      setReReserving(false);
    }
  }

  if (!reservedUntil || left === null) return null;

  if (left <= 0) {
    return (
      <span className="eyebrow inline-flex flex-wrap items-center gap-1.5 text-oxide" role="timer">
        <Timer className="size-3.5" aria-hidden="true" /> hold expired
        {productId && (
          <button
            type="button"
            onClick={reReserve}
            disabled={reReserving}
            className="underline decoration-oxide/40 underline-offset-4 transition-colors hover:text-ink disabled:opacity-50"
          >
            {reReserving ? "Re-reserving…" : "Re-reserve"}
          </button>
        )}
      </span>
    );
  }

  const totalSec = Math.floor(left / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");

  return (
    <span className="eyebrow inline-flex items-center gap-1.5 text-gold" role="timer">
      <Timer className="size-3.5" aria-hidden="true" /> held for {mm}:{ss}
    </span>
  );
}
