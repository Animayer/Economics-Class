import { CLASS_RULE, SYSTEMS } from "../lib/content";
import { QUIZ } from "../lib/quiz";
import type { Progress } from "../lib/progress";
import type { Mode } from "../types";

const PATHS: { id: Mode; key: string; title: string; body: string }[] = [
  {
    id: "learn",
    key: "L",
    title: "Learn",
    body: "One module each: who owns, who decides, and which incentives actually fire.",
  },
  {
    id: "compare",
    key: "C",
    title: "Compare",
    body: "Ownership, prices, innovation, power, and outcomes — side by side.",
  },
  {
    id: "simulate",
    key: "S",
    title: "Simulate",
    body: "Run five rounds as an owner, a planner, or a household. Watch the shelves.",
  },
  {
    id: "examples",
    key: "E",
    title: "Examples",
    body: "Historical cases and modern ones, including the countries people mislabel.",
  },
  {
    id: "quiz",
    key: "Q",
    title: "Quiz",
    body: "Fifteen questions. Definitions, no-exit, shortages, crony favors, and modern cases.",
  },
];

export function HubView({
  progress,
  onOpen,
  onTeacher,
}: {
  progress: Progress;
  onOpen: (mode: Mode) => void;
  onTeacher: (open: boolean) => void;
}) {
  return (
    <div className="pane">
      <section className="hero">
        <p className="lede">
          Three ways to decide what gets made. Markets use prices and private property. Socialism puts major
          production in public hands. Communist states ran command plans under one party. The sim takes the claims
          seriously, then scores growth, choice, and freedom.
        </p>
        <aside className="rule">
          <h2>Standing rule</h2>
          <p>{CLASS_RULE}</p>
        </aside>
      </section>

      <div className="hub-grid">
        {PATHS.map((path) => (
          <button key={path.id} type="button" className="path-card" onClick={() => onOpen(path.id)}>
            <span className="path-key">
              <kbd>{path.key}</kbd>
            </span>
            <h2>{path.title}</h2>
            <p>{path.body}</p>
          </button>
        ))}
      </div>

      <section className="progress-strip" aria-label="Progress on this device">
        <h2>On this device</h2>
        <ul>
          {SYSTEMS.map((system) => (
            <li key={system.id}>
              <span className={`dot${progress.passed.includes(system.id) ? " is-on" : ""}`} aria-hidden="true" />
              {system.name} check {progress.passed.includes(system.id) ? "passed" : "not passed yet"}
            </li>
          ))}
          <li>
            <span className={`dot${progress.quizBest !== null ? " is-on" : ""}`} aria-hidden="true" />
            Quiz best {progress.quizBest === null ? "not taken" : `${progress.quizBest} / ${QUIZ.length}`}
          </li>
          <li>
            <span className={`dot${progress.simRuns.length > 0 ? " is-on" : ""}`} aria-hidden="true" />
            Simulation runs saved: {progress.simRuns.length}
          </li>
        </ul>
        <button type="button" className="text-btn" onClick={() => onTeacher(!progress.teacherOpen)}>
          {progress.teacherOpen ? "Teacher unlock is on — lock the Learn sequence" : "Teacher: unlock all Learn modules"}
        </button>
      </section>
    </div>
  );
}
