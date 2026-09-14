import { formatShares, money } from "../lib/format";
import { clampBuy, maxBuyShares } from "../lib/trading";
import type { EnrichedBar, PortfolioSnapshot } from "../types";

interface Props {
  bar: EnrichedBar;
  portfolio: PortfolioSnapshot;
  feeBps: number;
  spend: string;
  onSpend: (value: string) => void;
  onBuy: (shares: number) => void;
  onSell: (shares: number) => void;
  onHold: () => void;
}

export function TradeDesk({ bar, portfolio, feeBps, spend, onSpend, onBuy, onSell, onHold }: Props) {
  const dollars = Number(spend);
  const wantShares = Number.isFinite(dollars) && dollars > 0 ? dollars / bar.close : 0;
  const buyable = clampBuy(portfolio.cash, bar.close, wantShares, feeBps);
  const maxShares = maxBuyShares(portfolio.cash, bar.close, feeBps);

  return (
    <section className="card desk noprint" aria-labelledby="desk-title">
      <h2 id="desk-title">Paper ticket</h2>
      <p className="muted">
        Fills at this day’s <strong>close</strong> ({money(bar.close)}). Fractional shares are
        allowed. Fees are {feeBps === 0 ? "off for class" : `${feeBps} bps`}.
      </p>
      <label className="field">
        Spend dollars
        <input
          type="number"
          min={0}
          step={50}
          value={spend}
          onChange={(e) => onSpend(e.target.value)}
        />
      </label>
      <p className="muted">
        That is about <strong>{formatShares(buyable)}</strong> shares at today’s close. Cash left
        after: {money(Math.max(0, portfolio.cash - buyable * bar.close))}.
      </p>
      <div className="desk-actions">
        <button
          type="button"
          className="btn btn-buy"
          disabled={buyable <= 0}
          onClick={() => onBuy(buyable)}
        >
          Buy
        </button>
        <button
          type="button"
          className="btn"
          disabled={maxShares <= 0}
          onClick={() => onBuy(maxShares)}
        >
          Buy max
        </button>
        <button
          type="button"
          className="btn btn-sell"
          disabled={portfolio.shares <= 0}
          onClick={() => onSell(portfolio.shares)}
        >
          Sell all
        </button>
        <button
          type="button"
          className="btn btn-sell"
          disabled={portfolio.shares <= 0}
          onClick={() => onSell(portfolio.shares / 2)}
        >
          Sell half
        </button>
        <button type="button" className="btn" onClick={onHold}>
          Hold
        </button>
      </div>
    </section>
  );
}
