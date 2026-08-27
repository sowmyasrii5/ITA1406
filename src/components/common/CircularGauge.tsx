import React from 'react';
import type { AuthStatus } from '../../types/biometrics';

interface CircularGaugeProps {
  score: number; // 0-100
  status: AuthStatus;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  score,
  status,
  size = 200,
  strokeWidth = 16,
  label = 'Authentication Confidence',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#10B981'; // Green (Verified)
  let glowClass = 'glow-green';
  let statusText = '🟢 VERIFIED USER';
  let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  if (status === 'SUSPICIOUS') {
    strokeColor = '#F59E0B'; // Yellow/Orange
    glowClass = 'glow-amber';
    statusText = '🟡 SUSPICIOUS USER';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else if (status === 'BLOCKED') {
    strokeColor = '#EF4444'; // Red
    glowClass = 'glow-red';
    statusText = '🔴 HIGH RISK / BLOCKED';
    badgeBg = 'bg-red-500/10 text-red-400 border-red-500/30';
  }

  return (
    <div className="flex flex-col items-center justify-center relative p-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1F2937"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Indicator Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Score & Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
            {score}%
          </span>
          <span className="text-xs uppercase font-medium tracking-wider text-gray-400 mt-1">
            Score
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-1">
        <div className={`px-3 py-1 text-xs font-semibold rounded-full border ${badgeBg} ${glowClass}`}>
          {statusText}
        </div>
        <span className="text-xs text-gray-400 font-medium mt-1">{label}</span>
      </div>
    </div>
  );
};
