import { useEffect, useState } from "react";
import { blockShortcut, usePlayback } from "../hooks/usePlayback";
import { generateSeries } from "../lib/generate";
import {
  PATTERNS,
  PATTERN_GROUPS,
  getPattern,
  patternByShortcut,
  teachingBullets,
  type PatternId,
  type PatternInfo,
} from "../lib/patterns";
import type { Palette } from "../lib/palette";
import { CandleChart } from "./CandleChart";
import { PlaybackBar } from "./PlaybackBar";

type Props = {
  patternId: PatternId;
  onPick: (id: PatternId) => void;
  showLabels: boolean;
  showNotes: boolean;
  showVolume: boolean;
  palette: Palette;
  onToggleLabels: () => void;
  onToggleNotes: () => void;
  onToggleVolume: () => void;
};

export function TeachView({
  patternId,
  onPick,
  showLabels,
  showNotes,
  showVolume,
  palette,
  onToggleLabels,
  onToggleNotes,
  onToggleVolume,
}: Props) {
  const series = generateSeries(patternId);
  const pattern = getPattern(patternId);
  const play = usePlayback(series.candles.length, series.patternStart, patternId);
  const copy = teachCopy(pattern, play.visible, series.patternStart, series.patternEnd, showLabels);

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
      if (key === "Home") {
        event.preventDefault();
        play.jump(1);
        return;
      }
      if (key === "End") {
        event.preventDefault();
        play.showAll();
        return;
      }
      const lower = key.toLowerCase();
      if (lower === "l") {
        event.preventDefault();
        onToggleLabels();
        return;
      }
      if (lower === "n") {
        event.preventDefault();
        onToggleNotes();
        return;
      }
      if (lower === "r") {
        event.preventDefault();
        play.replay();
        return;
      }
      if (lower === "v") {
        event.preventDefault();
        onToggleVolume();
        return;
      }
      const picked = patternByShortcut(key);
      if (picked) {
        event.preventDefault();
        onPick(picked.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPick, onToggleLabels, onToggleNotes, onToggleVolume, play]);

  return (
    <section className={`work${showNotes ? " with-notes" : ""}`} aria-label="Teach mode">
      <PatternRail current={patternId} covered={!showLabels} onPick={onPick} />
      <div className="stage-col">
        <CandleChart
          series={series}
          visibleCount={play.visible}
          showLabels={showLabels}
          showVolume={showVolume}
          palette={palette}
          title={copy.title}
          detail={copy.detail}
        />
        <PlaybackBar
          total={series.candles.length}
          visible={play.visible}
          playing={play.playing}
          patternStart={series.patternStart}
          patternEnd={series.patternEnd}
          markPattern={showLabels}
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
          <button type="button" className="ctrl" aria-pressed={showNotes} onClick={onToggleNotes}>
            <kbd>N</kbd>
            {showNotes ? "Hide notes" : "Show notes"}
          </button>
          <button type="button" className="ctrl" aria-pressed={showVolume} onClick={onToggleVolume}>
            <kbd>V</kbd>
            {showVolume ? "Hide volume" : "Show volume"}
          </button>
        </div>
      </div>
      {showNotes ? (
        <aside className={`notes${showLabels ? "" : " is-spoiler"}`} aria-label="Teacher notes">
          <p className="kicker">{pattern.advanced ? "Next step · 3 candles" : pattern.family}</p>
          <h2>{pattern.name}</h2>
          {!showLabels ? (
            <p className="spoiler-warn">These notes name the pattern. Cover them with N if the class is still guessing.</p>
          ) : null}
          <ol>
            {teachingBullets(pattern).map((bullet) => (
              <li key={bullet.label}>
                <strong>{bullet.label}.</strong> {bullet.text}
              </li>
            ))}
          </ol>
        </aside>
      ) : null}
    </section>
  );
}

function teachCopy(
  pattern: PatternInfo,
  visible: number,
  start: number,
  end: number,
  labels: boolean,
): { title: string; detail: string } {
  if (!labels) {
    return {
      title: "What is this?",
      detail: "Names are covered. Walk the days, let the class guess, then press L.",
    };
  }
  if (visible <= 0) {
    return { title: pattern.name, detail: "Replay is running from day 1." };
  }
  if (visible <= start) {
    return {
      title: pattern.name,
      detail: "Setup is on the board. Step forward to reveal the pattern.",
    };
  }
  if (visible <= end) {
    return { title: pattern.name, detail: "The pattern is printing. Keep stepping." };
  }
  return { title: pattern.name, detail: pattern.callout };
}

function PatternRail({
  current,
  covered,
  onPick,
}: {
  current: PatternId;
  covered: boolean;
  onPick: (id: PatternId) => void;
}) {
  const [peek, setPeek] = useState(false);
  if (covered && !peek) {
    return (
      <div className="rail rail-covered">
        <h2>Names covered</h2>
        <p>The chart will not say the pattern. Number keys still change it.</p>
        <div className="numpad" role="group" aria-label="Pattern shortcuts">
          {PATTERNS.filter((item) => item.shortcut).map((item) => (
            <button
              key={item.id}
              type="button"
              aria-label={`${item.shortcut}. ${item.name}`}
              aria-pressed={item.id === current}
              onClick={() => onPick(item.id)}
            >
              {item.shortcut}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="ctrl peek"
          onPointerDown={() => setPeek(true)}
          onPointerUp={() => setPeek(false)}
          onPointerLeave={() => setPeek(false)}
          onKeyDown={(event) => {
            if (event.key === " " || event.key === "Enter") setPeek(true);
          }}
          onKeyUp={(event) => {
            if (event.key === " " || event.key === "Enter") setPeek(false);
          }}
          onBlur={() => setPeek(false)}
        >
          Hold to peek names
        </button>
      </div>
    );
  }

  return (
    <nav className="rail" aria-label="Patterns">
      {PATTERN_GROUPS.map((group) => (
        <div key={group.label} className="rail-group">
          <h2>{group.label}</h2>
          <p>{group.hint}</p>
          {group.ids.map((id) => {
            const item = getPattern(id);
            return (
              <button
                key={id}
                type="button"
                className={`pat-btn${id === current ? " is-on" : ""}`}
                data-bias={item.bias}
                aria-pressed={id === current}
                onClick={() => onPick(id)}
              >
                {item.shortcut ? <kbd>{item.shortcut}</kbd> : <kbd>·</kbd>}
                <span>
                  <strong>{item.shortName}</strong>
                  {item.advanced ? <em>Next step</em> : null}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
