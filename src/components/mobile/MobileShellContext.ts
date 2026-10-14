import { createContext, useContext } from "react";

interface MobileShell {
  /** Opens the Settings app from anywhere (the status-bar gear). */
  openSettings: () => void;
}

export const MobileShellContext = createContext<MobileShell | null>(null);

export function useMobileShell(): MobileShell | null {
  return useContext(MobileShellContext);
}
