import { useEffect, useRef, useState } from "react";
import Window from "../Window/Window";
import { runCommand } from "./cmdLogic";
import { useWindowManager } from "../../context/WindowManagerContext";
import { siteConfig, windowMeta } from "../../config/siteConfig";
import "./CmdWindow.css";

const PROMPT = "C:\\Users\\Guest>";

interface HistoryLine {
  id: number;
  text: string;
  kind: "prompt" | "output";
}

function CmdWindow() {
  const meta = windowMeta.cmd;
  const { closeWindow, openWindows } = useWindowManager();
  const isOpen = Boolean(openWindows.cmd) && !openWindows.cmd.minimized;
  const [history, setHistory] = useState<HistoryLine[]>([]);
  const [input, setInput] = useState("");
  const nextId = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [history]);

  const pushLine = (text: string, kind: HistoryLine["kind"]) => {
    setHistory((prev) => [...prev, { id: nextId.current++, text, kind }]);
  };

  const submit = (raw: string) => {
    pushLine(`${PROMPT} ${raw}`, "prompt");
    const result = runCommand(raw);
    if (result.type === "text") {
      result.lines.forEach((line) => pushLine(line, "output"));
    } else if (result.type === "clear") {
      setHistory([]);
    } else if (result.type === "exit") {
      closeWindow("cmd");
    }
    setInput("");
  };

  return (
    <Window id="cmd" title={meta.title} icon={meta.icon} width={meta.width} height={meta.height}>
      <div
        className="cmd-window"
        onClick={() => inputRef.current?.focus()}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className="cmd-window__body" ref={bodyRef} data-testid="cmd-body">
          <div className="cmd-window__banner" data-testid="cmd-banner">
            <div className="cmd-window__banner-border">
              ┌{"─".repeat(35)}┐
            </div>
            <div className="cmd-window__banner-name">{siteConfig.name}</div>
            <div className="cmd-window__banner-role">{siteConfig.role}</div>
            <div className="cmd-window__banner-border">
              └{"─".repeat(35)}┘
            </div>
          </div>
          <div className="cmd-window__hint">Type &apos;help&apos; for a list of commands.</div>
          {history.map((line) => (
            <div key={line.id} className={`cmd-window__line cmd-window__line--${line.kind}`}>
              {line.text}
            </div>
          ))}
          <div className="cmd-window__inputline">
            <span className="cmd-window__prompt">{PROMPT}</span>
            <input
              ref={inputRef}
              className="cmd-window__input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit(input);
              }}
              spellCheck={false}
              autoComplete="off"
              aria-label="Command input"
            />
            <span className="cmd-window__cursor" aria-hidden="true" />
          </div>
        </div>
      </div>
    </Window>
  );
}

export default CmdWindow;
