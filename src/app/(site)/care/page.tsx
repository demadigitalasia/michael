import { Reveal } from "@/components/reveal";

export const metadata = {
  title: "Care & repairs",
  description: "How to care for agate, jasper, turquoise and opal — plus shipping, returns and the FAQ.",
};

const CARE_BY_MATERIAL = [
  { title: "Agate & jasper", body: "Mohs ~6.5–7: tough and unbothered. Warm water, a drop of soap, a soft brush. No chemicals needed, ever." },
  { title: "Turquoise (stabilized)", body: "Keep away from perfume and skin oils for long stretches; wipe after wearing. Stabilized means water won’t hurt it — natural turquoise is another story." },
  { title: "Opal & soft stones", body: "Opal holds water — never store it bone-dry for months, never boil it. Put soft stones on last, take them off first." },
];

const SERVICES = [
  { title: "Re-polish · free for the first year", body: "Fine scratches from setting or wear — send it back, we re-face it at cost of postage." },
  { title: "Setting advice · for life", body: "Bezel width, prong angles, wire wrap — for any stone we cut, for as long as you own it." },
  { title: "Re-finish slab faces", body: "Slabs dulling in a display case? We re-flat and re-polish both faces." },
  { title: "Care cards · always", body: "Every parcel ships with a card for the specific stones inside — hardness, water, storage." },
];

const FAQ = [
  {
    q: "Can every stone be re-polished?",
    a: "Almost. Agates, jaspers and onyx re-polish perfectly. Coated or waxed material sometimes can’t — we tell you before we take it in.",
  },
  {
    q: "Will polishing remove the maker's mark?",
    a: "No. Our mark is on the listing and the certificate, not cut into the stone — nothing to lose.",
  },
  {
    q: "Do you buy rough or take trade-ins?",
    a: "Sometimes. Email photos and weights; we answer honestly when it's not for us.",
  },
  {
    q: "How long does a re-polish take?",
    a: "Seven to ten days from arrival, most of it queue time on the bench.",
  },
];

export default function CarePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-12">
      <Reveal>
        <p className="eyebrow text-ink/60">Care and repairs</p>
        <h1 className="display mt-3 text-[clamp(44px,7vw,96px)] text-ink">Looked after for life</h1>
        <p className="body-muted mt-4 max-w-[56ch] text-[17px] leading-relaxed">
          How to keep agate, jasper, turquoise and opal looking right — and what we fix for free, whoever made
          the scratch.
        </p>
      </Reveal>

      {/* Care by material */}
      <section className="mt-16">
        <Reveal>
          <h2 className="display text-[clamp(32px,4vw,56px)] text-ink">Care by material</h2>
        </Reveal>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {CARE_BY_MATERIAL.map((c, i) => (
            <Reveal key={c.title} delay={i * 90}>
              <div className="border-t border-ink/15 pt-5">
                <p className="eyebrow text-ink/60">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-[19px] font-semibold text-ink">{c.title}</h3>
                <p className="body-muted mt-2 text-[14.5px] leading-normal">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="mt-20">
        <Reveal>
          <h2 className="display text-[clamp(32px,4vw,56px)] text-ink">What we do, and what it costs</h2>
        </Reveal>
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <div className="border-t border-ink/15 pt-5">
                <p className="eyebrow text-ink/60">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-[17px] font-semibold leading-snug text-ink">{s.title}</h3>
                <p className="body-muted mt-2 text-[14.5px] leading-normal">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Shipping & returns */}
      <section id="shipping" className="mt-20 scroll-mt-24 rounded-[6px] border border-ink/10 bg-sketch p-8 md:p-12">
        <Reveal>
          <p className="eyebrow text-ink/60">Shipping & returns</p>
          <h2 className="display mt-3 text-[clamp(32px,4vw,56px)] text-ink">Sent tracked, insured, and honestly packed</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-[17px] font-semibold text-ink">Shipping</h3>
              <p className="body-muted mt-2 text-[14.5px] leading-normal">
                Tracked and insured worldwide, dispatched within 1–2 business days. Rates by zone and weight,
                shown at checkout before you pay.
              </p>
            </div>
            <div>
              <h3 className="text-[17px] font-semibold text-ink">Returns</h3>
              <p className="body-muted mt-2 text-[14.5px] leading-normal">
                14 days, unworn and as shipped, for any reason. Return postage is on you; original postage is
                refunded on faults.
              </p>
            </div>
            <div>
              <h3 className="text-[17px] font-semibold text-ink">Customs</h3>
              <p className="body-muted mt-2 text-[14.5px] leading-normal">
                Import duties, where they apply, are the buyer’s — we declare every parcel honestly at full
                value.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section id="faq" className="mt-20 scroll-mt-24">
        <Reveal>
          <h2 className="display text-[clamp(32px,4vw,56px)] text-ink">Questions, answered plainly</h2>
        </Reveal>
        <div className="mt-8 max-w-3xl">
          {FAQ.map((f) => (
            <details key={f.q} className="group border-b border-ink/10 py-4" open={f === FAQ[0]}>
              <summary className="flex cursor-pointer list-none items-center justify-between text-[17px] font-semibold text-ink">
                {f.q} <span className="transition-transform group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="body-muted mt-3 max-w-[60ch] text-[14.5px] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
