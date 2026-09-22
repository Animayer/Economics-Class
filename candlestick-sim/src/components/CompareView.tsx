import { useEffect } from "react";
import { blockShortcut, usePlayback } from "../hooks/usePlayback";
import { generateSeries } from "../lib/generate";
import { COMPARE_PAIRS, getPattern } from "../lib/patterns";
import type { Palette } from "../lib/palette";
import { CandleChart } from "./CandleChart";
import { PlaybackBar } from "./PlaybackBar";

type Props = {
  pairId: string;
  onPair: (id: string) => void;
  showLabels: boolean;
  showVolume: boolean;
  palette: Palette;
  onToggleLabels: () => void;
  onToggleVolume: () => void;
};

export function CompareView({
  pairId,
  onPair,
  showLabels,
  showVolume,
  palette,
  onToggleLabels,
  onToggleVolume,
}: Props) {
  const pair = COMPARE_PAIRS.find((item) => item.id === pairId) ?? COMPARE_PAIRS[0]!;
  const left = generateSeries(pair.left);
  const right = generateSeries(pair.right);
  const total = Math.max(left.candles.length, right.candles.length);
  const start = Math.min(left.patternStart, right.patternStart);
  const play = usePlayback(total, start, pair.id);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (blockShortcut(event)) return;
      const key = event.key;
      if (key === "ArrowRight" || key === "ArrowDown" || key === "PageDown") {
        event.preventDefault();
        play.step(1);
        return;
      }
      if (key === "ArrowLeft" || key === "ArrowUp" || key === "PageUp") {
        event.preventDefault();
        play.step(-1);
        return;
      }
      if (event.repeat) return;
      if (key === " " || key === "Enter") {
        event.preventDefault();
        play.step(1);
        return;
      }
      if (key.toLowerCase() === "l") {
        event.preventDefault();
        onToggleLabels();
        return;
      }
      if (key.toLowerCase() === "r") {
        event.preventDefault();
        play.replay();
        return;
      }
      if (key.toLowerCase() === "v") {
        event.preventDefault();
        onToggleVolume();
        return;
      }
      const index = Number(key) - 1;
      const next = COMPARE_PAIRS[index];
      if (next && key >= "1" && key <= "6") {
        event.preventDefault();
        onPair(next.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPair, onToggleLabels, onToggleVolume, play]);

  return (
    <section className="compare" aria-label="Compare mode">
      <nav className="rail" aria-label="Comparisons">
        {COMPARE_PAIRS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`pat-btn${item.id === pair.id ? " is-on" : ""}`}
            aria-pressed={item.id === pair.id}
            onClick={() => onPair(item.id)}
          >
            <kbd>{index + 1}</kbd>
            <span>
              <strong>{item.title}</strong>
              {item.advanced ? <em>Next step</em> : null}
            </span>
          </button>
        ))}
      </nav>
      <div className="stage-col">
        <p className="compare-prompt">{showLabels ? pair.prompt : pair.coveredPrompt}</p>
        <div className="compare-grid">
          <CandleChart
            series={left}
            visibleCount={play.visible}
            showLabels={showLabels}
            showVolume={showVolume}
            palette={palette}
            compact
            title={showLabels ? getPattern(pair.left).name : "Left chart"}
            detail={showLabels ? getPattern(pair.left).callout : "Name covered."}
          />
          <CandleChart
            series={right}
            visibleCount={play.visible}
            showLabels={showLabels}
            showVolume={showVolume}
            palette={palette}
            compact
            title={showLabels ? getPattern(pair.right).name : "Right chart"}
            detail={showLabels ? getPattern(pair.right).callout : "Name covered."}
          />
        </div>
        <PlaybackBar
          total={total}
          visible={play.visible}
          playing={play.playing}
          patternStart={start}
          patternEnd={total - 1}
          markPattern={false}
          onJump={play.jump}
          onPrev={() => play.step(-1)}
          onNext={() => play.step(1)}
          onReplay={play.replay}
          onShowAll={play.showAll}
        />
        <div className="toggles">
          <button type="button" className="ctrl" aria-pressed={showLabels} onClick={onToggleLabels}>
            <kbd>L</kbd>
            {showLabels ? "Hide labels" : "Show labels"}
          </button>
          <button type="button" className="ctrl" aria-pressed={showVolume} onClick={onToggleVolume}>
            <kbd>V</kbd>
            {showVolume ? "Hide volume" : "Show volume"}
          </button>
        </div>
      </div>
    </section>
  );
}
