import React from 'react';
import { useAquaTech, ModuleKey } from './context/AquaTechContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { GeminiFloatingCopilot } from './components/gemini/GeminiFloatingCopilot';
import { GeminiKeyModal } from './components/gemini/GeminiKeyModal';

// 12 Modules
import { OverviewDashboard } from './modules/Module01Overview/OverviewDashboard';
import { CoolDropView } from './modules/Module02CoolDrop/CoolDropView';
import { PurificationView } from './modules/Module03Purification/PurificationView';
import { WaterManagementView } from './modules/Module04WaterManagement/WaterManagementView';
import { LiveMonitoringView } from './modules/Module05LiveMonitoring/LiveMonitoringView';
import { AnalyticsView } from './modules/Module06Analytics/AnalyticsView';
import { AIIntelligenceView } from './modules/Module07AIIntelligence/AIIntelligenceView';
import { DigitalTwinView } from './modules/Module08DigitalTwin/DigitalTwinView';
import { EnvironmentalImpactView } from './modules/Module09EnvironmentalImpact/EnvironmentalImpactView';
import { InteractiveLabView } from './modules/Module10InteractiveLab/InteractiveLabView';
import { LearningCentreView } from './modules/Module11LearningCentre/LearningCentreView';
import { ReportsSettingsView } from './modules/Module12ReportsSettings/ReportsSettingsView';

const moduleMeta: Record<ModuleKey, { title: string; subtitle: string }> = {
  overview: {
    title: 'Overview Dashboard',
    subtitle: 'Unified System Performance, Recovery Volumes & Physical Model Connectivity'
  },
  cooldrop: {
    title: 'CoolDrop Subsystem',
    subtitle: 'Air-Conditioning Condensate Water Collection & Hydrostatic Tank Telemetry'
  },
  purification: {
    title: 'Sewage Water Purification',
    subtitle: '6-Stage Wastewater Treatment, Quality Assurance Sensor Array & Clarification'
  },
  'water-management': {
    title: 'Smart Water Management',
    subtitle: 'Segregated Dual-Stream Inventory, Multi-Tier Allocation & Non-Potable Balancing'
  },
  'live-monitoring': {
    title: 'Live Telemetry & Sensors',
    subtitle: 'Real-time Transducer Feeds, ADC Linearization, Error Margins & Calibrations'
  },
  analytics: {
    title: 'Analytics & Process Statistics',
    subtitle: 'Mathematical Recovery Formulations, Energy Intensity & Mass-Balance Dynamics'
  },
  'ai-intelligence': {
    title: 'AI Intelligence & Diagnostics',
    subtitle: 'Rule-Based Anomaly Detection, Predictive Maintenance & Google Gemini Copilot'
  },
  'digital-twin': {
    title: 'Cyber-Physical Digital Twin',
    subtitle: '3D WebGL Virtual Representation of Connected Engineering Models'
  },
  'environmental-impact': {
    title: 'Environmental & Economic Impact',
    subtitle: 'Freshwater Extraction Avoidance, Specific Energy Demand & Cost Offsets'
  },
  'interactive-lab': {
    title: 'Interactive Simulation Laboratory',
    subtitle: 'Virtual Boundary Condition Sandbox for Demonstration & Comparative Analysis'
  },
  'learning-centre': {
    title: 'Science & Learning Centre',
    subtitle: 'Thermodynamics of Condensation, Multi-Barrier Engineering & Interactive Quizzes'
  },
  'reports-settings': {
    title: 'Reports & System Configuration',
    subtitle: 'Audit Reporting Exports, Hardware Node Management & Calibration Offsets'
  }
};

export const App: React.FC = () => {
  const { activeModule } = useAquaTech();
  const currentMeta = moduleMeta[activeModule] || moduleMeta['overview'];

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'overview':
        return <OverviewDashboard />;
      case 'cooldrop':
        return <CoolDropView />;
      case 'purification':
        return <PurificationView />;
      case 'water-management':
        return <WaterManagementView />;
      case 'live-monitoring':
        return <LiveMonitoringView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'ai-intelligence':
        return <AIIntelligenceView />;
      case 'digital-twin':
        return <DigitalTwinView />;
      case 'environmental-impact':
        return <EnvironmentalImpactView />;
      case 'interactive-lab':
        return <InteractiveLabView />;
      case 'learning-centre':
        return <LearningCentreView />;
      case 'reports-settings':
        return <ReportsSettingsView />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F7F9] overflow-hidden font-sans text-slate-800 relative">
      {/* Sidebar Navigation (Left) */}
      <Sidebar />

      {/* Main Content Area (Right) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Sticky Header */}
        <Header title={currentMeta.title} subtitle={currentMeta.subtitle} />

        {/* Dynamic Module Scroll Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto pb-16">
            {renderActiveModule()}
          </div>
        </main>
      </div>

      {/* Persistent Gemini Copilot Widget on every screen */}
      <GeminiFloatingCopilot />

      {/* Gemini API Key Configuration Modal */}
      <GeminiKeyModal />
    </div>
  );
};
