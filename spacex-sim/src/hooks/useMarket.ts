import { useEffect, useMemo, useState } from "react";
import { loadBundled, mergeLive, tryLiveBars } from "../lib/market";
import { enrichBars } from "../lib/ta";
import { allSignals } from "../lib/signals";
import type { Dataset, EnrichedBar, SignalCard } from "../types";

export function useMarket() {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [liveTried, setLiveTried] = useState(false);
  const [usingLive, setUsingLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const bundled = await loadBundled();
        if (cancelled) {
          return;
        }
        setDataset(bundled);
        setLoading(false);
        const live = await tryLiveBars();
        if (cancelled || !live) {
          setLiveTried(true);
          return;
        }
        const merged = mergeLive(bundled, live);
        setDataset(merged);
        setUsingLive(merged.bars !== bundled.bars);
        setLiveTried(true);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load SPCX data.");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const bars: EnrichedBar[] = useMemo(
    () => (dataset ? enrichBars(dataset.bars) : []),
    [dataset],
  );
  const signals: SignalCard[] = useMemo(() => (bars.length ? allSignals(bars) : []), [bars]);

  return { dataset, bars, signals, error, loading, liveTried, usingLive };
}
