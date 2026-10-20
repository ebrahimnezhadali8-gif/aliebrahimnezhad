import { createDeck, isRed, shuffle, type Card } from "../Cards/cards";

/** Klondike, draw-one. All functions are pure: they return a new state (or the same one when a move is illegal). */
export interface SolitaireState {
  stock: Card[];
  waste: Card[];
  foundations: Card[][]; // 4 piles, built up by suit from Ace
  tableau: Card[][]; // 7 columns
  moves: number;
}

export type Source =
  | { kind: "waste" }
  | { kind: "tableau"; col: number; index: number }
  | { kind: "foundation"; pile: number };

export type Target = { kind: "tableau"; col: number } | { kind: "foundation"; pile: number };

export function newGame(rng: () => number = Math.random): SolitaireState {
  const deck = shuffle(createDeck(), rng);
  const tableau: Card[][] = [];
  let cursor = 0;
  for (let col = 0; col < 7; col += 1) {
    const pile = deck.slice(cursor, cursor + col + 1).map((card, i, all) => ({ ...card, faceUp: i === all.length - 1 }));
    tableau.push(pile);
    cursor += col + 1;
  }
  return {
    stock: deck.slice(cursor),
    waste: [],
    foundations: [[], [], [], []],
    tableau,
    moves: 0,
  };
}

/** Turns one stock card onto the waste; when the stock is empty, flips the waste back over. */
export function drawStock(state: SolitaireState): SolitaireState {
  if (state.stock.length > 0) {
    const stock = state.stock.slice();
    const card = { ...stock.pop()!, faceUp: true };
    return { ...state, stock, waste: [...state.waste, card], moves: state.moves + 1 };
  }
  if (state.waste.length === 0) return state;
  const stock = state.waste
    .slice()
    .reverse()
    .map((card) => ({ ...card, faceUp: false }));
  return { ...state, stock, waste: [], moves: state.moves + 1 };
}

export function canPlaceOnFoundation(card: Card, pile: Card[]): boolean {
  if (pile.length === 0) return card.rank === 1;
  const top = pile[pile.length - 1];
  return top.suit === card.suit && card.rank === top.rank + 1;
}

export function canPlaceOnTableau(card: Card, pile: Card[]): boolean {
  if (pile.length === 0) return card.rank === 13;
  const top = pile[pile.length - 1];
  return top.faceUp && isRed(top) !== isRed(card) && card.rank === top.rank - 1;
}

/** The cards a source would pick up (the dragged run, top card last). */
export function cardsAt(state: SolitaireState, source: Source): Card[] {
  switch (source.kind) {
    case "waste":
      return state.waste.length ? [state.waste[state.waste.length - 1]] : [];
    case "foundation": {
      const pile = state.foundations[source.pile];
      return pile.length ? [pile[pile.length - 1]] : [];
    }
    case "tableau": {
      const pile = state.tableau[source.col];
      const run = pile.slice(source.index);
      return run.length > 0 && run.every((card) => card.faceUp) ? run : [];
    }
  }
}

function isRun(cards: Card[]): boolean {
  return cards.every((card, i) => i === 0 || (isRed(cards[i - 1]) !== isRed(card) && card.rank === cards[i - 1].rank - 1));
}

export function canMove(state: SolitaireState, source: Source, target: Target): boolean {
  const cards = cardsAt(state, source);
  if (cards.length === 0 || !isRun(cards)) return false;
  if (source.kind === "tableau" && target.kind === "tableau" && source.col === target.col) return false;
  if (target.kind === "foundation") {
    return cards.length === 1 && canPlaceOnFoundation(cards[0], state.foundations[target.pile]);
  }
  return canPlaceOnTableau(cards[0], state.tableau[target.col]);
}

export function move(state: SolitaireState, source: Source, target: Target): SolitaireState {
  if (!canMove(state, source, target)) return state;
  const cards = cardsAt(state, source);
  const next: SolitaireState = {
    ...state,
    waste: state.waste.slice(),
    foundations: state.foundations.map((pile) => pile.slice()),
    tableau: state.tableau.map((pile) => pile.slice()),
    moves: state.moves + 1,
  };

  if (source.kind === "waste") next.waste.pop();
  else if (source.kind === "foundation") next.foundations[source.pile].pop();
  else {
    next.tableau[source.col].splice(source.index);
    const exposed = next.tableau[source.col];
    if (exposed.length > 0 && !exposed[exposed.length - 1].faceUp) {
      exposed[exposed.length - 1] = { ...exposed[exposed.length - 1], faceUp: true };
    }
  }

  if (target.kind === "foundation") next.foundations[target.pile].push(cards[0]);
  else next.tableau[target.col].push(...cards);
  return next;
}

/** First foundation pile that accepts the source's top card, if any (double-click shortcut). */
export function autoFoundationTarget(state: SolitaireState, source: Source): Target | null {
  const cards = cardsAt(state, source);
  if (cards.length !== 1 && source.kind !== "tableau") return null;
  const card = cards[cards.length - 1];
  if (!card) return null;
  if (source.kind === "tableau" && source.index !== state.tableau[source.col].length - 1) return null;
  for (let pile = 0; pile < 4; pile += 1) {
    if (canPlaceOnFoundation(card, state.foundations[pile])) return { kind: "foundation", pile };
  }
  return null;
}

export function isWon(state: SolitaireState): boolean {
  return state.foundations.every((pile) => pile.length === 13);
}
