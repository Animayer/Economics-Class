import { AMENDMENTS, SCENARIOS, isCorrect } from "../lib/content";

export interface Attempt {
  pick: string | number;
  correct: boolean;
}

interface Props {
  index: number;
  attempts: Record<string, Attempt>;
  onIndex: (n: number) => void;
  onAttempt: (id: string, attempt: Attempt) => void;
}

export function ScenariosView({
  index,
  attempts,
  onIndex,
  onAttempt,
}: Props) {
  const scenario = SCENARIOS[index - 1] ?? SCENARIOS[0];
  const attempt = attempts[scenario.id];
  const answered = Boolean(attempt);
  const correctCount = Object.values(attempts).filter((a) => a.correct).length;
  const total = SCENARIOS.length;

  const pick = (value: string | number) => {
    if (attempt) return;
    onAttempt(scenario.id, {
      pick: value,
      correct: isCorrect(scenario, value),
    });
  };

  const next = () => {
    if (index >= total) {
      onIndex(1);
      return;
    }
    onIndex(index + 1);
  };

  const prev = () => {
    onIndex(index <= 1 ? total : index - 1);
  };

  return (
    <section className="mode-pane scenarios-pane" aria-label="Classroom scenarios">
      <div className="scene-meta">
        <p className="scene-count">
          Scenario {index} / {total}
        </p>
        <p className="scene-topic">{scenario.topic}</p>
        <p className="scene-score" aria-live="polite">
          {Object.keys(attempts).length === 0
            ? "Score off until you tap"
            : `${correctCount} right · ${Object.keys(attempts).length} answered`}
        </p>
      </div>

      <h2 className="scene-prompt">{scenario.prompt}</h2>

      {scenario.kind === "amendment" ? (
        <div className="scene-amendments" role="group" aria-label="Tap an amendment">
          {AMENDMENTS.map((item) => {
            const chosen = attempt?.pick === item.number;
            const show = answered && (chosen || item.number === scenario.answer);
            const tone =
              show && item.number === scenario.answer
                ? "is-right"
                : show && chosen
                  ? "is-wrong"
                  : "";
            return (
              <button
                key={item.number}
                type="button"
                className={`mini-amend ${tone}`}
                disabled={answered}
                onClick={() => pick(item.number)}
              >
                <span className="roman">{item.roman}</span>
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="scene-choices" role="group" aria-label="Choose an answer">
          {scenario.choices.map((choice) => {
            const chosen = attempt?.pick === choice;
            const show = answered && (chosen || choice === scenario.answer);
            const tone =
              show && choice === scenario.answer
                ? "is-right"
                : show && chosen
                  ? "is-wrong"
                  : "";
            return (
              <button
                key={choice}
                type="button"
                className={`choice-btn ${tone}`}
                disabled={answered}
                onClick={() => pick(choice)}
              >
                {choice}
              </button>
            );
          })}
        </div>
      )}

      <div className={`feedback${answered ? " is-open" : ""}`} role="status">
        {attempt ? (
          <>
            <p className={attempt.correct ? "ok" : "nope"}>
              {attempt.correct ? "That’s the civics answer." : "Not quite."}
            </p>
            <p className="explain">{scenario.explain}</p>
          </>
        ) : (
          <p className="feedback-idle">Tap an answer. The board will explain in one sentence.</p>
        )}
      </div>

      <div className="scene-nav">
        <button type="button" className="btn" onClick={prev}>
          Back
        </button>
        <button type="button" className="btn btn-next" onClick={next}>
          {index >= total ? "Start over · Space" : "Next scenario · Space"}
        </button>
      </div>
    </section>
  );
}
