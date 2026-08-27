import React, { useRef } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { HeatmapCanvas } from '../common/HeatmapCanvas';
import { MousePointer, Mouse, Gauge, Compass } from 'lucide-react';

export const MouseCapture: React.FC = () => {
  const { recordMouse, mouseMetrics, currentMouseEvents } = useAuthStore();
  const interactionAreaRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactionAreaRef.current) return;
    const rect = interactionAreaRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    recordMouse({
      x,
      y,
      timestamp: performance.now(),
      type: 'move',
    });
  };

  const handleMouseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactionAreaRef.current) return;
    const rect = interactionAreaRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    recordMouse({
      x,
      y,
      timestamp: performance.now(),
      type: 'click',
    });
  };

  return (
    <div className="soc-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/30">
            <MousePointer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Mouse Dynamics & Trajectory Capture</h3>
            <p className="text-xs text-gray-400">Move cursor and click inside the secure area to analyze trajectory and velocity</p>
          </div>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
          Module 1: Telemetry
        </span>
      </div>

      {/* Mouse Interaction Zone with Canvas Overlay */}
      <div
        ref={interactionAreaRef}
        onMouseMove={handleMouseMove}
        onClick={handleMouseClick}
        className="w-full relative rounded-2xl overflow-hidden cursor-crosshair border border-purple-500/30 shadow-2xl"
      >
        <HeatmapCanvas events={currentMouseEvents} width={800} height={320} showHeatmap={true} />
      </div>

      {/* Mouse Dynamics Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-900/60 rounded-xl border border-gray-800 space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-[10px] uppercase font-semibold">
            <span>Average Speed</span>
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{mouseMetrics.avgSpeed} <span className="text-xs font-normal text-gray-400">px/s</span></p>
        </div>

        <div className="p-4 bg-gray-900/60 rounded-xl border border-gray-800 space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-[10px] uppercase font-semibold">
            <span>Acceleration</span>
            <Compass className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{mouseMetrics.avgAcceleration} <span className="text-xs font-normal text-gray-400">px/s²</span></p>
        </div>

        <div className="p-4 bg-gray-900/60 rounded-xl border border-gray-800 space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-[10px] uppercase font-semibold">
            <span>Click Interval</span>
            <Mouse className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{mouseMetrics.avgClickInterval} <span className="text-xs font-normal text-gray-400">ms</span></p>
        </div>

        <div className="p-4 bg-gray-900/60 rounded-xl border border-gray-800 space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-[10px] uppercase font-semibold">
            <span>Consistency Score</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">{mouseMetrics.movementConsistency}%</p>
        </div>
      </div>
    </div>
  );
};
