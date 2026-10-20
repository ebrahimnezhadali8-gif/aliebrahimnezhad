import { useEffect, useRef, useState } from "react";
import Window from "../Window/Window";
import {
  BURN_ITEMS,
  DISC_CAPACITY_MB,
  UNDERRUN_AT_PERCENT,
  canAdd,
  phaseFor,
  totalSize,
  usage,
  willUnderrun,
  type BurnItem,
} from "./neroLogic";
import { siteConfig, windowMeta } from "../../config/siteConfig";
import { useContent } from "../../hooks/useContent";
import { playChime, startMotor } from "../../utils/synth";
import "./NeroWindow.css";

type Stage = "compose" | "burning" | "done" | "failed";

const TICK_MS = 60;

/**
 * "Burn your résumé to a CD": drag the items you want onto the 700 MB disc and
 * press Burn. A nearly full disc fails with a classic buffer underrun.
 */
function NeroWindow() {
  const meta = windowMeta.nero;
  const { t } = useContent();
  const [items, setItems] = useState<BurnItem[]>([]);
  const [stage, setStage] = useState<Stage>("compose");
  const [percent, setPercent] = useState(0);
  const [rejected, setRejected] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const stopMotor = useRef<(() => void) | null>(null);

  const used = totalSize(items);
  const fill = usage(items);

  const add = (item: BurnItem) => {
    if (stage !== "compose") return;
    if (!canAdd(items, item)) {
      setRejected(items.some((existing) => existing.id === item.id) ? null : t("discFull"));
      return;
    }
    setRejected(null);
    setItems((current) => [...current, item]);
  };

  const remove = (id: string) => {
    if (stage !== "compose") return;
    setRejected(null);
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const burn = () => {
    if (items.length === 0 || stage !== "compose") return;
    setPercent(0);
    setStage("burning");
    stopMotor.current = startMotor();
  };

  // The burn itself: one percent per tick; a nearly full disc dies at 87 %.
  useEffect(() => {
    if (stage !== "burning") return;
    const doomed = willUnderrun(items);
    const timer = setInterval(() => {
      setPercent((current) => {
        const next = current + 1;
        if (doomed && next >= UNDERRUN_AT_PERCENT) {
          clearInterval(timer);
          setStage("failed");
          return UNDERRUN_AT_PERCENT;
        }
        if (next >= 100) {
          clearInterval(timer);
          setStage("done");
          return 100;
        }
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // Silence the motor and chime when the burn ends (or the window unmounts).
  useEffect(() => {
    if (stage === "done" || stage === "failed") {
      stopMotor.current?.();
      stopMotor.current = null;
      playChime(stage === "done" ? "success" : "error");
    }
  }, [stage]);

  useEffect(() => () => stopMotor.current?.(), []);

  const reset = () => {
    setItems([]);
    setPercent(0);
    setRejected(null);
    setStage("compose");
  };

  const phaseLabel = {
    preparing: t("phasePreparing"),
    writing: t("phaseWriting"),
    verifying: t("phaseVerifying"),
  }[phaseFor(percent)];

  return (
    <Window id="nero" title={t("nero")} icon={meta.icon} width={meta.width} height={meta.height}>
      <div className="nero" data-testid="nero" data-stage={stage}>
        <div className="nero__panes">
          <section className="nero__pane" aria-label={t("neroFiles")}>
            <h3>{t("neroFiles")}</h3>
            <ul className="nero__list">
              {BURN_ITEMS.map((item) => {
                const included = items.some((existing) => existing.id === item.id);
                return (
                  <li
                    key={item.id}
                    className={`nero__file ${included ? "is-included" : ""}`}
                    draggable={stage === "compose" && !included}
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", item.id)}
                  >
                    <span className="nero__name">{item.name}</span>
                    <span className="nero__size">{item.sizeMb} MB</span>
                    <button
                      type="button"
                      onClick={() => add(item)}
                      disabled={included || stage !== "compose"}
                      aria-label={`${t("add")} ${item.name}`}
                      data-testid={`nero-add-${item.id}`}
                    >
                      +
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section
            className={`nero__pane nero__drop ${dragOver ? "is-over" : ""}`}
            aria-label={t("neroDisc")}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const dropped = BURN_ITEMS.find((item) => item.id === e.dataTransfer.getData("text/plain"));
              if (dropped) add(dropped);
            }}
            data-testid="nero-drop"
          >
            <h3>{t("neroDisc")}</h3>
            <div className={`nero__cd ${stage === "burning" ? "is-spinning" : ""}`} aria-hidden="true" />
            {items.length === 0 ? (
              <p className="nero__hint">{t("dropHere")}</p>
            ) : (
              <ul className="nero__list">
                {items.map((item) => (
                  <li key={item.id} className="nero__file">
                    <span className="nero__name">{item.name}</span>
                    <span className="nero__size">{item.sizeMb} MB</span>
                    <button type="button" onClick={() => remove(item.id)} aria-label={`${t("remove")} ${item.name}`} disabled={stage !== "compose"}>
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {rejected && (
              <p className="nero__error" role="alert" data-testid="nero-rejected">
                {rejected}
              </p>
            )}
          </section>
        </div>

        <div className="nero__capacity" data-testid="nero-capacity">
          <div className="nero__bar" role="progressbar" aria-valuemin={0} aria-valuemax={DISC_CAPACITY_MB} aria-valuenow={used}>
            <div className={`nero__bar-fill ${fill >= 0.9 ? "is-hot" : ""}`} style={{ width: `${fill * 100}%` }} />
          </div>
          <span className="nero__bar-label" data-testid="nero-used">
            {used} / {DISC_CAPACITY_MB} MB
          </span>
        </div>

        <div className="nero__footer">
          {stage === "compose" && (
            <button type="button" className="nero__burn" onClick={burn} disabled={items.length === 0} data-testid="nero-burn">
              🔥 {t("burn")}
            </button>
          )}

          {stage === "burning" && (
            <div className="nero__progress" data-testid="nero-progress">
              <div className="nero__bar">
                <div className="nero__bar-fill" style={{ width: `${percent}%` }} />
              </div>
              <span>
                {phaseLabel} — {percent}%
              </span>
            </div>
          )}

          {stage === "done" && (
            <div className="nero__result" role="status" data-testid="nero-done">
              <strong>✔ {t("burnDone")}</strong>
              <div className="nero__links">
                <a href="/resume.pdf" download="resume.pdf">
                  {t("downloadResume")}
                </a>
                <a href={`mailto:${siteConfig.email}`}>{t("contactMe")}</a>
                <button type="button" onClick={reset}>
                  {t("newGame")}
                </button>
              </div>
            </div>
          )}

          {stage === "failed" && (
            <div className="nero__result nero__result--error" role="alert" data-testid="nero-failed">
              <strong>✖ {t("bufferUnderrun")}</strong>
              <div className="nero__links">
                <button type="button" onClick={reset} data-testid="nero-retry">
                  {t("tryAgain")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Window>
  );
}

export default NeroWindow;
