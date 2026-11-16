import React, { useState } from 'react';
import { useAquaTech } from '../../context/AquaTechContext';
import { MetricCard } from '../../components/common/MetricCard';
import { WaterGauge } from '../../components/common/WaterGauge';
import {
  Layers,
  Droplets,
  Droplet,
  Filter,
  CheckCircle2,
  AlertOctagon,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  Building,
  TreePine,
  Bath,
  SprayCan,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';

export const WaterManagementView: React.FC = () => {
  const {
    coolDrop,
    purification,
    waterAllocations,
    addSystemEvent,
    generateGeminiWaterOptimization,
    isGeminiLoading
  } = useAquaTech();

  const [transferAmount, setTransferAmount] = useState<number>(25);
  const [targetCategory, setTargetCategory] = useState<string>('ALLOC-01');
  const [transferSuccess, setTransferSuccess] = useState<boolean>(false);
  const [geminiAdvice, setGeminiAdvice] = useState<string | null>(null);

  const handleGeminiOptimize = async () => {
    try {
      const res = await generateGeminiWaterOptimization();
      setGeminiAdvice(res);
    } catch (err: any) {
      setGeminiAdvice(`Gemini Optimization Error: ${err.message || 'Failed to generate recommendation.'}`);
    }
  };

  const totalInventory = coolDrop.collectionVolumeL + purification.outgoingTreatedVolumeL;
  const coolDropStorageCapacity = 250;
  const treatedStorageCapacity = 300;

  const allocationPieData = [
    { name: 'Landscape Irrigation (Cat A)', value: 160, color: '#65A875' },
    { name: 'Toilet Flushing (Cat B)', value: 140, color: '#5CB6DC' },
    { name: 'Facility Cleaning (Cat C)', value: 65, color: '#21A6A0' },
    { name: 'Buffer Reserve', value: 45, color: '#123B55' },
  ];

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const target = waterAllocations.find(a => a.id === targetCategory);
    if (!target) return;

    addSystemEvent({
      level: 'success',
      module: 'Water Management',
      message: `Dispatched ${transferAmount} L to ${target.application} (${target.category}).`
    });

    setTransferSuccess(true);
    setTimeout(() => setTransferSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Module Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#123B55]/10 flex items-center justify-center text-[#123B55]">
            <Layers className="w-7 h-7 text-[#123B55]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#123B55]">Smart Water Management & Reuse Inventory</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                Dual-Stream Architecture
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Segregated Stream Storage, Multi-Tier Reuse Allocation & Non-Potable Demand Balancing
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Recovered Stock</span>
          <span className="text-2xl font-extrabold font-mono text-[#123B55]">
            {totalInventory.toFixed(1)} <span className="text-sm font-normal text-slate-500">Liters</span>
          </span>
        </div>
      </div>

      {/* Segregated Streams Architecture Explanation */}
      <div className="bg-gradient-to-r from-[#123B55]/5 via-[#21A6A0]/5 to-transparent border border-slate-200 rounded-xl p-4 text-xs text-slate-700 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#21A6A0] flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-[#123B55]">Segregated Stream Safety Architecture:</span>
          <p className="text-slate-600 leading-relaxed">
            AquaTech maintains strict separation between untreated water streams. Raw AC condensate and untreated wastewater are kept in isolated physical flow loops. Water is only transferred to reuse destination cisterns after dedicated inline sensors confirm standard compliance.
          </p>
        </div>
      </div>

      {/* Row 1: Separate Storage Tank Monitoring */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <WaterGauge
          fillPercentage={coolDrop.tankFillPercentage}
          currentLiters={coolDrop.collectionVolumeL}
          capacityLiters={coolDropStorageCapacity}
          title="Stream 1: CoolDrop Condensate Storage"
          subtitle="Low TDS, Demineralized Atmospheric Condensate"
          themeColor="teal"
          alertThreshold={85}
        />

        <WaterGauge
          fillPercentage={Number(((purification.outgoingTreatedVolumeL / treatedStorageCapacity) * 100).toFixed(1))}
          currentLiters={purification.outgoingTreatedVolumeL}
          capacityLiters={treatedStorageCapacity}
          title="Stream 2: Purified Effluent Holding Cistern"
          subtitle="UV-C Disinfected Secondary Non-Potable Water"
          themeColor="blue"
          alertThreshold={85}
        />
      </div>

      {/* Gemini Water Allocation Advisor (Signature Feature) */}
      <div className="bg-gradient-to-r from-purple-900 via-[#123B55] to-[#0B2333] text-white rounded-2xl p-5 shadow-lg border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-purple-500/30 text-amber-300">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="font-bold text-sm text-purple-200 uppercase font-mono tracking-wider">
              Gemini AI Autonomous Reallocation Advisor
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {geminiAdvice || 'Query Google Gemini to analyze live stock levels in both tanks and recommend an optimal distribution matrix between Category A (irrigation), Category B (toilet flushing), and Category C (cleaning).'}
          </p>
        </div>

        <button
          onClick={handleGeminiOptimize}
          disabled={isGeminiLoading}
          className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition flex-shrink-0"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isGeminiLoading ? 'animate-spin' : ''}`} />
          {isGeminiLoading ? 'Gemini Optimizing...' : 'Run Gemini Optimization'}
        </button>
      </div>

      {/* Row 2: Reuse Categories Matrix as specified */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Reuse Suitability Classification & Allocation</h3>
            <p className="text-xs text-slate-500">Strictly regulated allocation categories based on verified water quality testing</p>
          </div>
          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200">
            ISO 24510 Aligned
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Approved Application</th>
                <th className="py-2.5 px-3">Quality Gate</th>
                <th className="py-2.5 px-3">Allocated</th>
                <th className="py-2.5 px-3">Used Today</th>
                <th className="py-2.5 px-3">Target Destination</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {waterAllocations.map((alloc) => (
                <tr key={alloc.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-mono font-bold">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        alloc.category === 'Category A'
                          ? 'bg-emerald-100 text-emerald-800'
                          : alloc.category === 'Category B'
                          ? 'bg-blue-100 text-blue-800'
                          : alloc.category === 'Category C'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {alloc.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800">
                    {alloc.application}
                  </td>
                  <td className="py-3 px-3">
                    {alloc.approvedQuality ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#65A875]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600">
                        <AlertOctagon className="w-3.5 h-3.5" /> RESTRICTED
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    {alloc.allocatedLiters > 0 ? `${alloc.allocatedLiters.toFixed(1)} L` : '0 L (Restricted)'}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    {alloc.usedTodayLiters.toFixed(1)} L
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                    {alloc.destination}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3: Water Dispatch Console & Demand Allocation Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Dispatch Form */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Send className="w-4 h-4 text-[#21A6A0]" />
              Controlled Water Dispatch Gate
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Authorize automated solenoid valve release to verified campus reuse destinations.
            </p>

            <form onSubmit={handleDispatch} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Destination Category</label>
                <select
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#21A6A0]"
                >
                  <option value="ALLOC-01">Category A: Campus Botanical Gardens (Drip Irrigation)</option>
                  <option value="ALLOC-02">Category B: Engineering Block Toilets (Dual-Plumbed)</option>
                  <option value="ALLOC-03">Category C: Solar Panel & Façade Cleaning</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Transfer Volume</span>
                  <span className="font-mono font-bold text-[#123B55]">{transferAmount} Liters</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  step="5"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(Number(e.target.value))}
                  className="w-full accent-[#21A6A0]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#123B55] hover:bg-[#1a4f73] text-white py-2 px-4 rounded-lg font-semibold transition text-xs flex items-center justify-center gap-2 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                Authorize Transfer ({transferAmount} L)
              </button>
            </form>

            {transferSuccess && (
              <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Transfer command dispatched to solenoid valve controller.</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 text-[11px] text-slate-400">
            All transfers recorded in PostgreSQL audit log table.
          </div>
        </div>

        {/* Allocation Pie Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Demand vs Allocated Water Inventory</h3>
              <p className="text-xs text-slate-500">Distribution breakdown across campus non-potable reuse networks</p>
            </div>
            <span className="text-[10px] font-mono text-[#123B55] bg-slate-100 px-2 py-0.5 rounded font-semibold">
              Today Allocation
            </span>
          </div>

          <div className="h-56 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {allocationPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B2333', borderColor: '#123B55', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">Estimated Demand</span>
              <span className="font-bold font-mono text-slate-800">380 L/day</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">Recovered Supply</span>
              <span className="font-bold font-mono text-[#21A6A0]">{totalInventory.toFixed(1)} L</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">Demand Coverage</span>
              <span className="font-bold font-mono text-[#65A875]">
                {((totalInventory / 380) * 100).toFixed(0)}% Met
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

