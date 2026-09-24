import type { SystemId } from "../types";

export type SimSnapshot = {
  system: SystemId;
  living: number;
  shortage: number;
  freedom: number;
  choice: number;
};

export type Progress = {
  passed: SystemId[];
  teacherOpen: boolean;
  quizBest: number | null;
  simRuns: SimSnapshot[];
};

export const EMPTY_PROGRESS: Progress = {
  passed: [],
  teacherOpen: false,
  quizBest: null,
  simRuns: [],
};

const KEY = "bchs-econ-systems-v1";

function isSystem(value: unknown): value is SystemId {
  return value === "capitalism" || value === "socialism" || value === "communism";
}

export function sanitizeProgress(raw: unknown): Progress {
  if (!raw || typeof raw !== "object") return { ...EMPTY_PROGRESS };
  const record = raw as Partial<Progress>;
  const passed = Array.isArray(record.passed) ? record.passed.filter(isSystem) : [];
  const simRuns = Array.isArray(record.simRuns)
    ? record.simRuns.filter((item): item is SimSnapshot => {
        if (!item || typeof item !== "object") return false;
        const row = item as SimSnapshot;
        return (
          isSystem(row.system) &&
          typeof row.living === "number" &&
          typeof row.shortage === "number" &&
          typeof row.freedom === "number" &&
          typeof row.choice === "number"
        );
      })
    : [];
  return {
    passed: [...new Set(passed)],
    teacherOpen: record.teacherOpen === true,
    quizBest: typeof record.quizBest === "number" ? record.quizBest : null,
    simRuns: simRuns.slice(-6),
  };
}

export function loadProgress(): Progress {
  if (typeof localStorage === "undefined") return { ...EMPTY_PROGRESS };
  try {
    return sanitizeProgress(JSON.parse(localStorage.getItem(KEY) ?? "null"));
  } catch {
    return { ...EMPTY_PROGRESS };
  }
}

export function saveProgress(progress: Progress): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(progress));
}
