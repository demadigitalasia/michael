"use client";

import Image from "next/image";
import { useRef, useState, useEffect, type CSSProperties } from "react";
import { useScroll } from "framer-motion";
import { ArrowRight } from "@/components/icons";

export type FlowStep = { title: string; body: string; meta: string };

/**
 * CustomFlow — port JwCustomFlow (MOTION-SPEC §2.4):
 * 2 kolom di-pin — kiri daftar 4 langkah, kanan "lembar sketsa" (kertas grafik)
 * yang berganti visual per langkah via wipe clip-path.
 * - Langkah nonaktif opacity .42, aktif 1 (transition .5s)
 * - Body langkah: accordion max-height .7s
 * - Progress bar 2px per langkah: scaleX(1) sudah lewat, (0) belum, animasi saat aktif
 * - Stage: bg sketch, grid 24px, wipe kiri→kanan / bawah→atas (.9s)
 * Mobile: kolom bertumpuk, langkah selalu terbuka.
 */
export function CustomFlow({
  steps,
  stages,
  kicker = "Custom orders",
  title = "From rough to yours",
  ctaLabel = "Start a custom piece",
  ctaHref = "/custom#start",
}: {
  steps: FlowStep[];
  stages: { src: string; tag: string }[];
  kicker?: string;
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const n = steps.length;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (t) => {
      const idx = Math.min(n - 1, Math.floor(t * n * 0.999));
      setStep(idx);
    });
    return () => unsub();
  }, [scrollYProgress, n]);

  return (
    <section ref={sectionRef} aria-label={title} className="relative bg-paper editorial-motion:h-[var(--flow-height)]" style={{ "--flow-height": `${n * 80}svh` } as CSSProperties}>
      <div className="editorial-motion:sticky editorial-motion:top-0 editorial-motion:flex editorial-motion:h-svh editorial-motion:items-center editorial-motion:overflow-clip">
        <div className="grid w-full grid-cols-1 gap-[clamp(24px,4vw,72px)] px-[clamp(16px,3.4vw,48px)] py-12 editorial-motion:grid-cols-[minmax(320px,5fr)_7fr] editorial-motion:pb-6 editorial-motion:pt-20">
          {/* Kiri: langkah */}
          <div>
            <p className="eyebrow text-ink/60">{kicker}</p>
            <h2 className="display mt-3 text-[clamp(44px,5vw,78px)] text-ink">{title}</h2>
            <ol className="mt-6 flex flex-col">
              {steps.map((s, i) => {
                const on = i <= step;
                const progress = i < step ? 1 : i > step ? 0 : (scrollYProgress.get() * n) % 1;
                return (
                  <li
                    key={s.title}
                    className="grid grid-cols-[44px_1fr] gap-x-3 gap-y-1 border-t border-ink/14 py-3 editorial-motion:opacity-[var(--step-opacity)] editorial-motion:transition-opacity editorial-motion:duration-500"
                    style={{ "--step-opacity": on ? 1 : 0.58, "--step-height": on ? "125px" : "0px", "--step-gap": on ? "6px" : "0px" } as CSSProperties}
                  >
                    <span className="eyebrow row-span-2 pt-1 text-ink/60">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="text-[19px] font-semibold leading-tight text-ink">{s.title}</h3>
                    {/* accordion body: max-height .7s */}
                    <p
                      className="body-muted col-start-2 m-0 text-[14.5px] leading-normal editorial-motion:mt-[var(--step-gap)] editorial-motion:max-h-[var(--step-height)] editorial-motion:overflow-hidden editorial-motion:transition-[max-height,margin] editorial-motion:duration-700"
                    >
                      {s.body}
                    </p>
                    <span className="eyebrow col-start-2 mt-1 text-ink/60">{s.meta}</span>
                    <i aria-hidden className="col-span-full mt-3 hidden h-0.5 overflow-hidden bg-ink/8 editorial-motion:block">
                      <span
                        className="block h-full origin-left bg-ink transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
                        style={{ transform: `scaleX(${progress})` }}
                      />
                    </i>
                  </li>
                );
              })}
            </ol>
            <a
              href={ctaHref}
              className="mt-6 inline-flex h-[46px] items-center gap-2.5 rounded-full bg-ink px-5 text-[15px] font-medium text-milk transition-transform duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 active:scale-[0.97]"
            >
              {ctaLabel} <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>

          {/* Kanan: stage lembar sketsa */}
          <div className="relative hidden h-[min(70vh,660px)] overflow-hidden rounded-[6px] bg-sketch shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_40px_80px_-50px_rgba(40,30,20,0.45)] editorial-motion:block">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(18,18,20,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(18,18,20,.06) 1px,transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            {stages.map((st, i) => (
              <div
                key={st.tag}
                className="absolute inset-0 transition-[clip-path] duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)]"
                style={{
                  clipPath: i <= step ? "inset(0 0% 0 0)" : i === step + 1 ? "inset(100% 0 0 0)" : "inset(0 100% 0 0)",
                  zIndex: i,
                }}
              >
                <Image src={st.src} alt={st.tag} fill sizes="(min-width:1024px) 58vw, 100vw" className="object-cover" />
              </div>
            ))}
            <span className="eyebrow absolute left-[18px] top-4">
              <span className="inline-block rounded-[4px] bg-ink/45 px-3 py-2 text-milk backdrop-blur-[4px]">
                {stages[Math.min(step, stages.length - 1)]?.tag}
              </span>
            </span>
            <span className="eyebrow absolute bottom-3 right-4 opacity-55 text-ink">
              MICHAEL LAPIDARY · CUSTOM 0419 · SHEET 2 OF 2
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
