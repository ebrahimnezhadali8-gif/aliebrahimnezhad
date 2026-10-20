import { useEffect, useMemo, useRef } from "react";
import { siteConfig } from "../../config/siteConfig";
import { pickScreensaver, stepBubble, stepMover, type Bubble, type Mover } from "./motion";
import "./Screensaver.css";

interface ScreensaverProps {
  onDismiss: () => void;
}

function randomMover(width: number, height: number): Mover {
  const speed = () => (Math.random() * 2.2 + 1.2) * (Math.random() < 0.5 ? -1 : 1);
  return { x: Math.random() * width, y: Math.random() * height, vx: speed(), vy: speed() };
}

/** Windows 7-style screensaver (3D Text, Bubbles or Mystify). Any input wakes it. */
function Screensaver({ onDismiss }: ScreensaverProps) {
  const kind = useMemo(() => pickScreensaver(), []);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "wheel"] as const;
    // Ignore the first few ms so the pointer settling after the overlay appears doesn't dismiss it.
    const armedAt = Date.now() + 400;
    const wake = () => {
      if (Date.now() >= armedAt) onDismiss();
    };
    events.forEach((name) => window.addEventListener(name, wake));
    return () => events.forEach((name) => window.removeEventListener(name, wake));
  }, [onDismiss]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext?.("2d");
    if (!canvas || !ctx || kind === "text" || typeof requestAnimationFrame !== "function") return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const { width, height } = canvas;
    let raf = 0;

    if (kind === "mystify") {
      // Two quadrilaterals whose corners bounce around, leaving a fading trail.
      const polygons = [0, 1].map(() => Array.from({ length: 4 }, () => randomMover(width, height)));
      const history: { points: Mover[]; hue: number }[][] = [[], []];
      let tick = 0;
      const draw = () => {
        tick += 1;
        ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
        ctx.fillRect(0, 0, width, height);
        polygons.forEach((corners, index) => {
          polygons[index] = corners.map((corner) => stepMover(corner, width, height));
          history[index].push({ points: polygons[index], hue: (tick * 2 + index * 140) % 360 });
          if (history[index].length > 8) history[index].shift();
          history[index].forEach((frame, age) => {
            ctx.strokeStyle = `hsla(${frame.hue}, 90%, 60%, ${(age + 1) / 9})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            frame.points.forEach((point, i) => (i === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y)));
            ctx.closePath();
            ctx.stroke();
          });
        });
        raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);
    } else {
      let bubbles: Bubble[] = Array.from({ length: 28 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 8 + Math.random() * 38,
        speed: 0.5 + Math.random() * 1.6,
        hue: Math.floor(Math.random() * 360),
      }));
      const draw = () => {
        ctx.clearRect(0, 0, width, height);
        bubbles = bubbles.map((bubble) => stepBubble(bubble, width, height));
        for (const bubble of bubbles) {
          const gradient = ctx.createRadialGradient(
            bubble.x - bubble.radius * 0.3,
            bubble.y - bubble.radius * 0.3,
            bubble.radius * 0.1,
            bubble.x,
            bubble.y,
            bubble.radius
          );
          gradient.addColorStop(0, `hsla(${bubble.hue}, 90%, 85%, 0.9)`);
          gradient.addColorStop(1, `hsla(${bubble.hue}, 90%, 55%, 0.25)`);
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);
    }
    return () => cancelAnimationFrame(raf);
  }, [kind]);

  return (
    <div className={`screensaver screensaver--${kind}`} data-testid="screensaver" data-kind={kind} onClick={onDismiss}>
      {kind === "text" ? (
        <div className="screensaver__stage">
          <div className="screensaver__text">{siteConfig.name}</div>
          <div className="screensaver__sub">{siteConfig.role}</div>
        </div>
      ) : (
        <canvas ref={canvasRef} className="screensaver__canvas" />
      )}
    </div>
  );
}

export default Screensaver;
