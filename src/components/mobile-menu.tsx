"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Menu, X } from "@/components/icons";

export function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const dialogId = useId();

  useEffect(() => {
    const desktop = matchMedia("(min-width: 64rem)");
    const closeOnDesktop = () => {
      if (desktop.matches) dialog.current?.close();
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => {
          dialog.current?.showModal();
          closeButton.current?.focus();
          setOpen(true);
        }}
        className="flex size-11 items-center justify-center rounded-full border border-white/55 bg-[rgba(240,237,231,0.7)] backdrop-blur-[18px] lg:hidden"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-expanded={open}
      >
        <Menu aria-hidden="true" className="size-5" strokeWidth={1.7} />
      </button>

      <dialog
        ref={dialog}
        id={dialogId}
        aria-label="Site menu"
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
        className="mobile-nav-dialog fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-bench px-6 pb-6 pt-5 text-milk"
      >
        <div className="flex items-center justify-between gap-4">
          <BrandLogo tone="light" size="large" />
          <button
            ref={closeButton}
            type="button"
            onClick={() => dialog.current?.close()}
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-milk/30 focus-visible:outline-milk"
            aria-label="Close menu"
          >
            <X aria-hidden="true" className="size-5" strokeWidth={1.7} />
          </button>
        </div>
        <nav className="mt-7 flex flex-col [@media(min-height:680px)]:mt-14" aria-label="Mobile">
          {[...links, { href: "/cart", label: "Bag" }].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => dialog.current?.close()}
              className="display border-t border-milk/12 py-3 text-[clamp(27px,8vw,36px)] text-milk transition-colors hover:text-gold focus-visible:outline-milk [@media(min-height:680px)]:py-4"
            >
              {label}
            </Link>
          ))}
        </nav>
      </dialog>
    </>
  );
}
