"use client";

import { useEffect, useRef, useState } from "react";

type Stat = { value: number; suffix?: string; label: string; note: string };

/**
 * Statistik counter — port JwCounters (MOTION-SPEC §2.2):
 * trigger viewport 25%, count-up 1600ms expo-out 1−2^(−10t),
 * format en-US, suffix oxide, garis atas scaleX 1.2s stagger 90ms.
 * `dark` untuk penempatan di section gelap (teks milk, hairline milk).
 */
export function StatsCounters({ stats, dark = false }: { stats: Stat[]; dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const valuesRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // Langsung angka final tanpa count-up; via rAF agar tidak setState sinkron di effect
      requestAnimationFrame(() => setStarted(true));
      valuesRef.current.forEach((s, i) => {
        if (s) s.textContent = stats[i].value.toLocaleString("en-US");
      });
      return;
    }

    let startedFlag = false;
    let poll: ReturnType<typeof setInterval>;
    const check = (): boolean => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 900;
      if (rect.top < vh * 0.75 && rect.bottom > 0) {
        if (!startedFlag) {
          startedFlag = true;
          setStarted(true);
          const t0 = performance.now();
          const tick = () => {
            const t = Math.min(1, (performance.now() - t0) / 1600);
            const eased = t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); // expo-out
            valuesRef.current.forEach((s, i) => {
              if (s) s.textContent = Math.round(stats[i].value * eased).toLocaleString("en-US");
            });
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
        return true;
      }
      return false;
    };
    if (!check()) poll = setInterval(() => check() && clearInterval(poll), 150);
    const fallback = setTimeout(() => {
      if (!startedFlag) {
        startedFlag = true;
        setStarted(true);
        valuesRef.current.forEach((s, i) => {
          if (s) s.textContent = stats[i].value.toLocaleString("en-US");
        });
      }
    }, 8000);
    return () => {
      clearInterval(poll);
      clearTimeout(fallback);
    };
  }, [stats]);

  return (
    <div ref={ref} className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-8">
      {stats.map((s, i) => (
        <div key={s.label} className="relative py-[22px]">
          <span
            aria-hidden
            className={`absolute inset-x-0 top-0 h-px origin-left transition-transform duration-[1200ms] ${dark ? "bg-milk/20" : "bg-ink/18"}`}
            style={{ transform: `scaleX(${started ? 1 : 0})`, transitionDelay: `${i * 90}ms`, transitionTimingFunction: "cubic-bezier(.22,1,.36,1)" }}
          />
          <p className={`font-display text-[clamp(64px,7.4vw,120px)] font-bold leading-[0.86] tracking-[-0.01em] tabular-nums ${dark ? "text-milk" : "text-ink"}`}>
            <span ref={(el) => { valuesRef.current[i] = el; }}>0</span>
            {s.suffix ? <small className="ml-1 align-baseline text-[0.42em] text-oxide">{s.suffix}</small> : null}
          </p>
          <p className={`eyebrow mt-4 mb-2 ${dark ? "text-milk" : "text-ink"}`}>{s.label}</p>
          <p className={`max-w-[30ch] text-[14.5px] leading-normal ${dark ? "text-milk/70" : "body-muted"}`}>{s.note}</p>
        </div>
      ))}
    </div>
  );
}
