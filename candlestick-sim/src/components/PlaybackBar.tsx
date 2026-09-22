type Props = {
  total: number;
  visible: number;
  playing: boolean;
  patternStart: number;
  patternEnd: number;
  markPattern: boolean;
  onJump: (count: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onReplay: () => void;
  onShowAll: () => void;
};

export function PlaybackBar({
  total,
  visible,
  playing,
  patternStart,
  patternEnd,
  markPattern,
  onJump,
  onPrev,
  onNext,
  onReplay,
  onShowAll,
}: Props) {
  const status =
    visible <= 0
      ? "Starting the replay"
      : markPattern && visible <= patternStart
        ? `Day ${visible} of ${total} · setup`
        : markPattern && visible <= patternEnd
          ? `Day ${visible} of ${total} · pattern printing`
          : `Day ${Math.max(visible, 1)} of ${total}`;

  return (
    <div className="playback">
      <div className="transport">
        <button type="button" className="ctrl" onClick={onReplay}>
          <kbd>R</kbd>
          {playing ? "Replaying" : "Replay"}
        </button>
        <button type="button" className="ctrl" onClick={onPrev} disabled={visible <= 1 && !playing}>
          <kbd>←</kbd>
          Previous
        </button>
        <button type="button" className="ctrl ctrl-primary" onClick={onNext} disabled={visible >= total}>
          <kbd>→</kbd>
          Next candle
        </button>
        <button type="button" className="ctrl" onClick={onShowAll} disabled={visible >= total}>
          Show all
        </button>
        <p className="status">{status}</p>
      </div>
      <ol className="days">
        {Array.from({ length: total }, (_, index) => {
          const day = index + 1;
          const inPattern = markPattern && index >= patternStart && index <= patternEnd;
          const seen = day <= visible;
          return (
            <li key={day}>
              <button
                type="button"
                className={`day-btn${seen ? " is-seen" : ""}${inPattern ? " is-pattern" : ""}${day === visible ? " is-current" : ""}`}
                aria-current={day === visible ? "step" : undefined}
                onClick={() => onJump(day)}
              >
                {day}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
