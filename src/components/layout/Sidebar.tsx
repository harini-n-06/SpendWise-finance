import React from 'react';
import {
  LayoutDashboard,
  SlidersHorizontal,
  ArrowLeftRight,
  PieChart,
  Target,
  CalendarClock,
  TrendingUp,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../utils/calculations';

export type NavTab = 
  | 'dashboard'
  | 'simulator'
  | 'transactions'
  | 'budget'
  | 'savings'
  | 'commitments'
  | 'insights';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onRequestReset: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onRequestReset,
}) => {
  const { state, metrics, setCycleDay } = useFinance();
  const { currentDay, totalCycleDays } = state.settings;
  const progressPercent = Math.min(100, Math.round((currentDay / totalCycleDays) * 100));

  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
      badge: undefined,
    },
    {
      id: 'simulator' as NavTab,
      label: 'Decision Simulator',
      icon: <SlidersHorizontal className="w-5 h-5 shrink-0" />,
      badge: 'Signature',
    },
    {
      id: 'transactions' as NavTab,
      label: 'Transactions',
      icon: <ArrowLeftRight className="w-5 h-5 shrink-0" />,
      count: state.transactions.length,
    },
    {
      id: 'budget' as NavTab,
      label: 'Budget Planner',
      icon: <PieChart className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'savings' as NavTab,
      label: 'Savings Goals',
      icon: <Target className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'commitments' as NavTab,
      label: 'Bills & Subscriptions',
      icon: <CalendarClock className="w-5 h-5 shrink-0" />,
      count: state.commitments.filter((c) => !c.isPaid).length,
    },
    {
      id: 'insights' as NavTab,
      label: 'Forecast & Health',
      icon: <TrendingUp className="w-5 h-5 shrink-0" />,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-[#101827] text-white shrink-0 border-r border-slate-800 select-none h-screen sticky top-0">
      {/* Brand & Wordmark */}
      <div className="p-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B8F36B] flex items-center justify-center text-[#101827] font-black text-xl shadow-sm">
            ₹
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              SpendWise
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-[#B8F36B] border border-slate-700">
                Gen Z
              </span>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Spend smarter · Stay in control
            </div>
          </div>
        </div>
      </div>

      {/* Cycle Progress Bar Card */}
      <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-900/50">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
          <span>Cycle: Day {currentDay} of {totalCycleDays}</span>
          <span className="text-[#B8F36B] font-semibold">{metrics.daysRemaining} days left</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#B8F36B] h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Timeline Quick Step */}
        <div className="mt-3 flex items-center justify-between gap-1 text-[11px] text-slate-400">
          <span>Advance day:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCycleDay(Math.max(1, currentDay - 1))}
              disabled={currentDay <= 1}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-mono"
              title="Step 1 day backward"
            >
              -1d
            </button>
            <span className="font-mono text-white px-1">D{currentDay}</span>
            <button
              onClick={() => setCycleDay(Math.min(30, currentDay + 1))}
              disabled={currentDay >= 30}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-mono"
              title="Step 1 day forward"
            >
              +1d
            </button>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group ${
                isActive
                  ? 'bg-[#B8F36B] text-[#101827] shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-[#101827]' : 'text-slate-400 group-hover:text-white'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-2">
                {item.badge && (
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-[#101827] text-[#B8F36B]'
                        : 'bg-[#B8F36B]/20 text-[#B8F36B]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {typeof item.count === 'number' && (
                  <span
                    className={`text-xs font-mono font-medium px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-[#101827] text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Safe Daily Glance Card */}
      <div className="p-4 mx-4 mb-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
            Safe Daily Spend
          </span>
          <ShieldCheck className="w-4 h-4 text-[#B8F36B]" />
        </div>
        <div className="text-xl font-bold font-mono-nums text-white">
          {formatINR(Math.round(metrics.safeDailyAllowance))}/day
        </div>
        <div className="text-[11px] text-slate-400 mt-1">
          Guarantees ₹{formatINR(metrics.savingsSummary.totalTarget)} saved by Day 30
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between">
        <button
          onClick={onRequestReset}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors w-full justify-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo (₹10,000 / 30d)</span>
        </button>
      </div>
    </aside>
  );
};
