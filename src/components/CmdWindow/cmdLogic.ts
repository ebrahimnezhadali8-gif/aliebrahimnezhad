import { siteConfig } from "../../config/siteConfig";
import { sortedStats } from "../../utils/analytics";
import { loadRecords } from "../MinesweeperWindow/minesweeperLogic";

export type CmdResult =
  | { type: "text"; lines: string[] }
  | { type: "clear" }
  | { type: "exit" };

const HELP_LINES = [
  "Available commands:",
  "  help      Show this list of commands",
  "  user    Display the current user",
  "  ver       Show the shell version",
  "  date      Show the current date and time",
  "  dir       List files in the current folder",
  "  whoami    Show the signed-in user and their role",
  "  stats     Show which windows and apps were opened most",
  "  cls       Clear the screen",
  "  exit      Close the window",
];

const MATRIX_GLYPHS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄ0123456789";

/** Deterministic pseudo-random glyph rows, so the "matrix" output is testable. */
function matrixRows(rows = 8, cols = 36): string[] {
  let seed = 42;
  const next = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => MATRIX_GLYPHS[Math.floor(next() * MATRIX_GLYPHS.length)]).join("")
  );
}

/**
 * Interprets a single command line and returns what the terminal should do.
 * Pure and deterministic given `now`, so it's fully unit-testable.
 */
export function runCommand(rawInput: string, now: Date = new Date()): CmdResult {
  const input = rawInput.trim();
  const command = input.split(/\s+/)[0]?.toLowerCase() ?? "";

  if (command === "") {
    return { type: "text", lines: [] };
  }

  // Easter eggs — deliberately absent from `help`.
  if (input.toLowerCase().replace(/\s+/g, " ") === "sudo hire-me") {
    return {
      type: "text",
      lines: [
        "[sudo] password for guest: ********",
        "Permission granted.",
        "Drafting offer letter…  done.",
        `Sending to ${siteConfig.name}…`,
        `Reply to ${siteConfig.email} to make it official.`,
      ],
    };
  }

  switch (command) {
    case "matrix":
      return { type: "text", lines: [...matrixRows(), "Wake up, recruiter…", "Follow the white rabbit."] };

    case "halloffame": {
      const records = loadRecords();
      const entries = Object.entries(records);
      if (entries.length === 0) return { type: "text", lines: ["Hall of Fame is empty — win a game of Minesweeper!"] };
      return {
        type: "text",
        lines: ["Minesweeper — best times:", ...entries.map(([level, seconds]) => `  ${level.padEnd(14)} ${seconds}s`)],
      };
    }

    case "stats": {
      const stats = sortedStats();
      if (stats.length === 0) return { type: "text", lines: ["No activity recorded yet — open a window first."] };
      return {
        type: "text",
        lines: ["Most opened (this browser only):", ...stats.slice(0, 8).map(([name, count]) => `  ${String(count).padStart(3)}  ${name}`)],
      };
    }

    case "help":
      return { type: "text", lines: HELP_LINES };

    case "user":
    case "whoami":
      return { type: "text", lines: [siteConfig.name, siteConfig.role] };

    case "ver":
      return { type: "text", lines: ["Portfolio Shell [Version 1.0.0]"] };

    case "date":
      return { type: "text", lines: [now.toLocaleDateString(), now.toLocaleTimeString()] };

    case "dir":
      return {
        type: "text",
        lines: [
          " Directory of C:\\Users\\Guest",
          "",
          "  resume.pdf",
          "  projects",
          "  about-me.txt",
          "  skills.dat",
        ],
      };

    case "cls":
    case "clear":
      return { type: "clear" };

    case "exit":
      return { type: "exit" };

    default:
      return {
        type: "text",
        lines: [`'${command}' is not recognized as an internal or external command.`, "Type 'help' for a list of commands."],
      };
  }
}
