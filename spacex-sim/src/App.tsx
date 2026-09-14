import { useEffect, useMemo, useState } from "react";
import { Chart } from "./components/Chart";
import { ComparePaths } from "./components/ComparePaths";
import { Intro } from "./components/Intro";
import { Journal } from "./components/Journal";
import { Portfolio } from "./components/Portfolio";
import { RsiPanel } from "./components/RsiPanel";
import { SignalCards } from "./components/SignalCards";
import { TeacherBar } from "./components/TeacherBar";
import { Timeline } from "./components/Timeline";
import { TradeDesk } from "./components/TradeDesk";
import { useMarket } from "./hooks/useMarket";
import { usePlayback } from "./hooks/usePlayback";
import { comparePaths } from "./lib/paths";
import { formatDate, money } from "./lib/format";
import { applyTrade, DEFAULT_CASH, nextTradeId, replayTrades } from "./lib/trading";
import type { JournalState, OverlayState, Trade, WindowMode } from "./types";

const EMPTY_JOURNAL: JournalState = {
  thesis: "",
  invalidation: "",
  metric: "",
  emotion: "",
  decision: "",
};

const DEFAULT_OVERLAYS: OverlayState = {
  sma20: true,
  sma50: true,
  rsi: true,
  levels: true,
  volumeSpikes: true,
  style: "candles",
};

export default function App() {
  const { dataset, bars, signals, error, loading, usingLive, liveTried } = useMarket();
  const [windowMode, setWindowMode] = useState<WindowMode>("recent");
  const [intro, setIntro] = useState(true);
  const [board, setBoard] = useState(false);
  const [hideNotes, setHideNotes] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [startCash, setStartCash] = useState(DEFAULT_CASH);
  const [startCashInput, setStartCashInput] = useState(String(DEFAULT_CASH));
  const [feeBps, setFeeBps] = useState(0);
  const [feeInput, setFeeInput] = useState("0");
  const [trades, setTrades] = useState<Trade[]>([]);
  const [spend, setSpend] = useState("2500");
  const [journal, setJournal] = useState<JournalState>(EMPTY_JOURNAL);
  const [overlays, setOverlays] = useState<OverlayState>(DEFAULT_OVERLAYS);

  const minIndex = useMemo(() => {
    if (!dataset || bars.length === 0) {
      return 0;
    }
    if (windowMode === "ipo") {
      return 0;
    }
    const found = bars.findIndex((b) => b.date >= dataset.meta.lessonWindowStart);
    return found < 0 ? 0 : found;
  }, [bars, dataset, windowMode]);

  const maxIndex = bars.length > 0 ? bars.length - 1 : 0;
  const playback = usePlayback(minIndex, maxIndex, minIndex);
  const currentIndex = Math.min(maxIndex, Math.max(minIndex, playback.index));
  const bar = bars[currentIndex];

  useEffect(() => {
    document.documentElement.classList.toggle("board", board);
  }, [board]);

  const portfolio = useMemo(() => {
    if (!bar) {
      return replayTrades([], 0, 0, startCash, feeBps);
    }
    return replayTrades(trades, currentIndex, bar.close, startCash, feeBps);
  }, [bar, currentIndex, feeBps, startCash, trades]);

  const visible = useMemo(
    () => bars.filter((b) => b.index >= minIndex && b.index <= maxIndex),
    [bars, maxIndex, minIndex],
  );

  const windowSignals = useMemo(
    () => signals.filter((s) => s.index >= minIndex && s.index <= maxIndex),
    [maxIndex, minIndex, signals],
  );

  const todaySignals = windowSignals.filter((s) => s.index === currentIndex);
  const otherSignals = windowSignals.filter((s) => s.index !== currentIndex);

  const studentTradeCount = trades.filter(
    (t) => t.index <= currentIndex && t.side !== "hold",
  ).length;

  const paths = useMemo(() => {
    if (!bar) {
      return [];
    }
    return comparePaths(bars, minIndex, currentIndex, startCash, feeBps, portfolio, studentTradeCount);
  }, [bar, bars, currentIndex, feeBps, minIndex, portfolio, startCash, studentTradeCount]);

  const resetAll = () => {
    setTrades([]);
    setJournal(EMPTY_JOURNAL);
    setStartCash(DEFAULT_CASH);
    setStartCashInput(String(DEFAULT_CASH));
    setFeeBps(0);
    setFeeInput("0");
    setSpend("2500");
    setWindowMode("recent");
    setOverlays(DEFAULT_OVERLAYS);
    setShowKey(false);
    playback.pause();
    playback.setIndex(minIndex);
    setIntro(true);
  };

  const applyCash = () => {
    const cash = Number(startCashInput);
    const fee = Number(feeInput);
    if (Number.isFinite(cash) && cash >= 100) {
      setStartCash(cash);
    }
    if (Number.isFinite(fee) && fee >= 0) {
      setFeeBps(fee);
    }
    setTrades([]);
  };

  const record = (side: Trade["side"], shares: number) => {
    if (!bar) {
      return;
    }
    playback.pause();
    if (side === "hold") {
      setTrades((current) => [
        ...current,
        {
          id: nextTradeId(),
          index: bar.index,
          date: bar.date,
          side: "hold",
          shares: 0,
          price: bar.close,
          fee: 0,
          realizedDelta: 0,
        },
      ]);
      return;
    }
    const applied = applyTrade(portfolio, side, shares, bar.close, feeBps);
    if (!applied) {
      return;
    }
    setTrades((current) => [
      ...current,
      {
        id: nextTradeId(),
        index: bar.index,
        date: bar.date,
        side,
        shares: applied.filled,
        price: bar.close,
        fee: applied.fee,
        realizedDelta: applied.realizedDelta,
      },
    ]);
  };

  if (loading) {
    return (
      <main className="shell">
        <div className="boot" role="status">
          Loading NASDAQ:SPCX…
        </div>
      </main>
    );
  }

  if (error || !dataset || !bar) {
    return (
      <main className="shell">
        <div className="boot boot-error" role="alert">
          {error ?? "SPCX data did not load."} Refresh, or check that
          <code> data/spcx-history.json </code> is present.
        </div>
      </main>
    );
  }

  return (
    <div className="shell">
      <a className="skip" href="#day-slider">
        Skip to timeline
      </a>
      <Intro open={intro} onClose={() => setIntro(false)} meta={dataset.meta} />
      <TeacherBar
        board={board}
        hideNotes={hideNotes}
        showKey={showKey}
        onBoard={setBoard}
        onHideNotes={setHideNotes}
        onShowKey={setShowKey}
        onReset={resetAll}
        onIntro={() => setIntro(true)}
      />

      <header className="masthead">
        <p className="eyebrow">{dataset.meta.classLine}</p>
        <h1>{dataset.meta.title}</h1>
        <p className="lede">
          Walk {dataset.meta.symbol} session by session. Practice fractional ownership, timing, and
          the technical alerts that <em>could</em> have gotten your attention — not day-trading
          hype.
        </p>
        <p className="data-stamp">
          Data as of {dataset.meta.asOfLabel}. Source: {dataset.meta.source}.
          {liveTried && !usingLive ? " Live Yahoo fetch blocked or unchanged; using bundled history." : ""}
          {usingLive ? " Live Yahoo overlay applied." : ""}
        </p>
      </header>

      <Timeline
        bars={bars}
        minIndex={minIndex}
        maxIndex={maxIndex}
        index={currentIndex}
        playing={playback.playing}
        speed={playback.speed}
        signals={windowSignals}
        overlays={overlays}
        onIndex={playback.setIndex}
        onToggle={playback.toggle}
        onStep={playback.step}
        onSpeed={playback.setSpeed}
        onOverlay={setOverlays}
        onWindow={(mode) => {
          setWindowMode(mode);
          playback.pause();
        }}
        windowMode={windowMode}
      />

      <div className="board-grid">
        <div>
          <Chart
            bars={bars}
            visible={visible}
            index={currentIndex}
            overlays={overlays}
            levels={dataset.levels}
            signals={windowSignals}
            onIndex={(i) => {
              playback.pause();
              playback.setIndex(i);
            }}
          />
          {overlays.rsi ? <RsiPanel bar={bar} series={visible} /> : null}
        </div>
        <div className="side">
          <Portfolio
            portfolio={portfolio}
            startCash={startCash}
            startCashInput={startCashInput}
            feeBps={feeBps}
            feeInput={feeInput}
            onStartCash={setStartCashInput}
            onFee={setFeeInput}
            applyCash={applyCash}
          />
          <TradeDesk
            bar={bar}
            portfolio={portfolio}
            feeBps={feeBps}
            spend={spend}
            onSpend={setSpend}
            onBuy={(qty) => record("buy", qty)}
            onSell={(qty) => record("sell", qty)}
            onHold={() => record("hold", 0)}
          />
          <SignalCards
            today={todaySignals}
            recent={otherSignals}
            showKey={showKey}
            hideNotes={hideNotes}
            onJump={(i) => {
              playback.pause();
              playback.setIndex(i);
            }}
          />
        </div>
      </div>

      <ComparePaths paths={paths} hideNotes={hideNotes} />
      <Journal
        journal={journal}
        onChange={setJournal}
        bar={bar}
        portfolio={portfolio}
        startCash={startCash}
        trades={trades}
      />

      <footer className="footnotes">
        <p>
          <strong>Not a broker. Not advice.</strong> Paper simulation of past {dataset.meta.symbol}{" "}
          prints for {formatDate(dataset.meta.ipoDate)}–{formatDate(dataset.meta.asOf)}. IPO priced
          at {money(dataset.meta.ipoPrice)}. A gain on this screen is not a capital gain you can
          spend. Past prices do not forecast future prices. No student names or emails are
          collected.
        </p>
        {!hideNotes ? (
          <p className="teacher-note">
            SMA 20 needs 20 closes; SMA 50 needs 50 (first prints {dataset.meta.symbol} SMA 50 on
            Aug 24, 2026). RSI(14) is Wilder’s RSI. Volume spike = ≥ 2× the 20-day average volume.
          </p>
        ) : null}
      </footer>
    </div>
  );
}
