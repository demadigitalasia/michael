"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useScroll, useReducedMotion } from "framer-motion";

export type ProcessStep = { title: string; body: string; spec: string };

/** Kondisi pin — sama persis dengan variant CSS `editorial-motion` (globals.css). */
const PIN_MQ = "(min-width: 64rem) and (min-height: 720px) and (prefers-reduced-motion: no-preference)";

/**
 * The Workshop sequence — port JewelwrightMaking (versi scroll, MOTION-SPEC §2.5):
 * Section gelap, langkah 01–05 menyala mengikuti scroll, DUA counter hidup:
 * "Hours at the wheels" (mm:ss, menghitung naik) & "Wheel grit" (80 → 50,000).
 * Baris data mono per langkah. Foto opsional mengisi kolom kiri.
 *
 * Pin HANYA saat kondisi PIN_MQ (desktop, layar cukup tinggi, motion ok) —
 * di ponsel/reduced-motion konten mengalir normal sehingga semua langkah terbaca,
 * dan counter langsung menampilkan nilai akhir (MOTION-SPEC §5).
 */
export function ProcessSteps({
  steps,
  kicker = "The workshop · how a stone gets cut",
  title = "One stone at a time",
  totalHours = 9,
  photo,
}: {
  steps: ProcessStep[];
  kicker?: string;
  title?: string;
  totalHours?: number;
  photo?: { src: string; caption: string };
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [hours, setHours] = useState(() => formatHours(totalHours));
  const [grit, setGrit] = useState(50000);
  const [pinned, setPinned] = useState(false);
  const reduce = useReducedMotion();
  const n = steps.length;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Sinkron dengan media query CSS — satu sumber kebenaran untuk pin
  useEffect(() => {
    const mq = matchMedia(PIN_MQ);
    const sync = () => setPinned(mq.matches);
    const raf = requestAnimationFrame(sync); // rAF: hindari setState sinkron di effect (lint)
    const onChange = () => sync();
    mq.addEventListener("change", onChange);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (!pinned || reduce) {
      // Tanpa pin: nilai akhir langsung, tanpa animasi (MOTION-SPEC §5)
      const raf = requestAnimationFrame(() => {
        setStep(n - 1);
        setHours(formatHours(totalHours));
        setGrit(50000);
      });
      return () => cancelAnimationFrame(raf);
    }
    const update = (t: number) => {
      setStep(Math.min(n - 1, Math.floor(t * n * 0.999)));
      // mm:ss dari totalHours × progres (tabular-nums)
      setHours(formatHours(totalHours * t));
      // grit 80 → 50,000 (ease-out agar terasa alami)
      const eased = 1 - Math.pow(2, -10 * Math.min(1, t * 1.2));
      setGrit(Math.round(80 + (50000 - 80) * eased));
    };
    const raf = requestAnimationFrame(() => update(scrollYProgress.get()));
    const unsub = scrollYProgress.on("change", update);
    return () => {
      cancelAnimationFrame(raf);
      unsub();
    };
  }, [pinned, reduce, n, totalHours, scrollYProgress]);

  return (
    <section
      ref={sectionRef}
      aria-label={title}
      className="relative bg-bench text-milk"
      style={pinned ? { height: `${n * 90}vh` } : undefined}
    >
      <div className={pinned ? "sticky top-0 flex h-screen min-h-[640px] flex-col overflow-hidden" : "flex flex-col"}>
        <div
          className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-10 px-[clamp(16px,3.4vw,48px)] py-16 lg:grid-cols-[1fr_1.1fr]"
          style={pinned ? { paddingTop: "clamp(80px,10vh,104px)", paddingBottom: 0 } : undefined}
        >
          {/* Kiri: kicker + counter hidup */}
          <div>
            <p className="eyebrow text-milk/60">{kicker}</p>
            <h2 className="display mt-3 text-[clamp(44px,5vw,78px)] text-milk">{title}</h2>
            <div className="mt-10 space-y-8">
              <div>
                <p className="eyebrow text-milk/50">Hours at the wheels</p>
                <p className="font-display text-[clamp(56px,6.5vw,96px)] font-bold leading-[0.86] tabular-nums text-milk">
                  {hours}
                </p>
              </div>
              <div>
                <p className="eyebrow text-milk/50">Wheel grit</p>
                <p className="font-display text-[clamp(56px,6.5vw,96px)] font-bold leading-[0.86] tabular-nums text-milk">
                  {grit.toLocaleString("en-US")}
                </p>
              </div>
              {photo && (
                <figure className="mt-10 max-w-[300px]">
                  <div className="relative overflow-hidden rounded-[4px]">
                    <div className="relative aspect-[4/3]">
                      <Image src={photo.src} alt={photo.caption} fill sizes="300px" className="object-cover" />
                    </div>
                  </div>
                  <figcaption className="eyebrow mt-3 text-milk/50">{photo.caption}</figcaption>
                </figure>
              )}
            </div>
          </div>

          {/* Kanan: langkah */}
          <ol className="flex flex-col justify-center py-4">
            {steps.map((s, i) => {
              const on = !pinned || i <= step;
              return (
                <li
                  key={s.title}
                  className="grid grid-cols-[44px_1fr] gap-x-4 gap-y-1 border-t border-milk/15 py-4 transition-opacity duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
                  style={{ opacity: on ? 1 : 0.32 }}
                >
                  <span className="eyebrow row-span-2 pt-1 text-milk/50">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-[19px] font-semibold leading-tight text-milk">{s.title}</h3>
                  <p
                    className="col-start-2 m-0 text-[14.5px] leading-normal body-muted-dark"
                    style={
                      pinned
                        ? { overflow: "hidden", maxHeight: on ? 120 : 0, marginTop: on ? 4 : 0, transition: "max-height .7s cubic-bezier(.22,1,.36,1), margin .7s cubic-bezier(.22,1,.36,1)" }
                        : undefined
                    }
                  >
                    {s.body}
                  </p>
                  <span className="eyebrow col-start-2 mt-1 text-milk/50">{s.spec}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function formatHours(hours: number): string {
  const totalSec = Math.round(hours * 3600);
  const hh = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  return `${hh}:${mm}`;
}
