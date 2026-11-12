"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useReducedMotion } from "framer-motion";

export type ProcessStep = { title: string; body: string; spec: string };

/**
 * The Workshop sequence — port JewelwrightMaking (versi scroll, MOTION-SPEC §2.5):
 * Section gelap, langkah 01–05 menyala mengikuti scroll, DUA counter hidup:
 * "Hours at the wheels" (mm:ss, menghitung naik) & "Wheel grit" (80 → 50,000).
 * Baris data mono per langkah.
 */
export function ProcessSteps({
  steps,
  kicker = "The workshop · how a stone gets cut",
  title = "One stone at a time",
  totalHours = 9,
}: {
  steps: ProcessStep[];
  kicker?: string;
  title?: string;
  totalHours?: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [hours, setHours] = useState("00:00");
  const [grit, setGrit] = useState(80);
  const reduce = useReducedMotion();
  const n = steps.length;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    if (reduce) return;
    const unsub = scrollYProgress.on("change", (t) => {
      setStep(Math.min(n - 1, Math.floor(t * n * 0.999)));
      // mm:ss dari totalHours × progres (tabular-nums)
      const totalSec = Math.round(totalHours * 3600 * t);
      const hh = String(Math.floor(totalSec / 3600)).padStart(2, "0");
      const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
      setHours(`${hh}:${mm}`);
      // grit 80 → 50,000 (ease-out agar terasa alami)
      const eased = 1 - Math.pow(2, -10 * Math.min(1, t * 1.2));
      setGrit(Math.round(80 + (50000 - 80) * eased));
    });
    return () => unsub();
  }, [scrollYProgress, n, totalHours, reduce]);

  return (
    <section ref={sectionRef} aria-label={title} className="relative bg-bench text-milk" style={{ height: `${n * 90}vh` }}>
      <div className="sticky top-0 flex h-screen min-h-[640px] flex-col overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-10 px-[clamp(16px,3.4vw,48px)] pt-[clamp(80px,10vh,104px)] lg:grid-cols-[1fr_1.1fr]">
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
            </div>
          </div>

          {/* Kanan: langkah */}
          <ol className="flex flex-col justify-center">
            {steps.map((s, i) => {
              const on = i <= step;
              return (
                <li
                  key={s.title}
                  className="grid grid-cols-[44px_1fr] gap-x-4 gap-y-1 border-t border-milk/15 py-4 transition-opacity duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
                  style={{ opacity: on ? 1 : 0.32 }}
                >
                  <span className="eyebrow row-span-2 pt-1 text-milk/50">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-[19px] font-semibold leading-tight text-milk">{s.title}</h3>
                  <p
                    className="col-start-2 m-0 overflow-hidden text-[14.5px] leading-normal body-muted-dark transition-[max-height,margin] duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
                    style={{ maxHeight: on ? 120 : 0, marginTop: on ? 4 : 0 }}
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
