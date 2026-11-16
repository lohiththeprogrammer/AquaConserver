import React from 'react';
import { TreatmentStageId, TreatmentStageInfo } from '../../types';
import { CheckCircle2, ChevronRight, AlertCircle, Droplets } from 'lucide-react';

interface StageFlowDiagramProps {
  stages: TreatmentStageInfo[];
  activeStageId: TreatmentStageId;
  onSelectStage: (stageId: TreatmentStageId) => void;
}

export const StageFlowDiagram: React.FC<StageFlowDiagramProps> = ({
  stages,
  activeStageId,
  onSelectStage
}) => {
  return (
    <div className="w-full bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Droplets className="w-4 h-4 text-[#21A6A0]" />
            Sequential Multi-Barrier Treatment Pipeline
          </h3>
          <p className="text-xs text-slate-500">
            Click any stage chamber to inspect media details, differential pressure, and retention velocity.
          </p>
        </div>
        <span className="text-[11px] font-mono text-[#123B55] bg-blue-50 px-2 py-1 rounded-md border border-blue-200 font-semibold">
          Current Stage: {activeStageId.toUpperCase()}
        </span>
      </div>

      {/* Stage Nodes Flow */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {stages.map((stage, idx) => {
          const isCurrent = stage.id === activeStageId;

          return (
            <div
              key={stage.id}
              onClick={() => onSelectStage(stage.id)}
              className={`cursor-pointer rounded-xl p-3 border transition-all text-left relative flex flex-col justify-between min-h-[110px] ${
                isCurrent
                  ? 'bg-gradient-to-b from-[#EBF7FC] to-white border-[#21A6A0] ring-2 ring-[#21A6A0]/20 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isCurrent ? 'bg-[#21A6A0] text-white' : 'bg-slate-200 text-slate-600'}`}>
                  0{stage.order}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#65A875]" />
              </div>

              <div className="my-1.5">
                <h4 className={`text-xs font-bold leading-tight ${isCurrent ? 'text-[#123B55]' : 'text-slate-800'}`}>
                  {stage.name}
                </h4>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {stage.mediaType}
                </p>
              </div>

              <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>{stage.retentionTimeMinutes}m hold</span>
                <span className="font-semibold text-[#65A875]">{stage.efficiencyPct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected stage banner detail */}
      {(() => {
        const selected = stages.find(s => s.id === activeStageId) || stages[0];
        return (
          <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex-1">
              <span className="font-bold text-[#123B55]">{selected.name}: </span>
              <span className="text-slate-600">{selected.detailedDesc}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-700 font-mono text-[11px] flex-shrink-0 bg-white p-2 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Diff. Pressure</span>
                <span className="font-bold text-[#123B55]">{selected.differentialPressureKPa} kPa</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Media</span>
                <span className="font-medium text-slate-800 truncate max-w-[140px] block">{selected.mediaType}</span>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

