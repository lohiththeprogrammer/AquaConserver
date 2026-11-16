import React from 'react';
import { useAquaTech } from '../../context/AquaTechContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StageFlowDiagram } from '../../components/common/StageFlowDiagram';
import { treatmentStages } from '../../data/mockData';
import {
  Filter,
  ShieldCheck,
  AlertTriangle,
  Droplet,
  Gauge,
  Thermometer,
  Zap,
  Activity,
  CheckCircle2,
  Clock,
  Layers,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';

export const PurificationView: React.FC = () => {
  const {
    purification,
    activeTreatmentStage,
    setActiveTreatmentStage
  } = useAquaTech();

  const selectedStage = treatmentStages.find(s => s.id === activeTreatmentStage) || treatmentStages[0];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#21A6A0]/15 flex items-center justify-center text-[#123B55]">
            <Filter className="w-7 h-7 text-[#21A6A0]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#123B55]">Sewage Water Purification</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#65A875]" />
                Stage Active: {activeTreatmentStage.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              6-Stage Wastewater Treatment, Quality Assurance Sensor Array & Clarification Pipeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-50 p-2 rounded-lg border border-slate-200 text-slate-600">
          <span>Incoming: <strong>{purification.incomingVolumeL.toFixed(1)} L</strong></span>
          <span className="text-slate-300">|</span>
          <span>Outgoing: <strong>{purification.outgoingTreatedVolumeL.toFixed(1)} L</strong></span>
          <span className="text-slate-300">|</span>
          <span className="text-[#65A875] font-bold">{purification.recoveryPercentage}% Yield</span>
        </div>
      </div>

      {/* Mandatory Regulatory / Safety Disclaimer Alert */}
      <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-900 text-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider text-[11px] text-amber-800 block">
            Engineering Verification & Safety Protocol
          </span>
          <p className="mt-0.5 leading-relaxed text-amber-950/80">
            These readings represent monitoring indicators from the engineering physical model, not certification of potable water. A physical model using simulated wastewater is an educational and pilot prototype, not a certified municipal sewage treatment plant. Actual direct human consumption or potable distribution strictly requires ISO 24510 / WHO laboratory microbiological validation.
          </p>
        </div>
      </div>

      {/* Row 1: Key Quality & Process Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Water pH Level"
          value={purification.pHSensor.toFixed(2)}
          unit="pH"
          subValue="Safe Band: 6.5 - 8.5"
          change="Neutral target"
          accentColor="teal"
          icon={<Activity className="w-5 h-5 text-[#21A6A0]" />}
          statusBadge="Optimal"
        />

        <MetricCard
          label="Effluent Turbidity"
          value={purification.turbidityNTU.toFixed(2)}
          unit="NTU"
          subValue="Nephelometric infrared sensor"
          change="Standard: < 5.0 NTU"
          accentColor="green"
          icon={<ShieldCheck className="w-5 h-5 text-[#65A875]" />}
          statusBadge="Compliant"
        />

        <MetricCard
          label="Treatment Flow Rate"
          value={purification.flowRateLPerMin.toFixed(1)}
          unit="L/min"
          subValue="Inline electromagnetic meter"
          change="Process stable"
          accentColor="blue"
          icon={<Gauge className="w-5 h-5 text-[#5CB6DC]" />}
        />

        <MetricCard
          label="Filter Media Health"
          value={`${purification.filterConditionPct}%`}
          subValue="Backwash cycle scheduled in 48h"
          change="Clean bed"
          accentColor="navy"
          icon={<Sparkles className="w-5 h-5 text-[#123B55]" />}
          statusBadge="Healthy"
        />
      </div>

      {/* Row 2: 6-Stage Treatment Flow Diagram */}
      <StageFlowDiagram
        stages={treatmentStages}
        activeStageId={activeTreatmentStage}
        onSelectStage={setActiveTreatmentStage}
      />

      {/* Row 3: Selected Stage Deep-Dive & Quality Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Selected Stage Detail Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Chamber 0{selectedStage.order} Specification
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {selectedStage.status.toUpperCase()}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-base mt-3">{selectedStage.name}</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{selectedStage.detailedDesc}</p>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Filtration Media:</span>
                <span className="font-semibold text-slate-800 font-mono text-[11px]">{selectedStage.mediaType}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Hydraulic Retention Time:</span>
                <span className="font-bold text-[#123B55] font-mono">{selectedStage.retentionTimeMinutes} Minutes</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Differential Pressure:</span>
                <span className="font-bold text-[#21A6A0] font-mono">{selectedStage.differentialPressureKPa} kPa</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Removal Efficiency:</span>
                <span className="font-bold text-[#65A875] font-mono">{selectedStage.efficiencyPct}%</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 text-[11px] text-slate-400 font-mono">
            Last Service: {selectedStage.lastMaintenance}
          </div>
        </div>

        {/* Multi-Parameter Sensor Array */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Purification Physical Sensor Readouts</h3>
              <p className="text-xs text-slate-500">Transmitted from ESP32-PUR-02 via MQTT topic: aquatech/purification/sensors</p>
            </div>
            <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold border border-blue-200">
              Validated
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Electrical Cond.</span>
              <span className="text-lg font-bold font-mono text-[#123B55] mt-1 block">
                {purification.conductivityMicroS} µS/cm
              </span>
              <span className="text-[10px] text-slate-500">Dissolved ionic solids</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Dissolved Oxygen</span>
              <span className="text-lg font-bold font-mono text-[#21A6A0] mt-1 block">
                {purification.dissolvedOxygenMgL} mg/L
              </span>
              <span className="text-[10px] text-slate-500">Aeration state</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Water Temp</span>
              <span className="text-lg font-bold font-mono text-slate-800 mt-1 block">
                {purification.temperatureC} °C
              </span>
              <span className="text-[10px] text-slate-500">DS18B20 inline</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Cumulative Runtime</span>
              <span className="text-lg font-bold font-mono text-slate-800 mt-1 block">
                {purification.treatmentDurationHrs} hrs
              </span>
              <span className="text-[10px] text-slate-500">Continuous batch</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Disinfection Barrier</span>
              <span className="text-lg font-bold font-mono text-[#65A875] mt-1 block">
                UV-C 254nm
              </span>
              <span className="text-[10px] text-slate-500">Dosage &gt;40 mJ/cm²</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Recovery Yield</span>
              <span className="text-lg font-bold font-mono text-[#21A6A0] mt-1 block">
                {purification.recoveryPercentage}%
              </span>
              <span className="text-[10px] text-slate-500">Mass balance verified</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#65A875]" />
              Non-Potable Safety Verification Gate:
            </span>
            <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              PASSED & CLEARED FOR ALLOCATION
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

