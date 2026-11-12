import Image from "next/image";

type BrandLogoProps = {
  tone?: "dark" | "light";
  size?: "compact" | "large";
};

/** Faceted-stone emblem with a responsive, readable wordmark. */
export function BrandLogo({ tone = "dark", size = "compact" }: BrandLogoProps) {
  const large = size === "large";

  if (tone === "dark") {
    return (
      <Image
        src="/brand/michael-lapidary-option-1.png"
        alt=""
        width={2076}
        height={757}
        priority
        sizes="(min-width: 1024px) 174px, 120px"
        className={large ? "h-auto w-[174px]" : "h-auto w-[120px]"}
      />
    );
  }

  return (
    <span className={`inline-flex items-center ${large ? "gap-3" : "gap-2.5"}`}>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 48 48"
        className={large ? "size-11 shrink-0" : "size-7 shrink-0"}
        fill="none"
      >
        <path
          d="M15 3h18l12 12v18L33 45H15L3 33V15L15 3Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M15 3 17.5 15 24 22 30.5 15 33 3M3 15h14.5L24 22l6.5-7H45M3 33l14.5-3L24 22l6.5 8L45 33M15 45l2.5-15L24 22l6.5 8L33 45"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <path d="M33 3 45 15" stroke="#c9a24e" strokeWidth="2.2" strokeLinecap="round" />
        <path d="m17.5 30 6.5-8 6.5 8" stroke="#c9a24e" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <span
        className={`flex flex-col font-display font-bold uppercase leading-[0.94] ${
          tone === "light" ? "text-milk" : "text-ink"
        } ${large ? "text-[15px] tracking-[0.17em]" : "text-[10px] tracking-[0.15em]"}`}
      >
        <span>Michael</span>
        <span className={large ? "mt-1 text-gold" : "mt-0.5 text-gold"}>Lapidary</span>
      </span>
    </span>
  );
}
