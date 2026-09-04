import type { BranchId, CheckId, Mode, RouteState } from "../types";

const MODES: readonly Mode[] = ["branches", "rights", "scenarios"];
const BRANCHES: readonly BranchId[] = [
  "legislative",
  "executive",
  "judicial",
];
const CHECKS: readonly CheckId[] = [
  "veto",
  "override",
  "appointments",
  "review",
  "impeach",
  "purse",
  "war",
  "treaties",
];

export const DEFAULT_ROUTE: RouteState = {
  mode: "branches",
  branch: null,
  check: null,
  amendment: null,
  scenario: 1,
};

function isMode(value: string | null): value is Mode {
  return value !== null && (MODES as readonly string[]).includes(value);
}

function isBranch(value: string | null): value is BranchId {
  return value !== null && (BRANCHES as readonly string[]).includes(value);
}

function isCheck(value: string | null): value is CheckId {
  return value !== null && (CHECKS as readonly string[]).includes(value);
}

function parseIntInRange(
  value: string | null,
  min: number,
  max: number,
): number | null {
  if (value === null || value === "") return null;
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n < min || n > max) return null;
  return n;
}

export function parseSearch(
  search: string,
  scenarioCount = 12,
): RouteState {
  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  const amendment = parseIntInRange(params.get("amendment"), 1, 10);
  const rawMode = params.get("mode");
  const mode: Mode = isMode(rawMode)
    ? rawMode
    : amendment
      ? "rights"
      : DEFAULT_ROUTE.mode;

  const scenario =
    parseIntInRange(params.get("scenario"), 1, scenarioCount) ?? 1;
  const branchParam = params.get("branch");
  const checkParam = params.get("check");

  return {
    mode,
    branch: mode === "branches" && isBranch(branchParam) ? branchParam : null,
    check: mode === "branches" && isCheck(checkParam) ? checkParam : null,
    amendment: mode === "rights" ? amendment : null,
    scenario: mode === "scenarios" ? scenario : 1,
  };
}

export function serializeSearch(state: RouteState): string {
  const params = new URLSearchParams();
  params.set("mode", state.mode);
  if (state.mode === "branches") {
    if (state.branch) params.set("branch", state.branch);
    if (state.check) params.set("check", state.check);
  }
  if (state.mode === "rights" && state.amendment) {
    params.set("amendment", String(state.amendment));
  }
  if (state.mode === "scenarios" && state.scenario > 1) {
    params.set("scenario", String(state.scenario));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "?mode=branches";
}

export function writeSearch(state: RouteState): void {
  const next = serializeSearch(state);
  const url = `${window.location.pathname}${next}${window.location.hash}`;
  window.history.replaceState(state, "", url);
}
