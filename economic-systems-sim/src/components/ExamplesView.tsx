import { EXAMPLES, MIXED_NOTE, systemById, SYSTEM_ORDER } from "../lib/content";
import type { SystemId } from "../types";

export function ExamplesView({ system, onSystem }: { system: SystemId; onSystem: (id: SystemId) => void }) {
  const module = systemById(system);
  const cards = EXAMPLES[system];

  return (
    <div className="pane">
      <aside className="rule">
        <h2>Mixed, market, command</h2>
        <p>{MIXED_NOTE}</p>
      </aside>
      <div className="switcher" role="tablist" aria-label="Examples by system">
        {SYSTEM_ORDER.map((id) => {
          const item = systemById(id);
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={id === system}
              className={`sys-btn sys-${id}${id === system ? " is-on" : ""}`}
              onClick={() => onSystem(id)}
            >
              {item.name}
            </button>
          );
        })}
      </div>
      <h2>{module.name} examples</h2>
      <div className="card-grid">
        {cards.map((card) => (
          <article key={card.title} className="idea-card">
            <p className="thinker">{card.era}</p>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
