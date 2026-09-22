import { useCallback, useEffect, useState } from "react";
import { AnatomyView } from "./components/AnatomyView";
import { CompareView } from "./components/CompareView";
import { QuizView } from "./components/QuizView";
import { TeachView } from "./components/TeachView";
import { isTypingTarget } from "./hooks/usePlayback";
import { CLASS_LINE, type PatternId } from "./lib/patterns";
import { PALETTES, type Palette } from "./lib/palette";

type Mode = "anatomy" | "teach" | "compare" | "quiz";

const MODES: { id: Mode; key: string; label: string }[] = [
  { id: "anatomy", key: "A", label: "Anatomy" },
  { id: "teach", key: "T", label: "Teach" },
  { id: "compare", key: "C", label: "Compare" },
  { id: "quiz", key: "Q", label: "Quiz" },
];

export default function App() {
  const [mode, setMode] = useState<Mode>("teach");
  const [patternId, setPatternId] = useState<PatternId>("bullish-engulfing");
  const [pairId, setPairId] = useState("engulfing");
  const [showLabels, setShowLabels] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  const [showVolume, setShowVolume] = useState(false);
  const [palette, setPalette] = useState<Palette>("classic");
  const colors = PALETTES[palette];

  const togglePalette = useCallback(() => {
    setPalette((current) => (current === "classic" ? "colorblind" : "classic"));
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      if (event.repeat) return;
      const key = event.key.toLowerCase();
      if (key === "a") {
        event.preventDefault();
        setMode("anatomy");
        return;
      }
      if (key === "t") {
        event.preventDefault();
        setMode("teach");
        return;
      }
      if (key === "c") {
        event.preventDefault();
        setMode("compare");
        return;
      }
      if (key === "q") {
        event.preventDefault();
        setMode("quiz");
        return;
      }
      if (key === "p") {
        event.preventDefault();
        togglePalette();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePalette]);

  return (
    <div
      className="shell"
      data-mode={mode}
      style={{
        ["--up" as string]: colors.up,
        ["--down" as string]: colors.down,
        ["--flat" as string]: colors.flat,
      }}
    >
      <a className="skip" href="#board">
        Skip to board
      </a>
      <header className="masthead">
        <div className="mast-copy">
          <p className="eyebrow">{CLASS_LINE}</p>
          <h1>Candlestick Pattern Board</h1>
        </div>
        <div className="mast-tools">
          <nav className="modes" aria-label="Classroom modes">
            {MODES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`mode-btn${mode === item.id ? " is-on" : ""}`}
                aria-pressed={mode === item.id}
                onClick={() => setMode(item.id)}
              >
                <kbd>{item.key}</kbd>
                {item.label}
              </button>
            ))}
          </nav>
          <button
            type="button"
            className="tool-btn"
            aria-pressed={palette === "colorblind"}
            onClick={togglePalette}
          >
            <kbd>P</kbd>
            {colors.label}
          </button>
        </div>
      </header>

      <main id="board" className="stage">
        {mode === "anatomy" ? <AnatomyView palette={palette} /> : null}
        {mode === "teach" ? (
          <TeachView
            patternId={patternId}
            onPick={setPatternId}
            showLabels={showLabels}
            showNotes={showNotes}
            showVolume={showVolume}
            palette={palette}
            onToggleLabels={() => setShowLabels((value) => !value)}
            onToggleNotes={() => setShowNotes((value) => !value)}
            onToggleVolume={() => setShowVolume((value) => !value)}
          />
        ) : null}
        {mode === "compare" ? (
          <CompareView
            pairId={pairId}
            onPair={setPairId}
            showLabels={showLabels}
            showVolume={showVolume}
            palette={palette}
            onToggleLabels={() => setShowLabels((value) => !value)}
            onToggleVolume={() => setShowVolume((value) => !value)}
          />
        ) : null}
        {mode === "quiz" ? (
          <QuizView
            showVolume={showVolume}
            palette={palette}
            onToggleVolume={() => setShowVolume((value) => !value)}
          />
        ) : null}
      </main>

      <footer className="hintbar">
        <p>
          <kbd>A</kbd> anatomy <kbd>T</kbd> teach <kbd>C</kbd> compare <kbd>Q</kbd> quiz
          <span className="hint-gap" />
          <kbd>P</kbd> colors
          {mode === "teach" || mode === "compare" ? (
            <>
              <span className="hint-gap" />
              <kbd>←</kbd>
              <kbd>→</kbd> step <kbd>L</kbd> labels <kbd>R</kbd> replay <kbd>V</kbd> volume
            </>
          ) : null}
          {mode === "teach" ? (
            <>
              <span className="hint-gap" />
              <kbd>N</kbd> notes
              {showLabels ? (
                <>
                  <span className="hint-gap" />
                  <kbd>1</kbd>–<kbd>9</kbd> patterns <kbd>F</kbd> <kbd>G</kbd> dojis <kbd>M</kbd> <kbd>E</kbd> stars
                </>
              ) : (
                <>
                  <span className="hint-gap" />
                  names covered
                </>
              )}
            </>
          ) : null}
          {mode === "compare" ? (
            <>
              <span className="hint-gap" />
              <kbd>1</kbd>–<kbd>6</kbd> pairs
            </>
          ) : null}
          {mode === "quiz" ? (
            <>
              <span className="hint-gap" />
              <kbd>1</kbd>–<kbd>4</kbd> answer <kbd>Space</kbd> next
            </>
          ) : null}
        </p>
        <p className="hint-note">Patterns are clues, not guarantees. Not trading advice.</p>
      </footer>
    </div>
  );
}
