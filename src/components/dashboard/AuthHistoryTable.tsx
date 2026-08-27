import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { StatusBadge } from '../common/StatusBadge';
import { Search, Download, Filter } from 'lucide-react';

export const AuthHistoryTable: React.FC = () => {
  const { authHistory } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  const filteredHistory = authHistory.filter((item) => {
    const matchesSearch =
      item.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = filterRisk === 'ALL' || item.riskLevel === filterRisk;

    return matchesSearch && matchesRisk;
  });

  const exportCSV = () => {
    const headers = ['Time,User ID,User Name,Behaviour Score,Risk Level,Status,Anomaly Score'];
    const rows = filteredHistory.map(
      (h) => `${h.time},${h.userId},"${h.userName}",${h.behaviourScore}%,${h.riskLevel},${h.status},${h.anomalyScore}%`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `auth_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="soc-card p-6 space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search user ID, status, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="bg-transparent text-gray-300 focus:outline-none cursor-pointer font-semibold"
            >
              <option value="ALL" className="bg-gray-900">All Risk Levels</option>
              <option value="LOW" className="bg-gray-900">Low Risk</option>
              <option value="MEDIUM" className="bg-gray-900">Medium Risk</option>
              <option value="HIGH" className="bg-gray-900">High Risk</option>
            </select>
          </div>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-xs font-semibold text-cyan-400 border border-gray-800 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* History Log Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-950/60">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-900/80 text-gray-400 uppercase text-[10px] border-b border-gray-800">
            <tr>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">User ID & Name</th>
              <th className="py-3 px-4">Behaviour Score</th>
              <th className="py-3 px-4">Anomaly Score</th>
              <th className="py-3 px-4">Risk Level</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 text-gray-200">
            {filteredHistory.map((row) => (
              <tr key={row.id} className="hover:bg-gray-900/40 transition-colors">
                <td className="py-3.5 px-4 font-mono text-gray-400">{row.time}</td>
                <td className="py-3.5 px-4">
                  <span className="font-mono font-bold text-white block">{row.userId}</span>
                  <span className="text-[11px] text-gray-400">{row.userName}</span>
                </td>
                <td className="py-3.5 px-4 font-bold text-cyan-400">{row.behaviourScore}%</td>
                <td className="py-3.5 px-4 font-bold text-red-400">{row.anomalyScore}%</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      row.riskLevel === 'LOW'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : row.riskLevel === 'MEDIUM'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {row.riskLevel}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
