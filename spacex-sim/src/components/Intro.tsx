import type { DatasetMeta } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  meta: DatasetMeta;
}

export function Intro({ open, onClose, meta }: Props) {
  if (!open) {
    return null;
  }
  return (
    <div className="intro-scrim" role="dialog" aria-modal="true" aria-labelledby="intro-title">
      <section className="intro-card">
        <p className="eyebrow">{meta.classLine}</p>
        <h1 id="intro-title">What you are looking at</h1>
        <ol className="intro-points">
          <li>
            <strong>A share is a slice of a company.</strong> If SpaceX has millions of shares,
            owning 0.5 share still means you own a (tiny) piece. That is fractional ownership —
            you do not need a whole share to practice the idea.
          </li>
          <li>
            <strong>IPO vs secondary trading.</strong> On {meta.ipoDate} SpaceX listed on{" "}
            {meta.exchange} as <code>{meta.symbol}</code>. The IPO priced at ${meta.ipoPrice} — the
            company sold shares to the public at that number. Every trade after that is the
            secondary market: students, funds, and other investors trading with each other. The IPO
            price is history, not today’s quote.
          </li>
          <li>
            <strong>This lab is paper only.</strong> Fake cash, past prices, no brokerage, no
            account. A past bounce or crash does not predict the next one. Nothing here is
            investment advice.
          </li>
        </ol>
        <p className="intro-foot">
          Walk the timeline day by day. Decide to buy, sell, or hold. Then compare your path to
          sitting still and to a simple rules robot.
        </p>
        <button type="button" className="btn btn-play" onClick={onClose}>
          Start the lesson
        </button>
      </section>
    </div>
  );
}
