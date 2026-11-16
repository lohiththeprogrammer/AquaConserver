import React from 'react';
import { useAquaTech, ModuleKey } from '../../context/AquaTechContext';
import {
  LayoutDashboard,
  Droplet,
  Filter,
  Layers,
  Activity,
  BarChart3,
  Bot,
  Box,
  Leaf,
  FlaskConical,
  GraduationCap,
  Settings,
  Wifi,
  WifiOff,
  Radio,
  CheckCircle2
} from 'lucide-react';

interface NavItem {
  key: ModuleKey;
  number: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
}

const navItems: NavItem[] = [
  { key: 'overview', number: '01', label: 'Overview', icon: LayoutDashboard },
  { key: 'cooldrop', number: '02', label: 'CoolDrop', icon: Droplet, tag: 'AC' },
  { key: 'purification', number: '03', label: 'Purification', icon: Filter, tag: 'WW' },
  { key: 'water-management', number: '04', label: 'Water Management', icon: Layers },
  { key: 'live-monitoring', number: '05', label: 'Live Monitoring', icon: Activity },
  { key: 'analytics', number: '06', label: 'Analytics', icon: BarChart3 },
  { key: 'ai-intelligence', number: '07', label: 'AI Intelligence', icon: Bot, tag: 'AI' },
  { key: 'digital-twin', number: '08', label: 'Digital Twin', icon: Box, tag: '3D' },
  { key: 'environmental-impact', number: '09', label: 'Environmental Impact', icon: Leaf },
  { key: 'interactive-lab', number: '10', label: 'Interactive Lab', icon: FlaskConical, tag: 'SIM' },
  { key: 'learning-centre', number: '11', label: 'Learning Centre', icon: GraduationCap },
  { key: 'reports-settings', number: '12', label: 'Reports & Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { activeModule, setActiveModule, isSimulatedHardware, devices } = useAquaTech();

  const espCoolDrop = devices.find(d => d.type === 'cooldrop');
  const espPurification = devices.find(d => d.type === 'purification');

  return (
    <aside className="w-72 bg-[#0B2333] text-slate-300 flex flex-col h-screen border-r border-[#123B55]/60 select-none shadow-2xl z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#123B55]/60 bg-[#081b29]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#21A6A0] via-[#5CB6DC] to-[#123B55] flex items-center justify-center shadow-lg shadow-[#21A6A0]/20 ring-1 ring-white/20">
            <Droplet className="w-6 h-6 text-white fill-white/80" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-sans">AquaTech</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#21A6A0]/20 text-[#21A6A0] font-semibold border border-[#21A6A0]/30">v1.0</span>
            </div>
            <p className="text-[10px] uppercase font-mono tracking-wider text-[#5CB6DC] font-semibold">Smart Water Recovery</p>
          </div>
        </div>
        <p className="mt-2.5 text-[11px] text-slate-400 font-sans leading-tight">
          Recover. Purify. Reuse. Intelligent conservation through connected engineering.
        </p>
      </div>

      {/* Physical Hardware Status Indicators */}
      <div className="px-4 py-3 bg-[#0d2a3e] border-b border-[#123B55]/50">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-2">
          <span className="flex items-center gap-1.5 uppercase font-medium">
            <Radio className="w-3.5 h-3.5 text-[#5CB6DC] animate-pulse" />
            ESP32 Node Status
          </span>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${isSimulatedHardware ? 'bg-[#21A6A0]/25 text-[#21A6A0]' : 'bg-amber-500/20 text-amber-300'}`}>
            {isSimulatedHardware ? 'TELEMETRY LIVE' : 'HARDWARE STANDBY'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-[#081a26] p-2 rounded-lg border border-[#1a4460]/40 flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium">ESP32-A (CoolDrop)</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-2 h-2 rounded-full ${isSimulatedHardware ? 'bg-[#65A875] status-glow-green animate-ping' : 'bg-amber-400'}`} />
              <span className="font-mono font-medium text-xs text-white">
                {isSimulatedHardware ? 'Connected' : 'Awaiting Link'}
              </span>
            </div>
          </div>
          <div className="bg-[#081a26] p-2 rounded-lg border border-[#1a4460]/40 flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium">ESP32-B (Purification)</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-2 h-2 rounded-full ${isSimulatedHardware ? 'bg-[#65A875] status-glow-green animate-ping' : 'bg-amber-400'}`} />
              <span className="font-mono font-medium text-xs text-white">
                {isSimulatedHardware ? 'Connected' : 'Awaiting Link'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Modules (12 Modules) */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
          System Modules
        </div>
        {navItems.map((item) => {
          const isActive = activeModule === item.key;
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              onClick={() => setActiveModule(item.key)}
              className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 text-left ${
                isActive
                  ? 'bg-gradient-to-r from-[#123B55] to-[#1a4f73] text-white font-semibold shadow-md border-l-4 border-[#21A6A0]'
                  : 'text-slate-300 hover:bg-[#123B55]/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`text-[10px] font-mono ${isActive ? 'text-[#5CB6DC]' : 'text-slate-400 group-hover:text-slate-300'}`}>
                  {item.number}
                </span>
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? 'text-[#21A6A0]' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.tag && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                    isActive
                      ? 'bg-[#21A6A0] text-[#0B2333]'
                      : 'bg-[#123B55] text-slate-300 group-hover:bg-[#1a4f73]'
                  }`}
                >
                  {item.tag}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer info */}
      <div className="p-3 border-t border-[#123B55]/60 bg-[#081b29] text-[11px] text-slate-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#65A875]"></span>
            <span className="font-mono text-slate-300">Broker: MQTT TLS</span>
          </div>
          <span className="font-mono text-[10px] text-[#5CB6DC]">Port: 8883</span>
        </div>
      </div>
    </aside>
  );
};

