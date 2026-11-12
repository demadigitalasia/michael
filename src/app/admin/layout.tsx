import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/auth";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/custom-orders", label: "Custom inbox" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const email = await getAdminEmail();

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-ink/10 bg-bench text-milk">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-display text-[18px] font-bold uppercase tracking-[0.14em]">
              Bench desk
            </Link>
            <nav className="flex gap-1" aria-label="Admin">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-full px-3.5 py-1.5 text-[14px] font-medium text-milk/75 transition-colors hover:bg-milk/10 hover:text-milk"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="eyebrow text-milk/50">{email ?? "—"}</span>
            <form action="/api/admin/logout" method="post">
              <button className="eyebrow text-milk/60 underline underline-offset-4 hover:text-milk" type="submit">
                Sign out
              </button>
            </form>
            <Link href="/" className="eyebrow text-milk/60 underline underline-offset-4 hover:text-milk">
              View site ↗
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}

export async function generateMetadata() {
  return { title: "Admin · Michael Lapidary" };
}

// guard: middleware handles auth, but double-check server-side
export async function onUnauthorized() {
  redirect("/admin/login");
}
