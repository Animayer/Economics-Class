import { formatDate, money, signedMoney } from "../lib/format";
import type { EnrichedBar, JournalState, PortfolioSnapshot, Trade } from "../types";

interface Props {
  journal: JournalState;
  onChange: (next: JournalState) => void;
  bar: EnrichedBar;
  portfolio: PortfolioSnapshot;
  startCash: number;
  trades: Trade[];
}

const EMOTIONS = ["Calm", "Curious", "FOMO", "Fear", "Bored", "Overconfident"];

export function Journal({ journal, onChange, bar, portfolio, startCash, trades }: Props) {
  const patch = (key: keyof JournalState, value: string) => onChange({ ...journal, [key]: value });

  const exportText = () => {
    const lines = [
      "SPCX Paper Trading Lab — decision journal",
      "Battery Creek High School · 10th-grade Economics",
      "Education / paper only. Not investment advice. Past ≠ future.",
      "",
      `As of close ${formatDate(bar.date)}  ${money(bar.close)}`,
      `Starting cash ${money(startCash)}  Equity ${money(portfolio.equity)}  P&L ${signedMoney(portfolio.equity - startCash)}`,
      `Shares ${portfolio.shares}  Avg cost ${portfolio.shares ? money(portfolio.avgCost) : "—"}  Realized ${signedMoney(portfolio.realized)}`,
      "",
      "Thesis (why own a slice of SpaceX?):",
      journal.thesis || "—",
      "",
      "Invalidation (what would make that idea wrong?):",
      journal.invalidation || "—",
      "",
      "Which metric / signal did I actually use?",
      journal.metric || "—",
      "",
      "Emotion check:",
      journal.emotion || "—",
      "",
      "Today’s decision (buy / sell / hold) and why:",
      journal.decision || "—",
      "",
      "Fills on or before this date:",
      ...trades
        .filter((t) => t.index <= bar.index)
        .map(
          (t) =>
            `${t.date} ${t.side.toUpperCase()} ${t.shares.toFixed(4)} @ ${money(t.price)}`,
        ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spcx-journal-${bar.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="card journal" aria-labelledby="j-title">
      <div className="section-head">
        <h2 id="j-title">Decision journal</h2>
        <p>Write before you brag about P&amp;L. Nothing here is uploaded anywhere.</p>
      </div>
      <div className="journal-grid">
        <label>
          Thesis — why might someone own a slice of SpaceX?
          <textarea
            rows={3}
            value={journal.thesis}
            onChange={(e) => patch("thesis", e.target.value)}
            placeholder="Starlink cash flow, launch cadence, valuation vs. story…"
          />
        </label>
        <label>
          Invalidation — what would make that idea wrong?
          <textarea
            rows={3}
            value={journal.invalidation}
            onChange={(e) => patch("invalidation", e.target.value)}
            placeholder="A close under $130 support, a thesis about launch delays, needing the cash…"
          />
        </label>
        <label>
          Which metric or signal did you use today?
          <textarea
            rows={2}
            value={journal.metric}
            onChange={(e) => patch("metric", e.target.value)}
            placeholder="RSI, volume spike, SMA 20, ‘it felt cheap,’ support tag…"
          />
        </label>
        <fieldset className="emotion">
          <legend>Emotion check</legend>
          {EMOTIONS.map((name) => (
            <label key={name}>
              <input
                type="radio"
                name="emotion"
                checked={journal.emotion === name}
                onChange={() => patch("emotion", name)}
              />
              {name}
            </label>
          ))}
        </fieldset>
        <label className="span2">
          Decision — buy, sell, or hold, and why in two sentences
          <textarea
            rows={3}
            value={journal.decision}
            onChange={(e) => patch("decision", e.target.value)}
          />
        </label>
      </div>
      <div className="journal-actions noprint">
        <button type="button" className="btn btn-play" onClick={() => window.print()}>
          Print journal page
        </button>
        <button type="button" className="btn" onClick={exportText}>
          Download .txt
        </button>
      </div>
      <div className="print-only print-journal">
        <h1>SPCX decision journal</h1>
        <p>Battery Creek High School · Mayer Economics · paper trading only</p>
        <p>
          Close {formatDate(bar.date)} · {money(bar.close)} · equity {money(portfolio.equity)}
        </p>
        <h2>Thesis</h2>
        <p>{journal.thesis || " "}</p>
        <h2>Invalidation</h2>
        <p>{journal.invalidation || " "}</p>
        <h2>Metric / signal</h2>
        <p>{journal.metric || " "}</p>
        <h2>Emotion</h2>
        <p>{journal.emotion || " "}</p>
        <h2>Decision</h2>
        <p>{journal.decision || " "}</p>
      </div>
    </section>
  );
}
