import { useEffect, useRef, useState } from "react";
import { useContent } from "../../hooks/useContent";
import { MAX_ZOOM, MIN_ZOOM, clampZoom, distance, nextIndex, pinchZoom, prevIndex, swipeDirection } from "./photoNav";
import "./PhotoViewer.css";

export interface Photo {
  src: string;
  caption: string;
  /** Project link, used by the Share button. */
  link?: string;
}

interface PhotoViewerProps {
  photos: Photo[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
  /** Called by the Share button; omit to hide it. */
  onShare?: (photo: Photo) => void;
}

/**
 * Full-size photo viewer: ←/→ (or swipe) to move, +/− or pinch/wheel to zoom,
 * Esc to close. Used by both the Windows Photo Viewer and the iPhone Photos app.
 */
function PhotoViewer({ photos, index, onIndex, onClose, onShare }: PhotoViewerProps) {
  const { t } = useContent();
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ distance: number; zoom: number } | null>(null);
  const swipeStart = useRef<number | null>(null);
  const photo = photos[index];

  const go = (target: number) => {
    setZoom(MIN_ZOOM);
    onIndex(target);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") go(nextIndex(index, photos.length));
      else if (event.key === "ArrowLeft") go(prevIndex(index, photos.length));
      else if (event.key === "+" || event.key === "=") setZoom((z) => clampZoom(z + 0.5));
      else if (event.key === "-") setZoom((z) => clampZoom(z - 0.5));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, photos.length, onClose]);

  if (!photo) return null;

  return (
    <div
      className="photo-viewer"
      data-testid="photo-viewer"
      role="dialog"
      aria-label={photo.caption}
      onWheel={(e) => setZoom((z) => clampZoom(z - Math.sign(e.deltaY) * 0.25))}
    >
      <div className="photo-viewer__bar">
        <button type="button" onClick={onClose} data-testid="photo-close">
          ← {t("backLabel")}
        </button>
        <span className="photo-viewer__caption" data-testid="photo-caption">
          {photo.caption} ({index + 1}/{photos.length})
        </span>
        <span className="photo-viewer__tools">
          <button type="button" onClick={() => setZoom((z) => clampZoom(z - 0.5))} aria-label={t("zoomOut")} disabled={zoom <= MIN_ZOOM}>
            −
          </button>
          <button type="button" onClick={() => setZoom((z) => clampZoom(z + 0.5))} aria-label={t("zoomIn")} disabled={zoom >= MAX_ZOOM} data-testid="photo-zoom-in">
            +
          </button>
          {onShare && (
            <button type="button" onClick={() => onShare(photo)} data-testid="photo-share">
              {t("share")}
            </button>
          )}
        </span>
      </div>

      <div
        className="photo-viewer__stage"
        onPointerDown={(e) => {
          pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
          if (pointers.current.size === 2) {
            const [a, b] = [...pointers.current.values()];
            pinch.current = { distance: distance(a, b), zoom };
            swipeStart.current = null;
          } else {
            swipeStart.current = e.clientX;
          }
        }}
        onPointerMove={(e) => {
          if (!pointers.current.has(e.pointerId)) return;
          pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
          if (pinch.current && pointers.current.size === 2) {
            const [a, b] = [...pointers.current.values()];
            setZoom(pinchZoom(pinch.current.zoom, pinch.current.distance, distance(a, b)));
          }
        }}
        onPointerUp={(e) => {
          pointers.current.delete(e.pointerId);
          if (pointers.current.size < 2) pinch.current = null;
          if (swipeStart.current !== null && zoom === MIN_ZOOM && pointers.current.size === 0) {
            const direction = swipeDirection(e.clientX - swipeStart.current);
            if (direction === -1) go(nextIndex(index, photos.length));
            if (direction === 1) go(prevIndex(index, photos.length));
          }
          swipeStart.current = null;
        }}
        onPointerCancel={(e) => {
          pointers.current.delete(e.pointerId);
          pinch.current = null;
          swipeStart.current = null;
        }}
      >
        <button type="button" className="photo-viewer__nav photo-viewer__nav--prev" onClick={() => go(prevIndex(index, photos.length))} aria-label="Previous photo" data-testid="photo-prev">
          ‹
        </button>
        <img
          className="photo-viewer__img"
          src={photo.src}
          alt={photo.caption}
          style={{ transform: `scale(${zoom})` }}
          draggable={false}
          data-testid="photo-img"
        />
        <button type="button" className="photo-viewer__nav photo-viewer__nav--next" onClick={() => go(nextIndex(index, photos.length))} aria-label="Next photo" data-testid="photo-next">
          ›
        </button>
      </div>
    </div>
  );
}

export default PhotoViewer;
