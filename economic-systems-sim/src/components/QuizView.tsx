import { useEffect, useState } from "react";
import { QUIZ, quizScore } from "../lib/quiz";

export function QuizView({ onScore }: { onScore: (score: number) => void }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => QUIZ.map(() => null));
  const [done, setDone] = useState(false);
  const question = QUIZ[index];
  const pick = answers[index];

  const choose = (option: number) => {
    if (answers[index] !== null || done) return;
    const next = answers.slice();
    next[index] = option;
    setAnswers(next);
  };

  useEffect(() => {
    if (done) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      const option = Number(event.key) - 1;
      if (option >= 0 && option < QUIZ[index].options.length && answers[index] === null) {
        event.preventDefault();
        choose(option);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const finish = () => {
    const { correct } = quizScore(answers);
    onScore(correct);
    setDone(true);
  };

  if (done) {
    const { correct, total } = quizScore(answers);
    return (
      <div className="pane">
        <section className="score-card">
          <p className="eyebrow-inline">Quiz result</p>
          <h2>
            {correct} / {total}
          </h2>
          <p>
            {correct >= 10
              ? "Strong. You can separate definitions, incentives, and the countries people mislabel."
              : correct >= 7
                ? "Solid start. Reread any miss on crony privilege, the knowledge problem, or the Nordic mix-up."
                : "Retry after Learn and Examples. The misses are the lesson."}
          </p>
          <button
            type="button"
            className="primary"
            onClick={() => {
              setAnswers(QUIZ.map(() => null));
              setIndex(0);
              setDone(false);
            }}
          >
            Retry quiz
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="pane">
      <p className="count">
        Question {index + 1} of {QUIZ.length}
        <span className="kind">{question.kind === "scenario" ? "Scenario" : "Multiple choice"}</span>
      </p>
      <fieldset className="q-block">
        <legend>{question.prompt}</legend>
        {question.options.map((option, optionIndex) => {
          const locked = pick !== null;
          const show = locked && (pick === optionIndex || optionIndex === question.correctIndex);
          const state = !show ? "" : optionIndex === question.correctIndex ? " is-right" : " is-wrong";
          return (
            <button
              key={option}
              type="button"
              className={`option${state}`}
              disabled={locked}
              onClick={() => choose(optionIndex)}
            >
              <kbd>{optionIndex + 1}</kbd>
              {option}
            </button>
          );
        })}
      </fieldset>
      {pick !== null ? (
        <p className="why" role="status">
          {question.why}
        </p>
      ) : null}
      <div className="row-actions">
        {index > 0 ? (
          <button type="button" className="text-btn" onClick={() => setIndex((n) => n - 1)}>
            Back
          </button>
        ) : null}
        {pick !== null && index < QUIZ.length - 1 ? (
          <button type="button" className="primary" onClick={() => setIndex((n) => n + 1)}>
            Next question
          </button>
        ) : null}
        {pick !== null && index === QUIZ.length - 1 ? (
          <button type="button" className="primary" onClick={finish}>
            See score
          </button>
        ) : null}
      </div>
    </div>
  );
}
