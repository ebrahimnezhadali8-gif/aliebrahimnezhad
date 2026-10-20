import { useState } from "react";
import PdfViewer from "../PdfViewer/PdfViewer";
import Window from "../Window/Window";
import { windowMeta } from "../../config/siteConfig";
import { zoomIn, zoomOut, ZOOM_MIN, ZOOM_MAX } from "./zoom";
import "./ResumeWindow.css";

const RESUME_PATH = "/resume.pdf";
const DEFAULT_ZOOM = 100;

function ResumeWindow() {
  const meta = windowMeta.resume;
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = RESUME_PATH;
    a.download = "resume.pdf";
    a.click();
  };

  const handlePrint = () => {
    // The PDF is drawn on canvases, so printing goes through the browser's own viewer.
    window.open(RESUME_PATH, "_blank", "noopener");
  };

  return (
    <Window id="resume" title={meta.title} icon={meta.icon} width={meta.width} height={meta.height}>
      <div className="resume-window">
        <div className="resume-window__toolbar">
          <span className="resume-window__fname">resume.pdf</span>
          <div className="resume-window__zoom-group">
            <button
              type="button"
              title="Zoom out"
              disabled={zoom <= ZOOM_MIN}
              onClick={() => setZoom((z) => zoomOut(z))}
            >
              &minus;
            </button>
            <span className="resume-window__zoom-pct" data-testid="zoom-pct">
              {zoom}%
            </span>
            <button
              type="button"
              title="Zoom in"
              disabled={zoom >= ZOOM_MAX}
              onClick={() => setZoom((z) => zoomIn(z))}
            >
              +
            </button>
          </div>
          <button type="button" title="Fit to page" onClick={() => setZoom(DEFAULT_ZOOM)}>
            Fit
          </button>
          <div className="resume-window__spacer" />
          <button type="button" title="Download" onClick={handleDownload}>
            &#11015;
          </button>
          <button type="button" title="Print" onClick={handlePrint}>
            &#128438;
          </button>
        </div>
        <div className="resume-window__frame">
          <PdfViewer url={RESUME_PATH} zoom={zoom} fallbackHref={RESUME_PATH} />
        </div>
      </div>
    </Window>
  );
}

export default ResumeWindow;
