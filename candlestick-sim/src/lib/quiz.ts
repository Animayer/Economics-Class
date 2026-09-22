import type { PatternId } from "./patterns";

export type QuizQuestion = {
  seed: number;
  answer: PatternId;
  options: PatternId[];
};

const LOOKALIKES: Record<PatternId, PatternId[]> = {
  "bullish-engulfing": ["bearish-engulfing", "morning-star", "bullish-marubozu"],
  "bearish-engulfing": ["bullish-engulfing", "evening-star", "bearish-marubozu"],
  hammer: ["hanging-man", "dragonfly", "shooting-star"],
  "hanging-man": ["hammer", "shooting-star", "gravestone"],
  doji: ["spinning-top", "dragonfly", "gravestone"],
  dragonfly: ["hammer", "doji", "gravestone"],
  gravestone: ["shooting-star", "doji", "dragonfly"],
  "shooting-star": ["gravestone", "hanging-man", "hammer"],
  "spinning-top": ["doji", "hammer", "shooting-star"],
  "bullish-marubozu": ["bearish-marubozu", "bullish-engulfing", "morning-star"],
  "bearish-marubozu": ["bullish-marubozu", "bearish-engulfing", "evening-star"],
  "morning-star": ["evening-star", "bullish-engulfing", "hammer"],
  "evening-star": ["morning-star", "bearish-engulfing", "shooting-star"],
};

/** Deterministic 0–1 generator. Same seed, same sequence. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const swap = copy[i] as T;
    copy[i] = copy[j] as T;
    copy[j] = swap;
  }
  return copy;
}

/**
 * Four-choice question. The answer is always one of the options.
 * Look-alike names are preferred as wrong answers so the class has to use context.
 * Pass `avoid` to skip an immediate repeat when the pool is larger than one.
 */
export function buildQuizQuestion(
  seed: number,
  pool: PatternId[],
  avoid?: PatternId,
): QuizQuestion {
  if (pool.length === 0) {
    throw new Error("Quiz pool is empty");
  }
  const rng = mulberry32(seed);
  let choices = pool;
  if (avoid && pool.length > 1) {
    const filtered = pool.filter((id) => id !== avoid);
    if (filtered.length > 0) choices = filtered;
  }
  const answer = choices[Math.floor(rng() * choices.length)] as PatternId;
  const look = LOOKALIKES[answer].filter((id) => pool.includes(id) && id !== answer);
  const rest = shuffle(
    pool.filter((id) => id !== answer && !look.includes(id)),
    rng,
  );
  const distractors: PatternId[] = [];
  for (const id of [...look, ...rest]) {
    if (distractors.length === 3) break;
    if (!distractors.includes(id)) distractors.push(id);
  }
  const options = shuffle([answer, ...distractors], rng);
  return { seed, answer, options };
}
