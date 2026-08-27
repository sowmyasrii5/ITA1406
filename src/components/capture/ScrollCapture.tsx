import React, { useRef } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ArrowUpDown } from 'lucide-react';

export const ScrollCapture: React.FC = () => {
  const { recordScroll, scrollMetrics } = useAuthStore();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    recordScroll(e.deltaY);
  };

  return (
    <div className="soc-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/30">
            <ArrowUpDown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Scroll Behaviour Capture</h3>
            <p className="text-xs text-gray-400">Scroll inside the test container to record scroll speed, frequency, and reversals</p>
          </div>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
          Module 1: Telemetry
        </span>
      </div>

      {/* Scroll Zone */}
      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        className="w-full h-44 overflow-y-scroll bg-gray-950 p-4 rounded-xl border border-blue-500/30 space-y-3 shadow-inner"
      >
        <p className="text-xs font-semibold text-cyan-400">Interactive Scroll Interaction Test Container (Scroll Up & Down):</p>
        {Array.from({ length: 15 }).map((_, idx) => (
          <div key={idx} className="p-3 bg-gray-900/80 rounded-lg border border-gray-800 text-xs text-gray-300 flex items-center justify-between">
            <span>Scroll Telemetry Item #{idx + 1} — Continuous Verification Buffer</span>
            <span className="text-[10px] text-gray-400">Delta Velocity: {scrollMetrics.scrollSpeed} px/s</span>
          </div>
        ))}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 text-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold">Scroll Speed</span>
          <p className="text-xl font-extrabold text-blue-400 mt-1">{scrollMetrics.scrollSpeed} px/s</p>
        </div>

        <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 text-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold">Event Count</span>
          <p className="text-xl font-extrabold text-white mt-1">{scrollMetrics.eventCount}</p>
        </div>

        <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 text-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold">Direction Changes</span>
          <p className="text-xl font-extrabold text-purple-400 mt-1">{scrollMetrics.directionChanges}</p>
        </div>

        <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 text-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold">Avg Interval</span>
          <p className="text-xl font-extrabold text-cyan-400 mt-1">{scrollMetrics.avgInterval} ms</p>
        </div>
      </div>
    </div>
  );
};
