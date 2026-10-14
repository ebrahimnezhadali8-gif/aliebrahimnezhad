import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { WindowManagerProvider } from "../context/WindowManagerContext";
import { DesktopSettingsProvider } from "../context/DesktopSettingsContext";

/** Renders a component wrapped in the app's context providers, since most components consume window-manager / desktop-settings state via context. */
export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(
    <DesktopSettingsProvider>
      <WindowManagerProvider>{ui}</WindowManagerProvider>
    </DesktopSettingsProvider>,
    options
  );
}
