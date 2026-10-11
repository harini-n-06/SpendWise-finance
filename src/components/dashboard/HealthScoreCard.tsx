import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ShieldAlert, ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';

interface HealthScoreCardProps {
  onNavigateToInsights?: () => void;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ onNavigateToInsights }) => {
  const { metrics } = useFinance();
  const { healthScore } = metrics;
  const { totalScore, riskLevel, breakdown, keyFactor, improvementTip } = healthScore;

  // Determine badge styling
  let badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let gaugeColor = '#10B981';
  let icon = <ShieldCheck className="w-5 h-5 text-emerald-600" />;

  if (riskLevel === 'Caution') {
    badgeColor = 'text-amber-700 bg-amber-50 border-amber-200';
    gaugeColor = '#F59E0B';
    icon = <AlertTriangle className="w-5 h-5 text-amber-600" />;
  } else if (riskLevel === 'High Risk') {
    badgeColor = 'text-rose-700 bg-rose-50 border-rose-200';
    gaugeColor = '#F43F5E';
    icon = <ShieldAlert className="w-5 h-5 text-rose-600" />;
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-base font-bold text-slate-900">Financial Health Score</h3>
          </div>
          <span
            className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badgeColor}`}
          >
            {riskLevel}
          </span>
        </div>

        {/* Big Score Gauge */}
        <div className="flex items-center gap-5 my-3">
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            {/* SVG circular meter */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#f1f5f9"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={gaugeColor}
                strokeWidth="10"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * totalScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900 font-mono-nums">
                {totalScore}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">/ 100</span>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900">
              {riskLevel === 'Stable'
                ? 'Healthy Financial Position'
                : riskLevel === 'Caution'
                ? 'Moderate Spending Pressure'
                : 'Action Needed'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {keyFactor}
            </p>
          </div>
        </div>

        {/* 4 Pillars Progress */}
        <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Budget Runway vs Timeline</span>
              <span className="font-mono-nums font-bold text-slate-900">{breakdown.runwayScore}/30</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-slate-900 h-full rounded-full transition-all"
                style={{ width: `${(breakdown.runwayScore / 30) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Daily Allowance Adherence</span>
              <span className="font-mono-nums font-bold text-slate-900">{breakdown.dailyAllowanceScore}/30</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#10B981] h-full rounded-full transition-all"
                style={{ width: `${(breakdown.dailyAllowanceScore / 30) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Commitment Cushion</span>
              <span className="font-mono-nums font-bold text-slate-900">{breakdown.commitmentCoverageScore}/20</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all"
                style={{ width: `${(breakdown.commitmentCoverageScore / 20) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Savings Goal Progress</span>
              <span className="font-mono-nums font-bold text-slate-900">{breakdown.savingsProgressScore}/20</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all"
                style={{ width: `${(breakdown.savingsProgressScore / 20) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 italic">
          Educational budget score · Not a credit score
        </span>
        {onNavigateToInsights && (
          <button
            onClick={onNavigateToInsights}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
