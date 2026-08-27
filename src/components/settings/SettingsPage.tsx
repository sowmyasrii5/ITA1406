import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Settings, ShieldCheck, Trash2, Server, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { clearProfile, hasConsent, setPrivacyConsent } = useAuthStore();
  const [pythonApiUrl, setPythonApiUrl] = useState('http://localhost:5000/api');
  const [usePythonBackend, setUsePythonBackend] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="soc-card p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/30">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">System & AI Settings</h3>
            <p className="text-xs text-gray-400">Configure machine learning thresholds, local storage, and Python backend options</p>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs shadow-md glow-cyan transition-all"
        >
          <Check className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-semibold">
          Settings saved successfully!
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Python Backend Connectivity */}
        <div className="soc-card p-6 space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-400" />
            <span>Python Scikit-Learn ML Backend Connection</span>
          </h4>

          <div className="flex items-center justify-between p-4 bg-gray-950/80 rounded-xl border border-gray-800">
            <div>
              <span className="text-xs font-bold text-white">Enable External Python Flask API</span>
              <p className="text-[11px] text-gray-400">Route classification requests to standalone `backend/app.py` service</p>
            </div>
            <input
              type="checkbox"
              checked={usePythonBackend}
              onChange={(e) => setUsePythonBackend(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-300 font-semibold">Python Backend Endpoint URL:</label>
            <input
              type="text"
              value={pythonApiUrl}
              onChange={(e) => setPythonApiUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs font-mono text-cyan-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Data & Privacy Management */}
        <div className="soc-card p-6 space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Privacy & Profile Data Management</span>
          </h4>

          <div className="flex items-center justify-between p-4 bg-gray-950/80 rounded-xl border border-gray-800">
            <div>
              <span className="text-xs font-bold text-white">Educational Privacy Consent</span>
              <p className="text-[11px] text-gray-400">Allow local in-memory event tracking for biometric feature generation</p>
            </div>
            <button
              onClick={() => setPrivacyConsent(!hasConsent)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                hasConsent ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {hasConsent ? 'Consent Active' : 'Consent Revoked'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-950/80 rounded-xl border border-red-500/30">
            <div>
              <span className="text-xs font-bold text-red-400">Purge Local Biometric Data</span>
              <p className="text-[11px] text-gray-400">Clear all captured keystroke events, mouse trajectories, and profiles</p>
            </div>
            <button
              onClick={() => clearProfile()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-xs font-bold transition-all glow-red"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge Profile Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
