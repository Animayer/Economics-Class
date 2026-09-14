import type { KeyboardEvent, MouseEvent } from "react";
import { formatShortDate, money } from "../lib/format";
import type { EnrichedBar, OverlayState, PriceLevel, SignalCard } from "../types";

interface Props {
  bars: EnrichedBar[];
  visible: EnrichedBar[];
  index: number;
  overlays: OverlayState;
  levels: PriceLevel[];
  signals: SignalCard[];
  onIndex: (index: number) => void;
}

const W = 960;
const H = 420;
const PAD = { l: 58, r: 16, t: 18, b: 78 };

export function Chart({ bars, visible, index, overlays, levels, signals, onIndex }: Props) {
  if (visible.length === 0) {
    return <div className="chart-empty">No bars in this window.</div>;
  }

  const innerW = W - PAD.l - PAD.r;
  const priceH = 260;
  const volH = 56;
  const volTop = PAD.t + priceH + 18;
  const lows = visible.map((b) => b.low);
  const highs = visible.map((b) => b.high);
  let minP = Math.min(...lows);
  let maxP = Math.max(...highs);
  if (overlays.sma20) {
    for (const b of visible) {
      if (b.sma20 != null) {
        minP = Math.min(minP, b.sma20);
        maxP = Math.max(maxP, b.sma20);
      }
    }
  }
  if (overlays.sma50) {
    for (const b of visible) {
      if (b.sma50 != null) {
        minP = Math.min(minP, b.sma50);
        maxP = Math.max(maxP, b.sma50);
      }
    }
  }
  const pad = (maxP - minP) * 0.08 || 4;
  minP -= pad;
  maxP += pad;
  const maxVol = Math.max(...visible.map((b) => b.volume), 1);
  const step = innerW / visible.length;
  const xAt = (i: number) => PAD.l + (i + 0.5) * step;
  const yAt = (price: number) => PAD.t + ((maxP - price) / (maxP - minP)) * priceH;
  const currentVis = visible.findIndex((b) => b.index === index);

  const linePath = (key: "close" | "sma20" | "sma50") => {
    const pts: string[] = [];
    visible.forEach((b, i) => {
      const value = key === "close" ? b.close : b[key];
      if (value == null) {
        return;
      }
      pts.push(`${pts.length === 0 ? "M" : "L"}${xAt(i)} ${yAt(value)}`);
    });
    return pts.join(" ");
  };

  const ticks = 4;
  const priceTicks = Array.from({ length: ticks + 1 }, (_, i) => minP + ((maxP - minP) * i) / ticks);

  const onClick = (event: MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const svgX = ((event.clientX - rect.left) / rect.width) * W;
    const i = Math.min(visible.length - 1, Math.max(0, Math.floor((svgX - PAD.l) / step)));
    onIndex(visible[i].index);
  };

  const onKey = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      onIndex(Math.max(visible[0].index, index - 1));
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      onIndex(Math.min(visible[visible.length - 1].index, index + 1));
    }
  };

  const shownLevels = overlays.levels
    ? levels.filter((lvl) => lvl.price >= minP && lvl.price <= maxP)
    : [];

  const visSignals = signals.filter(
    (s) => s.index >= visible[0].index && s.index <= visible[visible.length - 1].index,
  );

  return (
    <div className="chart-wrap">
      <svg
        className="chart"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        tabIndex={0}
        aria-label="SPCX price chart. Arrow keys move one day when this chart is focused."
        onClick={onClick}
        onKeyDown={onKey}
      >
        {priceTicks.map((price) => (
          <g key={price}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={yAt(price)}
              y2={yAt(price)}
              className="grid"
            />
            <text x={PAD.l - 8} y={yAt(price) + 4} className="axis" textAnchor="end">
              {money(price)}
            </text>
          </g>
        ))}

        {shownLevels.map((lvl) => (
          <g key={`${lvl.kind}-${lvl.price}`}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={yAt(lvl.price)}
              y2={yAt(lvl.price)}
              className={`level-line ${lvl.kind}`}
            />
            <text x={PAD.l + 6} y={yAt(lvl.price) - 4} className={`level-label ${lvl.kind}`}>
              {lvl.label}
            </text>
          </g>
        ))}

        {visible.map((bar, i) => {
          const x = xAt(i);
          const up = bar.close >= bar.open;
          const wickTop = yAt(bar.high);
          const wickBot = yAt(bar.low);
          const bodyTop = yAt(Math.max(bar.open, bar.close));
          const bodyBot = yAt(Math.min(bar.open, bar.close));
          const bodyH = Math.max(2, bodyBot - bodyTop);
          const volY = volTop + (1 - bar.volume / maxVol) * volH;
          const spike = overlays.volumeSpikes && bar.volumeSpike;
          return (
            <g key={bar.date}>
              <rect
                x={x - step * 0.35}
                y={volY}
                width={Math.max(2, step * 0.7)}
                height={volTop + volH - volY}
                className={`vol ${up ? "up" : "down"} ${spike ? "spike" : ""}`}
              />
              <line x1={x} x2={x} y1={wickTop} y2={wickBot} className={`wick ${up ? "up" : "down"}`} />
              {overlays.style === "candles" ? (
                <rect
                  x={x - step * 0.28}
                  y={bodyTop}
                  width={Math.max(2.4, step * 0.56)}
                  height={bodyH}
                  className={`candle ${up ? "up" : "down"}`}
                />
              ) : null}
            </g>
          );
        })}

        {overlays.style === "line" ? <path d={linePath("close")} className="close-line" /> : null}
        {overlays.sma20 ? <path d={linePath("sma20")} className="sma sma20" /> : null}
        {overlays.sma50 ? <path d={linePath("sma50")} className="sma sma50" /> : null}

        {visSignals.map((signal) => {
          const i = visible.findIndex((b) => b.index === signal.index);
          if (i < 0) {
            return null;
          }
          const bar = visible[i];
          return (
            <g key={signal.id} className="marker" transform={`translate(${xAt(i)} ${yAt(bar.high) - 10})`}>
              <polygon points="0,-7 6,5 -6,5" />
            </g>
          );
        })}

        {currentVis >= 0 ? (
          <line
            x1={xAt(currentVis)}
            x2={xAt(currentVis)}
            y1={PAD.t}
            y2={volTop + volH}
            className="cursor"
          />
        ) : null}

        <text x={PAD.l} y={H - 14} className="axis">
          {formatShortDate(visible[0].date)}
        </text>
        <text x={W - PAD.r} y={H - 14} className="axis" textAnchor="end">
          {formatShortDate(visible[visible.length - 1].date)}
        </text>
        <text x={PAD.l} y={volTop - 4} className="axis">
          Volume
        </text>
      </svg>
      <div className="chart-legend noprint">
        <span className="swatch candle-up">Up close</span>
        <span className="swatch candle-down">Down close</span>
        {overlays.sma20 ? <span className="swatch sma20">SMA 20</span> : null}
        {overlays.sma50 ? <span className="swatch sma50">SMA 50</span> : null}
        {overlays.volumeSpikes ? <span className="swatch spike">Vol ≥ 2× avg</span> : null}
      </div>
      <p className="sr-only">
        {bars[index]
          ? `${bars[index].date} open ${bars[index].open} high ${bars[index].high} low ${bars[index].low} close ${bars[index].close}`
          : ""}
      </p>
    </div>
  );
}
