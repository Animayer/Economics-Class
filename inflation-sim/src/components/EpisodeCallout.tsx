import type { Episode } from "../types";

export function EpisodeCallout({ year, episodes }: { year: number; episodes: Episode[] }) {
  const active = episodes.filter((episode) => year >= episode.start && year <= episode.end);

  if (active.length === 0) {
    return (
      <aside className="callout is-idle" aria-live="polite">
        <p className="callout-kicker">Teaching cue</p>
        <h2>Scrub or press Play</h2>
        <p>
          Markers on the slider flag major inflation episodes. Nothing partisan — just
          what prices and the CPI did.
        </p>
      </aside>
    );
  }

  return (
    <div className="callout-stack" aria-live="polite">
      {active.map((episode) => (
        <aside key={episode.id} className="callout">
          <p className="callout-kicker">
            {episode.label} · {episode.start}–{episode.end}
          </p>
          <h2>{episode.headline}</h2>
          <p>{episode.cue}</p>
        </aside>
      ))}
    </div>
  );
}
