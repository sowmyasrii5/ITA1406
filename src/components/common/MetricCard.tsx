import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  trendColor?: 'green' | 'red' | 'amber' | 'cyan';
  borderGlow?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendColor = 'cyan',
}) => {
  let trendBg = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
  if (trendColor === 'green') trendBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (trendColor === 'red') trendBg = 'bg-red-500/10 text-red-400 border-red-500/20';
  if (trendColor === 'amber') trendBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';

  return (
    <div className="soc-card p-5 relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-2 tracking-tight">{value}</h3>
        </div>
        <div className="p-3 bg-gray-800/80 rounded-xl border border-gray-700/50 text-cyan-400 shadow-inner">
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
        {trend && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${trendBg}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
