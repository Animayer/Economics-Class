import { RULES_BLURB } from "../lib/ta";
import { money, pnlTone, signedMoney, signedPct } from "../lib/format";
import type { PathResult } from "../types";

interface Props {
  paths: PathResult[];
  hideNotes: boolean;
}

export function ComparePaths({ paths, hideNotes }: Props) {
  return (
    <section className="card compare" aria-labelledby="cmp-title">
      <h2 id="cmp-title">Compare paths</h2>
      <p className="muted">
        Same starting cash, marked to <strong>this day’s close</strong>. Different choices, different
        P&amp;L.
      </p>
      <div className="path-grid">
        {paths.map((path) => (
          <article key={path.id} className="path-card">
            <h3>{path.label}</h3>
            <p className={`path-eq ${pnlTone(path.pnl)}`}>{money(path.equity)}</p>
            <p className={pnlTone(path.pnl)}>
              {signedMoney(path.pnl)} ({signedPct(path.pnlPct)})
            </p>
            <p className="muted">
              {path.trades} fill{path.trades === 1 ? "" : "s"} · {path.note}
            </p>
          </article>
        ))}
      </div>
      <details className="rules-box">
        <summary>Rules-based TA (read this before you treat it as ‘the answer’)</summary>
        <pre>{RULES_BLURB}</pre>
      </details>
      {!hideNotes ? (
        <p className="teacher-note">
          Ask: who took more risk? Who got lucky on one day? Buy-and-hold can beat a ‘clever’
          robot — and the robot can beat a FOMO chase. Past ≠ future.
        </p>
      ) : null}
    </section>
  );
}
