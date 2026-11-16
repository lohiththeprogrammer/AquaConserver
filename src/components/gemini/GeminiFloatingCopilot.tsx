import React, { useState } from 'react';
import { useAquaTech } from '../../context/AquaTechContext';
import {
  Sparkles,
  Send,
  Bot,
  X,
  Maximize2,
  Minimize2,
  Key,
  ShieldCheck,
  Activity,
  Layers,
  Wrench,
  FlaskConical,
  MessageSquare
} from 'lucide-react';

export const GeminiFloatingCopilot: React.FC = () => {
  const {
    isGeminiDrawerOpen,
    setIsGeminiDrawerOpen,
    setIsGeminiModalOpen,
    geminiApiKey,
    geminiModel,
    chatHistory,
    sendQueryToAI,
    isGeminiLoading,
    coolDrop,
    purification
  } = useAquaTech();

  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isGeminiLoading) return;
    const msg = inputMessage.trim();
    setInputMessage('');
    await sendQueryToAI(msg);
  };

  const quickActions = [
    { label: '📊 System Diagnostic', query: 'Perform an overall engineering health check on CoolDrop collection and Sewage Purification quality parameters.' },
    { label: '⚠️ Audit Anomalies', query: 'Investigate the 28% drop in CoolDrop collection rate and advise maintenance steps.' },
    { label: '💧 Water Reallocation', query: 'Given our current storage levels, how should we allocate water between Category A (landscape) and Category B (toilet flushing)?' },
    { label: '🔬 Explain UV-C Dose', query: 'Explain how 254nm ultraviolet irradiation achieves disinfection in the purification chamber without chemical chlorination.' }
  ];

  return (
    <>
      {/* Floating Launcher Button (Bottom Right) */}
      {!isGeminiDrawerOpen && (
        <button
          onClick={() => setIsGeminiDrawerOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 via-indigo-600 to-[#123B55] text-white p-3.5 rounded-full shadow-2xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-200 flex items-center gap-2 group ring-2 ring-white/30"
          title="Open AquaTech Gemini AI Copilot"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white" />
          </div>
          <span className="text-xs font-bold font-sans pr-1 hidden sm:inline">Gemini AI Copilot</span>
        </button>
      )}

      {/* Slide-out Copilot Panel */}
      {isGeminiDrawerOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md h-[580px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0B2333] via-[#123B55] to-purple-900 text-white p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-amber-300 flex items-center justify-center text-slate-900 font-bold shadow-xs">
                <Sparkles className="w-4 h-4 text-purple-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm">Gemini Telemetry Copilot</h3>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-200 border border-purple-400/30 font-semibold">
                    {geminiApiKey ? geminiModel.replace('gemini-', '') : 'Demo Mode'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Live Telemetry Context Active</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsGeminiModalOpen(true)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
                title="Configure Gemini API Key"
              >
                <Key className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsGeminiDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
                title="Close Copilot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Telemetry Bar */}
          <div className="bg-[#081a26] px-4 py-2 text-[10px] font-mono text-slate-300 border-b border-white/10 flex items-center justify-between">
            <span>CoolDrop: <strong className="text-[#5CB6DC]">{coolDrop.collectionRateLPerHr} L/h</strong></span>
            <span>Tank: <strong className="text-[#21A6A0]">{coolDrop.tankFillPercentage}%</strong></span>
            <span>Effluent: <strong className="text-emerald-400">{purification.turbidityNTU} NTU</strong></span>
            <span>pH: <strong className="text-amber-300">{purification.pHSensor}</strong></span>
          </div>

          {/* Chat Stream Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAFC] text-xs">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl p-3 shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#123B55] text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className={`text-[9px] font-mono font-bold uppercase flex items-center gap-1 ${
                      msg.sender === 'user' ? 'text-[#5CB6DC]' : 'text-purple-600'
                    }`}>
                      {msg.sender === 'user' ? 'You' : <><Sparkles className="w-3 h-3 text-amber-500" /> Gemini Agent</>}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">{msg.timestamp}</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}

            {isGeminiLoading && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 text-xs text-purple-700">
                <Sparkles className="w-4 h-4 animate-spin text-purple-600" />
                <span className="font-mono text-[11px]">Gemini is reasoning over live telemetry packets...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts Strip */}
          <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 flex gap-1.5 overflow-x-auto">
            {quickActions.map((qa, idx) => (
              <button
                key={idx}
                onClick={() => sendQueryToAI(qa.query)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 text-[10px] font-medium flex-shrink-0 transition"
              >
                {qa.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={geminiApiKey ? "Ask Gemini anything about AquaTech..." : "Ask Gemini (Using live telemetry)..."}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={isGeminiLoading || !inputMessage.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white p-2 rounded-lg transition shadow-xs flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
