import { useState } from "react";
import { DIMENSIONS } from "../lib/content";

export function CompareView() {
  const [active, setActive] = useState(DIMENSIONS[0].id);
  const dimension = DIMENSIONS.find((item) => item.id === active) ?? DIMENSIONS[0];

  return (
    <div className="pane">
      <p className="lede">
        Tap a row. Read the three systems on that one question, then the Friedman or Sowell note under the columns.
      </p>
      <div className="chip-row" role="tablist" aria-label="Comparison topics">
        {DIMENSIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === dimension.id}
            className={`chip${item.id === dimension.id ? " is-on" : ""}`}
            onClick={() => setActive(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="compare-grid">
        <article className="col col-capitalism">
          <h2>Capitalism</h2>
          <p>{dimension.capitalism}</p>
        </article>
        <article className="col col-socialism">
          <h2>Socialism</h2>
          <p>{dimension.socialism}</p>
        </article>
        <article className="col col-communism">
          <h2>Communism</h2>
          <p>{dimension.communism}</p>
        </article>
      </div>

      <aside className="insight">
        <p className="thinker">{dimension.thinker}</p>
        <p>{dimension.insight}</p>
      </aside>

      <div className="table-wrap">
        <table>
          <caption>Full comparison — ownership through historical outcomes</caption>
          <thead>
            <tr>
              <th scope="col">Question</th>
              <th scope="col">Capitalism</th>
              <th scope="col">Socialism</th>
              <th scope="col">Communism</th>
            </tr>
          </thead>
          <tbody>
            {DIMENSIONS.map((item) => (
              <tr key={item.id} className={item.id === dimension.id ? "is-active" : undefined}>
                <th scope="row">
                  <button type="button" className="row-btn" onClick={() => setActive(item.id)}>
                    {item.label}
                  </button>
                </th>
                <td>{item.capitalism}</td>
                <td>{item.socialism}</td>
                <td>{item.communism}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
