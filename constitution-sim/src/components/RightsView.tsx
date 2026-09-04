import { AMENDMENTS, amendmentByNumber } from "../lib/content";

interface Props {
  selected: number | null;
  onSelect: (n: number | null) => void;
}

export function RightsView({ selected, onSelect }: Props) {
  const open = selected ? amendmentByNumber(selected) : undefined;

  return (
    <section className="mode-pane rights-pane" aria-label="Bill of Rights">
      <div className="rights-grid">
        {AMENDMENTS.map((item) => (
          <button
            key={item.number}
            type="button"
            className={`right-card${selected === item.number ? " is-on" : ""}`}
            aria-pressed={selected === item.number}
            onClick={() => onSelect(item.number)}
          >
            <span className="roman">{item.roman}</span>
            <span className="right-title">{item.title}</span>
            <span className="right-sub">{item.subtitle}</span>
          </button>
        ))}
      </div>

      {open ? (
        <div
          className="overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="amendment-title"
        >
          <button
            type="button"
            className="overlay-backdrop"
            aria-label="Close amendment"
            onClick={() => onSelect(null)}
          />
          <div className="overlay-panel">
            <p className="detail-kicker">Amendment {open.roman}</p>
            <h2 id="amendment-title">{open.title}</h2>
            <p className="detail-lead">{open.gist}</p>
            <div className="amend-cols">
              <div>
                <h3>What it protects</h3>
                <ul>
                  {open.protects.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>What it does not</h3>
                <ul>
                  {open.doesNot.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="why-box">
              <strong>Why it mattered. </strong>
              {open.whyItMattered}
            </p>
            <button
              type="button"
              className="btn-close"
              onClick={() => onSelect(null)}
            >
              Close · Esc
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
