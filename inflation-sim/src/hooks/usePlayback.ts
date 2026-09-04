import { useCallback, useEffect, useRef, useState } from "react";

export const PLAY_SPEEDS = {
  slow: 700,
  class: 420,
  fast: 180,
} as const;

export type PlaySpeed = keyof typeof PLAY_SPEEDS;

export function usePlayback(startYear: number, endYear: number) {
  const [year, setYear] = useState(1950);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaySpeed>("class");
  const yearRef = useRef(year);

  useEffect(() => {
    yearRef.current = year;
  }, [year]);

  const step = useCallback(
    (delta: number) => {
      setYear((current) => Math.min(endYear, Math.max(startYear, current + delta)));
    },
    [endYear, startYear],
  );

  const play = useCallback(() => setPlaying(true), []);
  const pause = useCallback(() => setPlaying(false), []);
  const toggle = useCallback(() => setPlaying((on) => !on), []);

  useEffect(() => {
    if (!playing) {
      return;
    }
    const id = window.setInterval(() => {
      const next = yearRef.current + 1;
      if (next > endYear) {
        setPlaying(false);
        setYear(endYear);
        return;
      }
      setYear(next);
    }, PLAY_SPEEDS[speed]);
    return () => window.clearInterval(id);
  }, [playing, speed, endYear]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA")) {
        if (event.key !== "Escape") {
          return;
        }
      }
      if (event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        toggle();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        pause();
        step(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        pause();
        step(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        pause();
        setYear(startYear);
      } else if (event.key === "End") {
        event.preventDefault();
        pause();
        setYear(endYear);
      } else if (event.key === "PageUp") {
        event.preventDefault();
        pause();
        step(10);
      } else if (event.key === "PageDown") {
        event.preventDefault();
        pause();
        step(-10);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [endYear, pause, startYear, step, toggle]);

  return {
    year,
    setYear,
    playing,
    play,
    pause,
    toggle,
    speed,
    setSpeed,
    step,
  };
}
