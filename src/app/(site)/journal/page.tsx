import { Reveal } from "@/components/reveal";
import { Ticker } from "@/components/ticker";
import Link from "next/link";

export const metadata = {
  title: "Journal",
  description: "Guides to buying, caring for and cutting semi-precious stone — and notes from the workshop.",
};

const POSTS = [
  { tag: "Guide", title: "How to read a cabochon's measurements", excerpt: "Length, width, dome — what each number means for your setting, and why the dome matters as much as the face.", read: "4 min read" },
  { tag: "Materials", title: "Treatment, explained honestly", excerpt: "Stabilized, dyed, heated: what each one actually does to the stone, and why we write it on every listing.", read: "5 min read" },
  { tag: "Guide", title: "How to choose a slab", excerpt: "Banding density, cracks that hide under water, and the three things to check before you commit a slab to the saw.", read: "3 min read" },
  { tag: "Care", title: "Caring for agate, jasper and turquoise", excerpt: "Soap, water and common sense — with the few real exceptions that ruin stones.", read: "4 min read" },
  { tag: "Studio", title: "A week at the wheels", excerpt: "What actually happens between an order arriving and a parcel leaving the bench.", read: "5 min read" },
  { tag: "Custom", title: "Commission: an intarsia box, start to finish", excerpt: "A real commission — six stones, one drawing, and the eleven weeks in between.", read: "6 min read" },
];

export default function JournalPage() {
  return (
    <div className="pt-24">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-12">
        <Reveal>
          <p className="eyebrow text-ink/60">Journal</p>
          <h1 className="display mt-3 text-[clamp(44px,7vw,96px)] text-ink">Notes from the wheels</h1>
          <p className="body-muted mt-4 max-w-[56ch] text-[17px] leading-relaxed">
            Guides to buying and caring for stone, stories about commissions, and what a week at the bench looks
            like.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 90}>
              <article className="group border-t border-ink/15 pt-5">
                <p className="eyebrow text-ink/60">{p.tag} · {p.read}</p>
                <h2 className="mt-3 text-[19px] font-semibold leading-snug text-ink transition-colors group-hover:text-gold">
                  {p.title}
                </h2>
                <p className="body-muted mt-2 text-[14.5px] leading-normal">{p.excerpt}</p>
                <span className="eyebrow mt-4 inline-block text-ink/50 transition-transform duration-200 group-hover:translate-x-1">
                  Read <span aria-hidden>→</span>
                </span>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 border-t border-ink/10 pt-10">
          <Ticker size={36} />
        </div>

        {/* CTA band */}
        <Reveal className="mt-16">
          <div className="grid items-center gap-6 rounded-[6px] border border-ink/10 bg-sketch p-8 md:grid-cols-[1fr_auto] md:p-12">
            <div>
              <p className="eyebrow text-ink/60">Guide</p>
              <h2 className="display mt-3 text-[clamp(32px,4vw,56px)] text-ink">Not sure which cabochon fits your setting?</h2>
              <p className="body-muted mt-3 max-w-[52ch] text-[15.5px] leading-relaxed">
                Send us the setting’s dimensions and we’ll point you to the stones that fit — or cut one to size.
              </p>
            </div>
            <Link href="/contact" className="inline-flex h-[46px] items-center gap-2.5 justify-self-start rounded-full bg-ink px-5 text-[15px] font-medium text-milk transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97] md:justify-self-end">
              Ask the bench <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
