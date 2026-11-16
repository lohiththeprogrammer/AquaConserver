import React, { useState } from 'react';
import { useAquaTech } from '../../context/AquaTechContext';
import { labPresets } from '../../data/mockData';
import { ExperimentScenario } from '../../types';
import {
  FlaskConical,
  Play,
  RotateCcw,
  Download,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sparkles,
  BarChart2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export const InteractiveLabView: React.FC = () => {
  const {
    labScenario,
    updateLabScenario,
    runLabExperiment,
    labResults,
    addSystemEvent,
    generateGeminiLabCritique,
    isGeminiLoading
  } = useAquaTech();

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [geminiCritique, setGeminiCritique] = useState<string | null>(null);

  const handleGeminiCritique = async () => {
    try {
      const res = await generateGeminiLabCritique();
      setGeminiCritique(res);
    } catch (err: any) {
      setGeminiCritique(`Gemini Critique Error: ${err.message || 'Evaluation failed.'}`);
    }
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      runLabExperiment();
      setIsRunning(false);
    }, 800);
  };

  const handlePresetSelect = (preset: ExperimentScenario) => {
    updateLabScenario(preset);
  };

  const handleDownloadReport = () => {
    const reportText = `AquaTech Interactive Laboratory Experiment Report
==================================================
Date: ${new Date().toISOString()}
Scenario Name: ${labScenario.name}
Description: ${labScenario.description}
Simulated Parameters:
- AC Condensation Inflow: ${labScenario.acCondensationRate} L/h
- Ambient Humidity: ${labScenario.acAmbientHumidity}% RH
- Wastewater Inflow: ${labScenario.wastewaterInflow} L/min
- Filter Bed Type: ${labScenario.filterType}
- Flow Multiplier: ${labScenario.flowRateMultiplier}x
- Disinfection Method: ${labScenario.disinfectionIntensity}

Simulation Results:
${labResults.map(r => `${r.time} -> Recovery: ${r.recoveryPct}%, Energy: ${r.energyKwh} kWh, Purity: ${r.purityScore}/100`).join('\n')}

NOTICE: Clearly simulated outcome for educational demonstration, not physical laboratory measurement.
`;
    const element = document.createElement('a');
    const file = new Blob([reportText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `AquaTech_Lab_Experiment_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    addSystemEvent({
      level: 'info',
      module: 'Interactive Lab',
      message: `Downloaded experiment report: "${labScenario.name}".`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
            <FlaskConical className="w-7 h-7 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#123B55]">Interactive Simulation Laboratory</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Virtual Sandbox
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Visitor Experimentation Sandbox: Tweak Operational Boundary Conditions Without Affecting Physical Models
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#21A6A0]" />
            Export Experiment Report
          </button>
        </div>
      </div>

      {/* Mandatory Simulation Label Notice */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3 flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>
            <strong>Simulated Outcome Notice:</strong> All results generated in this module are computational model projections intended for exhibition learning and comparative engineering analysis, not physical physical sensor measurements.
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold bg-blue-200/60 px-2 py-0.5 rounded">
          ISOLATED LAB
        </span>
      </div>

      {/* Preset Scenarios Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-mono uppercase font-bold text-slate-500 flex-shrink-0 mr-1">
          Preset Scenarios:
        </span>
        {labPresets.map((preset) => {
          const isSelected = labScenario.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex-shrink-0 border ${
                isSelected
                  ? 'bg-[#123B55] text-white border-[#123B55] font-bold shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {preset.name}
            </button>
          );
        })}
      </div>

      {/* Experiment Controls & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Controls Column */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#21A6A0]" />
              Simulation Boundary Controls
            </h3>
            <button
              onClick={() => updateLabScenario(labPresets[0])}
              className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 font-mono"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Control 1: AC Condensate Inflow */}
            <div>
              <div className="flex justify-between text-slate-700 font-medium mb-1">
                <span>AC Condensation Inflow</span>
                <span className="font-mono font-bold text-[#123B55]">{labScenario.acCondensationRate} L/h</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="15.0"
                step="0.5"
                value={labScenario.acCondensationRate}
                onChange={(e) => updateLabScenario({ acCondensationRate: parseFloat(e.target.value) })}
                className="w-full accent-[#21A6A0]"
              />
              <span className="text-[10px] text-slate-400">Modulates psychrometric coil yield</span>
            </div>

            {/* Control 2: Wastewater Inflow */}
            <div>
              <div className="flex justify-between text-slate-700 font-medium mb-1">
                <span>Wastewater Inflow Rate</span>
                <span className="font-mono font-bold text-[#123B55]">{labScenario.wastewaterInflow} L/min</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6.0"
                step="0.2"
                value={labScenario.wastewaterInflow}
                onChange={(e) => updateLabScenario({ wastewaterInflow: parseFloat(e.target.value) })}
                className="w-full accent-[#21A6A0]"
              />
              <span className="text-[10px] text-slate-400">Lamella clarifier hydraulic load</span>
            </div>

            {/* Control 3: Filter Bed Media */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">Filtration Media Architecture</label>
              <select
                value={labScenario.filterType}
                onChange={(e) => updateLabScenario({ filterType: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-800"
              >
                <option value="Sand+Gravel">Single-Stage Sand & Gravel Bed</option>
                <option value="Multi-Media Dual">Multi-Media Dual Bed (Anthracite + Silica)</option>
                <option value="Ultra-Adsorption Matrix">Ultra-Adsorption Matrix (GAC + Zeolite)</option>
              </select>
            </div>

            {/* Control 4: Disinfection Method */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">Disinfection Intensity</label>
              <select
                value={labScenario.disinfectionIntensity}
                onChange={(e) => updateLabScenario({ disinfectionIntensity: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-800"
              >
                <option value="Low UV">Low-Pressure UV (25 mJ/cm²)</option>
                <option value="Standard UV-C">Standard Germicidal UV-C (40 mJ/cm²)</option>
                <option value="Multi-Barrier Advanced">Multi-Barrier Advanced (UV-C + Micro-Ozone)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="w-full bg-[#21A6A0] hover:bg-[#1b8c87] text-white py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs"
            >
              <Play className={`w-4 h-4 fill-white ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Calculating Simulation Run...' : 'Execute Scenario Simulation'}
            </button>

            <button
              onClick={handleGeminiCritique}
              disabled={isGeminiLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeminiLoading ? 'animate-spin' : ''}`} />
              {isGeminiLoading ? 'Gemini Evaluating Run...' : 'Ask Gemini AI Lab Critique'}
            </button>
          </div>
        </div>

        {/* Live Simulation Graph & Results Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Dynamic Simulation Chart */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Simulated Recovery Yield & Purity Index</h3>
                <p className="text-xs text-slate-500">Transient response curve across time steps</p>
              </div>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200">
                Live Simulation
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={labResults} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B2333', borderColor: '#123B55', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="recoveryPct" name="Recovery Yield (%)" stroke="#21A6A0" strokeWidth={2.5} />
                  <Line type="monotone" dataKey="purityScore" name="Purity Score (/100)" stroke="#65A875" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gemini AI Lab Critique Card */}
          {geminiCritique && (
            <div className="bg-white rounded-xl p-4 border-2 border-purple-300 shadow-md space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-purple-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Gemini Co-Investigator Evaluation
                </span>
                <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-bold">
                  Thermodynamic Critique
                </span>
              </div>
              <div className="text-xs text-slate-700 whitespace-pre-line font-mono bg-slate-50 p-3 rounded-lg border border-slate-200">
                {geminiCritique}
              </div>
            </div>
          )}

          {/* Results Table */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">
              Simulated Output Matrix
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-mono text-[10px] uppercase text-slate-500">
                    <th className="py-2 px-3">Time Interval</th>
                    <th className="py-2 px-3">Recovery Percentage</th>
                    <th className="py-2 px-3">Energy Intensity</th>
                    <th className="py-2 px-3">Purity Score</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {labResults.map((res, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-bold text-slate-700">{res.time}</td>
                      <td className="py-2 px-3 text-[#21A6A0] font-bold">{res.recoveryPct}%</td>
                      <td className="py-2 px-3 text-slate-800">{res.energyKwh} kWh/m³</td>
                      <td className="py-2 px-3 text-[#65A875] font-bold">{res.purityScore} / 100</td>
                      <td className="py-2 px-3">
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Simulated
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

