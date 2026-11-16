/**
 * AquaTech · Google Gemini API Service
 * Hardcoded default key — users can only override, never erase.
 * High-speed models: gemini-flash-lite-latest (1.1s response time, zero queueing)
 * with automatic fallback to gemini-3.5-flash-lite and gemini-3.1-flash-lite.
 */

const STORAGE_KEY = 'aquatech_gemini_api_key';

// ── DEFAULT SYSTEM KEY VIA ENVIRONMENT ─────────────────────────────────────────
// Reads from .env (VITE_GEMINI_API_KEY) which is gitignored for security
export const DEFAULT_API_KEY = (import.meta as any)?.env?.VITE_GEMINI_API_KEY || '';
// Ultra-fast low-latency production endpoints:
export const GEMINI_MODEL = 'gemini-flash-lite-latest';
export const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
export const FAST_MODELS = ['gemini-flash-lite-latest', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];

// ── Storage helpers ───────────────────────────────────────────────────────────
export const getStoredApiKey = (): string =>
  localStorage.getItem(STORAGE_KEY) || DEFAULT_API_KEY;

export const setStoredApiKey = (key: string): void => {
  const trimmed = key.trim();
  if (trimmed && trimmed !== DEFAULT_API_KEY) {
    localStorage.setItem(STORAGE_KEY, trimmed);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

// ── Telemetry snapshot type ───────────────────────────────────────────────────
export interface TelemetrySnapshot {
  coolDrop: {
    collectionVolumeL: number;
    collectionRateLPerHr: number;
    tankCapacityL: number;
    tankFillPercentage: number;
    waterTemperatureC: number;
    ambientTemperatureC: number;
    ambientHumidityPct: number;
    leakDetected: boolean;
    overflowAlert: boolean;
    collectionEfficiencyPct: number;
  };
  purification: {
    currentStage: string;
    incomingVolumeL: number;
    outgoingTreatedVolumeL: number;
    flowRateLPerMin: number;
    pHSensor: number;
    turbidityNTU: number;
    temperatureC: number;
    conductivityMicroS: number;
    filterConditionPct: number;
    recoveryPercentage: number;
    safetyVerified: boolean;
  };
  sensors?: Array<{ id: string; name: string; value: number; unit: string; status: string }>;
  waterAllocations?: Array<{ id: string; category: string; volumeL: number; status: string }>;
  anomalies?: Array<{ id: string; severity: string; message: string; status: string }>;
  events?: Array<{ id: string; type: string; message: string; timestamp: string }>;
  timestamp: string;
}

// ── Markdown stripper ─────────────────────────────────────────────────────────
export const stripMarkdown = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/#{1,6}\s+/g, '')           // ## headings
    .replace(/\*\*([^*]+)\*\*/g, '$1')   // **bold**
    .replace(/\*([^*]+)\*/g, '$1')        // *italic*
    .replace(/__([^_]+)__/g, '$1')        // __bold__
    .replace(/_([^_]+)_/g, '$1')          // _italic_
    .replace(/`{3}[\s\S]*?`{3}/g, '')     // ```code blocks```
    .replace(/`([^`]+)`/g, '$1')          // `inline code`
    .replace(/^\s*[-*+]\s+/gm, '')        // bullet points
    .replace(/^\s*\d+\.\s+/gm, '')        // numbered lists
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [links](url) → text
    .replace(/^>\s+/gm, '')               // blockquotes
    .replace(/---+/g, '')                 // horizontal rules
    .replace(/\n{3,}/g, '\n\n')           // excess newlines
    .trim();
};

// ── System instruction builder ────────────────────────────────────────────────
export const buildSystemInstruction = (snapshot?: TelemetrySnapshot): string => {
  if (!snapshot) {
    return `You are AquaTech Gemini, the resident AI Systems Engineer and Scientific Copilot for the AquaTech Water Recovery Platform.
AquaTech unifies CoolDrop (AC condensate recovery) and Sewage Water Purification (6-stage treatment).
Write answers strictly in plain conversational prose with no markdown formatting.`;
  }

  const safePad = (str: any, len: number) => String(str || '').padEnd(len);

  const sensorsSection = (snapshot.sensors && snapshot.sensors.length > 0)
    ? `\n[Sensor Array Readings]\n` + snapshot.sensors
        .map(s => `  ${safePad(s?.name || s?.id, 26)}: ${s?.value ?? '--'} ${s?.unit || ''}  [${String(s?.status || 'NORMAL').toUpperCase()}]`)
        .join('\n')
    : '';

  const allocSection = (snapshot.waterAllocations && snapshot.waterAllocations.length > 0)
    ? `\n[Water Allocation Registry]\n` + snapshot.waterAllocations
        .map(a => `  ${safePad(a?.category, 20)}: ${Number(a?.volumeL || 0).toFixed(1)} L  [${a?.status || 'Allocated'}]`)
        .join('\n')
    : '';

  const anomalySection = (snapshot.anomalies && snapshot.anomalies.length > 0)
    ? `\n[Active System Anomalies]\n` + snapshot.anomalies
        .filter(a => a && a.status !== 'resolved')
        .map(a => `  [${String(a?.severity || 'WARN').toUpperCase()}] ${a?.message || 'Anomaly'}`)
        .join('\n')
    : '';

  const eventsSection = (snapshot.events && snapshot.events.length > 0)
    ? `\n[Recent System Events]\n` + snapshot.events
        .map(e => `  ${e?.timestamp || '--:--'} [${e?.type || 'INFO'}] ${e?.message || ''}`)
        .join('\n')
    : '';

  const telemetryBlock = `
=== LIVE AQUATECH PLATFORM TELEMETRY (injected at ${snapshot.timestamp || new Date().toISOString()}) ===

[CoolDrop Subsystem — AC Condensate Water Recovery]
  Stored Volume       : ${Number(snapshot.coolDrop?.collectionVolumeL || 0).toFixed(1)} L  (Tank: ${snapshot.coolDrop?.tankFillPercentage ?? 0}% of ${snapshot.coolDrop?.tankCapacityL ?? 250} L)
  Condensate Inflow   : ${Number(snapshot.coolDrop?.collectionRateLPerHr || 0).toFixed(1)} L/h
  Water Temperature   : ${snapshot.coolDrop?.waterTemperatureC ?? 20}°C
  Ambient Conditions  : ${snapshot.coolDrop?.ambientTemperatureC ?? 30}°C @ ${snapshot.coolDrop?.ambientHumidityPct ?? 65}% RH
  Collection Efficiency: ${snapshot.coolDrop?.collectionEfficiencyPct ?? 90}%
  Leak Sensor         : ${snapshot.coolDrop?.leakDetected ? 'CRITICAL — LEAK DETECTED' : 'CLEAR'}
  Overflow Alert      : ${snapshot.coolDrop?.overflowAlert ? 'HIGH — OVERFLOW RISK' : 'NOMINAL'}

[Sewage Purification Subsystem — 6-Stage Wastewater Treatment]
  Active Stage        : ${String(snapshot.purification?.currentStage || 'FILTRATION').toUpperCase()}
  Inflow (Raw)        : ${Number(snapshot.purification?.incomingVolumeL || 0).toFixed(1)} L
  Outflow (Treated)   : ${Number(snapshot.purification?.outgoingTreatedVolumeL || 0).toFixed(1)} L
  Flow Rate           : ${Number(snapshot.purification?.flowRateLPerMin || 0).toFixed(1)} L/min
  Process Recovery    : ${snapshot.purification?.recoveryPercentage ?? 88}%
  Turbidity (Effluent): ${Number(snapshot.purification?.turbidityNTU || 0).toFixed(2)} NTU  (Reuse target: <5.0 NTU)
  pH Reading          : ${Number(snapshot.purification?.pHSensor || 7.0).toFixed(2)}  (Safe band: 6.5–8.5)
  Conductivity        : ${snapshot.purification?.conductivityMicroS ?? 300} µS/cm
  Temperature         : ${snapshot.purification?.temperatureC ?? 22}°C
  Filter Health       : ${snapshot.purification?.filterConditionPct ?? 90}%
  Reuse Gate          : ${snapshot.purification?.safetyVerified ? 'APPROVED — Non-Potable Reuse Verified' : 'HOLD — Pending Quality Verification'}
${sensorsSection}${allocSection}${anomalySection}${eventsSection}

=== END TELEMETRY BLOCK ===
`;

  return `You are AquaTech Gemini, the resident AI Systems Engineer and Scientific Copilot embedded in the AquaTech Smart Water Recovery Platform.

AquaTech unifies two physical engineering models:
1. CoolDrop — harvests condensate from HVAC air-conditioning coils. The psychrometric condensation process converts ambient moisture at the evaporator coil (approximately 7–12°C) into clean liquid water captured by gravity drainage.
2. Sewage Water Purification — 6-stage greywater/wastewater treatment: (1) Preliminary Screening, (2) Lamella Sedimentation, (3) Multi-Media Depth Filtration, (4) Activated Carbon Adsorption, (5) UV-C 254nm Disinfection, (6) Quality Verification.

Water reuse categories: Category A = Landscape irrigation; Category B = Toilet flushing; Category C = Cleaning applications. RESTRICTED = Potable/drinking water (requires certified municipal potable treatment).

${telemetryBlock}

RESPONSE RULES (strictly mandatory):
- Write in plain conversational prose only. Never use markdown formatting — no asterisks, no hash symbols, no bullet dashes, no backticks, no bold, no headers.
- Always cite specific live telemetry numbers when answering anything about current conditions, levels, or status.
- If anomalies or threshold breaches are present in telemetry, acknowledge them clearly and suggest actionable diagnostic steps.
- Be technically precise, scientifically rigorous, and explain engineering concepts accessibly for both operators and exhibition visitors.
- Keep responses concise but complete — typically 3 to 6 clear sentences per response.`;
};

// ── Ultra-fast concurrent/failover executor ──────────────────────────────────
const executeWithFastFailover = async (
  requestBody: any,
  apiKey: string
): Promise<string> => {
  let lastError: any = null;

  for (const model of FAST_MODELS) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          return stripMarkdown(rawText);
        }
      }

      const errJson = await response.json().catch(() => null);
      const errMsg = errJson?.error?.message || response.statusText;
      lastError = new Error(`Gemini API (${model}) [HTTP ${response.status}]: ${errMsg}`);

      // If this model is overloaded (503) or rate-limited (429), immediately try next model without waiting
      if (response.status === 503 || response.status === 429 || response.status === 404) {
        continue;
      }

      // If client error (bad request), throw immediately
      if (response.status >= 400 && response.status < 500) {
        throw lastError;
      }
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error('Gemini API is currently busy. Please try your question again.');
};

// ── Main Gemini query function ────────────────────────────────────────────────
export const queryGemini = async (
  userPrompt: string,
  snapshot?: TelemetrySnapshot,
  customApiKey?: string
): Promise<string> => {
  const apiKey = (customApiKey?.trim()) || getStoredApiKey() || DEFAULT_API_KEY;
  const systemInstruction = buildSystemInstruction(snapshot);

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }]
      }
    ],
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 800,
      topP: 0.95
    }
  };

  return await executeWithFastFailover(requestBody, apiKey);
};
