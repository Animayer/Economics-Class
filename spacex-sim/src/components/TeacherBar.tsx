interface Props {
  board: boolean;
  hideNotes: boolean;
  showKey: boolean;
  onBoard: (value: boolean) => void;
  onHideNotes: (value: boolean) => void;
  onShowKey: (value: boolean) => void;
  onReset: () => void;
  onIntro: () => void;
}

export function TeacherBar({
  board,
  hideNotes,
  showKey,
  onBoard,
  onHideNotes,
  onShowKey,
  onReset,
  onIntro,
}: Props) {
  return (
    <div className="teacher-bar noprint">
      <span className="teacher-kicker">Teacher</span>
      <label className="toggle">
        <input type="checkbox" checked={board} onChange={(e) => onBoard(e.target.checked)} />
        Board mode
      </label>
      <label className="toggle">
        <input
          type="checkbox"
          checked={hideNotes}
          onChange={(e) => onHideNotes(e.target.checked)}
        />
        Hide notes
      </label>
      <label className="toggle">
        <input type="checkbox" checked={showKey} onChange={(e) => onShowKey(e.target.checked)} />
        Answer key
      </label>
      <button type="button" className="btn btn-ghost" onClick={onIntro}>
        Intro slide
      </button>
      <button type="button" className="btn btn-danger" onClick={onReset}>
        Reset all
      </button>
    </div>
  );
}
