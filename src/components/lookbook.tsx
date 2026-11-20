"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { useScroll } from "framer-motion";

export type LookbookPhoto = { src: string; caption: string };

const FRAMES = [
  [34, 43], [48, 34], [38, 46], [50, 33],
  [34, 44], [52, 36], [38, 46], [48, 34],
];

export function Lookbook({
  photos,
  kicker = "From the bench · material studies",
  title = "Where they come from",
  note = "A closer look at the color and texture of the materials.",
}: {
  photos: LookbookPhoto[];
  kicker?: string;
  title?: string;
  note?: string;
}) {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const ghost = useRef<HTMLSpanElement>(null);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });

  useEffect(() => {
    function update(progress: number) {
      if (!frame.current || !track.current || getComputedStyle(frame.current).position !== "sticky") return;
      const distance = Math.max(0, track.current.scrollWidth - frame.current.clientWidth);
      track.current.style.setProperty("--lookbook-offset", `${-progress * distance}px`);
      ghost.current?.style.setProperty("--lookbook-ghost-offset", `${-progress * distance * 0.25}px`);
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
      if (counter.current) {
        const index = Math.min(photos.length, 1 + Math.floor(progress * photos.length));
        counter.current.textContent = String(index).padStart(2, "0");
      }
    }

    const unsubscribe = scrollYProgress.on("change", update);
    const refresh = () => update(scrollYProgress.get());
    const observer = new ResizeObserver(refresh);
    if (frame.current) observer.observe(frame.current);
    if (track.current) observer.observe(track.current);
    refresh();
    return () => {
      unsubscribe();
      observer.disconnect();
    };
  }, [photos.length, scrollYProgress]);

  if (!photos.length) return null;

  return (
    <section ref={section} aria-label={title} className="lookbook bg-paper">
      <div ref={frame} className="lookbook-frame">
        <span ref={ghost} aria-hidden className="lookbook-ghost display">{title}</span>
        <div className="lookbook-heading">
          <div>
            <p className="eyebrow text-ink/60">{kicker}</p>
            <h2 className="display mt-2 text-[clamp(44px,5.4vw,84px)] text-ink">{title}</h2>
          </div>
          <p className="body-muted mt-3 max-w-[32ch] text-[15px] leading-relaxed">{note}</p>
        </div>
        <div ref={track} className="lookbook-track">
          {photos.map(({ src, caption }, index) => {
            const [width, height] = FRAMES[index % FRAMES.length];
            return (
              <figure key={`${src}-${index}`} className="lookbook-card" style={{
                "--photo-width": `${width}svh`,
                "--photo-height": `${height}svh`,
                "--photo-inset": `${(index % 2) * 2}svh`,
              } as CSSProperties}>
                <div className="lookbook-photo relative overflow-hidden rounded-[4px] bg-phold">
                  <Image src={src} alt="" fill sizes="(min-width: 1024px) 52vh, (min-width: 360px) 48vw, 100vw" className="object-cover" />
                </div>
                <figcaption className="mt-2.5 break-words text-[13px] leading-snug text-ink/80">{caption}</figcaption>
              </figure>
            );
          })}
        </div>
        <div className="lookbook-progress" aria-hidden>
          <span className="eyebrow text-ink">
            <span ref={counter}>01</span> / {String(photos.length).padStart(2, "0")}
          </span>
          <span className="mt-2.5 block h-px bg-ink/18">
            <span ref={bar} className="block h-full origin-left scale-x-0 bg-ink" />
          </span>
        </div>
      </div>
    </section>
  );
}
