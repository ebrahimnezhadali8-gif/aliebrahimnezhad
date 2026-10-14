import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ContextMenu from "./ContextMenu";

type Handler = () => void;

interface Overrides {
  state?: { x: number; y: number } | null;
  iconsVisible?: boolean;
  onToggleIcons?: Handler;
  onNextBackground?: Handler;
  onRefresh?: Handler;
  onClose?: Handler;
}

function renderMenu(overrides: Overrides = {}) {
  return render(
    <ContextMenu
      state={overrides.state === undefined ? { x: 10, y: 10 } : overrides.state}
      onClose={overrides.onClose ?? vi.fn()}
      iconsVisible={overrides.iconsVisible ?? true}
      onToggleIcons={overrides.onToggleIcons ?? vi.fn()}
      onNextBackground={overrides.onNextBackground ?? vi.fn()}
      onRefresh={overrides.onRefresh ?? vi.fn()}
    />
  );
}

describe("ContextMenu", () => {
  it("renders nothing when state is null", () => {
    renderMenu({ state: null });
    expect(screen.queryByTestId("desktop-context-menu")).not.toBeInTheDocument();
  });

  it("calls onToggleIcons and closes when 'Show desktop icons' is clicked", () => {
    const onToggleIcons = vi.fn();
    const onClose = vi.fn();
    renderMenu({ onToggleIcons, onClose });
    fireEvent.click(screen.getByText("Show desktop icons"));
    expect(onToggleIcons).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows a checkmark only when iconsVisible is true", () => {
    const { rerender } = renderMenu({ iconsVisible: true });
    expect(screen.getByRole("menuitemcheckbox")).toHaveAttribute("aria-checked", "true");

    rerender(
      <ContextMenu
        state={{ x: 10, y: 10 }}
        onClose={vi.fn()}
        iconsVisible={false}
        onToggleIcons={vi.fn()}
        onNextBackground={vi.fn()}
        onRefresh={vi.fn()}
      />
    );
    expect(screen.getByRole("menuitemcheckbox")).toHaveAttribute("aria-checked", "false");
  });

  it("calls onNextBackground when 'Next background' is clicked", () => {
    const onNextBackground = vi.fn();
    renderMenu({ onNextBackground });
    fireEvent.click(screen.getByText("Next background"));
    expect(onNextBackground).toHaveBeenCalledTimes(1);
  });

  it("keeps itself inside the viewport when opened near the bottom-right corner", () => {
    renderMenu({ state: { x: window.innerWidth, y: window.innerHeight } });
    const menu = screen.getByTestId("desktop-context-menu");
    const left = Number.parseFloat(menu.style.left);
    const top = Number.parseFloat(menu.style.top);
    expect(left).toBeLessThan(window.innerWidth);
    expect(top).toBeLessThan(window.innerHeight);
  });
});
