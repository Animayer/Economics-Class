export type Side = "buy" | "sell" | "hold";

export type CautiousMove = "enter" | "wait" | "take-profit" | "stop";

export type SignalKind = "ipo" | "rsi" | "volume" | "sr" | "cross" | "peak";

export type LevelKind = "support" | "resistance" | "reference";

export type WindowMode = "recent" | "ipo";

export type ChartStyle = "candles" | "line";

export interface Bar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PriceLevel {
  price: number;
  label: string;
  kind: LevelKind;
}

export interface DatasetMeta {
  symbol: string;
  exchange: string;
  name: string;
  ipoDate: string;
  ipoPrice: number;
  asOf: string;
  asOfLabel: string;
  timezone: string;
  source: string;
  sourceUrl: string;
  crossCheck: string;
  fetchedAt: string;
  barCount: number;
  classLine: string;
  title: string;
  lessonWindowStart: string;
}

export interface Dataset {
  meta: DatasetMeta;
  levels: PriceLevel[];
  bars: Bar[];
}

export interface EnrichedBar extends Bar {
  index: number;
  sma20: number | null;
  sma50: number | null;
  rsi14: number | null;
  volSma20: number | null;
  volumeSpike: boolean;
  changePct: number | null;
}

export interface Trade {
  id: string;
  index: number;
  date: string;
  side: Side;
  shares: number;
  price: number;
  fee: number;
  realizedDelta: number;
}

export interface PortfolioSnapshot {
  cash: number;
  shares: number;
  avgCost: number;
  equity: number;
  unrealized: number;
  realized: number;
  feesPaid: number;
  marketValue: number;
}

export interface PathResult {
  id: "student" | "hold" | "rules";
  label: string;
  equity: number;
  pnl: number;
  pnlPct: number;
  trades: number;
  shares: number;
  cash: number;
  note: string;
}

export interface SignalCard {
  id: string;
  index: number;
  date: string;
  kind: SignalKind;
  title: string;
  summary: string;
  cautiousMove: CautiousMove;
  cautiousNote: string;
  answerKey: string;
}

export interface JournalState {
  thesis: string;
  invalidation: string;
  metric: string;
  emotion: string;
  decision: string;
}

export interface OverlayState {
  sma20: boolean;
  sma50: boolean;
  rsi: boolean;
  levels: boolean;
  volumeSpikes: boolean;
  style: ChartStyle;
}
