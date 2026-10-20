import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ResumeApp from "./ResumeApp";

describe("mobile ResumeApp", () => {
  it("offers Open and Download links, because mobile browsers often render embedded PDFs blank", () => {
    render(<ResumeApp onBack={() => {}} />);

    const open = screen.getByRole("link", { name: "Open PDF" });
    expect(open).toHaveAttribute("href", "/resume.pdf");
    expect(open).toHaveAttribute("target", "_blank");
    expect(open).toHaveAttribute("rel", expect.stringContaining("noopener"));

    const download = screen.getByRole("link", { name: "Download" });
    expect(download).toHaveAttribute("href", "/resume.pdf");
    expect(download).toHaveAttribute("download");
  });

  it("renders the PDF with PDF.js instead of a native iframe", () => {
    render(<ResumeApp onBack={() => {}} />);
    expect(screen.getByTestId("pdf-viewer")).toBeInTheDocument();
  });
});
