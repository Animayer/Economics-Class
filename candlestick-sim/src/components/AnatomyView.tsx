import { useState } from "react";
import {
  describeShape,
  direction,
  formatPrice,
  fullRange,
  makeCandle,
  type Candle,
} from "../lib/candles";
import { PALETTES, type Palette } from "../lib/palette";

type PartId = "high" | "low" | "open" | "close" | "body" | "upper" | "lower";

const PARTS: { id: PartId; label: string; text: string }[] = [
  {
    id: "body",
    label: "Body",
    text: "The rectangle from open to close. A tall body means price moved a lot between the start of the day and the end.",
  },
  {
    id: "upper",
    label: "Upper wick",
    text: "Also called the upper shadow. Price traded up here, then came back. The day did not close at the high.",
  },
  {
    id: "lower",
    label: "Lower wick",
    text: "Also called the lower shadow. Price traded down here, then came back. The day did not close at the low.",
  },
  {
    id: "open",
    label: "Open",
    text: "The first price of the day. On an up candle it is the bottom of the body. On a down candle it is the top of the body.",
  },
  {
    id: "close",
    label: "Close",
    text: "The last price of the day. On an up candle it is the top of the body. On a down candle it is the bottom of the body.",
  },
  {
    id: "high",
    label: "High",
    text: "The highest price during that day. It is the top of the upper wick.",
  },
  {
    id: "low",
    label: "Low",
    text: "The lowest price during that day. It is the bottom of the lower wick.",
  },
];

const PRESETS: { id: string; label: string; part: PartId; candle: Candle }[] = [
  { id: "up", label: "Up day", part: "body", candle: makeCandle(46, 58, 44, 55) },
  { id: "down", label: "Down day", part: "body", candle: makeCandle(55, 58, 44, 46) },
  { id: "hammer", label: "Hammer shape", part: "lower", candle: makeCandle(50, 52, 44, 51.6) },
  { id: "star", label: "Shooting star", part: "upper", candle: makeCandle(51, 58, 49.4, 49.8) },
  { id: "doji", label: "Doji", part: "body", candle: makeCandle(50, 54, 46, 50) },
  { id: "dragon", label: "Dragonfly", part: "lower", candle: makeCandle(50, 50.3, 44, 50) },
  { id: "grave", label: "Gravestone", part: "upper", candle: makeCandle(44, 50, 43.7, 44) },
  { id: "spin", label: "Spinning top", part: "body", candle: makeCandle(49, 54, 46, 51) },
  { id: "maru", label: "Marubozu", part: "body", candle: makeCandle(45, 56.2, 44.8, 56) },
];

type Props = { palette: Palette };

export function AnatomyView({ palette }: Props) {
  const [candle, setCandle] = useState<Candle>(PRESETS[0]!.candle);
  const [presetId, setPresetId] = useState("up");
  const [part, setPart] = useState<PartId>("body");
  const colors = PALETTES[palette];
  const dir = direction(candle);
  const color = dir === "up" ? colors.up : dir === "down" ? colors.down : colors.flat;
  const active = PARTS.find((item) => item.id === part) ?? PARTS[0]!;

  const pad = Math.max(fullRange(candle) * 0.22, 1);
  const min = candle.low - pad;
  const max = candle.high + pad;
  const yTop = 36;
  const yHeight = 470;
  const y = (price: number) => yTop + ((max - price) / (max - min || 1)) * yHeight;
  const cx = 250;
  const bodyW = 108;
  const yOpen = y(candle.open);
  const yClose = y(candle.close);
  const yHigh = y(candle.high);
  const yLow = y(candle.low);
  const bodyTop = Math.min(yOpen, yClose);
  const bodyBot = Math.max(yOpen, yClose);
  const bodyH = Math.max(bodyBot - bodyTop, 8);

  const choosePreset = (id: string) => {
    const preset = PRESETS.find((item) => item.id === id);
    if (!preset) return;
    setPresetId(id);
    setCandle(preset.candle);
    setPart(preset.part);
  };

  const morphFrom = (kind: "flip" | "lower" | "upper" | "grow" | "shrink") => {
    setPresetId("");
    setCandle((current) => morph(current, kind));
  };

  return (
    <section className="anatomy" aria-label="Candle anatomy">
      <div className="anatomy-figure">
        <svg viewBox="0 0 760 560" role="img" aria-label="One candlestick with open, high, low, and close labeled">
          <title>Candlestick anatomy</title>
          <line
            x1={cx}
            x2={cx}
            y1={yHigh}
            y2={yLow}
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <rect
            x={cx - bodyW / 2}
            y={bodyTop}
            width={bodyW}
            height={bodyH}
            rx="8"
            fill={dir === "down" && palette === "colorblind" ? "url(#anatomy-hatch)" : color}
            stroke="rgba(7,16,24,0.4)"
            strokeWidth="2"
          />
          <defs>
            <pattern id="anatomy-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
              <rect width="8" height="8" fill={colors.down} />
              <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(40,16,0,0.45)" strokeWidth="3" />
            </pattern>
          </defs>

          <Hotspot
            label="High"
            active={part === "high"}
            x={cx - 28}
            y={yHigh - 22}
            w={56}
            h={44}
            onSelect={() => setPart("high")}
          />
          <Hotspot
            label="Upper wick"
            active={part === "upper"}
            x={cx - 28}
            y={yHigh}
            w={56}
            h={Math.max(bodyTop - yHigh, 16)}
            onSelect={() => setPart("upper")}
          />
          <Hotspot
            label="Body"
            active={part === "body"}
            x={cx - bodyW / 2 - 8}
            y={bodyTop}
            w={bodyW + 16}
            h={bodyH}
            onSelect={() => setPart("body")}
          />
          <Hotspot
            label="Lower wick"
            active={part === "lower"}
            x={cx - 28}
            y={bodyTop + bodyH}
            w={56}
            h={Math.max(yLow - (bodyTop + bodyH), 16)}
            onSelect={() => setPart("lower")}
          />
          <Hotspot
            label="Low"
            active={part === "low"}
            x={cx - 28}
            y={yLow - 8}
            w={56}
            h={44}
            onSelect={() => setPart("low")}
          />
          <Hotspot
            label="Open"
            active={part === "open"}
            x={cx - bodyW / 2 - 36}
            y={yOpen - 18}
            w={bodyW + 72}
            h={36}
            onSelect={() => setPart("open")}
          />
          <Hotspot
            label="Close"
            active={part === "close"}
            x={cx - bodyW / 2 - 36}
            y={yClose - 18}
            w={bodyW + 72}
            h={36}
            onSelect={() => setPart("close")}
          />

          <Label x={430} y={yHigh} text={`High ${formatPrice(candle.high)}`} on={part === "high"} />
          <Label x={430} y={yLow} text={`Low ${formatPrice(candle.low)}`} on={part === "low"} />
          <Label x={40} y={yOpen} text={`Open ${formatPrice(candle.open)}`} on={part === "open"} anchor="start" />
          <Label
            x={40}
            y={Math.abs(yClose - yOpen) < 36 ? yClose + 32 : yClose}
            text={`Close ${formatPrice(candle.close)}`}
            on={part === "close"}
            anchor="start"
          />
          <Label
            x={430}
            y={(yHigh + bodyTop) / 2}
            text="Upper wick"
            on={part === "upper"}
          />
          <Label x={430} y={bodyTop + bodyH / 2} text="Body" on={part === "body"} />
          <Label
            x={430}
            y={(bodyTop + bodyH + yLow) / 2}
            text="Lower wick"
            on={part === "lower"}
          />
        </svg>
      </div>

      <div className="anatomy-copy">
        <p className="kicker">One day · one candle</p>
        <h2>{active.label}</h2>
        <p className="explain">{active.text}</p>
        <p className="shape-read">{describeShape(candle)}</p>
        <dl className="ohlc">
          <div>
            <dt>Open</dt>
            <dd>{formatPrice(candle.open)}</dd>
          </div>
          <div>
            <dt>High</dt>
            <dd>{formatPrice(candle.high)}</dd>
          </div>
          <div>
            <dt>Low</dt>
            <dd>{formatPrice(candle.low)}</dd>
          </div>
          <div>
            <dt>Close</dt>
            <dd>{formatPrice(candle.close)}</dd>
          </div>
        </dl>
        <div className="part-row" role="group" aria-label="Candle parts">
          {PARTS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip${part === item.id ? " is-on" : ""}`}
              aria-pressed={part === item.id}
              onClick={() => setPart(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="part-row" role="group" aria-label="Change the candle">
          <button type="button" className="chip" onClick={() => morphFrom("flip")}>
            Flip up / down
          </button>
          <button type="button" className="chip" onClick={() => morphFrom("lower")}>
            Longer lower wick
          </button>
          <button type="button" className="chip" onClick={() => morphFrom("upper")}>
            Longer upper wick
          </button>
          <button type="button" className="chip" onClick={() => morphFrom("grow")}>
            Bigger body
          </button>
          <button type="button" className="chip" onClick={() => morphFrom("shrink")}>
            Smaller body
          </button>
        </div>
        <div className="part-row" role="group" aria-label="Example shapes">
          {PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip${presetId === item.id ? " is-on" : ""}`}
              aria-pressed={presetId === item.id}
              onClick={() => choosePreset(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="fine">
          Shape is only half the lesson. A hammer and a hanging man can look the same. The trend before
          them is the other half. That part is in Teach mode.
        </p>
      </div>
    </section>
  );
}

function morph(c: Candle, kind: "flip" | "lower" | "upper" | "grow" | "shrink"): Candle {
  const range = Math.max(fullRange(c), 2);
  if (kind === "flip") return makeCandle(c.close, c.high, c.low, c.open, c.volume);
  if (kind === "lower") return makeCandle(c.open, c.high, c.low - range * 0.3, c.close, c.volume);
  if (kind === "upper") return makeCandle(c.open, c.high + range * 0.3, c.low, c.close, c.volume);
  const mid = (c.open + c.close) / 2;
  const sign = c.close >= c.open ? 1 : -1;
  if (kind === "grow") {
    const next = Math.abs(c.close - c.open) / 2 + range * 0.18;
    return makeCandle(mid - sign * next, c.high, c.low, mid + sign * next, c.volume);
  }
  const next = Math.max(0.04, (Math.abs(c.close - c.open) / 2) * 0.5);
  return makeCandle(mid - sign * next, c.high, c.low, mid + sign * next, c.volume);
}

function Hotspot({
  label,
  active,
  x,
  y,
  w,
  h,
  onSelect,
}: {
  label: string;
  active: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  onSelect: () => void;
}) {
  return (
    <rect
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={active}
      x={x}
      y={y}
      width={Math.max(w, 8)}
      height={Math.max(h, 8)}
      rx="8"
      fill={active ? "rgba(227,179,65,0.28)" : "transparent"}
      stroke={active ? "#e3b341" : "transparent"}
      strokeWidth="3"
      className="hotspot"
      onClick={onSelect}
      onFocus={onSelect}
      onMouseEnter={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
    />
  );
}

function Label({
  x,
  y,
  text,
  on,
  anchor = "start",
}: {
  x: number;
  y: number;
  text: string;
  on: boolean;
  anchor?: "start" | "middle";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={on ? "#e3b341" : "#f4efe4"}
      fontSize="22"
      fontWeight="800"
      fontFamily="Source Sans 3, sans-serif"
    >
      {text}
    </text>
  );
}
