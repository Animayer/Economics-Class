import { inflate, rebasedIndex } from "../lib/inflation";
import { inflationTone, money, signedPct } from "../lib/format";
import type { CpiYear, DatasetMeta } from "../types";

interface PurchasingPowerProps {
  year: number;
  current: CpiYear;
  today: CpiYear;
  meta: DatasetMeta;
}

export function PurchasingPower({ year, current, today, meta }: PurchasingPowerProps) {
  const worthToday = inflate(1, current.index, today.index);
  const thenFor100 = inflate(100, today.index, current.index);
  const index1926 = rebasedIndex(current.index, 17.7);
  const tone = inflationTone(current.yoyPct);

  return (
    <section className="power" aria-label="Purchasing power">
      <header className="section-head">
        <h2>Purchasing power</h2>
        <p>
          Using CPI-U ({meta.cpiBase}). 2026 is through {meta.latestThrough}.
        </p>
      </header>
      <div className="power-grid">
        <article className="stat">
          <p className="stat-label">
            What $1 in <strong>{year}</strong> is worth in 2026 dollars
          </p>
          <p className="stat-value">{money(worthToday, "fine")}</p>
        </article>
        <article className="stat">
          <p className="stat-label">
            How much <strong>{year}</strong> money equals $100 today
          </p>
          <p className="stat-value">{money(thenFor100, "fine")}</p>
        </article>
        <article className={`stat tone-${tone}`}>
          <p className="stat-label">Year-over-year inflation</p>
          <p className="stat-value">{signedPct(current.yoyPct)}</p>
          <p className="stat-note">
            {current.quality === "ytd" ? "YTD vs 2025 annual" : `CPI ${year} vs ${year - 1}`}
          </p>
        </article>
        <article className="stat">
          <p className="stat-label">CPI index</p>
          <p className="stat-value">{current.index.toFixed(1)}</p>
          <p className="stat-note">
            Official base {meta.cpiBase}
            <br />
            {index1926.toFixed(0)} if 1926 = 100
          </p>
        </article>
      </div>
    </section>
  );
}
