import type { Bar, PortfolioSnapshot, Trade } from "../types";

export const DEFAULT_CASH = 10_000;
const EPS = 1e-9;

export function feeOn(notional: number, feeBps: number): number {
  if (notional <= 0 || feeBps <= 0) {
    return 0;
  }
  return (notional * feeBps) / 10_000;
}

export function maxBuyShares(cash: number, price: number, feeBps: number): number {
  if (price <= 0 || cash <= 0) {
    return 0;
  }
  const grossPerShare = price * (1 + feeBps / 10_000);
  return cash / grossPerShare;
}

export function clampBuy(cash: number, price: number, shares: number, feeBps: number): number {
  const max = maxBuyShares(cash, price, feeBps);
  return Math.min(Math.max(0, shares), max);
}

function emptyPortfolio(startingCash: number): PortfolioSnapshot {
  return {
    cash: startingCash,
    shares: 0,
    avgCost: 0,
    equity: startingCash,
    unrealized: 0,
    realized: 0,
    feesPaid: 0,
    marketValue: 0,
  };
}

export function markToMarket(
  cash: number,
  shares: number,
  avgCost: number,
  realized: number,
  feesPaid: number,
  price: number,
): PortfolioSnapshot {
  const marketValue = shares * price;
  return {
    cash,
    shares,
    avgCost: shares > EPS ? avgCost : 0,
    equity: cash + marketValue,
    unrealized: shares > EPS ? marketValue - shares * avgCost : 0,
    realized,
    feesPaid,
    marketValue,
  };
}

export function applyTrade(
  state: PortfolioSnapshot,
  side: "buy" | "sell",
  shares: number,
  price: number,
  feeBps: number,
): { next: PortfolioSnapshot; fee: number; realizedDelta: number; filled: number } | null {
  if (!(shares > 0) || !(price > 0)) {
    return null;
  }

  if (side === "buy") {
    const filled = clampBuy(state.cash, price, shares, feeBps);
    if (filled <= EPS) {
      return null;
    }
    const notional = filled * price;
    const fee = feeOn(notional, feeBps);
    const spent = notional + fee;
    const newShares = state.shares + filled;
    const avgCost = (state.shares * state.avgCost + notional + fee) / newShares;
    const next = markToMarket(
      state.cash - spent,
      newShares,
      avgCost,
      state.realized,
      state.feesPaid + fee,
      price,
    );
    return { next, fee, realizedDelta: 0, filled };
  }

  const filled = Math.min(shares, state.shares);
  if (filled <= EPS) {
    return null;
  }
  const notional = filled * price;
  const fee = feeOn(notional, feeBps);
  const net = notional - fee;
  const realizedDelta = net - filled * state.avgCost;
  const remaining = state.shares - filled;
  const next = markToMarket(
    state.cash + net,
    remaining,
    remaining > EPS ? state.avgCost : 0,
    state.realized + realizedDelta,
    state.feesPaid + fee,
    price,
  );
  return { next, fee, realizedDelta, filled };
}

export function replayTrades(
  trades: Trade[],
  throughIndex: number,
  price: number,
  startingCash: number,
  feeBps: number,
): PortfolioSnapshot {
  let state = emptyPortfolio(startingCash);
  const ordered = trades
    .filter((t) => t.index <= throughIndex && t.side !== "hold")
    .sort((a, b) => a.index - b.index || a.id.localeCompare(b.id));

  for (const trade of ordered) {
    if (trade.side === "hold") {
      continue;
    }
    const applied = applyTrade(state, trade.side, trade.shares, trade.price, feeBps);
    if (applied) {
      state = applied.next;
    }
  }
  return markToMarket(state.cash, state.shares, state.avgCost, state.realized, state.feesPaid, price);
}

export function buyAndHold(
  bars: Bar[],
  startIndex: number,
  endIndex: number,
  startingCash: number,
  feeBps: number,
): PortfolioSnapshot {
  const start = bars[startIndex];
  const end = bars[endIndex];
  if (!start || !end) {
    return emptyPortfolio(startingCash);
  }
  const shares = maxBuyShares(startingCash, start.close, feeBps);
  const bought = applyTrade(emptyPortfolio(startingCash), "buy", shares, start.close, feeBps);
  if (!bought) {
    return emptyPortfolio(startingCash);
  }
  return markToMarket(
    bought.next.cash,
    bought.next.shares,
    bought.next.avgCost,
    bought.next.realized,
    bought.next.feesPaid,
    end.close,
  );
}

let tradeSeq = 0;
export function nextTradeId(): string {
  tradeSeq += 1;
  return `t${tradeSeq}-${Date.now().toString(36)}`;
}

export function resetTradeIds(): void {
  tradeSeq = 0;
}
