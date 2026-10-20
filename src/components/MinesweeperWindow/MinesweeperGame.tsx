import { useCallback, useEffect, useRef, useState } from "react";
import {
  createGame,
  loadRecords,
  minesLeft,
  reveal,
  submitRecord,
  toggleFlag,
  type Game,
  type Level,
} from "./minesweeperLogic";
import { useContent } from "../../hooks/useContent";
import "./MinesweeperGame.css";

interface MinesweeperGameProps {
  /** Which difficulty levels to offer (the phone skips Expert — it would not fit). */
  levels?: Level[];
  /** Cell size in px; the phone uses smaller cells. */
  cellSize?: number;
}

const LONG_PRESS_MS = 420;

function pad(value: number): string {
  const clamped = Math.max(-99, Math.min(999, value));
  return clamped < 0 ? `-${String(Math.abs(clamped)).padStart(2, "0")}` : String(clamped).padStart(3, "0");
}

/**
 * Classic Minesweeper. Mouse: left-click opens, right-click flags. Touch: tap
 * opens, long-press flags (or switch the "flag" toggle on). The rules live in
 * `minesweeperLogic.ts`; this component only wires input, the timer and records.
 */
function MinesweeperGame({ levels = ["beginner", "intermediate", "expert"], cellSize = 22 }: MinesweeperGameProps) {
  const { t } = useContent();
  const [level, setLevel] = useState<Level>(levels[0]);
  const [game, setGame] = useState<Game>(() => createGame(levels[0]));
  const [seconds, setSeconds] = useState(0);
  const [flagMode, setFlagMode] = useState(false);
  const [records, setRecords] = useState(loadRecords);
  const [newRecord, setNewRecord] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const longPressed = useRef(false);

  const restart = useCallback((nextLevel: Level) => {
    setLevel(nextLevel);
    setGame(createGame(nextLevel));
    setSeconds(0);
    setNewRecord(false);
  }, []);

  // The clock runs only while a game is in progress.
  useEffect(() => {
    if (game.status !== "playing") return;
    const timer = setInterval(() => setSeconds((s) => Math.min(999, s + 1)), 1000);
    return () => clearInterval(timer);
  }, [game.status]);

  // Record a win exactly once.
  useEffect(() => {
    if (game.status !== "won") return;
    const beaten = submitRecord(game.level, seconds);
    setNewRecord(beaten);
    setRecords(loadRecords());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.status]);

  const open = (row: number, col: number) => setGame((current) => reveal(current, row, col));
  const flag = (row: number, col: number) => setGame((current) => toggleFlag(current, row, col));

  const face = game.status === "won" ? "😎" : game.status === "lost" ? "😵" : "🙂";
  const best = records[level];

  return (
    <div className="mines" data-testid="minesweeper" data-status={game.status}>
      <div className="mines__toolbar">
        <select
          className="mines__level"
          value={level}
          aria-label={t("difficulty")}
          onChange={(e) => restart(e.target.value as Level)}
          data-testid="mines-level"
        >
          {levels.map((option) => (
            <option key={option} value={option}>
              {t(option)}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={`mines__flagmode ${flagMode ? "is-on" : ""}`}
          aria-pressed={flagMode}
          onClick={() => setFlagMode((v) => !v)}
          data-testid="mines-flagmode"
        >
          🚩
        </button>
        <span className="mines__best" data-testid="mines-best">
          {best !== undefined ? `${t("bestTime")}: ${best}s` : ""}
        </span>
      </div>

      <div className="mines__panel">
        <span className="mines__digits" data-testid="mines-left" aria-label={t("minesLeft")}>
          {pad(minesLeft(game))}
        </span>
        <button type="button" className="mines__face" onClick={() => restart(level)} aria-label={t("newGame")} data-testid="mines-face">
          {face}
        </button>
        <span className="mines__digits" data-testid="mines-time" aria-label={t("time")}>
          {pad(seconds)}
        </span>
      </div>

      <div
        className="mines__board"
        style={{ gridTemplateColumns: `repeat(${game.cols}, ${cellSize}px)`, ["--cell" as string]: `${cellSize}px` }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {game.board.map((line, row) =>
          line.map((cell, col) => {
            const shown = cell.revealed;
            const className = [
              "mines__cell",
              shown ? "is-open" : "",
              shown && cell.mine ? "is-mine" : "",
              shown && !cell.mine && cell.adjacent ? `n${cell.adjacent}` : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <button
                key={`${row}-${col}`}
                type="button"
                className={className}
                data-testid={`cell-${row}-${col}`}
                aria-label={shown ? (cell.mine ? "mine" : String(cell.adjacent)) : cell.flagged ? "flag" : "hidden"}
                onClick={() => {
                  if (longPressed.current) {
                    longPressed.current = false;
                    return;
                  }
                  if (flagMode) flag(row, col);
                  else open(row, col);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  flag(row, col);
                }}
                onPointerDown={(e) => {
                  if (e.pointerType === "mouse") return;
                  longPressed.current = false;
                  pressTimer.current = setTimeout(() => {
                    longPressed.current = true;
                    flag(row, col);
                  }, LONG_PRESS_MS);
                }}
                onPointerUp={() => clearTimeout(pressTimer.current)}
                onPointerLeave={() => clearTimeout(pressTimer.current)}
                onPointerCancel={() => clearTimeout(pressTimer.current)}
              >
                {shown ? (cell.mine ? "💣" : cell.adjacent || "") : cell.flagged ? "🚩" : ""}
              </button>
            );
          })
        )}
      </div>

      {game.status === "won" && (
        <p className="mines__msg" role="status" data-testid="mines-won">
          {t("youWon")} {seconds}s{newRecord ? ` — ${t("newRecord")}` : ""}
        </p>
      )}
      {game.status === "lost" && (
        <p className="mines__msg mines__msg--lost" role="status" data-testid="mines-lost">
          {t("boom")}
        </p>
      )}
    </div>
  );
}

export default MinesweeperGame;
