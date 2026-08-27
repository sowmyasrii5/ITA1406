import React from 'react';
import { User, Activity, Cpu, Brain, Shield, AlertOctagon, CheckCircle2 } from 'lucide-react';
import type { AuthStatus } from '../../types/biometrics';

interface ProcessFlowDiagramProps {
  currentStatus?: AuthStatus;
}

export const ProcessFlowDiagram: React.FC<ProcessFlowDiagramProps> = ({ currentStatus = 'VERIFIED' }) => {
  const steps = [
    { title: 'User Interaction', icon: <User className="w-5 h-5 text-cyan-400" />, desc: 'Typing, Mouse & Scroll' },
    { title: 'Data Capture', icon: <Activity className="w-5 h-5 text-cyan-400" />, desc: 'Time-stamped Telemetry' },
    { title: 'Feature Extraction', icon: <Cpu className="w-5 h-5 text-purple-400" />, desc: 'Hold, Flight, Velocity' },
    { title: 'AI/ML Analysis', icon: <Brain className="w-5 h-5 text-purple-400" />, desc: 'Random Forest & SVM' },
    { title: 'Pattern Match', icon: <Shield className="w-5 h-5 text-emerald-400" />, desc: 'Cosine & Euclidean' },
    { title: 'Anomaly Check', icon: <AlertOctagon className="w-5 h-5 text-amber-400" />, desc: 'Isolation Forest' },
    { title: 'Auth Decision', icon: <CheckCircle2 className="w-5 h-5 text-cyan-400" />, desc: currentStatus },
  ];

  return (
    <div className="soc-card p-6 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[760px] gap-2">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-700/60 flex items-center justify-center group-hover:border-cyan-500/60 group-hover:scale-105 transition-all shadow-md">
                {step.icon}
              </div>
              <span className="text-xs font-semibold text-white mt-2.5">{step.title}</span>
              <span className="text-[10px] text-gray-400 mt-0.5">{step.desc}</span>
            </div>

            {idx < steps.length - 1 && (
              <div className="flex-1 flex items-center justify-center px-1">
                <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-cyan-500/40 relative">
                  <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
