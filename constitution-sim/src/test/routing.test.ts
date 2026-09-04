import { describe, expect, it } from "vitest";
import { DEFAULT_ROUTE, parseSearch, serializeSearch } from "../lib/routing";

describe("parseSearch", () => {
  it("defaults to branches", () => {
    expect(parseSearch("")).toMatchObject({ mode: "branches", amendment: null });
  });

  it("reads mode and deep links", () => {
    expect(parseSearch("?mode=rights&amendment=1")).toEqual({
      mode: "rights",
      branch: null,
      check: null,
      amendment: 1,
      scenario: 1,
    });
    expect(parseSearch("?mode=branches&branch=judicial&check=review").branch).toBe(
      "judicial",
    );
    expect(parseSearch("?mode=scenarios&scenario=4").scenario).toBe(4);
  });

  it("treats a bare amendment param as rights mode", () => {
    expect(parseSearch("?amendment=8").mode).toBe("rights");
    expect(parseSearch("?amendment=8").amendment).toBe(8);
  });

  it("ignores out-of-range values", () => {
    expect(parseSearch("?mode=bananas&amendment=99&scenario=99")).toEqual({
      ...DEFAULT_ROUTE,
      scenario: 1,
    });
  });
});

describe("serializeSearch", () => {
  it("round-trips a rights deep link", () => {
    const state = parseSearch("?mode=rights&amendment=1");
    expect(serializeSearch(state)).toBe("?mode=rights&amendment=1");
  });

  it("omits default scenario 1", () => {
    expect(
      serializeSearch({
        mode: "scenarios",
        branch: null,
        check: null,
        amendment: null,
        scenario: 1,
      }),
    ).toBe("?mode=scenarios");
  });
});
