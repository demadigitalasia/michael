import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { getAdminEmail } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const email = await getAdminEmail();

  // Belum login (halaman login): render card saja tanpa header admin
  if (!email) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-ink/10 bg-bench text-milk">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
              <Link href="/admin" className="font-display text-[18px] font-bold uppercase tracking-[0.14em]">
                Bench desk
              </Link>
              <AdminNav />
            </div>
            <div className="flex items-center gap-4">
              <span className="eyebrow text-milk/50">{email}</span>
              <form action="/api/admin/logout" method="post">
                <button className="eyebrow text-milk/60 underline underline-offset-4 hover:text-milk" type="submit">
                  Sign out
                </button>
              </form>
              <Link href="/" className="eyebrow inline-flex items-center gap-1 text-milk/60 underline underline-offset-4 hover:text-milk">
                View site <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}

export async function generateMetadata() {
  // absolute: hindari template root "%s · Michael Lapidary" → judul dobel
  return { title: { absolute: "Admin · Michael Lapidary" } };
}
