import { describe, expect, it } from "vitest";
import {
  REFERENCE_ACTIONS,
  actionsFor,
  applyAction,
  buildDebrief,
  finalMetrics,
  startingMetrics,
} from "../lib/simulate";

describe("system simulation", () => {
  it("ranks market prices above planning on living standards, choice, and freedom", () => {
    const cap = finalMetrics("capitalism", REFERENCE_ACTIONS.capitalism);
    const soc = finalMetrics("socialism", REFERENCE_ACTIONS.socialism);
    const com = finalMetrics("communism", REFERENCE_ACTIONS.communism);

    expect(cap.living).toBeGreaterThan(soc.living);
    expect(soc.living).toBeGreaterThan(com.living);
    expect(cap.freedom).toBeGreaterThan(soc.freedom);
    expect(soc.freedom).toBeGreaterThan(com.freedom);
    expect(cap.choice).toBeGreaterThan(soc.choice);
    expect(soc.choice).toBeGreaterThan(com.choice);
    expect(cap.innovation).toBeGreaterThan(soc.innovation);
    expect(cap.shortage).toBeLessThan(soc.shortage);
    expect(soc.shortage).toBeLessThan(com.shortage);
    expect(com.equality).toBeGreaterThan(cap.equality);
    expect(com.output).toBeGreaterThan(90);
  });

  it("clears a shortage when an owner follows the high price", () => {
    const start = startingMetrics("capitalism");
    const step = applyAction("capitalism", 0, start, "follow-price");
    expect(step.after.shortage).toBeLessThan(start.shortage);
    expect(step.after.living).toBeGreaterThan(start.living);
    expect(step.after.personalProfit).toBeGreaterThan(start.personalProfit);
    expect(step.after.freedom).toBe(start.freedom);
  });

  it("treats a no-rivals license as crony profit, not a town gain", () => {
    const start = startingMetrics("capitalism");
    const crony = applyAction("capitalism", 0, start, "crony");
    const fair = applyAction("capitalism", 0, start, "follow-price");
    expect(crony.after.personalProfit).toBeGreaterThan(fair.after.personalProfit);
    expect(crony.after.freedom).toBeLessThan(fair.after.freedom);
    expect(crony.after.choice).toBeLessThan(start.choice);
    expect(crony.detail.toLowerCase()).toContain("crony");
  });

  it("lets a line bonus beat an even split on shortages", () => {
    const start = startingMetrics("socialism");
    const bonus = applyAction("socialism", 0, start, "line-bonus");
    const even = applyAction("socialism", 0, start, "even-split");
    expect(bonus.after.shortage).toBeLessThan(even.after.shortage);
    expect(even.after.equality).toBeGreaterThan(start.equality);
  });

  it("can raise command output while the household shortage gets worse", () => {
    const start = startingMetrics("communism");
    const step = applyAction("communism", 1, start, "work-extra");
    expect(step.after.output).toBeGreaterThan(start.output);
    expect(step.after.shortage).toBeGreaterThan(start.shortage);
    expect(step.after.living).toBeLessThanOrEqual(start.living);
  });

  it("does not raise the ration when a household coasts or asks for a swap", () => {
    const start = startingMetrics("communism");
    const coast = applyAction("communism", 0, start, "do-minimum");
    const swap = applyAction("communism", 0, start, "ask-swap");
    expect(coast.after.living).toBeLessThan(start.living);
    expect(coast.detail.toLowerCase()).toContain("ration");
    expect(swap.after.choice).toBe(start.choice);
    expect(swap.after.freedom).toBe(start.freedom);
  });

  it("rejects an action from the wrong system", () => {
    expect(() => applyAction("communism", 0, startingMetrics("communism"), "crony")).toThrow();
    expect(actionsFor("capitalism")).toContain("follow-price");
    expect(actionsFor("socialism")).not.toContain("crony");
  });

  it("names Friedman and Sowell in every debrief", () => {
    for (const system of ["capitalism", "socialism", "communism"] as const) {
      const text = buildDebrief(system, REFERENCE_ACTIONS[system]).paragraphs.join(" ");
      expect(text).toContain("Friedman");
      expect(text).toContain("Sowell");
    }
    const crony = buildDebrief("capitalism", ["crony", "crony", "crony", "crony", "crony"]);
    expect(crony.paragraphs.join(" ").toLowerCase()).toContain("crony");
  });
});
