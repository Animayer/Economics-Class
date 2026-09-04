import { DataNotes } from "./components/DataNotes";
import { EpisodeCallout } from "./components/EpisodeCallout";
import { GoodsBasket } from "./components/GoodsBasket";
import { PaycheckMode } from "./components/PaycheckMode";
import { PurchasingPower } from "./components/PurchasingPower";
import { YearControls } from "./components/YearControls";
import { useDataset } from "./hooks/useDataset";
import { usePlayback } from "./hooks/usePlayback";
import { indexByYear } from "./lib/inflation";

export default function App() {
  const { dataset, error, loading } = useDataset();
  const startYear = dataset?.meta.startYear ?? 1926;
  const endYear = dataset?.meta.endYear ?? 2026;
  const playback = usePlayback(startYear, endYear);

  if (loading) {
    return (
      <main className="shell">
        <div className="boot" role="status">
          Loading prices and CPI…
        </div>
      </main>
    );
  }

  if (error || !dataset) {
    return (
      <main className="shell">
        <div className="boot boot-error" role="alert">
          {error ?? "Data did not load."} Refresh the page or check that
          <code> data/dataset.json </code> is present.
        </div>
      </main>
    );
  }

  const cpiMap = indexByYear(dataset.cpi);
  const current = cpiMap.get(playback.year);
  const today = cpiMap.get(dataset.meta.displayYear);

  if (!current || !today) {
    return (
      <main className="shell">
        <div className="boot boot-error" role="alert">
          Missing CPI for {playback.year}.
        </div>
      </main>
    );
  }

  return (
    <div className="shell">
      <a className="skip" href="#year-slider">
        Skip to year slider
      </a>
      <header className="masthead">
        <p className="eyebrow">{dataset.meta.class}</p>
        <h1>{dataset.meta.title}</h1>
        <p className="lede">
          Scrub a century of U.S. prices. Watch what inflation does to a dollar,
          a paycheck, and a basket of everyday goods.
        </p>
      </header>

      <YearControls
        year={playback.year}
        startYear={startYear}
        endYear={endYear}
        playing={playback.playing}
        speed={playback.speed}
        episodes={dataset.episodes}
        onYear={playback.setYear}
        onToggle={playback.toggle}
        onStep={playback.step}
        onSpeed={playback.setSpeed}
        onPause={playback.pause}
      />

      <EpisodeCallout year={playback.year} episodes={dataset.episodes} />

      <PurchasingPower
        year={playback.year}
        current={current}
        today={today}
        meta={dataset.meta}
      />

      <GoodsBasket year={playback.year} goods={dataset.goods} />
      <PaycheckMode dataset={dataset} year={playback.year} />
      <DataNotes meta={dataset.meta} goods={dataset.goods} />

      <footer className="colophon">
        <p>
          Classroom simulation · no login · client-side only. CPI through{" "}
          {dataset.meta.latestThrough}.
        </p>
      </footer>
    </div>
  );
}
