import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import DesktopIcons from "./DesktopIcons";
import Window from "../Window/Window";
import { renderWithProviders } from "../../test/testUtils";
import type { DesktopItem } from "../../types";

const items: DesktopItem[] = [
  { id: "resume", label: "resume.pdf", icon: "pdf", type: "window", target: "resume" },
  { id: "github", label: "github", icon: "github", type: "link", target: "github" },
];

describe("DesktopIcons", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("opens the matching window when a 'window' item is clicked", () => {
    renderWithProviders(
      <>
        <DesktopIcons items={items} />
        <Window id="resume" title="resume.pdf" icon="pdf">
          <p>PDF body</p>
        </Window>
      </>
    );
    fireEvent.click(screen.getByTestId("desktop-icon-resume"));
    expect(screen.getByTestId("window-resume")).toBeInTheDocument();
  });

  it("opens an external link (not a window) for a 'link' item", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    renderWithProviders(<DesktopIcons items={items} />);
    fireEvent.click(screen.getByTestId("desktop-icon-github"));
    expect(openSpy).toHaveBeenCalled();
  });

  it("renders nothing when visible=false (the 'Show desktop icons' toggle is off)", () => {
    renderWithProviders(<DesktopIcons items={items} visible={false} />);
    expect(screen.queryByTestId("desktop-icons")).not.toBeInTheDocument();
  });

  it("renders icons when visible=true (default)", () => {
    renderWithProviders(<DesktopIcons items={items} />);
    expect(screen.getByTestId("desktop-icons")).toBeInTheDocument();
  });

  it("renders one icon per configured item, in order", () => {
    renderWithProviders(<DesktopIcons items={items} />);
    const icons = screen.getByTestId("desktop-icons").querySelectorAll(".desktop-icon");
    expect(icons).toHaveLength(items.length);
    expect(icons[0]).toHaveAttribute("data-testid", "desktop-icon-resume");
    expect(icons[1]).toHaveAttribute("data-testid", "desktop-icon-github");
  });

  it("selects the clicked icon and highlights it", () => {
    renderWithProviders(<DesktopIcons items={items} />);
    const icon = screen.getByTestId("desktop-icon-resume");
    expect(icon.className).not.toMatch(/desktop-icon--selected/);
    fireEvent.click(icon);
    expect(icon.className).toMatch(/desktop-icon--selected/);
  });

  it("icons are laid out by CSS flow, so their position is not scripted", () => {
    renderWithProviders(<DesktopIcons items={items} />);
    // No inline left/top: the grid in DesktopIcons.css owns placement, which is
    // why icons can no longer be dragged around individually.
    for (const item of items) {
      expect(screen.getByTestId(`desktop-icon-${item.id}`).style.left).toBe("");
      expect(screen.getByTestId(`desktop-icon-${item.id}`).style.top).toBe("");
    }
  });

  it("does not move an icon when it is dragged across the desktop", () => {
    renderWithProviders(<DesktopIcons items={items} />);
    const icon = screen.getByTestId("desktop-icon-resume");
    const before = icon.className;

    fireEvent.mouseDown(icon, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(window, { clientX: 600, clientY: 500 });
    fireEvent.mouseUp(window);

    expect(icon.className).not.toMatch(/dragging/);
    expect(icon.style.left).toBe("");
    expect(icon.style.top).toBe("");
    expect(icon.className).toBe(before);
  });
});
