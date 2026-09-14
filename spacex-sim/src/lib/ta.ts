import type { Bar, EnrichedBar, PriceLevel } from "../types";

export function smaAt(values: number[], index: number, period: number): number | null {
  if (period <= 0 || index < period - 1) {
    return null;
  }
  let sum = 0;
  for (let i = index - period + 1; i <= index; i++) {
    sum += values[i];
  }
  return sum / period;
}

/** Wilder RSI. First value appears at `period` (needs `period` daily changes). */
export function rsiSeries(closes: number[], period = 14): Array<number | null> {
  const out: Array<number | null> = Array.from({ length: closes.length }, () => null);
  if (closes.length <= period) {
    return out;
  }

  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= period; i++) {
    const delta = closes[i] - closes[i - 1];
    if (delta >= 0) {
      gain += delta;
    } else {
      loss -= delta;
    }
  }

  let avgGain = gain / period;
  let avgLoss = loss / period;
  out[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);

  for (let i = period + 1; i < closes.length; i++) {
    const delta = closes[i] - closes[i - 1];
    const g = delta > 0 ? delta : 0;
    const l = delta < 0 ? -delta : 0;
    avgGain = (avgGain * (period - 1) + g) / period;
    avgLoss = (avgLoss * (period - 1) + l) / period;
    out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }
  return out;
}

export function enrichBars(bars: Bar[]): EnrichedBar[] {
  const closes = bars.map((b) => b.close);
  const volumes = bars.map((b) => b.volume);
  const rsi = rsiSeries(closes, 14);

  return bars.map((bar, index) => {
    const sma20 = smaAt(closes, index, 20);
    const sma50 = smaAt(closes, index, 50);
    const volSma20 = smaAt(volumes, index, 20);
    const prior = index > 0 ? closes[index - 1] : null;
    const changePct = prior && prior !== 0 ? ((bar.close - prior) / prior) * 100 : null;
    const volumeSpike = volSma20 != null && bar.volume >= 2 * volSma20;
    return {
      ...bar,
      index,
      sma20,
      sma50,
      rsi14: rsi[index],
      volSma20,
      volumeSpike,
      changePct,
    };
  });
}

export function crossedUp(prev: number | null, next: number | null, level: number): boolean {
  return prev != null && next != null && prev < level && next >= level;
}

export function crossedDown(prev: number | null, next: number | null, level: number): boolean {
  return prev != null && next != null && prev >= level && next < level;
}

export function nearLevel(price: number, level: number, pct = 1.5): boolean {
  if (level === 0) {
    return false;
  }
  return (Math.abs(price - level) / level) * 100 <= pct;
}

export function bouncedAtSupport(bar: EnrichedBar, levels: PriceLevel[]): PriceLevel | null {
  const supports = levels.filter((l) => l.kind === "support");
  for (const level of supports) {
    if (nearLevel(bar.low, level.price, 1.8) && bar.close > bar.open && bar.close >= level.price) {
      return level;
    }
  }
  return null;
}

export function windowSlice(bars: EnrichedBar[], startDate: string): EnrichedBar[] {
  const start = bars.findIndex((b) => b.date >= startDate);
  if (start <= 0) {
    return bars;
  }
  return bars.slice(start);
}

export const RULES_BLURB = `Rules-based path (end-of-day, paper only):
1. Start in cash. Fills use that day’s closing price — the same close that created the signal.
2. BUY 100% of cash (fractional shares) if either:
   • Oversold bounce: RSI(14) was below 30 yesterday and is 30+ today, and close ≥ SMA 20; or
   • High-volume breakout: gain vs prior close ≥ 5%, volume ≥ 2× the 20-day average, and close > SMA 20.
3. SELL 100% of shares if any:
   • RSI(14) ≥ 70; or
   • Close drops below SMA 20; or
   • Close is 12% or more below the highest close since entry (trailing stop).
This is a classroom robot, not a strategy to copy with real money.`;
