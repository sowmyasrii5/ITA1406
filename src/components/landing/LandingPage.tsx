import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ProcessFlowDiagram } from '../common/ProcessFlowDiagram';
import {
  Shield,
  Zap,
  Lock,
  Brain,
  Activity,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab, toggleLiveDemo } = useAuthStore();

  const handleLaunchDashboard = () => {
    setActiveTab('dashboard');
  };

  const handleStartDemo = () => {
    toggleLiveDemo(true);
    setActiveTab('capture');
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Section */}
      <section className="soc-card p-8 md:p-12 relative overflow-hidden bg-gradient-to-br from-gray-900/90 via-gray-900/60 to-purple-950/40 border-cyan-500/20">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold glow-cyan">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ethical Hacking & AI Security Prototype 2026</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Behavioural Biometric Authentication using Artificial Intelligence
          </h1>

          <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-3xl">
            A continuous authentication system that uses Artificial Intelligence, behavioural biometrics, pattern recognition, and anomaly detection to verify users continuously beyond traditional passwords.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handleLaunchDashboard}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl glow-cyan transition-all"
            >
              <Shield className="w-4 h-4" />
              <span>Launch Secure Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleStartDemo}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold text-sm glow-purple transition-all"
            >
              <Zap className="w-4 h-4 text-purple-400" />
              <span>Start Live Authentication Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Visual Telemetry Flow */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>Continuous Telemetry & AI Decision Pipeline</span>
          </h3>
          <span className="text-xs text-gray-400">Real-time Biometric Extraction</span>
        </div>
        <ProcessFlowDiagram currentStatus="VERIFIED" />
      </section>

      {/* Comparison Matrix: Static Auth vs Continuous Auth */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="soc-card p-6 border-red-500/20 bg-red-950/10">
          <div className="flex items-center gap-3 text-red-400 mb-4">
            <XCircle className="w-6 h-6" />
            <h4 className="text-base font-bold text-white">Traditional Authentication</h4>
          </div>
          <ul className="space-y-3 text-xs text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              <span>One-time check at initial login only (Static verification).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              <span>Vulnerable to session hijacking, shoulder surfing, and credential stuffing.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              <span>Cannot detect unauthorized users interacting after a successful login.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              <span>Requires intrusive pop-ups or periodic password prompts.</span>
            </li>
          </ul>
        </div>

        <div className="soc-card p-6 border-emerald-500/30 bg-emerald-950/10 glow-green">
          <div className="flex items-center gap-3 text-emerald-400 mb-4">
            <CheckCircle className="w-6 h-6" />
            <h4 className="text-base font-bold text-white">AI Behavioural Biometric Auth</h4>
          </div>
          <ul className="space-y-3 text-xs text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Continuous passive background monitoring during active sessions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Analyzes unique keystroke dynamics, mouse speed, trajectories, and scroll patterns.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Real-time anomaly scoring with Random Forest & Isolation Forest ML models.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Instant step-up re-authentication or automated session lock upon threat detection.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Feature Modules Summary Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="soc-card p-6 space-y-3 cursor-pointer hover:border-cyan-500/50" onClick={() => setActiveTab('capture')}>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Module 1: Behaviour Capture</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Real-time extraction of key dwell times, flight times, WPM, mouse acceleration, click intervals, and scroll frequencies.
          </p>
        </div>

        <div className="soc-card p-6 space-y-3 cursor-pointer hover:border-purple-500/50" onClick={() => setActiveTab('ai_engine')}>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Brain className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Module 2: AI ML Auth Engine</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Multi-model classification using Random Forest, Isolation Forest, Cosine Similarity, and SVM pattern match scoring.
          </p>
        </div>

        <div className="soc-card p-6 space-y-3 cursor-pointer hover:border-emerald-500/50" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Lock className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Module 3: SOC Monitoring</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Real-time security operations center dashboard, radar similarity charts, security alert feeds, and fraud risk engines.
          </p>
        </div>
      </section>
    </div>
  );
};
