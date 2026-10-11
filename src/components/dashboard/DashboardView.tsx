import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../utils/calculations';
import {
  Wallet,
  ArrowUpRight,
  Calendar,
  Lock,
  PiggyBank,
  Sparkles,
  Info,
  Clock,
} from 'lucide-react';
import { MetricCard } from '../common/MetricCard';
import { SafeAllowanceCard } from './SafeAllowanceCard';
import { SpendingBreakdownChart } from './SpendingBreakdownChart';
import { ForecastTrajectoryChart } from './ForecastTrajectoryChart';
import { HealthScoreCard } from './HealthScoreCard';
import { RecentTransactionsWidget } from './RecentTransactionsWidget';
import { UpcomingCommitmentsWidget } from './UpcomingCommitmentsWidget';

interface DashboardViewProps {
  onNavigateToTab: (tab: any) => void;
  onOpenAddTransactionModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToTab,
  onOpenAddTransactionModal,
}) => {
  const { state, metrics } = useFinance();
  const { startingBudget, currentDay, totalCycleDays } = state.settings;

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Metric: Safe Daily Allowance */}
      <SafeAllowanceCard onOpenSimulator={() => onNavigateToTab('simulator')} />

      {/* Primary KPI Grid (6 core metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        <MetricCard
          label="Opening Budget"
          value={formatINR(startingBudget)}
          subtext={`30-day baseline`}
          icon={<Wallet className="w-4 h-4" />}
        />

        <MetricCard
          label="Current Balance"
          value={formatINR(metrics.balance)}
          subtext="Available in pocket"
          icon={<Wallet className="w-4 h-4 text-emerald-600" />}
          highlight={false}
        />

        <MetricCard
          label="Total Spent"
          value={formatINR(metrics.totalExpenses)}
          subtext={`Avg ${formatINR(Math.round(metrics.totalExpenses / currentDay))}/day`}
          icon={<ArrowUpRight className="w-4 h-4 text-amber-500" />}
        />

        <MetricCard
          label="Unpaid Bills"
          value={formatINR(metrics.unpaidCommitments)}
          subtext={`${state.commitments.filter((c) => !c.isPaid).length} bills scheduled`}
          icon={<Lock className="w-4 h-4 text-cyan-600" />}
        />

        <MetricCard
          label="Savings Target"
          value={formatINR(metrics.savingsSummary.totalTarget)}
          subtext={`${formatINR(metrics.savingsSummary.totalSaved)} saved (${metrics.savingsSummary.progressPercent}%)`}
          icon={<PiggyBank className="w-4 h-4 text-indigo-500" />}
        />

        <MetricCard
          label="Days Remaining"
          value={`${metrics.daysRemaining} days`}
          subtext={`Day ${currentDay} of ${totalCycleDays}`}
          icon={<Clock className="w-4 h-4 text-violet-500" />}
        />
      </div>

      {/* Actionable Insights Strip */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#B8F36B]/20 text-slate-900 rounded-xl shrink-0">
            <Sparkles className="w-4 h-4 text-[#101827]" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              Live Budget Runway Status
            </div>
            <div className="text-xs text-slate-600">
              You are spending at <span className="font-mono-nums font-semibold text-slate-900">{formatINR(Math.round(metrics.totalExpenses / currentDay))}/day</span>, which is below your safe ceiling of <span className="font-mono-nums font-semibold text-slate-900">{formatINR(Math.round(metrics.safeDailyAllowance))}/day</span>. Month-end forecast remains safe at <span className="font-mono-nums font-semibold text-slate-900">{formatINR(Math.round(metrics.forecast.projectedBalance))}</span>.
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigateToTab('insights')}
          className="text-xs font-bold text-slate-900 hover:text-slate-700 underline underline-offset-2 shrink-0 cursor-pointer"
        >
          View 30-Day Forecast →
        </button>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ForecastTrajectoryChart />
        </div>
        <div className="lg:col-span-5">
          <SpendingBreakdownChart onNavigateToBudget={() => onNavigateToTab('budget')} />
        </div>
      </div>

      {/* Bottom Grid: Health Score + Recent Ledger + Commitments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <HealthScoreCard onNavigateToInsights={() => onNavigateToTab('insights')} />
        <RecentTransactionsWidget
          onNavigateToTransactions={() => onNavigateToTab('transactions')}
          onOpenAddModal={onOpenAddTransactionModal}
        />
        <UpcomingCommitmentsWidget
          onNavigateToCommitments={() => onNavigateToTab('commitments')}
        />
      </div>
    </div>
  );
};
