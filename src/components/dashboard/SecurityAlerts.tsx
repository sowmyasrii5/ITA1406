import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Bell, ShieldAlert, CheckCircle2, UserCheck, Lock, LogOut } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SecurityAlerts: React.FC = () => {
  const { securityAlerts, resolveAlert } = useAuthStore();
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredAlerts = securityAlerts.filter((alert) => {
    if (filterSeverity === 'ALL') return true;
    return alert.riskLevel === filterSeverity;
  });

  const handleActionClick = (alertId: string, actionName: string) => {
    resolveAlert(alertId);
    if (actionName === 'Verify Identity') {
      try {
        confetti({ particleCount: 50, origin: { y: 0.7 } });
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="soc-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500/10 rounded-xl text-red-400 border border-red-500/30">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Security Alerts & Threat Response Center</h3>
            <p className="text-xs text-gray-400">Automated incident reporting triggered by behavioural anomaly threshold breaches</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterSeverity(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterSeverity === lvl
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 glow-cyan'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
              }`}
            >
              {lvl} {lvl !== 'ALL' && 'Risk'}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          let alertBorder = 'border-red-500/40 bg-red-950/20';
          let alertIcon = <ShieldAlert className="w-6 h-6 text-red-400" />;
          let badgeBg = 'bg-red-500/10 text-red-400 border-red-500/30 glow-red';

          if (alert.riskLevel === 'MEDIUM') {
            alertBorder = 'border-amber-500/40 bg-amber-950/20';
            alertIcon = <ShieldAlert className="w-6 h-6 text-amber-400" />;
            badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30 glow-amber';
          } else if (alert.riskLevel === 'LOW') {
            alertBorder = 'border-emerald-500/40 bg-emerald-950/20';
            alertIcon = <CheckCircle2 className="w-6 h-6 text-emerald-400" />;
            badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 glow-green';
          }

          return (
            <div key={alert.id} className={`soc-card p-6 border-l-4 ${alertBorder} space-y-4`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800">{alertIcon}</div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="text-sm font-extrabold text-white">{alert.message}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeBg}`}>
                        {alert.riskLevel} RISK
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                      <span>User ID: <strong className="text-white">{alert.userId}</strong></span>
                      <span>Time: <strong className="text-gray-300">{alert.timestamp}</strong></span>
                      <span>Similarity: <strong className="text-cyan-400">{alert.similarityScore}%</strong></span>
                      <span>Anomaly Score: <strong className="text-red-400">{alert.anomalyScore}%</strong></span>
                    </div>
                  </div>
                </div>

                {alert.resolved ? (
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Threat Resolved</span>
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/30 animate-pulse">
                    Action Required
                  </span>
                )}
              </div>

              <div className="p-3.5 bg-gray-950/80 rounded-xl border border-gray-800 text-xs text-gray-300 space-y-1">
                <p><strong className="text-white">Detected Issue:</strong> {alert.detectedIssue}</p>
                <p><strong className="text-cyan-400">Recommended System Action:</strong> {alert.recommendedAction}</p>
              </div>

              {!alert.resolved && (
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => handleActionClick(alert.id, 'Verify Identity')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/40 text-xs font-bold transition-all glow-cyan"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Verify Identity (MFA)</span>
                  </button>

                  <button
                    onClick={() => handleActionClick(alert.id, 'Lock Account')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 text-xs font-bold transition-all glow-amber"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lock Account Session</span>
                  </button>

                  <button
                    onClick={() => handleActionClick(alert.id, 'Terminate Session')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-xs font-bold transition-all glow-red"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Terminate Session</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
