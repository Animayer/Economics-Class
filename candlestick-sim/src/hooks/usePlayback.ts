import { useCallback, useEffect, useState } from "react";

export function usePlayback(total: number, startVisible: number, resetKey: string) {
  const [visible, setVisible] = useState(startVisible);
  const [playing, setPlaying] = useState(false);
  const signature = `${resetKey}:${startVisible}:${total}`;
  const [seen, setSeen] = useState(signature);

  if (seen !== signature) {
    setSeen(signature);
    setVisible(startVisible);
    setPlaying(false);
  } else if (playing && visible >= total) {
    setPlaying(false);
  }

  useEffect(() => {
    if (!playing || visible >= total) return;
    const timer = window.setTimeout(() => {
      setVisible((current) => Math.min(total, current + 1));
    }, 520);
    return () => window.clearTimeout(timer);
  }, [playing, total, visible]);

  const step = useCallback(
    (dir: 1 | -1) => {
      setPlaying(false);
      setVisible((current) => Math.min(total, Math.max(1, current + dir)));
    },
    [total],
  );

  const replay = useCallback(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPlaying(false);
      setVisible(total);
      return;
    }
    setVisible(0);
    setPlaying(true);
  }, [total]);

  const showAll = useCallback(() => {
    setPlaying(false);
    setVisible(total);
  }, [total]);

  const jump = useCallback(
    (count: number) => {
      setPlaying(false);
      setVisible(Math.min(total, Math.max(1, count)));
    },
    [total],
  );

  return { visible, playing, step, replay, showAll, jump };
}

export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
}

/** Skip global shortcuts when the key would also activate a focused control. */
export function blockShortcut(event: KeyboardEvent): boolean {
  if (event.metaKey || event.ctrlKey || event.altKey) return true;
  if (isTypingTarget(event.target)) return true;
  if (
    (event.key === " " || event.key === "Enter") &&
    event.target instanceof HTMLElement &&
    (event.target.tagName === "BUTTON" || event.target.tagName === "A")
  ) {
    return true;
  }
  return false;
}
