import {
  CoolDropTelemetry,
  PurificationTelemetry,
  DeviceTelemetry,
  SensorReading,
  TreatmentStageInfo,
  ACUnitStatus,
  SystemEvent,
  MaintenanceRecord,
  WaterAllocation,
  AnomalyReport,
  ExperimentScenario
} from '../types';

export const initialCoolDrop: CoolDropTelemetry = {
  collectionVolumeL: 142.8,
  collectionRateLPerHr: 6.4,
  tankCapacityL: 250,
  tankFillPercentage: 57.1,
  waterTemperatureC: 19.8,
  ambientHumidityPct: 68,
  ambientTemperatureC: 31.5,
  leakDetected: false,
  overflowAlert: false,
  collectionEfficiencyPct: 92.4,
  operatingHours: 148.5,
  activeUnitsCount: 4,
  totalCollectedLifetimeL: 3840.5,
};

export const initialPurification: PurificationTelemetry = {
  currentStage: 'filtration',
  incomingVolumeL: 215.0,
  outgoingTreatedVolumeL: 189.2,
  flowRateLPerMin: 2.1,
  pHSensor: 7.24,
  turbidityNTU: 0.88,
  temperatureC: 22.4,
  conductivityMicroS: 312,
  dissolvedOxygenMgL: 6.8,
  filterConditionPct: 86.5,
  treatmentDurationHrs: 18.2,
  recoveryPercentage: 88.0,
  safetyVerified: true,
  complianceStandard: 'ISO 24510 / WHO Non-Potable Guidelines',
};

export const initialDevices: DeviceTelemetry[] = [
  {
    deviceId: 'ESP32-CD-01',
    name: 'CoolDrop ESP32 Master Hub',
    type: 'cooldrop',
    status: 'online',
    lastSeen: 'Just now',
    ipAddress: '192.168.1.104',
    macAddress: '24:0A:C4:88:2E:1A',
    mqttTopic: 'aquatech/cooldrop/sensors',
    batteryOrPower: '5.1V / 1.2A DC Grid',
    firmwareVersion: 'v2.4.1-rc3'
  },
  {
    deviceId: 'ESP32-PUR-02',
    name: 'Purification Process Unit',
    type: 'purification',
    status: 'online',
    lastSeen: 'Just now',
    ipAddress: '192.168.1.105',
    macAddress: '30:AE:A4:91:5F:8B',
    mqttTopic: 'aquatech/purification/sensors',
    batteryOrPower: '12V / 3.0A Regulated',
    firmwareVersion: 'v2.4.2'
  }
];

export const acUnitsData: ACUnitStatus[] = [
  {
    id: 'AC-01',
    name: 'Main Server Room (High Duty)',
    location: 'Engineering Wing 101',
    status: 'running',
    collectionRateLPerHr: 2.6,
    collectedTodayL: 44.2,
    ambientTempC: 32.2,
    humidityPct: 74
  },
  {
    id: 'AC-02',
    name: 'Auditorium Split Unit A',
    location: 'Central Hall',
    status: 'running',
    collectionRateLPerHr: 1.8,
    collectedTodayL: 31.6,
    ambientTempC: 30.1,
    humidityPct: 65
  },
  {
    id: 'AC-03',
    name: 'Chemistry Lab HVAC 4',
    location: 'Science Block B',
    status: 'running',
    collectionRateLPerHr: 1.2,
    collectedTodayL: 22.4,
    ambientTempC: 28.5,
    humidityPct: 62
  },
  {
    id: 'AC-04',
    name: 'Exhibition Pavilion Unit',
    location: 'AquaTech Showcase Gallery',
    status: 'running',
    collectionRateLPerHr: 0.8,
    collectedTodayL: 14.6,
    ambientTempC: 27.0,
    humidityPct: 58
  }
];

export const treatmentStages: TreatmentStageInfo[] = [
  {
    id: 'screening',
    order: 1,
    name: 'Preliminary Screening',
    shortDesc: 'Physical separation of coarse suspended debris and large particulate matter.',
    detailedDesc: 'Gravity-fed stainless steel micro-mesh screen (500 micron) removes macroscopic solids and hair before entering settling stages.',
    status: 'active',
    retentionTimeMinutes: 5,
    efficiencyPct: 99.2,
    mediaType: '316L Stainless Steel Dual-Mesh',
    differentialPressureKPa: 2.1,
    lastMaintenance: '2026-11-10'
  },
  {
    id: 'sedimentation',
    order: 2,
    name: 'Lamella Sedimentation',
    shortDesc: 'Density settling using inclined plates to isolate dense flocculated particles.',
    detailedDesc: 'Utilizes angled lamella clarifier plates to accelerate gravitational settling velocity of suspended solids into bottom sludge cone.',
    status: 'active',
    retentionTimeMinutes: 25,
    efficiencyPct: 88.5,
    mediaType: 'Polypropylene Inclined Settling Plates',
    differentialPressureKPa: 1.8,
    lastMaintenance: '2026-11-08'
  },
  {
    id: 'filtration',
    order: 3,
    name: 'Multi-Media Depth Filtration',
    shortDesc: 'Layered granular media targeting colloidal turbidity and particulate matter.',
    detailedDesc: 'Graduated layers of anthracite coal, quartz silica sand, and garnet media trap fine suspended solids down to 5-10 microns.',
    status: 'active',
    retentionTimeMinutes: 18,
    efficiencyPct: 94.1,
    mediaType: 'Anthracite / Silica / Garnet Bed',
    differentialPressureKPa: 14.6,
    lastMaintenance: '2026-11-12'
  },
  {
    id: 'adsorption',
    order: 4,
    name: 'Activated Carbon Adsorption',
    shortDesc: 'Porous carbon matrix removes dissolved organics, chlorine & odor.',
    detailedDesc: 'Coconut-shell granular activated carbon (GAC) with 1100 m²/g surface area adsorbs surfactants, volatile organic chemicals and odors.',
    status: 'active',
    retentionTimeMinutes: 15,
    efficiencyPct: 96.0,
    mediaType: 'Acid-Washed Coconut Shell GAC',
    differentialPressureKPa: 18.2,
    lastMaintenance: '2026-11-05'
  },
  {
    id: 'disinfection',
    order: 5,
    name: 'UV-C Photolytic Disinfection',
    shortDesc: 'Germicidal 254nm ultraviolet irradiation inactivates pathogenic bacteria and viruses.',
    detailedDesc: 'High-output low-pressure amalgamation lamp delivers >40 mJ/cm² UV dosage, disrupting microbial DNA without chemical residues.',
    status: 'active',
    retentionTimeMinutes: 2,
    efficiencyPct: 99.9,
    mediaType: 'Quartz Sleeve 254nm UV Chamber',
    differentialPressureKPa: 0.8,
    lastMaintenance: '2026-11-14'
  },
  {
    id: 'verification',
    order: 6,
    name: 'Quality Verification & Polishing',
    shortDesc: 'Multi-parametric inline sensor check and non-potable distribution gate.',
    detailedDesc: 'Optical turbidity, pH, electrical conductivity and ORP sensors assess compliance before automated diversion valve enables reuse tanks.',
    status: 'active',
    retentionTimeMinutes: 3,
    efficiencyPct: 100,
    mediaType: 'Digital Sensor Flow Cell + Diverter',
    differentialPressureKPa: 0.4,
    lastMaintenance: '2026-11-15'
  }
];

export const initialSensors: SensorReading[] = [
  {
    id: 'SNS-LVL-01',
    name: 'CoolDrop Tank Level',
    key: 'tank_level_cooldrop',
    category: 'CoolDrop',
    currentValue: 57.1,
    unit: '%',
    status: 'normal',
    minSafe: 10,
    maxSafe: 90,
    lastCalibrated: '2026-11-01',
    errorMarginPct: 0.8,
    description: 'Hydrostatic pressure level transducer in 250L storage tank'
  },
  {
    id: 'SNS-FLW-01',
    name: 'AC Condensate Inflow',
    key: 'flow_cooldrop',
    category: 'CoolDrop',
    currentValue: 6.4,
    unit: 'L/h',
    status: 'normal',
    minSafe: 0.5,
    maxSafe: 15.0,
    lastCalibrated: '2026-11-02',
    errorMarginPct: 1.2,
    description: 'Micro-turbine Hall effect pulse counter on condensate collector'
  },
  {
    id: 'SNS-TMP-01',
    name: 'Condensate Temperature',
    key: 'temp_cooldrop',
    category: 'CoolDrop',
    currentValue: 19.8,
    unit: '°C',
    status: 'normal',
    minSafe: 12.0,
    maxSafe: 28.0,
    lastCalibrated: '2026-10-28',
    errorMarginPct: 0.3,
    description: 'DS18B20 digital waterproof thermal probe'
  },
  {
    id: 'SNS-PH-02',
    name: 'Purification Water pH',
    key: 'ph_purification',
    category: 'Purification',
    currentValue: 7.24,
    unit: 'pH',
    status: 'normal',
    minSafe: 6.5,
    maxSafe: 8.5,
    lastCalibrated: '2026-11-14',
    errorMarginPct: 0.05,
    description: 'Combination glass bulb industrial pH electrode with BNC transmitter'
  },
  {
    id: 'SNS-TRB-02',
    name: 'Effluent Turbidity',
    key: 'turbidity_purification',
    category: 'Purification',
    currentValue: 0.88,
    unit: 'NTU',
    status: 'normal',
    minSafe: 0.0,
    maxSafe: 5.0,
    lastCalibrated: '2026-11-12',
    errorMarginPct: 2.0,
    description: '90° nephelometric infrared light scattering sensor'
  },
  {
    id: 'SNS-CND-02',
    name: 'Electrical Conductivity',
    key: 'conductivity_purification',
    category: 'Purification',
    currentValue: 312,
    unit: 'µS/cm',
    status: 'normal',
    minSafe: 50,
    maxSafe: 800,
    lastCalibrated: '2026-11-11',
    errorMarginPct: 1.5,
    description: 'Titanium pin toroidal EC probe measuring dissolved mineral salts'
  },
  {
    id: 'SNS-FLW-02',
    name: 'Purification Stage Flow',
    key: 'flow_purification',
    category: 'Purification',
    currentValue: 2.1,
    unit: 'L/min',
    status: 'normal',
    minSafe: 0.8,
    maxSafe: 4.5,
    lastCalibrated: '2026-11-05',
    errorMarginPct: 1.0,
    description: 'Electromagnetic inline flowmeter in UV disinfection loop'
  },
  {
    id: 'SNS-PWR-03',
    name: 'Total System Power',
    key: 'power_system',
    category: 'System',
    currentValue: 78.4,
    unit: 'W',
    status: 'normal',
    minSafe: 20,
    maxSafe: 180,
    lastCalibrated: '2026-10-15',
    errorMarginPct: 0.5,
    description: 'PZEM-004T multi-channel AC current & energy monitor'
  }
];

export const waterAllocations: WaterAllocation[] = [
  {
    id: 'ALLOC-01',
    category: 'Category A',
    application: 'Campus Botanical Gardens & Drip Irrigation',
    approvedQuality: true,
    allocatedLiters: 160.0,
    usedTodayLiters: 114.5,
    destination: 'Landscape Holding Cistern 1'
  },
  {
    id: 'ALLOC-02',
    category: 'Category B',
    application: 'Dual-Plumbed Toilet Flushing System',
    approvedQuality: true,
    allocatedLiters: 140.0,
    usedTodayLiters: 98.2,
    destination: 'Engineering Block Gravity Header Tank'
  },
  {
    id: 'ALLOC-03',
    category: 'Category C',
    application: 'Solar Panel & Exterior Façade Cleaning',
    approvedQuality: true,
    allocatedLiters: 65.0,
    usedTodayLiters: 42.0,
    destination: 'Facilities Utility Pressure Cart'
  },
  {
    id: 'ALLOC-04',
    category: 'Restricted',
    application: 'Drinking Water & Direct Food Preparation',
    approvedQuality: false,
    allocatedLiters: 0,
    usedTodayLiters: 0,
    destination: 'Isolated / Prohibited without Municipal Potable Certification'
  }
];

export const anomalyReports: AnomalyReport[] = [
  {
    id: 'ANOM-2026-08',
    detectedAt: '2026-11-16 11:42 AM',
    severity: 'medium',
    subsystem: 'CoolDrop',
    observation: 'CoolDrop condensate collection rate dropped 28% relative to ambient psychrometric baseline.',
    rootCauseHypothesis: 'Partial bio-film buildup in gravity collection trap or altered HVAC fan speed schedule in Hall A.',
    suggestedAction: [
      'Inspect condensate tray drain siphon for sediment blockage',
      'Verify AC-02 evaporator coil surface temperature reading',
      'Check micro-turbine pulse calibration on line #2'
    ],
    status: 'open'
  },
  {
    id: 'ANOM-2026-05',
    detectedAt: '2026-11-15 03:15 PM',
    severity: 'low',
    subsystem: 'Purification',
    observation: 'Differential pressure across Multi-Media filter rose by +3.2 kPa over 48 hours.',
    rootCauseHypothesis: 'Natural suspended solid accumulation in upper anthracite bed requiring scheduled backwash.',
    suggestedAction: [
      'Execute automatic 4-minute hydraulic backwash cycle',
      'Inspect backwash effluent turbidity before returning to service'
    ],
    status: 'investigating'
  }
];

export const maintenanceHistory: MaintenanceRecord[] = [
  {
    id: 'MNT-104',
    date: '2026-11-14',
    subsystem: 'Purification',
    component: 'UV-C Disinfection Lamp',
    action: 'Quartz sleeve wiped with isopropyl alcohol; UV intensity validated at 98.4%',
    technician: 'L. Chen (Senior Lab Tech)',
    status: 'completed',
    notes: 'Lamp hours: 1,420 hrs / 10,000 hrs rating.'
  },
  {
    id: 'MNT-103',
    date: '2026-11-12',
    subsystem: 'CoolDrop',
    component: 'Storage Tank Level Transmitter',
    action: 'Zero-point recalibration at empty tank condition',
    technician: 'K. Patel (IoT Eng)',
    status: 'completed',
    notes: 'Offset drift corrected by -0.4% FS.'
  },
  {
    id: 'MNT-102',
    date: '2026-11-08',
    subsystem: 'Purification',
    component: 'Activated Carbon Pre-Filter',
    action: 'GAC media bed visual inspection and differential pressure audit',
    technician: 'M. Gomez (Water Quality Analyst)',
    status: 'completed',
    notes: 'Media bed healthy. Next carbon change scheduled in 4 months.'
  },
  {
    id: 'MNT-105',
    date: '2026-11-22',
    subsystem: 'Purification',
    component: 'Lamella Clarifier Sludge Purge',
    action: 'Automated bottom valve purge of accumulated sediment floc',
    technician: 'System Auto-Routine',
    status: 'scheduled',
    notes: 'Programmed to execute during low-demand night hours.'
  }
];

export const recentSystemEvents: SystemEvent[] = [
  {
    id: 'EVT-501',
    timestamp: '16:58:12',
    level: 'info',
    module: 'CoolDrop',
    message: 'Storage Tank 1 reached 57% fill threshold. Auto-diversion pump on standby.'
  },
  {
    id: 'EVT-500',
    timestamp: '16:45:00',
    level: 'success',
    module: 'Purification',
    message: 'Inline water quality verified: Turbidity 0.88 NTU, pH 7.24 (Standards compliant).'
  },
  {
    id: 'EVT-499',
    timestamp: '16:30:22',
    level: 'info',
    module: 'IoT Gateway',
    message: 'ESP32 telemetry heartbeat received via MQTT broker (latency 14ms).'
  },
  {
    id: 'EVT-498',
    timestamp: '15:10:44',
    level: 'warning',
    module: 'AI Analytics',
    message: 'Condensate efficiency advisory triggered: High ambient humidity detected (74%).'
  },
  {
    id: 'EVT-497',
    timestamp: '14:00:15',
    level: 'success',
    module: 'Water Management',
    message: 'Transferred 85 L treated effluent to Botanical Drip Irrigation network.'
  }
];

export const hourlyTrendData = [
  { time: '08:00', coolDropL: 4.8, treatedL: 18.0, totalL: 22.8, energyKwh: 0.12, efficiency: 91 },
  { time: '09:00', coolDropL: 5.4, treatedL: 22.4, totalL: 27.8, energyKwh: 0.14, efficiency: 92 },
  { time: '10:00', coolDropL: 6.2, treatedL: 24.1, totalL: 30.3, energyKwh: 0.15, efficiency: 94 },
  { time: '11:00', coolDropL: 6.9, treatedL: 26.5, totalL: 33.4, energyKwh: 0.16, efficiency: 93 },
  { time: '12:00', coolDropL: 7.4, treatedL: 28.0, totalL: 35.4, energyKwh: 0.17, efficiency: 95 },
  { time: '13:00', coolDropL: 7.8, treatedL: 29.2, totalL: 37.0, energyKwh: 0.18, efficiency: 94 },
  { time: '14:00', coolDropL: 7.5, treatedL: 27.8, totalL: 35.3, energyKwh: 0.17, efficiency: 93 },
  { time: '15:00', coolDropL: 6.8, treatedL: 25.4, totalL: 32.2, energyKwh: 0.16, efficiency: 92 },
  { time: '16:00', coolDropL: 6.4, treatedL: 23.0, totalL: 29.4, energyKwh: 0.15, efficiency: 93 },
  { time: '17:00', coolDropL: 5.9, treatedL: 21.2, totalL: 27.1, energyKwh: 0.13, efficiency: 91 },
];

export const weeklyComparisonData = [
  { day: 'Mon', coolDrop: 42, treated: 195, total: 237, target: 220 },
  { day: 'Tue', coolDrop: 48, treated: 210, total: 258, target: 220 },
  { day: 'Wed', coolDrop: 51, treated: 205, total: 256, target: 220 },
  { day: 'Thu', coolDrop: 46, treated: 198, total: 244, target: 220 },
  { day: 'Fri', coolDrop: 54, treated: 220, total: 274, target: 220 },
  { day: 'Sat', coolDrop: 38, treated: 140, total: 178, target: 160 },
  { day: 'Sun', coolDrop: 35, treated: 125, total: 160, target: 150 },
];

export const labPresets: ExperimentScenario[] = [
  {
    id: 'preset-1',
    name: 'High Humidity Peak Summer',
    description: 'Models humid 34°C weather at 80% RH with maximum AC condensing output.',
    acCondensationRate: 10.5,
    acAmbientHumidity: 82,
    wastewaterInflow: 3.2,
    filterType: 'Multi-Media Dual',
    flowRateMultiplier: 1.2,
    disinfectionIntensity: 'Standard UV-C'
  },
  {
    id: 'preset-2',
    name: 'Heavy Wastewater Turbidity Shock',
    description: 'Simulates highly turbid industrial greywater surge testing lamella clarifier limits.',
    acCondensationRate: 4.5,
    acAmbientHumidity: 55,
    wastewaterInflow: 4.8,
    filterType: 'Ultra-Adsorption Matrix',
    flowRateMultiplier: 1.5,
    disinfectionIntensity: 'Multi-Barrier Advanced'
  },
  {
    id: 'preset-3',
    name: 'Eco-Conservation Low-Energy Mode',
    description: 'Optimizes pump frequencies and pulsed UV exposure to minimize energy intensity per m³.',
    acCondensationRate: 6.0,
    acAmbientHumidity: 65,
    wastewaterInflow: 1.8,
    filterType: 'Sand+Gravel',
    flowRateMultiplier: 0.8,
    disinfectionIntensity: 'Standard UV-C'
  }
];

export const learningLessons = [
  {
    id: 'lesson-1',
    title: 'The Science of AC Condensate: Turning Humidity into Water',
    category: 'Thermodynamics & Meteorology',
    readTime: '4 min',
    summary: 'Why air conditioners produce clean distilled water and how psychrometric dew point physics governs the collection rate.',
    content: `
### Atmospheric Moisture and Heat Exchange
Air conditioning works by drawing warm, humid air across an evaporator coil chilled with refrigerant. As air temperature falls below its **dew point temperature** ($T_{dp}$), water vapor in the atmosphere undergoes an exothermic phase transition from gas to liquid droplets.

$$m_{\text{condensate}} = \dot{m}_{\text{air}} \cdot (\omega_{\text{in}} - \omega_{\text{out}})$$

Where:
- $\dot{m}_{\text{air}}$ is mass flow rate of treated air
- $\omega_{\text{in}}$ and $\omega_{\text{out}}$ are inlet and outlet humidity ratios ($kg_{water} / kg_{dry\_air}$)

### Chemical Properties of AC Condensate
Condensate water originates from atmospheric moisture condensation, meaning it is naturally **low in total dissolved solids (TDS)** and almost mineral-free (similar to distilled rain). However, because airborne dust and microbial matter can settle on cooling fins, CoolDrop integrates dedicated particulate traps and prevents stagnation.
    `
  },
  {
    id: 'lesson-2',
    title: 'Wastewater Multi-Barrier Treatment Architecture',
    category: 'Environmental Engineering',
    readTime: '6 min',
    summary: 'A step-by-step breakdown of how physical separation, deep-bed media, adsorption, and UV radiation purify greywater.',
    content: `
### Why Multi-Stage Separation is Essential
Municipal and institutional wastewater contains three major classes of impurities:
1. **Suspended Solids**: Heavy particles that settle or foul fine equipment.
2. **Dissolved Organics & Surfactants**: Soap, fats, and chemical residues that induce foaming or odor.
3. **Microorganisms**: Coliforms, bacteria, and viral pathogens.

No single process eliminates all three safely. AquaTech applies a sequential physical-chemical barrier chain:
1. **Screening (500 µm)**: Removes macroscopic fibres.
2. **Sedimentation**: Inclined lamella clarifier plates enhance settling velocity via Hazen's sedimentation theory.
3. **Filtration**: Depth media with multi-density anthracite and silica sand traps colloids.
4. **Adsorption**: Activated carbon pores (1-2 nm) bind organic molecules and eliminate odors via van der Waals forces.
5. **UV-C Photolysis (254 nm)**: Thymine dimerization in microbial DNA destroys reproductive capability without chemical chlorination by-products.
    `
  },
  {
    id: 'lesson-3',
    title: 'IoT Telemetry: ESP32, Sensors & Industrial Protocols',
    category: 'IoT & Embedded Systems',
    readTime: '5 min',
    summary: 'How low-power microcontrollers reliably acquire analog transducer signals, handle calibration curves, and stream MQTT telemetry.',
    content: `
### Sensor Interfacing
The AquaTech physical engineering models use high-accuracy industrial sensors coupled to ESP32 32-bit dual-core microcontrollers:
- **Hydrostatic Level Sensor**: Translates column water pressure ($P = \rho \cdot g \cdot h$) into a linear 4-20mA or 0-3.3V signal.
- **Turbidity Sensor**: Uses an infrared LED and phototransistor at a 90° angle. As suspended particles scatter the light beam (Tyndall effect), the voltage drop is converted to Nephelometric Turbidity Units (NTU).
- **pH Glass Electrode**: Generates a Nernst potential ($E = E_0 - \frac{2.303 RT}{F} \cdot pH$) of approximately 59.16 mV per pH unit at 25°C.

### MQTT Real-time Data Pipeline
ESP32 transmits structured JSON telemetry via lightweight MQTT pub/sub over Wi-Fi. The cloud backend parses, validates against engineering safety limits, stores in PostgreSQL, and pushes real-time WebSocket payloads to the React dashboard.
    `
  }
];

export const quizQuestions = [
  {
    id: 'q1',
    question: 'Why does an air conditioner produce condensate water during cooling operation?',
    options: [
      'Warm humid air cools below its dew point across the evaporator coil, causing water vapor to condense into liquid',
      'The refrigerant chemical breaks down into water molecules inside the ductwork',
      'The compressor produces water as a chemical byproduct of electrical friction',
      'External rainwater is sucked into the indoor condenser unit'
    ],
    correctIndex: 0,
    explanation: 'When warm room air passes over cold evaporator coils, its temperature drops below the dew point, forcing atmospheric moisture to condense.'
  },
  {
    id: 'q2',
    question: 'What is the primary role of Activated Carbon in the wastewater treatment chain?',
    options: [
      'To physically crush large gravel stones',
      'To adsorb dissolved organic compounds, surfactants, odors, and chlorine residues',
      'To increase the salt content and electrical conductivity of the water',
      'To cool down the water temperature by 10°C'
    ],
    correctIndex: 1,
    explanation: 'Activated carbon possesses a vast internal microscopic pore surface area (over 1,000 m²/g) that attracts and traps organic molecules through adsorption.'
  },
  {
    id: 'q3',
    question: 'Can treated non-potable wastewater be safely distributed directly for drinking without certified municipal potable certification?',
    options: [
      'Yes, any filtered water is automatically 100% potable',
      'No, drinking water strictly requires regulatory certification and specialized potabilization barriers; AquaTech classifies direct drinking as Restricted',
      'Yes, as long as the pH is exactly 7.0',
      'Yes, if it passes through two sand filters'
    ],
    correctIndex: 1,
    explanation: 'Non-potable reuse guidelines strictly prohibit using secondary treated water for drinking or food preparation without specialized municipal potable certification.'
  },
  {
    id: 'q4',
    question: 'What mathematical formula calculates the Total Water Recovered across both engineering models?',
    options: [
      'V_total = V_CoolDrop × V_treated',
      'V_total = V_CoolDrop + V_treated',
      'V_total = V_CoolDrop - V_treated',
      'V_total = (V_CoolDrop + V_treated) / 100'
    ],
    correctIndex: 1,
    explanation: 'Total recovered water is the sum of condensate collected by CoolDrop plus treated wastewater from the purification system: V_total = V_CoolDrop + V_treated.'
  }
];

