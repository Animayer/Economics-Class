import { makeCandle, type Candle } from "./candles";
import { getPattern, type PatternId } from "./patterns";

export type ChartSeries = {
  id: PatternId;
  ticker: string;
  candles: Candle[];
  /** Index of the first pattern candle. Candles before this are the setup. */
  patternStart: number;
  /** Index of the last pattern candle. The pattern always finishes the chart. */
  patternEnd: number;
};

const TICKERS: Record<PatternId, string> = {
  "bullish-engulfing": "MAYER CO",
  "bearish-engulfing": "MAYER CO",
  hammer: "CREEK MFG",
  "hanging-man": "CREEK MFG",
  doji: "CLASS INC",
  dragonfly: "CLASS INC",
  gravestone: "CLASS INC",
  "shooting-star": "PALMETTO CO",
  "spinning-top": "BEE MARKET",
  "bullish-marubozu": "HARBOR CO",
  "bearish-marubozu": "HARBOR CO",
  "morning-star": "BATTERY INC",
  "evening-star": "BATTERY INC",
};

/**
 * Hand-built daily bars. Each series is a short, clean path that ends in one pattern.
 * Prices are made up for class. They are not quotes for a real company.
 */
const BUILDERS: Record<PatternId, () => Candle[]> = {
  "bullish-engulfing": () => [
    makeCandle(60, 60.5, 56.6, 57.2, 11000),
    makeCandle(57, 57.4, 53.8, 54.4, 12400),
    makeCandle(54.2, 54.6, 51, 51.6, 11800),
    makeCandle(51.4, 51.8, 48.4, 49, 13200),
    makeCandle(48.8, 49.3, 46.8, 47.4, 14100),
    makeCandle(46.9, 50, 46.4, 49.6, 21400),
  ],
  "bearish-engulfing": () => [
    makeCandle(44, 47, 43.6, 46.6, 10800),
    makeCandle(46.7, 49.6, 46.3, 49.2, 12100),
    makeCandle(49.3, 52.2, 48.9, 51.8, 11600),
    makeCandle(51.9, 54.6, 51.5, 54.2, 13400),
    makeCandle(54.3, 56.2, 53.8, 55.7, 14800),
    makeCandle(56.2, 56.6, 53, 53.4, 22100),
  ],
  hammer: () => [
    makeCandle(64, 64.4, 60.6, 61.2, 11200),
    makeCandle(61, 61.4, 57.4, 58, 12600),
    makeCandle(57.8, 58.2, 54, 54.6, 11900),
    makeCandle(54.4, 54.8, 50.9, 51.5, 13800),
    makeCandle(51.3, 51.6, 47.8, 48.4, 14200),
    makeCandle(48.2, 49.8, 43.6, 49.4, 23600),
  ],
  "hanging-man": () => [
    makeCandle(42, 45.4, 41.6, 45, 10900),
    makeCandle(45.1, 48.6, 44.7, 48.2, 12200),
    makeCandle(48.3, 51.8, 47.9, 51.4, 11700),
    makeCandle(51.5, 55, 51.1, 54.6, 13100),
    makeCandle(54.7, 58, 54.3, 57.6, 14600),
    makeCandle(58, 58.4, 52.2, 56.9, 22800),
  ],
  doji: () => [
    makeCandle(46, 47.8, 45.6, 47.4, 10400),
    makeCandle(47.5, 49, 47.1, 48.6, 11100),
    makeCandle(48.7, 49.9, 48.3, 49.5, 10800),
    makeCandle(49.6, 50.6, 49.2, 50.2, 11500),
    makeCandle(50.3, 51.2, 49.9, 50.8, 12100),
    makeCandle(51, 54.2, 47.8, 51, 16800),
  ],
  dragonfly: () => [
    makeCandle(58, 58.4, 55.5, 56, 11300),
    makeCandle(55.8, 56.2, 53.5, 54, 12000),
    makeCandle(53.8, 54.2, 51.7, 52.2, 11800),
    makeCandle(52, 52.4, 50.1, 50.6, 12600),
    makeCandle(50.4, 50.8, 48.7, 49.2, 13400),
    makeCandle(49, 49.25, 44.2, 49, 19200),
  ],
  gravestone: () => [
    makeCandle(44, 46.4, 43.6, 46, 10600),
    makeCandle(46.1, 48.2, 45.7, 47.8, 11400),
    makeCandle(47.9, 49.8, 47.5, 49.4, 11900),
    makeCandle(49.5, 51.2, 49.1, 50.8, 12300),
    makeCandle(50.9, 52.4, 50.5, 52, 13100),
    makeCandle(52.2, 57.4, 51.95, 52.2, 18800),
  ],
  "shooting-star": () => [
    makeCandle(40, 43.6, 39.6, 43.2, 10200),
    makeCandle(43.3, 47, 42.9, 46.6, 11800),
    makeCandle(46.7, 50.4, 46.3, 50, 12400),
    makeCandle(50.1, 53.8, 49.7, 53.4, 12900),
    makeCandle(53.5, 57, 53.1, 56.6, 14100),
    makeCandle(56.8, 61.6, 55.3, 55.7, 23400),
  ],
  "spinning-top": () => [
    makeCandle(46.5, 48.2, 46, 47.6, 10100),
    makeCandle(47.7, 49.1, 47.2, 48.5, 10800),
    makeCandle(48.6, 50, 48.1, 49.3, 11200),
    makeCandle(49.4, 50.6, 48.9, 49.9, 10900),
    makeCandle(50, 51.2, 49.5, 50.4, 11600),
    makeCandle(50, 54.2, 47.6, 51.6, 17400),
  ],
  "bullish-marubozu": () => [
    makeCandle(44, 46.2, 43.5, 45.8, 11000),
    makeCandle(45.9, 48, 45.4, 47.6, 11800),
    makeCandle(47.7, 49.6, 47.2, 49.2, 12100),
    makeCandle(49.3, 51.2, 48.8, 50.7, 12700),
    makeCandle(50.8, 52.6, 50.3, 52.1, 13600),
    makeCandle(52, 60.25, 51.8, 60, 24800),
  ],
  "bearish-marubozu": () => [
    makeCandle(70, 70.5, 66.6, 67.2, 11200),
    makeCandle(67, 67.4, 63.6, 64, 12000),
    makeCandle(63.8, 64.2, 60.6, 61, 11800),
    makeCandle(60.8, 61.2, 57.8, 58.2, 12600),
    makeCandle(58, 58.4, 55.4, 55.8, 13400),
    makeCandle(55.6, 55.8, 47.4, 47.6, 24600),
  ],
  "morning-star": () => [
    makeCandle(66, 66.6, 62.4, 63, 11400),
    makeCandle(62.8, 63.2, 59, 59.6, 12200),
    makeCandle(59.4, 59.8, 55.9, 56.5, 12800),
    makeCandle(55, 56.4, 48.4, 49.2, 18600),
    makeCandle(48.6, 49.2, 47.6, 48.1, 14200),
    makeCandle(48.4, 53.8, 48, 53.2, 25200),
  ],
  "evening-star": () => [
    makeCandle(42, 45.6, 41.6, 45.2, 10800),
    makeCandle(45.3, 48.8, 44.9, 48.4, 11600),
    makeCandle(48.5, 52, 48.1, 51.6, 12400),
    makeCandle(51.8, 58.2, 51.2, 57.4, 18400),
    makeCandle(57.8, 58.8, 57.4, 58.3, 13900),
    makeCandle(58, 58.4, 53.1, 53.6, 24900),
  ],
};

export function generateSeries(id: PatternId): ChartSeries {
  const info = getPattern(id);
  const candles = BUILDERS[id]();
  const patternEnd = candles.length - 1;
  const patternStart = patternEnd - (info.candleCount - 1);
  return {
    id,
    ticker: TICKERS[id],
    candles,
    patternStart,
    patternEnd,
  };
}

export const MADE_UP_NOTE = "Made-up company · not a real stock · daily bars for class";
