import { describe, it, expect } from "vitest";
import {
  autoFoundationTarget,
  canMove,
  drawStock,
  isWon,
  move,
  newGame,
  type SolitaireState,
} from "./solitaireLogic";
import type { Card, Suit } from "../Cards/cards";

const card = (suit: Suit, rank: number, faceUp = true): Card => ({ suit, rank, faceUp });

function blank(overrides: Partial<SolitaireState> = {}): SolitaireState {
  return {
    stock: [],
    waste: [],
    foundations: [[], [], [], []],
    tableau: [[], [], [], [], [], [], []],
    moves: 0,
    ...overrides,
  };
}

describe("klondike deal", () => {
  it("uses all 52 cards: 28 on the tableau, 24 in the stock", () => {
    const game = newGame();
    expect(game.tableau.map((pile) => pile.length)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(game.stock).toHaveLength(24);
    const keys = new Set([...game.stock, ...game.tableau.flat()].map((c) => `${c.suit}${c.rank}`));
    expect(keys.size).toBe(52);
  });

  it("turns up only the last card of each column", () => {
    for (const pile of newGame().tableau) {
      expect(pile.map((c) => c.faceUp)).toEqual(pile.map((_, i) => i === pile.length - 1));
    }
  });
});

describe("stock and waste", () => {
  it("draws one face-up card at a time and recycles the waste when the stock runs out", () => {
    let game = blank({ stock: [card("S", 3, false), card("H", 9, false)] });
    game = drawStock(game);
    expect(game.waste).toEqual([card("H", 9)]);
    game = drawStock(game);
    game = drawStock(game);
    expect(game.stock).toHaveLength(2);
    expect(game.waste).toHaveLength(0);
    expect(game.stock.every((c) => !c.faceUp)).toBe(true);
    // Drawing again returns the cards in the original order.
    expect(drawStock(game).waste[0]).toEqual(card("H", 9));
  });

  it("does nothing when both piles are empty", () => {
    const game = blank();
    expect(drawStock(game)).toBe(game);
  });
});

describe("moves", () => {
  it("builds the tableau down in alternating colours and kings go to empty columns", () => {
    const game = blank({ tableau: [[card("S", 8)], [card("H", 7)], [], [], [], [], []], waste: [card("S", 13)] });
    expect(canMove(game, { kind: "tableau", col: 1, index: 0 }, { kind: "tableau", col: 0 })).toBe(true);
    expect(canMove(game, { kind: "tableau", col: 0, index: 0 }, { kind: "tableau", col: 1 })).toBe(false);
    expect(canMove(game, { kind: "tableau", col: 0, index: 0 }, { kind: "tableau", col: 2 })).toBe(false);
  });

  it("moves a run and flips the card it uncovers", () => {
    const game = blank({
      tableau: [[card("C", 5, false), card("S", 8), card("H", 7)], [card("D", 9)], [], [], [], [], []],
    });
    const next = move(game, { kind: "tableau", col: 0, index: 1 }, { kind: "tableau", col: 1 });
    expect(next.tableau[1].map((c) => c.rank)).toEqual([9, 8, 7]);
    expect(next.tableau[0]).toEqual([card("C", 5, true)]);
    expect(next.moves).toBe(1);
  });

  it("refuses to pick up a face-down card or a broken run", () => {
    const game = blank({ tableau: [[card("C", 5, false), card("S", 8), card("S", 7)], [], [], [], [], [], []] });
    expect(canMove(game, { kind: "tableau", col: 0, index: 0 }, { kind: "tableau", col: 1 })).toBe(false);
    expect(canMove(game, { kind: "tableau", col: 0, index: 1 }, { kind: "tableau", col: 1 })).toBe(false);
  });

  it("builds foundations by suit from the Ace", () => {
    let game = blank({ waste: [card("H", 2)], tableau: [[card("H", 1)], [], [], [], [], [], []] });
    expect(canMove(game, { kind: "waste" }, { kind: "foundation", pile: 0 })).toBe(false);
    game = move(game, { kind: "tableau", col: 0, index: 0 }, { kind: "foundation", pile: 0 });
    expect(game.foundations[0]).toEqual([card("H", 1)]);
    game = move(game, { kind: "waste" }, { kind: "foundation", pile: 0 });
    expect(game.foundations[0].map((c) => c.rank)).toEqual([1, 2]);
  });

  it("finds a foundation for a double-click", () => {
    const game = blank({ tableau: [[card("S", 1)], [], [], [], [], [], []] });
    expect(autoFoundationTarget(game, { kind: "tableau", col: 0, index: 0 })).toEqual({ kind: "foundation", pile: 0 });
    expect(autoFoundationTarget(blank({ waste: [card("S", 5)] }), { kind: "waste" })).toBeNull();
  });

  it("is won when every foundation holds 13 cards", () => {
    expect(isWon(blank())).toBe(false);
    const full = (suit: Suit) => Array.from({ length: 13 }, (_, i) => card(suit, i + 1));
    expect(isWon(blank({ foundations: [full("S"), full("H"), full("D"), full("C")] }))).toBe(true);
  });
});
