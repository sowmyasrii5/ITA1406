import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { StatusBadge } from '../common/StatusBadge';
import { Lock, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const ContinuousMonitor: React.FC = () => {
  const { authResult, activeProfile } = useAuthStore();
  const [liveStreamData, setLiveStreamData] = useState<{ time: string; confidence: number; anomaly: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLiveStreamData((prev) => [
        ...prev.slice(-15),
        {
          time: timeStr,
          confidence: authResult.confidenceScore,
          anomaly: authResult.parameterScores.anomalyScore,
        },
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, [authResult]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="soc-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/30">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Continuous User Verification Engine</h3>
            <p className="text-xs text-gray-400">User remains authenticated only while active behaviour aligns with registered baseline</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold glow-green">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Monitoring Status: LIVE</span>
          </span>
          <StatusBadge status={authResult.status} />
        </div>
      </div>

      {/* 4 Continuous Status Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-950/80 rounded-xl border border-gray-800 text-center space-y-1">
          <span className="text-[10px] text-gray-400 uppercase font-semibold">Session Status</span>
          <p className="text-xl font-extrabold text-emerald-400">ACTIVE</p>
        </div>

        <div className="p-4 bg-gray-950/80 rounded-xl border border-gray-800 text-center space-y-1">
          <span className="text-[10px] text-gray-400 uppercase font-semibold">Behavioural Match</span>
          <p className="text-xl font-extrabold text-cyan-400">{authResult.parameterScores.overallSimilarity}%</p>
        </div>

        <div className="p-4 bg-gray-950/80 rounded-xl border border-gray-800 text-center space-y-1">
          <span className="text-[10px] text-gray-400 uppercase font-semibold">AI Confidence</span>
          <p className="text-xl font-extrabold text-purple-400">{authResult.confidenceScore}%</p>
        </div>

        <div className="p-4 bg-gray-950/80 rounded-xl border border-gray-800 text-center space-y-1">
          <span className="text-[10px] text-gray-400 uppercase font-semibold">Active Subject</span>
          <p className="text-sm font-extrabold text-white mt-1">{activeProfile.userId}</p>
        </div>
      </div>

      {/* Live Stream Confidence Chart */}
      <div className="soc-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Real-time Confidence Stream (Updated every 2s)</span>
          </h4>
          <span className="text-xs text-gray-400">Subject: {activeProfile.userName}</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={liveStreamData.length > 0 ? liveStreamData : [{ time: '10:00', confidence: 93, anomaly: 8 }]}>
              <defs>
                <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAnomaly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#4B5563" tick={{ fontSize: 10 }} />
              <YAxis stroke="#4B5563" tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '11px' }} />
              <Area type="monotone" dataKey="confidence" stroke="#06B6D4" fillOpacity={1} fill="url(#colorConfidence)" name="AI Confidence %" />
              <Area type="monotone" dataKey="anomaly" stroke="#EF4444" fillOpacity={1} fill="url(#colorAnomaly)" name="Anomaly Score %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
