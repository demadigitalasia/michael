import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { Lookbook } from "@/components/lookbook";
import { CustomFlow } from "@/components/custom-flow";
import { ProcessSteps } from "@/components/process-steps";
import { StatsCounters } from "@/components/stats-counters";
import { Ticker } from "@/components/ticker";
import { StatusBadge } from "@/components/status-badge";
import { countByCategory, getFeatured, listProducts } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import { categories, formatUsd, site } from "@/lib/site";

const HERO_IMG = "/editorial/hero-blue-opal-rough.png";

/** ISR: katalog berubah saat admin publish — revalidasi tiap 30 detik. */
export const revalidate = 30;

const WORKSHOP_STEPS = [
  {
    title: "Slabbed",
    body: "Every piece starts from rough we know the source of. The slab saw opens it up — banding, colour and flaws are judged under water.",
    spec: "Laguna agate · 6.4 kg lot · 0.8 mm blade",
  },
  {
    title: "Preformed",
    body: "The shape is drawn around the best banding, then dopped to a stick and ground to silhouette.",
    spec: "Freeform drawn around banding · 220 grit",
  },
  {
    title: "Ground",
    body: "Diamond wheels take it to shape, edge by edge, checking angles against the light.",
    spec: "280 → 600 grit · water cooled",
  },
  {
    title: "Sanded",
    body: "Successively finer grits remove every scratch the last one left. This is where most of the hours go.",
    spec: "800 → 3,000 grit",
  },
  {
    title: "Polished",
    body: "Cerium or tin oxide on leather, until the face turns to glass. Then a wash, a photograph, and a listing.",
    spec: "50,000 grit · cerium oxide",
  },
];

const CUSTOM_STEPS = [
  {
    title: "Talk it through",
    body: "Send the idea — a photo, a sketch, or just a stone you want used. We reply with questions, not a form letter.",
    meta: "Free · no obligation",
  },
  {
    title: "Pick the stone",
    body: "Choose from pieces on the shop, or send your own rough. We tell you plainly what will and won't cut well.",
    meta: "We source or you send",
  },
  {
    title: "We cut it",
    body: "Slabbed, shaped and polished at the bench — pendant, matched pair, carving or intarsia. Progress photos along the way.",
    meta: "2–6 weeks depending on the work",
  },
  {
    title: "It's yours",
    body: "Delivered insured, with an origin note and a care card for the specific stone.",
    meta: "Insured delivery",
  },
];

const CARE_ITEMS = [
  {
    title: "Free re-polish for a year",
    body: "Fine scratches from setting or daily wear — send it back and we re-polish the face at cost of postage.",
  },
  {
    title: "Setting advice for life",
    body: "Bezel widths, prong angles, wire wrap — for every cabochon we have cut, for as long as you own it.",
  },
  {
    title: "Care guides per stone",
    body: "Hardness, water sensitivity and storage, written per mineral — agates are not opals.",
  },
];

export default async function HomePage() {
  const [featured, latest, counts, reviews] = await Promise.all([
    getFeatured(),
    listProducts({ limit: 8 }),
    countByCategory(),
    prisma.review.findMany({ where: { published: true }, orderBy: { createdAt: "asc" } }),
  ]);

  const lookbookPhotos = latest.slice(0, 8).map((p) => ({
    src: p.images[0]?.url ?? HERO_IMG,
    caption: `${p.stoneType}${p.origin ? ", " + p.origin.split(",").pop()?.trim() : ""}`,
  }));

  return (
    <>
      {/* 1 · Hero */}
      <section className="relative min-h-[92svh] overflow-hidden">
        <Image src={HERO_IMG} alt="Blue-green rough stone with a broad exposed face and pale host rock on a lapidary workbench" fill preload sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-ink/10" />
        <div className="relative mx-auto flex min-h-[92svh] max-w-7xl flex-col justify-end px-4 pb-16 sm:px-6 lg:px-12">
          <h1 className="display text-milk text-[clamp(64px,12vw,160px)] leading-[0.95]">
            Cut by hand
            <br />
            Kept for life.
          </h1>
          <div className="mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <p className="body-muted-dark max-w-[46ch] text-lg leading-relaxed text-milk/90">
              {site.description} Every stone is finished at the bench, photographed as it is, and sold once — to one person.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className="inline-flex h-[46px] items-center gap-2.5 rounded-full bg-ink px-5 text-[15px] font-medium text-milk transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]">
                Shop new arrivals <span aria-hidden>→</span>
              </Link>
              <Link href="/custom" className="inline-flex h-[46px] items-center gap-2.5 rounded-full border border-milk/60 px-5 text-[15px] font-medium text-milk backdrop-blur-[6px] transition-colors duration-200 hover:bg-milk/10">
                Start a custom piece
              </Link>
            </div>
          </div>
        </div>
        {/* Annotation callouts — chip gelap agar terbaca di foto terang */}
        <div className="eyebrow absolute right-[6%] top-[22%] hidden lg:block">
          <span className="inline-block rounded-[4px] bg-ink/45 px-3 py-2 text-milk backdrop-blur-[4px]">
            <span className="text-gold">01</span> — Blue-green opal · rough in matrix
          </span>
        </div>
        <div className="eyebrow absolute bottom-[38%] right-[12%] hidden lg:block">
          <span className="inline-block rounded-[4px] bg-ink/45 px-3 py-2 text-milk backdrop-blur-[4px]">
            <span className="text-gold">02</span> — Slabbed, ground & polished at our bench
          </span>
        </div>
      </section>

      {/* 2 · Featured stone */}
      {featured && (
        <section className="mx-auto max-w-7xl px-4 py-[clamp(72px,10vh,120px)] sm:px-6 lg:px-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
            <Reveal>
              <div className="relative overflow-hidden rounded-[4px] bg-phold">
                <div className="aspect-[4/3]">
                  <Image
                    src={featured.images[0]?.url ?? HERO_IMG}
                    alt={featured.title}
                    fill
                    sizes="(min-width:1024px) 55vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute left-3 top-3">
                  <StatusBadge status={featured.status as never} />
                </div>
              </div>
            </Reveal>
            <Reveal delay={90}>
              <p className="eyebrow text-ink/60">Featured this week</p>
              <h2 className="display mt-3 text-[clamp(40px,5vw,72px)] text-ink">{featured.title}</h2>
              <p className="body-muted mt-5 max-w-[46ch] text-[17px] leading-relaxed">{featured.description}</p>
              <p className="mt-6 font-mono text-[13px] text-ink/60">
                {featured.stoneType} · {featured.weightCarat ?? featured.weightGram} {featured.weightCarat ? "ct" : "g"} · ships in 1–2 days
              </p>
              <div className="mt-6 flex items-baseline gap-6">
                <p className="font-display text-4xl font-bold tracking-tight text-ink">{formatUsd(featured.priceCents)}</p>
                <Link href={`/products/${featured.slug}`} className="inline-flex items-center gap-2 text-[15px] font-medium text-ink underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:text-gold">
                  View the stone <span aria-hidden>→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* 3 · Shop by category */}
      <section className="mx-auto max-w-7xl px-4 pb-[clamp(64px,9vh,110px)] sm:px-6 lg:px-12">
        <Reveal>
          <p className="eyebrow text-ink/60">Four categories · one bench</p>
          <h2 className="display mt-3 text-[clamp(44px,5.4vw,84px)] text-ink">Shop by category</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 90}>
              <Link href={`/collections#${c.slug}`} className="group block rounded-[4px] border border-ink/10 p-5 transition-colors duration-200 hover:border-ink/30">
                <p className="display text-2xl text-ink">{c.label}</p>
                <p className="eyebrow mt-2 text-ink/60">{counts[c.key] ?? 0} pieces</p>
                <span className="mt-8 inline-block text-ink transition-transform duration-200 group-hover:translate-x-1" aria-hidden>→</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 4 · Grid terbaru */}
      <section className="mx-auto max-w-7xl px-4 pb-[clamp(64px,9vh,110px)] sm:px-6 lg:px-12">
        <Reveal>
          <p className="eyebrow text-ink/60">Just cut</p>
          <h2 className="display mt-3 text-[clamp(44px,5.4vw,84px)] text-ink">Fresh off the wheels</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 90}>
              <ProductCard product={p} eager={i < 4} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <Link href="/shop" className="inline-flex items-center gap-2 text-[15px] font-medium text-ink underline decoration-gold decoration-2 underline-offset-4 hover:text-gold">
            All pieces <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </section>

      {/* 5 · The workshop (gelap, scroll-driven) */}
      <ProcessSteps steps={WORKSHOP_STEPS} />

      {/* 6 · Lookbook (pinned horizontal) */}
      <Lookbook photos={lookbookPhotos} />

      {/* 7 · Custom flow */}
      <CustomFlow
        steps={CUSTOM_STEPS}
        stages={[
          { src: "/editorial/stage-1-blue-opal-rough.png", tag: "ROUGH · BLUE-GREEN IN MATRIX" },
          { src: "/editorial/stage-2-blue-opal-sawn.png", tag: "SAWN · COLOUR REVEALED" },
          { src: "/editorial/stage-3-blue-opal-grinding.png", tag: "SHAPED · AT THE WHEEL" },
          { src: "/editorial/stage-4-blue-opal-finished.png", tag: "FINISHED · FREEFORM CABOCHON" },
        ]}
      />

      {/* 8 · Transparency stats */}
      <section className="mx-auto max-w-7xl px-4 pb-[clamp(72px,10vh,120px)] sm:px-6 lg:px-12">
        <Reveal>
          <p className="eyebrow text-ink/60">Materials & ethics</p>
          <h2 className="display mt-3 text-[clamp(44px,5.4vw,84px)] text-ink">Nothing hidden, nothing guessed</h2>
        </Reveal>
        <div className="mt-10">
          <StatsCounters
            stats={[
              { value: 100, suffix: "%", label: "Treatment disclosed", note: "Dyed or stabilized is written in the listing — every time, no exceptions." },
              { value: 412, label: "Stones cut last year", note: "By one pair of hands at one set of wheels, one stone at a time." },
              { value: 9, suffix: " h", label: "Hours per cabochon", note: "From the first sketch around the banding to the last pass on the leather." },
              { value: 0, label: "Undisclosed treatments", note: "We would rather lose the sale than the trust." },
            ]}
          />
        </div>
      </section>

      {/* 9 · Care */}
      <section className="border-t border-ink/10 bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-[clamp(72px,10vh,120px)] sm:px-6 lg:px-12">
          <Reveal>
            <p className="eyebrow text-ink/60">Care</p>
            <h2 className="display mt-3 text-[clamp(44px,5.4vw,84px)] text-ink">Looked after for life</h2>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {CARE_ITEMS.map((c, i) => (
              <Reveal key={c.title} delay={i * 90}>
                <div className="border-t border-ink/15 pt-5">
                  <p className="eyebrow text-ink/60">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 text-[19px] font-semibold text-ink">{c.title}</h3>
                  <p className="body-muted mt-2 text-[14.5px] leading-normal">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <Link href="/care" className="inline-flex items-center gap-2 text-[15px] font-medium text-ink underline decoration-gold decoration-2 underline-offset-4 hover:text-gold">
              Care guides & policies <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 10 · Reviews */}
      <section className="mx-auto max-w-7xl px-4 pb-[clamp(72px,10vh,120px)] sm:px-6 lg:px-12">
        <Reveal>
          <p className="eyebrow text-ink/60">Reviews · {reviews.length} orders</p>
          <h2 className="display mt-3 text-[clamp(44px,5.4vw,84px)] text-ink">In their words</h2>
        </Reveal>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.id} delay={i * 90}>
              <figure className="border-t border-ink/15 pt-5">
                <blockquote className="text-[17px] leading-relaxed text-ink">“{r.quote}”</blockquote>
                <figcaption className="eyebrow mt-4 text-ink/60">
                  {r.author} · {r.location}{r.productName ? ` · ${r.productName}` : ""}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 11 · Journal teaser */}
      <section className="border-t border-ink/10">
        <div className="mx-auto max-w-7xl px-4 py-[clamp(72px,10vh,120px)] sm:px-6 lg:px-12">
          <Reveal>
            <p className="eyebrow text-ink/60">Guides & studio notes</p>
            <h2 className="display mt-3 text-[clamp(44px,5.4vw,84px)] text-ink">From the journal</h2>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { title: "How to read a cabochon's measurements", excerpt: "Length, width, dome — what each number means for your setting.", tag: "Guide" },
              { title: "Treatment, explained honestly", excerpt: "Stabilized, dyed, heated: what each one does and why we disclose.", tag: "Materials" },
              { title: "How a slab becomes a cabochon", excerpt: "The five steps from rough to finished stone, with the hours it takes.", tag: "Studio" },
            ].map((a, i) => (
              <Reveal key={a.title} delay={i * 90}>
                <article className="border-t border-ink/15 pt-5">
                  <p className="eyebrow text-ink/60">{a.tag} · 4 min read</p>
                  <h3 className="mt-3 text-[19px] font-semibold leading-tight text-ink">{a.title}</h3>
                  <p className="body-muted mt-2 text-[14.5px] leading-normal">{a.excerpt}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 12 · Newsletter */}
      <section className="bg-bench text-milk">
        <div className="mx-auto max-w-7xl px-4 py-[clamp(72px,10vh,120px)] sm:px-6 lg:px-12">
          <Reveal>
            <p className="eyebrow text-milk/60">Letter from the workshop · monthly</p>
            <h2 className="display mt-3 max-w-[16ch] text-[clamp(44px,5.4vw,84px)]">New stones 48 hours before they go live</h2>
            <p className="body-muted-dark mt-5 max-w-[52ch] text-[17px] leading-relaxed">
              One email a month: new pieces 48 hours early, a studio story and the odd batch sale. No discounts shouted in capitals.
            </p>
            <form className="mt-8 flex max-w-md items-center gap-2" action="mailto:hello@example.com" method="get">
              <input
                type="email"
                required
                placeholder="Your email"
                className="h-[46px] w-full rounded-full border border-milk/25 bg-transparent px-5 text-[15px] text-milk placeholder:text-milk/40 focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <button type="submit" className="h-[46px] flex-none rounded-full bg-milk px-5 text-[15px] font-medium text-ink transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]">
                Join
              </button>
            </form>
            <p className="eyebrow mt-4 text-milk/50">We never share your address. Unsubscribe in one click.</p>
          </Reveal>
        </div>
      </section>

      {/* Ticker penutup */}
      <div className="border-t border-milk/12 bg-bench pb-10">
        <Ticker className="text-milk" />
      </div>
    </>
  );
}
