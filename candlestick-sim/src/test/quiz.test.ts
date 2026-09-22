import { describe, expect, it } from "vitest";
import { PATTERNS, type PatternId } from "../lib/patterns";
import { buildQuizQuestion } from "../lib/quiz";

const beginner = PATTERNS.filter((p) => !p.advanced).map((p) => p.id);
const all = PATTERNS.map((p) => p.id);

describe("quiz questions", () => {
  it("always includes the answer once among four choices", () => {
    for (let seed = 1; seed <= 40; seed += 1) {
      const question = buildQuizQuestion(seed, beginner);
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.options).toContain(question.answer);
      expect(beginner).toContain(question.answer);
    }
  });

  it("is deterministic for a seed and can avoid an immediate repeat", () => {
    expect(buildQuizQuestion(7, all)).toEqual(buildQuizQuestion(7, all));
    const first = buildQuizQuestion(3, beginner);
    const next = buildQuizQuestion(4, beginner, first.answer);
    expect(next.answer).not.toBe(first.answer);
  });

  it("can build a question from the advanced pool", () => {
    const stars: PatternId[] = ["morning-star", "evening-star", "hammer", "doji"];
    const question = buildQuizQuestion(11, stars);
    expect(question.options.length).toBeGreaterThanOrEqual(4);
    expect(stars).toContain(question.answer);
  });
});
