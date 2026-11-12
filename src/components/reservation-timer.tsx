"use client";

import { useEffect, useState } from "react";

/**
 * Timer reservasi (PRD §6.3): hitung mundur dari reservedUntil (TTL 30 menit).
 * Tampilan mono — gaya "held for 29:41".
 */
export function ReservationTimer({ reservedUntil }: { reservedUntil: string | Date | null }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!reservedUntil) return;
    const until = new Date(reservedUntil).getTime();
    const tick = () => setLeft(Math.max(0, until - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [reservedUntil]);

  if (left === null || left <= 0) return null;
  const totalSec = Math.floor(left / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");

  return (
    <span className="eyebrow inline-flex items-center gap-1.5 text-gold" role="timer">
      <span aria-hidden>◔</span> held for {mm}:{ss}
    </span>
  );
}
