import { useMemo, useState } from "react";
import { compactNumber, money } from "../lib/format";
import { findGood, priceAtYear, unitsAffordable } from "../lib/lookup";
import type { Dataset } from "../types";

const PRESETS = [
  { id: "1926", freezeYear: 1926, amount: 5, period: "day" as const, label: "1926 · $5 / day" },
  { id: "1950", freezeYear: 1950, amount: 0.75, period: "hour" as const, label: "1950 · $0.75 / hr min. wage" },
  { id: "1970", freezeYear: 1970, amount: 1.6, period: "hour" as const, label: "1970 · $1.60 / hr min. wage" },
  { id: "1980", freezeYear: 1980, amount: 3.1, period: "hour" as const, label: "1980 · $3.10 / hr min. wage" },
];

const DECADES = [1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2026];

function hoursInPeriod(period: "hour" | "day" | "week"): number {
  if (period === "hour") return 1;
  if (period === "day") return 8;
  return 40;
}

export function PaycheckMode({ dataset, year }: { dataset: Dataset; year: number }) {
  const [presetId, setPresetId] = useState("1950");
  const [customYear, setCustomYear] = useState(1950);
  const [customAmount, setCustomAmount] = useState(0.75);
  const [customPeriod, setCustomPeriod] = useState<"hour" | "day" | "week">("hour");

  const preset = PRESETS.find((item) => item.id === presetId);
  const freezeYear = preset ? preset.freezeYear : customYear;
  const amount = preset ? preset.amount : customAmount;
  const period = preset ? preset.period : customPeriod;
  const paycheck = amount * hoursInPeriod(period);

  const gas = findGood(dataset, "gas");
  const movie = findGood(dataset, "movie");
  const bread = findGood(dataset, "bread");
  const coffee = findGood(dataset, "coffee");
  const milk = findGood(dataset, "milk");

  const now = useMemo(() => {
    if (!gas || !movie || !bread) {
      return null;
    }
    const gasNow = priceAtYear(gas, year).price;
    const movieNow = priceAtYear(movie, year).price;
    const breadNow = priceAtYear(bread, year).price;
    const gasThen = priceAtYear(gas, freezeYear).price;
    return {
      gas: unitsAffordable(paycheck, gasNow),
      movie: unitsAffordable(paycheck, movieNow),
      bread: unitsAffordable(paycheck, breadNow),
      gasThen: unitsAffordable(paycheck, gasThen),
    };
  }, [bread, freezeYear, gas, movie, paycheck, year]);

  return (
    <section className="paycheck" aria-label="Fixed paycheck mode">
      <header className="section-head">
        <h2>Fixed-paycheck mode</h2>
        <p>
          Freeze a wage in an early year. The dollar amount never changes — only prices do.
        </p>
      </header>

      <div className="paycheck-controls">
        <label>
          Preset
          <select
            value={presetId}
            onChange={(event) => setPresetId(event.target.value)}
          >
            {PRESETS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
            <option value="custom">Custom freeze…</option>
          </select>
        </label>
        {presetId === "custom" && (
          <>
            <label>
              Frozen in
              <input
                type="number"
                min={dataset.meta.startYear}
                max={dataset.meta.endYear}
                value={customYear}
                onChange={(event) => setCustomYear(Number(event.target.value))}
              />
            </label>
            <label>
              Amount ($)
              <input
                type="number"
                min={0}
                step={0.05}
                value={customAmount}
                onChange={(event) => setCustomAmount(Number(event.target.value))}
              />
            </label>
            <label>
              Per
              <select
                value={customPeriod}
                onChange={(event) => setCustomPeriod(event.target.value as "hour" | "day" | "week")}
              >
                <option value="hour">hour</option>
                <option value="day">day (×8)</option>
                <option value="week">week (×40)</option>
              </select>
            </label>
          </>
        )}
      </div>

      <p className="paycheck-summary">
        A paycheck of <strong>{money(paycheck, "fine")}</strong> per {period === "hour" ? "hour" : period}
        {period !== "hour" ? ` (${money(amount, "fine")} × ${hoursInPeriod(period)} hours)` : ""}{" "}
        frozen in <strong>{freezeYear}</strong>{" "}
        {now?.gas != null && now.gasThen != null ? (
          <>
            buys about <strong>{compactNumber(now.gas)}</strong> gallons of gas in {year}
            {freezeYear !== year ? (
              <>
                {" "}
                — it bought <strong>{compactNumber(now.gasThen)}</strong> gallons in {freezeYear}.
              </>
            ) : (
              "."
            )}
          </>
        ) : (
          "."
        )}
      </p>

      <div className="table-wrap" role="region" aria-label="Decade purchasing power">
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Gas (gal)</th>
              <th>Movies</th>
              <th>Bread (lb)</th>
              <th>Milk (gal)</th>
              <th>Coffee (lb)</th>
            </tr>
          </thead>
          <tbody>
            {DECADES.filter((decade) => decade >= freezeYear).map((decade) => {
              const cells = [
                gas ? unitsAffordable(paycheck, priceAtYear(gas, decade).price) : null,
                movie ? unitsAffordable(paycheck, priceAtYear(movie, decade).price) : null,
                bread ? unitsAffordable(paycheck, priceAtYear(bread, decade).price) : null,
                milk ? unitsAffordable(paycheck, priceAtYear(milk, decade).price) : null,
                coffee ? unitsAffordable(paycheck, priceAtYear(coffee, decade).price) : null,
              ];
              return (
                <tr key={decade} className={decade === year ? "is-now" : undefined}>
                  <th scope="row">{decade}</th>
                  {cells.map((value, index) => (
                    <td key={index}>{value == null ? "—" : compactNumber(value)}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
