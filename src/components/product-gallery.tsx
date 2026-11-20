"use client";

import Image from "next/image";
import { useState } from "react";
import { Loupe } from "@/components/loupe";

export function ProductGallery({ photos, title }: { photos: { url: string; alt: string }[]; title: string }) {
  const [selected, setSelected] = useState(0);
  const current = photos[selected] ?? photos[0];
  if (!current) {
    // Produk tanpa foto (mis. draft baru) — jangan kolom kosong, tampilkan frame placeholder
    return (
      <div className="w-full max-w-[500px]">
        <div className="flex aspect-[4/5] items-center justify-center rounded-[4px] bg-phold">
          <span className="eyebrow text-ink/50">Photo coming</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[500px]">
      <div className="relative aspect-[4/5]">
        <Loupe
          key={current.url}
          src={current.url}
          alt={current.alt || title}
          sizes="(min-width: 540px) 500px, 100vw"
          eager={selected === 0}
        />
      </div>
      {photos.length > 1 && (
        <div role="group" aria-label="Product photos" className="mt-3 flex flex-wrap gap-2">
          {photos.map((photo, index) => (
            <button
              key={photo.url}
              type="button"
              aria-label={`Show photo ${index + 1} of ${photos.length}`}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
              className="relative size-14 overflow-hidden rounded-[4px] border-2 border-transparent bg-phold aria-pressed:border-ink sm:size-16"
            >
              <Image src={photo.url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
