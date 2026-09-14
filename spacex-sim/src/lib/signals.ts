import { crossedDown } from "./ta";
import type { EnrichedBar, SignalCard } from "../types";

const CURATED: Array<Omit<SignalCard, "index">> = [
  {
    id: "ipo-day",
    date: "2026-06-12",
    kind: "ipo",
    title: "IPO vs the first trade",
    summary:
      "SpaceX priced the IPO at $135 the night before. On June 12 the shares opened at $150 and closed at $160.95 on huge volume. The IPO price is not the same as the price you can actually trade.",
    cautiousMove: "wait",
    cautiousNote:
      "A cautious swing trader often waits for the first-week frenzy to cool before sizing a position. Opening day is a lesson, not a ‘must buy’ alarm.",
    answerKey:
      "IPO = the company (and selling shareholders) issued stock to the public at $135. After that, SPCX trades in the secondary market between investors. The $150 open and $160.95 close are secondary prices. Volume of ~519 million shares shows how crowded the debut was. Past pop ≠ a forecast.",
  },
  {
    id: "june-peak",
    date: "2026-06-16",
    kind: "peak",
    title: "Post-IPO peak — then a long slide",
    summary:
      "Four sessions after the IPO, SPCX closed at $211.39 (intraday high $225.64). Anyone who bought the dream near the top was underwater for months.",
    cautiousMove: "take-profit",
    cautiousNote:
      "If you already owned shares from the IPO window, a cautious trader might scale out into a vertical spike rather than add. Chasing a 50%+ rip in four days is how FOMO shows up on a chart.",
    answerKey:
      "This is a textbook ‘buy the rumor, crowd the open’ peak. SMA 20/50 did not even exist yet — you cannot lean on those overlays in a brand-new listing. Capital-gains lesson: a paper gain is not cash until you sell.",
  },
  {
    id: "rsi-oversold-jul20",
    date: "2026-07-20",
    kind: "rsi",
    title: "RSI(14) crossed below 30 (oversold)",
    summary:
      "After weeks of lower closes, RSI(14) dropped under 30. ‘Oversold’ means the recent losses were large versus the recent gains — not that the stock must bounce tomorrow.",
    cautiousMove: "wait",
    cautiousNote:
      "A cautious swing trader might put the ticker on a watchlist and wait for a turn (RSI reclaiming 30 plus a close back above a moving average), rather than buy the first red RSI print.",
    answerKey:
      "RSI can stay oversold while price keeps falling. SPCX still ground down into early August. The teaching point: a signal is an alert to think, not an order ticket.",
  },
  {
    id: "aug4-bounce",
    date: "2026-08-04",
    kind: "rsi",
    title: "Oversold bounce + volume spike",
    summary:
      "RSI climbed back through 30 while price jumped about 9% on roughly 2× average volume. That is the ‘maybe the selling is exhausted’ alert.",
    cautiousMove: "enter",
    cautiousNote:
      "A cautious trader who enters here would still plan an invalidation: a close back under the bounce low (~$105–$108) would say the bounce failed.",
    answerKey:
      "This is a classic oversold bounce. It also failed the next day — which is why the rules-based path gets stopped. Great compare-paths discussion: one good-looking candle is not a trend.",
  },
  {
    id: "aug5-dump",
    date: "2026-08-05",
    kind: "volume",
    title: "High-volume breakdown — bounce failed",
    summary:
      "The August 4 bounce reversed. SPCX closed $108.27 (−13.6%) on more than 200 million shares, tagging the period-low zone.",
    cautiousMove: "stop",
    cautiousNote:
      "If you bought the bounce, this is the stop-thinking day: the idea is invalidated. If you did not own it, wait — a breakdown on huge volume is not a bargain by itself.",
    answerKey:
      "Failed bounce + volume expansion = supply overwhelmed demand. Ties to capital loss vs. a paper loss: selling here turns the unrealized hit into a realized one, which is painful and also how risk is actually managed.",
  },
  {
    id: "aug7-breakout",
    date: "2026-08-07",
    kind: "volume",
    title: "High-volume breakout from the lows",
    summary:
      "Close $133.11, up about 16% on 242 million shares. Price left the $105–$115 basing area with conviction.",
    cautiousMove: "enter",
    cautiousNote:
      "A cautious swing trader might enter a starter position on a strong range break, while keeping a stop under the breakout day’s low (~$114.50).",
    answerKey:
      "Volume confirms the move: lots of shares changed hands as price left the range. Still not a promise — later pullbacks (Aug 20) tested whether buyers would defend $130–$135.",
  },
  {
    id: "aug12-follow",
    date: "2026-08-12",
    kind: "volume",
    title: "Follow-through breakout on high volume",
    summary:
      "Another +9.7% session to $146.15 on 167 million shares. This is ‘buyers still in control’ after the August 7 lift.",
    cautiousMove: "enter",
    cautiousNote:
      "Adding only if the original thesis is intact, and never because the candle is exciting. A late add needs a tighter invalidation (e.g. back under $135 IPO / round-number support).",
    answerKey:
      "Continuation days teach fractional sizing: you can add a slice rather than go all-in. Compare with buy-and-hold from the lesson-window start a few days later.",
  },
  {
    id: "aug20-support",
    date: "2026-08-20",
    kind: "sr",
    title: "Price tagged prior support (~$130)",
    summary:
      "The pullback low was $130.39, right on the August 11 swing low ($130.50). Close $134, still above that shelf.",
    cautiousMove: "wait",
    cautiousNote:
      "Tagging support is an alert, not an automatic buy. Wait to see whether the next day holds the shelf or slices through it.",
    answerKey:
      "Support is a price zone where buyers showed up before. It is drawn from history, so it can break. Aug 21 held (low $131.22, close $136.97) — a bounce after a test, which is the cleaner confirmation.",
  },
  {
    id: "golden-cross",
    date: "2026-09-01",
    kind: "cross",
    title: "Golden-cross risk (SMA 20 × SMA 50)",
    summary:
      "The 20-day average crossed above the 50-day average. Traders nickname that a ‘golden cross.’ It can also fake out — hence ‘risk,’ not ‘guaranteed rally.’",
    cautiousMove: "wait",
    cautiousNote:
      "Moving-average crosses lag. A cautious trader treats this as background trend context, not a market order. Death-cross / golden-cross headlines are often late.",
    answerKey:
      "SMA 50 only becomes available on Aug 24 (needs 50 closes since the IPO). Crosses are slow on purpose. By Sep 1 much of the August bounce was already on the board. Teaching point: lagging indicators describe what has happened.",
  },
  {
    id: "sep3-breakout",
    date: "2026-09-03",
    kind: "volume",
    title: "High-volume push back through $149",
    summary:
      "Close $149.74 (+6.4%) on 121 million shares, a volume spike through the $150 round-number area that had capped early September.",
    cautiousMove: "take-profit",
    cautiousNote:
      "If you rode the August bounce, this is a logical place to bank a slice of the gain (take profit) into resistance. If you are flat, chasing the green candle is optional, not required.",
    answerKey:
      "Round numbers ($150) act like magnets and ceilings because lots of humans pick them. Volume on the break is the ‘are enough people involved?’ check. Later sessions (Sep 8 high $155, then a fade) show resistance still working.",
  },
];

export function curatedSignals(bars: EnrichedBar[]): SignalCard[] {
  const byDate = new Map(bars.map((b) => [b.date, b]));
  return CURATED.flatMap((card) => {
    const bar = byDate.get(card.date);
    if (!bar) {
      return [];
    }
    return [{ ...card, index: bar.index }];
  });
}

export function autoSignals(bars: EnrichedBar[]): SignalCard[] {
  const extra: SignalCard[] = [];
  for (let i = 1; i < bars.length; i++) {
    const prev = bars[i - 1];
    const bar = bars[i];
    const already = CURATED.some((c) => c.date === bar.date);
    if (!already && crossedDown(prev.rsi14, bar.rsi14, 30)) {
      extra.push({
        id: `rsi-os-${bar.date}`,
        index: bar.index,
        date: bar.date,
        kind: "rsi",
        title: "RSI(14) crossed below 30 (oversold)",
        summary: `RSI fell through 30 while ${bar.date} closed at $${bar.close.toFixed(2)}. The recent down-days outweighed the up-days.`,
        cautiousMove: "wait",
        cautiousNote: "Watch for a turn rather than buying the first oversold print.",
        answerKey: "Oversold can persist. Use it as a yellow flag, then wait for reclaim evidence.",
      });
    }
    if (
      !already &&
      prev.sma20 != null &&
      prev.sma50 != null &&
      bar.sma20 != null &&
      bar.sma50 != null &&
      prev.sma20 >= prev.sma50 &&
      bar.sma20 < bar.sma50
    ) {
      extra.push({
        id: `death-${bar.date}`,
        index: bar.index,
        date: bar.date,
        kind: "cross",
        title: "Death-cross risk (SMA 20 × SMA 50)",
        summary: "The 20-day average crossed under the 50-day average — a lagged ‘downtrend’ label.",
        cautiousMove: "wait",
        cautiousNote:
          "Do not dump a long-term thesis on one lagging cross. Do respect that shorter-term momentum cooled.",
        answerKey: "Death crosses often print after a large part of the decline. They are context, not crystal balls.",
      });
    }
  }
  return extra;
}

export function allSignals(bars: EnrichedBar[]): SignalCard[] {
  const curated = curatedSignals(bars);
  const extras = autoSignals(bars);
  return [...curated, ...extras].sort((a, b) => a.index - b.index);
}

export const MOVE_LABEL: Record<SignalCard["cautiousMove"], string> = {
  enter: "Might enter",
  wait: "Might wait",
  "take-profit": "Might take profit",
  stop: "Might stop / exit",
};
