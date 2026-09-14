import { formatShortDate, money, signedPct } from "../lib/format";
import type { PlaySpeed } from "../hooks/usePlayback";
import type { EnrichedBar, OverlayState, SignalCard } from "../types";

interface Props {
  bars: EnrichedBar[];
  minIndex: number;
  maxIndex: number;
  index: number;
  playing: boolean;
  speed: PlaySpeed;
  signals: SignalCard[];
  overlays: OverlayState;
  onIndex: (index: number) => void;
  onToggle: () => void;
  onStep: (delta: number) => void;
  onSpeed: (speed: PlaySpeed) => void;
  onOverlay: (next: OverlayState) => void;
  onWindow: (mode: "recent" | "ipo") => void;
  windowMode: "recent" | "ipo";
}

export function Timeline({
  bars,
  minIndex,
  maxIndex,
  index,
  playing,
  speed,
  signals,
  overlays,
  onIndex,
  onToggle,
  onStep,
  onSpeed,
  onOverlay,
  onWindow,
  windowMode,
}: Props) {
  const bar = bars[index];
  const span = Math.max(1, maxIndex - minIndex);
  const progress = `${((index - minIndex) / span) * 100}%`;
  const inWindow = signals.filter((s) => s.index >= minIndex && s.index <= maxIndex);

  if (!bar) {
    return null;
  }

  return (
    <section className="year-panel timeline-panel">
      <div className="year-display">
        <p className="year-kicker">NASDAQ: SPCX · {bar.date}</p>
        <p className="year-num px-num">{money(bar.close)}</p>
        <p className={`lede change ${bar.changePct != null && bar.changePct < 0 ? "down" : "up"}`}>
          {signedPct(bar.changePct, 2)} on the day · vol {Math.round(bar.volume / 1e6)}M
        </p>
      </div>

      <div className="window-row">
        <button
          type="button"
          className={`legend-chip ${windowMode === "recent" ? "is-active" : ""}`}
          onClick={() => onWindow("recent")}
        >
          Last ~5 weeks
        </button>
        <button
          type="button"
          className={`legend-chip ${windowMode === "ipo" ? "is-active" : ""}`}
          onClick={() => onWindow("ipo")}
        >
          Since IPO (Jun 12)
        </button>
      </div>

      <div className="slider-wrap">
        <div className="episode-ticks" aria-hidden="true">
          {inWindow.map((signal) => (
            <span
              key={signal.id}
              className={`tick ${signal.index === index ? "is-active" : ""}`}
              style={{ left: `${((signal.index - minIndex) / span) * 100}%` }}
            />
          ))}
        </div>
        <label className="sr-only" htmlFor="day-slider">
          Timeline day
        </label>
        <input
          id="day-slider"
          className="year-slider"
          type="range"
          min={minIndex}
          max={maxIndex}
          step={1}
          value={index}
          aria-valuetext={`${formatShortDate(bar.date)} close ${money(bar.close)}`}
          onChange={(e) => onIndex(Number(e.target.value))}
          style={{ ["--progress" as string]: progress }}
        />
        <div className="slider-ends">
          <span>{formatShortDate(bars[minIndex].date)}</span>
          <span>{formatShortDate(bars[maxIndex].date)}</span>
        </div>
      </div>

      <div className="episode-legend">
        {inWindow.map((signal) => (
          <button
            key={signal.id}
            type="button"
            className={`legend-chip ${signal.index === index ? "is-active" : ""}`}
            onClick={() => onIndex(signal.index)}
          >
            {formatShortDate(signal.date)}
          </button>
        ))}
      </div>

      <div className="transport">
        <button type="button" className="btn" onClick={() => onStep(-1)}>
          ← Day
        </button>
        <button type="button" className="btn btn-play" onClick={onToggle}>
          {playing ? "Pause" : "Play"}
        </button>
        <button type="button" className="btn" onClick={() => onStep(1)}>
          Day →
        </button>
        <fieldset className="speed">
          <legend className="sr-only">Play speed</legend>
          {(["slow", "class", "fast"] as const).map((id) => (
            <label key={id}>
              <input
                type="radio"
                name="speed"
                checked={speed === id}
                onChange={() => onSpeed(id)}
              />
              {id === "class" ? "Class" : id[0].toUpperCase() + id.slice(1)}
            </label>
          ))}
        </fieldset>
      </div>
      <p className="kbd-hint">
        Keyboard: ← → day · Space play/pause · Home/End ends · Page Up/Down 5 days. Click a marker
        to jump.
      </p>

      <div className="overlay-row">
        <label>
          <input
            type="checkbox"
            checked={overlays.sma20}
            onChange={(e) => onOverlay({ ...overlays, sma20: e.target.checked })}
          />
          SMA 20
        </label>
        <label>
          <input
            type="checkbox"
            checked={overlays.sma50}
            onChange={(e) => onOverlay({ ...overlays, sma50: e.target.checked })}
          />
          SMA 50
        </label>
        <label>
          <input
            type="checkbox"
            checked={overlays.rsi}
            onChange={(e) => onOverlay({ ...overlays, rsi: e.target.checked })}
          />
          RSI(14)
        </label>
        <label>
          <input
            type="checkbox"
            checked={overlays.levels}
            onChange={(e) => onOverlay({ ...overlays, levels: e.target.checked })}
          />
          Support / resistance
        </label>
        <label>
          <input
            type="checkbox"
            checked={overlays.volumeSpikes}
            onChange={(e) => onOverlay({ ...overlays, volumeSpikes: e.target.checked })}
          />
          Volume spikes
        </label>
        <label>
          <input
            type="radio"
            name="style"
            checked={overlays.style === "candles"}
            onChange={() => onOverlay({ ...overlays, style: "candles" })}
          />
          Candles
        </label>
        <label>
          <input
            type="radio"
            name="style"
            checked={overlays.style === "line"}
            onChange={() => onOverlay({ ...overlays, style: "line" })}
          />
          Close line
        </label>
      </div>
    </section>
  );
}
