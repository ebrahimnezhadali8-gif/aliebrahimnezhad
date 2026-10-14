import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import MobileApp from "./MobileApp";
import { DesktopSettingsProvider } from "../../context/DesktopSettingsContext";
import { APP_TITLES, homeScreenApps } from "./mobileTypes";

function renderApp() {
  return render(
    <DesktopSettingsProvider>
      <MobileApp />
    </DesktopSettingsProvider>
  );
}

/** Boots past the iPhone splash animation and lands on the home screen. */
function bootToHome() {
  vi.useFakeTimers();
  renderApp();
  expect(screen.getByTestId("mobile-boot-screen")).toBeInTheDocument();
  act(() => {
    vi.advanceTimersByTime(2200 + 500);
  });
}

describe("MobileApp", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("splash screen", () => {
    it("shows the Apple logo and a loading bar while starting up", () => {
      vi.useFakeTimers();
      renderApp();
      const boot = screen.getByTestId("mobile-boot-screen");
      expect(boot).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "Apple" })).toBeInTheDocument();
      expect(screen.getByRole("progressbar", { name: "Loading" })).toBeInTheDocument();
    });

    it("hands over to the home screen once boot completes", () => {
      bootToHome();
      expect(screen.queryByTestId("mobile-boot-screen")).not.toBeInTheDocument();
      expect(screen.getByTestId("mobile-home-screen")).toBeInTheDocument();
    });
  });

  describe("no device frame", () => {
    it("does not render a fake phone body around the screen", () => {
      bootToHome();
      expect(screen.queryByTestId("mobile-frame")).not.toBeInTheDocument();
      expect(document.querySelector(".mobile-frame__body")).toBeNull();
      expect(document.querySelector(".mobile-frame__screen")).toBeNull();
    });

    it("the UI fills the viewport directly", () => {
      bootToHome();
      expect(screen.getByTestId("mobile-root")).toBeInTheDocument();
    });

    it("exposes an iOS-style home indicator instead of a hardware Home button", () => {
      bootToHome();
      const indicator = screen.getByRole("button", { name: "Home" });
      expect(indicator).toHaveClass("mobile-root__home-indicator");
    });
  });

  describe("home screen icons", () => {
    it("renders every configured app icon with its label", () => {
      bootToHome();
      for (const item of homeScreenApps) {
        expect(screen.getByTestId(`app-icon-${item.id}`)).toBeInTheDocument();
        expect(screen.getByText(item.label)).toBeInTheDocument();
      }
    });

    it("uses iOS tiles: system apps get a coloured tile, brand apps get their real logo", () => {
      bootToHome();
      const notes = screen.getByTestId("app-icon-notes");
      expect(notes).toHaveClass("app-icon--system");
      const notesTile = notes.querySelector(".app-icon__tile") as HTMLElement;
      expect(notesTile.style.background).toContain("gradient");

      const github = screen.getByTestId("app-icon-github");
      expect(github).toHaveClass("app-icon--brand");
      expect(github.querySelector(".app-icon__tile svg")).toBeInTheDocument();
    });

    it("shows the four dock apps", () => {
      bootToHome();
      const dock = screen.getByTestId("mobile-dock");
      expect(dock.querySelectorAll(".app-icon")).toHaveLength(4);
    });
  });

  describe("paging", () => {
    it("splits the apps across pages with one dot per page", () => {
      bootToHome();
      const pages = screen.getAllByRole("tab");
      expect(pages.length).toBeGreaterThan(1);
      expect(pages[0]).toHaveAttribute("aria-selected", "true");
      expect(pages[1]).toHaveAttribute("aria-selected", "false");
    });

    it("tapping a dot switches to that page", () => {
      bootToHome();
      fireEvent.click(screen.getByRole("tab", { name: "Page 2" }));
      expect(screen.getByRole("tab", { name: "Page 2" })).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("navigation", () => {
    it("tapping the Notes icon opens the Notes app, and Back returns home", () => {
      bootToHome();
      fireEvent.click(screen.getByTestId("app-icon-notes"));
      expect(screen.getByTestId("app-screen-notes")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: /back to home/i }));
      expect(screen.queryByTestId("app-screen-notes")).not.toBeInTheDocument();
    });

    it("the home indicator returns to the home screen from any app", () => {
      bootToHome();
      fireEvent.click(screen.getByTestId("app-icon-calculator"));
      expect(screen.getByTestId("mobile-calculator-display")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Home" }));
      expect(screen.queryByTestId("mobile-calculator-display")).not.toBeInTheDocument();
      expect(screen.getByTestId("mobile-home-screen")).toBeInTheDocument();
    });

    it("every app id has a human-readable title", () => {
      for (const id of Object.keys(APP_TITLES) as Array<keyof typeof APP_TITLES>) {
        expect(APP_TITLES[id].length).toBeGreaterThan(0);
      }
    });

    it("tapping a link icon opens an external tab instead of an app screen", () => {
      const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
      bootToHome();
      fireEvent.click(screen.getByTestId("app-icon-github"));
      expect(openSpy).toHaveBeenCalledWith(expect.stringContaining("http"), "_blank", "noopener");
    });

    it("the Mail app is reachable from the dock and can really compose a message", () => {
      bootToHome();
      fireEvent.click(screen.getByTestId("app-icon-dock-mail"));
      expect(screen.getByTestId("mail-compose")).toBeInTheDocument();
      expect(screen.getByTestId("mail-send")).toHaveAttribute("href");
    });
  });

  describe("control center", () => {
    it("is closed on the home screen", () => {
      bootToHome();
      expect(screen.queryByTestId("mobile-control-center")).not.toBeInTheDocument();
    });

    it("pulls down when the status bar is tapped", () => {
      bootToHome();
      fireEvent.click(screen.getByRole("button", { name: "Open Control Center" }));
      expect(screen.getByTestId("mobile-control-center")).toBeInTheDocument();
    });

    it("is keyboard reachable from the status bar", () => {
      bootToHome();
      fireEvent.keyDown(screen.getByRole("button", { name: "Open Control Center" }), { key: "Enter" });
      expect(screen.getByTestId("mobile-control-center")).toBeInTheDocument();
    });

    it("pulls down with a drag from the very top edge, like a real phone", () => {
      bootToHome();
      const root = screen.getByTestId("mobile-root");

      // A drag that starts below the top edge must NOT trigger it.
      fireEvent.pointerDown(root, { clientY: 300 });
      fireEvent.pointerMove(root, { clientY: 500 });
      expect(screen.queryByTestId("mobile-control-center")).not.toBeInTheDocument();

      fireEvent.pointerDown(root, { clientY: 4 });
      fireEvent.pointerMove(root, { clientY: 80 });
      expect(screen.getByTestId("mobile-control-center")).toBeInTheDocument();
    });

    it("an upward drag from the top edge does not open it", () => {
      bootToHome();
      const root = screen.getByTestId("mobile-root");
      fireEvent.pointerDown(root, { clientY: 4 });
      fireEvent.pointerMove(root, { clientY: 0 });
      expect(screen.queryByTestId("mobile-control-center")).not.toBeInTheDocument();
    });

    it("brightness adjusted from the control center dims the whole screen", () => {
      bootToHome();
      fireEvent.click(screen.getByRole("button", { name: "Open Control Center" }));
      expect(screen.queryByTestId("screen-dimmer")).not.toBeInTheDocument();

      fireEvent.change(screen.getByLabelText("Screen brightness"), { target: { value: "50" } });
      const dimmer = screen.getByTestId("screen-dimmer");
      expect(Number.parseFloat(dimmer.style.opacity)).toBeCloseTo(0.5);
    });

    it("the volume slider controls the real volume setting", () => {
      bootToHome();
      fireEvent.click(screen.getByRole("button", { name: "Open Control Center" }));
      fireEvent.change(screen.getByLabelText("Volume"), { target: { value: "40" } });
      expect(window.localStorage.getItem("portfolio:volume")).toBe("0.4");
    });

    it("returning home dismisses the control center", () => {
      bootToHome();
      fireEvent.click(screen.getByRole("button", { name: "Open Control Center" }));
      expect(screen.getByTestId("mobile-control-center")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Home" }));
      expect(screen.queryByTestId("mobile-control-center")).not.toBeInTheDocument();
    });
  });
});
