import React from 'react';
import type { AuthStatus, RiskLevel } from '../../types/biometrics';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  status?: AuthStatus;
  riskLevel?: RiskLevel;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, riskLevel, showIcon = true }) => {
  if (status === 'VERIFIED' || riskLevel === 'LOW') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 glow-green">
        {showIcon && <ShieldCheck className="w-3.5 h-3.5" />}
        {status ? 'VERIFIED' : 'LOW RISK'}
      </span>
    );
  }

  if (status === 'SUSPICIOUS' || riskLevel === 'MEDIUM') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 glow-amber">
        {showIcon && <AlertTriangle className="w-3.5 h-3.5" />}
        {status ? 'SUSPICIOUS' : 'MEDIUM RISK'}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/30 glow-red">
      {showIcon && <ShieldAlert className="w-3.5 h-3.5" />}
      {status ? 'BLOCKED' : 'HIGH RISK'}
    </span>
  );
};
