import React from 'react';
import { Sparkles, RotateCcw, Calendar, ShieldCheck } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { NavTab } from './Sidebar';
import { formatINR } from '../../utils/calculations';

interface HeaderProps {
  activeTab: NavTab;
  onOpenSimulator: () => void;
  onRequestReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenSimulator,
  onRequestReset,
}) => {
  const { state, metrics } = useFinance();

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Financial Overview';
      case 'simulator':
        return 'Decision Simulator';
      case 'transactions':
        return 'Transaction Ledger';
      case 'budget':
        return 'Category Budget Planner';
      case 'savings':
        return 'Savings Goals & Vault';
      case 'commitments':
        return 'Upcoming Bills & Subscriptions';
      case 'insights':
        return 'Forecast & Health Score';
      default:
        return 'SpendWise';
    }
  };

  const getSubtitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return `Day ${state.settings.currentDay} of ${state.settings.totalCycleDays} · Safe allowance: ${formatINR(Math.round(metrics.safeDailyAllowance))}/day`;
      case 'simulator':
        return 'Test financial moves before spending a single rupee';
      case 'transactions':
        return `${state.transactions.length} recorded items · Real-time balance updates`;
      case 'budget':
        return 'Category spending caps vs actual expenses';
      case 'savings':
        return `${metrics.savingsSummary.progressPercent}% of ₹${metrics.savingsSummary.totalTarget.toLocaleString('en-IN')} goal reached`;
      case 'commitments':
        return `₹${metrics.unpaidCommitments.toLocaleString('en-IN')} pending commitments scheduled`;
      case 'insights':
        return `Projected balance: ${formatINR(Math.round(metrics.forecast.projectedBalance))} at Day 30`;
      default:
        return 'Manage your ₹10,000 budget';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Title & Context */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          {getTitle()}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          {getSubtitle()}
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onRequestReset}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          title="Reset back to initial demo data"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Demo</span>
        </button>

        {activeTab !== 'simulator' && (
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-[#101827] bg-[#B8F36B] hover:bg-[#a5e453] rounded-xl transition-all shadow-xs active:scale-95 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-[#101827]" />
            <span>Simulate Move</span>
          </button>
        )}
      </div>
    </header>
  );
};
