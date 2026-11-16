import React, { useState } from 'react';
import { useAquaTech } from '../../context/AquaTechContext';
import {
  Bot,
  AlertTriangle,
  Lightbulb,
  Send,
  Sparkles,
  TrendingUp,
  Wrench,
  CheckCircle2,
  Clock,
  ArrowRight,
  Key,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export const AIIntelligenceView: React.FC = () => {
  const {
    anomalies,
    coolDrop,
    purification,
    chatHistory,
    sendQueryToAI,
    geminiApiKey,
    geminiModel,
    setIsGeminiModalOpen,
    generateGeminiAnomalyAudit,
    isGeminiLoading
  } = useAquaTech();

  const [inputQuery, setInputQuery] = useState('');
  const [geminiAuditResult, setGeminiAuditResult] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isGeminiLoading) return;
    const q = inputQuery.trim();
    setInputQuery('');
    await sendQueryToAI(q);
  };

  const handleRunGeminiAudit = async () => {
    try {
      const res = await generateGeminiAnomalyAudit();
      setGeminiAuditResult(res);
    } catch (err: any) {
      setGeminiAuditResult(`Gemini Audit Error: ${err.message || 'Audit execution failed.'}`);
    }
  };

  const sampleQuestions = [
    'Why did CoolDrop collection drop today?',
    'What is the current turbidity and filter health?',
    'How much water is safe for botanical garden irrigation?',
    'What is the overall energy intensity of our purification?'
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#123B55]">AquaTech Gemini AI Intelligence Hub</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold border border-purple-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-600" />
                {geminiApiKey ? `${geminiModel} Online` : 'Demo Heuristic Engine'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Autonomous Multimodal Telemetry Reasoning, Dynamic Diagnostic Trees & Google Gemini Copilot
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsGeminiModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-semibold transition"
          >
            <Key className="w-3.5 h-3.5" />
            {geminiApiKey ? 'API Key Connected' : 'Connect Gemini API'}
          </button>
        </div>
      </div>

      {/* Gemini Autonomous Deep-Audit Banner */}
      <div className="bg-gradient-to-br from-purple-900 via-[#123B55] to-[#0c1d29] text-white rounded-2xl p-5 shadow-lg border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-purple-200 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-amber-300" />
              Gemini Automated Engineering Audit
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Execute a full statistical and root-cause synthesis across CoolDrop (-28% flow rate drift) and Purification (+3.2 kPa differential pressure) using Google Gemini.
          </p>
        </div>

        <button
          onClick={handleRunGeminiAudit}
          disabled={isGeminiLoading}
          className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition flex-shrink-0"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isGeminiLoading ? 'animate-spin' : ''}`} />
          {isGeminiLoading ? 'Gemini Auditing...' : 'Run Gemini Audit'}
        </button>
      </div>

      {/* Gemini Audit Output Card (if generated) */}
      {geminiAuditResult && (
        <div className="bg-white rounded-2xl p-5 border-2 border-purple-300 shadow-md space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-purple-100">
            <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Gemini Generative Diagnostic Audit Report
            </div>
            <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">
              Autonomous Report
            </span>
          </div>
          <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono">
            {geminiAuditResult}
          </div>
        </div>
      )}

      {/* Row 1: Active Anomalies & Predictive Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Anomaly Detection Card (Matches Spec Example) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Automated Anomaly Detection
            </h3>
            <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
              {anomalies.length} Flagged
            </span>
          </div>

          <div className="space-y-3">
            {anomalies.map((anom) => (
              <div key={anom.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500 font-semibold">{anom.id} · {anom.subsystem}</span>
                  <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                    {anom.severity} SEVERITY
                  </span>
                </div>

                <div className="font-bold text-slate-900">
                  {anom.observation}
                </div>

                <p className="text-slate-600 text-[11px]">
                  <strong>Hypothesis:</strong> {anom.rootCauseHypothesis}
                </p>

                <div className="pt-2 border-t border-slate-200/70">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block mb-1">
                    Suggested Investigation Protocol:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
                    {anom.suggestedAction.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predictive Maintenance & Health Score */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#21A6A0]" />
                Predictive Maintenance & Health Score
              </h3>
              <span className="text-[10px] font-mono text-[#65A875] bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                Score: 94/100
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">UV-C Disinfection Quartz Sleeve</span>
                  <span className="text-[11px] text-slate-500">Predicted replacement in 8,580 operating hours.</span>
                </div>
                <span className="font-mono text-emerald-700 font-bold">Healthy</span>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Lamella Clarifier Sludge Chamber</span>
                  <span className="text-[11px] text-slate-500">Auto-purge scheduled in 6 days based on particulate mass.</span>
                </div>
                <span className="font-mono text-blue-700 font-bold">Nominal</span>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Multi-Media Differential Pressure</span>
                  <span className="text-[11px] text-slate-500">Delta P rising at +0.4 kPa/day. Backwash suggested in 48h.</span>
                </div>
                <span className="font-mono text-amber-700 font-bold">Advisory</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mt-4 text-xs text-slate-600 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>
              <strong>Smart Optimization:</strong> Running AC units in fan-cycling mode between 12:00-14:00 increases humidity condensation by +12%.
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Natural Language Assistant (Interactive Spec Feature powered by Gemini) */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              AquaTech Gemini Copilot Interactive Console
            </h3>
            <p className="text-xs text-slate-500">
              Live generative dialogue injected with real-time CoolDrop & Purification physical telemetry
            </p>
          </div>
          <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold border border-purple-200">
            {geminiApiKey ? `${geminiModel} Live` : 'Heuristic Mode'}
          </span>
        </div>

        {/* Prompt Suggestions */}
        <div className="flex flex-wrap gap-2 text-xs">
          {sampleQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => sendQueryToAI(sq)}
              className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition border border-slate-200 text-[11px]"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Chat History Container */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 h-72 overflow-y-auto space-y-3 text-xs">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#123B55] text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className={`text-[9px] font-mono font-bold uppercase flex items-center gap-1 ${
                    msg.sender === 'user' ? 'text-[#5CB6DC]' : 'text-purple-600'
                  }`}>
                    {msg.sender === 'user' ? 'Plant Operator' : <><Sparkles className="w-3 h-3 text-amber-500" /> AquaTech Gemini AI</>}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">{msg.timestamp}</span>
                </div>
                <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          ))}

          {isGeminiLoading && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 text-xs text-purple-700 font-mono">
              <Sparkles className="w-4 h-4 animate-spin text-purple-600" />
              <span>Querying Google Gemini with live physical sensor data...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask Gemini about water parameters, anomaly diagnoses, or thermodynamic equations..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          />
          <button
            type="submit"
            disabled={isGeminiLoading || !inputQuery.trim()}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            Send to Gemini
          </button>
        </form>
      </div>
    </div>
  );
};
