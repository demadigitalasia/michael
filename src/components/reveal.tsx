"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ComponentType,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";

// useLayoutEffect di klien (arming sebelum paint — tanpa flash), useEffect saat SSR.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Entrance global (MOTION-SPEC §6): fade + naik 12px saat masuk viewport.
 * CSS-first: konten terlihat secara default (SSR tanpa inline style tersembunyi);
 * class `js-reveal` hanya dipasang dari efek setelah JS hidrasi — tanpa/lambat JS
 * halaman tetap terbaca penuh, animasi tetap jalan saat JS aktif.
 * Easing tunggal situs: cubic-bezier(.22,1,.36,1). Stagger via prop delay (ms).
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "span";
}) {
  const ref = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced-motion: tidak meng-arming — konten langsung terbaca, tanpa transisi
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.add("js-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("reveal-in");
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = as as unknown as ComponentType<HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> }>;
  const style = delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined;

  return (
    <Comp ref={ref} className={className} style={style}>
      {children}
    </Comp>
  );
}
