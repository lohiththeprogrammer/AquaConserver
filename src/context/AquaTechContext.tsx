import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CoolDropTelemetry,
  PurificationTelemetry,
  DeviceTelemetry,
  SensorReading,
  TreatmentStageId,
  ACUnitStatus,
  SystemEvent,
  WaterAllocation,
  AnomalyReport,
  ExperimentScenario
} from '../types';
import {
  initialCoolDrop,
  initialPurification,
  initialDevices,
  initialSensors,
  acUnitsData,
  waterAllocations as initialAllocations,
  anomalyReports as initialAnomalies,
  recentSystemEvents as initialEvents,
  hourlyTrendData as initialHourly,
  labPresets
} from '../data/mockData';
import {
  queryGemini,
  getStoredApiKey,
  setStoredApiKey as saveApiKey,
  DEFAULT_API_KEY,
  GEMINI_MODEL,
  TelemetrySnapshot
} from '../services/geminiService';

export type ModuleKey =
  | 'overview'
  | 'cooldrop'
  | 'purification'
  | 'water-management'
  | 'live-monitoring'
  | 'analytics'
  | 'ai-intelligence'
  | 'digital-twin'
  | 'environmental-impact'
  | 'interactive-lab'
  | 'learning-centre'
  | 'reports-settings';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isGemini?: boolean;
  dataCard?: {
    title: string;
    metrics: { label: string; value: string }[];
  };
}

interface AquaTechContextType {
  activeModule: ModuleKey;
  setActiveModule: (m: ModuleKey) => void;
  isSimulatedHardware: boolean;
  toggleHardwareMode: () => void;
  isLiveStreamActive: boolean;
  setIsLiveStreamActive: (v: boolean) => void;
  coolDrop: CoolDropTelemetry;
  purification: PurificationTelemetry;
  devices: DeviceTelemetry[];
  sensors: SensorReading[];
  acUnits: ACUnitStatus[];
  waterAllocations: WaterAllocation[];
  anomalies: AnomalyReport[];
  events: SystemEvent[];
  activeTreatmentStage: TreatmentStageId;
  setActiveTreatmentStage: (s: TreatmentStageId) => void;
  hourlyTrends: typeof initialHourly;
  labScenario: ExperimentScenario;
  updateLabScenario: (patch: Partial<ExperimentScenario>) => void;
  runLabExperiment: () => void;
  labResults: { time: string; recoveryPct: number; energyKwh: number; purityScore: number }[];
  chatHistory: ChatMessage[];
  sendQueryToAI: (query: string) => Promise<void>;
  updateSensorCalibration: (sensorId: string, offset: number) => void;
  addSystemEvent: (event: Omit<SystemEvent, 'id' | 'timestamp'>) => void;
  // Gemini AI specific states & operations
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  geminiModel: string;
  setGeminiModel: (model: string) => void;
  isGeminiLoading: boolean;
  isGeminiModalOpen: boolean;
  setIsGeminiModalOpen: (open: boolean) => void;
  isGeminiDrawerOpen: boolean;
  setIsGeminiDrawerOpen: (open: boolean) => void;
  generateGeminiExecutiveBrief: () => Promise<string>;
  generateGeminiAnomalyAudit: () => Promise<string>;
  generateGeminiLabCritique: () => Promise<string>;
  generateGeminiWaterOptimization: () => Promise<string>;
}

const AquaTechContext = createContext<AquaTechContextType | undefined>(undefined);

export const AquaTechProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<ModuleKey>('overview');
  const [isSimulatedHardware, setIsSimulatedHardware] = useState<boolean>(true);
  const [isLiveStreamActive, setIsLiveStreamActive] = useState<boolean>(true);

  const [coolDrop, setCoolDrop] = useState<CoolDropTelemetry>(initialCoolDrop);
  const [purification, setPurification] = useState<PurificationTelemetry>(initialPurification);
  const [devices, setDevices] = useState<DeviceTelemetry[]>(initialDevices);
  const [sensors, setSensors] = useState<SensorReading[]>(initialSensors);
  const [acUnits, setAcUnits] = useState<ACUnitStatus[]>(acUnitsData);
  const [waterAllocations, setWaterAllocations] = useState<WaterAllocation[]>(initialAllocations);
  const [anomalies, setAnomalies] = useState<AnomalyReport[]>(initialAnomalies);
  const [events, setEvents] = useState<SystemEvent[]>(initialEvents);
  const [activeTreatmentStage, setActiveTreatmentStage] = useState<TreatmentStageId>('filtration');
  const [hourlyTrends, setHourlyTrends] = useState(initialHourly);

  // Gemini specific states - defaults to the hardcoded system key
  const [geminiApiKey, setGeminiApiKeyState] = useState<string>(getStoredApiKey());
  const [geminiModel, setGeminiModelState] = useState<string>(GEMINI_MODEL);
  const [isGeminiLoading, setIsGeminiLoading] = useState<boolean>(false);
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState<boolean>(false);
  const [isGeminiDrawerOpen, setIsGeminiDrawerOpen] = useState<boolean>(false);

  // Lab scenario state
  const [labScenario, setLabScenario] = useState<ExperimentScenario>(labPresets[0]);
  const [labResults, setLabResults] = useState<{ time: string; recoveryPct: number; energyKwh: number; purityScore: number }[]>([
    { time: 'T+0s', recoveryPct: 88.0, energyKwh: 0.22, purityScore: 94 },
    { time: 'T+10s', recoveryPct: 89.2, energyKwh: 0.23, purityScore: 95 },
    { time: 'T+20s', recoveryPct: 91.5, energyKwh: 0.24, purityScore: 96 },
    { time: 'T+30s', recoveryPct: 92.4, energyKwh: 0.25, purityScore: 97 },
  ]);

  // AI Assistant Chat state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Greetings. I am AquaTech Gemini Copilot, your real-time generative intelligence agent. I continuously audit telemetry across CoolDrop and Sewage Water Purification models with live hardware context injected into every query. You can ask me operational questions, request root-cause analyses, or explore chemical and thermodynamic principles.',
      timestamp: '16:55',
      isGemini: true
    }
  ]);

  const setGeminiApiKey = (key: string) => {
    saveApiKey(key);
    const resolved = key.trim() || DEFAULT_API_KEY;
    setGeminiApiKeyState(resolved);
    addSystemEvent({
      level: 'success',
      module: 'Gemini AI Core',
      message: resolved === DEFAULT_API_KEY
        ? 'Google Gemini system key active.'
        : 'Google Gemini custom user key registered.'
    });
  };

  const setGeminiModel = (model: string) => {
    setGeminiModelState(model);
  };

  // Full platform telemetry snapshot injected before EVERY Gemini query
  const getTelemetrySnapshot = (): TelemetrySnapshot => {
    return {
      coolDrop: { ...coolDrop },
      purification: { ...purification, currentStage: activeTreatmentStage },
      sensors: (sensors || []).map(s => ({
        id: s?.id || '',
        name: s?.name || '',
        value: typeof s?.currentValue === 'number' ? s.currentValue : 0,
        unit: s?.unit || '',
        status: s?.status || 'normal'
      })),
      waterAllocations: (waterAllocations || []).map(a => ({
        id: a?.id || '',
        category: a?.category || 'Category A',
        volumeL: typeof a?.allocatedLiters === 'number' ? a.allocatedLiters : 0,
        status: a?.approvedQuality ? 'Verified Approved' : 'Pending Verification'
      })),
      anomalies: (anomalies || []).map(a => ({
        id: a?.id || '',
        severity: a?.severity || 'low',
        message: a?.observation || a?.rootCauseHypothesis || 'Anomaly flagged',
        status: a?.status || 'active'
      })),
      events: (events || []).slice(0, 8).map(e => ({
        id: e?.id || '',
        type: e?.level || 'info',
        message: e?.message || '',
        timestamp: e?.timestamp || ''
      })),
      timestamp: new Date().toISOString()
    };
  };

  const toggleHardwareMode = () => {
    setIsSimulatedHardware(prev => {
      const next = !prev;
      setDevices(currentDevices =>
        currentDevices.map(d => ({
          ...d,
          status: next ? 'online' : 'awaiting_connection'
        }))
      );
      return next;
    });
  };

  const updateLabScenario = (patch: Partial<ExperimentScenario>) => {
    setLabScenario(prev => ({ ...prev, ...patch }));
  };

  const runLabExperiment = () => {
    const simulatedRecovery = Number((85 + Math.random() * 8.5).toFixed(1));
    const simulatedEnergy = Number((0.15 + (labScenario.flowRateMultiplier * 0.08)).toFixed(2));
    const simulatedPurity = labScenario.filterType === 'Ultra-Adsorption Matrix' ? 98 : 93;

    setLabResults([
      { time: 'T+00s', recoveryPct: simulatedRecovery - 3, energyKwh: simulatedEnergy - 0.04, purityScore: simulatedPurity - 2 },
      { time: 'T+15s', recoveryPct: simulatedRecovery - 1.5, energyKwh: simulatedEnergy - 0.02, purityScore: simulatedPurity - 1 },
      { time: 'T+30s', recoveryPct: simulatedRecovery, energyKwh: simulatedEnergy, purityScore: simulatedPurity },
      { time: 'T+45s', recoveryPct: simulatedRecovery + 0.8, energyKwh: simulatedEnergy + 0.01, purityScore: simulatedPurity }
    ]);

    addSystemEvent({
      level: 'info',
      module: 'Interactive Lab',
      message: `Experiment simulated: "${labScenario.name}" yielded ${simulatedRecovery}% recovery rate.`
    });
  };

  const addSystemEvent = (evt: Omit<SystemEvent, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newEvent: SystemEvent = {
      ...evt,
      id: `EVT-${Date.now().toString().slice(-4)}`,
      timestamp: timeStr
    };
    setEvents(prev => [newEvent, ...prev.slice(0, 19)]);
  };

  const updateSensorCalibration = (sensorId: string, offset: number) => {
    setSensors(prev =>
      prev.map(s => {
        if (s.id === sensorId) {
          return {
            ...s,
            currentValue: Number((s.currentValue + offset).toFixed(2)),
            lastCalibrated: new Date().toISOString().split('T')[0]
          };
        }
        return s;
      })
    );
    addSystemEvent({
      level: 'info',
      module: 'Sensor Network',
      message: `Sensor ${sensorId} calibrated with offset ${offset > 0 ? '+' : ''}${offset}.`
    });
  };

  const sendQueryToAI = async (query: string): Promise<void> => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toTimeString().slice(0, 5)
    };
    setChatHistory(prev => [...prev, userMsg]);
    setIsGeminiLoading(true);

    try {
      const snapshot = getTelemetrySnapshot();
      const activeKey = geminiApiKey || DEFAULT_API_KEY;
      const replyText = await queryGemini(query, snapshot, activeKey);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toTimeString().slice(0, 5),
        isGemini: true
      };
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `Gemini Notice: ${err.message || 'Unable to connect to Gemini API. Check your connection.'}`,
        timestamp: new Date().toTimeString().slice(0, 5),
        isGemini: false
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsGeminiLoading(false);
    }
  };

  // Specialized Gemini Generators
  const generateGeminiExecutiveBrief = async (): Promise<string> => {
    setIsGeminiLoading(true);
    try {
      const prompt = 'Generate a high-level, 3-paragraph executive operational briefing for the plant manager summarizing current CoolDrop condensate yields, wastewater purification quality compliance (turbidity and pH), and verified reuse allocations for campus facilities. Provide answers in plain prose without any markdown.';
      const res = await queryGemini(prompt, getTelemetrySnapshot(), geminiApiKey || DEFAULT_API_KEY);
      return res;
    } finally {
      setIsGeminiLoading(false);
    }
  };

  const generateGeminiAnomalyAudit = async (): Promise<string> => {
    setIsGeminiLoading(true);
    try {
      const prompt = 'Perform a rigorous engineering anomaly audit on the CoolDrop -28% collection drop and Multi-Media differential pressure increase (+3.2 kPa). Provide a structured diagnostic tree, root cause evaluation, and maintenance checklist in plain prose without markdown formatting.';
      const res = await queryGemini(prompt, getTelemetrySnapshot(), geminiApiKey || DEFAULT_API_KEY);
      return res;
    } finally {
      setIsGeminiLoading(false);
    }
  };

  const generateGeminiLabCritique = async (): Promise<string> => {
    setIsGeminiLoading(true);
    try {
      const prompt = `Critique the current virtual experiment: Scenario "${labScenario.name}", Inflow ${labScenario.wastewaterInflow} L/min, Filter Bed ${labScenario.filterType}, Disinfection ${labScenario.disinfectionIntensity}. Evaluate mass balance efficiency, retention time, and whether non-potable standards were met. Write in plain prose without any markdown symbols.`;
      const res = await queryGemini(prompt, getTelemetrySnapshot(), geminiApiKey || DEFAULT_API_KEY);
      return res;
    } finally {
      setIsGeminiLoading(false);
    }
  };

  const generateGeminiWaterOptimization = async (): Promise<string> => {
    setIsGeminiLoading(true);
    try {
      const prompt = `Analyze our current water stock (${coolDrop.collectionVolumeL.toFixed(1)} L condensate and ${purification.outgoingTreatedVolumeL.toFixed(1)} L treated effluent). Recommend an optimized distribution matrix across Category A (irrigation), Category B (toilet flushing), and Category C (cleaning). Explain why direct drinking remains restricted. Write in plain text prose without markdown.`;
      const res = await queryGemini(prompt, getTelemetrySnapshot(), geminiApiKey || DEFAULT_API_KEY);
      return res;
    } finally {
      setIsGeminiLoading(false);
    }
  };

  // Real-time telemetry simulation loop (when active & simulated)
  useEffect(() => {
    if (!isLiveStreamActive || !isSimulatedHardware) return;

    const interval = setInterval(() => {
      setCoolDrop(prev => {
        const delta = (Math.random() - 0.48) * 0.15;
        const newRate = Math.max(4.0, Math.min(9.5, Number((prev.collectionRateLPerHr + delta * 0.3).toFixed(2))));
        const newVol = Number((prev.collectionVolumeL + (newRate / 3600) * 3).toFixed(2));
        const newFill = Number(((newVol / prev.tankCapacityL) * 100).toFixed(1));
        return {
          ...prev,
          collectionRateLPerHr: newRate,
          collectionVolumeL: newVol,
          tankFillPercentage: newFill
        };
      });

      setPurification(prev => {
        const phDelta = (Math.random() - 0.5) * 0.02;
        const turbDelta = (Math.random() - 0.5) * 0.03;
        const newPh = Number((prev.pHSensor + phDelta).toFixed(2));
        const newTurb = Math.max(0.4, Number((prev.turbidityNTU + turbDelta).toFixed(2)));
        const newOutgoing = Number((prev.outgoingTreatedVolumeL + 0.04).toFixed(2));
        return {
          ...prev,
          pHSensor: newPh,
          turbidityNTU: newTurb,
          outgoingTreatedVolumeL: newOutgoing
        };
      });

      setSensors(prev =>
        prev.map(s => {
          let updated = s.currentValue;
          if (s.key === 'flow_cooldrop') updated = Number((s.currentValue + (Math.random() - 0.5) * 0.1).toFixed(2));
          if (s.key === 'ph_purification') updated = Number((s.currentValue + (Math.random() - 0.5) * 0.02).toFixed(2));
          if (s.key === 'turbidity_purification') updated = Math.max(0.5, Number((s.currentValue + (Math.random() - 0.5) * 0.03).toFixed(2)));
          if (s.key === 'temp_cooldrop') updated = Number((19.5 + Math.random() * 0.6).toFixed(1));
          if (s.key === 'power_system') updated = Number((75 + Math.random() * 6).toFixed(1));
          return { ...s, currentValue: updated };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [isLiveStreamActive, isSimulatedHardware]);

  return (
    <AquaTechContext.Provider
      value={{
        activeModule,
        setActiveModule,
        isSimulatedHardware,
        toggleHardwareMode,
        isLiveStreamActive,
        setIsLiveStreamActive,
        coolDrop,
        purification,
        devices,
        sensors,
        acUnits,
        waterAllocations,
        anomalies,
        events,
        activeTreatmentStage,
        setActiveTreatmentStage,
        hourlyTrends,
        labScenario,
        updateLabScenario,
        runLabExperiment,
        labResults,
        chatHistory,
        sendQueryToAI,
        updateSensorCalibration,
        addSystemEvent,
        // Gemini
        geminiApiKey,
        setGeminiApiKey,
        geminiModel,
        setGeminiModel,
        isGeminiLoading,
        isGeminiModalOpen,
        setIsGeminiModalOpen,
        isGeminiDrawerOpen,
        setIsGeminiDrawerOpen,
        generateGeminiExecutiveBrief,
        generateGeminiAnomalyAudit,
        generateGeminiLabCritique,
        generateGeminiWaterOptimization
      }}
    >
      {children}
    </AquaTechContext.Provider>
  );
};

export const useAquaTech = (): AquaTechContextType => {
  const context = useContext(AquaTechContext);
  if (!context) {
    throw new Error('useAquaTech must be used within an AquaTechProvider');
  }
  return context;
};
