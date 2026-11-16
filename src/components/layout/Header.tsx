import React, { useState, useRef, useEffect } from 'react';
import { useAquaTech } from '../../context/AquaTechContext';
import {
  Bell,
  Radio,
  Play,
  Pause,
  Droplet,
  Filter,
  Sparkles,
  AlertTriangle,
  Info,
  CheckCircle2,
  Zap,
  X
} from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const {
    isSimulatedHardware,
    toggleHardwareMode,
    isLiveStreamActive,
    setIsLiveStreamActive,
    anomalies,
    events,
    setActiveModule,
    geminiApiKey,
    setIsGeminiModalOpen,
    setIsGeminiDrawerOpen
  } = useAquaTech();

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unresolvedAlerts = anomalies.filter(a => a.status !== 'resolved');
  const recentEvents = [...events].slice(0, 6);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifOpen]);

  const severityIcon = (sev: string) => {
    if (sev === 'high' || sev === 'alert' || sev === 'critical') return <AlertTriangle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />;
    if (sev === 'medium' || sev === 'warning') return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />;
    if (sev === 'success') return <CheckCircle2 className="w-3.5 h-3.5 text-[#65A875] flex-shrink-0" />;
    return <Info className="w-3.5 h-3.5 text-[#5CB6DC] flex-shrink-0" />;
  };

  const severityBg = (sev: string) => {
    if (sev === 'high' || sev === 'alert' || sev === 'critical') return 'bg-rose-50 border-rose-100';
    if (sev === 'medium' || sev === 'warning') return 'bg-amber-50 border-amber-100';
    if (sev === 'success') return 'bg-emerald-50 border-emerald-100';
    return 'bg-blue-50 border-blue-100';
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Title & Context */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-[#123B55] tracking-tight">{title}</h1>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
            AquaTech OS
          </span>
        </div>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-3">
        {/* Gemini AI Core Pill */}
        <button
          onClick={() => setIsGeminiModalOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs border ${
            geminiApiKey
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500 hover:from-purple-700 hover:to-indigo-700'
              : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
          }`}
          title="Configure Google Gemini API Key"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Gemini Active</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
        </button>

        {/* Copilot Drawer Toggle */}
        <button
          onClick={() => setIsGeminiDrawerOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200"
          title="Open AI Copilot Drawer"
        >
          <Zap className="w-3.5 h-3.5 text-purple-500" />
          <span>Copilot</span>
        </button>

        {/* Quick Nav */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveModule('cooldrop')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-slate-700 hover:bg-white hover:shadow-xs transition font-medium"
          >
            <Droplet className="w-3.5 h-3.5 text-[#21A6A0]" />
            CoolDrop
          </button>
          <button
            onClick={() => setActiveModule('purification')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-slate-700 hover:bg-white hover:shadow-xs transition font-medium"
          >
            <Filter className="w-3.5 h-3.5 text-[#5CB6DC]" />
            Purification
          </button>
        </div>

        {/* Live Stream Toggle */}
        <button
          onClick={() => setIsLiveStreamActive(!isLiveStreamActive)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
            isLiveStreamActive
              ? 'bg-[#21A6A0]/10 border-[#21A6A0]/30 text-[#123B55] hover:bg-[#21A6A0]/20'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          {isLiveStreamActive ? (
            <>
              <span className="w-2 h-2 rounded-full bg-[#21A6A0] animate-ping" />
              <span>Streaming</span>
              <Pause className="w-3.5 h-3.5 text-slate-500" />
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              <span>Paused</span>
            </>
          )}
        </button>

        {/* Hardware Mode Toggle */}
        <button
          onClick={toggleHardwareMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition shadow-xs ${
            isSimulatedHardware
              ? 'bg-[#123B55] text-white border-[#123B55] hover:bg-[#1a4f73]'
              : 'bg-white text-slate-700 border-dashed border-slate-400 hover:bg-slate-50'
          }`}
        >
          <Radio className={`w-3.5 h-3.5 ${isSimulatedHardware ? 'text-[#5CB6DC]' : 'text-slate-400'}`} />
          <span>{isSimulatedHardware ? 'Demo Telemetry' : 'Hardware Link'}</span>
        </button>

        {/* ── Notification Bell with Dropdown ─────────────────────────────── */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(v => !v)}
            className="relative p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            title={`${unresolvedAlerts.length} active alerts`}
          >
            <Bell className="w-4 h-4" />
            {unresolvedAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unresolvedAlerts.length}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Panel Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#123B55] text-white">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span className="text-sm font-bold">System Notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  {unresolvedAlerts.length > 0 && (
                    <span className="text-[10px] bg-amber-400 text-[#123B55] px-2 py-0.5 rounded-full font-bold">
                      {unresolvedAlerts.length} active
                    </span>
                  )}
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="text-white/70 hover:text-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {/* Active Anomaly Alerts */}
                {unresolvedAlerts.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Active Anomalies
                      </span>
                    </div>
                    {unresolvedAlerts.map(a => (
                      <div
                        key={a.id}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer ${severityBg(a.severity)}`}
                        onClick={() => { setActiveModule('ai-intelligence'); setNotifOpen(false); }}
                      >
                        {severityIcon(a.severity)}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-800 leading-snug truncate">
                            {a.observation}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                            {a.rootCauseHypothesis}
                          </p>
                          <span className={`inline-block mt-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                            a.severity === 'high' ? 'bg-rose-100 text-rose-700' :
                            a.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {a.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recent System Events */}
                {recentEvents.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Recent Events
                      </span>
                    </div>
                    {recentEvents.map(ev => (
                      <div
                        key={ev.id}
                        className="flex items-start gap-3 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition"
                      >
                        {severityIcon(ev.level)}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-slate-700 leading-snug line-clamp-2">
                            {ev.message}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{ev.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {unresolvedAlerts.length === 0 && recentEvents.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-[#65A875] mb-2" />
                    <p className="text-sm font-medium text-slate-600">All Systems Nominal</p>
                    <p className="text-xs text-slate-400 mt-1">No active alerts or recent events</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  {unresolvedAlerts.length === 0 ? 'No unresolved alerts' : `${unresolvedAlerts.length} requiring attention`}
                </span>
                <button
                  onClick={() => { setActiveModule('ai-intelligence'); setNotifOpen(false); }}
                  className="text-[10px] font-semibold text-[#21A6A0] hover:underline"
                >
                  View all in AI Intelligence →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
