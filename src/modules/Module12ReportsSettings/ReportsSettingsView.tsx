import React, { useState } from 'react';
import { useAquaTech } from '../../context/AquaTechContext';
import { maintenanceHistory } from '../../data/mockData';
import {
  FileText,
  Settings,
  Download,
  Printer,
  Cpu,
  Sliders,
  User,
  Shield,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  RefreshCw,
  Plus
} from 'lucide-react';

export const ReportsSettingsView: React.FC = () => {
  const {
    devices,
    sensors,
    coolDrop,
    purification,
    addSystemEvent
  } = useAquaTech();

  const [activeTab, setActiveTab] = useState<'reports' | 'devices' | 'thresholds' | 'profile'>('reports');
  const [selectedReportType, setSelectedReportType] = useState<string>('daily');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  // New hardware registration form state
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceType, setNewDeviceType] = useState<'cooldrop' | 'purification'>('cooldrop');
  const [newDeviceTopic, setNewDeviceTopic] = useState('aquatech/expansion/sensors');

  const reportList = [
    { id: 'daily', name: 'Daily Water Recovery Report', desc: 'Detailed hourly breakdown of CoolDrop and treated greywater output.' },
    { id: 'weekly', name: 'Weekly System Performance Audit', desc: '7-day recovery efficiency, downtime analysis, and power usage.' },
    { id: 'monthly', name: 'Monthly Environmental & Economic Report', desc: 'Freshwater demand offset, municipal bill savings, and lifecycle stats.' },
    { id: 'quality', name: 'Water-Quality & Laboratory Compliance Log', desc: 'Turbidity, pH, and UV disinfection verification records.' },
    { id: 'maintenance', name: 'Subsystem Maintenance & Service Logbook', desc: 'Filter backwash cycles, UV lamp hours, and calibration logs.' },
    { id: 'sensors', name: 'Raw Telemetry & Sensor Transducer Feed', desc: 'High-resolution time-series sensor output archive.' }
  ];

  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    setIsExporting(true);
    setExportMessage(null);

    setTimeout(() => {
      setIsExporting(false);
      setExportMessage(`Successfully compiled and exported "${selectedReportType.toUpperCase()}" report in .${format} format.`);
      addSystemEvent({
        level: 'info',
        module: 'Reports Engine',
        message: `Generated and exported ${selectedReportType} report (${format.toUpperCase()}).`
      });
      setTimeout(() => setExportMessage(null), 4000);
    }, 1000);
  };

  const handleRegisterDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName.trim()) return;

    addSystemEvent({
      level: 'success',
      module: 'Hardware Registration',
      message: `Registered hardware device "${newDeviceName}" on topic "${newDeviceTopic}".`
    });

    setNewDeviceName('');
    alert(`Device registered successfully! Telemetry listener initialized on MQTT topic: ${newDeviceTopic}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-[#123B55]">
            <Settings className="w-7 h-7 text-[#123B55]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#123B55]">Reports & System Configuration</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                Administration
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Regulatory Reporting Exports, Hardware Node Management, Calibration Offsets & User Access Controls
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === 'reports' ? 'bg-white text-[#123B55] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Report Generator
          </button>
          <button
            onClick={() => setActiveTab('devices')}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === 'devices' ? 'bg-white text-[#123B55] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Hardware Devices ({devices.length})
          </button>
          <button
            onClick={() => setActiveTab('thresholds')}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === 'thresholds' ? 'bg-white text-[#123B55] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Alert Thresholds
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === 'profile' ? 'bg-white text-[#123B55] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Profiles & Units
          </button>
        </div>
      </div>

      {/* Tab: Report Generator */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Report Selection List */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block px-1">
              Select Report Template
            </span>
            {reportList.map((rep) => {
              const isSelected = rep.id === selectedReportType;
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReportType(rep.id)}
                  className={`cursor-pointer rounded-xl p-4 border transition-all text-left ${
                    isSelected
                      ? 'bg-[#123B55] text-white border-[#123B55] shadow-md'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <h4 className="font-bold text-xs">{rep.name}</h4>
                  <p className={`text-[11px] mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {rep.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Report Preview & Export Controls */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#21A6A0] font-bold block">
                    Document Generator Preview
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {reportList.find(r => r.id === selectedReportType)?.name}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  System Date: 2026-11-16
                </span>
              </div>

              {/* Simulated Printable Document Preview */}
              <div className="my-4 p-5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 space-y-3 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-[#123B55]">AQUATECH AUDIT REPORT · CERTIFIED SUMMARY</span>
                  <span className="text-[10px] text-slate-500">ID: RPT-2026-1116-A</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>CoolDrop Harvest: <strong>{coolDrop.collectionVolumeL.toFixed(1)} L</strong></div>
                  <div>Treated Greywater: <strong>{purification.outgoingTreatedVolumeL.toFixed(1)} L</strong></div>
                  <div>Turbidity Verification: <strong>{purification.turbidityNTU} NTU (Pass)</strong></div>
                  <div>pH Value: <strong>{purification.pHSensor} (Neutral)</strong></div>
                  <div>Avoided Freshwater Abstraction: <strong>{(coolDrop.collectionVolumeL + purification.outgoingTreatedVolumeL).toFixed(1)} L</strong></div>
                  <div>Operating Energy Intensity: <strong>0.16 kWh/m³</strong></div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                  Telemetry verified via cryptographic ESP32 hardware handshake over TLS MQTT.
                </div>
              </div>

              {exportMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{exportMessage}</span>
                </div>
              )}
            </div>

            {/* Export Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className="bg-[#123B55] hover:bg-[#1a4f73] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Export PDF
              </button>
              <button
                onClick={() => handleExport('csv')}
                disabled={isExporting}
                className="bg-[#21A6A0] hover:bg-[#1b8c87] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                Export CSV
              </button>
              <button
                onClick={() => handleExport('excel')}
                disabled={isExporting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                Export Excel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Hardware Devices */}
      {activeTab === 'devices' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Connected ESP32 Hardware Controllers</h3>
            <div className="space-y-3">
              {devices.map((dev) => (
                <div key={dev.deviceId} className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Cpu className="w-5 h-5 text-[#21A6A0]" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{dev.name}</h4>
                        <span className="text-[10px] font-mono text-slate-400">{dev.deviceId}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      {dev.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg font-mono text-[11px] text-slate-700">
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 block">IP Address</span>
                      <span className="font-bold">{dev.ipAddress}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 block">MAC Address</span>
                      <span className="font-bold">{dev.macAddress}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 block">Firmware</span>
                      <span className="font-bold">{dev.firmwareVersion}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 block">Power Supply</span>
                      <span className="font-bold">{dev.batteryOrPower}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 font-mono">
                    MQTT Topic: <span className="text-[#123B55] font-semibold">{dev.mqttTopic}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Register New Hardware Node Form */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#21A6A0]" />
              Register ESP32 Node
            </h3>
            <p className="text-xs text-slate-500">
              Provision a new physical telemetry node into the AquaTech broker topology.
            </p>

            <form onSubmit={handleRegisterDevice} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Device Name / Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Expansion Tank Node 3"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Subsystem Type</label>
                <select
                  value={newDeviceType}
                  onChange={(e) => setNewDeviceType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono"
                >
                  <option value="cooldrop">CoolDrop Condensate Subsystem</option>
                  <option value="purification">Sewage Water Purification Subsystem</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">MQTT Topic</label>
                <input
                  type="text"
                  value={newDeviceTopic}
                  onChange={(e) => setNewDeviceTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-700"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#123B55] hover:bg-[#1a4f73] text-white py-2 rounded-lg font-semibold text-xs transition"
              >
                Provision Hardware Controller
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Alert Thresholds */}
      {activeTab === 'thresholds' && (
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Configurable Transducer Safety Thresholds</h3>
          <p className="text-xs text-slate-500">
            Define critical alarm limits that automatically trigger visual alerts and solenoid diversion shutoffs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sensors.map((s) => (
              <div key={s.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">{s.name} ({s.id})</span>
                  <span className="font-mono text-slate-500 font-bold">{s.unit}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-mono block">Low Warning Alarm</label>
                    <input
                      type="number"
                      defaultValue={s.minSafe}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-mono text-xs text-slate-800 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-mono block">High Critical Alarm</label>
                    <input
                      type="number"
                      defaultValue={s.maxSafe}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-mono text-xs text-slate-800 mt-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Profiles & Units */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-[#21A6A0]" />
              Active Operator Profile
            </h3>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Operator Name:</span>
                <span className="font-bold">Lead Water Systems Engineer</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Access Role:</span>
                <span className="font-mono font-bold text-[#123B55] bg-blue-50 px-2 py-0.5 rounded">
                  Administrator / Exhibition Master
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Security Level:</span>
                <span className="font-mono text-[#65A875] font-bold">Hardware Provisioning Authorized</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#5CB6DC]" />
              Units & Measurement Preferences
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span>Volumetric Units</span>
                <span className="font-mono font-bold text-[#123B55] bg-slate-100 px-2 py-1 rounded">
                  Metric (Litres / m³)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Thermal Units</span>
                <span className="font-mono font-bold text-[#123B55] bg-slate-100 px-2 py-1 rounded">
                  Celsius (°C)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Data Sampling Rate</span>
                <span className="font-mono font-bold text-[#21A6A0] bg-slate-100 px-2 py-1 rounded">
                  2,500 ms (High Precision)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

