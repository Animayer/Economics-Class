import { describe, expect, it } from "vitest";
import { patternAt } from "../lib/candles";
import { generateSeries } from "../lib/generate";
import { PATTERNS, teachingBullets, type PatternId } from "../lib/patterns";

describe("synthetic charts", () => {
  it("draws each lesson pattern and no other pattern at that same window", () => {
    for (const pattern of PATTERNS) {
      const series = generateSeries(pattern.id);
      expect(series.candles.length).toBeGreaterThanOrEqual(pattern.candleCount + 2);
      expect(series.patternEnd).toBe(series.candles.length - 1);
      expect(series.patternStart).toBe(series.patternEnd - (pattern.candleCount - 1));
      expect(patternAt(pattern.id, series.candles, series.patternStart)).toBe(true);

      for (const other of PATTERNS) {
        if (other.id === pattern.id) continue;
        expect(
          patternAt(other.id, series.candles, series.patternStart),
          `${pattern.id} should not also match ${other.id}`,
        ).toBe(false);
      }
    }
  });

  it("keeps every bar internally consistent and repeatable", () => {
    const ids = PATTERNS.map((p) => p.id);
    for (const id of ids) {
      const first = generateSeries(id);
      const second = generateSeries(id);
      expect(second).toEqual(first);
      for (const candle of first.candles) {
        expect(candle.high).toBeGreaterThanOrEqual(Math.max(candle.open, candle.close));
        expect(candle.low).toBeLessThanOrEqual(Math.min(candle.open, candle.close));
        expect(candle.high).toBeGreaterThan(candle.low);
        expect(candle.volume).toBeGreaterThan(0);
      }
      expect(first.ticker.length).toBeGreaterThan(0);
    }
  });

  it("uses made-up tickers, not live market symbols from the unit", () => {
    const tickers = new Set(PATTERNS.map((p) => generateSeries(p.id).ticker));
    for (const banned of ["AAPL", "MSFT", "TSLA", "SPY", "QQQ"]) {
      expect(tickers.has(banned)).toBe(false);
    }
  });
});

describe("teaching script", () => {
  it("gives every pattern four bullets and an honest caveat", () => {
    for (const pattern of PATTERNS) {
      const bullets = teachingBullets(pattern);
      expect(bullets).toHaveLength(4);
      const blob = bullets.map((b) => b.text).join(" ").toLowerCase();
      expect(blob).toMatch(/clue/);
      expect(blob).toMatch(/does not guarantee/);
      expect(blob).not.toMatch(/guaranteed profit|sure win|can't lose|cannot lose/);
      expect(pattern.quizWhy.length).toBeGreaterThan(40);
    }
  });

  it("keeps projector shortcuts unique", () => {
    const keys = PATTERNS.map((p) => p.shortcut).filter((key): key is string => !!key);
    expect(new Set(keys).size).toBe(keys.length);
    const required: PatternId[] = [
      "bullish-engulfing",
      "bearish-engulfing",
      "hammer",
      "doji",
      "shooting-star",
      "spinning-top",
      "bullish-marubozu",
      "bearish-marubozu",
    ];
    for (const id of required) {
      expect(PATTERNS.some((p) => p.id === id)).toBe(true);
    }
    expect(PATTERNS.filter((p) => p.advanced).map((p) => p.id)).toEqual([
      "morning-star",
      "evening-star",
    ]);
  });
});
