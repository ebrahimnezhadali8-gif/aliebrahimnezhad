import { useEffect, useRef, useState } from "react";
import { useContent } from "../../hooks/useContent";
import "./PdfViewer.css";

interface PdfViewerProps {
  url: string;
  /** Zoom percentage; 100 fits the page to the viewer width. */
  zoom?: number;
  /** Rendered instead of the canvases when PDF.js can't run (very old browsers). */
  fallbackHref?: string;
}

type Status = "loading" | "ready" | "error";

/**
 * Draws a PDF page-by-page onto <canvas> elements with PDF.js, so it looks and
 * scrolls the same on every device — the native `<iframe src="*.pdf">` renders
 * blank or single-page on most phones. PDF.js is imported lazily, so it adds
 * nothing to the initial bundle.
 */
function PdfViewer({ url, zoom = 100, fallbackHref }: PdfViewerProps) {
  const { t } = useContent();
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let task: { destroy: () => unknown } | null = null;

    async function render() {
      try {
        setStatus("loading");
        const pdfjs = await import("pdfjs-dist");
        const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
        pdfjs.GlobalWorkerOptions.workerSrc = worker.default;

        const loading = pdfjs.getDocument({ url });
        task = loading;
        const doc = await loading.promise;
        if (cancelled || !host) return;

        host.replaceChildren();
        const targetWidth = Math.max(240, (host.clientWidth || 360) * (zoom / 100));
        const ratio = Math.min(window.devicePixelRatio || 1, 2);

        for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
          const page = await doc.getPage(pageNumber);
          if (cancelled) return;
          const base = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: targetWidth / base.width });

          const canvas = document.createElement("canvas");
          canvas.className = "pdf-viewer__page";
          canvas.width = Math.floor(viewport.width * ratio);
          canvas.height = Math.floor(viewport.height * ratio);
          canvas.style.width = `${Math.floor(viewport.width)}px`;
          canvas.style.height = `${Math.floor(viewport.height)}px`;
          host.appendChild(canvas);

          await page.render({
            canvas,
            viewport,
            transform: ratio !== 1 ? [ratio, 0, 0, ratio, 0, 0] : undefined,
          }).promise;
        }
        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void render();
    return () => {
      cancelled = true;
      void task?.destroy();
    };
  }, [url, zoom]);

  return (
    <div className="pdf-viewer" data-testid="pdf-viewer" data-status={status}>
      <div className="pdf-viewer__pages" ref={hostRef} />
      {status === "loading" && <p className="pdf-viewer__note">{t("loadingPdf")}</p>}
      {status === "error" && (
        <p className="pdf-viewer__note">
          {t("pdfFailed")}
          {fallbackHref && (
            <>
              {" "}
              <a href={fallbackHref} target="_blank" rel="noopener noreferrer">
                PDF
              </a>
            </>
          )}
        </p>
      )}
    </div>
  );
}

export default PdfViewer;
