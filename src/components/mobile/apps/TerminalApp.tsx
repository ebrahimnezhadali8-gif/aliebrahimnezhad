import { useEffect, useRef, useState } from "react";
import AppScreen from "../AppScreen/AppScreen";
import { runCommand } from "../../CmdWindow/cmdLogic";
import { useContent } from "../../../hooks/useContent";
import "./TerminalApp.css";

const PROMPT = "guest$";

interface Line {
  id: number;
  text: string;
  prompt?: boolean;
}

/** The same little shell as the Windows CMD window, on a phone-sized screen. */
function TerminalApp({ onBack }: { onBack: () => void }) {
  const { t } = useContent();
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const nextId = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  const submit = () => {
    const raw = input;
    const push = (text: string, prompt = false): Line => ({ id: nextId.current++, text, prompt });
    const result = runCommand(raw);
    if (result.type === "clear") {
      setLines([]);
    } else if (result.type === "exit") {
      onBack();
    } else {
      setLines((current) => [
        ...current,
        push(`${PROMPT} ${raw}`, true),
        ...result.lines.map((text) => push(text)),
      ]);
    }
    setInput("");
  };

  return (
    <AppScreen title={t("terminalApp")} onBack={onBack} variant="dark" noPadding>
      <div
        className="terminal-app"
        data-testid="mobile-terminal"
        onClick={(e) => e.currentTarget.querySelector("input")?.focus()}
      >
        <div className="terminal-app__body" ref={bodyRef}>
          <div className="terminal-app__line">Type &apos;help&apos; for a list of commands.</div>
          {lines.map((line) => (
            <div key={line.id} className={`terminal-app__line ${line.prompt ? "terminal-app__line--prompt" : ""}`}>
              {line.text}
            </div>
          ))}
          <form
            className="terminal-app__inputline"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <span className="terminal-app__prompt">{PROMPT}</span>
            <input
              className="terminal-app__input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              aria-label="Command input"
              data-testid="mobile-terminal-input"
            />
          </form>
        </div>
      </div>
    </AppScreen>
  );
}

export default TerminalApp;
