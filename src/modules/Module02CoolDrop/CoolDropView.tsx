import React, { useState } from 'react';
import { useAquaTech } from '../../context/AquaTechContext';
import { MetricCard } from '../../components/common/MetricCard';
import { WaterGauge } from '../../components/common/WaterGauge';
import {
  Droplet,
  AlertTriangle,
  CheckCircle2,
  Thermometer,
  Wind,
  ShieldCheck,
  Clock,
  Gauge,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const CoolDropView: React.FC = () => {
  const { coolDrop, acUnits, hourlyTrends } = useAquaTech();
  const [activeTab, setActiveTab] = useState<'realtime' | 'acUnits' | 'engineering'>('realtime');

  // Engineering calculations
  const waterPerOpHour = (coolDrop.collectionVolumeL / Math.max(1, coolDrop.operatingHours)).toFixed(2);
  const avgDailyCollection = (coolDrop.collectionVolumeL * 0.72).toFixed(1);
  const estFutureWeeklyCollection = (coolDrop.collectionRateLPerHr * 16 * 7).toFixed(1); // 16 operational hrs/day

  return (
    <div className="space-y-6">
      {/* Module Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#5CB6DC]/15 flex items-center justify-center text-[#123B55]">
            <Droplet className="w-7 h-7 text-[#5CB6DC]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#123B55]">CoolDrop Subsystem</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#65A875]" />
                Operational
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Air-Conditioning Condensate Water Collection, Hydrostatic Tank Monitoring & Inflow Telemetry
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
          <button
            onClick={() => setActiveTab('realtime')}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === 'realtime' ? 'bg-white text-[#123B55] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Live Overview
          </button>
          <button
            onClick={() => setActiveTab('acUnits')}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === 'acUnits' ? 'bg-white text-[#123B55] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            AC Units ({acUnits.length})
          </button>
          <button
            onClick={() => setActiveTab('engineering')}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === 'engineering' ? 'bg-white text-[#123B55] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Engineering Models
          </button>
        </div>
      </div>

      {/* Row 1: Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Live Collection Volume"
          value={coolDrop.collectionVolumeL.toFixed(1)}
          unit="L"
          subValue={`Tank capacity: ${coolDrop.tankCapacityL} L`}
          change="+12.4% today"
          accentColor="blue"
          icon={<Droplet className="w-5 h-5 text-[#5CB6DC]" />}
        />

        <MetricCard
          label="Collection Flow Rate"
          value={coolDrop.collectionRateLPerHr.toFixed(1)}
          unit="L/h"
          subValue="Micro-turbine pulse counter"
          change="Optimal dew point flow"
          accentColor="teal"
          icon={<Gauge className="w-5 h-5 text-[#21A6A0]" />}
        />

        <MetricCard
          label="Collection Efficiency"
          value={`${coolDrop.collectionEfficiencyPct}%`}
          subValue="vs. Theoretical psychrometric yield"
          change="Target: >90%"
          accentColor="green"
          icon={<ShieldCheck className="w-5 h-5 text-[#65A875]" />}
        />

        <MetricCard
          label="Ambient Conditions"
          value={`${coolDrop.ambientTemperatureC}°C`}
          unit={`/ ${coolDrop.ambientHumidityPct}% RH`}
          subValue="Psychrometric dew point: 24.2°C"
          accentColor="navy"
          icon={<Wind className="w-5 h-5 text-[#123B55]" />}
        />
      </div>

      {/* Main Content Area based on Active Tab */}
      {activeTab === 'realtime' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Tank Visualizer */}
          <div className="lg:col-span-1">
            <WaterGauge
              fillPercentage={coolDrop.tankFillPercentage}
              currentLiters={coolDrop.collectionVolumeL}
              capacityLiters={coolDrop.tankCapacityL}
              title="Condensate Buffer Tank (Tank-01)"
              subtitle="Hydrostatic Level Sensor SNS-LVL-01"
              themeColor="blue"
              alertThreshold={85}
            />

            {/* Safety & Sensor Status Cards */}
            <div className="mt-4 bg-white rounded-xl p-4 border border-slate-200/90 shadow-sm space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 font-mono">
                Subsystem Safeguards
              </h4>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className={`w-2 h-2 rounded-full ${coolDrop.leakDetected ? 'bg-red-500' : 'bg-[#65A875]'}`} />
                  Leak Detection Sensor
                </span>
                <span className={`font-mono font-bold ${coolDrop.leakDetected ? 'text-red-600' : 'text-[#65A875]'}`}>
                  {coolDrop.leakDetected ? 'LEAK DETECTED' : 'CLEAR'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className={`w-2 h-2 rounded-full ${coolDrop.overflowAlert ? 'bg-red-500' : 'bg-[#65A875]'}`} />
                  Overflow Switch
                </span>
                <span className={`font-mono font-bold ${coolDrop.overflowAlert ? 'text-red-600' : 'text-[#65A875]'}`}>
                  {coolDrop.overflowAlert ? 'ALERT' : 'NOMINAL'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700">
                  <Thermometer className="w-3.5 h-3.5 text-slate-400" />
                  Water Temperature
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {coolDrop.waterTemperatureC} °C
                </span>
              </div>
            </div>
          </div>

          {/* Collection Telemetry Graphs */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Hourly AC Condensate Recovery Rate</h3>
                  <p className="text-xs text-slate-500">Telemetry readings from Hall-effect pulse flow sensors</p>
                </div>
                <span className="text-[10px] font-mono text-[#5CB6DC] bg-[#5CB6DC]/10 px-2 py-0.5 rounded font-bold">
                  Liters / Hour
                </span>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="coolFlowGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5CB6DC" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#5CB6DC" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0B2333', borderColor: '#123B55', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                    />
                    <Area type="monotone" dataKey="coolDropL" name="Condensate (L)" stroke="#5CB6DC" strokeWidth={2} fillOpacity={1} fill="url(#coolFlowGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Micro Quick Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Lifetime</span>
                <span className="text-lg font-bold font-mono text-[#123B55] mt-1 block">
                  {coolDrop.totalCollectedLifetimeL.toFixed(1)} L
                </span>
                <span className="text-[10px] text-slate-500">Across {coolDrop.operatingHours} hrs</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Active Evaporators</span>
                <span className="text-lg font-bold font-mono text-[#21A6A0] mt-1 block">
                  {coolDrop.activeUnitsCount} / 4 Units
                </span>
                <span className="text-[10px] text-[#65A875] font-semibold">100% Online</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Forecast Weekly</span>
                <span className="text-lg font-bold font-mono text-[#5CB6DC] mt-1 block">
                  ~{estFutureWeeklyCollection} L
                </span>
                <span className="text-[10px] text-slate-500">Based on weather forecast</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AC Units Tab */}
      {activeTab === 'acUnits' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acUnits.map((unit) => (
              <div key={unit.id} className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#123B55] bg-slate-100 px-2 py-0.5 rounded">
                      {unit.id}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#65A875]" />
                      {unit.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mt-2">{unit.name}</h3>
                  <p className="text-xs text-slate-500">{unit.location}</p>
                </div>

                <div className="my-4 grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg text-center font-mono text-xs">
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 block">Flow Rate</span>
                    <span className="font-bold text-[#21A6A0]">{unit.collectionRateLPerHr} L/h</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 block">Today Yield</span>
                    <span className="font-bold text-[#123B55]">{unit.collectedTodayL} L</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 block">Ambient</span>
                    <span className="font-bold text-slate-700">{unit.ambientTempC}°C / {unit.humidityPct}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#5CB6DC] rounded-full"
                    style={{ width: `${Math.min(100, (unit.collectedTodayL / 50) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engineering Calculations Tab */}
      {activeTab === 'engineering' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#21A6A0]" />
              Thermodynamic Condensation Calculations
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Condensate yield is a physical function of air mass flow rate m_air through the coil and psychrometric specific humidity ratio difference:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-[#123B55]">
              {"m_condensate = m_air · (ω_in - ω_out)"}
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Water Collected per Operating Hour:</span>
                <span className="font-mono font-bold text-slate-900">{waterPerOpHour} L/hr</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Average Daily Collection:</span>
                <span className="font-mono font-bold text-slate-900">{avgDailyCollection} L/day</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Estimated Condensate Production:</span>
                <span className="font-mono font-bold text-slate-900">7.0 L/hr theoretical</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Observed Collection Efficiency:</span>
                <span className="font-mono font-bold text-[#65A875]">{coolDrop.collectionEfficiencyPct}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#5CB6DC]" />
              Predictive Yield Projection
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Based on historical temperature and relative humidity correlation, the predicted collection for the next 7 days across 4 campus HVAC zones:
            </p>
            <div className="p-4 bg-gradient-to-br from-[#123B55] to-[#1e5072] text-white rounded-xl text-center">
              <span className="text-[11px] uppercase tracking-wider text-[#5CB6DC] font-mono">Projected Weekly Recovery</span>
              <div className="text-3xl font-extrabold font-mono mt-1 text-white">~{estFutureWeeklyCollection} L</div>
              <span className="text-xs text-slate-300 mt-1 block">Sufficient for 100% of Botanical Garden drip irrigation</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
