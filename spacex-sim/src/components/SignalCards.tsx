import { MOVE_LABEL } from "../lib/signals";
import { formatShortDate } from "../lib/format";
import type { SignalCard } from "../types";

interface Props {
  today: SignalCard[];
  recent: SignalCard[];
  showKey: boolean;
  hideNotes: boolean;
  onJump: (index: number) => void;
}

export function SignalCards({ today, recent, showKey, hideNotes, onJump }: Props) {
  return (
    <section className="card signals" aria-labelledby="sig-title">
      <h2 id="sig-title">Signal cards</h2>
      {!hideNotes ? (
        <p className="teacher-note">
          These are classroom alerts — what a cautious swing trader <em>might</em> do, not what
          you should do with real money.
        </p>
      ) : null}
      {today.length === 0 ? (
        <p className="muted">No headline signal on this close. Check the markers for nearby days.</p>
      ) : (
        today.map((card) => (
          <article key={card.id} className={`signal-card is-${card.cautiousMove}`}>
            <p className="callout-kicker">
              {formatShortDate(card.date)} · {MOVE_LABEL[card.cautiousMove]}
            </p>
            <h3>{card.title}</h3>
            <p>{card.summary}</p>
            <p className="cautious">{card.cautiousNote}</p>
            {showKey ? <p className="answer-key">{card.answerKey}</p> : null}
          </article>
        ))
      )}
      {recent.length > 0 ? (
        <div className="recent-signals">
          <p className="muted">Other markers in this window</p>
          <ul>
            {recent.map((card) => (
              <li key={card.id}>
                <button type="button" className="linkish" onClick={() => onJump(card.index)}>
                  {formatShortDate(card.date)} — {card.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
