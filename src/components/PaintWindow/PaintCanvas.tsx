import { useEffect, useRef, useState } from "react";
import { siteConfig } from "../../config/siteConfig";
import { useContent } from "../../hooks/useContent";
import { buildMailtoHref } from "../mobile/apps/mailto";
import {
  CANVAS_BACKGROUND,
  MAX_SIZE,
  MIN_SIZE,
  PALETTE,
  drawingMailBody,
  strokeStyleFor,
  toCanvasPoint,
  type Tool,
} from "./paintTools";
import "./PaintCanvas.css";

interface PaintCanvasProps {
  width?: number;
  height?: number;
  /** Fills the available space (the phone) instead of a fixed drawing size. */
  fluid?: boolean;
}

const FILE_NAME = "drawing.png";

/** Pen, eraser, palette, size, clear and save-to-PNG; shared by Windows Paint and the phone's Draw app. */
function PaintCanvas({ width = 640, height = 400, fluid = false }: PaintCanvasProps) {
  const { t } = useContent();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(PALETTE[0]);
  const [size, setSize] = useState(4);
  const [saved, setSaved] = useState(false);

  // Paint the paper white once (a transparent PNG would turn black in many viewers).
  useEffect(() => {
    const ctx = canvasRef.current?.getContext?.("2d");
    if (!ctx) return;
    ctx.fillStyle = CANVAS_BACKGROUND;
    ctx.fillRect(0, 0, width, height);
  }, [width, height]);

  const pointFrom = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    return toCanvasPoint({ x: event.clientX, y: event.clientY }, canvas.getBoundingClientRect(), canvas);
  };

  const drawTo = (point: { x: number; y: number }) => {
    const ctx = canvasRef.current?.getContext?.("2d");
    if (!ctx || !last.current) return;
    const style = strokeStyleFor(tool, color, size);
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    last.current = point;
  };

  const clear = () => {
    const ctx = canvasRef.current?.getContext?.("2d");
    if (!ctx) return;
    ctx.fillStyle = CANVAS_BACKGROUND;
    ctx.fillRect(0, 0, width, height);
    setSaved(false);
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas?.toBlob) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = FILE_NAME;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setSaved(true);
    }, "image/png");
  };

  const mailHref = buildMailtoHref({
    to: siteConfig.email,
    from: "",
    subject: t("paintMailSubject"),
    body: drawingMailBody(FILE_NAME),
  });

  return (
    <div className={`paint ${fluid ? "paint--fluid" : ""}`} data-testid="paint">
      <div className="paint__tools">
        <div className="paint__group" role="group" aria-label={t("paintTool")}>
          {(["pen", "eraser"] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={tool === option ? "is-active" : ""}
              aria-pressed={tool === option}
              onClick={() => setTool(option)}
              data-testid={`paint-tool-${option}`}
            >
              {option === "pen" ? "✏️" : "🧽"} {t(option === "pen" ? "paintPen" : "paintEraser")}
            </button>
          ))}
        </div>
        <label className="paint__size">
          {t("paintSize")}
          <input
            type="range"
            min={MIN_SIZE}
            max={MAX_SIZE}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            data-testid="paint-size"
          />
        </label>
        <div className="paint__group">
          <button type="button" onClick={clear} data-testid="paint-clear">
            {t("paintClear")}
          </button>
          <button type="button" onClick={save} data-testid="paint-save">
            {t("paintSave")}
          </button>
          <a className="paint__mail" href={mailHref} data-testid="paint-mail">
            ✉ {t("paintSend")}
          </a>
        </div>
      </div>

      <div className="paint__palette" role="group" aria-label={t("paintColor")}>
        {PALETTE.map((swatch) => (
          <button
            key={swatch}
            type="button"
            className={`paint__swatch ${swatch === color && tool === "pen" ? "is-active" : ""}`}
            style={{ background: swatch }}
            aria-label={swatch}
            aria-pressed={swatch === color}
            onClick={() => {
              setColor(swatch);
              setTool("pen");
            }}
            data-testid={`paint-color-${swatch.slice(1)}`}
          />
        ))}
      </div>

      <div className="paint__paper">
        <canvas
          ref={canvasRef}
          className="paint__canvas"
          width={width}
          height={height}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture?.(e.pointerId);
            last.current = pointFrom(e);
            drawTo({ x: last.current.x + 0.01, y: last.current.y }); // a tap leaves a dot
          }}
          onPointerMove={(e) => {
            if (last.current) drawTo(pointFrom(e));
          }}
          onPointerUp={() => {
            last.current = null;
          }}
          onPointerCancel={() => {
            last.current = null;
          }}
          data-testid="paint-canvas"
        />
      </div>
      {saved && (
        <p className="paint__saved" role="status">
          {t("paintSaved")}
        </p>
      )}
    </div>
  );
}

export default PaintCanvas;
