import { useState } from "react";
import Window from "../Window/Window";
import { useContent } from "../../hooks/useContent";
import { windowMeta } from "../../config/siteConfig";
import "./RecycleBinWindow.css";

/** Joke contents of the Recycle Bin: things every developer has "deleted". */
const DELETED_FILES = [
  { name: "my_first_hello_world.exe", size: "12 KB", note: "It compiled once. We don't talk about it." },
  { name: "TODO_final_FINAL_v3.docx", size: "48 KB", note: "Version 3 of 'final'." },
  { name: "stackoverflow_copy_paste.txt", size: "2 KB", note: "Credited, honestly." },
  { name: "ie6_support.dll", size: "9.1 MB", note: "Rest in peace." },
  { name: "node_modules", size: "4.2 GB", note: "Heaviest object in the known universe." },
  { name: "bugs_before_review.zip", size: "∞", note: "Fixed. Probably." },
  { name: "left-pad.js", size: "1 KB", note: "11 lines that broke the internet." },
] as const;

const NOPE_MESSAGES = [
  "Nice try — these files are too funny to delete.",
  "Access denied: the bin is protected by the Fun Act of 2009.",
  "Still not empty. Nothing is ever really deleted on the internet.",
];

/** Desktop Recycle Bin easter egg. */
function RecycleBinWindow() {
  const meta = windowMeta.recycle;
  const { t } = useContent();
  const [attempts, setAttempts] = useState(0);

  return (
    <Window id="recycle" title={t("recycleBin")} icon={meta.icon} width={meta.width} height={meta.height}>
      <div className="recycle" data-testid="recycle-window">
        <div className="recycle__bar">
          <button
            type="button"
            className="recycle__empty"
            onClick={() => setAttempts((n) => n + 1)}
            data-testid="recycle-empty"
          >
            {t("emptyRecycleBin")}
          </button>
          {attempts > 0 && (
            <span className="recycle__nope" role="status" data-testid="recycle-nope">
              {NOPE_MESSAGES[(attempts - 1) % NOPE_MESSAGES.length]}
            </span>
          )}
        </div>
        <ul className="recycle__list">
          {DELETED_FILES.map((file) => (
            <li key={file.name} className="recycle__item">
              <span className="recycle__name">{file.name}</span>
              <span className="recycle__size">{file.size}</span>
              <span className="recycle__note">{file.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </Window>
  );
}

export default RecycleBinWindow;
