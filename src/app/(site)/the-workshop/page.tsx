import { ProcessSteps } from "@/components/process-steps";
import { StatsCounters } from "@/components/stats-counters";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

export const metadata = {
  title: "The workshop",
  description: "How a stone gets cut: slabbed, preformed, ground, sanded and polished — one stone at a time.",
};

const TOOLS = [
  { title: "Slab saw", body: "A flat-lap and slab saw open the rough — banding and flaws are judged under water." },
  { title: "Dop sticks & arbors", body: "Stones are waxed to sticks and ground to silhouette on the arbors." },
  { title: "Diamond wheels & laps", body: "From 80-grit shaping wheels to 50,000-grit polish, one grit at a time." },
  { title: "Polish & loupe", body: "Cerium on leather for agates and jasper; a 10× loupe signs off every face." },
];

const ORIGIN = [
  { title: "Named-origin rough", body: "Agates from named claims and lots — Laguna from Chihuahua, Botswana from managed digs. The origin goes on every listing." },
  { title: "Treatment disclosed", body: "Stabilized turquoise says stabilized; dyed says dyed. Natural means untouched but the polish." },
  { title: "One stone, one listing", body: "Nothing is restocked — when a stone sells, it is gone and the listing stays as a record." },
];

export default function WorkshopPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-12">
        <Reveal>
          <p className="eyebrow text-ink/60">The workshop · {site.name}</p>
          <h1 className="display mt-3 text-[clamp(44px,7vw,96px)] text-ink">One pair of hands, one set of wheels</h1>
          <p className="body-muted mt-4 max-w-[56ch] text-[17px] leading-relaxed">
            Everything we sell is cut here, by hand, from rough of known origin. This page shows how — step by
            step, with the hours it takes.
          </p>
        </Reveal>
      </div>

      {/* Proses (scroll-driven, counter hidup) */}
      <div className="mt-14">
        <ProcessSteps
          kicker="The workshop · how a stone gets cut"
          title="One stone at a time"
          photo={{ src: "/editorial/stage-2-blue-opal-sawn.webp", caption: "Slabbing — banding judged under water" }}
          steps={[
            { title: "Slabbed", body: "The slab saw opens the rough under water — banding, colour and flaws judged face by face.", spec: "Laguna agate · 6.4 kg lot · 0.8 mm blade" },
            { title: "Preformed", body: "The shape is drawn around the best banding, then dopped to a stick and ground to silhouette.", spec: "Freeform drawn around banding · 220 grit" },
            { title: "Ground", body: "Diamond wheels take it to shape, edge by edge, checking angles against the light.", spec: "280 → 600 grit · water cooled" },
            { title: "Sanded", body: "Successively finer grits remove every scratch the last one left. This is where most of the hours go.", spec: "800 → 3,000 grit" },
            { title: "Polished", body: "Cerium or tin oxide on leather, until the face turns to glass. Then a wash, a photograph, and a listing.", spec: "50,000 grit · cerium oxide" },
          ]}
        />
      </div>

      {/* Tools */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-12">
        <Reveal>
          <p className="eyebrow text-ink/60">The tools</p>
          <h2 className="display mt-3 text-[clamp(44px,5.4vw,84px)] text-ink">Old tools, used every day</h2>
        </Reveal>
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((t, i) => (
            <Reveal key={t.title} delay={i * 90}>
              <div className="border-t border-ink/15 pt-5">
                <p className="eyebrow text-ink/60">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-[19px] font-semibold text-ink">{t.title}</h3>
                <p className="body-muted mt-2 text-[14.5px] leading-normal">{t.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-ink/10">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-12">
          <Reveal>
            <p className="eyebrow text-ink/60">Since the first wheel</p>
            <h2 className="display mt-3 text-[clamp(44px,5.4vw,84px)] text-ink">The workshop in numbers</h2>
          </Reveal>
          <div className="mt-10">
            <StatsCounters
              stats={[
                { value: 100, suffix: "%", label: "Treatment disclosed", note: "Written in every listing, every time." },
                { value: 412, label: "Stones cut last year", note: "One pair of hands at one bench." },
                { value: 9, suffix: " h", label: "Hours per cabochon", note: "From first sketch to final polish." },
                { value: 0, label: "Undisclosed treatments", note: "Rather lose the sale than the trust." },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Origin */}
      <section className="border-t border-ink/10">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-12">
          <Reveal>
            <p className="eyebrow text-ink/60">Where it comes from</p>
            <h2 className="display mt-3 text-[clamp(44px,5.4vw,84px)] text-ink">Traceable rough, honest notes</h2>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {ORIGIN.map((o, i) => (
              <Reveal key={o.title} delay={i * 90}>
                <div className="border-t border-ink/15 pt-5">
                  <p className="eyebrow text-ink/60">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 text-[19px] font-semibold text-ink">{o.title}</h3>
                  <p className="body-muted mt-2 text-[14.5px] leading-normal">{o.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
