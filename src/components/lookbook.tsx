"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useReducedMotion } from "framer-motion";

export type LookbookPhoto = { src: string; caption: string };

/**
 * Lookbook — port JwLookbook (MOTION-SPEC §2.3):
 * Desktop: section di-PIN (sticky 100vh), scroll vertikal menggerakkan track horizontal.
 * - Judul raksasa background: Antonio clamp(120→300px), opacity .08, parallax 0.35×
 * - Gambar: scale(1.18) tetap + parallax horizontal dalam frame
 * - Counter 01/08 + progress bar scaleX
 * - Offset vertikal berjenjang (i%3)*3vh
 * Mobile (<810px): scroll-snap carousel, tanpa pin/parallax.
 */
export function Lookbook({
  photos,
  kicker = "From the bench · this season's cuts",
  title = "Where they come from",
  note = "Photographed on the bench where they were cut, beside the rough they came from, and in the hand at life size.",
}: {
  photos: LookbookPhoto[];
  kicker?: string;
  title?: string;
  note?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const imgsRef = useRef<(HTMLDivElement | null)[]>([]);
  const bigRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [mobile, setMobile] = useState(false);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 809px)");
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Desktop: drive transforms from scroll progress (rAF pattern port)
  useEffect(() => {
    if (mobile || reduce) return;
    const unsub = scrollYProgress.on("change", (t) => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;
      const over = Math.max(0, track.scrollWidth - window.innerWidth);
      track.style.transform = `translate3d(${-t * over}px,0,0)`;
      if (bigRef.current) bigRef.current.style.transform = `translate3d(${-t * over * 0.35}px,0,0)`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${t})`;
      const n = photos.length || 1;
      if (counterRef.current) counterRef.current.textContent = String(Math.min(n, 1 + Math.floor(t * n * 0.999))).padStart(2, "0");
      const vw = window.innerWidth;
      imgsRef.current.forEach((frame) => {
        if (!frame || !frame.firstElementChild) return;
        const rect = frame.getBoundingClientRect();
        const off = (rect.left + rect.width / 2) / vw - 0.5;
        (frame.firstElementChild as HTMLElement).style.transform = `translate3d(${-off * 8}%,0,0) scale(1.18)`;
      });
    });
    return () => unsub();
  }, [mobile, reduce, scrollYProgress, photos.length]);

  if (mobile) {
    return (
      <section aria-label={title} className="bg-paper py-10">
        <div className="px-4">
          <p className="eyebrow text-ink/60">{kicker}</p>
          <h2 className="display mt-2 text-[clamp(44px,10vw,84px)] text-ink">{title}</h2>
          <p className="body-muted mt-3 max-w-[340px] text-[15px] leading-normal">{note}</p>
        </div>
        <div className="mt-6 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {photos.map((p, i) => (
            <figure key={i} className="w-[64vw] max-w-[380px] flex-none snap-start">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[4px] bg-phold">
                <Image src={p.src} alt={p.caption} fill sizes="64vw" className="object-cover" />
              </div>
              <figcaption className="eyebrow mt-3 text-ink/66">
                <b className="font-medium text-oxide">{String(i + 1).padStart(2, "0")}</b> {p.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} aria-label={title} className="relative bg-paper" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen min-h-[560px] overflow-hidden">
        <div
          ref={bigRef}
          aria-hidden
          className="display pointer-events-none absolute bottom-[clamp(20px,5vh,56px)] left-[clamp(16px,3.4vw,48px)] z-0 whitespace-nowrap text-[clamp(120px,19vw,300px)] leading-[0.8] text-ink opacity-[0.08] will-change-transform"
        >
          {title}
        </div>
        <div className="absolute inset-x-[clamp(16px,3.4vw,48px)] top-[clamp(96px,14vh,140px)] z-10 flex items-start justify-between gap-6">
          <div>
            <p className="eyebrow text-ink/60">{kicker}</p>
            <h2 className="display mt-2 text-[clamp(44px,5.4vw,84px)] text-ink">{title}</h2>
          </div>
          <p className="body-muted hidden max-w-[340px] text-[15px] leading-normal md:block">{note}</p>
        </div>
        <div
          ref={trackRef}
          className="absolute inset-y-0 left-0 z-[1] flex items-end gap-[clamp(24px,3vw,56px)] pl-[34vw] will-change-transform"
          style={{ paddingBottom: "13vh" }}
        >
          {photos.map((p, i) => (
            <figure key={i} style={{ marginBottom: (i % 3) * 3 + "vh" }} className="m-0 flex-none">
              <div
                ref={(el) => { imgsRef.current[i] = el; }}
                className="relative overflow-hidden rounded-[4px] bg-phold"
                style={{ height: "64vh", width: "46vh" }}
              >
                <Image src={p.src} alt={p.caption} fill sizes="60vh" loading={i < 3 ? "eager" : "lazy"} className="object-cover will-change-transform" />
              </div>
              <figcaption className="eyebrow mt-3 text-ink/66">
                <b className="font-medium text-oxide">{String(i + 1).padStart(2, "0")}</b> {p.caption}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="absolute right-[clamp(16px,3.4vw,48px)] top-[calc(clamp(96px,14vh,140px)+110px)] z-10 flex w-[180px] flex-col gap-2.5">
          <span className="eyebrow text-ink">
            <span ref={counterRef}>01</span> / {String(photos.length).padStart(2, "0")}
          </span>
          <i className="block h-px bg-ink/18">
            <div ref={barRef} className="h-full origin-left bg-ink" style={{ transform: "scaleX(0)" }} />
          </i>
        </div>
      </div>
    </section>
  );
}
