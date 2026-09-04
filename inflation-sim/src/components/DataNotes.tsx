import type { DatasetMeta, Good } from "../types";

export function DataNotes({ meta, goods }: { meta: DatasetMeta; goods: Good[] }) {
  return (
    <details className="notes">
      <summary>Data notes &amp; estimates</summary>
      <div className="notes-body">
        <p>
          <strong>CPI:</strong> {meta.cpiSeries}. Source: {meta.cpiSource}. Official
          index base is <strong>{meta.cpiBase}</strong>. Last complete year is{" "}
          {meta.latestCompleteYear}. {meta.latestNote}
        </p>
        <ul>
          {goods.map((good) => (
            <li key={good.id}>
              <strong>{good.name}.</strong> {good.notes}
            </li>
          ))}
        </ul>
        <p>
          Full citations live in <code>SOURCES.md</code>. Regenerating the JSON:{" "}
          <code>python3 scripts/build-data.py</code>.
        </p>
      </div>
    </details>
  );
}
