import { useCallback, useEffect, useState } from "react";
import { loadProgress, saveProgress, type Progress, type SimSnapshot } from "../lib/progress";
import type { SystemId } from "../types";

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const passSystem = useCallback((id: SystemId) => {
    setProgress((prev) =>
      prev.passed.includes(id) ? prev : { ...prev, passed: [...prev.passed, id] },
    );
  }, []);

  const setTeacherOpen = useCallback((teacherOpen: boolean) => {
    setProgress((prev) => ({ ...prev, teacherOpen }));
  }, []);

  const recordQuiz = useCallback((score: number) => {
    setProgress((prev) => ({
      ...prev,
      quizBest: prev.quizBest === null ? score : Math.max(prev.quizBest, score),
    }));
  }, []);

  const recordSim = useCallback((snapshot: SimSnapshot) => {
    setProgress((prev) => ({ ...prev, simRuns: [...prev.simRuns, snapshot].slice(-6) }));
  }, []);

  return { progress, passSystem, setTeacherOpen, recordQuiz, recordSim };
}
