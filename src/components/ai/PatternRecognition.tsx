import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Brain, Sparkles } from 'lucide-react';

export const PatternRecognition: React.FC = () => {
  const { activeProfile, currentFeatureVector, authResult } = useAuthStore();
  const b = activeProfile.baselineVector;
  const c = currentFeatureVector;

  const radarData = [
    { subject: 'Typing Rhythm', baseline: 90, current: Math.min(100, Math.round((c.wpm / (b.wpm || 1)) * 90)) },
    { subject: 'Key Hold Time', baseline: 85, current: Math.min(100, Math.round((c.avgHoldTime / (b.avgHoldTime || 1)) * 85)) },
    { subject: 'Mouse Speed', baseline: 88, current: Math.min(100, Math.round((c.mouseSpeed / (b.mouseSpeed || 1)) * 88)) },
    { subject: 'Click Pattern', baseline: 92, current: Math.min(100, Math.round((c.clickInterval / (b.clickInterval || 1)) * 92)) },
    { subject: 'Scroll Pattern', baseline: 80, current: Math.min(100, Math.round((c.scrollSpeed / (b.scrollSpeed || 1)) * 80)) },
    { subject: 'Session Activity', baseline: 95, current: Math.min(100, Math.round((c.interactionFrequency / (b.interactionFrequency || 1)) * 95)) },
  ];

  return (
    <div className="soc-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/30">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Pattern Recognition Engine</h3>
            <p className="text-xs text-gray-400">Multi-dimensional vector alignment comparing Baseline Profile vs Active Session</p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-bold glow-purple">
          Similarity: {authResult.parameterScores.overallSimilarity}%
        </div>
      </div>

      {/* Radar Chart & Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="h-72 w-full bg-gray-950/80 p-4 rounded-xl border border-gray-800">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#4B5563" />
              <Radar name="Registered Baseline" dataKey="baseline" stroke="#10B981" fill="#10B981" fillOpacity={0.25} />
              <Radar name="Active Session" dataKey="current" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.35} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '11px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Cosine & Euclidean Pattern Alignment</span>
          </h4>

          <p className="text-xs text-gray-300 leading-relaxed">
            The Pattern Recognition Engine continuously projects 6 biometric interaction dimensions into a hyper-dimensional vector space. High overlap between the green baseline polygon and cyan current session polygon indicates verified legitimate user activity.
          </p>

          <div className="p-4 bg-gray-950/80 rounded-xl border border-gray-800 space-y-2 text-xs">
            <div className="flex justify-between text-gray-300">
              <span>Keystroke Rhythm Vector Match:</span>
              <span className="font-bold text-cyan-400">{authResult.parameterScores.keystrokeMatch}%</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Mouse Dynamic Trajectory Match:</span>
              <span className="font-bold text-purple-400">{authResult.parameterScores.mouseMatch}%</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Scroll Frequency Vector Match:</span>
              <span className="font-bold text-blue-400">{authResult.parameterScores.scrollMatch}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
