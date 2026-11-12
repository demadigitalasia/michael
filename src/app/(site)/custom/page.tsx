import { CustomFlow } from "@/components/custom-flow";
import { CustomOrderForm } from "@/components/custom-order-form";
import { Reveal } from "@/components/reveal";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export const metadata = {
  title: "Custom orders",
  description:
    "Custom pendants, matched pairs, carvings and intarsia — cut at our bench from rough you choose or send. Talk it through first, no obligation.",
};

const WAYS = [
  { title: "Pendants", body: "A cabochon cut around your idea, bezel-ready or set — bail formed by hand.", from: 120 },
  { title: "Matched pairs", body: "Two cabs cut from adjacent positions of one slab — orbs and banding that line up.", from: 140 },
  { title: "Carvings", body: "Worry stones, miniatures, freeform sculpture in agate, jasper and onyx.", from: 90 },
  { title: "Intarsia", body: "Stone-on-stone inlay pictures and boxes — the slowest work, the proudest results.", from: 220 },
];

const PRICING = [
  { title: "Pendants from $120", body: "Cab cut to your shape plus setting or bail, sterling or gold-filled." },
  { title: "Matched pairs from $140", body: "Earring sets matched across banding, cut from one slab." },
  { title: "Carvings from $90", body: "Palm stones and small carvings, sized to your sketch." },
  { title: "Intarsia from $220", body: "Multi-stone inlay — quoted per drawing after the sketch stage." },
];

export default async function CustomPage() {
  const reviews = await prisma.review.findMany({ where: { published: true }, take: 3 });

  return (
    <div className="pt-24">
      {/* Hero */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-12">
        <Reveal>
          <p className="eyebrow text-ink/60">Custom work · from $90</p>
          <h1 className="display mt-3 text-[clamp(44px,7vw,96px)] text-ink">Made for one person</h1>
          <p className="body-muted mt-4 max-w-[56ch] text-[17px] leading-relaxed">
            Pendants, matched pairs, carvings and intarsia. We talk it through, you pick the stone, we cut it at
            the bench — and you get progress photos along the way.
          </p>
        </Reveal>
      </div>

      {/* 4 langkah (scroll-driven, stage sketsa) */}
      <CustomFlow
        kicker="Custom orders"
        title="From rough to yours"
        steps={[
          { title: "Talk it through", body: "Send the idea — a photo, a sketch, or just a stone you want used. We reply with questions, not a form letter.", meta: "Free · no obligation" },
          { title: "Pick the stone", body: "Choose from pieces on the shop, or send your own rough. We tell you plainly what will and won’t cut well.", meta: "We source or you send" },
          { title: "We cut it", body: "Slabbed, shaped and polished at the bench — pendant, matched pair, carving or intarsia. Progress photos along the way.", meta: "2–6 weeks depending on the work" },
          { title: "It’s yours", body: "Delivered insured, with an origin note and a care card for the specific stone.", meta: "Insured delivery" },
        ]}
        stages={[
          { src: "/editorial/stage-1-blue-opal-rough.webp", tag: "ROUGH · YOUR STONE" },
          { src: "/editorial/stage-2-blue-opal-sawn.webp", tag: "SAWN · COLOUR REVEALED" },
          { src: "/editorial/stage-3-blue-opal-grinding.webp", tag: "SHAPED · ON THE WHEELS" },
          { src: "/editorial/stage-4-blue-opal-finished.webp", tag: "FINISHED · IN YOUR HANDS" },
        ]}
      />

      {/* Four ways to start */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-12">
        <Reveal>
          <p className="eyebrow text-ink/60">What we make</p>
          <h2 className="display mt-3 text-[clamp(44px,5.4vw,84px)] text-ink">Four ways to start</h2>
        </Reveal>
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {WAYS.map((w, i) => (
            <Reveal key={w.title} delay={i * 90}>
              <div className="border-t border-ink/15 pt-5">
                <p className="eyebrow text-ink/60">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-[19px] font-semibold text-ink">{w.title}</h3>
                <p className="body-muted mt-2 text-[14.5px] leading-normal">{w.body}</p>
                <p className="eyebrow mt-3 text-ink/60">from ${w.from}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pricing guide */}
      <section className="border-t border-ink/10">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-12">
          <Reveal>
            <p className="eyebrow text-ink/60">Pricing guide</p>
            <h2 className="display mt-3 text-[clamp(44px,5.4vw,84px)] text-ink">What it costs, in plain numbers</h2>
            <p className="body-muted mt-4 max-w-[56ch] text-[17px] leading-relaxed">
              We quote a fixed price after the drawing, so there are no surprises. These are typical starting
              points.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {PRICING.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <div className="border-t border-ink/15 pt-5">
                  <p className="eyebrow text-ink/60">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 text-[19px] font-semibold text-ink">{p.title}</h3>
                  <p className="body-muted mt-2 text-[14.5px] leading-normal">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="start" className="border-t border-ink/10 bg-sketch scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-12">
          <Reveal>
            <p className="eyebrow text-ink/60">Start a custom piece</p>
            <h2 className="display mt-3 text-[clamp(44px,5.4vw,84px)] text-ink">Tell us what you have in mind</h2>
            <p className="body-muted mt-4 max-w-[52ch] text-[17px] leading-relaxed">
              A few lines is plenty. We reply within two working days with questions, a rough price and a next
              step.
            </p>
          </Reveal>
          <div className="mt-10 max-w-3xl">
            <CustomOrderForm />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-12">
        <Reveal>
          <p className="eyebrow text-ink/60">Commissions, reviewed</p>
          <h2 className="display mt-3 text-[clamp(44px,5.4vw,84px)] text-ink">In their words</h2>
        </Reveal>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.id} delay={i * 90}>
              <figure className="border-t border-ink/15 pt-5">
                <blockquote className="text-[17px] leading-relaxed text-ink">“{r.quote}”</blockquote>
                <figcaption className="eyebrow mt-4 text-ink/60">{r.author} · {r.location}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
