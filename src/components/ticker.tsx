import { site } from "@/lib/site";

void site; // dipakai nanti untuk konfigurasi item via site config

/**
 * Ticker — port JwTicker (MOTION-SPEC §2.1):
 * track diduplikasi 2×, translateX(-50%), hover = pause, reduced-motion = mati.
 * Animasi & keyframes ada di globals.css (.jw-ticker).
 */
export function Ticker({
  items = [
    "100% treatment disclosed",
    "One of a kind, cut at our bench",
    "Ships insured worldwide",
    "14-day returns",
    "New stones every week",
  ],
  size = 44,
  className = "",
}: {
  items?: string[];
  size?: number;
  className?: string;
}) {
  const row = (ariaHidden: boolean) => (
    <div aria-hidden={ariaHidden || undefined} className="flex flex-none items-center" style={{ gap: size * 0.6, paddingRight: size * 0.6 }}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center" style={{ gap: size * 0.6 }}>
          <span className="whitespace-nowrap">{item}</span>
          <span style={{ fontSize: size * 0.42, color: "var(--color-oxide)", transform: "translateY(-0.1em)" }}>✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`jw-ticker font-display font-bold uppercase text-ink ${className}`}
      style={{ height: size, fontSize: size, letterSpacing: "-0.005em" }}
      role="marquee"
      aria-label={items.join(", ")}
    >
      <div className="jw-tr">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

export function SiteTicker() {
  return <Ticker />;
}

// keep import used
void site;
