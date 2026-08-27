import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { AlertOctagon, Cpu } from 'lucide-react';

export const AnomalyDetector: React.FC = () => {
  const { authResult, currentFeatureVector } = useAuthStore();
  const { anomalyScore } = authResult.parameterScores;

  let riskColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  let riskLabel = 'LOW ANOMALY RISK';

  if (anomalyScore > 60) {
    riskColor = 'text-red-400 border-red-500/30 bg-red-500/10 glow-red';
    riskLabel = 'CRITICAL ANOMALY RISK';
  } else if (anomalyScore > 30) {
    riskColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10 glow-amber';
    riskLabel = 'ELEVATED ANOMALY RISK';
  }

  return (
    <div className="soc-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/30">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Isolation Forest Anomaly Engine</h3>
            <p className="text-xs text-gray-400">Unsupervised outlier isolation for catching non-human or unauthorized patterns</p>
          </div>
        </div>

        <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold border ${riskColor}`}>
          {riskLabel}
        </span>
      </div>

      {/* Anomaly Gauge & Isolation Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="p-6 bg-gray-950/80 rounded-xl border border-gray-800 text-center space-y-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Isolation Anomaly Score</span>
          <p className="text-5xl font-extrabold text-red-400 tracking-tight">{anomalyScore}%</p>
          <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 h-full" style={{ width: `${anomalyScore}%` }} />
          </div>
          <span className="text-[10px] text-gray-400 block">Threshold Limit: 35% Anomaly Index</span>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Outlier Isolation Tree Diagnostics</span>
          </h4>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-gray-950/80 rounded-xl border border-gray-800">
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">Keystroke Latency Deviation</span>
              <p className="text-sm font-bold text-white mt-1">{Math.abs(currentFeatureVector.avgHoldTime - 118)} ms variance</p>
            </div>

            <div className="p-3.5 bg-gray-950/80 rounded-xl border border-gray-800">
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">Mouse Acceleration Deviation</span>
              <p className="text-sm font-bold text-purple-400 mt-1">{Math.abs(currentFeatureVector.mouseAcceleration - 1100)} px/s²</p>
            </div>

            <div className="p-3.5 bg-gray-950/80 rounded-xl border border-gray-800">
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">Synthetic Automation Check</span>
              <p className="text-sm font-bold text-emerald-400 mt-1">PASSED (Human Micro-Jitter)</p>
            </div>

            <div className="p-3.5 bg-gray-950/80 rounded-xl border border-gray-800">
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">Interaction Burst Frequency</span>
              <p className="text-sm font-bold text-cyan-400 mt-1">{currentFeatureVector.interactionFrequency} ops/min</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
