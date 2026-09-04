import { describe, expect, it } from "vitest";
import { money } from "../lib/format";
import { inflate, rebasedIndex, yearOverYearPct } from "../lib/inflation";
import { unitsAffordable } from "../lib/lookup";

describe("inflate", () => {
  it("converts $1 in 1979 into 2026 dollars with official CPI-U", () => {
    const cpi1979 = 72.575;
    const cpi2026 = 331.18;
    expect(inflate(1, cpi1979, cpi2026)).toBeCloseTo(4.563, 3);
  });

  it("is the inverse of deflating $100 today back to a past year", () => {
    const then = 24.067; // 1950
    const now = 331.18;
    const pastDollars = inflate(100, now, then);
    expect(inflate(pastDollars, then, now)).toBeCloseTo(100, 8);
  });

  it("rejects a non-positive from-index", () => {
    expect(() => inflate(1, 0, 100)).toThrow();
  });
});

describe("yearOverYearPct", () => {
  it("matches the 1979 oil-shock annual rate", () => {
    expect(yearOverYearPct(72.575, 65.233)).toBeCloseTo(11.26, 2);
  });

  it("is negative in 1932 deflation", () => {
    expect(yearOverYearPct(13.642, 15.208)).toBeCloseTo(-10.3, 1);
  });
});

describe("rebasedIndex", () => {
  it("sets 1926 = 100", () => {
    expect(rebasedIndex(17.7, 17.7)).toBe(100);
    expect(rebasedIndex(331.18, 17.7)).toBeCloseTo(1871.07, 1);
  });
});

describe("money", () => {
  it("keeps cents for everyday stickers and drops them on large prices", () => {
    expect(money(0.27, "fine")).toBe("$0.27");
    expect(money(850, "auto")).toBe("$850");
    expect(money(1510, "auto")).toBe("$1,510");
  });
});

describe("unitsAffordable", () => {
  it("shows how a frozen $1.60 hour buys fewer gallons as gas rises", () => {
    expect(unitsAffordable(1.6, 0.357)).toBeCloseTo(4.48, 2);
    expect(unitsAffordable(1.6, 0.903)).toBeCloseTo(1.77, 2);
  });

  it("returns null when a price is missing", () => {
    expect(unitsAffordable(10, null)).toBeNull();
  });
});
