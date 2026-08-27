import React, { useEffect, useRef } from 'react';
import type { MouseEventData } from '../../types/biometrics';

interface HeatmapCanvasProps {
  events: MouseEventData[];
  width?: number;
  height?: number;
  showHeatmap?: boolean;
}

export const HeatmapCanvas: React.FC<HeatmapCanvasProps> = ({
  events,
  width = 600,
  height = 320,
  showHeatmap = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear Canvas
    ctx.clearRect(0, 0, width, height);

    // Draw Grid Background
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (events.length === 0) {
      ctx.fillStyle = '#4B5563';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Move mouse inside interaction box to generate trajectory map', width / 2, height / 2);
      return;
    }

    // Draw Trajectory Lines
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
    ctx.lineWidth = 2.5;

    events.forEach((p, idx) => {
      const px = (p.x / 1000) * width;
      const py = (p.y / 600) * height;

      if (idx === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    });
    ctx.stroke();

    // Draw Heatmap Overlay Circles & Click Points
    events.forEach((p) => {
      const px = (p.x / 1000) * width;
      const py = (p.y / 600) * height;

      if (showHeatmap) {
        const gradient = ctx.createRadialGradient(px, py, 2, px, py, 20);
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.4)');
        gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.15)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(px, py, 20, 0, Math.PI * 2);
        ctx.fill();
      }

      if (p.type === 'click') {
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });

    // Draw active cursor head
    if (events.length > 0) {
      const last = events[events.length - 1];
      const lx = (last.x / 1000) * width;
      const ly = (last.y / 600) * height;

      ctx.fillStyle = '#06B6D4';
      ctx.beginPath();
      ctx.arc(lx, ly, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [events, width, height, showHeatmap]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-800 bg-gray-950/80 shadow-inner">
      <canvas ref={canvasRef} width={width} height={height} className="w-full h-auto block cursor-crosshair" />
      <div className="absolute top-3 right-3 flex items-center gap-2 bg-gray-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-gray-700/50 text-[10px] text-gray-300">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>Live Trajectory Telemetry</span>
      </div>
    </div>
  );
};
