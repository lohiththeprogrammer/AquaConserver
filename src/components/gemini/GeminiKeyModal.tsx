import React, { useState } from 'react';
import { useAquaTech } from '../../context/AquaTechContext';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import { DEFAULT_API_KEY, GEMINI_MODEL, GEMINI_ENDPOINT } from '../../services/geminiService';

export const GeminiKeyModal: React.FC = () => {
  const {
    isGeminiModalOpen,
    setIsGeminiModalOpen,
    geminiApiKey,
    setGeminiApiKey
  } = useAquaTech();

  // Start the input pre-filled with the current key (default or user override)
  const [inputKey, setInputKey] = useState(geminiApiKey || DEFAULT_API_KEY);
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testErrorMessage, setTestErrorMessage] = useState('');

  if (!isGeminiModalOpen) return null;

  const isUsingDefault = !inputKey.trim() || inputKey.trim() === DEFAULT_API_KEY;

  const handleSave = () => {
    // If the user typed the default key or nothing, clear localStorage → use default
    setGeminiApiKey(isUsingDefault ? DEFAULT_API_KEY : inputKey.trim());
    setIsGeminiModalOpen(false);
  };

  const handleResetToDefault = () => {
    setInputKey(DEFAULT_API_KEY);
    setTestStatus('idle');
    setTestErrorMessage('');
  };

  const handleTestKey = async () => {
    const keyToTest = isUsingDefault ? DEFAULT_API_KEY : inputKey.trim();
    if (!keyToTest) return;
    setTestStatus('testing');
    setTestErrorMessage('');

    try {
      const res = await fetch(GEMINI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': keyToTest
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Reply with only the word: CONNECTED' }] }]
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.error?.message || `HTTP ${res.status}`);
      }

      setTestStatus('success');
    } catch (err: any) {
      setTestStatus('error');
      setTestErrorMessage(err.message || 'Connection failed — check your API key.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Gemini AI Engine</h3>
              <p className="text-xs text-slate-500">Live telemetry-aware AI reasoning for AquaTech</p>
            </div>
          </div>
          <button
            onClick={() => setIsGeminiModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 transition p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* System Key Banner */}
        <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3">
          <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900">
            <p className="font-bold mb-0.5">System Key Active</p>
            <p className="text-emerald-700 leading-relaxed">
              AquaTech uses a built-in system Gemini key by default. You can override it with
              your own key below, or leave the field unchanged to continue using the system key.
              The system key cannot be removed — only overridden.
            </p>
          </div>
        </div>

        {/* Key Info */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 font-mono">
          <div className="flex justify-between text-slate-600">
            <span className="font-semibold text-slate-700">Model</span>
            <span className="text-[#21A6A0] font-bold">{GEMINI_MODEL}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span className="font-semibold text-slate-700">Auth</span>
            <span>X-goog-api-key header</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span className="font-semibold text-slate-700">Source</span>
            <span className={isUsingDefault ? 'text-[#65A875] font-bold' : 'text-purple-700 font-bold'}>
              {isUsingDefault ? 'System Default Key' : 'User Override Key'}
            </span>
          </div>
        </div>

        {/* Key Input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700">API Key</label>
            {!isUsingDefault && (
              <button
                onClick={handleResetToDefault}
                className="text-[10px] text-slate-400 hover:text-[#21A6A0] font-semibold transition"
              >
                Reset to system default
              </button>
            )}
          </div>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={inputKey}
              onChange={e => { setInputKey(e.target.value); setTestStatus('idle'); }}
              placeholder={DEFAULT_API_KEY}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowKey(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
            >
              {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Leave unchanged to use the AquaTech system key · Keys are stored in browser localStorage only
          </p>
        </div>

        {/* Test feedback */}
        {testStatus === 'success' && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Gemini API connected and responding successfully.</span>
          </div>
        )}
        {testStatus === 'error' && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{testErrorMessage}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Client-side only · Never sent to any proxy</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestKey}
              disabled={testStatus === 'testing'}
              className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold disabled:opacity-50 transition"
            >
              {testStatus === 'testing' ? 'Testing…' : 'Test Connection'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md transition"
            >
              Save & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
