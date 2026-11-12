"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

/** Menu full-screen gelap untuk mobile — gaya referensi (bg bench, link Antonio besar). */
export function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex size-11 items-center justify-center rounded-full border border-white/55 bg-[rgba(240,237,231,0.7)] backdrop-blur-[18px] lg:hidden"
        aria-label="Open menu"
      >
        <span className="flex w-5 flex-col gap-[5px]">
          <span className="h-px w-full bg-ink" />
          <span className="h-px w-full bg-ink" />
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-bench px-6 pb-8 pt-5 text-milk"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between">
            <BrandLogo tone="light" size="large" />
            <button
              onClick={() => setOpen(false)}
              className="flex size-11 items-center justify-center rounded-full border border-milk/30"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <nav className="mt-14 flex flex-col" aria-label="Mobile">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-4 border-t border-milk/12 py-4"
              >
                <span className="eyebrow text-milk/50">{String(i + 1).padStart(2, "0")}</span>
                <span className="display text-4xl text-milk transition-colors group-hover:text-gold">
                  {l.label}
                </span>
              </Link>
            ))}
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="group flex items-baseline gap-4 border-t border-milk/12 py-4"
            >
              <span className="eyebrow text-milk/50">07</span>
              <span className="display text-4xl text-milk transition-colors group-hover:text-gold">Bag</span>
            </Link>
          </nav>
          <p className="mt-auto eyebrow text-milk/50">One stone at a time</p>
        </div>
      )}
    </>
  );
}
