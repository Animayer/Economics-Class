import type { EnrichedBar } from "../types";

interface Props {
  bar: EnrichedBar;
  series: EnrichedBar[];
}

export function RsiPanel({ bar, series }: Props) {
  const values = series.map((b) => b.rsi14);
  const w = 320;
  const h = 72;
  const pts: string[] = [];
  values.forEach((rsi, i) => {
    if (rsi == null) {
      return;
    }
    const x = (i / Math.max(1, values.length - 1)) * w;
    const y = h - (rsi / 100) * h;
    pts.push(`${pts.length === 0 ? "M" : "L"}${x} ${y}`);
  });
  const lastX =
    series.length > 1 ? (bar.index - series[0].index) / Math.max(1, series.length - 1) * w : 0;

  return (
    <section className="rsi-panel" aria-label="RSI 14">
      <div className="rsi-head">
        <h3>RSI(14)</h3>
        <p className={bar.rsi14 != null && bar.rsi14 < 30 ? "down" : bar.rsi14 != null && bar.rsi14 > 70 ? "up" : ""}>
          {bar.rsi14 == null ? "Not enough days yet" : bar.rsi14.toFixed(1)}
        </p>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="rsi-svg" aria-hidden="true">
        <line x1="0" x2={w} y1={h * 0.3} y2={h * 0.3} className="rsi-band" />
        <line x1="0" x2={w} y1={h * 0.7} y2={h * 0.7} className="rsi-band" />
        <text x="4" y="14" className="axis">
          70
        </text>
        <text x="4" y={h - 4} className="axis">
          30
        </text>
        <path d={pts.join(" ")} className="rsi-line" />
        {bar.rsi14 != null ? (
          <circle cx={lastX} cy={h - (bar.rsi14 / 100) * h} r="3.5" className="rsi-dot" />
        ) : null}
      </svg>
      <p className="muted">Below 30 ≈ oversold · above 70 ≈ overbought · both can persist.</p>
    </section>
  );
}
