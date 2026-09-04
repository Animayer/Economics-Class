import { useEffect, useState } from "react";
import type { Dataset } from "../types";

export function useDataset() {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("./data/dataset.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Could not load prices (${response.status})`);
        }
        return response.json() as Promise<Dataset>;
      })
      .then((data) => {
        if (!cancelled) {
          setDataset(data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load data");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { dataset, error, loading: !dataset && !error };
}
