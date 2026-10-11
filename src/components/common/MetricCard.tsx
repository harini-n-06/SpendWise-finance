import React, { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon?: ReactNode;
  accentColor?: string;
  highlight?: boolean;
  tooltip?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon,
  highlight = false,
  tooltip,
}) => {
  return (
    <div
      title={tooltip}
      className={`relative p-5 rounded-2xl transition-all duration-200 ${
        highlight
          ? 'bg-[#101827] text-white shadow-md border border-slate-800'
          : 'bg-white text-slate-900 border border-slate-200/90 shadow-xs hover:border-slate-300'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={`text-xs font-semibold tracking-wider uppercase ${
            highlight ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          {label}
        </span>
        {icon && (
          <div
            className={`p-2 rounded-xl shrink-0 ${
              highlight ? 'bg-slate-800/80 text-[#B8F36B]' : 'bg-slate-50 text-slate-700'
            }`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono-nums ${highlight ? 'text-white' : 'text-slate-900'}`}>
          {value}
        </div>
      </div>

      {subtext && (
        <div
          className={`mt-2 text-xs leading-normal font-medium ${
            highlight ? 'text-slate-300' : 'text-slate-500'
          }`}
        >
          {subtext}
        </div>
      )}
    </div>
  );
};
