import { useState } from "react";
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
    const iframe = document.getElementById("resume-iframe") as HTMLIFrameElement | null;
    iframe?.contentWindow?.print();
  };

  // Emulates real zoom by scaling the iframe and compensating its box size,
  // since a native PDF renderer inside an iframe can't be driven directly.
  const scale = zoom / 100;

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
          <div
            className="resume-window__scale-wrap"
            style={{
              width: `${100 / scale}%`,
              height: `${100 / scale}%`,
              transform: `scale(${scale})`,
            }}
          >
            <iframe id="resume-iframe" src={RESUME_PATH} title="resume" />
          </div>
        </div>
      </div>
    </Window>
  );
}

export default ResumeWindow;
