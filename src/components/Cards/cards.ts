export type Suit = "S" | "H" | "D" | "C";

export interface Card {
  suit: Suit;
  /** 1 = Ace … 11 = Jack, 12 = Queen, 13 = King. */
  rank: number;
  faceUp: boolean;
}

export const SUITS: Suit[] = ["S", "H", "D", "C"];

export const SUIT_SYMBOL: Record<Suit, string> = { S: "♠", H: "♥", D: "♦", C: "♣" };

const RANK_LABELS = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export function rankLabel(rank: number): string {
  return RANK_LABELS[rank] ?? "?";
}

export function isRed(card: Pick<Card, "suit">): boolean {
  return card.suit === "H" || card.suit === "D";
}

export function sameColour(a: Pick<Card, "suit">, b: Pick<Card, "suit">): boolean {
  return isRed(a) === isRed(b);
}

/** A fresh 52-card deck, all face down, in suit order. */
export function createDeck(): Card[] {
  return SUITS.flatMap((suit) =>
    Array.from({ length: 13 }, (_, i) => ({ suit, rank: i + 1, faceUp: false }))
  );
}

/** Fisher–Yates shuffle (returns a new array; `rng` is injectable for tests). */
export function shuffle<T>(items: T[], rng: () => number = Math.random): T[] {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function cardKey(card: Card): string {
  return `${card.suit}${card.rank}`;
}
