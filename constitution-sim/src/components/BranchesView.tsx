import { BRANCHES, CHECKS, branchById, checkById } from "../lib/content";
import type { ArrowId, BranchId, CheckId } from "../types";
import { BranchIcon } from "./Icons";

interface Props {
  selectedBranch: BranchId | null;
  selectedCheck: CheckId | null;
  onBranch: (id: BranchId | null) => void;
  onCheck: (id: CheckId | null) => void;
}

export function BranchesView({
  selectedBranch,
  selectedCheck,
  onBranch,
  onCheck,
}: Props) {
  const check = selectedCheck ? checkById(selectedCheck) : undefined;
  const branch = selectedBranch ? branchById(selectedBranch) : undefined;

  const idle = !selectedBranch && !selectedCheck;
  const litBranches = new Set<BranchId>(
    check ? [...check.from, ...check.toward] : selectedBranch ? [selectedBranch] : [],
  );
  const litArrows = new Set<ArrowId>(check?.arrows ?? []);

  const toggleBranch = (id: BranchId) => {
    onCheck(null);
    onBranch(selectedBranch === id ? null : id);
  };

  const toggleCheck = (id: CheckId) => {
    onBranch(null);
    onCheck(selectedCheck === id ? null : id);
  };

  return (
    <section className="mode-pane branches-pane" aria-label="Three branches">
      <div className="branch-row">
        <BranchCard
          id="legislative"
          selected={selectedBranch === "legislative"}
          lit={!idle && litBranches.has("legislative")}
          dim={!idle && !litBranches.has("legislative")}
          onSelect={toggleBranch}
        />
        <Arrow lit={litArrows.has("leg-exec")} label="checks" />
        <BranchCard
          id="executive"
          selected={selectedBranch === "executive"}
          lit={!idle && litBranches.has("executive")}
          dim={!idle && !litBranches.has("executive")}
          onSelect={toggleBranch}
        />
        <Arrow lit={litArrows.has("exec-jud")} label="checks" />
        <BranchCard
          id="judicial"
          selected={selectedBranch === "judicial"}
          lit={!idle && litBranches.has("judicial")}
          dim={!idle && !litBranches.has("judicial")}
          onSelect={toggleBranch}
        />
      </div>

      <div className="low-arc" aria-hidden="true">
        <span className={`arc-line${litArrows.has("leg-jud") ? " is-lit" : ""}`} />
        <span className="arc-caption">
          {litArrows.has("leg-jud") ? "Congress ↔ Courts" : "Separation of powers"}
        </span>
      </div>

      <div className="detail-strip" role="region" aria-live="polite">
        {check ? (
          <CheckDetail checkId={check.id} />
        ) : branch ? (
          <BranchDetail branchId={branch.id} />
        ) : (
          <p className="detail-idle">
            Tap a branch to see who they are and what they can do. Tap a check
            below to light up who can stop whom.
          </p>
        )}
      </div>

      <div className="check-dock">
        <p className="dock-label">Checks &amp; balances</p>
        <div className="check-chips" role="list">
          {CHECKS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="listitem"
              className={`chip${selectedCheck === item.id ? " is-on" : ""}`}
              aria-pressed={selectedCheck === item.id}
              onClick={() => toggleCheck(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function BranchCard({
  id,
  selected,
  lit,
  dim,
  onSelect,
}: {
  id: BranchId;
  selected: boolean;
  lit: boolean;
  dim: boolean;
  onSelect: (id: BranchId) => void;
}) {
  const data = BRANCHES.find((b) => b.id === id);
  if (!data) return null;
  return (
    <button
      type="button"
      className={`branch-card branch-${id}${selected ? " is-selected" : ""}${lit ? " is-lit" : ""}${dim ? " is-dim" : ""}`}
      aria-pressed={selected}
      onClick={() => onSelect(id)}
    >
      <BranchIcon id={id} className="branch-icon" />
      <p className="branch-article">{data.article}</p>
      <h2>{data.name}</h2>
      <p className="branch-who">{data.shortName}</p>
    </button>
  );
}

function Arrow({ lit, label }: { lit: boolean; label: string }) {
  return (
    <div className={`flow-arrow${lit ? " is-lit" : ""}`} aria-hidden="true">
      <span className="flow-shaft" />
      <span className="flow-label">{label}</span>
      <span className="flow-shaft" />
    </div>
  );
}

function BranchDetail({ branchId }: { branchId: BranchId }) {
  const data = branchById(branchId);
  if (!data) return null;
  return (
    <div className={`detail-grid detail-${branchId}`}>
      <div>
        <p className="detail-kicker">{data.article}</p>
        <h3>{data.name}: who they are</h3>
        <p className="detail-lead">{data.who}</p>
        <ul>
          {data.whoDetail.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Main powers</h3>
        <ul>
          {data.powers.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>How they check others</h3>
        <ul>
          {data.checks.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CheckDetail({ checkId }: { checkId: CheckId }) {
  const data = checkById(checkId);
  if (!data) return null;
  const from = data.from.map((id) => branchById(id)?.name).filter(Boolean);
  const toward = data.toward.map((id) => branchById(id)?.name).filter(Boolean);
  return (
    <div className="check-detail">
      <p className="detail-kicker">Check</p>
      <h3>{data.label}</h3>
      <p className="detail-lead">{data.summary}</p>
      <p className="check-path">
        {from.join(" + ")}
        <span aria-hidden="true"> → </span>
        {toward.join(" + ")}
      </p>
    </div>
  );
}
