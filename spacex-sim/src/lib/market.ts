import type { Bar, Dataset } from "../types";

const PUBLIC_JSON = "./data/spcx-history.json";
const YAHOO_CHART =
  "https://query1.finance.yahoo.com/v8/finance/chart/SPCX?interval=1d&range=6mo&includePrePost=false";

interface YahooChart {
  chart?: {
    result?: Array<{
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          open: Array<number | null>;
          high: Array<number | null>;
          low: Array<number | null>;
          close: Array<number | null>;
          volume: Array<number | null>;
        }>;
      };
    }>;
  };
}

function isBar(value: unknown): value is Bar {
  if (!value || typeof value !== "object") {
    return false;
  }
  const bar = value as Bar;
  return (
    typeof bar.date === "string" &&
    typeof bar.open === "number" &&
    typeof bar.high === "number" &&
    typeof bar.low === "number" &&
    typeof bar.close === "number" &&
    typeof bar.volume === "number"
  );
}

export function parseDataset(raw: unknown): Dataset {
  if (!raw || typeof raw !== "object") {
    throw new Error("Dataset is not an object.");
  }
  const data = raw as Dataset;
  if (!data.meta || !Array.isArray(data.bars) || data.bars.length < 10) {
    throw new Error("SPCX history file is missing bars.");
  }
  if (!data.bars.every(isBar)) {
    throw new Error("SPCX history has an invalid bar.");
  }
  return data;
}

function etDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function barsFromYahoo(raw: YahooChart): Bar[] {
  const result = raw.chart?.result?.[0];
  const ts = result?.timestamp;
  const quote = result?.indicators?.quote?.[0];
  if (!ts || !quote) {
    return [];
  }
  const bars: Bar[] = [];
  for (let i = 0; i < ts.length; i++) {
    const open = quote.open[i];
    const high = quote.high[i];
    const low = quote.low[i];
    const close = quote.close[i];
    const volume = quote.volume[i];
    if ([open, high, low, close, volume].some((n) => n == null || !Number.isFinite(n))) {
      continue;
    }
    bars.push({
      date: etDate(ts[i]),
      open: round2(open as number),
      high: round2(high as number),
      low: round2(low as number),
      close: round2(close as number),
      volume: Math.round(volume as number),
    });
  }
  return bars;
}

export async function loadBundled(): Promise<Dataset> {
  const res = await fetch(PUBLIC_JSON);
  if (!res.ok) {
    throw new Error(`Could not load ${PUBLIC_JSON} (${res.status}).`);
  }
  return parseDataset(await res.json());
}

export async function tryLiveBars(): Promise<Bar[] | null> {
  try {
    const res = await fetch(YAHOO_CHART, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) {
      return null;
    }
    const bars = barsFromYahoo((await res.json()) as YahooChart);
    return bars.length >= 10 ? bars : null;
  } catch {
    return null;
  }
}

export function mergeLive(dataset: Dataset, live: Bar[]): Dataset {
  const lastLive = live[live.length - 1]?.date;
  const lastBundled = dataset.bars[dataset.bars.length - 1]?.date;
  if (!lastLive || !lastBundled || lastLive < lastBundled) {
    return dataset;
  }
  return {
    ...dataset,
    bars: live,
    meta: {
      ...dataset.meta,
      asOf: lastLive,
      asOfLabel: `Live Yahoo Finance close through ${lastLive}`,
      barCount: live.length,
      source: "Yahoo Finance chart API (live fetch) with bundled fallback",
    },
  };
}
