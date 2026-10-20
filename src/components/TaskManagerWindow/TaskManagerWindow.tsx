import { useEffect, useState } from "react";
import Window from "../Window/Window";
import { useWindowManager } from "../../context/WindowManagerContext";
import { useContent, useWindowTitle } from "../../hooks/useContent";
import { windowMeta } from "../../config/siteConfig";
import { JOKE_PROCESSES, nextSample, pushHistory, toPoints } from "./perfSim";
import "./TaskManagerWindow.css";

type Tab = "applications" | "processes" | "performance";

/**
 * A joke Task Manager that is also genuinely useful: the Applications tab lists
 * the open windows and "End Task" really closes one, which helps when a window is stuck.
 */
function TaskManagerWindow() {
  const meta = windowMeta.taskmgr;
  const { t } = useContent();
  const windowTitle = useWindowTitle();
  const { openWindows, closeWindow, focusWindow, openWindow } = useWindowManager();
  const [tab, setTab] = useState<Tab>("applications");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cpu, setCpu] = useState<number[]>([12]);
  const [mem, setMem] = useState<number[]>([41]);
  const isOpen = Boolean(openWindows.taskmgr);

  // Only sample while the window is open.
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCpu((history) => pushHistory(history, nextSample(history[history.length - 1] ?? 10)));
      setMem((history) => pushHistory(history, nextSample(history[history.length - 1] ?? 40, Math.random, 3)));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const apps = Object.keys(openWindows).filter((id) => id !== "taskmgr");
  const effectiveSelected = selectedId && apps.includes(selectedId) ? selectedId : null;
  const lastCpu = cpu[cpu.length - 1] ?? 0;
  const lastMem = mem[mem.length - 1] ?? 0;

  const tabs: { id: Tab; label: string }[] = [
    { id: "applications", label: t("tmApplications") },
    { id: "processes", label: t("tmProcesses") },
    { id: "performance", label: t("tmPerformance") },
  ];

  return (
    <Window id="taskmgr" title={t("taskmgr")} icon={meta.icon} width={meta.width} height={meta.height}>
      <div className="taskmgr" data-testid="taskmgr">
        <div className="taskmgr__tabs" role="tablist">
          {tabs.map((entry) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={tab === entry.id}
              className={tab === entry.id ? "is-active" : ""}
              onClick={() => setTab(entry.id)}
              data-testid={`taskmgr-tab-${entry.id}`}
            >
              {entry.label}
            </button>
          ))}
        </div>

        {tab === "applications" && (
          <div className="taskmgr__panel">
            <ul className="taskmgr__list" data-testid="taskmgr-apps">
              {apps.length === 0 && <li className="taskmgr__empty">{t("tmNoApps")}</li>}
              {apps.map((id) => (
                <li key={id}>
                  <button
                    type="button"
                    className={`taskmgr__row ${effectiveSelected === id ? "is-selected" : ""}`}
                    onClick={() => setSelectedId(id)}
                    data-testid={`taskmgr-app-${id}`}
                  >
                    <span>{windowTitle(id)}</span>
                    <span className="taskmgr__status">{openWindows[id].minimized ? t("tmMinimized") : t("tmRunning")}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="taskmgr__actions">
              <button type="button" disabled={!effectiveSelected} onClick={() => effectiveSelected && focusWindow(effectiveSelected)}>
                {t("tmSwitchTo")}
              </button>
              <button
                type="button"
                disabled={!effectiveSelected}
                onClick={() => effectiveSelected && closeWindow(effectiveSelected)}
                data-testid="taskmgr-end"
              >
                {t("tmEndTask")}
              </button>
              <button type="button" onClick={() => openWindow("cmd")}>
                {t("tmNewTask")}
              </button>
            </div>
          </div>
        )}

        {tab === "processes" && (
          <div className="taskmgr__panel">
            <table className="taskmgr__table">
              <thead>
                <tr>
                  <th>{t("tmName")}</th>
                  <th>CPU</th>
                  <th>{t("tmMemory")}</th>
                  <th>{t("tmDescription")}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ...apps.map((id) => ({
                    name: `${id}.exe`,
                    description: windowTitle(id),
                    cpu: 1,
                    memoryMb: 24,
                  })),
                  ...JOKE_PROCESSES,
                ].map((process) => (
                  <tr key={process.name}>
                    <td>{process.name}</td>
                    <td>{process.cpu}%</td>
                    <td>{process.memoryMb} MB</td>
                    <td>{process.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "performance" && (
          <div className="taskmgr__panel taskmgr__perf" data-testid="taskmgr-performance">
            {[
              { label: "CPU", history: cpu, value: lastCpu },
              { label: t("tmMemory"), history: mem, value: lastMem },
            ].map((graph) => (
              <figure key={graph.label} className="taskmgr__graph">
                <figcaption>
                  {graph.label}: <strong>{graph.value}%</strong>
                </figcaption>
                <svg viewBox="0 0 590 80" preserveAspectRatio="none" role="img" aria-label={`${graph.label} ${graph.value}%`}>
                  <rect width="590" height="80" fill="#04140a" />
                  {[20, 40, 60].map((y) => (
                    <line key={y} x1="0" x2="590" y1={y} y2={y} stroke="#0c4a24" strokeWidth="1" />
                  ))}
                  <polyline points={toPoints(graph.history, 590, 80)} fill="none" stroke="#3dff7a" strokeWidth="1.8" />
                </svg>
              </figure>
            ))}
          </div>
        )}

        <div className="taskmgr__status-bar">
          {t("tmProcesses")}: {apps.length + JOKE_PROCESSES.length} · CPU: {lastCpu}% · {t("tmMemory")}: {lastMem}%
        </div>
      </div>
    </Window>
  );
}

export default TaskManagerWindow;
