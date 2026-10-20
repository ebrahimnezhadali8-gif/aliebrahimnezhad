import { useState } from "react";
import Window from "../Window/Window";
import { CardSlot, PlayingCard } from "../Cards/PlayingCard";
import {
  autoFoundationTarget,
  canMove,
  firstFreeCell,
  isWon,
  move,
  newGame,
  type FreeCellState,
  type Source,
  type Target,
} from "./freecellLogic";
import { windowMeta } from "../../config/siteConfig";
import { useContent } from "../../hooks/useContent";
import "../SolitaireWindow/SolitaireWindow.css";
import "./FreeCellWindow.css";

const STEP = 24;

function sameSource(a: Source | null, b: Source): boolean {
  if (!a || a.kind !== b.kind) return false;
  if (a.kind === "cell" && b.kind === "cell") return a.slot === b.slot;
  if (a.kind === "cascade" && b.kind === "cascade") return a.col === b.col && a.index === b.index;
  return false;
}

/** FreeCell: click a card (or run) then its destination; double-click sends a card to a foundation or a free cell. */
function FreeCellWindow() {
  const meta = windowMeta.freecell;
  const { t } = useContent();
  const [game, setGame] = useState<FreeCellState>(() => newGame());
  const [selected, setSelected] = useState<Source | null>(null);
  const won = isWon(game);

  const drop = (target: Target) => {
    if (selected && canMove(game, selected, target)) setGame(move(game, selected, target));
    setSelected(null);
  };

  const pick = (source: Source, target?: Target) => {
    if (selected && !sameSource(selected, source) && target && canMove(game, selected, target)) {
      drop(target);
      return;
    }
    setSelected(sameSource(selected, source) ? null : source);
  };

  const autoSend = (source: Source) => {
    const foundation = autoFoundationTarget(game, source);
    if (foundation) {
      setGame(move(game, source, foundation));
    } else if (source.kind === "cascade" && source.index === game.cascades[source.col].length - 1) {
      const slot = firstFreeCell(game);
      if (slot >= 0) setGame(move(game, source, { kind: "cell", slot }));
    }
    setSelected(null);
  };

  return (
    <Window id="freecell" title={t("freecell")} icon={meta.icon} width={meta.width} height={meta.height}>
      <div className="solitaire freecell" data-testid="freecell" onClick={() => setSelected(null)}>
        <div className="freecell__top">
          {game.cells.map((card, slot) => {
            const source: Source = { kind: "cell", slot };
            return (
              <div className="solitaire__pile" key={`cell-${slot}`}>
                {card ? (
                  <PlayingCard
                    card={card}
                    selected={sameSource(selected, source)}
                    onClick={() => pick(source, undefined)}
                    onDoubleClick={() => autoSend(source)}
                    testId={`freecell-cell-${slot}`}
                  />
                ) : (
                  <CardSlot onClick={() => drop({ kind: "cell", slot })} testId={`freecell-cell-${slot}`} />
                )}
              </div>
            );
          })}
          <div className="solitaire__spacer" />
          {game.foundations.map((pile, index) => (
            <div className="solitaire__pile" key={`f-${index}`}>
              {pile.length > 0 ? (
                <PlayingCard
                  card={pile[pile.length - 1]}
                  onClick={() => drop({ kind: "foundation", pile: index })}
                  testId={`freecell-foundation-${index}`}
                />
              ) : (
                <CardSlot label="A" onClick={() => drop({ kind: "foundation", pile: index })} testId={`freecell-foundation-${index}`} />
              )}
            </div>
          ))}
        </div>

        <div className="freecell__cascades">
          {game.cascades.map((pile, col) => {
            const target: Target = { kind: "cascade", col };
            return (
              <div
                className="solitaire__column"
                key={col}
                style={{ height: Math.max(76, (pile.length - 1) * STEP + 76) }}
                data-testid={`freecell-column-${col}`}
              >
                {pile.length === 0 && <CardSlot onClick={() => drop(target)} testId={`freecell-empty-${col}`} />}
                {pile.map((card, index) => {
                  const source: Source = { kind: "cascade", col, index };
                  return (
                    <PlayingCard
                      key={`${card.suit}${card.rank}`}
                      card={card}
                      top={index * STEP}
                      selected={Boolean(selected) && selected!.kind === "cascade" && selected!.col === col && index >= selected!.index}
                      onClick={() => pick(source, target)}
                      onDoubleClick={() => autoSend(source)}
                      testId={`freecell-card-${col}-${index}`}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="solitaire__bar">
          <button
            type="button"
            onClick={() => {
              setGame(newGame());
              setSelected(null);
            }}
            data-testid="freecell-new"
          >
            {t("newGame")}
          </button>
          <span>
            {t("moves")}: {game.moves}
          </span>
          {won && (
            <strong role="status" data-testid="freecell-won">
              {t("youWon")}
            </strong>
          )}
        </div>
      </div>
    </Window>
  );
}

export default FreeCellWindow;
