import { describe, it, expect } from "vitest";
import {
  autoFoundationTarget,
  canMove,
  firstFreeCell,
  isWon,
  maxMovable,
  move,
  newGame,
  type FreeCellState,
} from "./freecellLogic";
import type { Card, Suit } from "../Cards/cards";

const card = (suit: Suit, rank: number): Card => ({ suit, rank, faceUp: true });

function blank(overrides: Partial<FreeCellState> = {}): FreeCellState {
  return {
    cascades: Array.from({ length: 8 }, () => []),
    cells: [null, null, null, null],
    foundations: [[], [], [], []],
    moves: 0,
    ...overrides,
  };
}

describe("freecell deal", () => {
  it("deals 52 distinct cards into columns of 7,7,7,7,6,6,6,6", () => {
    const game = newGame();
    expect(game.cascades.map((pile) => pile.length)).toEqual([7, 7, 7, 7, 6, 6, 6, 6]);
    expect(new Set(game.cascades.flat().map((c) => `${c.suit}${c.rank}`)).size).toBe(52);
    expect(game.cells.every((cell) => cell === null)).toBe(true);
  });
});

describe("freecell moves", () => {
  it("uses the supermove formula (cells+1) × 2^emptyCascades", () => {
    const withCascades = (filled: number) =>
      blank({ cascades: Array.from({ length: 8 }, (_, i) => (i < filled ? [card("S", 5)] : [])) });
    expect(maxMovable(withCascades(8), false)).toBe(5);
    expect(maxMovable(withCascades(7), false)).toBe(10);
    // An empty destination column does not count as a helper.
    expect(maxMovable(withCascades(7), true)).toBe(5);
  });

  it("parks one card in a free cell and returns it", () => {
    let game = blank({ cascades: [[card("S", 9)], [], [], [], [], [], [], []] });
    game = move(game, { kind: "cascade", col: 0, index: 0 }, { kind: "cell", slot: 0 });
    expect(game.cells[0]).toEqual(card("S", 9));
    expect(game.cascades[0]).toHaveLength(0);
    game = move(game, { kind: "cell", slot: 0 }, { kind: "cascade", col: 1 });
    expect(game.cascades[1]).toEqual([card("S", 9)]);
  });

  it("will not park on an occupied cell or move cell-to-cell", () => {
    const game = blank({
      cascades: [[card("S", 9)], [], [], [], [], [], [], []],
      cells: [card("H", 2), null, null, null],
    });
    expect(canMove(game, { kind: "cascade", col: 0, index: 0 }, { kind: "cell", slot: 0 })).toBe(false);
    expect(canMove(game, { kind: "cell", slot: 0 }, { kind: "cell", slot: 1 })).toBe(false);
    expect(firstFreeCell(game)).toBe(1);
  });

  it("moves an alternating run only if there is room to carry it", () => {
    const run = [card("S", 8), card("H", 7), card("S", 6)];
    const base = blank({ cascades: [[card("D", 9), ...run], [card("H", 9)], [], [], [], [], [], []] });
    expect(canMove(base, { kind: "cascade", col: 0, index: 1 }, { kind: "cascade", col: 1 })).toBe(true);

    // No free cells and no empty columns → only one card can travel.
    const jammed = blank({
      cascades: [[card("D", 9), ...run], [card("H", 9)], [card("C", 1)], [card("C", 2)], [card("C", 3)], [card("C", 4)], [card("C", 5)], [card("C", 6)]],
      cells: [card("D", 1), card("D", 2), card("D", 3), card("D", 4)],
    });
    expect(canMove(jammed, { kind: "cascade", col: 0, index: 1 }, { kind: "cascade", col: 1 })).toBe(false);
  });

  it("rejects a run that is not alternating", () => {
    const game = blank({ cascades: [[card("S", 8), card("S", 7)], [card("H", 9)], [], [], [], [], [], []] });
    expect(canMove(game, { kind: "cascade", col: 0, index: 0 }, { kind: "cascade", col: 1 })).toBe(false);
  });

  it("builds foundations and finds the double-click target", () => {
    const game = blank({ cascades: [[card("C", 1)], [], [], [], [], [], [], []] });
    expect(autoFoundationTarget(game, { kind: "cascade", col: 0, index: 0 })).toEqual({ kind: "foundation", pile: 0 });
    const moved = move(game, { kind: "cascade", col: 0, index: 0 }, { kind: "foundation", pile: 0 });
    expect(moved.foundations[0]).toEqual([card("C", 1)]);
  });

  it("is won when all foundations are full", () => {
    const full = (suit: Suit) => Array.from({ length: 13 }, (_, i) => card(suit, i + 1));
    expect(isWon(blank({ foundations: [full("S"), full("H"), full("D"), full("C")] }))).toBe(true);
    expect(isWon(blank())).toBe(false);
  });
});
