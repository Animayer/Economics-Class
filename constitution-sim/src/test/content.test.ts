import { describe, expect, it } from "vitest";
import {
  AMENDMENTS,
  BRANCHES,
  CHECKS,
  ROMAN,
  SCENARIOS,
  isCorrect,
} from "../lib/content";

describe("Bill of Rights content", () => {
  it("includes amendments 1–10 with matching Roman numerals", () => {
    expect(AMENDMENTS.map((a) => a.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(AMENDMENTS.map((a) => a.roman)).toEqual([...ROMAN]);
  });

  it("states all five First Amendment freedoms in the card", () => {
    const first = AMENDMENTS[0];
    const blob = `${first.title} ${first.subtitle} ${first.gist} ${first.protects.join(" ")}`.toLowerCase();
    for (const word of ["speech", "press", "religion", "assembly", "petition"]) {
      expect(blob).toContain(word);
    }
  });

  it("keeps Amendment X about reserved / state powers", () => {
    const tenth = AMENDMENTS[9];
    const blob = `${tenth.gist} ${tenth.protects.join(" ")}`.toLowerCase();
    expect(blob).toMatch(/reserv/);
    expect(blob).toContain("states");
  });
});

describe("branches and checks", () => {
  it("covers the three articles", () => {
    expect(BRANCHES.map((b) => b.id)).toEqual([
      "legislative",
      "executive",
      "judicial",
    ]);
    expect(BRANCHES.map((b) => b.article)).toEqual([
      "Article I",
      "Article II",
      "Article III",
    ]);
  });

  it("names the major high-school checks", () => {
    const labels = CHECKS.map((c) => c.id);
    for (const id of [
      "veto",
      "override",
      "appointments",
      "review",
      "impeach",
      "purse",
      "war",
      "treaties",
    ]) {
      expect(labels).toContain(id);
    }
  });

  it("describes Congress as bicameral", () => {
    const text = BRANCHES[0].who.toLowerCase();
    expect(text).toContain("bicameral");
    expect(text).toContain("two-house");
  });
});

describe("scenarios", () => {
  it("has 8–12 classroom items with unique ids", () => {
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(8);
    expect(SCENARIOS.length).toBeLessThanOrEqual(12);
    expect(new Set(SCENARIOS.map((s) => s.id)).size).toBe(SCENARIOS.length);
  });

  it("mixes rights and branch/check questions", () => {
    expect(SCENARIOS.some((s) => s.kind === "amendment")).toBe(true);
    expect(SCENARIOS.some((s) => s.kind === "choice")).toBe(true);
  });

  it("grades amendment taps and multiple choice correctly", () => {
    const speech = SCENARIOS.find((s) => s.id === "armbands");
    const war = SCENARIOS.find((s) => s.id === "war");
    expect(speech?.kind).toBe("amendment");
    expect(war?.kind).toBe("choice");
    if (speech?.kind === "amendment") {
      expect(isCorrect(speech, 1)).toBe(true);
      expect(isCorrect(speech, 4)).toBe(false);
    }
    if (war?.kind === "choice") {
      expect(isCorrect(war, "Congress")).toBe(true);
      expect(isCorrect(war, "The Cabinet")).toBe(false);
    }
  });
});
