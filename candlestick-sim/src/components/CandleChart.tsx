import { useId, useState } from "react";
import {
  candleSummary,
  direction,
  formatPrice,
  formatVolume,
  type Candle,
} from "../lib/candles";
import type { ChartSeries } from "../lib/generate";
import { MADE_UP_NOTE } from "../lib/generate";
import { PALETTES, type Palette } from "../lib/palette";

type Props = {
  series: ChartSeries;
  visibleCount: number;
  showLabels: boolean;
  showVolume: boolean;
  palette: Palette;
  title: string;
  detail: string;
  compact?: boolean;
  tickerOverride?: string;
};

export function CandleChart({
  series,
  visibleCount,
  showLabels,
  showVolume,
  palette,
  title,
  detail,
  compact = false,
  tickerOverride,
}: Props) {
  const reactId = useId().replace(/:/g, "");
  const titleId = `chart-title-${reactId}`;
  const glowId = `glow-${reactId}`;
  const hatchId = `hatch-${reactId}`;
  const colors = PALETTES[palette];
  const [hover, setHover] = useState<number | null>(null);

  const vbW = 1000;
  const vbH = showVolume ? 640 : 540;
  const padL = compact ? 14 : 20;
  const padR = compact ? 72 : 86;
  const padT = compact ? 18 : 26;
  const padB = showVolume ? (compact ? 108 : 124) : compact ? 46 : 54;
  const volH = showVolume ? (compact ? 64 : 78) : 0;
  const volGap = showVolume ? 14 : 0;
  const plotW = vbW - padL - padR;
  const plotH = vbH - padT - padB - volH - volGap;

  let min = Infinity;
  let max = -Infinity;
  let maxVol = 1;
  for (const candle of series.candles) {
    min = Math.min(min, candle.low);
    max = Math.max(max, candle.high);
    maxVol = Math.max(maxVol, candle.volume);
  }
  const span = max - min || 1;
  const pad = span * 0.14;
  min -= pad;
  max += pad;
  const axisDigits = span >= 12 ? 0 : span >= 4 ? 1 : 2;

  const y = (price: number) => padT + ((max - price) / (max - min)) * plotH;
  const n = series.candles.length;
  const slot = plotW / n;
  const bodyW = Math.max(compact ? 16 : 26, Math.min(compact ? 46 : 70, slot * 0.56));
  const cx = (index: number) => padL + slot * index + slot / 2;

  const ticks = compact ? 3 : 4;
  const tickPrices = Array.from({ length: ticks }, (_, index) => {
    return max - ((max - min) * index) / (ticks - 1);
  });

  const shownEnd = Math.max(0, Math.min(visibleCount, n));
  const focusIndex =
    hover !== null && hover < shownEnd ? hover : shownEnd > 0 ? shownEnd - 1 : null;
  const focus = focusIndex === null ? null : series.candles[focusIndex];

  const patternVisible = showLabels && shownEnd > series.patternStart;
  const patternDone = shownEnd > series.patternEnd;
  const bracketEnd = Math.min(series.patternEnd, shownEnd - 1);

  const ticker = tickerOverride ?? series.ticker;
  const summary =
    focus && focusIndex !== null
      ? candleSummary(focus, focusIndex + 1)
      : `${ticker}. No days on the board yet.`;

  return (
    <figure className={`chart-card${compact ? " is-compact" : ""}`}>
      <figcaption className="chart-banner">
        <p className="kicker">
          {ticker}
          <span> · {MADE_UP_NOTE}</span>
        </p>
        <h2>{title}</h2>
        <p>{detail}</p>
      </figcaption>

      <div className="chart-canvas">
        <svg
          viewBox={`0 0 ${vbW} ${vbH}`}
          role="img"
          aria-labelledby={titleId}
          preserveAspectRatio="xMidYMid meet"
        >
          <title id={titleId}>{summary}</title>
          <defs>
            <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#e3b341" floodOpacity="0.9" />
            </filter>
            <pattern
              id={hatchId}
              width="7"
              height="7"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(40)"
            >
              <rect width="7" height="7" fill={colors.down} />
              <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(40, 16, 0, 0.45)" strokeWidth="2.4" />
            </pattern>
          </defs>

          {tickPrices.map((price) => {
            const yy = y(price);
            return (
              <g key={price}>
                <line
                  x1={padL}
                  x2={padL + plotW}
                  y1={yy}
                  y2={yy}
                  stroke="#2d4d64"
                  strokeWidth="1.5"
                />
                <text
                  x={vbW - 10}
                  y={yy + 5}
                  textAnchor="end"
                  fill="#d5e2ea"
                  fontSize={compact ? 20 : 18}
                  fontWeight="700"
                  fontFamily="Source Sans 3, sans-serif"
                >
                  {price.toFixed(axisDigits)}
                </text>
              </g>
            );
          })}

          {patternVisible && bracketEnd >= series.patternStart ? (
            <rect
              x={cx(series.patternStart) - bodyW / 2 - 12}
              y={padT + 2}
              width={cx(bracketEnd) - cx(series.patternStart) + bodyW + 24}
              height={plotH - 4}
              rx="16"
              fill="rgba(227, 179, 65, 0.08)"
              stroke="#e3b341"
              strokeWidth={patternDone ? 4 : 3}
              strokeDasharray={patternDone ? undefined : "10 8"}
              filter={patternDone ? `url(#${glowId})` : undefined}
            />
          ) : null}

          {series.candles.map((candle, index) => {
            if (index >= shownEnd) return null;
            return (
              <CandleGlyph
                key={index}
                candle={candle}
                cx={cx(index)}
                bodyW={bodyW}
                y={y}
                colors={colors}
                palette={palette}
                hatchId={hatchId}
                glow={
                  showLabels &&
                  patternDone &&
                  index >= series.patternStart &&
                  index <= series.patternEnd
                }
                glowId={glowId}
                active={index === focusIndex}
                onEnter={() => setHover(index)}
                onLeave={() => setHover((current) => (current === index ? null : current))}
              />
            );
          })}

          {showVolume
            ? series.candles.map((candle, index) => {
                if (index >= shownEnd) return null;
                const height = (candle.volume / maxVol) * (volH - 8);
                const top = padT + plotH + volGap + (volH - height);
                const dir = direction(candle);
                const fill = dir === "up" ? colors.up : dir === "down" ? colors.down : colors.flat;
                return (
                  <rect
                    key={`vol-${index}`}
                    x={cx(index) - bodyW / 2}
                    y={top}
                    width={bodyW}
                    height={Math.max(height, 2)}
                    rx="3"
                    fill={fill}
                    opacity="0.85"
                  />
                );
              })
            : null}

          {showVolume ? (
            <text
              x={padL}
              y={padT + plotH + volGap + 16}
              fill="#b9c8d3"
              fontSize="16"
              fontWeight="700"
              fontFamily="Source Sans 3, sans-serif"
            >
              Volume
            </text>
          ) : null}

          {series.candles.map((_, index) => (
            <text
              key={`day-${index}`}
              x={cx(index)}
              y={vbH - 14}
              textAnchor="middle"
              fill={index < shownEnd ? "#f4efe4" : "#5d7486"}
              fontSize={compact ? 18 : 20}
              fontWeight="800"
              fontFamily="Source Sans 3, sans-serif"
            >
              {compact ? String(index + 1) : `Day ${index + 1}`}
            </text>
          ))}
        </svg>
      </div>

      <div className="readout" aria-live="polite">
        {focus && focusIndex !== null ? (
          <>
            <strong>Day {focusIndex + 1}</strong>
            <span>Open {formatPrice(focus.open)}</span>
            <span>High {formatPrice(focus.high)}</span>
            <span>Low {formatPrice(focus.low)}</span>
            <span>Close {formatPrice(focus.close)}</span>
            {showVolume ? <span>Vol {formatVolume(focus.volume)}</span> : null}
            <em className={`dir dir-${direction(focus)}`}>
              {direction(focus) === "up"
                ? "Close above open"
                : direction(focus) === "down"
                  ? "Close below open"
                  : "Open and close match"}
            </em>
          </>
        ) : (
          <span>Replay is starting. The first day is about to print.</span>
        )}
      </div>

      <ul className="legend">
        <li>
          <i className="swatch swatch-up" style={{ background: colors.up }} />
          Close above open
        </li>
        <li>
          <i
            className={`swatch swatch-down${palette === "colorblind" ? " is-striped" : ""}`}
            style={{ background: colors.down }}
          />
          Close below open
        </li>
        <li>
          <i className="swatch swatch-flat" style={{ background: colors.flat }} />
          Doji · almost equal
        </li>
      </ul>

      <table className="sr-only">
        <caption>
          {ticker} daily open, high, low, and close. {summary}
        </caption>
        <thead>
          <tr>
            <th>Day</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
          </tr>
        </thead>
        <tbody>
          {series.candles.slice(0, shownEnd).map((candle, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{formatPrice(candle.open)}</td>
              <td>{formatPrice(candle.high)}</td>
              <td>{formatPrice(candle.low)}</td>
              <td>{formatPrice(candle.close)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function CandleGlyph({
  candle,
  cx,
  bodyW,
  y,
  colors,
  palette,
  hatchId,
  glow,
  glowId,
  active,
  onEnter,
  onLeave,
}: {
  candle: Candle;
  cx: number;
  bodyW: number;
  y: (price: number) => number;
  colors: { up: string; down: string; flat: string };
  palette: Palette;
  hatchId: string;
  glow: boolean;
  glowId: string;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const dir = direction(candle);
  const color = dir === "up" ? colors.up : dir === "down" ? colors.down : colors.flat;
  const fill = dir === "down" && palette === "colorblind" ? `url(#${hatchId})` : color;
  const yOpen = y(candle.open);
  const yClose = y(candle.close);
  const top = Math.min(yOpen, yClose);
  const bottom = Math.max(yOpen, yClose);
  const height = Math.max(bottom - top, dir === "flat" ? 6 : 4);

  return (
    <g onMouseEnter={onEnter} onMouseLeave={onLeave} filter={glow ? `url(#${glowId})` : undefined}>
      <line
        x1={cx}
        x2={cx}
        y1={y(candle.high)}
        y2={y(candle.low)}
        stroke={color}
        strokeWidth={active ? 7 : 5}
        strokeLinecap="round"
      />
      <rect
        x={cx - bodyW / 2}
        y={top}
        width={bodyW}
        height={height}
        rx="4"
        fill={fill}
        stroke={active ? "#fff4c4" : "rgba(7, 16, 24, 0.35)"}
        strokeWidth={active ? 3 : 1.5}
      />
    </g>
  );
}
