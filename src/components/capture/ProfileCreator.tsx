import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { UserCheck, ShieldCheck, Cpu, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProfileCreator: React.FC = () => {
  const { activeProfile, createProfileFromCapturedData, currentFeatureVector } = useAuthStore();
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const handleCreateProfile = () => {
    createProfileFromCapturedData('User Custom Baseline');
    setCreatedSuccess(true);
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    } catch {
      // ignore
    }
  };

  return (
    <div className="soc-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/30">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Behavioural Profile Creation</h3>
            <p className="text-xs text-gray-400">Convert captured interaction metrics into a registered biometric baseline profile</p>
          </div>
        </div>

        <button
          onClick={handleCreateProfile}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg glow-green transition-all"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Create My Behavioural Profile</span>
        </button>
      </div>

      {createdSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between animate-pulse-fast">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
            <div>
              <h4 className="text-sm font-extrabold text-white">Behavioural Profile Created Successfully</h4>
              <p className="text-xs text-emerald-300">Baseline features registered into AI Classification Model</p>
            </div>
          </div>
          <div className="text-right text-xs">
            <p className="text-gray-400">Profile ID: <span className="font-mono text-white font-bold">{activeProfile.profileId}</span></p>
            <p className="text-gray-400">Baseline Confidence: <span className="text-emerald-400 font-bold">{activeProfile.baselineConfidence}%</span></p>
          </div>
        </div>
      )}

      {/* Profile Baseline Feature Vector Grid */}
      <div className="p-5 bg-gray-950/80 rounded-xl border border-gray-800 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <span className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Active Registered Feature Vector (Profile ID: {activeProfile.profileId})</span>
          </span>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            Baseline Confidence: {activeProfile.baselineConfidence}%
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-gray-900/60 rounded-lg border border-gray-800">
            <span className="text-gray-400">WPM:</span> <span className="font-bold text-white">{currentFeatureVector.wpm}</span>
          </div>
          <div className="p-3 bg-gray-900/60 rounded-lg border border-gray-800">
            <span className="text-gray-400">Hold Duration:</span> <span className="font-bold text-purple-400">{currentFeatureVector.avgHoldTime} ms</span>
          </div>
          <div className="p-3 bg-gray-900/60 rounded-lg border border-gray-800">
            <span className="text-gray-400">Flight Duration:</span> <span className="font-bold text-cyan-400">{currentFeatureVector.avgFlightTime} ms</span>
          </div>
          <div className="p-3 bg-gray-900/60 rounded-lg border border-gray-800">
            <span className="text-gray-400">Typing Consistency:</span> <span className="font-bold text-emerald-400">{currentFeatureVector.typingConsistency}%</span>
          </div>
          <div className="p-3 bg-gray-900/60 rounded-lg border border-gray-800">
            <span className="text-gray-400">Mouse Velocity:</span> <span className="font-bold text-white">{currentFeatureVector.mouseSpeed} px/s</span>
          </div>
          <div className="p-3 bg-gray-900/60 rounded-lg border border-gray-800">
            <span className="text-gray-400">Mouse Acceleration:</span> <span className="font-bold text-purple-400">{currentFeatureVector.mouseAcceleration} px/s²</span>
          </div>
          <div className="p-3 bg-gray-900/60 rounded-lg border border-gray-800">
            <span className="text-gray-400">Click Timing:</span> <span className="font-bold text-blue-400">{currentFeatureVector.clickInterval} ms</span>
          </div>
          <div className="p-3 bg-gray-900/60 rounded-lg border border-gray-800">
            <span className="text-gray-400">Scroll Speed:</span> <span className="font-bold text-white">{currentFeatureVector.scrollSpeed} px/s</span>
          </div>
        </div>
      </div>
    </div>
  );
};
