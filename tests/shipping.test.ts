import { describe, expect, it } from "vitest";
import { DOMESTIC_COUNTRIES, isDomestic, itemWeightGrams, shipmentWeightGrams, validRates } from "@/lib/shipping";

const rate = (over: Partial<{ zone: string; minWeightG: number; maxWeightG: number; id: string }>) => ({
  id: over.id ?? "r1",
  zone: over.zone ?? "domestic",
  minWeightG: over.minWeightG ?? 0,
  maxWeightG: over.maxWeightG ?? 500,
});

describe("isDomestic", () => {
  it.each(DOMESTIC_COUNTRIES)("mengenal %s (case/spasi toleran)", (c) => {
    expect(isDomestic(c.toUpperCase())).toBe(true);
    expect(isDomestic(` ${c} `)).toBe(true);
  });
  it("negara lain = international", () => {
    expect(isDomestic("Netherlands")).toBe(false);
    expect(isDomestic("indonesian")).toBe(false); // prefix bukan match
  });
});

describe("itemWeightGrams", () => {
  it("weightGram menang bila ada", () => {
    expect(itemWeightGrams({ weightGram: 20, weightCarat: 100 })).toBe(20);
  });
  it("fallback carat × 0.2", () => {
    expect(itemWeightGrams({ weightGram: null, weightCarat: 5 })).toBe(1);
  });
  it("tanpa berat → 0", () => {
    expect(itemWeightGrams({ weightGram: null, weightCarat: null })).toBe(0);
  });
});

describe("shipmentWeightGrams", () => {
  it("menjumlah semua item", () => {
    const items = [
      { weightGram: 10, weightCarat: null },
      { weightGram: null, weightCarat: 3 },
      { weightGram: null, weightCarat: null },
    ];
    expect(shipmentWeightGrams(items)).toBeCloseTo(10.6);
  });
});

describe("validRates", () => {
  it("zona dicocokkan case-insensitive ('Domestic' seed lama tetap sah)", () => {
    const rates = [rate({ zone: "Domestic" })];
    expect(validRates(rates, "Indonesia", 100)).toHaveLength(1);
    expect(validRates(rates, "Japan", 100)).toHaveLength(0);
  });
  it("window berat inklusif di batas", () => {
    const rates = [rate({ minWeightG: 100, maxWeightG: 200 })];
    expect(validRates(rates, "Indonesia", 100)).toHaveLength(1);
    expect(validRates(rates, "Indonesia", 200)).toHaveLength(1);
    expect(validRates(rates, "Indonesia", 99.9)).toHaveLength(0);
    expect(validRates(rates, "Indonesia", 200.1)).toHaveLength(0);
  });
  it("zona tak dikenal tidak pernah cocok", () => {
    const rates = [rate({ zone: "Europe" })];
    expect(validRates(rates, "France", 100)).toHaveLength(0);
  });
});
