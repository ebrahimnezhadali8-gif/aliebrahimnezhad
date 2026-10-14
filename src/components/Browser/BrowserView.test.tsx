import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import BrowserView from "./BrowserView";
import { renderWithProviders } from "../../test/testUtils";
import { siteConfig } from "../../config/siteConfig";

describe("BrowserView", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("embeds the first project's real site in a live frame", () => {
    renderWithProviders(<BrowserView flavour="ie" />);
    expect(screen.getByTestId("browser-frame")).toHaveAttribute("src", siteConfig.projects[0].link);
    expect(screen.getByTestId("browser-url")).toHaveTextContent("workchi.ir");
  });

  it("offers a favourite button per project, switching the live frame", () => {
    renderWithProviders(<BrowserView flavour="ie" />);
    for (const project of siteConfig.projects) {
      expect(screen.getByTestId(`browser-fav-${project.id}`)).toBeInTheDocument();
    }

    fireEvent.click(screen.getByTestId("browser-fav-narvash"));
    expect(screen.getByTestId("browser-frame")).toHaveAttribute("src", "https://narvash.com");
    expect(screen.getByTestId("browser-url")).toHaveTextContent("narvash.com");
  });

  it("marks the active favourite for assistive tech", () => {
    renderWithProviders(<BrowserView flavour="ie" />);
    expect(screen.getByTestId("browser-fav-workchi")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByTestId("browser-fav-boomsv")).toHaveAttribute("aria-selected", "false");
  });

  it("always offers an escape hatch, because most sites refuse to be embedded", () => {
    renderWithProviders(<BrowserView flavour="ie" />);
    expect(screen.getByTestId("browser-hint")).toBeInTheDocument();
    expect(screen.getByTestId("browser-open-external")).toBeInTheDocument();
  });

  it("'Open in browser' opens the current site in a real tab", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    renderWithProviders(<BrowserView flavour="ie" />);

    fireEvent.click(screen.getByTestId("browser-fav-boomsv"));
    fireEvent.click(screen.getByTestId("browser-open-external"));

    expect(openSpy).toHaveBeenCalledWith("https://boomsv.ir", "_blank", "noopener");
  });

  it("reload re-keys the frame so the page is requested again", () => {
    renderWithProviders(<BrowserView flavour="ie" />);
    const frame = screen.getByTestId("browser-frame");

    fireEvent.click(screen.getByTestId("browser-reload"));
    expect(screen.getByTestId("browser-frame")).not.toBe(frame);
    expect(screen.getByTestId("browser-frame")).toHaveAttribute("src", siteConfig.projects[0].link);
  });

  it("shows the active project's tagline alongside the frame", () => {
    renderWithProviders(<BrowserView flavour="ie" />);
    expect(screen.getByTestId("browser-hint")).toHaveTextContent(
      siteConfig.projects[0].tagline
    );
  });

  it("uses the Safari chrome on the phone skin", () => {
    renderWithProviders(<BrowserView flavour="safari" />);
    // Safari labels its history buttons the iOS way rather than the IE way.
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Forward" })).toBeInTheDocument();
    expect(screen.getByRole("tablist", { name: /favorites/i })).toBeInTheDocument();
  });
});