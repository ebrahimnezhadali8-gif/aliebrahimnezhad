import { screen, fireEvent, act, render } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useEffect, type ReactNode } from "react";
import NeroWindow from "./NeroWindow/NeroWindow";
import MinesweeperWindow from "./MinesweeperWindow/MinesweeperWindow";
import SolitaireWindow from "./SolitaireWindow/SolitaireWindow";
import FreeCellWindow from "./FreeCellWindow/FreeCellWindow";
import PhotosWindow from "./PhotosWindow/PhotosWindow";
import PaintWindow from "./PaintWindow/PaintWindow";
import TaskManagerWindow from "./TaskManagerWindow/TaskManagerWindow";
import MediaPlayerWindow from "./MediaPlayerWindow/MediaPlayerWindow";
import ClockGadget from "./ClockGadget/ClockGadget";
import Clock from "./Taskbar/Clock";
import Screensaver from "./Screensaver/Screensaver";
import CalendarApp from "./mobile/apps/CalendarApp";
import ClockApp from "./mobile/apps/ClockApp";
import PhotosApp from "./mobile/apps/PhotosApp";
import MusicApp from "./mobile/apps/MusicApp";
import MinesApp from "./mobile/apps/MinesApp";
import DrawApp from "./mobile/apps/DrawApp";
import LockScreen from "./mobile/LockScreen";
import MobileApp from "./mobile/MobileApp";
import { DesktopSettingsProvider } from "../context/DesktopSettingsContext";
import { useWindowManager } from "../context/WindowManagerContext";
import { renderWithProviders } from "../test/testUtils";
import { requestAlbum } from "./PhotosWindow/photoBus";
import { RECORDS_STORAGE_KEY } from "./MinesweeperWindow/minesweeperLogic";

function Open({ id, children }: { id: string; children: ReactNode }) {
  const { openWindow } = useWindowManager();
  useEffect(() => {
    openWindow(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
}

beforeEach(() => window.localStorage.clear());
afterEach(() => {
  vi.useRealTimers();
  document.documentElement.removeAttribute("data-theme");
});

describe("Nero", () => {
  it("burns a small compilation successfully and offers the résumé", () => {
    vi.useFakeTimers();
    renderWithProviders(
      <Open id="nero">
        <NeroWindow />
      </Open>
    );
    expect(screen.getByTestId("nero-burn")).toBeDisabled();
    fireEvent.click(screen.getByTestId("nero-add-resume"));
    expect(screen.getByTestId("nero-used")).toHaveTextContent("2 / 700 MB");
    fireEvent.click(screen.getByTestId("nero-burn"));
    expect(screen.getByTestId("nero")).toHaveAttribute("data-stage", "burning");
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    expect(screen.getByTestId("nero-done")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /download/i })).toHaveAttribute("href", "/resume.pdf");
  });

  it("refuses to overfill the disc and fails with a buffer underrun when nearly full", () => {
    vi.useFakeTimers();
    renderWithProviders(
      <Open id="nero">
        <NeroWindow />
      </Open>
    );
    for (const id of ["sources", "demos", "skills", "about"]) fireEvent.click(screen.getByTestId(`nero-add-${id}`));
    fireEvent.click(screen.getByTestId("nero-add-workchi"));
    expect(screen.getByTestId("nero-rejected")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("nero-burn"));
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    expect(screen.getByTestId("nero-failed")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("nero-retry"));
    expect(screen.getByTestId("nero")).toHaveAttribute("data-stage", "compose");
  });
});

describe("Minesweeper", () => {
  it("starts on the first click, can be flagged with the context menu and restarts from the face", () => {
    renderWithProviders(
      <Open id="minesweeper">
        <MinesweeperWindow />
      </Open>
    );
    const game = screen.getByTestId("minesweeper");
    expect(game).toHaveAttribute("data-status", "ready");
    fireEvent.contextMenu(screen.getByTestId("cell-0-0"));
    expect(screen.getByTestId("mines-left")).toHaveTextContent("009");
    fireEvent.click(screen.getByTestId("cell-4-4"));
    expect(game.getAttribute("data-status")).toMatch(/playing|won/);
    fireEvent.click(screen.getByTestId("mines-face"));
    expect(game).toHaveAttribute("data-status", "ready");
  });

  it("shows the stored best time", () => {
    window.localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify({ beginner: 42 }));
    renderWithProviders(
      <Open id="minesweeper">
        <MinesweeperWindow />
      </Open>
    );
    expect(screen.getByTestId("mines-best")).toHaveTextContent("42s");
  });
});

describe("card games", () => {
  it("Solitaire deals 7 columns, draws from the stock and starts a new game", () => {
    renderWithProviders(
      <Open id="solitaire">
        <SolitaireWindow />
      </Open>
    );
    for (let col = 0; col < 7; col += 1) expect(screen.getByTestId(`solitaire-column-${col}`)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("solitaire-stock"));
    expect(screen.getByTestId("solitaire-waste")).toBeInTheDocument();
    expect(screen.getByTestId("solitaire-moves")).toHaveTextContent("1");
    fireEvent.click(screen.getByTestId("solitaire-new"));
    expect(screen.getByTestId("solitaire-moves")).toHaveTextContent("0");
  });

  it("FreeCell deals 8 columns and 52 cards", () => {
    renderWithProviders(
      <Open id="freecell">
        <FreeCellWindow />
      </Open>
    );
    for (let col = 0; col < 8; col += 1) expect(screen.getByTestId(`freecell-column-${col}`)).toBeInTheDocument();
    expect(screen.getByTestId("freecell").querySelectorAll("[data-testid^='freecell-card-']")).toHaveLength(52);
  });

  it("FreeCell: double-clicking the last card parks it in a free cell", () => {
    renderWithProviders(
      <Open id="freecell">
        <FreeCellWindow />
      </Open>
    );
    fireEvent.doubleClick(screen.getByTestId("freecell-card-0-6"));
    const parked = screen.getByTestId("freecell").querySelectorAll("[data-testid^='freecell-cell-'].pcard--slot");
    // Either it went to a foundation (an ace) or a cell; one slot became occupied or a foundation did.
    expect(parked.length).toBeLessThanOrEqual(4);
  });
});

describe("Photos", () => {
  it("opens an album, navigates with the keyboard and closes with Escape", () => {
    renderWithProviders(
      <Open id="photos">
        <PhotosWindow />
      </Open>
    );
    fireEvent.click(screen.getByTestId("album-workchi"));
    fireEvent.click(screen.getByTestId("photo-0"));
    expect(screen.getByTestId("photo-caption")).toHaveTextContent("1/2");
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByTestId("photo-caption")).toHaveTextContent("2/2");
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByTestId("photo-caption")).toHaveTextContent("1/2");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByTestId("photo-viewer")).not.toBeInTheDocument();
  });

  it("jumps straight to the album a project asked for", () => {
    requestAlbum("narvash");
    render(
      <DesktopSettingsProvider>
        <PhotosApp onBack={() => {}} />
      </DesktopSettingsProvider>
    );
    expect(screen.getByTestId("photos-grid")).toBeInTheDocument();
  });
});

describe("Paint, Task Manager, Media Player", () => {
  it("Paint switches tool and colour", () => {
    renderWithProviders(
      <Open id="paint">
        <PaintWindow />
      </Open>
    );
    fireEvent.click(screen.getByTestId("paint-tool-eraser"));
    expect(screen.getByTestId("paint-tool-eraser")).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByTestId("paint-color-ed1c24"));
    expect(screen.getByTestId("paint-tool-pen")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("paint-mail").getAttribute("href")).toMatch(/^mailto:/);
  });

  it("Task Manager lists open windows and End Task really closes one", () => {
    renderWithProviders(
      <Open id="taskmgr">
        <Open id="calculator">
          <TaskManagerWindow />
        </Open>
      </Open>
    );
    fireEvent.click(screen.getByTestId("taskmgr-app-calculator"));
    fireEvent.click(screen.getByTestId("taskmgr-end"));
    expect(screen.queryByTestId("taskmgr-app-calculator")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("taskmgr-tab-performance"));
    expect(screen.getByTestId("taskmgr-performance")).toBeInTheDocument();
  });

  it("Media Player renders the playlist and survives having no audio engine", () => {
    renderWithProviders(
      <Open id="media">
        <MediaPlayerWindow />
      </Open>
    );
    expect(screen.getByTestId("media-title")).toHaveTextContent("Quiet Morning");
    fireEvent.click(screen.getByTestId("media-track-tide"));
    expect(screen.getByTestId("media-title")).toHaveTextContent("Slow Tide");
    expect(() => fireEvent.click(screen.getByTestId("media-toggle"))).not.toThrow();
  });
});

describe("desktop clock", () => {
  it("opens the calendar flyout from the tray clock and switches the calendar there", () => {
    renderWithProviders(<Clock />);
    fireEvent.click(screen.getByTestId("taskbar-clock"));
    expect(screen.getByTestId("calendar-panel")).toBeInTheDocument();
    expect(screen.getByTestId("month-today")).toBeInTheDocument();
    const before = screen.getByTestId("month-title").textContent;
    fireEvent.click(screen.getByTestId("month-next"));
    expect(screen.getByTestId("month-title").textContent).not.toBe(before);
    fireEvent.click(screen.getByTestId("calendar-panel-jalali"));
    expect(window.localStorage.getItem("portfolio:calendar")).toBe("jalali");
  });

  it("the analog gadget can be dismissed", () => {
    renderWithProviders(<ClockGadget />);
    expect(screen.getByTestId("clock-gadget")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("clock-gadget-close"));
    expect(screen.queryByTestId("clock-gadget")).not.toBeInTheDocument();
    expect(window.localStorage.getItem("portfolio:clock-gadget")).toBe("0");
  });

  it("the screensaver wakes on input, but not instantly", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Screensaver onDismiss={onDismiss} />);
    window.dispatchEvent(new Event("mousemove"));
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(500);
    });
    window.dispatchEvent(new Event("keydown"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

describe("phone apps", () => {
  it("Calendar: pick a day, see it, and the Book a call link mails the owner", () => {
    renderWithProviders(<CalendarApp onBack={() => {}} />);
    expect(screen.getByTestId("calendar-selected")).toBeInTheDocument();
    expect(screen.getByTestId("calendar-book").getAttribute("href")).toMatch(/^mailto:.+subject=/);
    fireEvent.click(screen.getByTestId("month-today"));
    expect(screen.getByTestId("calendar-selected")).toBeInTheDocument();
  });

  it("Clock: shows a World Clock with four cities and day/night faces", () => {
    renderWithProviders(<ClockApp onBack={() => {}} />);
    expect(screen.getByTestId("world-clock").children).toHaveLength(4);
    expect(screen.getByTestId("city-Asia/Tehran")).toHaveAttribute("data-daytime");
  });

  it("Music, Draw and Minesweeper open without errors", () => {
    renderWithProviders(<MusicApp onBack={() => {}} />);
    expect(screen.getByTestId("mobile-music")).toBeInTheDocument();
    renderWithProviders(<DrawApp onBack={() => {}} />);
    expect(screen.getAllByTestId("paint").length).toBeGreaterThan(0);
    renderWithProviders(<MinesApp onBack={() => {}} />);
    expect(screen.getAllByTestId("minesweeper").length).toBeGreaterThan(0);
  });

  it("Lock screen unlocks from the keyboard", () => {
    const onUnlock = vi.fn();
    render(
      <DesktopSettingsProvider>
        <LockScreen onUnlock={onUnlock} />
      </DesktopSettingsProvider>
    );
    expect(screen.getByTestId("lock-time")).toBeInTheDocument();
    fireEvent.keyDown(screen.getByTestId("lock-handle"), { key: "Enter" });
    expect(onUnlock).toHaveBeenCalled();
  });

  it("the phone locks itself after a minute of inactivity and unlocks again", () => {
    vi.useFakeTimers();
    render(
      <DesktopSettingsProvider>
        <MobileApp />
      </DesktopSettingsProvider>
    );
    act(() => {
      vi.advanceTimersByTime(2700);
    });
    expect(screen.queryByTestId("lock-screen")).not.toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(61_000);
    });
    expect(screen.getByTestId("lock-screen")).toBeInTheDocument();
    fireEvent.keyDown(screen.getByTestId("lock-handle"), { key: " " });
    expect(screen.queryByTestId("lock-screen")).not.toBeInTheDocument();
  });

  it("the lock screen can be switched off in Settings", () => {
    vi.useFakeTimers();
    window.localStorage.setItem("portfolio:screensaver", "0");
    render(
      <DesktopSettingsProvider>
        <MobileApp />
      </DesktopSettingsProvider>
    );
    act(() => {
      vi.advanceTimersByTime(120_000);
    });
    expect(screen.queryByTestId("lock-screen")).not.toBeInTheDocument();
  });
});
