import { screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { useEffect, type ReactNode } from "react";
import ProjectsWindow from "./ProjectsWindow";
import { useWindowManager } from "../../context/WindowManagerContext";
import { renderWithProviders } from "../../test/testUtils";
import { siteConfig } from "../../config/siteConfig";

function OpenOnMount({ id, children }: { id: string; children?: ReactNode }) {
  const { openWindow } = useWindowManager();
  useEffect(() => {
    openWindow(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
}

function openProjectsWindow() {
  return renderWithProviders(
    <OpenOnMount id="projects">
      <ProjectsWindow />
    </OpenOnMount>
  );
}

describe("ProjectsWindow", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("lists every configured project", () => {
    openProjectsWindow();
    for (const project of siteConfig.projects) {
      expect(screen.getByTestId(`project-item-${project.id}`)).toBeInTheDocument();
    }
  });

  it("shows the domain under each project title", () => {
    openProjectsWindow();
    expect(screen.getByText("workchi.ir")).toBeInTheDocument();
    expect(screen.getByText("narvash.com")).toBeInTheDocument();
  });

  it("renders a project's own logo image when it has one", () => {
    openProjectsWindow();
    const logo = screen.getByAltText("Workchi logo");
    expect(logo).toHaveAttribute("src", "/images/workchi.jpg");
    expect(screen.getByAltText("Narvash logo")).toHaveAttribute("src", "/images/narvash.jpg");
  });

  it("falls back to a neutral placeholder for a project without a logo", () => {
    const withoutLogo = siteConfig.projects.find((project) => !project.logo);
    expect(withoutLogo, "expected at least one logo-less project to exercise the fallback").toBeDefined();

    openProjectsWindow();
    const item = screen.getByTestId(`project-item-${withoutLogo!.id}`);
    expect(item.querySelector("img")).toBeNull();
    expect(item.querySelector(".project-item__logo-fallback")).toBeInTheDocument();
  });

  it("opens the detail modal with the tagline, highlights and outbound link", () => {
    openProjectsWindow();
    const workchi = siteConfig.projects[0];
    fireEvent.click(screen.getByTestId(`project-item-${workchi.id}`));

    const modal = screen.getByRole("dialog", { name: workchi.title });
    expect(modal).toBeInTheDocument();
    expect(screen.getByText(workchi.tagline)).toBeInTheDocument();
    for (const highlight of workchi.highlights) {
      expect(screen.getByText(highlight)).toBeInTheDocument();
    }

    const link = screen.getByRole("link", { name: new RegExp(workchi.linkLabel, "i") });
    expect(link).toHaveAttribute("href", workchi.link);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows the logo and the year in the detail modal", () => {
    openProjectsWindow();
    const workchi = siteConfig.projects[0];
    fireEvent.click(screen.getByTestId(`project-item-${workchi.id}`));

    const modal = screen.getByRole("dialog", { name: workchi.title });
    expect(modal.querySelector("img")).toHaveAttribute("src", workchi.logo);
    expect(screen.getByText(workchi.year)).toBeInTheDocument();
  });

  it("closes the detail modal via the close button", () => {
    openProjectsWindow();
    const workchi = siteConfig.projects[0];
    fireEvent.click(screen.getByTestId(`project-item-${workchi.id}`));

    const modal = screen.getByRole("dialog", { name: workchi.title });
    expect(screen.getByTestId("project-modal-backdrop")).toBeInTheDocument();

    // Scoped to the modal: the parent window also has its own "Close" button.
    fireEvent.click(within(modal).getByRole("button", { name: "Close" }));
    expect(screen.queryByTestId("project-modal-backdrop")).not.toBeInTheDocument();
  });

  it("closes the detail modal when clicking the backdrop, but not the dialog itself", () => {
    openProjectsWindow();
    const workchi = siteConfig.projects[0];
    fireEvent.click(screen.getByTestId(`project-item-${workchi.id}`));

    fireEvent.click(screen.getByRole("dialog", { name: workchi.title }));
    expect(screen.getByTestId("project-modal-backdrop")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("project-modal-backdrop"));
    expect(screen.queryByTestId("project-modal-backdrop")).not.toBeInTheDocument();
  });
});
