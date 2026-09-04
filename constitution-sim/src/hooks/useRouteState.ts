import { useCallback, useEffect, useState } from "react";
import { SCENARIOS } from "../lib/content";
import { parseSearch, writeSearch } from "../lib/routing";
import type { RouteState } from "../types";

export function useRouteState() {
  const [route, setRoute] = useState<RouteState>(() =>
    parseSearch(
      typeof window === "undefined" ? "" : window.location.search,
      SCENARIOS.length,
    ),
  );

  useEffect(() => {
    writeSearch(route);
  }, [route]);

  useEffect(() => {
    const onPop = () => {
      setRoute(parseSearch(window.location.search, SCENARIOS.length));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const patch = useCallback((partial: Partial<RouteState>) => {
    setRoute((prev) => ({ ...prev, ...partial }));
  }, []);

  return { route, setRoute, patch };
}
