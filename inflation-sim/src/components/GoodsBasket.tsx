import { Icon } from "./Icon";
import { money, qualityLabel } from "../lib/format";
import { priceAtYear } from "../lib/lookup";
import type { Good } from "../types";

export function GoodsBasket({ year, goods }: { year: number; goods: Good[] }) {
  return (
    <section className="basket" aria-label="Goods basket">
      <header className="section-head">
        <h2>Everyday prices in {year}</h2>
        <p>Nominal U.S. dollars that year. Badges mark official series vs estimates.</p>
      </header>
      <ul className="card-grid">
        {goods.map((good) => {
          const resolved = priceAtYear(good, year);
          const missing = resolved.price == null;
          const unit =
            good.id === "house" && year >= 1963
              ? "median sales price of houses sold"
              : good.id === "house" && year >= 1940
                ? "median owner-occupied home value (Census)"
                : good.unit;
          return (
            <li key={good.id} className={`price-card${missing ? " is-missing" : ""}`}>
              <div className="card-top">
                <Icon name={good.icon} />
                <div>
                  <h3>{good.name}</h3>
                  <p className="unit">{unit}</p>
                </div>
              </div>
              <p className="price" aria-live="polite">
                {missing ? "—" : money(resolved.price ?? 0, good.id === "house" || good.id === "car" ? "auto" : "fine")}
              </p>
              {missing ? (
                <p className="missing-reason">{resolved.reason}</p>
              ) : (
                <p className={`badge badge-${resolved.quality ?? "official"}`}>
                  {qualityLabel(resolved.quality)}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
