import type { PatternId } from "./patterns";

/** One daily bar. Prices are classroom units, not a live quote. */
export type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type Trend = "up" | "down" | "flat";
export type Direction = "up" | "down" | "flat";

const EPS = 1e-9;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function makeCandle(
  open: number,
  high: number,
  low: number,
  close: number,
  volume = 12000,
): Candle {
  return {
    open: round2(open),
    close: round2(close),
    high: round2(Math.max(high, low, open, close)),
    low: round2(Math.min(high, low, open, close)),
    volume: Math.max(0, Math.round(volume)),
  };
}

export function bodySize(c: Candle): number {
  return Math.abs(c.close - c.open);
}

export function fullRange(c: Candle): number {
  return c.high - c.low;
}

export function upperShadow(c: Candle): number {
  return c.high - Math.max(c.open, c.close);
}

export function lowerShadow(c: Candle): number {
  return Math.min(c.open, c.close) - c.low;
}

export function isBullish(c: Candle): boolean {
  return c.close > c.open;
}

export function isBearish(c: Candle): boolean {
  return c.close < c.open;
}

/** Color for the board. Doji-sized bodies read as flat so they are not forced green or red. */
export function direction(c: Candle): Direction {
  const range = fullRange(c);
  if (range > EPS && bodySize(c) / range <= 0.08) return "flat";
  if (c.close > c.open) return "up";
  if (c.close < c.open) return "down";
  return "flat";
}

/**
 * Trend of the candles strictly before `endExclusive`.
 * Compares an earlier close with the close just before the pattern.
 * A move of 3% or more counts as a trend. Smaller moves are flat.
 */
export function priorTrend(candles: Candle[], endExclusive: number): Trend {
  if (endExclusive < 2) return "flat";
  const startIdx = Math.max(0, endExclusive - 4);
  const start = candles[startIdx]?.close;
  const end = candles[endExclusive - 1]?.close;
  if (start === undefined || end === undefined || Math.abs(start) < EPS) return "flat";
  const change = (end - start) / Math.abs(start);
  if (change >= 0.03) return "up";
  if (change <= -0.03) return "down";
  return "flat";
}

/** Open and close are almost the same: the body is at most 8% of the high-low range. */
export function isDoji(c: Candle): boolean {
  const range = fullRange(c);
  if (range <= EPS) return false;
  return bodySize(c) / range <= 0.08;
}

/** Doji shaped like a T: long lower wick, almost no upper wick. */
export function isDragonflyDoji(c: Candle): boolean {
  if (!isDoji(c)) return false;
  const range = fullRange(c);
  return upperShadow(c) / range <= 0.1 && lowerShadow(c) / range >= 0.7;
}

/** Doji shaped like an upside-down T: long upper wick, almost no lower wick. */
export function isGravestoneDoji(c: Candle): boolean {
  if (!isDoji(c)) return false;
  const range = fullRange(c);
  return lowerShadow(c) / range <= 0.1 && upperShadow(c) / range >= 0.7;
}

/** A doji with wicks on both sides. Not a dragonfly and not a gravestone. */
export function isStandardDoji(c: Candle): boolean {
  if (!isDoji(c) || isDragonflyDoji(c) || isGravestoneDoji(c)) return false;
  const range = fullRange(c);
  return upperShadow(c) / range >= 0.2 && lowerShadow(c) / range >= 0.2;
}

/**
 * Hammer drawing, ignoring the trend.
 * Small but visible body (more than a doji, at most 35% of the range),
 * lower wick at least twice the body, upper wick at most half the body.
 */
export function isHammerShape(c: Candle): boolean {
  const range = fullRange(c);
  if (range <= EPS) return false;
  const body = bodySize(c);
  const ratio = body / range;
  if (ratio <= 0.08 || ratio > 0.35) return false;
  if (lowerShadow(c) < body * 2) return false;
  if (upperShadow(c) > body * 0.5) return false;
  return true;
}

/**
 * Shooting-star drawing, ignoring the trend.
 * Small visible body, upper wick at least twice the body, lower wick at most half the body.
 */
export function isShootingStarShape(c: Candle): boolean {
  const range = fullRange(c);
  if (range <= EPS) return false;
  const body = bodySize(c);
  const ratio = body / range;
  if (ratio <= 0.08 || ratio > 0.35) return false;
  if (upperShadow(c) < body * 2) return false;
  if (lowerShadow(c) > body * 0.5) return false;
  return true;
}

/** Hammer shape after a drop. */
export function isHammer(candles: Candle[], index: number): boolean {
  const candle = candles[index];
  if (!candle || !isHammerShape(candle)) return false;
  return priorTrend(candles, index) === "down";
}

/** Same drawing as a hammer, after a rise. */
export function isHangingMan(candles: Candle[], index: number): boolean {
  const candle = candles[index];
  if (!candle || !isHammerShape(candle)) return false;
  return priorTrend(candles, index) === "up";
}

/** Shooting-star shape after a rise. */
export function isShootingStar(candles: Candle[], index: number): boolean {
  const candle = candles[index];
  if (!candle || !isShootingStarShape(candle)) return false;
  return priorTrend(candles, index) === "up";
}

/**
 * Small body (bigger than a doji) with wicks on both sides.
 * The shorter wick is at least half the longer one.
 */
export function isSpinningTop(c: Candle): boolean {
  const range = fullRange(c);
  if (range <= EPS) return false;
  const body = bodySize(c);
  const ratio = body / range;
  if (ratio < 0.15 || ratio > 0.4) return false;
  const up = upperShadow(c);
  const down = lowerShadow(c);
  if (up < body * 0.75 || down < body * 0.75) return false;
  const bigger = Math.max(up, down);
  const smaller = Math.min(up, down);
  if (bigger <= EPS) return false;
  return smaller / bigger >= 0.55;
}

/** Tall body, almost no wicks. Each wick is at most 5% of the range. */
export function isMarubozu(c: Candle): boolean {
  const range = fullRange(c);
  if (range <= EPS) return false;
  if (bodySize(c) / range < 0.92) return false;
  return upperShadow(c) / range <= 0.05 && lowerShadow(c) / range <= 0.05;
}

export function isBullishMarubozu(c: Candle): boolean {
  return isBullish(c) && isMarubozu(c);
}

export function isBearishMarubozu(c: Candle): boolean {
  return isBearish(c) && isMarubozu(c);
}

/**
 * Second body is green and completely covers the first red body.
 * Both candles need a real body, and the second body is longer.
 */
export function isBullishEngulfing(prev: Candle, curr: Candle): boolean {
  if (!isBearish(prev) || !isBullish(curr)) return false;
  if (bodySize(prev) <= EPS || bodySize(curr) <= bodySize(prev)) return false;
  return curr.open <= prev.close && curr.close >= prev.open;
}

/** Second body is red and completely covers the first green body. */
export function isBearishEngulfing(prev: Candle, curr: Candle): boolean {
  if (!isBullish(prev) || !isBearish(curr)) return false;
  if (bodySize(prev) <= EPS || bodySize(curr) <= bodySize(prev)) return false;
  return curr.open >= prev.close && curr.close <= prev.open;
}

function isPushCandle(c: Candle, bullish: boolean): boolean {
  const range = fullRange(c);
  if (range <= EPS) return false;
  if (bodySize(c) / range < 0.45) return false;
  return bullish ? isBullish(c) : isBearish(c);
}

/** Three-candle shape only. Callers add the trend check. */
export function isMorningStarShape(a: Candle, b: Candle, c: Candle): boolean {
  if (!isPushCandle(a, false) || !isPushCandle(c, true)) return false;
  const firstBody = bodySize(a);
  if (bodySize(b) > firstBody * 0.4) return false;
  if (Math.max(b.open, b.close) > a.close + firstBody * 0.15) return false;
  const mid = (a.open + a.close) / 2;
  return c.close > mid && c.close > Math.max(b.open, b.close);
}

export function isEveningStarShape(a: Candle, b: Candle, c: Candle): boolean {
  if (!isPushCandle(a, true) || !isPushCandle(c, false)) return false;
  const firstBody = bodySize(a);
  if (bodySize(b) > firstBody * 0.4) return false;
  if (Math.min(b.open, b.close) < a.close - firstBody * 0.15) return false;
  const mid = (a.open + a.close) / 2;
  return c.close < mid && c.close < Math.min(b.open, b.close);
}

export function isMorningStar(candles: Candle[], start: number): boolean {
  const a = candles[start];
  const b = candles[start + 1];
  const c = candles[start + 2];
  if (!a || !b || !c || !isMorningStarShape(a, b, c)) return false;
  return priorTrend(candles, start) === "down";
}

export function isEveningStar(candles: Candle[], start: number): boolean {
  const a = candles[start];
  const b = candles[start + 1];
  const c = candles[start + 2];
  if (!a || !b || !c || !isEveningStarShape(a, b, c)) return false;
  return priorTrend(candles, start) === "up";
}

/** True when the window that starts at `start` is the named pattern. */
export function patternAt(id: PatternId, candles: Candle[], start: number): boolean {
  const a = candles[start];
  const b = candles[start + 1];
  switch (id) {
    case "bullish-engulfing":
      return !!a && !!b && isBullishEngulfing(a, b);
    case "bearish-engulfing":
      return !!a && !!b && isBearishEngulfing(a, b);
    case "hammer":
      return isHammer(candles, start);
    case "hanging-man":
      return isHangingMan(candles, start);
    case "doji":
      return !!a && isStandardDoji(a);
    case "dragonfly":
      return !!a && isDragonflyDoji(a);
    case "gravestone":
      return !!a && isGravestoneDoji(a);
    case "shooting-star":
      return isShootingStar(candles, start);
    case "spinning-top":
      return !!a && isSpinningTop(a);
    case "bullish-marubozu":
      return !!a && isBullishMarubozu(a);
    case "bearish-marubozu":
      return !!a && isBearishMarubozu(a);
    case "morning-star":
      return isMorningStar(candles, start);
    case "evening-star":
      return isEveningStar(candles, start);
  }
}

/** Plain-English read of a single candle's shape. Trend names are called out when the shape is shared. */
export function describeShape(c: Candle): string {
  if (isDragonflyDoji(c)) {
    return "Dragonfly doji: almost no body, and a long lower wick. Price fell, then came back to the high.";
  }
  if (isGravestoneDoji(c)) {
    return "Gravestone doji: almost no body, and a long upper wick. Price rose, then came back to the low.";
  }
  if (isDoji(c)) {
    return "Doji: open and close are almost the same. Neither side won the day.";
  }
  if (isBullishMarubozu(c)) {
    return "Bullish marubozu: a tall body and almost no wicks. Buyers held the day from open to close.";
  }
  if (isBearishMarubozu(c)) {
    return "Bearish marubozu: a tall body and almost no wicks. Sellers held the day from open to close.";
  }
  if (isHammerShape(c)) {
    return "Hammer shape: small body on top, long lower wick. After a drop this is a hammer. After a rise the same drawing is a hanging man.";
  }
  if (isShootingStarShape(c)) {
    return "Shooting-star shape: small body, long upper wick. After a rise, this is a shooting star.";
  }
  if (isSpinningTop(c)) {
    return "Spinning top: a small body with wicks on both sides. A tug-of-war, not a strong close.";
  }
  if (isBullish(c)) {
    return "Up day: the close is above the open. The body is tall enough that this is not one of the small-body patterns.";
  }
  if (isBearish(c)) {
    return "Down day: the close is below the open. The body is tall enough that this is not one of the small-body patterns.";
  }
  return "Open and close are the same price.";
}

export function formatPrice(n: number): string {
  return n.toFixed(2);
}

export function formatVolume(n: number): string {
  if (n >= 1000) {
    const scaled = n / 1000;
    return `${scaled >= 10 ? scaled.toFixed(0) : scaled.toFixed(1)}k`;
  }
  return String(n);
}

export function candleSummary(c: Candle, day: number): string {
  const dir = direction(c);
  const word = dir === "up" ? "up day" : dir === "down" ? "down day" : "open and close almost equal";
  return `Day ${day}: open ${formatPrice(c.open)}, high ${formatPrice(c.high)}, low ${formatPrice(c.low)}, close ${formatPrice(c.close)}. ${word}.`;
}
