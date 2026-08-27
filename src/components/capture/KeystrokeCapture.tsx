import React, { useState, useRef } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import type { KeystrokeEvent } from '../../types/biometrics';
import { Keyboard, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const KeystrokeCapture: React.FC = () => {
  const { recordKeystroke, keystrokeMetrics, currentKeystrokeEvents } = useAuthStore();
  const [typedText, setTypedText] = useState('');
  const lastKeyUpTimeRef = useRef<number>(0);
  const keyPressStartMap = useRef<Map<string, number>>(new Map());

  const samplePrompt = "The quick cybersecurity artificial intelligence system verifies behavioural biometrics continuously.";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!keyPressStartMap.current.has(e.code)) {
      keyPressStartMap.current.set(e.code, performance.now());
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const keyUpTime = performance.now();
    const keyDownTime = keyPressStartMap.current.get(e.code) || keyUpTime - 110;
    keyPressStartMap.current.delete(e.code);

    const holdDuration = Math.max(15, Math.round(keyUpTime - keyDownTime));
    const flightTime = lastKeyUpTimeRef.current > 0 ? Math.max(10, Math.round(keyDownTime - lastKeyUpTimeRef.current)) : 95;
    lastKeyUpTimeRef.current = keyUpTime;

    const event: KeystrokeEvent = {
      key: e.key,
      code: e.code,
      keyDownTime,
      keyUpTime,
      holdDuration,
      flightTime,
    };

    recordKeystroke(event);
  };

  const chartData = currentKeystrokeEvents.length > 0
    ? currentKeystrokeEvents.slice(-20).map((ev, idx) => ({
        step: `K-${idx + 1}`,
        key: ev.key.length === 1 ? ev.key : ev.code,
        hold: ev.holdDuration,
        flight: ev.flightTime,
      }))
    : [{ step: '0', key: 'Init', hold: 118, flight: 95 }];

  return (
    <div className="soc-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/30">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Keystroke Dynamics Capture</h3>
            <p className="text-xs text-gray-400">Type the sample prompt sentence below to analyze key hold & flight rhythms</p>
          </div>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          Module 1: Telemetry
        </span>
      </div>

      <div className="p-4 bg-gray-900/80 rounded-xl border border-gray-800 space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">Sample Prompt Sentence:</span>
        <p className="text-sm font-mono text-gray-200 select-none bg-gray-950 p-3 rounded-lg border border-gray-800">
          {samplePrompt}
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-300">Interactive Typing Interaction Zone:</label>
        <input
          type="text"
          value={typedText}
          onChange={(e) => setTypedText(e.target.value)}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          placeholder="Start typing here to capture your keystroke rhythm dynamics..."
          className="w-full px-4 py-3.5 rounded-xl bg-gray-950 border border-cyan-500/40 text-white font-mono text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 text-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold">Typing Speed</span>
          <p className="text-xl font-extrabold text-cyan-400 mt-1">{keystrokeMetrics.wpm} WPM</p>
        </div>

        <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 text-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold">Avg Hold Time</span>
          <p className="text-xl font-extrabold text-purple-400 mt-1">{keystrokeMetrics.avgHoldTime} ms</p>
        </div>

        <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 text-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold">Avg Flight Time</span>
          <p className="text-xl font-extrabold text-blue-400 mt-1">{keystrokeMetrics.avgFlightTime} ms</p>
        </div>

        <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 text-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold">Consistency</span>
          <p className="text-xl font-extrabold text-emerald-400 mt-1">{keystrokeMetrics.consistencyScore}%</p>
        </div>

        <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 text-center col-span-2 md:col-span-1">
          <span className="text-[10px] text-gray-400 uppercase font-semibold">Total Keystrokes</span>
          <p className="text-xl font-extrabold text-white mt-1">{keystrokeMetrics.totalKeystrokes}</p>
        </div>
      </div>

      <div className="p-4 bg-gray-950/80 rounded-xl border border-gray-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-300 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <span>Keystroke Dwell & Flight Time Rhythm Stream</span>
          </span>
          <div className="flex items-center gap-4 text-[10px]">
            <span className="flex items-center gap-1 text-purple-400">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> Hold Time (ms)
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-500" /> Flight Time (ms)
            </span>
          </div>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="step" stroke="#4B5563" tick={{ fontSize: 10 }} />
              <YAxis stroke="#4B5563" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '11px' }}
              />
              <Line type="monotone" dataKey="hold" stroke="#8B5CF6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="flight" stroke="#06B6D4" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
