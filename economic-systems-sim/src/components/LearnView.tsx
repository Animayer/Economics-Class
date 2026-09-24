import { useEffect, useState } from "react";
import { isUnlocked, systemById, SYSTEM_ORDER } from "../lib/content";
import type { Progress } from "../lib/progress";
import type { SystemId } from "../types";

export function LearnView({
  system,
  progress,
  onSystem,
  onPass,
}: {
  system: SystemId;
  progress: Progress;
  onSystem: (id: SystemId) => void;
  onPass: (id: SystemId) => void;
}) {
  const module = systemById(system);
  const open = isUnlocked(system, progress.passed, progress.teacherOpen);
  const [picks, setPicks] = useState<Record<string, number | null>>({});
  const [misses, setMisses] = useState(0);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      const index = Number(event.key) - 1;
      if (index >= 0 && index < SYSTEM_ORDER.length) {
        const next = SYSTEM_ORDER[index];
        if (isUnlocked(next, progress.passed, progress.teacherOpen)) {
          event.preventDefault();
          onSystem(next);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSystem, progress.passed, progress.teacherOpen]);

  const answered = module.checks.every((check) => picks[check.id] !== undefined && picks[check.id] !== null);
  const allCorrect =
    answered && module.checks.every((check) => picks[check.id] === check.correctIndex);

  return (
    <div className="pane">
      <div className="switcher" role="tablist" aria-label="Economic systems">
        {SYSTEM_ORDER.map((id, index) => {
          const item = systemById(id);
          const locked = !isUnlocked(id, progress.passed, progress.teacherOpen);
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={id === system}
              className={`sys-btn sys-${id}${id === system ? " is-on" : ""}`}
              disabled={locked}
              onClick={() => onSystem(id)}
            >
              <kbd>{index + 1}</kbd>
              {item.name}
              {locked ? <span className="lock"> Locked</span> : null}
            </button>
          );
        })}
      </div>

      {open ? (
        <>
          <article className="define">
            <p className="eyebrow-inline">{module.short}</p>
            <h2>{module.name}</h2>
            <p>{module.definition}</p>
            <dl className="trio">
              <div>
                <dt>Who owns / decides</dt>
                <dd>{module.owns}</dd>
              </div>
              <div>
                <dt>Prices and output</dt>
                <dd>{module.prices}</dd>
              </div>
              <div>
                <dt>Incentives</dt>
                <dd>{module.incentives}</dd>
              </div>
            </dl>
          </article>

          <section aria-label="Understandings">
            <h2>Understandings</h2>
            <div className="card-grid">
              {module.understandings.map((card) => (
                <article key={card.title} className="idea-card">
                  <p className="thinker">{card.thinker}</p>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="split" aria-label="Claims and trade-offs">
            <div>
              <h2>What advocates claim</h2>
              <ul>
                {module.claims.map((claim) => (
                  <li key={claim}>{claim}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>Hard trade-offs</h2>
              <ul>
                {module.tradeoffs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="check" aria-label="Knowledge check">
            <h2>Knowledge check</h2>
            <p>Answer both to unlock the next module. You can retry immediately if you miss.</p>
            {module.checks.map((check) => {
              const pick = picks[check.id];
              const locked = pick !== undefined && pick !== null;
              return (
                <fieldset key={check.id} className="q-block">
                  <legend>{check.prompt}</legend>
                  {check.options.map((option, index) => {
                    const chosen = pick === index;
                    const show = locked && (chosen || index === check.correctIndex);
                    const state = !show ? "" : index === check.correctIndex ? " is-right" : " is-wrong";
                    return (
                      <button
                        key={option}
                        type="button"
                        className={`option${state}`}
                        disabled={locked}
                        onClick={() => {
                          const next = { ...picks, [check.id]: index };
                          setPicks(next);
                          if (index !== check.correctIndex) setMisses((n) => n + 1);
                          const passed = module.checks.every((item) => next[item.id] === item.correctIndex);
                          if (passed) onPass(system);
                        }}
                      >
                        {option}
                      </button>
                    );
                  })}
                  {locked ? <p className="why">{check.why}</p> : null}
                </fieldset>
              );
            })}
            {allCorrect ? (
              <p className="banner ok" role="status">
                Both correct. {system === "communism" ? "You finished the Learn path." : "The next module is unlocked."}
              </p>
            ) : null}
            {misses > 0 && !allCorrect ? (
              <button
                type="button"
                className="text-btn"
                onClick={() => {
                  setPicks({});
                }}
              >
                Clear and retry this check
              </button>
            ) : null}
          </section>
        </>
      ) : (
        <section className="locked-panel">
          <h2>{module.name} is locked</h2>
          <p>
            Pass the previous knowledge check first. The sequence is capitalism, then socialism, then communism.
            A teacher can open every module from the hub.
          </p>
        </section>
      )}
    </div>
  );
}
