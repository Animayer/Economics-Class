import { METRICS } from "../lib/simulate";
import type { Metrics } from "../types";

export function MetricBars({ metrics, systemProfit }: { metrics: Metrics; systemProfit: boolean }) {
  const rows = METRICS.filter((item) => (item.capitalismOnly ? systemProfit : true));
  return (
    <div className="metric-grid">
      {rows.map((item) => {
        const value = metrics[item.key];
        const width = Math.max(4, Math.min(100, (value / item.scale) * 100));
        return (
          <div key={item.key} className={`metric metric-${item.good}`}>
            <div className="metric-top">
              <span>{item.label}</span>
              <strong>{value}</strong>
            </div>
            <div
              className="meter"
              role="meter"
              aria-label={item.label}
              aria-valuemin={0}
              aria-valuemax={item.scale}
              aria-valuenow={value}
              title={item.hint}
            >
              <span style={{ width: `${width}%` }} />
            </div>
            <p>{item.hint}</p>
          </div>
        );
      })}
    </div>
  );
}
