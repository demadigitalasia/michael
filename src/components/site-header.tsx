import { MobileMenu } from "@/components/mobile-menu";
import { CartBadge } from "@/components/cart-badge";
import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/custom", label: "Custom" },
  { href: "/the-workshop", label: "The Workshop" },
  { href: "/care", label: "Care" },
  { href: "/journal", label: "Journal" },
];

/**
 * Nav pill frosted-glass (DESIGN-SPEC §4.7 — terukur dari referensi):
 * pil terpisah untuk Logo / Links / Bag, blur 18px, bg 70%, border putih 55%.
 */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-2 px-4 pt-4 sm:px-6">
      <Link
        href="/"
        className="flex h-11 items-center rounded-full border border-white/55 bg-[rgba(240,237,231,0.7)] px-5 backdrop-blur-[18px] transition-colors duration-200 hover:border-ink/30"
      >
        <span className="font-display text-[22px] font-bold uppercase leading-none tracking-[0.14em] text-ink">
          {site.shortName}
        </span>
      </Link>

      <nav
        aria-label="Main"
        className="hidden h-11 items-center gap-1 rounded-full border border-white/55 bg-[rgba(240,237,231,0.7)] px-2 backdrop-blur-[18px] lg:flex"
      >
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-full px-4 py-2 text-[15px] font-medium text-ink/80 transition-colors duration-150 hover:bg-ink/5 hover:text-ink"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <CartBadge />
        <MobileMenu links={links} />
      </div>
    </header>
  );
}
