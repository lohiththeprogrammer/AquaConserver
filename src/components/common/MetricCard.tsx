import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  change?: string;
  isPositive?: boolean;
  accentColor?: 'teal' | 'navy' | 'blue' | 'green' | 'amber';
  icon?: React.ReactNode;
  statusBadge?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  subValue,
  change,
  isPositive = true,
  accentColor = 'teal',
  icon,
  statusBadge
}) => {
  const colorMap = {
    teal:  { border: 'border-l-4 border-l-[#21A6A0]', bgAccent: 'bg-[#21A6A0]/10 text-[#21A6A0]' },
    navy:  { border: 'border-l-4 border-l-[#123B55]', bgAccent: 'bg-[#123B55]/10 text-[#123B55]' },
    blue:  { border: 'border-l-4 border-l-[#5CB6DC]', bgAccent: 'bg-[#5CB6DC]/10 text-[#5CB6DC]' },
    green: { border: 'border-l-4 border-l-[#65A875]', bgAccent: 'bg-[#65A875]/10 text-[#65A875]' },
    amber: { border: 'border-l-4 border-l-amber-500', bgAccent: 'bg-amber-100 text-amber-700' }
  };
  const style = colorMap[accentColor];

  return (
    <div
      className={`bg-white rounded-xl p-4 border border-slate-200/90 shadow-sm ${style.border} transition-all hover:shadow-md hover:border-slate-300 relative overflow-hidden flex flex-col min-h-[110px]`}
    >
      {/* Top row: label + icon */}
      <div className="flex items-start justify-between gap-2 flex-1">
        <div className="min-w-0 flex-1">
          <span
            className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold block leading-tight truncate"
            title={label}
          >
            {label}
          </span>
          <div className="flex items-baseline gap-1 mt-1.5 flex-wrap">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight leading-none">
              {value}
            </span>
            {unit && (
              <span className="text-[11px] font-semibold text-slate-500 font-mono leading-none whitespace-nowrap">
                {unit}
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div
            className={`w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center ${style.bgAccent} shadow-xs`}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Bottom row: change + subValue + badge — each truncated */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2 min-w-0">
        {change && (
          <span
            className={`font-mono text-[10px] font-semibold flex items-center gap-0.5 whitespace-nowrap flex-shrink-0 ${
              isPositive ? 'text-[#65A875]' : 'text-rose-600'
            }`}
          >
            <span>{isPositive ? '↑' : '↓'}</span>
            <span>{change}</span>
          </span>
        )}
        {subValue && (
          <span
            className="text-slate-500 text-[10px] truncate min-w-0 flex-1"
            title={subValue}
          >
            {subValue}
          </span>
        )}
        {statusBadge && (
          <span
            className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-semibold whitespace-nowrap flex-shrink-0 ${style.bgAccent}`}
            title={statusBadge}
          >
            {statusBadge}
          </span>
        )}
      </div>
    </div>
  );
};
