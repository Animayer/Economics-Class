import { useCallback, useEffect, useState } from "react";
import { BranchesView } from "./components/BranchesView";
import { RightsView } from "./components/RightsView";
import { ScenariosView, type Attempt } from "./components/ScenariosView";
import { CLASS_LINE, SCENARIOS } from "./lib/content";
import { useRouteState } from "./hooks/useRouteState";
import type { BranchId, CheckId, Mode } from "./types";

const MODES: { id: Mode; key: string; label: string }[] = [
  { id: "branches", key: "B", label: "Branches" },
  { id: "rights", key: "R", label: "Bill of Rights" },
  { id: "scenarios", key: "S", label: "Scenarios" },
];

export default function App() {
  const { route, patch } = useRouteState();
  const [attempts, setAttempts] = useState<Record<string, Attempt>>({});

  const setMode = useCallback(
    (mode: Mode) => {
      patch({
        mode,
        branch: mode === "branches" ? route.branch : null,
        check: mode === "branches" ? route.check : null,
        amendment: mode === "rights" ? route.amendment : null,
        scenario: mode === "scenarios" ? route.scenario : 1,
      });
    },
    [patch, route.amendment, route.branch, route.check, route.scenario],
  );

  const closePanel = useCallback(() => {
    patch({ branch: null, check: null, amendment: null });
  }, [patch]);

  const nextScenario = useCallback(() => {
    const last = SCENARIOS.length;
    if (route.scenario >= last) {
      patch({ scenario: 1 });
      setAttempts({});
      return;
    }
    patch({ scenario: route.scenario + 1 });
  }, [patch, route.scenario]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closePanel();
        return;
      }

      if (event.key === " " || event.code === "Space") {
        if (route.mode === "scenarios") {
          event.preventDefault();
          nextScenario();
        }
        return;
      }

      const letter = event.key.toLowerCase();
      if (letter === "b") {
        event.preventDefault();
        setMode("branches");
        return;
      }
      if (letter === "r") {
        event.preventDefault();
        setMode("rights");
        return;
      }
      if (letter === "s") {
        event.preventDefault();
        setMode("scenarios");
        return;
      }

      if (route.mode === "rights" && /^[0-9]$/.test(event.key)) {
        const n = event.key === "0" ? 10 : Number(event.key);
        if (n >= 1 && n <= 10) {
          event.preventDefault();
          patch({ amendment: route.amendment === n ? null : n });
        }
        return;
      }

      if (route.mode === "scenarios" && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
        event.preventDefault();
        if (event.key === "ArrowRight") nextScenario();
        else patch({ scenario: route.scenario <= 1 ? SCENARIOS.length : route.scenario - 1 });
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closePanel, nextScenario, patch, route.amendment, route.mode, route.scenario, setMode]);

  return (
    <div className="shell">
      <a className="skip" href="#mode-panel">
        Skip to board
      </a>
      <header className="masthead">
        <div className="mast-copy">
          <p className="eyebrow">{CLASS_LINE}</p>
          <h1>The Constitution on the Board</h1>
        </div>
        <nav className="modes" aria-label="Classroom modes">
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

      <main id="mode-panel" className="stage">
        {route.mode === "branches" ? (
          <BranchesView
            selectedBranch={route.branch}
            selectedCheck={route.check}
            onBranch={(id: BranchId | null) => patch({ branch: id, check: null })}
            onCheck={(id: CheckId | null) => patch({ check: id, branch: null })}
          />
        ) : null}
        {route.mode === "rights" ? (
          <RightsView
            selected={route.amendment}
            onSelect={(n) => patch({ amendment: n })}
          />
        ) : null}
        {route.mode === "scenarios" ? (
          <ScenariosView
            index={route.scenario}
            attempts={attempts}
            onIndex={(n) => {
              if (n === 1 && route.scenario === SCENARIOS.length) setAttempts({});
              patch({ scenario: n });
            }}
            onAttempt={(id, attempt) =>
              setAttempts((prev) => ({ ...prev, [id]: attempt }))
            }
          />
        ) : null}
      </main>

      <footer className="hintbar">
        <p>
          <kbd>B</kbd> branches <kbd>R</kbd> rights <kbd>S</kbd> scenarios
          <span className="hint-gap" />
          <kbd>Space</kbd> next scenario <kbd>Esc</kbd> close panel
          {route.mode === "rights" ? (
            <>
              <span className="hint-gap" />
              <kbd>1</kbd>–<kbd>0</kbd> open an amendment
            </>
          ) : null}
        </p>
        <p className="hint-note">
          Teaching board · not legal advice · no login
        </p>
      </footer>
    </div>
  );
}
