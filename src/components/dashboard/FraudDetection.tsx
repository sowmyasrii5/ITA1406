import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { IsolationForestDetector } from '../../ml/IsolationForest';
import { ShieldAlert, Bot, CheckCircle, AlertTriangle } from 'lucide-react';

export const FraudDetection: React.FC = () => {
  const { currentFeatureVector, authResult } = useAuthStore();
  const detector = new IsolationForestDetector();
  const botCheck = detector.detectBotPatterns(currentFeatureVector);

  const fraudScore = Math.min(99, Math.max(5, Math.round(authResult.parameterScores.anomalyScore * 0.85 + (botCheck.isBot ? 30 : 0))));

  let riskLevelBadge = 'LOW RISK';
  let riskBadgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 glow-green';
  if (fraudScore > 65) {
    riskLevelBadge = 'HIGH RISK / POTENTIAL ACCOUNT TAKEOVER';
    riskBadgeStyle = 'bg-red-500/10 text-red-400 border-red-500/30 glow-red animate-pulse';
  } else if (fraudScore > 35) {
    riskLevelBadge = 'MEDIUM RISK / SUSPICIOUS DEVIATION';
    riskBadgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/30 glow-amber';
  }

  const fraudIndicatorsList = [
    { title: 'Sudden Typing Cadence Shift', detected: currentFeatureVector.wpm > 110, desc: 'Extreme variation in keystroke dwell time or flight time.' },
    { title: 'Abnormal Mouse Trajectory', detected: currentFeatureVector.mouseSpeed > 1200, desc: 'Linear non-human movement without micro-jitter.' },
    { title: 'Automated Rapid Click Burst', detected: currentFeatureVector.clickInterval < 60 && currentFeatureVector.clickInterval > 0, desc: 'Sub-60ms click intervals suggesting auto-clicker software.' },
    { title: 'Unusual Navigation Velocity', detected: currentFeatureVector.interactionFrequency > 120, desc: 'Rapid navigation across endpoints beyond human speed.' },
    { title: 'Isolation Forest Anomaly Elevation', detected: authResult.parameterScores.anomalyScore > 40, desc: 'High distance from registered feature cluster centroid.' },
  ];

  return (
    <div className="space-y-6">
      <div className="soc-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">AI Fraud Detection & Prevention Center</h3>
            <p className="text-xs text-gray-400">Automated threat engine detecting account takeover (ATO) and synthetic automation</p>
          </div>
        </div>

        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${riskBadgeStyle}`}>
          {riskLevelBadge}
        </span>
      </div>

      {/* Fraud Risk Gauge & Bot Detection Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="soc-card p-6 flex flex-col items-center justify-center text-center space-y-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Calculated Fraud Threat Score</span>
          <p className="text-5xl font-extrabold text-purple-400 tracking-tight">{fraudScore}%</p>
          <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 via-amber-500 to-purple-600 h-full" style={{ width: `${fraudScore}%` }} />
          </div>
          <span className="text-[10px] text-gray-400">Multi-vector threat heuristic assessment</span>
        </div>

        <div className="soc-card p-6 md:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Synthetic Automation & Bot Heuristics Check</span>
            </h4>
            <span className={`text-xs font-bold ${botCheck.isBot ? 'text-red-400' : 'text-emerald-400'}`}>
              {botCheck.isBot ? 'BOT DETECTED' : 'HUMAN VERIFIED'}
            </span>
          </div>

          <div className="p-4 bg-gray-950/80 rounded-xl border border-gray-800 space-y-2 text-xs">
            <div className="flex justify-between text-gray-300">
              <span>Automation Detection Status:</span>
              <span className={`font-bold ${botCheck.isBot ? 'text-red-400' : 'text-emerald-400'}`}>{botCheck.reason}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Synthetic Bot Confidence:</span>
              <span className="font-bold text-white">{botCheck.botConfidence}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-300 block">Fraud Indicator Matrix:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fraudIndicatorsList.map((ind, idx) => (
                <div key={idx} className="p-3 bg-gray-950/80 rounded-xl border border-gray-800 flex items-start gap-2.5 text-xs">
                  {ind.detected ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className={`font-semibold ${ind.detected ? 'text-amber-400' : 'text-gray-200'}`}>
                      {ind.title}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">{ind.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
