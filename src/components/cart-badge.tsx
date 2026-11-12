"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/** Badge count Bag — client, fetch ke /api/cart/count, refresh saat event 'cart:changed'. */
export function CartBadge() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const load = () =>
      fetch("/api/cart/count", { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => setCount(d.count ?? 0))
        .catch(() => setCount(0));
    load();
    window.addEventListener("cart:changed", load);
    return () => window.removeEventListener("cart:changed", load);
  }, []);

  return (
    <Link
      href="/cart"
      className="flex h-11 items-center gap-2 rounded-full border border-white/55 bg-[rgba(240,237,231,0.7)] px-5 backdrop-blur-[18px] transition-colors duration-150 hover:bg-ink/5"
    >
      <span className="text-[15px] font-medium text-ink">Bag</span>
      <span
        className="flex size-6 items-center justify-center rounded-full bg-ink font-mono text-[11px] font-medium text-milk"
        aria-label={count === null ? "Bag" : `${count} items in bag`}
      >
        {count ?? "–"}
      </span>
    </Link>
  );
}
