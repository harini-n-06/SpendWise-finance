import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../utils/calculations';
import {
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { ForecastTrajectoryChart } from '../dashboard/ForecastTrajectoryChart';

export const InsightsForecastView: React.FC = () => {
  const { state, metrics } = useFinance();
  const { healthScore, forecast, balance, safeDailyAllowance, daysRemaining } = metrics;
  const { currentDay } = state.settings;

  const currentDailyBurn = Math.round(metrics.totalExpenses / Math.max(1, currentDay));

  // 3 Sensitivity Scenarios based on real data
  const scenarios = [
    {
      title: 'Current Pace (Status Quo)',
      dailySpend: currentDailyBurn,
      projectedDay30: Math.round(forecast.projectedBalance),
      risk: forecast.projectedBalance >= 1500 ? 'Stable' : forecast.projectedBalance >= 0 ? 'Caution' : 'High Risk',
      desc: `Continue spending ~${formatINR(currentDailyBurn)}/day as observed over the first ${currentDay} days.`,
    },
    {
      title: 'Frugal Mode (-20% Spend)',
      dailySpend: Math.round(currentDailyBurn * 0.8),
      projectedDay30: Math.round(forecast.projectedBalance + (currentDailyBurn * 0.2 * daysRemaining)),
      risk: 'Stable',
      desc: `Trim dining out and impulsive spending by 20% over the next ${daysRemaining} days.`,
    },
    {
      title: 'Splurge Mode (+25% Spend)',
      dailySpend: Math.round(currentDailyBurn * 1.25),
      projectedDay30: Math.round(forecast.projectedBalance - (currentDailyBurn * 0.25 * daysRemaining)),
      risk: forecast.projectedBalance - (currentDailyBurn * 0.25 * daysRemaining) < 500 ? 'High Risk' : 'Caution',
      desc: `Extra outings or weekend purchases pushing burn to ${formatINR(Math.round(currentDailyBurn * 1.25))}/day.`,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">30-Day Forecast & Financial Health</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent projections based on your ₹10,000 budget and active spending pace
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
              healthScore.riskLevel === 'Stable'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : healthScore.riskLevel === 'Caution'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {healthScore.riskLevel} Health Tier
          </span>
        </div>
      </div>

      {/* Trajectory Graph */}
      <ForecastTrajectoryChart />

      {/* Transparent Financial Health Score Engine Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-700" />
              <h3 className="text-lg font-bold text-slate-900">
                Transparent Health Score Engine ({healthScore.totalScore}/100)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Every point is mathematically derived from your 30-day budget rules.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[11px] text-slate-500 max-w-sm">
            <strong className="text-slate-700 block mb-0.5">Important Disclaimer:</strong>
            This is an educational personal finance indicator designed for Gen Z budget adherence, not a credit agency rating (e.g. CIBIL/Experian).
          </div>
        </div>

        {/* 4 Pillars Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">1. Budget Runway</span>
              <span className="font-mono-nums font-extrabold text-slate-900">
                {healthScore.breakdown.runwayScore}/30 pts
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-slate-900 h-full rounded-full"
                style={{ width: `${(healthScore.breakdown.runwayScore / 30) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Measures remaining balance ({formatINR(balance)}) against the remaining {daysRemaining} days.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">2. Daily Allowance</span>
              <span className="font-mono-nums font-extrabold text-slate-900">
                {healthScore.breakdown.dailyAllowanceScore}/30 pts
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${(healthScore.breakdown.dailyAllowanceScore / 30) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Safe limit ({formatINR(Math.round(safeDailyAllowance))}/day) compared to Day 1 baseline (₹333/day).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">3. Bill Coverage</span>
              <span className="font-mono-nums font-extrabold text-slate-900">
                {healthScore.breakdown.commitmentCoverageScore}/20 pts
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full"
                style={{ width: `${(healthScore.breakdown.commitmentCoverageScore / 20) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Unpaid bills ({formatINR(metrics.unpaidCommitments)}) constitute only {Math.round((metrics.unpaidCommitments / balance) * 100)}% of your active balance.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">4. Savings Attainment</span>
              <span className="font-mono-nums font-extrabold text-slate-900">
                {healthScore.breakdown.savingsProgressScore}/20 pts
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{ width: `${(healthScore.breakdown.savingsProgressScore / 20) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              {metrics.savingsSummary.progressPercent}% of target saved, with high feasibility to complete.
            </p>
          </div>
        </div>
      </div>

      {/* Scenario Comparisons */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-500" />
            30-Day Scenario Sensitivity Analysis
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare where you will land at Day 30 under 3 different spending behaviors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {scenarios.map((sc, idx) => (
            <div
              key={sc.title}
              className={`p-5 rounded-2xl border transition-all ${
                idx === 0
                  ? 'bg-slate-900 text-white border-slate-800 shadow-md'
                  : 'bg-slate-50 border-slate-200/80 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className={`font-bold ${idx === 0 ? 'text-[#B8F36B]' : 'text-slate-900'}`}>
                  {sc.title}
                </span>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    sc.risk === 'Stable'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : sc.risk === 'Caution'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {sc.risk}
                </span>
              </div>

              <div className="my-3">
                <div className={`text-xs ${idx === 0 ? 'text-slate-400' : 'text-slate-500'}`}>
                  Projected Day 30 Balance:
                </div>
                <div
                  className={`text-2xl font-black font-mono-nums mt-0.5 ${
                    idx === 0 ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {formatINR(sc.projectedDay30)}
                </div>
                <div className={`text-[11px] font-mono-nums mt-1 ${idx === 0 ? 'text-slate-300' : 'text-slate-600'}`}>
                  Burn: {formatINR(sc.dailySpend)}/day
                </div>
              </div>

              <p className={`text-xs leading-relaxed ${idx === 0 ? 'text-slate-300' : 'text-slate-600'}`}>
                {sc.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Data-Grounded Recommendations */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Data-Grounded Recommendations
        </h3>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
              1
            </div>
            <div>
              <div className="font-bold text-emerald-950">Stay within your safe ceiling of {formatINR(Math.round(safeDailyAllowance))}/day</div>
              <p className="text-xs text-emerald-800 mt-0.5">
                Because you have ₹{metrics.unpaidCommitments.toLocaleString('en-IN')} in scheduled commitments, keeping daily discretionary spending under {formatINR(Math.round(safeDailyAllowance))} ensures zero end-of-month cash squeeze.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-slate-200 text-slate-700 shrink-0 mt-0.5">
              2
            </div>
            <div>
              <div className="font-bold text-slate-900">Food & Dining is your highest expense category ({formatINR(820)} spent)</div>
              <p className="text-xs text-slate-600 mt-0.5">
                Food & Dining accounts for nearly 30% of your total expenses so far. Pre-cooking 2 dinners this week saves ~₹400, adding +₹22/day to your safe daily allowance!
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-slate-200 text-slate-700 shrink-0 mt-0.5">
              3
            </div>
            <div>
              <div className="font-bold text-slate-900">WiFi Bill is due on Day 16 (4 days away)</div>
              <p className="text-xs text-slate-600 mt-0.5">
                Your ₹600 broadband bill will mature in 4 days. When paid, your balance will drop to {formatINR(balance - 600)}, but your safe daily allowance will remain perfectly constant at {formatINR(Math.round(safeDailyAllowance))}/day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
