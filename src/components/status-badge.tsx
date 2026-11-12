import { cn } from "@/lib/cn";

type Status = "AVAILABLE" | "RESERVED" | "SOLD" | "DRAFT" | "HIDDEN";

/** Badge status item one-of-a-kind (DESIGN-SPEC §8): mono uppercase kecil. */
export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const map: Record<string, { label: string; style: string } | undefined> = {
    AVAILABLE: { label: "One of a kind", style: "bg-paper/85 text-ink border-ink/15" },
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

/** Stamp SOLD besar untuk kartu & PDP (DESIGN-SPEC §8). */
export function SoldStamp({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center border border-oxide px-3 py-1.5 text-oxide",
        className,
      )}
    >
      Sold
    </span>
  );
}
