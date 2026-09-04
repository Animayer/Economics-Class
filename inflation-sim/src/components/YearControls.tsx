import type { CSSProperties } from "react";
import type { Episode } from "../types";
import type { PlaySpeed } from "../hooks/usePlayback";

interface YearControlsProps {
  year: number;
  startYear: number;
  endYear: number;
  playing: boolean;
  speed: PlaySpeed;
  episodes: Episode[];
  onYear: (year: number) => void;
  onToggle: () => void;
  onStep: (delta: number) => void;
  onSpeed: (speed: PlaySpeed) => void;
  onPause: () => void;
}

export function YearControls({
  year,
  startYear,
  endYear,
  playing,
  speed,
  episodes,
  onYear,
  onToggle,
  onStep,
  onSpeed,
  onPause,
}: YearControlsProps) {
  const pct = ((year - startYear) / (endYear - startYear)) * 100;

  return (
    <section className="year-panel" aria-label="Year control">
      <div className="year-display" aria-live="polite">
        <p className="year-kicker">Selected year</p>
        <p className="year-num">{year}</p>
      </div>

      <div className="slider-wrap">
        <div className="episode-ticks" aria-hidden="true">
          {episodes.map((episode) => {
            const left = ((episode.start - startYear) / (endYear - startYear)) * 100;
            const width = ((episode.end - episode.start) / (endYear - startYear)) * 100;
            const active = year >= episode.start && year <= episode.end;
            return (
              <button
                key={episode.id}
                type="button"
                className={`tick${active ? " is-active" : ""}`}
                style={{ left: `${left}%`, width: `${Math.max(width, 1.4)}%` }}
                title={`${episode.label} (${episode.start}–${episode.end})`}
                onClick={() => {
                  onPause();
                  onYear(episode.start);
                }}
              >
                <span>{episode.label}</span>
              </button>
            );
          })}
        </div>
        <label className="sr-only" htmlFor="year-slider">
          Year from {startYear} to {endYear}
        </label>
        <input
          id="year-slider"
          className="year-slider"
          type="range"
          min={startYear}
          max={endYear}
          step={1}
          value={year}
          aria-valuemin={startYear}
          aria-valuemax={endYear}
          aria-valuenow={year}
          aria-valuetext={`${year}`}
          onChange={(event) => {
            onPause();
            onYear(Number(event.target.value));
          }}
          style={{ "--progress": `${pct}%` } as CSSProperties}
        />
        <div className="slider-ends">
          <span>{startYear}</span>
          <span>{endYear}</span>
        </div>
      </div>

      <div className="transport">
        <button type="button" className="btn" onClick={() => { onPause(); onYear(startYear); }} aria-label={`Jump to ${startYear}`}>
          « {startYear}
        </button>
        <button type="button" className="btn" onClick={() => onStep(-1)} aria-label="Previous year">
          ‹ Year
        </button>
        <button type="button" className="btn btn-play" onClick={onToggle} aria-pressed={playing}>
          {playing ? "Pause" : "Play"}
        </button>
        <button type="button" className="btn" onClick={() => onStep(1)} aria-label="Next year">
          Year ›
        </button>
        <button type="button" className="btn" onClick={() => { onPause(); onYear(endYear); }} aria-label={`Jump to ${endYear}`}>
          {endYear} »
        </button>
        <fieldset className="speed">
          <legend className="sr-only">Playback speed</legend>
          {(["slow", "class", "fast"] as PlaySpeed[]).map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="speed"
                checked={speed === option}
                onChange={() => onSpeed(option)}
              />
              {option === "class" ? "Class" : option[0].toUpperCase() + option.slice(1)}
            </label>
          ))}
        </fieldset>
      </div>
      <p className="kbd-hint">
        Keys: ← → year · Space play/pause · PgUp / PgDn decade · Home / End ends
      </p>
    </section>
  );
}
