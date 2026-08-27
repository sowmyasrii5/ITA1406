import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import type { ActiveTab } from '../../types/biometrics';
import {
  LayoutDashboard,
  Activity,
  Cpu,
  Brain,
  AlertTriangle,
  Lock,
  Bell,
  ShieldAlert,
  History,
  Settings,
  Home,
  Shield,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, securityAlerts } = useAuthStore();

  const unreadAlertsCount = securityAlerts.filter((a) => !a.resolved).length;

  const menuItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'landing', label: 'Overview & Landing', icon: <Home className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Security Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'capture', label: 'Behaviour Capture', icon: <Activity className="w-4 h-4" /> },
    { id: 'ai_engine', label: 'AI Authentication', icon: <Cpu className="w-4 h-4" /> },
    { id: 'pattern_recognition', label: 'Pattern Recognition', icon: <Brain className="w-4 h-4" /> },
    { id: 'anomaly_detection', label: 'Anomaly Detection', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'continuous_verification', label: 'Continuous Verification', icon: <Lock className="w-4 h-4" /> },
    { id: 'security_alerts', label: 'Security Alerts', icon: <Bell className="w-4 h-4" />, badge: unreadAlertsCount },
    { id: 'fraud_detection', label: 'Fraud Detection', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'auth_history', label: 'Auth History', icon: <History className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-gray-950/90 border-r border-gray-800/80 flex flex-col justify-between h-screen sticky top-0 z-30 select-none backdrop-blur-xl">
      <div>
        <div className="p-5 border-b border-gray-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-lg glow-cyan">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-wide leading-tight">
              BIO-AUTH AI
            </h1>
            <p className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase mt-0.5">
              Ethical Hacking Prototype
            </p>
          </div>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/10 text-cyan-400 border border-cyan-500/30 shadow-md'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-cyan-400' : 'text-gray-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800/80 bg-gray-900/40 text-center">
        <div className="flex items-center justify-center gap-2 text-[11px] text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>SOC Telemetry Active</span>
        </div>
        <p className="text-[10px] text-gray-400 mt-1">CS Capstone Project 2026</p>
      </div>
    </aside>
  );
};
