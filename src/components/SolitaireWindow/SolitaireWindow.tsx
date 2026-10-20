import { useState } from "react";
import Window from "../Window/Window";
import { CardSlot, PlayingCard } from "../Cards/PlayingCard";
import {
  autoFoundationTarget,
  canMove,
  drawStock,
  isWon,
  move,
  newGame,
  type SolitaireState,
  type Source,
  type Target,
} from "./solitaireLogic";
import { windowMeta } from "../../config/siteConfig";
import { useContent } from "../../hooks/useContent";
import "./SolitaireWindow.css";

const FACE_DOWN_STEP = 12;
const FACE_UP_STEP = 24;

/** Klondike Solitaire. Click a card (or run) to pick it up, then click where it should go; double-click sends a card to a foundation. */
function SolitaireWindow() {
  const meta = windowMeta.solitaire;
  const { t } = useContent();
  const [game, setGame] = useState<SolitaireState>(() => newGame());
  const [selected, setSelected] = useState<Source | null>(null);
  const won = isWon(game);

  const sameSource = (a: Source | null, b: Source) =>
    Boolean(a) &&
    a!.kind === b.kind &&
    (a as { col?: number }).col === (b as { col?: number }).col &&
    (a as { index?: number }).index === (b as { index?: number }).index &&
    (a as { pile?: number }).pile === (b as { pile?: number }).pile;

  const dropOn = (target: Target) => {
    if (!selected) return;
    if (canMove(game, selected, target)) setGame(move(game, selected, target));
    setSelected(null);
  };

  const pick = (source: Source, target?: Target) => {
    if (selected && !sameSource(selected, source) && target && canMove(game, selected, target)) {
      dropOn(target);
      return;
    }
    setSelected(sameSource(selected, source) ? null : source);
  };

  const autoSend = (source: Source) => {
    const target = autoFoundationTarget(game, source);
    if (target) setGame(move(game, source, target));
    setSelected(null);
  };

  const restart = () => {
    setGame(newGame());
    setSelected(null);
  };

  return (
    <Window id="solitaire" title={t("solitaire")} icon={meta.icon} width={meta.width} height={meta.height}>
      <div className="solitaire" data-testid="solitaire" onClick={() => setSelected(null)}>
        <div className="solitaire__top">
          <div className="solitaire__pile">
            {game.stock.length > 0 ? (
              <PlayingCard
                card={{ suit: "S", rank: 1, faceUp: false }}
                onClick={() => {
                  setSelected(null);
                  setGame(drawStock(game));
                }}
                testId="solitaire-stock"
              />
            ) : (
              <CardSlot
                label="↺"
                onClick={() => {
                  setSelected(null);
                  setGame(drawStock(game));
                }}
                testId="solitaire-stock"
              />
            )}
          </div>
          <div className="solitaire__pile">
            {game.waste.length > 0 ? (
              <PlayingCard
                card={game.waste[game.waste.length - 1]}
                selected={sameSource(selected, { kind: "waste" })}
                onClick={() => pick({ kind: "waste" })}
                onDoubleClick={() => autoSend({ kind: "waste" })}
                testId="solitaire-waste"
              />
            ) : (
              <CardSlot testId="solitaire-waste-empty" />
            )}
          </div>
          <div className="solitaire__spacer" />
          {game.foundations.map((pile, index) => {
            const target: Target = { kind: "foundation", pile: index };
            return (
              <div className="solitaire__pile" key={index}>
                {pile.length > 0 ? (
                  <PlayingCard
                    card={pile[pile.length - 1]}
                    onClick={() => (selected ? dropOn(target) : undefined)}
                    testId={`solitaire-foundation-${index}`}
                  />
                ) : (
                  <CardSlot label="A" onClick={() => dropOn(target)} testId={`solitaire-foundation-${index}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="solitaire__tableau">
          {game.tableau.map((pile, col) => {
            const target: Target = { kind: "tableau", col };
            let offset = 0;
            const offsets = pile.map((card) => {
              const current = offset;
              offset += card.faceUp ? FACE_UP_STEP : FACE_DOWN_STEP;
              return current;
            });
            return (
              <div
                className="solitaire__column"
                key={col}
                style={{ height: Math.max(76, (offsets[offsets.length - 1] ?? 0) + 76) }}
                data-testid={`solitaire-column-${col}`}
              >
                {pile.length === 0 && <CardSlot label="K" onClick={() => dropOn(target)} testId={`solitaire-empty-${col}`} />}
                {pile.map((card, index) => {
                  const source: Source = { kind: "tableau", col, index };
                  return (
                    <PlayingCard
                      key={`${card.suit}${card.rank}`}
                      card={card}
                      top={offsets[index]}
                      selected={Boolean(selected) && selected!.kind === "tableau" && selected!.col === col && index >= selected!.index}
                      onClick={() => {
                        if (!card.faceUp) return;
                        pick(source, target);
                      }}
                      onDoubleClick={() => autoSend(source)}
                      testId={`solitaire-card-${col}-${index}`}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="solitaire__bar">
          <button type="button" onClick={restart} data-testid="solitaire-new">
            {t("newGame")}
          </button>
          <span data-testid="solitaire-moves">
            {t("moves")}: {game.moves}
          </span>
          {won && (
            <strong role="status" data-testid="solitaire-won">
              {t("youWon")}
            </strong>
          )}
        </div>
      </div>
    </Window>
  );
}

export default SolitaireWindow;
