import { siteConfig } from "../../config/siteConfig";

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
  "  cls       Clear the screen",
  "  exit      Close the window",
];

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

  switch (command) {
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
