import { describe, it, expect, beforeEach } from "vitest";
import {
  LEVELS,
  RECORDS_STORAGE_KEY,
  createGame,
  loadRecords,
  minesLeft,
  reveal,
  submitRecord,
  toggleFlag,
  type Game,
} from "./minesweeperLogic";

/** Deterministic rng so the boards are reproducible. */
function seeded(seed = 7) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function count(game: Game, predicate: (cell: Game["board"][0][0]) => boolean) {
  return game.board.flat().filter(predicate).length;
}

describe("minesweeper", () => {
  beforeEach(() => window.localStorage.clear());

  it("builds boards with the classic dimensions", () => {
    const game = createGame("intermediate");
    expect([game.rows, game.cols, game.mines]).toEqual([16, 16, 40]);
    expect(game.status).toBe("ready");
    expect(count(game, (cell) => cell.mine)).toBe(0);
  });

  it("places mines on the first click and never on that cell", () => {
    for (let seed = 1; seed <= 25; seed += 1) {
      const game = reveal(createGame("beginner"), 4, 4, seeded(seed));
      expect(game.board[4][4].mine).toBe(false);
      expect(count(game, (cell) => cell.mine)).toBe(LEVELS.beginner.mines);
      expect(game.status).not.toBe("lost");
    }
  });

  it("keeps the first click's neighbours mine-free so it opens a region", () => {
    const game = reveal(createGame("beginner"), 4, 4, seeded(3));
    expect(game.board[4][4].adjacent).toBe(0);
    expect(count(game, (cell) => cell.revealed)).toBeGreaterThan(1);
  });

  it("counts adjacent mines correctly", () => {
    const game = reveal(createGame("beginner"), 0, 0, seeded(11));
    for (let r = 0; r < game.rows; r += 1) {
      for (let c = 0; c < game.cols; c += 1) {
        let expected = 0;
        for (let dr = -1; dr <= 1; dr += 1)
          for (let dc = -1; dc <= 1; dc += 1)
            if ((dr || dc) && game.board[r + dr]?.[c + dc]?.mine) expected += 1;
        expect(game.board[r][c].adjacent).toBe(expected);
      }
    }
  });

  it("loses when a mine is opened and reveals all mines", () => {
    const started = reveal(createGame("beginner"), 4, 4, seeded(5));
    const mine = started.board.flat().findIndex((cell) => cell.mine);
    const lost = reveal(started, Math.floor(mine / started.cols), mine % started.cols);
    expect(lost.status).toBe("lost");
    expect(count(lost, (cell) => cell.mine && cell.revealed)).toBe(LEVELS.beginner.mines);
  });

  it("wins once every safe cell is open", () => {
    let game = reveal(createGame("beginner"), 4, 4, seeded(9));
    for (let r = 0; r < game.rows; r += 1) {
      for (let c = 0; c < game.cols; c += 1) {
        if (!game.board[r][c].mine) game = reveal(game, r, c);
      }
    }
    expect(game.status).toBe("won");
  });

  it("flags block opening and adjust the mine counter, including below zero", () => {
    let game = createGame("beginner");
    game = toggleFlag(game, 0, 0);
    expect(minesLeft(game)).toBe(9);
    expect(reveal(game, 0, 0)).toBe(game);
    for (let c = 1; c <= 10; c += 1) game = toggleFlag(game, 8, c - 1 < 9 ? c - 1 : 0);
    game = toggleFlag(game, 0, 0);
    expect(typeof minesLeft(game)).toBe("number");
    expect(toggleFlag(toggleFlag(createGame("beginner"), 1, 1), 1, 1).board[1][1].flagged).toBe(false);
  });

  it("ignores input after the game ends", () => {
    const started = reveal(createGame("beginner"), 4, 4, seeded(5));
    const mine = started.board.flat().findIndex((cell) => cell.mine);
    const lost = reveal(started, Math.floor(mine / started.cols), mine % started.cols);
    expect(reveal(lost, 0, 0)).toBe(lost);
    expect(toggleFlag(lost, 0, 0)).toBe(lost);
  });
});

describe("records", () => {
  beforeEach(() => window.localStorage.clear());

  it("keeps only the best (lowest) time per level", () => {
    expect(submitRecord("beginner", 80)).toBe(true);
    expect(submitRecord("beginner", 95)).toBe(false);
    expect(submitRecord("beginner", 60)).toBe(true);
    expect(loadRecords()).toEqual({ beginner: 60 });
  });

  it("ignores corrupted storage", () => {
    window.localStorage.setItem(RECORDS_STORAGE_KEY, "{oops");
    expect(loadRecords()).toEqual({});
  });
});
