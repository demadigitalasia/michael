import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[80svh] max-w-7xl flex-col justify-center px-4 pb-24 pt-32 sm:px-6 lg:px-12">
      <p className="eyebrow text-ink/60">404 — nothing at this address</p>
      <h1 className="display mt-4 text-[clamp(48px,8vw,120px)] text-ink">
        Stone not found.
      </h1>
      <p className="body-muted mt-5 max-w-[46ch] text-[17px] leading-relaxed">
        This one may have sold — every piece here is one of a kind. The bench cuts
        something new every week; start from the shop.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/shop"
          className="inline-flex h-[46px] items-center gap-2.5 rounded-full bg-ink px-5 text-[15px] font-medium text-milk transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
        >
          Shop new arrivals <span aria-hidden>→</span>
        </Link>
        <Link
          href="/custom"
          className="inline-flex h-[46px] items-center gap-2.5 rounded-full border border-ink/25 px-5 text-[15px] font-medium text-ink transition-colors duration-200 hover:border-ink/60"
        >
          Start a custom piece
        </Link>
      </div>
    </div>
  );
}
