import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { MetricCard } from '../common/MetricCard';
import { HeatmapCanvas } from '../common/HeatmapCanvas';
import { PatternRecognition } from '../ai/PatternRecognition';
import { AuthHistoryTable } from './AuthHistoryTable';
import { ShieldCheck, Brain, AlertOctagon, Clock, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const OverviewDashboard: React.FC = () => {
  const {
    authResult,
    keystrokeMetrics,
    currentMouseEvents,
    sessionSeconds,
    currentKeystrokeEvents,
    activeProfile,
  } = useAuthStore();

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const typingGraphData = currentKeystrokeEvents.slice(-15).map((_, idx) => ({
    time: `T-${idx + 1}`,
    wpm: Math.round(keystrokeMetrics.wpm + (Math.sin(idx) * 8)),
    consistency: keystrokeMetrics.consistencyScore,
  }));

  return (
    <div className="space-y-8 pb-10">
      {/* Top Section: 4 Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Authentication Status"
          value={authResult.status}
          subtitle={`User: ${activeProfile.userId}`}
          icon={<ShieldCheck className="w-6 h-6 text-emerald-400" />}
          trend={authResult.status === 'VERIFIED' ? 'Low Risk' : authResult.status === 'SUSPICIOUS' ? 'Medium Risk' : 'High Threat'}
          trendColor={authResult.status === 'VERIFIED' ? 'green' : authResult.status === 'SUSPICIOUS' ? 'amber' : 'red'}
        />

        <MetricCard
          title="AI Confidence Score"
          value={`${authResult.confidenceScore}%`}
          subtitle="Model Accuracy Match"
          icon={<Brain className="w-6 h-6 text-cyan-400" />}
          trend="94.2% Baseline"
          trendColor="cyan"
        />

        <MetricCard
          title="Anomaly Detection"
          value={`${authResult.parameterScores.anomalyScore}%`}
          subtitle="Isolation Forest Outlier"
          icon={<AlertOctagon className="w-6 h-6 text-amber-400" />}
          trend={authResult.parameterScores.anomalyScore < 30 ? 'Low Anomaly' : 'High Anomaly'}
          trendColor={authResult.parameterScores.anomalyScore < 30 ? 'green' : 'red'}
        />

        <MetricCard
          title="Active Session"
          value={formatTimer(sessionSeconds)}
          subtitle="Continuous Monitoring"
          icon={<Clock className="w-6 h-6 text-purple-400" />}
          trend="Live Telemetry"
          trendColor="cyan"
        />
      </div>

      {/* Analytics Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Typing Behaviour Line Graph */}
        <div className="soc-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>1. Typing Speed & Consistency Analysis</span>
            </h4>
            <span className="text-xs text-gray-400">Real-time WPM Stream</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={typingGraphData.length > 0 ? typingGraphData : [{ time: '0', wpm: 65, consistency: 92 }]}>
                <XAxis dataKey="time" stroke="#4B5563" tick={{ fontSize: 10 }} />
                <YAxis stroke="#4B5563" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '11px' }} />
                <Line type="monotone" dataKey="wpm" stroke="#06B6D4" strokeWidth={2.5} name="Typing WPM" dot={false} />
                <Line type="monotone" dataKey="consistency" stroke="#10B981" strokeWidth={2} strokeDasharray="3 3" name="Consistency %" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Mouse Trajectory / Heatmap Visualizer */}
        <div className="soc-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>2. Mouse Trajectory & Heatmap Analysis</span>
            </h4>
            <span className="text-xs text-purple-400 font-semibold">{currentMouseEvents.length} Points Tracked</span>
          </div>

          <HeatmapCanvas events={currentMouseEvents} width={500} height={220} showHeatmap={true} />
        </div>
      </div>

      {/* 3. Behaviour Similarity Graph (Radar Chart) */}
      <PatternRecognition />

      {/* 4. Authentication History Table */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>4. Recent Session Authentication Logs</span>
        </h4>
        <AuthHistoryTable />
      </div>
    </div>
  );
};
