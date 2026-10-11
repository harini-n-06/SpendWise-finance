import React, { useState } from 'react';
import { ShieldCheck, HelpCircle, ArrowRight, Zap } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../utils/calculations';

interface SafeAllowanceCardProps {
  onOpenSimulator: () => void;
}

export const SafeAllowanceCard: React.FC<SafeAllowanceCardProps> = ({ onOpenSimulator }) => {
  const { metrics, state } = useFinance();
  const [showFormula, setShowFormula] = useState(false);

  const safeDaily = Math.round(metrics.safeDailyAllowance);
  const balance = metrics.balance;
  const unpaid = metrics.unpaidCommitments;
  const remainingSavings = metrics.savingsSummary.remainingRequirement;
  const daysLeft = metrics.daysRemaining;
  const freeCash = Math.max(0, balance - unpaid - remainingSavings);

  return (
    <div className="bg-[#101827] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#B8F36B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left side: Hero value */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#B8F36B]/15 text-[#B8F36B] border border-[#B8F36B]/30 font-bold">
              <Zap className="w-3.5 h-3.5" />
              Signature Metric
            </span>
            <span>Safe Daily Allowance</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black text-[#B8F36B] font-mono-nums tracking-tight">
              {formatINR(safeDaily)}
            </span>
            <span className="text-slate-400 text-sm font-medium">/ day for next {daysLeft} days</span>
          </div>

          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            Spend up to <strong className="text-white font-mono-nums">{formatINR(safeDaily)}</strong> today without jeopardizing your <span className="text-white font-mono-nums">{formatINR(unpaid)}</span> unpaid bills or <span className="text-white font-mono-nums">{formatINR(metrics.savingsSummary.totalTarget)}</span> savings target.
          </p>

          <button
            onClick={() => setShowFormula(!showFormula)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showFormula ? 'Hide math breakdown' : 'How is this calculated?'}</span>
          </button>
        </div>

        {/* Right side: Action button */}
        <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0">
          <button
            onClick={onOpenSimulator}
            className="px-5 py-3 rounded-2xl bg-[#B8F36B] hover:bg-[#a5e453] text-[#101827] font-extrabold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 group whitespace-nowrap cursor-pointer"
          >
            <span>Simulate a Purchase</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <span className="text-[11px] text-slate-400 text-center md:text-right">
            See how spending ₹500 or ₹1,000 impacts today's limit
          </span>
        </div>
      </div>

      {/* Expandable Formula Explanation */}
      {showFormula && (
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-xs text-slate-300 animate-in fade-in duration-200">
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 font-mono text-[11px] sm:text-xs space-y-2">
            <div className="text-slate-400 font-sans font-semibold uppercase tracking-wider text-[10px]">
              The Mathematical Invariant:
            </div>
            <div className="text-[#B8F36B] font-bold">
              Safe Daily Allowance = max(0, Balance − Unpaid Commitments − Remaining Savings Goal) ÷ Days Remaining
            </div>
            <div className="text-slate-300 flex flex-wrap items-center gap-2 font-mono-nums">
              <span>= max(0, {formatINR(balance)} − {formatINR(unpaid)} − {formatINR(remainingSavings)}) ÷ {daysLeft} days</span>
            </div>
            <div className="text-slate-300 font-mono-nums">
              <span>= {formatINR(freeCash)} free cash ÷ {daysLeft} days = </span>
              <strong className="text-white text-sm">{formatINR(metrics.safeDailyAllowance, true)}/day</strong>
            </div>
            <div className="text-slate-400 font-sans text-[11px] pt-1">
              Zero double-counting guaranteed: When you pay a bill, both your balance and unpaid commitments drop simultaneously, keeping your safe daily allowance consistent.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
