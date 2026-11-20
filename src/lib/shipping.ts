/**
 * Logika tarif kirim bersama — dipakai UI checkout (langkah 02) DAN validasi API.
 * Sumber kebenaran tunggal agar pilihan di UI selalu sah di server.
 *
 * Zona: Domestic = Indonesia (workshop di Indonesia); negara lain = International.
 * Berat: setiap rate punya window minWeightG–maxWeightG; total gram pengiriman =
 * Σ berat item (1 ct = 0.2 g bila hanya berat carat yang diisi).
 */
export const DOMESTIC_COUNTRIES = ["indonesia", "id"];

export function isDomestic(country: string): boolean {
  return DOMESTIC_COUNTRIES.includes(country.trim().toLowerCase());
}

type RateLike = { zone: string; minWeightG: number; maxWeightG: number };

export function itemWeightGrams(item: { weightGram: number | null; weightCarat: number | null }): number {
  if (item.weightGram != null) return item.weightGram;
  if (item.weightCarat != null) return item.weightCarat * 0.2;
  return 0;
}

export function shipmentWeightGrams(items: Array<{ weightGram: number | null; weightCarat: number | null }>): number {
  return items.reduce((s, i) => s + itemWeightGrams(i), 0);
}

/** Rate yang sah untuk alamat & berat ini (zona cocok, total gram dalam window). */
export function validRates<T extends RateLike>(rates: T[], country: string, totalGrams: number): T[] {
  const zone = isDomestic(country) ? "domestic" : "international";
  return rates.filter(
    (r) => r.zone.trim().toLowerCase() === zone && totalGrams >= r.minWeightG && totalGrams <= r.maxWeightG,
  );
}
