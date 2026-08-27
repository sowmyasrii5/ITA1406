import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ShieldCheck, Info, Trash2 } from 'lucide-react';

export const PrivacyConsentBanner: React.FC = () => {
  const { hasConsent, setPrivacyConsent, clearProfile } = useAuthStore();

  if (!hasConsent) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-72 z-50 bg-gray-900/95 border border-cyan-500/40 p-4 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3 max-w-3xl">
          <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/30">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Educational Cybersecurity Privacy & Consent Notice
            </h4>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              This system is an <strong>educational cybersecurity prototype</strong> designed to demonstrate continuous behavioural biometric authentication. Only keypress timings, mouse velocities, and scroll intervals are captured locally in your browser memory for pattern recognition. No personal data or credentials are stored or transmitted.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => clearProfile()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300 border border-gray-700"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Purge Data</span>
          </button>
          <button
            onClick={() => setPrivacyConsent(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-bold text-white shadow-md glow-cyan"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Accept & Continue</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};
