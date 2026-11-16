import React, { useState } from 'react';
import { useAquaTech } from '../../context/AquaTechContext';
import { SensorReading } from '../../types';
import {
  Activity,
  Download,
  Settings2,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Gauge,
  Zap,
  Thermometer,
  ShieldAlert,
  Edit3
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const LiveMonitoringView: React.FC = () => {
  const {
    sensors,
    hourlyTrends,
    isLiveStreamActive,
    updateSensorCalibration,
    addSystemEvent
  } = useAquaTech();

  const [selectedSensorId, setSelectedSensorId] = useState<string>('SNS-PH-02');
  const [calibrationModalSensor, setCalibrationModalSensor] = useState<SensorReading | null>(null);
  const [calibrationOffset, setCalibrationOffset] = useState<number>(0.05);

  const activeSensor = sensors.find(s => s.id === selectedSensorId) || sensors[0];

  // CSV export handler
  const handleExportCSV = () => {
    const headers = ['Sensor ID', 'Name', 'Category', 'Current Value', 'Unit', 'Status', 'Min Safe', 'Max Safe', 'Last Calibrated'];
    const rows = sensors.map(s => [
      s.id,
      `"${s.name}"`,
      s.category,
      s.currentValue,
      s.unit,
      s.status,
      s.minSafe,
      s.maxSafe,
      s.lastCalibrated
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AquaTech_Sensor_Readings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addSystemEvent({
      level: 'info',
      module: 'Live Monitoring',
      message: 'Exported sensor telemetry readings to CSV.'
    });
  };

  const applyCalibration = () => {
    if (!calibrationModalSensor) return;
    updateSensorCalibration(calibrationModalSensor.id, calibrationOffset);
    setCalibrationModalSensor(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#21A6A0]/15 flex items-center justify-center text-[#123B55]">
            <Activity className="w-7 h-7 text-[#21A6A0]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#123B55]">Live Sensor Telemetry Array</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#65A875]" />
                {sensors.length} Transducers Polling
              </span>
            </div>
            <p className="text-xs text-slate-500">
              High-Frequency Transducer Feeds, ADC Linearization, Error Margins & Calibrations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#21A6A0]" />
            Download Sensor CSV
          </button>
        </div>
      </div>

      {/* Sensor Cards Grid (7 Transducers from spec) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sensors.map((sensor) => {
          const isSelected = sensor.id === selectedSensorId;

          return (
            <div
              key={sensor.id}
              onClick={() => setSelectedSensorId(sensor.id)}
              className={`cursor-pointer rounded-xl p-4 border transition-all text-left relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#21A6A0] ring-2 ring-[#21A6A0]/20 shadow-md'
                  : 'bg-white hover:bg-slate-50/80 border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 block">{sensor.id}</span>
                  <h4 className="text-xs font-bold text-slate-800 mt-0.5 line-clamp-1">{sensor.name}</h4>
                </div>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {sensor.status}
                </span>
              </div>

              <div className="my-3 flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold font-mono text-[#123B55]">
                  {sensor.currentValue}
                </span>
                <span className="text-xs font-semibold font-mono text-slate-500">{sensor.unit}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Safe: {sensor.minSafe} - {sensor.maxSafe}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCalibrationModalSensor(sensor);
                  }}
                  className="hover:text-[#21A6A0] flex items-center gap-0.5 text-[#123B55] font-semibold"
                >
                  <Edit3 className="w-3 h-3" /> Calibrate
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Sensor Deep-Dive and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Selected Transducer Waveform
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                {activeSensor.name} ({activeSensor.id}) - Live Sampling
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#21A6A0] animate-ping" />
              <span className="text-xs font-mono font-semibold text-[#123B55]">
                {activeSensor.currentValue} {activeSensor.unit}
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B2333', borderColor: '#123B55', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  name={`${activeSensor.name} Signal`}
                  stroke="#21A6A0"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#21A6A0' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sensor Metadata & Calibration Specs */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Transducer Hardware Specs</h3>
              <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                ADC Transceiver
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Physical Type</span>
                <p className="text-slate-800 font-medium mt-0.5">{activeSensor.description}</p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Error Margin:</span>
                  <span className="font-bold text-slate-800">±{activeSensor.errorMarginPct}% FS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Calibrated Date:</span>
                  <span className="font-bold text-[#123B55]">{activeSensor.lastCalibrated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sampling Rate:</span>
                  <span className="font-bold text-[#21A6A0]">2.5 Seconds</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4">
            <button
              onClick={() => setCalibrationModalSensor(activeSensor)}
              className="w-full bg-[#123B55] hover:bg-[#1a4f73] text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Settings2 className="w-3.5 h-3.5" />
              Adjust Transducer Calibration
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Sensor Calibration */}
      {calibrationModalSensor && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Calibrate Sensor: {calibrationModalSensor.name}
              </h3>
              <button
                onClick={() => setCalibrationModalSensor(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-mono font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Enter a calibration offset against standard buffer reference (e.g. pH 7.0 buffer or pure distilled water zero-point).
            </p>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Offset Value ({calibrationModalSensor.unit})</label>
              <input
                type="number"
                step="0.01"
                value={calibrationOffset}
                onChange={(e) => setCalibrationOffset(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#21A6A0]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setCalibrationModalSensor(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={applyCalibration}
                className="px-4 py-1.5 rounded-lg bg-[#21A6A0] hover:bg-[#1b8c87] text-white text-xs font-semibold shadow-xs"
              >
                Save Calibration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

