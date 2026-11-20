"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ReservationTimer } from "@/components/reservation-timer";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import { shipmentWeightGrams, validRates } from "@/lib/shipping";

type Item = {
  productId: string;
  slug: string;
  title: string;
  priceCents: number;
  image: string | null;
  reservedUntil: string | Date | null;
  weightGram: number | null;
  weightCarat: number | null;
};
type Rate = { id: string; zone: string; name: string; minWeightG: number; maxWeightG: number; priceCents: number };

/**
 * Daftar negara umum — select menentukan zona pengiriman secara pasti
 * (isDomestic hanya mengenal Indonesia), free-text mudah salah ejaan.
 */
const COUNTRIES = [
  "Indonesia", "Australia", "Austria", "Belgium", "Brazil", "Brunei", "Cambodia", "Canada", "China", "Croatia",
  "Czechia", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hong Kong", "Hungary", "Iceland",
  "India", "Ireland", "Italy", "Japan", "Laos", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malaysia",
  "Maldives", "Malta", "Mexico", "Monaco", "Myanmar", "Netherlands", "New Zealand", "Norway", "Philippines",
  "Poland", "Portugal", "Qatar", "Romania", "Saudi Arabia", "Singapore", "Slovakia", "Slovenia", "South Africa",
  "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Taiwan", "Thailand", "Turkey", "United Arab Emirates",
  "United Kingdom", "United States", "Vietnam",
];

/**
 * Checkout 3 langkah (peta PearlGem → MOTION-SPEC/DESIGN-SPEC §8):
 * 01 Address → 02 Shipping → 03 Review → Stripe (hosted, kartu/Apple/Google Pay).
 * Tarif difilter dengan aturan yang sama dengan validasi API (lib/shipping) —
 * zona mengikuti negara, window berat mengikuti total gram pengiriman.
 */
export function CheckoutFlow({ items, rates }: { items: Item[]; rates: Rate[] }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ name: "", email: "", line1: "", city: "", zip: "", country: "" });
  const [rateId, setRateId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((s, i) => s + i.priceCents, 0);
  const totalGrams = shipmentWeightGrams(items);
  const shownRates = validRates(rates, address.country, totalGrams);
  const rate = shownRates.find((r) => r.id === rateId) ?? null;
  const total = subtotal + (rate?.priceCents ?? 0);

  const canNext1 = address.name && address.email && address.line1 && address.city && address.zip && address.country;
  const canNext2 = Boolean(rateId);

  function toShipping() {
    // Tarif yang dipilih sebelumnya bisa tidak sah bila negara/berat berubah
    if (rateId && !shownRates.some((r) => r.id === rateId)) setRateId(null);
    setStep(2);
  }

  async function pay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...address, rateId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not start checkout");
        router.refresh();
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error — try again");
    } finally {
      setLoading(false);
    }
  }

  const field =
    "h-[46px] w-full rounded-[4px] border border-ink/20 bg-transparent px-4 text-[15px] text-ink focus:outline-none focus:ring-1 focus:ring-gold";
  const labelCls = "eyebrow text-ink/60";

  return (
    <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
      <div>
        {/* Steps header */}
        <ol className="flex gap-2">
          {["Address", "Shipping", "Review"].map((label, i) => {
            const n = i + 1;
            const on = step === n;
            const done = step > n;
            return (
              <li key={label} className="flex-1">
                <button
                  onClick={() => n < step && setStep(n)}
                  className={`w-full border-t-2 pt-3 text-left transition-colors ${on ? "border-ink" : done ? "border-gold" : "border-ink/15"}`}
                >
                  <span className="eyebrow text-ink/60">{String(n).padStart(2, "0")}</span>
                  <p className={`mt-1 text-[15px] font-medium ${on || done ? "text-ink" : "text-ink/50"}`}>{label}</p>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Step 1: Address */}
        {step === 1 && (
          <div className="mt-8 grid gap-4">
            <label className="grid gap-1.5">
              <span className={labelCls}>Full name</span>
              <input placeholder="Full name" className={field} value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} />
            </label>
            <label className="grid gap-1.5">
              <span className={labelCls}>Email</span>
              <input placeholder="For the receipt & tracking" type="email" className={field} value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} />
            </label>
            <label className="grid gap-1.5">
              <span className={labelCls}>Street address</span>
              <input placeholder="Street address" className={field} value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
            </label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="grid gap-1.5">
                <span className={labelCls}>City</span>
                <input placeholder="City" className={field} value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              </label>
              <label className="grid gap-1.5">
                <span className={labelCls}>Postal code</span>
                <input placeholder="Postal code" className={field} value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
              </label>
              <label className="grid gap-1.5">
                <span className={labelCls}>Country</span>
                <select
                  className={field}
                  autoComplete="country-name"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                >
                  <option value="" disabled>
                    Select your country
                  </option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              onClick={() => canNext1 && toShipping()}
              disabled={!canNext1}
              className="mt-2 inline-flex h-[52px] w-fit items-center gap-2.5 rounded-full bg-ink px-6 text-[15px] font-medium text-milk transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-40"
            >
              Continue to shipping <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Step 2: Shipping — hanya tarif yang cocok zona & berat */}
        {step === 2 && (
          <div className="mt-8">
            {shownRates.length === 0 ? (
              <div className="rounded-[4px] border border-ink/15 p-5">
                <p className="text-[15px] leading-relaxed text-ink">
                  No shipping option matches this address and parcel weight yet.
                </p>
                <p className="body-muted mt-2 text-[14.5px]">
                  Email the bench and we will quote a rate for this parcel.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {shownRates.map((r) => (
                  <label
                    key={r.id}
                    className={`flex cursor-pointer items-center justify-between rounded-[4px] border p-4 transition-colors ${rateId === r.id ? "border-ink bg-ink/5" : "border-ink/15 hover:border-ink/40"}`}
                  >
                    <span className="flex items-center gap-3">
                      <input type="radio" name="rate" checked={rateId === r.id} onChange={() => setRateId(r.id)} className="accent-[#121214]" />
                      <span>
                        <span className="block text-[15px] font-medium text-ink">{r.name}</span>
                        <span className="eyebrow text-ink/60">{r.zone} · tracked & insured</span>
                      </span>
                    </span>
                    <span className="font-mono text-[14px] font-medium tabular-nums text-ink">
                      ${(r.priceCents / 100).toFixed(2)}
                    </span>
                  </label>
                ))}
              </div>
            )}
            <div className="mt-6 flex items-center gap-3">
              <button onClick={() => setStep(1)} className="eyebrow inline-flex items-center gap-1 text-ink/60 underline underline-offset-4 hover:text-ink">
                <ArrowLeft className="size-3.5" aria-hidden="true" /> Back
              </button>
              <button
                onClick={() => canNext2 && setStep(3)}
                disabled={!canNext2}
                className="inline-flex h-[52px] w-fit items-center gap-2.5 rounded-full bg-ink px-6 text-[15px] font-medium text-milk transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-40"
              >
                Review order <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && rate && (
          <div className="mt-8">
            <div className="rounded-[4px] border border-ink/15 p-5">
              <p className="eyebrow text-ink/60">Ship to</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink">
                {address.name}<br />{address.line1}<br />{address.city}, {address.zip}, {address.country}<br />{address.email}
              </p>
              <p className="eyebrow mt-4 text-ink/60">Shipping</p>
              <p className="mt-1 text-[15px] text-ink">{rate.name} — ${(rate.priceCents / 100).toFixed(2)}</p>
            </div>
            <button
              onClick={pay}
              disabled={loading}
              className="mt-6 inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-ink text-[15px] font-medium text-milk transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-60"
            >
              {loading ? "Opening Stripe…" : <>Pay ${(total / 100).toFixed(2)} with Stripe <ArrowRight className="size-4" aria-hidden="true" /></>}
            </button>
            <p className="eyebrow mt-4 text-ink/50">Card, Apple Pay & Google Pay — handled by Stripe, we never see the card</p>
            {error && <p className="mt-3 text-[13px] text-oxide">{error}</p>}
          </div>
        )}
      </div>

      {/* Ringkasan */}
      <aside className="h-fit rounded-[6px] border border-ink/10 bg-sketch p-8">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="display text-2xl text-ink">Your stones</h2>
          <Link href="/cart" className="eyebrow text-ink/60 underline underline-offset-4 transition-colors hover:text-ink">
            Edit bag
          </Link>
        </div>
        <ul className="mt-6 space-y-4">
          {items.map((i) => (
            <li key={i.productId} className="grid grid-cols-[56px_1fr_auto] items-center gap-3">
              <div className="relative aspect-square overflow-hidden rounded-[4px] bg-phold">
                {i.image && <Image src={i.image} alt={i.title} fill sizes="56px" className="object-cover" />}
              </div>
              <span>
                <span className="block text-[14px] font-medium leading-snug text-ink">{i.title}</span>
                <ReservationTimer reservedUntil={i.reservedUntil} />
              </span>
              <span className="font-mono text-[13px] tabular-nums text-ink">${(i.priceCents / 100).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-ink/15 pt-4">
          <div className="flex justify-between">
            <dt className="body-muted text-[14px]">Subtotal</dt>
            <dd className="font-mono text-[13px] tabular-nums">${(subtotal / 100).toFixed(2)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="body-muted text-[14px]">Shipping</dt>
            <dd className="font-mono text-[13px] tabular-nums">{rate ? `$${(rate.priceCents / 100).toFixed(2)}` : "—"}</dd>
          </div>
          <div className="flex justify-between border-t border-ink/15 pt-2">
            <dt className="text-[15px] font-semibold text-ink">Total</dt>
            <dd className="font-mono text-[15px] font-semibold tabular-nums">${(total / 100).toFixed(2)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
