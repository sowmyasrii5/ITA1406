import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { StatusBadge } from '../common/StatusBadge';
import { Play, AlertOctagon, RefreshCw, Clock, UserCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    selectedUserId,
    switchUserProfile,
    userProfiles,
    authResult,
    isLiveDemoActive,
    toggleLiveDemo,
    simulateSuspiciousUser,
    resetSimulation,
    sessionSeconds,
    isSuspiciousSimulated,
  } = useAuthStore();

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="bg-gray-950/80 border-b border-gray-800/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-xl">
      {/* Active User Switcher */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-900/90 border border-gray-800 px-3 py-1.5 rounded-xl text-xs">
          <UserCheck className="w-4 h-4 text-cyan-400" />
          <span className="text-gray-400 font-medium">Active Subject:</span>
          <select
            value={selectedUserId}
            onChange={(e) => switchUserProfile(e.target.value)}
            className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
          >
            {Object.values(userProfiles).map((p) => (
              <option key={p.userId} value={p.userId} className="bg-gray-900 text-white">
                {p.userId} — {p.userName}
              </option>
            ))}
          </select>
        </div>

        {/* Status Badge */}
        <StatusBadge status={authResult.status} riskLevel={authResult.riskLevel} />
      </div>

      {/* Action Controls & Session Timer */}
      <div className="flex items-center gap-3">
        {/* Session Timer */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-900/80 border border-gray-800 text-xs text-gray-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Active Session:</span>
          <span className="font-mono font-bold text-white">{formatTimer(sessionSeconds)}</span>
        </div>

        {/* Demo Controls */}
        <button
          onClick={() => toggleLiveDemo()}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isLiveDemoActive
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 glow-green'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
          }`}
        >
          <Play className={`w-3.5 h-3.5 ${isLiveDemoActive ? 'animate-pulse' : ''}`} />
          <span>{isLiveDemoActive ? 'Demo Active' : 'Start Live Auth Demo'}</span>
        </button>

        <button
          onClick={() => (isSuspiciousSimulated ? resetSimulation() : simulateSuspiciousUser())}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isSuspiciousSimulated
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 glow-amber'
              : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40 glow-red'
          }`}
        >
          {isSuspiciousSimulated ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Reset Simulation</span>
            </>
          ) : (
            <>
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Simulate Suspicious User</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
