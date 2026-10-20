import { SUIT_SYMBOL, isRed, rankLabel, type Card } from "./cards";
import "./PlayingCard.css";

interface PlayingCardProps {
  card: Card;
  selected?: boolean;
  /** Vertical offset inside a stacked pile, in px. */
  top?: number;
  onClick?: () => void;
  onDoubleClick?: () => void;
  testId?: string;
}

/** One playing card, face up or showing its back. Positioned absolutely when `top` is given. */
export function PlayingCard({ card, selected = false, top, onClick, onDoubleClick, testId }: PlayingCardProps) {
  const className = [
    "pcard",
    card.faceUp ? (isRed(card) ? "pcard--red" : "pcard--black") : "pcard--back",
    selected ? "pcard--selected" : "",
    top !== undefined ? "pcard--stacked" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={className}
      style={top !== undefined ? { top } : undefined}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick?.();
      }}
      aria-label={card.faceUp ? `${rankLabel(card.rank)} ${SUIT_SYMBOL[card.suit]}` : "face-down card"}
      data-testid={testId}
    >
      {card.faceUp && (
        <>
          <span className="pcard__corner">
            {rankLabel(card.rank)}
            <br />
            {SUIT_SYMBOL[card.suit]}
          </span>
          <span className="pcard__pip">{SUIT_SYMBOL[card.suit]}</span>
        </>
      )}
    </button>
  );
}

interface SlotProps {
  label?: string;
  onClick?: () => void;
  testId?: string;
  top?: number;
}

/** An empty pile outline (foundation, free cell, empty column). */
export function CardSlot({ label, onClick, testId, top }: SlotProps) {
  return (
    <button
      type="button"
      className={`pcard pcard--slot ${top !== undefined ? "pcard--stacked" : ""}`}
      style={top !== undefined ? { top } : undefined}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      aria-label={label ?? "empty pile"}
      data-testid={testId}
    >
      {label}
    </button>
  );
}
