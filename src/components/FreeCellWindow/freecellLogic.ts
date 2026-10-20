import { createDeck, isRed, shuffle, type Card } from "../Cards/cards";

export interface FreeCellState {
  cascades: Card[][]; // 8 columns
  cells: (Card | null)[]; // 4 free cells
  foundations: Card[][]; // 4 piles, built up by suit
  moves: number;
}

export type Source = { kind: "cascade"; col: number; index: number } | { kind: "cell"; slot: number };
export type Target =
  | { kind: "cascade"; col: number }
  | { kind: "cell"; slot: number }
  | { kind: "foundation"; pile: number };

export function newGame(rng: () => number = Math.random): FreeCellState {
  const deck = shuffle(createDeck(), rng).map((card) => ({ ...card, faceUp: true }));
  const cascades: Card[][] = Array.from({ length: 8 }, () => []);
  deck.forEach((card, i) => cascades[i % 8].push(card));
  return { cascades, cells: [null, null, null, null], foundations: [[], [], [], []], moves: 0 };
}

export function cardsAt(state: FreeCellState, source: Source): Card[] {
  if (source.kind === "cell") {
    const card = state.cells[source.slot];
    return card ? [card] : [];
  }
  return state.cascades[source.col].slice(source.index);
}

function isSequence(cards: Card[]): boolean {
  return cards.every((card, i) => i === 0 || (isRed(cards[i - 1]) !== isRed(card) && card.rank === cards[i - 1].rank - 1));
}

/**
 * How many cards can be carried in one move: (free cells + 1) × 2^(empty cascades),
 * not counting the destination when it is itself an empty cascade.
 */
export function maxMovable(state: FreeCellState, targetIsEmptyCascade: boolean): number {
  const freeCells = state.cells.filter((cell) => cell === null).length;
  const emptyCascades = state.cascades.filter((pile) => pile.length === 0).length - (targetIsEmptyCascade ? 1 : 0);
  return (freeCells + 1) * 2 ** Math.max(0, emptyCascades);
}

export function canMove(state: FreeCellState, source: Source, target: Target): boolean {
  const cards = cardsAt(state, source);
  if (cards.length === 0 || !isSequence(cards)) return false;
  if (source.kind === "cascade" && target.kind === "cascade" && source.col === target.col) return false;
  if (source.kind === "cell" && target.kind === "cell") return false;

  switch (target.kind) {
    case "cell":
      return cards.length === 1 && state.cells[target.slot] === null;
    case "foundation": {
      if (cards.length !== 1) return false;
      const pile = state.foundations[target.pile];
      const card = cards[0];
      if (pile.length === 0) return card.rank === 1;
      const top = pile[pile.length - 1];
      return top.suit === card.suit && card.rank === top.rank + 1;
    }
    case "cascade": {
      const pile = state.cascades[target.col];
      if (cards.length > maxMovable(state, pile.length === 0)) return false;
      if (pile.length === 0) return true;
      const top = pile[pile.length - 1];
      return isRed(top) !== isRed(cards[0]) && cards[0].rank === top.rank - 1;
    }
  }
}

export function move(state: FreeCellState, source: Source, target: Target): FreeCellState {
  if (!canMove(state, source, target)) return state;
  const cards = cardsAt(state, source);
  const next: FreeCellState = {
    cascades: state.cascades.map((pile) => pile.slice()),
    cells: state.cells.slice(),
    foundations: state.foundations.map((pile) => pile.slice()),
    moves: state.moves + 1,
  };

  if (source.kind === "cell") next.cells[source.slot] = null;
  else next.cascades[source.col].splice(source.index);

  if (target.kind === "cell") next.cells[target.slot] = cards[0];
  else if (target.kind === "foundation") next.foundations[target.pile].push(cards[0]);
  else next.cascades[target.col].push(...cards);
  return next;
}

/** First foundation that takes the source's top card (double-click shortcut). */
export function autoFoundationTarget(state: FreeCellState, source: Source): Target | null {
  const cards = cardsAt(state, source);
  if (cards.length === 0) return null;
  if (source.kind === "cascade" && source.index !== state.cascades[source.col].length - 1) return null;
  for (let pile = 0; pile < 4; pile += 1) {
    const target: Target = { kind: "foundation", pile };
    if (canMove(state, source, target)) return target;
  }
  return null;
}

/** First free cell, or -1 when all four are taken. */
export function firstFreeCell(state: FreeCellState): number {
  return state.cells.findIndex((cell) => cell === null);
}

export function isWon(state: FreeCellState): boolean {
  return state.foundations.every((pile) => pile.length === 13);
}
