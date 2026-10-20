export type Level = "beginner" | "intermediate" | "expert";

export const LEVELS: Record<Level, { rows: number; cols: number; mines: number }> = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

export interface Cell {
  mine: boolean;
  adjacent: number;
  revealed: boolean;
  flagged: boolean;
}

export type Status = "ready" | "playing" | "won" | "lost";

export interface Game {
  level: Level;
  rows: number;
  cols: number;
  mines: number;
  board: Cell[][];
  status: Status;
  /** Mines are only placed on the first reveal, so that first click is always safe. */
  minesPlaced: boolean;
}

function emptyBoard(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ mine: false, adjacent: 0, revealed: false, flagged: false }))
  );
}

export function createGame(level: Level): Game {
  const { rows, cols, mines } = LEVELS[level];
  return { level, rows, cols, mines, board: emptyBoard(rows, cols), status: "ready", minesPlaced: false };
}

function neighbours(game: Pick<Game, "rows" | "cols">, row: number, col: number): [number, number][] {
  const result: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr += 1) {
    for (let dc = -1; dc <= 1; dc += 1) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < game.rows && c >= 0 && c < game.cols) result.push([r, c]);
    }
  }
  return result;
}

function cloneBoard(board: Cell[][]): Cell[][] {
  return board.map((line) => line.map((cell) => ({ ...cell })));
}

/** Scatters the mines everywhere except the first click (and, when there is room, its neighbours). */
function placeMines(game: Game, safeRow: number, safeCol: number, rng: () => number): Cell[][] {
  const board = cloneBoard(game.board);
  const protectedKeys = new Set<string>([`${safeRow},${safeCol}`]);
  const ring = neighbours(game, safeRow, safeCol);
  const candidatesWithRing = game.rows * game.cols - protectedKeys.size - ring.length;
  if (candidatesWithRing >= game.mines) ring.forEach(([r, c]) => protectedKeys.add(`${r},${c}`));

  const candidates: [number, number][] = [];
  for (let r = 0; r < game.rows; r += 1) {
    for (let c = 0; c < game.cols; c += 1) {
      if (!protectedKeys.has(`${r},${c}`)) candidates.push([r, c]);
    }
  }
  // Fisher–Yates, then take the first N.
  for (let i = candidates.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  candidates.slice(0, game.mines).forEach(([r, c]) => {
    board[r][c].mine = true;
  });
  for (let r = 0; r < game.rows; r += 1) {
    for (let c = 0; c < game.cols; c += 1) {
      board[r][c].adjacent = neighbours(game, r, c).filter(([nr, nc]) => board[nr][nc].mine).length;
    }
  }
  return board;
}

function hasWon(board: Cell[][]): boolean {
  return board.every((line) => line.every((cell) => cell.mine || cell.revealed));
}

/** Opens a cell (flood-filling empty regions). Returns the same object when nothing changes. */
export function reveal(game: Game, row: number, col: number, rng: () => number = Math.random): Game {
  if (game.status === "won" || game.status === "lost") return game;
  const target = game.board[row]?.[col];
  if (!target || target.revealed || target.flagged) return game;

  let board = game.minesPlaced ? cloneBoard(game.board) : placeMines(game, row, col, rng);

  if (board[row][col].mine) {
    // Reveal every mine so the player sees what they stepped on.
    board = board.map((line) => line.map((cell) => (cell.mine && !cell.flagged ? { ...cell, revealed: true } : cell)));
    board[row][col].revealed = true;
    return { ...game, board, minesPlaced: true, status: "lost" };
  }

  const queue: [number, number][] = [[row, col]];
  while (queue.length > 0) {
    const [r, c] = queue.pop()!;
    const cell = board[r][c];
    if (cell.revealed || cell.flagged) continue;
    cell.revealed = true;
    if (cell.adjacent === 0) queue.push(...neighbours(game, r, c));
  }

  return { ...game, board, minesPlaced: true, status: hasWon(board) ? "won" : "playing" };
}

export function toggleFlag(game: Game, row: number, col: number): Game {
  if (game.status === "won" || game.status === "lost") return game;
  const cell = game.board[row]?.[col];
  if (!cell || cell.revealed) return game;
  const board = cloneBoard(game.board);
  board[row][col].flagged = !cell.flagged;
  return { ...game, board, status: game.status === "ready" ? "playing" : game.status };
}

/** Mines minus flags (can go negative, like the real game). */
export function minesLeft(game: Game): number {
  const flags = game.board.reduce((sum, line) => sum + line.filter((cell) => cell.flagged).length, 0);
  return game.mines - flags;
}

/** Best (lowest) win times per level, in seconds. */
export type Records = Partial<Record<Level, number>>;

export const RECORDS_STORAGE_KEY = "portfolio:mines-records";

export function loadRecords(): Records {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(RECORDS_STORAGE_KEY) ?? "{}");
    if (typeof parsed !== "object" || parsed === null) return {};
    const records: Records = {};
    for (const level of Object.keys(LEVELS) as Level[]) {
      const value = (parsed as Record<string, unknown>)[level];
      if (typeof value === "number" && Number.isFinite(value) && value > 0) records[level] = value;
    }
    return records;
  } catch {
    return {};
  }
}

/** Stores `seconds` if it beats the current record. Returns true when it did. */
export function submitRecord(level: Level, seconds: number): boolean {
  const records = loadRecords();
  const best = records[level];
  if (best !== undefined && best <= seconds) return false;
  try {
    window.localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify({ ...records, [level]: seconds }));
  } catch {
    return false;
  }
  return true;
}
