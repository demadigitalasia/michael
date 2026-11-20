import { cn } from "@/lib/cn";

/** Badge status item one-of-a-kind (DESIGN-SPEC §8): mono uppercase kecil. */
export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const map: Record<string, { label: string; style: string } | undefined> = {
    AVAILABLE: { label: "Ready to ship", style: "bg-paper/85 text-ink border-ink/15" },
    DEMO: { label: "AI material study", style: "bg-ink text-milk border-milk/30" },
    RESERVED: { label: "Reserved", style: "bg-gold/90 text-ink border-ink/10" },
    SOLD: { label: "Sold", style: "bg-oxide text-milk border-oxide" },
  };
  const s = map[status];
  if (!s) return null;
  return (
    <span
      className={cn(
        "eyebrow inline-flex h-7 items-center rounded-full border px-3 backdrop-blur-[6px]",
        s.style,
        className,
      )}
    >
      {s.label}
    </span>
  );
}
