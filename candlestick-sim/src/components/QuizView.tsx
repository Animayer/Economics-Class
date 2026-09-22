import { useCallback, useEffect, useMemo, useState } from "react";
import { blockShortcut } from "../hooks/usePlayback";
import { generateSeries } from "../lib/generate";
import { PATTERNS, getPattern, type PatternId } from "../lib/patterns";
import type { Palette } from "../lib/palette";
import { buildQuizQuestion } from "../lib/quiz";
import { CandleChart } from "./CandleChart";

type Props = {
  showVolume: boolean;
  palette: Palette;
  onToggleVolume: () => void;
};

export function QuizView({ showVolume, palette, onToggleVolume }: Props) {
  const [includeAdvanced, setIncludeAdvanced] = useState(false);
  const [seed, setSeed] = useState(1);
  const [avoid, setAvoid] = useState<PatternId | undefined>(undefined);
  const [attempts, setAttempts] = useState<{ key: string; picked: PatternId; answer: PatternId }[]>(
    [],
  );

  const pool = useMemo(
    () => PATTERNS.filter((item) => includeAdvanced || !item.advanced).map((item) => item.id),
    [includeAdvanced],
  );
  const question = useMemo(() => buildQuizQuestion(seed, pool, avoid), [avoid, pool, seed]);
  const series = useMemo(() => generateSeries(question.answer), [question.answer]);
  const answer = getPattern(question.answer);
  const questionKey = `${seed}:${question.answer}`;
  const picked = attempts.find((item) => item.key === questionKey)?.picked ?? null;
  const correct = attempts.filter((item) => item.picked === item.answer).length;

  const choose = useCallback(
    (id: PatternId) => {
      setAttempts((items) => {
        if (items.some((item) => item.key === questionKey)) return items;
        return [...items, { key: questionKey, picked: id, answer: question.answer }];
      });
    },
    [question.answer, questionKey],
  );

  const next = useCallback(() => {
    setAvoid(question.answer);
    setSeed((current) => current + 1);
  }, [question.answer]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (blockShortcut(event)) return;
      if (event.repeat) return;
      if (event.key >= "1" && event.key <= "4") {
        const option = question.options[Number(event.key) - 1];
        if (option) {
          event.preventDefault();
          choose(option);
        }
        return;
      }
      if (event.key.toLowerCase() === "v") {
        event.preventDefault();
        onToggleVolume();
        return;
      }
      if ((event.key === " " || event.key === "ArrowRight" || event.key === "Enter") && picked) {
        event.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [choose, next, onToggleVolume, picked, question]);

  return (
    <section className="quiz" aria-label="Quiz mode">
      <div className="stage-col">
        <CandleChart
          series={series}
          visibleCount={series.candles.length}
          showLabels={picked !== null}
          showVolume={showVolume}
          palette={palette}
          tickerOverride="MAYER CO"
          title={picked ? answer.name : "Which pattern finishes this chart?"}
          detail={
            picked
              ? answer.callout
              : "No name yet. Use the trend and the last candles. Then pick an answer."
          }
        />
        <div className="toggles">
          <button type="button" className="ctrl" aria-pressed={showVolume} onClick={onToggleVolume}>
            <kbd>V</kbd>
            {showVolume ? "Hide volume" : "Show volume"}
          </button>
        </div>
      </div>
      <div className="quiz-side">
        <p className="score">
          Class score <strong>{correct}</strong>
          <span> / {attempts.length}</span>
        </p>
        <div className="choices" role="group" aria-label="Answer choices">
          {question.options.map((id, index) => {
            const info = getPattern(id);
            const state =
              picked === null ? "" : id === question.answer ? " is-correct" : id === picked ? " is-wrong" : "";
            return (
              <button
                key={id}
                type="button"
                className={`choice${state}`}
                disabled={picked !== null}
                onClick={() => choose(id)}
              >
                <kbd>{index + 1}</kbd>
                {info.name}
              </button>
            );
          })}
        </div>
        {picked ? (
          <div className="why" role="status">
            <h2>{picked === question.answer ? "That's the one." : `Not quite. This is a ${answer.name}.`}</h2>
            <p>{answer.quizWhy}</p>
          </div>
        ) : (
          <p className="fine">Four names. One chart. A miss is still a useful look.</p>
        )}
        <div className="quiz-actions">
          <button type="button" className="ctrl ctrl-primary" onClick={next} disabled={!picked}>
            Next pattern
          </button>
          <button
            type="button"
            className="ctrl"
            onClick={() => setAttempts([])}
          >
            Reset score
          </button>
          <label className="check">
            <input
              type="checkbox"
              checked={includeAdvanced}
              onChange={(event) => setIncludeAdvanced(event.target.checked)}
            />
            Include morning and evening stars
          </label>
        </div>
        <p className="fine">No accounts. The score stays on this screen until you reset it or refresh.</p>
      </div>
    </section>
  );
}
