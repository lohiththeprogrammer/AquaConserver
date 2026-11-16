// AquaTech Types Definition

export type SystemStatus = 'online' | 'offline' | 'awaiting_connection' | 'warning' | 'error' | 'calibrating';

export type WaterQualityCategory = 'Category A' | 'Category B' | 'Category C' | 'Restricted';

export interface DeviceTelemetry {
  deviceId: string;
  name: string;
  type: 'cooldrop' | 'purification';
  status: SystemStatus;
  lastSeen: string;
  ipAddress: string;
  macAddress: string;
  mqttTopic: string;
  batteryOrPower: string;
  firmwareVersion: string;
}

export interface CoolDropTelemetry {
  collectionVolumeL: number;
  collectionRateLPerHr: number;
  tankCapacityL: number;
  tankFillPercentage: number;
  waterTemperatureC: number;
  ambientHumidityPct: number;
  ambientTemperatureC: number;
  leakDetected: boolean;
  overflowAlert: boolean;
  collectionEfficiencyPct: number;
  operatingHours: number;
  activeUnitsCount: number;
  totalCollectedLifetimeL: number;
}

export interface ACUnitStatus {
  id: string;
  name: string;
  location: string;
  status: 'running' | 'idle' | 'warning';
  collectionRateLPerHr: number;
  collectedTodayL: number;
  ambientTempC: number;
  humidityPct: number;
}

export type TreatmentStageId = 'screening' | 'sedimentation' | 'filtration' | 'adsorption' | 'disinfection' | 'verification';

export interface TreatmentStageInfo {
  id: TreatmentStageId;
  order: number;
  name: string;
  shortDesc: string;
  detailedDesc: string;
  status: 'active' | 'standby' | 'cleaning' | 'degraded';
  retentionTimeMinutes: number;
  efficiencyPct: number;
  mediaType: string;
  differentialPressureKPa: number;
  lastMaintenance: string;
}

export interface PurificationTelemetry {
  currentStage: TreatmentStageId;
  incomingVolumeL: number;
  outgoingTreatedVolumeL: number;
  flowRateLPerMin: number;
  pHSensor: number;
  turbidityNTU: number;
  temperatureC: number;
  conductivityMicroS: number;
  dissolvedOxygenMgL: number;
  filterConditionPct: number;
  treatmentDurationHrs: number;
  recoveryPercentage: number;
  safetyVerified: boolean;
  complianceStandard: string;
}

export interface SensorReading {
  id: string;
  name: string;
  key: string;
  category: 'CoolDrop' | 'Purification' | 'System';
  currentValue: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  minSafe: number;
  maxSafe: number;
  lastCalibrated: string;
  errorMarginPct: number;
  description: string;
}

export interface SystemEvent {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'alert' | 'success';
  module: string;
  message: string;
  acknowledged?: boolean;
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  subsystem: 'CoolDrop' | 'Purification' | 'Sensor Network';
  component: string;
  action: string;
  technician: string;
  status: 'completed' | 'scheduled' | 'overdue';
  notes: string;
}

export interface WaterAllocation {
  id: string;
  category: WaterQualityCategory;
  application: string;
  approvedQuality: boolean;
  allocatedLiters: number;
  usedTodayLiters: number;
  destination: string;
}

export interface AnomalyReport {
  id: string;
  detectedAt: string;
  severity: 'low' | 'medium' | 'high';
  subsystem: 'CoolDrop' | 'Purification';
  observation: string;
  rootCauseHypothesis: string;
  suggestedAction: string[];
  status: 'open' | 'investigating' | 'resolved';
}

export interface ExperimentScenario {
  id: string;
  name: string;
  description: string;
  acCondensationRate: number; // L/h
  acAmbientHumidity: number; // %
  wastewaterInflow: number; // L/min
  filterType: 'Sand+Gravel' | 'Multi-Media Dual' | 'Ultra-Adsorption Matrix';
  flowRateMultiplier: number; // 0.5x to 2x
  disinfectionIntensity: 'Low UV' | 'Standard UV-C' | 'Multi-Barrier Advanced';
}

