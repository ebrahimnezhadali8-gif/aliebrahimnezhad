import { useEffect, useRef } from "react";
import { ambientPlayer } from "./ambientPlayer";

interface VisualizerProps {
  colors: [string, string];
  playing: boolean;
  className?: string;
}

/** Frequency bars drawn from the player's analyser; falls back to a gentle idle shimmer. */
function Visualizer({ colors, playing, className }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext?.("2d");
    if (!canvas || !ctx || typeof requestAnimationFrame !== "function") return;
    let frame = 0;
    let raf = 0;

    const draw = () => {
      frame += 1;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      const analyser = ambientPlayer.analyser;
      const bars = 32;
      const data = new Uint8Array(analyser ? analyser.frequencyBinCount : bars);
      if (analyser && playing) analyser.getByteFrequencyData(data);
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[1]);
      ctx.fillStyle = gradient;
      const barWidth = width / bars;
      for (let i = 0; i < bars; i += 1) {
        const level = playing && analyser ? (data[i % data.length] ?? 0) / 255 : 0.06 + 0.04 * Math.sin(frame / 20 + i);
        const barHeight = Math.max(3, level * height);
        ctx.fillRect(i * barWidth + 2, height - barHeight, barWidth - 4, barHeight);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [colors, playing]);

  return <canvas ref={canvasRef} className={className} width={320} height={120} aria-hidden="true" />;
}

export default Visualizer;
