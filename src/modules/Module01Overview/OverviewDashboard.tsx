import React, { useState } from 'react';
import { useAquaTech } from '../../context/AquaTechContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StageFlowDiagram } from '../../components/common/StageFlowDiagram';
import { treatmentStages, weeklyComparisonData } from '../../data/mockData';
import {
  Droplets,
  Droplet,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Activity,
  Layers,
  Wrench,
  Sparkles,
  Bot
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export const OverviewDashboard: React.FC = () => {
  const {
    isSimulatedHardware,
    coolDrop,
    purification,
    devices,
    events,
    hourlyTrends,
    activeTreatmentStage,
    setActiveTreatmentStage,
    setActiveModule,
    generateGeminiExecutiveBrief,
    isGeminiLoading,
    geminiApiKey,
    setIsGeminiModalOpen,
    setIsGeminiDrawerOpen
  } = useAquaTech();

  const [geminiBrief, setGeminiBrief] = useState<string | null>(null);

  const totalWaterRecovered = coolDrop.collectionVolumeL + purification.outgoingTreatedVolumeL;
  const waterAvailableForReuse = (coolDrop.collectionVolumeL * 0.95) + (purification.outgoingTreatedVolumeL * 0.92);

  const handleGenerateBrief = async () => {
    try {
      const brief = await generateGeminiExecutiveBrief();
      setGeminiBrief(brief);
    } catch (err: any) {
      setGeminiBrief(`Gemini Notice: ${err.message || 'Failed to generate briefing.'}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice when Awaiting Connection */}
      {!isSimulatedHardware && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between text-amber-900 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Hardware Standby Mode:</strong> ESP32 controllers are currently in discovery/awaiting connection state. Real sensor values will populate once telemetry packets are acknowledged over MQTT.
            </span>
          </div>
          <span className="font-mono text-[11px] font-semibold bg-amber-200/60 px-2 py-0.5 rounded">
            PORT: 8883 MQTT
          </span>
        </div>
      )}

      {/* Row 1: Four Main Measurement Cards as specified */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Water Recovered"
          value={isSimulatedHardware ? totalWaterRecovered.toFixed(1) : '--'}
          unit="L"
          subValue="Combined Recovery Ecosystem"
          change="+18.4% today"
          accentColor="teal"
          icon={<Droplets className="w-5 h-5 text-[#21A6A0]" />}
          statusBadge="Active Yield"
        />

        <MetricCard
          label="CoolDrop Collection"
          value={isSimulatedHardware ? coolDrop.collectionVolumeL.toFixed(1) : '--'}
          unit="L"
          subValue={`${coolDrop.collectionRateLPerHr} L/hr condensate rate`}
          change="+6.4 L/h"
          accentColor="blue"
          icon={<Droplet className="w-5 h-5 text-[#5CB6DC]" />}
          statusBadge="AC Stream"
        />

        <MetricCard
          label="Wastewater Treated"
          value={isSimulatedHardware ? purification.outgoingTreatedVolumeL.toFixed(1) : '--'}
          unit="L"
          subValue={`88% process recovery rate`}
          change={`${purification.flowRateLPerMin} L/min`}
          accentColor="navy"
          icon={<Filter className="w-5 h-5 text-[#123B55]" />}
          statusBadge="Effluent Stream"
        />

        <MetricCard
          label="Water Available for Reuse"
          value={isSimulatedHardware ? waterAvailableForReuse.toFixed(1) : '--'}
          unit="L"
          subValue="Verified for non-potable use"
          change="Safe for Cat A/B/C"
          accentColor="green"
          icon={<ShieldCheck className="w-5 h-5 text-[#65A875]" />}
          statusBadge="Quality Verified"
        />
      </div>

      {/* Gemini AI Powered Autonomous Briefing Section (Signature Feature) */}
      <div className="bg-gradient-to-r from-purple-900 via-[#123B55] to-[#0B2333] text-white rounded-2xl p-5 shadow-lg border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gradient-to-tr from-purple-500 to-amber-300 text-slate-950 font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-purple-950" />
            </span>
            <span className="font-bold text-sm text-purple-200 uppercase tracking-wider font-mono">
              Google Gemini Autonomous Plant Briefing
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
              Live State Injected
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            {geminiBrief || 'Gemini monitors CoolDrop psychrometric condensation and 6-stage wastewater quality in real time. Click below to synthesize an executive engineering briefing for plant managers or exhibition visitors.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleGenerateBrief}
            disabled={isGeminiLoading}
            className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeminiLoading ? 'animate-spin' : ''}`} />
            {isGeminiLoading ? 'Gemini Synthesizing...' : 'Synthesize Gemini Brief'}
          </button>
          <button
            onClick={() => setIsGeminiDrawerOpen(true)}
            className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-semibold transition border border-white/20"
          >
            Ask Gemini
          </button>
        </div>
      </div>

      {/* Row 2: System Health and Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Subsystems Health Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#21A6A0]" />
                Connected Subsystem Health
              </h3>
              <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                Telemetry Link
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {/* CoolDrop Subsystem */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#5CB6DC]/15 flex items-center justify-center text-[#123B55]">
                    <Droplet className="w-4 h-4 text-[#5CB6DC]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">CoolDrop Model</h4>
                    <p className="text-[11px] text-slate-500 font-mono">AC Condensate Node</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isSimulatedHardware
                        ? 'bg-[#65A875]/15 text-[#65A875]'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isSimulatedHardware ? 'bg-[#65A875]' : 'bg-amber-500'}`} />
                    {isSimulatedHardware ? 'Nominal' : 'Awaiting connection'}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                    {coolDrop.tankFillPercentage}% Tank Fill
                  </span>
                </div>
              </div>

              {/* Sewage Purification Subsystem */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#123B55]/10 flex items-center justify-center text-[#123B55]">
                    <Filter className="w-4 h-4 text-[#123B55]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Purification Model</h4>
                    <p className="text-[11px] text-slate-500 font-mono">Multi-Stage Treatment</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isSimulatedHardware
                        ? 'bg-[#65A875]/15 text-[#65A875]'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isSimulatedHardware ? 'bg-[#65A875]' : 'bg-amber-500'}`} />
                    {isSimulatedHardware ? 'Nominal' : 'Awaiting connection'}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                    Turbidity {purification.turbidityNTU} NTU
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono text-[11px]">MQTT Heartbeat: 14ms</span>
            <span className="font-mono text-[11px] text-[#21A6A0]">Dual Nodes Synced</span>
          </div>
        </div>

        {/* Quick Technology Portals */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => setActiveModule('cooldrop')}
            className="group cursor-pointer bg-gradient-to-br from-[#123B55] to-[#0d283b] text-white rounded-xl p-5 shadow-sm hover:shadow-md transition relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
              <Droplet className="w-24 h-24" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-wider uppercase text-[#5CB6DC] font-semibold">Technology 01</span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white font-mono">CoolDrop</span>
              </div>
              <h3 className="text-base font-bold mt-2">AC Condensate Collection</h3>
              <p className="text-xs text-slate-300 mt-1">
                Harvesting high-purity atmospheric condensate water from HVAC evaporator coils.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-[#5CB6DC]">
              <span className="font-mono">{coolDrop.collectionRateLPerHr} L/h Live Rate</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition font-semibold">
                Open Module <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          <div
            onClick={() => setActiveModule('purification')}
            className="group cursor-pointer bg-gradient-to-br from-[#21A6A0] to-[#166e6a] text-white rounded-xl p-5 shadow-sm hover:shadow-md transition relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
              <Filter className="w-24 h-24" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-wider uppercase text-white/80 font-semibold">Technology 02</span>
                <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded text-white font-mono">Purification</span>
              </div>
              <h3 className="text-base font-bold mt-2">Wastewater Treatment</h3>
              <p className="text-xs text-teal-50 mt-1">
                6-stage physical, media filtration, carbon adsorption, and germicidal UV-C treatment.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-white">
              <span className="font-mono">88% Recovery Yield</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition font-semibold">
                Open Module <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Treatment Stages Overview Component */}
      <StageFlowDiagram
        stages={treatmentStages}
        activeStageId={activeTreatmentStage}
        onSelectStage={(id) => {
          setActiveTreatmentStage(id);
          setActiveModule('purification');
        }}
      />

      {/* Row 4: Charts Section - Water Recovery Graph & Daily Collection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Hourly Trend Chart */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Water Recovery Telemetry (Hourly)</h3>
              <p className="text-xs text-slate-500">CoolDrop vs Treated Wastewater volumes over operating day</p>
            </div>
            <span className="text-[10px] font-mono text-[#21A6A0] bg-[#21A6A0]/10 px-2 py-1 rounded font-semibold">
              Real-time Trend
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="coolDropGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5CB6DC" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#5CB6DC" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="treatedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#21A6A0" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#21A6A0" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B2333', borderColor: '#123B55', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="coolDropL" name="CoolDrop (L)" stroke="#5CB6DC" fillOpacity={1} fill="url(#coolDropGrad)" />
                <Area type="monotone" dataKey="treatedL" name="Treated Water (L)" stroke="#21A6A0" fillOpacity={1} fill="url(#treatedGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Collection Comparison */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">7-Day Aggregated Recovery vs Target</h3>
              <p className="text-xs text-slate-500">Weekly operational performance across both engineering models</p>
            </div>
            <span className="text-[10px] font-mono text-[#123B55] bg-slate-100 px-2 py-1 rounded font-semibold">
              Liters / Day
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B2333', borderColor: '#123B55', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="coolDrop" name="CoolDrop (L)" fill="#5CB6DC" radius={[4, 4, 0, 0]} />
                <Bar dataKey="treated" name="Treated (L)" fill="#21A6A0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 5: Recent System Events & Maintenance Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Events Feed */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#123B55]" />
              Recent System Events
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Live Log</span>
          </div>
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {events.slice(0, 5).map((evt) => (
              <div key={evt.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs flex items-start gap-3">
                <span className="font-mono text-[10px] text-slate-400 mt-0.5">{evt.timestamp}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{evt.module}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                      evt.level === 'success' ? 'bg-[#65A875]/20 text-[#65A875]' :
                      evt.level === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {evt.level}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5 text-[11px]">{evt.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Notifications */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#65A875]" />
              Latest Maintenance Notifications
            </h3>
            <button
              onClick={() => setActiveModule('reports-settings')}
              className="text-[11px] text-[#21A6A0] hover:underline font-semibold"
            >
              View Full History
            </button>
          </div>
          <div className="space-y-2.5">
            <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">UV-C Disinfection Lamp Inspection</span>
                <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                  Completed
                </span>
              </div>
              <p className="text-slate-600 text-[11px] mt-1">
                Quartz sleeve cleaned; UV intensity measured at 98.4%. Operating hours: 1,420 hrs.
              </p>
              <div className="mt-2 text-[10px] text-slate-400 font-mono">Date: 2026-11-14 · Tech: L. Chen</div>
            </div>

            <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">CoolDrop Level Sensor Recalibration</span>
                <span className="text-[10px] font-mono text-blue-700 font-semibold bg-blue-100 px-2 py-0.5 rounded">
                  Verified
                </span>
              </div>
              <p className="text-slate-600 text-[11px] mt-1">
                Zero-point corrected at empty tank condition; drift compensated by -0.4%.
              </p>
              <div className="mt-2 text-[10px] text-slate-400 font-mono">Date: 2026-11-12 · Tech: K. Patel</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
