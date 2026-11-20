"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/custom-orders", label: "Custom inbox" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/shipping", label: "Shipping" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/settings", label: "Settings" },
];

/** Nav admin: 8 menu dengan penanda halaman aktif + wrap rapi di ponsel. */
export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1" aria-label="Admin">
      {nav.map((n) => {
        const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 text-[14px] font-medium transition-colors ${
              active
                ? "bg-milk/15 text-milk"
                : "text-milk/75 hover:bg-milk/10 hover:text-milk"
            }`}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
