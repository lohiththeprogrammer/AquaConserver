import React from 'react';

interface WaterGaugeProps {
  fillPercentage: number;
  currentLiters: number;
  capacityLiters: number;
  title: string;
  subtitle?: string;
  themeColor?: 'teal' | 'blue' | 'navy';
  alertThreshold?: number;
}

export const WaterGauge: React.FC<WaterGaugeProps> = ({
  fillPercentage,
  currentLiters,
  capacityLiters,
  title,
  subtitle,
  themeColor = 'teal',
  alertThreshold = 85
}) => {
  const clampedFill = Math.min(100, Math.max(0, fillPercentage));
  const isHigh = clampedFill >= alertThreshold;

  const colorStyles = {
    teal: {
      fill: '#21A6A0',
      fillDark: '#123B55',
      lightBg: 'bg-[#21A6A0]/10',
      text: 'text-[#21A6A0]'
    },
    blue: {
      fill: '#5CB6DC',
      fillDark: '#1E6F92',
      lightBg: 'bg-[#5CB6DC]/10',
      text: 'text-[#5CB6DC]'
    },
    navy: {
      fill: '#123B55',
      fillDark: '#0B2333',
      lightBg: 'bg-[#123B55]/10',
      text: 'text-[#123B55]'
    }
  }[themeColor];

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
            isHigh ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          {isHigh ? 'HIGH LEVEL' : 'NORMAL'}
        </span>
      </div>

      <div className="my-5 flex items-center justify-center gap-6">
        {/* Tank Graphic */}
        <div className="relative w-24 h-40 bg-slate-100 rounded-2xl border-2 border-slate-300 overflow-hidden shadow-inner flex flex-col justify-end p-1">
          {/* Tank Ticks */}
          <div className="absolute inset-y-0 right-1 flex flex-col justify-between py-2 text-[9px] font-mono text-slate-400 select-none z-10">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>

          {/* Water Fill Layer */}
          <div
            className="w-full rounded-xl transition-all duration-700 relative overflow-hidden"
            style={{
              height: `${clampedFill}%`,
              background: `linear-gradient(180deg, ${colorStyles.fill} 0%, ${colorStyles.fillDark} 100%)`
            }}
          >
            {/* Animated surface highlight */}
            <div className="absolute top-0 inset-x-0 h-2 bg-white/40 animate-pulse" />
          </div>
        </div>

        {/* Readout stats */}
        <div className="flex flex-col gap-2">
          <div>
            <span className="text-xs text-slate-500 font-mono uppercase">Current Fill</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold font-mono text-[#123B55]">{clampedFill}%</span>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-500 font-mono uppercase">Water Volume</span>
            <div className="text-base font-bold font-mono text-slate-800">
              {currentLiters.toFixed(1)} <span className="text-xs font-normal text-slate-500">/ {capacityLiters} L</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            Headroom: <span className="font-mono font-semibold text-slate-700">{(capacityLiters - currentLiters).toFixed(1)} L</span>
          </div>
        </div>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${clampedFill}%`,
            backgroundColor: colorStyles.fill
          }}
        />
      </div>
    </div>
  );
};

