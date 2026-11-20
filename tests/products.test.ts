import { describe, expect, it } from "vitest";
import { effectiveStatus } from "@/lib/products";

describe("effectiveStatus", () => {
  it("RESERVED yang kedaluwarsa = AVAILABLE (tanpa cron)", () => {
    expect(
      effectiveStatus({ status: "RESERVED", reservedUntil: new Date(Date.now() - 1000) }),
    ).toBe("AVAILABLE");
  });
  it("RESERVED yang masih valid tetap RESERVED", () => {
    expect(
      effectiveStatus({ status: "RESERVED", reservedUntil: new Date(Date.now() + 60_000) }),
    ).toBe("RESERVED");
  });
  it("RESERVED tanpa reservedUntil tetap RESERVED (tidak pernah kedaluwarsa)", () => {
    expect(effectiveStatus({ status: "RESERVED", reservedUntil: null })).toBe("RESERVED");
  });
  it("status lain lolos apa adanya", () => {
    expect(effectiveStatus({ status: "SOLD", reservedUntil: null })).toBe("SOLD");
    expect(effectiveStatus({ status: "AVAILABLE", reservedUntil: null })).toBe("AVAILABLE");
    expect(effectiveStatus({ status: "DRAFT", reservedUntil: null })).toBe("DRAFT");
  });
});
