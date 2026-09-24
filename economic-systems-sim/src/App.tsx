import { useCallback, useEffect } from "react";
import { CompareView } from "./components/CompareView";
import { ExamplesView } from "./components/ExamplesView";
import { HubView } from "./components/HubView";
import { LearnView } from "./components/LearnView";
import { QuizView } from "./components/QuizView";
import { SimulateView } from "./components/SimulateView";
import { useProgress } from "./hooks/useProgress";
import { useRouteState } from "./hooks/useRouteState";
import { CLASS_LINE } from "./lib/content";
import type { Mode } from "./types";

const MODES: { id: Mode; key: string; label: string }[] = [
  { id: "hub", key: "H", label: "Hub" },
  { id: "learn", key: "L", label: "Learn" },
  { id: "compare", key: "C", label: "Compare" },
  { id: "simulate", key: "S", label: "Simulate" },
  { id: "examples", key: "E", label: "Examples" },
  { id: "quiz", key: "Q", label: "Quiz" },
];

export default function App() {
  const { route, patch } = useRouteState();
  const { progress, passSystem, setTeacherOpen, recordQuiz, recordSim } = useProgress();

  const setMode = useCallback(
    (mode: Mode) => {
      patch({ mode });
    },
    [patch],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }
      const letter = event.key.toLowerCase();
      const next = MODES.find((item) => item.key.toLowerCase() === letter);
      if (!next) return;
      event.preventDefault();
      setMode(next.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setMode]);

  return (
    <div className="shell">
      <a className="skip" href="#main">
        Skip to lesson
      </a>
      <header className="masthead">
        <div>
          <p className="eyebrow">{CLASS_LINE}</p>
          <h1>Economic Systems</h1>
        </div>
        <nav className="modes" aria-label="Lesson sections">
          {MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`mode-btn${route.mode === item.id ? " is-on" : ""}`}
              aria-pressed={route.mode === item.id}
              onClick={() => setMode(item.id)}
            >
              <kbd>{item.key}</kbd>
              {item.label}
            </button>
          ))}
        </nav>
      </header>
      <main id="main">
        {route.mode === "hub" ? (
          <HubView progress={progress} onOpen={setMode} onTeacher={setTeacherOpen} />
        ) : null}
        {route.mode === "learn" ? (
          <LearnView
            key={route.system}
            system={route.system}
            progress={progress}
            onSystem={(system) => patch({ system })}
            onPass={passSystem}
          />
        ) : null}
        {route.mode === "compare" ? <CompareView /> : null}
        {route.mode === "simulate" ? (
          <SimulateView system={route.system} onSystem={(system) => patch({ system })} onRecord={recordSim} />
        ) : null}
        {route.mode === "examples" ? (
          <ExamplesView system={route.system} onSystem={(system) => patch({ system })} />
        ) : null}
        {route.mode === "quiz" ? <QuizView onScore={recordQuiz} /> : null}
      </main>
    </div>
  );
}
