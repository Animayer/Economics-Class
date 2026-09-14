import { applyTrade, buyAndHold, markToMarket, maxBuyShares } from "./trading";
import type { EnrichedBar, PathResult, PortfolioSnapshot, Trade } from "../types";

export interface RulesState {
  cash: number;
  shares: number;
  avgCost: number;
  realized: number;
  feesPaid: number;
  trades: number;
  entryIndex: number | null;
  highestClose: number | null;
}

function snapshot(state: RulesState, price: number): PortfolioSnapshot {
  return markToMarket(state.cash, state.shares, state.avgCost, state.realized, state.feesPaid, price);
}

export function shouldRulesBuy(prev: EnrichedBar | undefined, bar: EnrichedBar): boolean {
  if (!prev || bar.sma20 == null) {
    return false;
  }
  const oversoldBounce =
    prev.rsi14 != null &&
    bar.rsi14 != null &&
    prev.rsi14 < 30 &&
    bar.rsi14 >= 30 &&
    bar.close >= bar.sma20;
  const breakout =
    bar.changePct != null &&
    bar.changePct >= 5 &&
    bar.volumeSpike &&
    bar.close > bar.sma20;
  return oversoldBounce || breakout;
}

export function shouldRulesSell(bar: EnrichedBar, highestClose: number | null): boolean {
  if (bar.sma20 != null && bar.close < bar.sma20) {
    return true;
  }
  if (bar.rsi14 != null && bar.rsi14 >= 70) {
    return true;
  }
  if (highestClose != null && bar.close <= highestClose * 0.88) {
    return true;
  }
  return false;
}

export function runRules(
  bars: EnrichedBar[],
  startIndex: number,
  endIndex: number,
  startingCash: number,
  feeBps: number,
): { state: RulesState; fills: Trade[] } {
  const state: RulesState = {
    cash: startingCash,
    shares: 0,
    avgCost: 0,
    realized: 0,
    feesPaid: 0,
    trades: 0,
    entryIndex: null,
    highestClose: null,
  };
  const fills: Trade[] = [];

  for (let i = startIndex; i <= endIndex; i++) {
    const bar = bars[i];
    const prev = i > 0 ? bars[i - 1] : undefined;
    if (state.shares > 1e-9) {
      state.highestClose = Math.max(state.highestClose ?? bar.close, bar.close);
      if (shouldRulesSell(bar, state.highestClose)) {
        const applied = applyTrade(
          snapshot(state, bar.close),
          "sell",
          state.shares,
          bar.close,
          feeBps,
        );
        if (applied) {
          state.cash = applied.next.cash;
          state.shares = applied.next.shares;
          state.avgCost = applied.next.avgCost;
          state.realized = applied.next.realized;
          state.feesPaid = applied.next.feesPaid;
          state.trades += 1;
          fills.push({
            id: `rules-sell-${bar.date}`,
            index: i,
            date: bar.date,
            side: "sell",
            shares: applied.filled,
            price: bar.close,
            fee: applied.fee,
            realizedDelta: applied.realizedDelta,
          });
          state.entryIndex = null;
          state.highestClose = null;
        }
      }
    } else if (shouldRulesBuy(prev, bar)) {
      const qty = maxBuyShares(state.cash, bar.close, feeBps);
      const applied = applyTrade(snapshot(state, bar.close), "buy", qty, bar.close, feeBps);
      if (applied) {
        state.cash = applied.next.cash;
        state.shares = applied.next.shares;
        state.avgCost = applied.next.avgCost;
        state.realized = applied.next.realized;
        state.feesPaid = applied.next.feesPaid;
        state.trades += 1;
        state.entryIndex = i;
        state.highestClose = bar.close;
        fills.push({
          id: `rules-buy-${bar.date}`,
          index: i,
          date: bar.date,
          side: "buy",
          shares: applied.filled,
          price: bar.close,
          fee: applied.fee,
          realizedDelta: 0,
        });
      }
    }
  }

  return { state, fills };
}

export function comparePaths(
  bars: EnrichedBar[],
  startIndex: number,
  endIndex: number,
  startingCash: number,
  feeBps: number,
  student: PortfolioSnapshot,
  studentTrades: number,
): PathResult[] {
  const price = bars[endIndex]?.close ?? 0;
  const hold = buyAndHold(bars, startIndex, endIndex, startingCash, feeBps);
  const rules = runRules(bars, startIndex, endIndex, startingCash, feeBps);
  const rulesSnap = snapshot(rules.state, price);

  const pack = (
    id: PathResult["id"],
    label: string,
    snap: PortfolioSnapshot,
    trades: number,
    note: string,
  ): PathResult => ({
    id,
    label,
    equity: snap.equity,
    pnl: snap.equity - startingCash,
    pnlPct: startingCash > 0 ? ((snap.equity - startingCash) / startingCash) * 100 : 0,
    trades,
    shares: snap.shares,
    cash: snap.cash,
    note,
  });

  return [
    pack(
      "student",
      "Your trades",
      student,
      studentTrades,
      "Whatever you bought, sold, or held on the days you chose.",
    ),
    pack(
      "hold",
      "Buy and hold",
      hold,
      hold.shares > 0 ? 1 : 0,
      "Spend (almost) all cash at the first close on the timeline. Sit. No selling.",
    ),
    pack(
      "rules",
      "Rules-based TA",
      rulesSnap,
      rules.state.trades,
      "The classroom robot documented in the rules panel. Same starting cash.",
    ),
  ];
}
