import { formatShares, money, pnlTone, signedMoney, signedPct } from "../lib/format";
import type { PortfolioSnapshot } from "../types";

interface Props {
  portfolio: PortfolioSnapshot;
  startCash: number;
  startCashInput: string;
  feeBps: number;
  feeInput: string;
  onStartCash: (value: string) => void;
  onFee: (value: string) => void;
  applyCash: () => void;
}

export function Portfolio({
  portfolio,
  startCash,
  startCashInput,
  feeBps,
  feeInput,
  onStartCash,
  onFee,
  applyCash,
}: Props) {
  const total = portfolio.equity - startCash;
  const tone = pnlTone(total);
  return (
    <section className="card portfolio" aria-labelledby="port-title">
      <h2 id="port-title">Your book</h2>
      <dl className="stats">
        <div>
          <dt>Cash</dt>
          <dd>{money(portfolio.cash)}</dd>
        </div>
        <div>
          <dt>Shares</dt>
          <dd>{formatShares(portfolio.shares)}</dd>
        </div>
        <div>
          <dt>Avg cost</dt>
          <dd>{portfolio.shares > 0 ? money(portfolio.avgCost) : "—"}</dd>
        </div>
        <div>
          <dt>Market value</dt>
          <dd>{money(portfolio.marketValue)}</dd>
        </div>
        <div>
          <dt>Unrealized P&amp;L</dt>
          <dd className={pnlTone(portfolio.unrealized)}>
            {signedMoney(portfolio.unrealized)}
          </dd>
        </div>
        <div>
          <dt>Realized P&amp;L</dt>
          <dd className={pnlTone(portfolio.realized)}>{signedMoney(portfolio.realized)}</dd>
        </div>
        <div className="span2">
          <dt>Equity vs ${startCash.toLocaleString("en-US")} start</dt>
          <dd className={tone}>
            {money(portfolio.equity)} ({signedPct(startCash ? (total / startCash) * 100 : 0)})
          </dd>
        </div>
      </dl>
      <div className="cash-row noprint">
        <label className="field">
          Starting cash
          <input type="number" min={100} step={100} value={startCashInput} onChange={(e) => onStartCash(e.target.value)} />
        </label>
        <label className="field">
          Fee (bps)
          <input type="number" min={0} step={1} value={feeInput} onChange={(e) => onFee(e.target.value)} />
        </label>
        <button type="button" className="btn" onClick={applyCash}>
          Apply (resets trades)
        </button>
      </div>
      {feeBps === 0 ? (
        <p className="muted">Commission is 0 bps so the class can see price math, not fee math.</p>
      ) : (
        <p className="muted">Fees are included in average cost on buys and subtracted from sells.</p>
      )}
    </section>
  );
}
