import { useCallback, useEffect, useRef, useState } from "react";

export const PLAY_SPEEDS = {
  slow: 900,
  class: 520,
  fast: 220,
} as const;

export type PlaySpeed = keyof typeof PLAY_SPEEDS;

export function usePlayback(minIndex: number, maxIndex: number, initialIndex: number) {
  const clamp = useCallback(
    (value: number) => Math.min(maxIndex, Math.max(minIndex, value)),
    [maxIndex, minIndex],
  );

  const [index, setIndexState] = useState(() => clamp(initialIndex));
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaySpeed>("class");
  const indexRef = useRef(index);

  const clamped = clamp(index);
  if (clamped !== index) {
    setIndexState(clamped);
  }

  useEffect(() => {
    indexRef.current = clamped;
  }, [clamped]);

  const setIndex = useCallback(
    (value: number) => {
      setIndexState(clamp(value));
    },
    [clamp],
  );

  const step = useCallback(
    (delta: number) => {
      setIndexState((current) => clamp(current + delta));
    },
    [clamp],
  );

  const play = useCallback(() => setPlaying(true), []);
  const pause = useCallback(() => setPlaying(false), []);
  const toggle = useCallback(() => setPlaying((on) => !on), []);

  useEffect(() => {
    if (!playing) {
      return;
    }
    const id = window.setInterval(() => {
      const next = indexRef.current + 1;
      if (next > maxIndex) {
        setPlaying(false);
        setIndexState(maxIndex);
        return;
      }
      setIndexState(next);
    }, PLAY_SPEEDS[speed]);
    return () => window.clearInterval(id);
  }, [maxIndex, playing, speed]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA")) {
        return;
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
        setIndex(minIndex);
      } else if (event.key === "End") {
        event.preventDefault();
        pause();
        setIndex(maxIndex);
      } else if (event.key === "PageUp") {
        event.preventDefault();
        pause();
        step(5);
      } else if (event.key === "PageDown") {
        event.preventDefault();
        pause();
        step(-5);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [maxIndex, minIndex, pause, setIndex, step, toggle]);

  return {
    index: clamped,
    setIndex,
    playing,
    play,
    pause,
    toggle,
    speed,
    setSpeed,
    step,
    minIndex,
    maxIndex,
  };
}
