"use client";

import { useRef, useState } from "react";
import Image from "next/image";

/**
 * Loupe inspect — port interaksi "hover to inspect" (MOTION-SPEC §7.1):
 * lensa 160px mengikuti kursor, zoom 2.2×, hanya pointer halus (desktop).
 * Sempurna untuk melihat inclusion & banding batu.
 */
export function Loupe({ src, alt, sizes, eager = false }: { src: string; alt: string; sizes: string; eager?: boolean }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  return (
    <div
      ref={frameRef}
      className="relative h-full w-full cursor-crosshair overflow-hidden rounded-[4px] bg-phold"
      onMouseEnter={(e) => {
        if (e.nativeEvent instanceof MouseEvent && matchMedia("(pointer: fine)").matches) setActive(true);
      }}
      onMouseLeave={() => setActive(false)}
      onMouseMove={(e) => {
        const rect = frameRef.current?.getBoundingClientRect();
        if (!rect) return;
        setPos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }}
    >
      <Image src={src} alt={alt} fill sizes={sizes} loading={eager ? "eager" : undefined} className="object-cover" />
      {active && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-10 size-[160px] overflow-hidden rounded-full border border-milk/80 shadow-[0_2px_12px_rgba(18,18,20,0.35)]"
          style={{
            left: `calc(${pos.x}% - 80px)`,
            top: `calc(${pos.y}% - 80px)`,
          }}
        >
          <div className="absolute left-1/2 top-1/2 size-[352px] -translate-x-1/2 -translate-y-1/2" style={{ transform: `translate(calc(-50% - ${(pos.x - 50) * 1.2}px), calc(-50% - ${(pos.y - 50) * 1.2}px)) scale(2.2)`, transformOrigin: "center" }}>
            <Image src={src} alt="" fill sizes="352px" className="object-cover" />
          </div>
        </div>
      )}
      {!active && (
        <span className="eyebrow absolute bottom-3 right-3 hidden rounded-full bg-paper/85 px-3 py-1.5 text-ink/70 backdrop-blur-[6px] [@media(pointer:coarse)]:hidden md:block">
          Hover to inspect
        </span>
      )}
    </div>
  );
}
