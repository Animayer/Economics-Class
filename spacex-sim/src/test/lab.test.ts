import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseDataset } from "../lib/market";
import { enrichBars, rsiSeries, smaAt } from "../lib/ta";
import { allSignals, curatedSignals } from "../lib/signals";
import { comparePaths, runRules, shouldRulesBuy } from "../lib/paths";
import {
  applyTrade,
  buyAndHold,
  DEFAULT_CASH,
  maxBuyShares,
  replayTrades,
} from "../lib/trading";
import type { Bar, Trade } from "../types";

const raw = JSON.parse(
  readFileSync(fileURLToPath(new URL("../../public/data/spcx-history.json", import.meta.url)), "utf8"),
);
const dataset = parseDataset(raw);
const bars = enrichBars(dataset.bars);

function bar(partial: Partial<Bar> & Pick<Bar, "date" | "close">): Bar {
  return {
    open: partial.open ?? partial.close,
    high: partial.high ?? partial.close,
    low: partial.low ?? partial.close,
    volume: partial.volume ?? 1_000_000,
    ...partial,
  };
}

describe("bundled SPCX history", () => {
  it("starts at the June 12, 2026 IPO session and is not TSLA", () => {
    expect(dataset.meta.symbol).toBe("SPCX");
    expect(dataset.meta.ipoPrice).toBe(135);
    expect(dataset.bars[0]).toMatchObject({
      date: "2026-06-12",
      open: 150,
      close: 160.95,
    });
    expect(dataset.bars.some((b) => b.date === "2026-09-11" && b.close === 151.21)).toBe(true);
  });

  it("covers at least 4 weeks of daily bars after the IPO", () => {
    expect(dataset.bars.length).toBeGreaterThanOrEqual(20);
    expect(dataset.meta.asOf).toBe("2026-09-11");
  });
});

describe("TA math", () => {
  it("computes SMA over the exact window", () => {
    expect(smaAt([1, 2, 3, 4], 3, 4)).toBe(2.5);
    expect(smaAt([1, 2, 3], 1, 3)).toBeNull();
  });

  it("prints Wilder RSI after 14 changes and keeps it in 0–100", () => {
    const closes = bars.map((b) => b.close);
    const rsi = rsiSeries(closes, 14);
    expect(rsi[13]).toBeNull();
    expect(rsi[14]).not.toBeNull();
    for (const value of rsi) {
      if (value != null) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      }
    }
  });

  it("flags the August 7 volume spike and September 1 golden-cross context", () => {
    const aug7 = bars.find((b) => b.date === "2026-08-07");
    const sep1 = bars.find((b) => b.date === "2026-09-01");
    expect(aug7?.volumeSpike).toBe(true);
    expect(aug7?.changePct).toBeGreaterThan(5);
    expect(sep1?.sma20).not.toBeNull();
    expect(sep1?.sma50).not.toBeNull();
    expect(sep1 && sep1.sma20! > sep1.sma50!).toBe(true);
  });
});

describe("paper trading", () => {
  it("supports fractional buys and average cost", () => {
    const empty = replayTrades([], 0, 100, 1000, 0);
    const bought = applyTrade(empty, "buy", 2.5, 100, 0);
    expect(bought?.filled).toBe(2.5);
    expect(bought?.next.shares).toBe(2.5);
    expect(bought?.next.cash).toBe(750);
    expect(bought?.next.avgCost).toBe(100);
  });

  it("realizes a capital gain on a winning sell", () => {
    const start = replayTrades([], 0, 10, 1000, 0);
    const long = applyTrade(start, "buy", 10, 10, 0);
    const sold = applyTrade(long!.next, "sell", 10, 12, 0);
    expect(sold?.realizedDelta).toBeCloseTo(20);
    expect(sold?.next.realized).toBeCloseTo(20);
    expect(sold?.next.shares).toBe(0);
    expect(sold?.next.cash).toBeCloseTo(1020);
  });

  it("includes fees in cost basis and on sells", () => {
    const start = replayTrades([], 0, 100, 10_000, 10);
    const max = maxBuyShares(10_000, 100, 10);
    const bought = applyTrade(start, "buy", max, 100, 10);
    expect(bought?.next.cash).toBeCloseTo(0, 6);
    expect(bought!.next.avgCost).toBeGreaterThan(100);
    const sold = applyTrade(bought!.next, "sell", bought!.filled, 100, 10);
    expect(sold!.next.realized).toBeLessThan(0);
  });

  it("replays only trades on or before the scrubbed day", () => {
    const trades: Trade[] = [
      {
        id: "a",
        index: 2,
        date: "2026-06-16",
        side: "buy",
        shares: 10,
        price: 200,
        fee: 0,
        realizedDelta: 0,
      },
    ];
    const before = replayTrades(trades, 1, 180, 10_000, 0);
    const after = replayTrades(trades, 2, 200, 10_000, 0);
    expect(before.shares).toBe(0);
    expect(before.cash).toBe(10_000);
    expect(after.shares).toBe(10);
    expect(after.cash).toBe(8000);
  });
});

describe("signals and compare paths", () => {
  it("ships at least five annotated classroom moments", () => {
    const curated = curatedSignals(bars);
    const all = allSignals(bars);
    expect(curated.length).toBeGreaterThanOrEqual(5);
    expect(all.length).toBeGreaterThanOrEqual(5);
    const dates = new Set(curated.map((s) => s.date));
    expect(dates.has("2026-06-12")).toBe(true);
    expect(dates.has("2026-08-07")).toBe(true);
    expect(dates.has("2026-09-01")).toBe(true);
  });

  it("buy-and-hold from the lesson window uses the first close", () => {
    const start = bars.find((b) => b.date === dataset.meta.lessonWindowStart)!;
    const end = bars[bars.length - 1];
    const snap = buyAndHold(bars, start.index, end.index, DEFAULT_CASH, 0);
    const shares = DEFAULT_CASH / start.close;
    expect(snap.shares).toBeCloseTo(shares);
    expect(snap.equity).toBeCloseTo(shares * end.close);
  });

  it("rules robot can buy an oversold bounce above SMA 20", () => {
    const prev = enrichBars([
      bar({ date: "2026-01-01", close: 10 }),
      ...Array.from({ length: 20 }, (_, i) => bar({ date: `2026-01-${String(i + 2).padStart(2, "0")}`, close: 9 })),
    ]).at(-1);
    const today = enrichBars([
      ...Array.from({ length: 20 }, (_, i) => bar({ date: `2026-01-${String(i + 1).padStart(2, "0")}`, close: 8 })),
      bar({ date: "2026-02-01", close: 12, volume: 9_000_000 }),
    ]).at(-1)!;
    // Construct two consecutive enriched bars with known RSI-like fields.
    const fakePrev = { ...today, rsi14: 22, sma20: 10, close: 9, volumeSpike: false, changePct: -1 };
    const fakeToday = { ...today, rsi14: 35, sma20: 10, close: 11, volumeSpike: false, changePct: 2 };
    expect(shouldRulesBuy(fakePrev, fakeToday)).toBe(true);
    expect(prev).toBeTruthy();
  });

  it("three compare paths share the same starting cash", () => {
    const start = bars.find((b) => b.date === "2026-08-17")!;
    const student = replayTrades([], start.index, start.close, DEFAULT_CASH, 0);
    const paths = comparePaths(bars, start.index, bars.length - 1, DEFAULT_CASH, 0, student, 0);
    expect(paths.map((p) => p.id)).toEqual(["student", "hold", "rules"]);
    const hold = paths[1];
    expect(hold.equity).toBeGreaterThan(0);
    const rules = runRules(bars, 0, bars.length - 1, DEFAULT_CASH, 0);
    expect(rules.fills.length).toBeGreaterThan(0);
  });
});
