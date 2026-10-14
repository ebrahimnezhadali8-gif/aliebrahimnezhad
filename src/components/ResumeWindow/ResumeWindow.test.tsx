import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useEffect, type ReactNode } from "react";
import ResumeWindow from "./ResumeWindow";
import { useWindowManager } from "../../context/WindowManagerContext";
import { renderWithProviders } from "../../test/testUtils";

function OpenOnMount({ id, children }: { id: string; children?: ReactNode }) {
  const { openWindow } = useWindowManager();
  useEffect(() => {
    openWindow(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
}

describe("ResumeWindow", () => {
  it("shows an iframe pointing at /resume.pdf once opened", () => {
    renderWithProviders(
      <OpenOnMount id="resume">
        <ResumeWindow />
      </OpenOnMount>
    );
    expect(screen.getByTestId("window-resume")).toBeInTheDocument();
    expect(screen.getByTitle("resume")).toHaveAttribute("src", "/resume.pdf");
  });

  it("zoom in / zoom out buttons update the displayed percentage", () => {
    renderWithProviders(
      <OpenOnMount id="resume">
        <ResumeWindow />
      </OpenOnMount>
    );
    expect(screen.getByTestId("zoom-pct").textContent).toBe("100%");
    fireEvent.click(screen.getByTitle("Zoom in"));
    expect(screen.getByTestId("zoom-pct").textContent).toBe("110%");
    fireEvent.click(screen.getByTitle("Zoom out"));
    fireEvent.click(screen.getByTitle("Zoom out"));
    expect(screen.getByTestId("zoom-pct").textContent).toBe("90%");
  });

  it("'Fit' resets zoom back to 100%", () => {
    renderWithProviders(
      <OpenOnMount id="resume">
        <ResumeWindow />
      </OpenOnMount>
    );
    fireEvent.click(screen.getByTitle("Zoom in"));
    fireEvent.click(screen.getByTitle("Zoom in"));
    fireEvent.click(screen.getByTitle("Fit to page"));
    expect(screen.getByTestId("zoom-pct").textContent).toBe("100%");
  });
});
