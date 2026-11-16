# AquaTech · Complete Application Platform (v1.0)
### Empowered by Google Gemini Multimodal Telemetry Intelligence

> **One platform. Two technologies. One water-recovery ecosystem.**  
> **Recover. Purify. Reuse.** Intelligent water conservation through connected engineering.

AquaTech is a web-based water management and educational platform connecting two independently operating physical engineering models:
1. **CoolDrop**: An air-conditioning condensate water collection system.
2. **Sewage Water Purification**: A multi-stage wastewater treatment and recovery system.

The application serves two purposes equally:
- **Engineering Dashboard**: Real-time sensor monitoring, multi-stream telemetry, anomaly detection, predictive maintenance, and quality gate verification.
- **Interactive Presentation & Exhibition**: 3D Cyber-Physical Digital Twin (WebGL/Three.js), interactive simulation lab, psychrometric condensation science explanations, and interactive quizzes.

---

## 🌟 Google Gemini AI Integration (Crucial Architecture)

Google Gemini is integrated deeply throughout the entire platform as a real-time autonomous systems engineer:

```
┌────────────────────────────────────────────────────────┐
│               LIVE SENSOR TRANSDUCERS                  │
│ CoolDrop (L/h, tank %) · Purification (NTU, pH, EC, UV)│
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│       AQUATECH TELEMETRY INJECTION PIPELINE            │
│  Serializes live physical metrics into context prompt  │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│            GOOGLE GEMINI 2.5 / 2.0 FLASH               │
│   Official Google Generative Language API Endpoint     │
└──────────────────────────┬─────────────────────────────┘
                           │
            ┌──────────────┴──────────────┐
            ▼                             ▼
┌─────────────────────────┐  ┌──────────────────────────┐
│ GLOBAL COPILOT DRAWER   │  │ SPECIALIZED OPERATORS    │
│ Slide-out on all screens│  │ • Plant Executive Brief  │
│ Multi-turn live dialogue│  │ • Deep Anomaly Auditor   │
│ One-click instant audits│  │ • Lab Scenario Critique  │
│ Safe non-potable checks │  │ • Reallocation Advisor   │
└─────────────────────────┘  └──────────────────────────┘
```

### Key Gemini Features Across Modules:
1. **Global Gemini Copilot Drawer** (`GeminiFloatingCopilot.tsx`): Persistent in the bottom-right corner of every screen. Injects current hardware state into every prompt with 1-click suggested actions.
2. **Gemini Key & Model Manager** (`GeminiKeyModal.tsx`): Accessible directly from the top header with a live status pill. Supports `gemini-2.5-flash`, `gemini-2.0-flash`, and `gemini-1.5-flash` with instant connection test and local encrypted persistence.
3. **Module 01 (Overview)**: *Google Gemini Autonomous Plant Briefing* generates real-time executive summaries for plant managers.
4. **Module 04 (Water Management)**: *Gemini Autonomous Reallocation Advisor* balances distribution between Category A (irrigation), Category B (toilet flushing), and Category C (cleaning).
5. **Module 07 (AI Intelligence)**: *Gemini Automated Engineering Audit* performs multi-step diagnostic reasoning over the 28% CoolDrop flow drop and filter differential pressure.
6. **Module 10 (Interactive Lab)**: *Gemini Co-Investigator Simulation Critique* evaluates simulated virtual outcomes and calculates thermodynamic efficiencies.

---

## Brand Identity & Design System

- **Navy (`#123B55` / `#0B2333`)**: Industrial frame, navigation sidebar, and structural contrast.
- **Teal (`#21A6A0`)**: Water recovery highlights and active efficiency metrics.
- **Blue (`#5CB6DC`)**: Fluid dynamics, AC condensate indicators, and flow waveforms.
- **Green (`#65A875`)**: Quality verification pass, healthy status indicators, and sustainability metrics.
- **Purple & Gold Accents**: Highlighting Google Gemini Generative Intelligence features.

---

## 12 Main Application Modules

| No. | Module | Key Features & Implementation |
|---|---|---|
| **01** | **Overview** | System-level KPI cards, live telemetry streams, combined recovery yield ($V_{\text{total}} = V_{\text{CoolDrop}} + V_{\text{treated}}$), dual-node status, Gemini executive brief, and 6-stage pipeline summary. |
| **02** | **CoolDrop** | AC condensate volume (L), flow rate (L/h), 250L tank level gauge with visual fluid wave, active HVAC units (Server Room, Auditorium, Chem Lab, Pavilion), and psychrometric yield formulas. |
| **03** | **Purification** | Visual interactive 6-stage multi-barrier flow (Screening, Sedimentation, Filtration, Adsorption, UV Disinfection, Verification), inline pH (7.24), turbidity (0.88 NTU), EC, and safety compliance banners. |
| **04** | **Water Management** | Dual-stream segregated storage (demineralized condensate vs disinfected secondary water), Gemini reallocation advisor, reuse allocation matrix (Category A irrigation, B flushing, C cleaning, Restricted potable), and solenoid dispatch gate. |
| **05** | **Live Monitoring** | Real-time transducer stream (7 sensors), waveform charts, interactive calibration offset adjustment modal, and downloadable CSV telemetry. |
| **06** | **Analytics & Statistics** | Mathematical recovery formulas, specific energy intensity ($\text{kWh/m}^3$), reuse rate %, dual-axis composed charts, and mass-balance accounting. |
| **07** | **AI Intelligence** | Rule-based and Google Gemini anomaly detection, predictive maintenance countdowns, heuristic root-cause hypotheses, and an interactive Gemini Copilot Console. |
| **08** | **Digital Twin** | 3D WebGL / Three.js cyber-physical model featuring animated AC condensation droplets, translucent fluid levels, illuminated UV-C quartz chambers, and interactive component inspection. |
| **09** | **Environmental Impact** | Municipal freshwater avoided, actual water reused, specific energy intensity, financial utility savings ($), and UN SDG 6 Scorecard (Targets 6.3 & 6.4). |
| **10** | **Interactive Lab** | Visitor sandbox with parameter sliders (AC rate, inflow volume, filter media type, disinfection method), preset weather scenarios, Gemini lab critique, live response curves, and downloadable experiment reports. |
| **11** | **Learning Centre** | Educational exhibition covering dew point condensation thermodynamics, multi-stage separation physics, IoT transducer electronics, interactive 4-question quiz with score validation, and glossary. |
| **12** | **Reports & Settings** | Multi-format reporting engine (PDF preview, CSV, Excel), ESP32 hardware registration, configurable threshold alarm limits, operator roles, and unit preferences. |

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 LAYER 4: WEB APPLICATION                     │
│  React 18 · TypeScript · Tailwind CSS · Recharts · Three.js │
│  + Google Gemini 2.5 Flash Autonomous Generative Copilot    │
└──────────────────────────────┬──────────────────────────────┘
                               │ WebSocket & REST API
┌──────────────────────────────┴──────────────────────────────┐
│                 LAYER 3: BACKEND & CLOUD                     │
│  FastAPI (Python 3.12) · PostgreSQL 16 · MQTT Broker (TLS)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ MQTT Telemetry (JSON)
           ┌───────────────────┴───────────────────┐
           │                                       │
┌──────────▼───────────┐               ┌───────────▼──────────┐
│ ESP32 CONTROLLER A   │               │ ESP32 CONTROLLER B   │
│ CoolDrop Hub         │               │ Purification Hub     │
│ - Tank Level Trans.  │               │ - Optical Turbidity  │
│ - Hall Flow Sensor   │               │ - Combination pH     │
│ - DS18B20 Temp Probe │               │ - DS18B20 Temp       │
│ - Leak Grid Trans.   │               │ - Flow Pulse Meter   │
└──────────────────────┘               └──────────────────────┘
```

---

## Quick Start & Verification

### 1. Launching the Web Application
```bash
# Start Vite development server
npm run dev

# Or test production build
npm run build
```
Open **`http://localhost:3000`** in any web browser.

### 2. Enabling Real Google Gemini API
1. In the application header, click the purple **`Connect Gemini AI`** badge (or open the Gemini Copilot in the bottom right corner).
2. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3. Paste the key and click **Save Configuration**.
4. The copilot immediately switches to **Gemini 2.5 Active** and begins answering queries using live sensor readings!

### 3. Optional: Running the FastAPI Backend
```bash
cd backend
pip install fastapi uvicorn pydantic
uvicorn main:app --reload --port 8000
```
API Documentation will be accessible at `http://localhost:8000/docs`.

### 4. Physical Hardware Telemetry
- Flash `firmware/esp32_cooldrop/esp32_cooldrop.ino` to the CoolDrop ESP32.
- Flash `firmware/esp32_purification/esp32_purification.ino` to the Purification ESP32.
- Toggle between **Demo Telemetry** (built-in live simulation engine) and **Hardware Link** directly in the top header.

---

## Safety & Standards Disclaimer
*AquaTech is an educational and pilot engineering demonstration platform. Monitoring indicators and automated gates do not constitute certified potable water certification. Direct human drinking or food preparation without formal municipal laboratory certification is strictly classified as Restricted.*
