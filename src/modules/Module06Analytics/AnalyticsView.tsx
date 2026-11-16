import React from 'react';
import { useAquaTech } from '../../context/AquaTechContext';
import { MetricCard } from '../../components/common/MetricCard';
import { weeklyComparisonData, hourlyTrendData } from '../../data/mockData';
import {
  BarChart3,
  TrendingUp,
  Zap,
  Droplet,
  Filter,
  Layers,
  Clock,
  ShieldCheck,
  Percent,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const { coolDrop, purification } = useAquaTech();

  const totalRecoveredL = coolDrop.collectionVolumeL + purification.outgoingTreatedVolumeL;
  const inputWaterTotalL = (coolDrop.collectionVolumeL / (coolDrop.collectionEfficiencyPct / 100)) + purification.incomingVolumeL;
  const recoveryPct = ((totalRecoveredL / inputWaterTotalL) * 100).toFixed(1);

  // Energy intensity: kWh consumed / Water treated (m^3)
  // Let's say energy consumed today = 1.48 kWh, water treated = (totalRecoveredL / 1000) m^3
  const energyKwhToday = 1.48;
  const waterRecoveredM3 = totalRecoveredL / 1000;
  const energyIntensityKwhPerM3 = (energyKwhToday / Math.max(0.01, waterRecoveredM3)).toFixed(2);

  // Water Reused vs Recovered
  const waterReusedL = 254.7;
  const reuseRatePct = ((waterReusedL / totalRecoveredL) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#123B55]/10 flex items-center justify-center text-[#123B55]">
            <BarChart3 className="w-7 h-7 text-[#123B55]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#123B55]">Analytics & Process Statistics</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                Mathematical Modeling
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Recovery Percentages, Energy Intensities, Mass-Balance Correlations & Lifecycle Yields
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
          <span className="text-slate-500">System Availability:</span>
          <span className="font-bold text-[#65A875]">99.4% Uptime</span>
        </div>
      </div>

      {/* Conceptual Clarity Banner: 4 Distinct Measurements */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">1. Collection</span>
          <span className="text-base font-bold font-mono text-[#5CB6DC] mt-1 block">
            {coolDrop.collectionVolumeL.toFixed(1)} L
          </span>
          <p className="text-[10px] text-slate-500 mt-0.5">Atmospheric AC condensate harvested.</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">2. Treatment</span>
          <span className="text-base font-bold font-mono text-[#123B55] mt-1 block">
            {purification.incomingVolumeL.toFixed(1)} L
          </span>
          <p className="text-[10px] text-slate-500 mt-0.5">Raw greywater processed through 6 chambers.</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">3. Recovery</span>
          <span className="text-base font-bold font-mono text-[#21A6A0] mt-1 block">
            {totalRecoveredL.toFixed(1)} L
          </span>
          <p className="text-[10px] text-slate-500 mt-0.5">Usable volume cleared for storage.</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">4. Reuse</span>
          <span className="text-base font-bold font-mono text-[#65A875] mt-1 block">
            {waterReusedL.toFixed(1)} L
          </span>
          <p className="text-[10px] text-slate-500 mt-0.5">Actual volume distributed to campus systems.</p>
        </div>
      </div>

      {/* Formulas & Calculations Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Formula Card 1 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <span className="text-[11px] font-mono uppercase font-bold text-[#21A6A0]">A. Water Recovery Formula</span>
          <h4 className="font-bold text-slate-900 text-sm">Combined Recovered Yield & Efficiency</h4>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-[#123B55] space-y-1.5">
            <p>
              V_total = V_CoolDrop + V_treated = {coolDrop.collectionVolumeL.toFixed(1)} + {purification.outgoingTreatedVolumeL.toFixed(1)} = <strong className="text-[#21A6A0]">{totalRecoveredL.toFixed(1)} L</strong>
            </p>
            <p>
              Recovery % = (V_recovered / V_input) × 100 = <strong className="text-[#21A6A0]">{recoveryPct}%</strong>
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Calculates mass-balance conservation accounting for evaporation and sludge purge losses.
          </p>
        </div>

        {/* Formula Card 2 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <span className="text-[11px] font-mono uppercase font-bold text-[#123B55]">B. Specific Energy Intensity</span>
          <h4 className="font-bold text-slate-900 text-sm">Energetic Footprint per Cubic Metre</h4>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-[#123B55] space-y-1.5">
            <p>
              Energy Intensity = Energy consumed (kWh) / Water treated (m³) = <strong className="text-[#123B55]">{energyIntensityKwhPerM3} kWh/m³</strong>
            </p>
            <p>
              Water Reuse Rate = (Water Reused / Water Recovered) × 100 = <strong className="text-[#65A875]">{reuseRatePct}%</strong>
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Industry benchmark: Conventional desalination consumes 3.5 kWh/m³, demonstrating AquaTech efficiency.
          </p>
        </div>
      </div>

      {/* Composed Chart: Recovery vs Energy Consumption */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">System Performance: Water Output vs Energy Inflow</h3>
            <p className="text-xs text-slate-500">Hourly correlation between recovered litres and kilowatt-hour energy demand</p>
          </div>
          <span className="text-[10px] font-mono text-[#21A6A0] bg-[#21A6A0]/10 px-2 py-0.5 rounded font-bold">
            Dual-Axis Composed
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={hourlyTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" stroke="#123B55" fontSize={11} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#65A875" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0B2333', borderColor: '#123B55', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar yAxisId="left" dataKey="totalL" name="Total Water Recovered (L)" fill="#21A6A0" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="energyKwh" name="Energy Input (kWh)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
