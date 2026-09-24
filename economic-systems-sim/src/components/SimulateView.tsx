import { useEffect, useState } from "react";
import { MetricBars } from "./MetricBars";
import {
  actionChoices,
  applyAction,
  buildDebrief,
  finalMetrics,
  REFERENCE_ACTIONS,
  ROUND_COUNT,
  runPath,
  situation,
  startingMetrics,
  type StepResult,
} from "../lib/simulate";
import type { SimSnapshot } from "../lib/progress";
import type { SimAction, SystemId } from "../types";

const NAMES: Record<SystemId, string> = {
  capitalism: "Capitalism",
  socialism: "Socialism",
  communism: "Communism",
};

const ROLES: Record<SystemId, string> = {
  capitalism:
    "You own a small firm in Creekville. Follow prices, ignore them, bet on a new radio, or chase a no-rivals license. The town’s living standard is scored apart from your pocket.",
  socialism:
    "You sit on the planning board. Major firms are public. You get a stale report, not a live price. A bonus can use the line people can see. It still is not a market.",
  communism:
    "You are a household. The plan owns production and assigns bread again. You can work harder, coast, ask for a swap, or file an idea. You cannot open a shop.",
};

export function SimulateView({
  system,
  onSystem,
  onRecord,
}: {
  system: SystemId;
  onSystem: (id: SystemId) => void;
  onRecord: (snapshot: SimSnapshot) => void;
}) {
  const [phase, setPhase] = useState<"pick" | "play" | "debrief">("pick");
  const [round, setRound] = useState(0);
  const [pending, setPending] = useState<StepResult | null>(null);
  const [actions, setActions] = useState<SimAction[]>([]);
  const [metrics, setMetrics] = useState(() => startingMetrics(system));

  const resetTo = (next: SystemId) => {
    onSystem(next);
    setPhase("pick");
    setRound(0);
    setPending(null);
    setActions([]);
    setMetrics(startingMetrics(next));
  };

  useEffect(() => {
    if (phase !== "play" || pending) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      const index = Number(event.key) - 1;
      const choices = actionChoices(system, round);
      if (index >= 0 && index < choices.length) {
        event.preventDefault();
        const step = applyAction(system, round, metrics, choices[index].id);
        setPending(step);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [metrics, pending, phase, round, system]);

  const start = () => {
    setMetrics(startingMetrics(system));
    setActions([]);
    setRound(0);
    setPending(null);
    setPhase("play");
  };

  const commit = () => {
    if (!pending) return;
    const nextActions = [...actions, pending.action];
    setActions(nextActions);
    setMetrics(pending.after);
    setPending(null);
    if (round + 1 >= ROUND_COUNT) {
      const end = finalMetrics(system, nextActions);
      onRecord({
        system,
        living: end.living,
        shortage: end.shortage,
        freedom: end.freedom,
        choice: end.choice,
      });
      setPhase("debrief");
      return;
    }
    setRound((n) => n + 1);
  };

  if (phase === "pick") {
    return (
      <div className="pane">
        <p className="lede">Pick a system and play five rounds. The numbers move because of your decisions.</p>
        <div className="hub-grid three">
          {(Object.keys(NAMES) as SystemId[]).map((id) => (
            <button
              key={id}
              type="button"
              className={`path-card sys-${id}${id === system ? " is-on" : ""}`}
              onClick={() => resetTo(id)}
            >
              <h2>{NAMES[id]}</h2>
              <p>{ROLES[id]}</p>
            </button>
          ))}
        </div>
        <button type="button" className="primary" onClick={start}>
          Start {NAMES[system]}
        </button>
      </div>
    );
  }

  if (phase === "debrief") {
    const debrief = buildDebrief(system, actions);
    const yours = metrics;
    const best = runPath(system, REFERENCE_ACTIONS[system]).at(-1)!.after;
    const market = runPath("capitalism", REFERENCE_ACTIONS.capitalism).at(-1)!.after;
    return (
      <div className="pane">
        <h2>{debrief.title}</h2>
        {debrief.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <div className="table-wrap">
          <table>
            <caption>Your run beside the strongest play in this system</caption>
            <thead>
              <tr>
                <th scope="col">Score</th>
                <th scope="col">Your run</th>
                <th scope="col">Best in this system</th>
                {system !== "capitalism" ? <th scope="col">Market reference</th> : null}
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["Living standard", "living"],
                  ["Shortages", "shortage"],
                  ["Consumer choice", "choice"],
                  ["Innovation", "innovation"],
                  ["Freedom & property", "freedom"],
                  ["Income equality", "equality"],
                ] as const
              ).map(([label, key]) => (
                <tr key={key}>
                  <th scope="row">{label}</th>
                  <td>{yours[key]}</td>
                  <td>{best[key]}</td>
                  {system !== "capitalism" ? <td>{market[key]}</td> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row-actions">
          <button type="button" className="primary" onClick={start}>
            Run this system again
          </button>
          <button type="button" className="text-btn" onClick={() => setPhase("pick")}>
            Switch system
          </button>
        </div>
      </div>
    );
  }

  const scene = situation(system, round);
  const choices = actionChoices(system, round);

  return (
    <div className="pane">
      <p className="count">
        {NAMES[system]} · round {round + 1} / {ROUND_COUNT}
      </p>
      <MetricBars metrics={pending ? pending.after : metrics} systemProfit={system === "capitalism"} />
      <article className="situation">
        <h2>{scene.title}</h2>
        <p>{scene.body}</p>
      </article>
      {pending ? (
        <section className="result" aria-live="polite">
          <h2>{pending.headline}</h2>
          <p>{pending.detail}</p>
          <button type="button" className="primary" onClick={commit}>
            {round + 1 >= ROUND_COUNT ? "See the debrief" : "Next round"}
          </button>
        </section>
      ) : (
        <div className="action-grid">
          {choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              className={`action${choice.id === "crony" ? " is-crony" : ""}`}
              onClick={() => setPending(applyAction(system, round, metrics, choice.id))}
            >
              <kbd>{choice.key}</kbd>
              <strong>{choice.title}</strong>
              <span>{choice.detail}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
