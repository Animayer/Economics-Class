import type { Mode, RouteState, SystemId } from "../types";

const MODES: readonly Mode[] = ["hub", "learn", "compare", "simulate", "examples", "quiz"];
const SYSTEMS: readonly SystemId[] = ["capitalism", "socialism", "communism"];

export const DEFAULT_ROUTE: RouteState = {
  mode: "hub",
  system: "capitalism",
};

function isMode(value: string | null): value is Mode {
  return value !== null && (MODES as readonly string[]).includes(value);
}

function isSystem(value: string | null): value is SystemId {
  return value !== null && (SYSTEMS as readonly string[]).includes(value);
}

export function parseSearch(search: string): RouteState {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const rawMode = params.get("mode");
  const rawSystem = params.get("system");
  return {
    mode: isMode(rawMode) ? rawMode : DEFAULT_ROUTE.mode,
    system: isSystem(rawSystem) ? rawSystem : DEFAULT_ROUTE.system,
  };
}

export function serializeSearch(state: RouteState): string {
  const params = new URLSearchParams();
  params.set("mode", state.mode);
  if (state.mode === "learn" || state.mode === "examples" || state.mode === "simulate") {
    params.set("system", state.system);
  }
  return `?${params.toString()}`;
}

export function writeSearch(state: RouteState): void {
  const next = serializeSearch(state);
  const url = `${window.location.pathname}${next}${window.location.hash}`;
  window.history.replaceState(state, "", url);
}
