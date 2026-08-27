import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { CircularGauge } from '../common/CircularGauge';
import { StatusBadge } from '../common/StatusBadge';
import { Cpu, RefreshCw } from 'lucide-react';

export const AIAuthEngine: React.FC = () => {
  const { authResult, selectedAiModel, setSelectedAiModel, evaluateCurrentSession } = useAuthStore();
  const { parameterScores, status, confidenceScore, detectedIssues } = authResult;

  const modelsList = [
    { id: 'Random Forest + Isolation Forest', name: 'Random Forest + Isolation Forest (Recommended)', type: 'Primary Classification + Anomaly' },
    { id: 'Support Vector Machine', name: 'Support Vector Machine (SVM)', type: 'Binary Decision Boundary' },
    { id: 'Isolation Forest', name: 'One-Class Isolation Forest', type: 'Unsupervised Outlier Detection' },
    { id: 'K-Means Clustering', name: 'K-Means Clustering Distance', type: 'Euclidean Cluster Centroid' },
  ];

  return (
    <div className="space-y-6">
      {/* Model Selection Banner */}
      <div className="soc-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/30">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Module 2: AI/ML Authentication Engine</h3>
            <p className="text-xs text-gray-400">Classifies legitimate user behaviour and calculates anomaly deviation scores</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-gray-400 font-medium">Model Architecture:</span>
            <select
              value={selectedAiModel}
              onChange={(e) => setSelectedAiModel(e.target.value)}
              className="bg-transparent text-cyan-400 font-bold focus:outline-none cursor-pointer"
            >
              {modelsList.map((m) => (
                <option key={m.id} value={m.id} className="bg-gray-900 text-white">
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => evaluateCurrentSession()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/40 text-xs font-bold transition-all glow-cyan"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-evaluate Now</span>
          </button>
        </div>
      </div>

      {/* Gauges & Score Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: AI Confidence Gauge */}
        <div className="soc-card p-6 flex flex-col items-center justify-center text-center space-y-4">
          <CircularGauge score={confidenceScore} status={status} size={210} strokeWidth={16} />
          
          <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-800 w-full text-xs text-gray-300">
            <p className="font-semibold text-white">Security State Status:</p>
            <p className="text-[11px] text-gray-400 mt-1">
              {status === 'VERIFIED' && '🟢 User behaviour strongly matches registered baseline profile.'}
              {status === 'SUSPICIOUS' && '🟡 Unusual behavioural activity detected. Step-up verification recommended.'}
              {status === 'BLOCKED' && '🔴 Significant deviation detected! Session lock & security alert triggered.'}
            </p>
          </div>
        </div>

        {/* Right: Parameter Match Table */}
        <div className="soc-card p-6 md:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h4 className="text-sm font-bold text-white">Biometric Feature Parameter Scores</h4>
            <StatusBadge status={status} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Parameter Metric</th>
                  <th className="py-2.5 px-3">Match Score</th>
                  <th className="py-2.5 px-3">Status Indicator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-gray-200">
                <tr>
                  <td className="py-3 px-3 font-semibold">Keystroke Rhythm Match</td>
                  <td className="py-3 px-3 font-bold text-cyan-400">{parameterScores.keystrokeMatch}%</td>
                  <td className="py-3 px-3">
                    <div className="w-32 bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-cyan-400 h-full" style={{ width: `${parameterScores.keystrokeMatch}%` }} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold">Mouse Behaviour Match</td>
                  <td className="py-3 px-3 font-bold text-purple-400">{parameterScores.mouseMatch}%</td>
                  <td className="py-3 px-3">
                    <div className="w-32 bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-400 h-full" style={{ width: `${parameterScores.mouseMatch}%` }} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold">Scroll Behaviour Match</td>
                  <td className="py-3 px-3 font-bold text-blue-400">{parameterScores.scrollMatch}%</td>
                  <td className="py-3 px-3">
                    <div className="w-32 bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-400 h-full" style={{ width: `${parameterScores.scrollMatch}%` }} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold">Overall Vector Similarity</td>
                  <td className="py-3 px-3 font-bold text-emerald-400">{parameterScores.overallSimilarity}%</td>
                  <td className="py-3 px-3">
                    <div className="w-32 bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full" style={{ width: `${parameterScores.overallSimilarity}%` }} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold">Anomaly Index (Isolation Forest)</td>
                  <td className="py-3 px-3 font-bold text-red-400">{parameterScores.anomalyScore}%</td>
                  <td className="py-3 px-3">
                    <div className="w-32 bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-400 h-full" style={{ width: `${parameterScores.anomalyScore}%` }} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-gray-950/80 rounded-xl border border-gray-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-cyan-400">Detected Issues & Diagnostic Feed:</span>
            <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
              {detectedIssues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
