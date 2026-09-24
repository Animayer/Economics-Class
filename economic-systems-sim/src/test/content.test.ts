import { describe, expect, it } from "vitest";
import { CLASS_RULE, DIMENSIONS, EXAMPLES, MIXED_NOTE, SYSTEMS, isUnlocked } from "../lib/content";
import { QUIZ } from "../lib/quiz";
import { parseSearch, serializeSearch } from "../lib/routing";

describe("lesson content", () => {
  it("teaches three systems with Friedman or Sowell on every understanding", () => {
    expect(SYSTEMS.map((item) => item.id)).toEqual(["capitalism", "socialism", "communism"]);
    for (const system of SYSTEMS) {
      expect(system.understandings.length).toBeGreaterThanOrEqual(3);
      expect(system.understandings.length).toBeLessThanOrEqual(5);
      expect(system.checks).toHaveLength(2);
      for (const card of system.understandings) {
        expect(["Friedman", "Sowell"]).toContain(card.thinker);
        expect(card.body.length).toBeGreaterThan(40);
      }
      for (const check of system.checks) {
        expect(check.options).toHaveLength(4);
        expect(check.correctIndex).toBeGreaterThanOrEqual(0);
        expect(check.correctIndex).toBeLessThan(4);
      }
    }
  });

  it("keeps crony privilege out of the definition of free enterprise", () => {
    const blob = `${CLASS_RULE} ${SYSTEMS.map((item) => item.definition).join(" ")}`.toLowerCase();
    expect(blob).toContain("crony");
    expect(blob).toContain("not free enterprise");
  });

  it("does not call Denmark a command socialist country", () => {
    const nordic = EXAMPLES.socialism.map((card) => card.body).join(" ");
    expect(nordic).toMatch(/Denmark/);
    expect(nordic.toLowerCase()).toContain("not command socialism");
    expect(nordic.toLowerCase()).not.toContain("denmark is socialist");
    expect(MIXED_NOTE.toLowerCase()).toContain("mixed");
  });

  it("names the human cost of command systems without relabeling Denmark", () => {
    const socialism = SYSTEMS.find((item) => item.id === "socialism");
    const communism = SYSTEMS.find((item) => item.id === "communism");
    const socBlob = `${socialism?.understandings.map((card) => card.body).join(" ")} ${socialism?.tradeoffs.join(" ")}`;
    const comBlob = `${communism?.understandings.map((card) => card.body).join(" ")} ${communism?.tradeoffs.join(" ")}`;
    expect(socBlob).toContain("Holodomor");
    expect(socBlob.toLowerCase()).toContain("connections");
    expect(comBlob).toContain("Gulag");
    expect(comBlob.toLowerCase()).toContain("secret police");
    expect(comBlob.toLowerCase()).toContain("closed borders");
    const dangerCards = [EXAMPLES.socialism[2], EXAMPLES.communism[0], EXAMPLES.communism[1], EXAMPLES.communism[2]];
    for (const card of dangerCards) {
      expect(card.body).toContain("Why this is dangerous");
    }
    expect(EXAMPLES.socialism.map((card) => card.body).join(" ")).toContain("not command socialism");
  });

  it("pairs the Koreas and labels modern China as mixed", () => {
    const modern = [...EXAMPLES.capitalism, ...EXAMPLES.communism].map((card) => card.body).join(" ");
    expect(modern).toContain("South Korea");
    expect(modern).toContain("North Korea");
    expect(modern.toLowerCase()).toContain("not textbook communism");
    expect(modern).toContain("1978");
  });

  it("compares the required dimensions", () => {
    expect(DIMENSIONS.map((item) => item.id)).toEqual([
      "ownership",
      "prices",
      "incentives",
      "innovation",
      "power",
      "inequality",
      "outcomes",
    ]);
  });

  it("unlocks the next module only after the previous check", () => {
    expect(isUnlocked("capitalism", [], false)).toBe(true);
    expect(isUnlocked("socialism", [], false)).toBe(false);
    expect(isUnlocked("socialism", ["capitalism"], false)).toBe(true);
    expect(isUnlocked("communism", ["capitalism"], false)).toBe(false);
    expect(isUnlocked("communism", ["socialism"], false)).toBe(true);
    expect(isUnlocked("communism", [], true)).toBe(true);
  });
});

describe("quiz and routes", () => {
  it("has 8–12 scored questions with one correct choice each", () => {
    expect(QUIZ.length).toBeGreaterThanOrEqual(8);
    expect(QUIZ.length).toBeLessThanOrEqual(15);
    expect(QUIZ.some((item) => item.kind === "scenario")).toBe(true);
    for (const question of QUIZ) {
      expect(question.options.length).toBeGreaterThanOrEqual(3);
      expect(question.why.length).toBeGreaterThan(20);
      expect(new Set(question.options).size).toBe(question.options.length);
    }
    const ids = QUIZ.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(
      expect.arrayContaining(["crony", "denmark", "korea", "knowledge", "china-now", "no-exit", "famine-outcome", "political-allocation"]),
    );
  });

  it("reads lesson links and ignores junk", () => {
    expect(parseSearch("?mode=learn&system=socialism")).toEqual({
      mode: "learn",
      system: "socialism",
    });
    expect(parseSearch("?mode=nope&system=mars")).toEqual({ mode: "hub", system: "capitalism" });
    expect(serializeSearch({ mode: "quiz", system: "communism" })).toBe("?mode=quiz");
    expect(serializeSearch({ mode: "examples", system: "communism" })).toBe(
      "?mode=examples&system=communism",
    );
  });
});
