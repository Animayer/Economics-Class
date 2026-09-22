import { describe, expect, it } from "vitest";
import {
  candleSummary,
  describeShape,
  direction,
  isBearishEngulfing,
  isBearishMarubozu,
  isBullishEngulfing,
  isBullishMarubozu,
  isDoji,
  isDragonflyDoji,
  isGravestoneDoji,
  isHammer,
  isHammerShape,
  isHangingMan,
  isMorningStar,
  isEveningStar,
  isShootingStar,
  isSpinningTop,
  isStandardDoji,
  makeCandle,
  priorTrend,
} from "../lib/candles";

const up = makeCandle(46, 58, 44, 55);
const down = makeCandle(55, 58, 44, 46);
const hammer = makeCandle(50, 52, 44, 51.6);
const star = makeCandle(51, 58, 49.4, 49.8);
const doji = makeCandle(50, 54, 46, 50);
const dragon = makeCandle(50, 50.3, 44, 50);
const grave = makeCandle(44, 50, 43.7, 44);
const spin = makeCandle(49, 54, 46, 51);
const bullMaru = makeCandle(45, 56.2, 44.8, 56);
const bearMaru = makeCandle(56, 56.2, 44.8, 45);

describe("candle geometry", () => {
  it("keeps high at the top and low at the bottom", () => {
    const c = makeCandle(10, 8, 12, 11, 500);
    expect(c.high).toBe(12);
    expect(c.low).toBe(8);
    expect(c.volume).toBe(500);
  });

  it("colors a doji as flat and a rising close as up", () => {
    expect(direction(up)).toBe("up");
    expect(direction(down)).toBe("down");
    expect(direction(doji)).toBe("flat");
  });

  it("reads a 3% slide as a downtrend and ignores a tiny drift", () => {
    const falling = [makeCandle(50, 51, 46, 47), makeCandle(47, 48, 43, 44), makeCandle(44, 45, 40, 41)];
    expect(priorTrend(falling, 3)).toBe("down");
    const quiet = [makeCandle(50, 51, 49, 50.2), makeCandle(50.2, 51, 49.5, 50.4)];
    expect(priorTrend(quiet, 2)).toBe("flat");
  });
});

describe("single-candle patterns", () => {
  it("names the classroom shapes", () => {
    expect(isHammerShape(hammer)).toBe(true);
    expect(isShootingStar(starShapeSeries(), 1)).toBe(false);
    expect(isDoji(doji)).toBe(true);
    expect(isStandardDoji(doji)).toBe(true);
    expect(isDragonflyDoji(dragon)).toBe(true);
    expect(isStandardDoji(dragon)).toBe(false);
    expect(isGravestoneDoji(grave)).toBe(true);
    expect(isSpinningTop(spin)).toBe(true);
    expect(isSpinningTop(doji)).toBe(false);
    expect(isBullishMarubozu(bullMaru)).toBe(true);
    expect(isBearishMarubozu(bearMaru)).toBe(true);
    expect(isBullishMarubozu(bearMaru)).toBe(false);
    expect(isHammerShape(bullMaru)).toBe(false);
    expect(isDoji(hammer)).toBe(false);
  });

  it("requires a drop before a hammer and a rise before a hanging man", () => {
    const drop = [makeCandle(60, 61, 56, 57), makeCandle(57, 58, 52, 53), makeCandle(53, 54, 49, 50), hammer];
    expect(isHammer(drop, 3)).toBe(true);
    expect(isHangingMan(drop, 3)).toBe(false);

    const rise = [makeCandle(40, 44, 39, 43), makeCandle(43, 48, 42, 47), makeCandle(47, 52, 46, 51), hammer];
    expect(isHangingMan(rise, 3)).toBe(true);
    expect(isHammer(rise, 3)).toBe(false);
  });

  it("requires a rise before a shooting star", () => {
    const rise = [makeCandle(40, 44, 39, 43), makeCandle(43, 48, 42, 47), makeCandle(47, 52, 46, 51), star];
    expect(isShootingStar(rise, 3)).toBe(true);
    const drop = [makeCandle(60, 61, 55, 56), makeCandle(56, 57, 50, 51), makeCandle(51, 52, 46, 47), star];
    expect(isShootingStar(drop, 3)).toBe(false);
  });
});

describe("multi-candle patterns", () => {
  it("detects a bullish engulfing only when the green body covers the red body", () => {
    const red = makeCandle(48.8, 49.3, 46.8, 47.4);
    const green = makeCandle(46.9, 50, 46.4, 49.6);
    expect(isBullishEngulfing(red, green)).toBe(true);
    expect(isBearishEngulfing(red, green)).toBe(false);
    const tooSmall = makeCandle(47.2, 48.4, 46.9, 48.2);
    expect(isBullishEngulfing(red, tooSmall)).toBe(false);
  });

  it("detects a bearish engulfing as the mirror image", () => {
    const green = makeCandle(54.3, 56.2, 53.8, 55.7);
    const red = makeCandle(56.2, 56.6, 53, 53.4);
    expect(isBearishEngulfing(green, red)).toBe(true);
    expect(isBullishEngulfing(green, red)).toBe(false);
  });

  it("detects a morning star after a drop and an evening star after a rise", () => {
    const morning = [
      makeCandle(66, 66.6, 62.4, 63),
      makeCandle(62.8, 63.2, 59, 59.6),
      makeCandle(59.4, 59.8, 55.9, 56.5),
      makeCandle(55, 56.4, 48.4, 49.2),
      makeCandle(48.6, 49.2, 47.6, 48.1),
      makeCandle(48.4, 53.8, 48, 53.2),
    ];
    expect(isMorningStar(morning, 3)).toBe(true);
    expect(isEveningStar(morning, 3)).toBe(false);

    const evening = [
      makeCandle(42, 45.6, 41.6, 45.2),
      makeCandle(45.3, 48.8, 44.9, 48.4),
      makeCandle(48.5, 52, 48.1, 51.6),
      makeCandle(51.8, 58.2, 51.2, 57.4),
      makeCandle(57.8, 58.8, 57.4, 58.3),
      makeCandle(58, 58.4, 53.1, 53.6),
    ];
    expect(isEveningStar(evening, 3)).toBe(true);
    expect(isMorningStar(evening, 3)).toBe(false);
  });
});

describe("plain-English descriptions", () => {
  it("tells a hammer shape apart from a doji and a marubozu", () => {
    expect(describeShape(hammer)).toMatch(/hammer/i);
    expect(describeShape(doji)).toMatch(/doji/i);
    expect(describeShape(bullMaru)).toMatch(/marubozu/i);
    expect(describeShape(dragon)).toMatch(/dragonfly/i);
    expect(candleSummary(up, 2)).toContain("Day 2");
    expect(candleSummary(up, 2)).toContain("up day");
  });
});

function starShapeSeries() {
  return [makeCandle(10, 11, 9, 10), star];
}
