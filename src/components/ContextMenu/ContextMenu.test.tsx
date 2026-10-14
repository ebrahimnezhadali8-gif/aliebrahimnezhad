import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ContextMenu from "./ContextMenu";

type Handler = () => void;

const labels = {
  showIcons: "Show desktop icons",
  nextBackground: "Next background",
  refresh: "Refresh",
};

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
      labels={labels}
    />
  );
}

describe("ContextMenu", () => {
  it("renders nothing when state is null", () => {
    renderMenu({ state: null });
    expect(screen.queryByTestId("desktop-context-menu")).not.toBeInTheDocument();
  });

  it("uses the labels it is given rather than hard-coded English", () => {
    render(
      <ContextMenu
        state={{ x: 10, y: 10 }}
        onClose={vi.fn()}
        iconsVisible
        onToggleIcons={vi.fn()}
        onNextBackground={vi.fn()}
        onRefresh={vi.fn()}
        labels={{ showIcons: "نمایش آیکون‌ها", nextBackground: "پس‌زمینه‌ی بعدی", refresh: "تازه‌سازی" }}
      />
    );
    expect(screen.getByText("نمایش آیکون‌ها")).toBeInTheDocument();
    expect(screen.getByText("پس‌زمینه‌ی بعدی")).toBeInTheDocument();
    expect(screen.getByText("تازه‌سازی")).toBeInTheDocument();
  });

  it("calls onToggleIcons and closes when the show-icons item is clicked", () => {
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
        labels={labels}
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

  it("calls onRefresh when 'Refresh' is clicked", () => {
    const onRefresh = vi.fn();
    renderMenu({ onRefresh });
    fireEvent.click(screen.getByText("Refresh"));
    expect(onRefresh).toHaveBeenCalledTimes(1);
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