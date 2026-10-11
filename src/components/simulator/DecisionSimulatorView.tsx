import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  SimulationParams,
  SimulationType,
  Category,
} from '../../types/finance';
import { simulateDecision, formatINR } from '../../utils/calculations';
import {
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Flame,
  PlusCircle,
  MinusCircle,
  HelpCircle,
} from 'lucide-react';
import { ConfirmModal } from '../common/ConfirmModal';

export const DecisionSimulatorView: React.FC = () => {
  const { state, metrics, applySimulatedDecision } = useFinance();

  // Simulation form state
  const [simType, setSimType] = useState<SimulationType>('purchase');
  const [title, setTitle] = useState<string>('Weekend Outing & Dinner');
  const [amount, setAmount] = useState<number>(1200);
  const [category, setCategory] = useState<Category>('Food & Dining');
  const [notes, setNotes] = useState<string>('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Quick Gen Z simulation presets
  const presets = [
    {
      label: 'Weekend Outing',
      type: 'purchase' as SimulationType,
      title: 'Weekend Outing with Friends',
      amount: 1800,
      category: 'Food & Dining' as Category,
      desc: 'Dining out & clubbing',
    },
    {
      label: 'Concert Festival',
      type: 'purchase' as SimulationType,
      title: 'Music Festival Pass',
      amount: 1500,
      category: 'Entertainment' as Category,
      desc: 'Live gig pass & merch',
    },
    {
      label: 'New Subscription',
      type: 'subscription' as SimulationType,
      title: 'OTT Streaming Plan',
      amount: 299,
      category: 'Entertainment' as Category,
      desc: 'Recurring monthly commitment',
    },
    {
      label: 'Freelance Gig',
      type: 'income' as SimulationType,
      title: 'Freelance Design Project',
      amount: 2500,
      category: 'Freelance / Income' as Category,
      desc: 'Cash inflow boost',
    },
    {
      label: 'Phone Repair',
      type: 'unexpected_bill' as SimulationType,
      title: 'Emergency Screen Replacement',
      amount: 1400,
      category: 'Utilities & Bills' as Category,
      desc: 'Urgent hardware fix',
    },
    {
      label: 'Save for Goa Trip',
      type: 'savings_deposit' as SimulationType,
      title: 'Goa Trip Savings Transfer',
      amount: 800,
      category: 'Savings Transfer' as Category,
      desc: 'Lock funds in savings vault',
    },
  ];

  // Apply preset into simulator inputs
  const handleSelectPreset = (p: typeof presets[0]) => {
    setSimType(p.type);
    setTitle(p.title);
    setAmount(p.amount);
    setCategory(p.category);
    setNotes(p.desc);
  };

  // Reset simulator inputs back to neutral
  const handleResetSimulator = () => {
    setSimType('purchase');
    setTitle('New Purchase Simulation');
    setAmount(500);
    setCategory('Food & Dining');
    setNotes('');
  };

  // Run live simulation calculation (Pure, never alters saved data)
  const simulationParams: SimulationParams = useMemo(
    () => ({
      type: simType,
      title,
      amount: Number(amount) || 0,
      category,
      notes,
    }),
    [simType, title, amount, category, notes]
  );

  const result = useMemo(
    () => simulateDecision(state, simulationParams),
    [state, simulationParams]
  );

  const handleConfirmDecision = () => {
    applySimulatedDecision(simulationParams);
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Signature Banner */}
      <div className="bg-[#101827] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8F36B]/20 text-[#B8F36B] border border-[#B8F36B]/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Signature Feature · Decision Simulator
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Simulate Before You Spend
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Wondering if you can afford that concert ticket, new gadget, or surprise outing? Adjust the sliders to see exactly how your balance, safe daily spend, and month-end forecast react in real time.
          </p>
        </div>
      </div>

      {/* Quick Gen Z Preset Buttons */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Quick Simulation Scenarios
          </span>
          <span className="text-xs text-slate-400">Click to preload</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {presets.map((p) => {
            const isSelected = title === p.title && amount === p.amount;
            return (
              <button
                key={p.label}
                onClick={() => handleSelectPreset(p)}
                className={`p-3 rounded-2xl text-left border transition-all text-xs flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#101827] text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div>
                  <div className="font-bold truncate">{p.label}</div>
                  <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {p.desc}
                  </div>
                </div>
                <div className={`font-mono-nums font-extrabold mt-2 text-sm ${isSelected ? 'text-[#B8F36B]' : 'text-slate-900'}`}>
                  {p.type === 'income' ? '+' : '-'}₹{p.amount}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Controls & Comparison Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Simulation Controls */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              Configure Simulation
            </h3>
            <button
              onClick={handleResetSimulator}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Decision Type Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Type of Move
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setSimType('purchase')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                  simType === 'purchase'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Purchase
              </button>
              <button
                type="button"
                onClick={() => setSimType('unexpected_bill')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                  simType === 'unexpected_bill'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Surprise Bill
              </button>
              <button
                type="button"
                onClick={() => setSimType('subscription')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                  simType === 'subscription'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Subscription
              </button>
              <button
                type="button"
                onClick={() => setSimType('income')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                  simType === 'income'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                + Income
              </button>
              <button
                type="button"
                onClick={() => setSimType('savings_deposit')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                  simType === 'savings_deposit'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Deposit Goal
              </button>
              <button
                type="button"
                onClick={() => setSimType('cancel_commitment')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                  simType === 'cancel_commitment'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cancel Sub
              </button>
            </div>
          </div>

          {/* Title / Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description / Payee
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekend concert tickets"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#101827] focus:border-transparent"
            />
          </div>

          {/* Amount Slider & Direct Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Simulated Amount (₹)
              </label>
              <div className="flex items-center gap-1 font-mono-nums font-black text-xl text-slate-900">
                <span>₹</span>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  step="50"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                  className="w-24 px-2 py-1 text-right rounded-lg border border-slate-300 font-mono-nums font-black text-lg focus:outline-hidden focus:ring-2 focus:ring-[#101827]"
                />
              </div>
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min="0"
              max="5000"
              step="50"
              value={Math.min(5000, amount)}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#101827]"
            />

            {/* Quick amount shortcuts */}
            <div className="flex items-center justify-between gap-1 text-[11px] text-slate-500 pt-1">
              {[200, 500, 1000, 1800, 2500].map((quick) => (
                <button
                  key={quick}
                  type="button"
                  onClick={() => setAmount(quick)}
                  className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 font-mono-nums font-medium text-slate-700"
                >
                  ₹{quick}
                </button>
              ))}
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:outline-hidden focus:ring-2 focus:ring-[#101827]"
            >
              <option value="Food & Dining">Food & Dining</option>
              <option value="Groceries">Groceries</option>
              <option value="Commute & Transit">Commute & Transit</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping & Style">Shopping & Style</option>
              <option value="Health & Fitness">Health & Fitness</option>
              <option value="Utilities & Bills">Utilities & Bills</option>
              <option value="Education & Books">Education & Books</option>
              <option value="Savings Transfer">Savings Transfer</option>
              <option value="Freelance / Income">Freelance / Income</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Operational Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetSimulator}
              className="w-1/3 py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors text-center cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => setIsConfirmModalOpen(true)}
              disabled={amount <= 0 && simType !== 'cancel_commitment'}
              className="w-2/3 py-3 px-4 rounded-2xl bg-[#B8F36B] hover:bg-[#a5e453] disabled:opacity-50 text-[#101827] font-extrabold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#101827]" />
              <span>Confirm & Apply Decision</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 text-center">
            *Previewing never alters your records. Confirming applies it to your ledger exactly once.
          </p>
        </div>

        {/* Right Col: Live Before-and-After Comparison & Verdict */}
        <div className="lg:col-span-7 space-y-5">
          {/* Verdict Banner */}
          <div
            className={`rounded-3xl p-6 border transition-all ${
              result.verdict.status === 'beneficial'
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : result.verdict.status === 'safe'
                ? 'bg-[#101827] border-slate-800 text-white'
                : result.verdict.status === 'caution'
                ? 'bg-amber-50/90 border-amber-200 text-amber-950'
                : 'bg-rose-50/90 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-2xl shrink-0 ${
                  result.verdict.status === 'safe'
                    ? 'bg-slate-800 text-[#B8F36B]'
                    : result.verdict.status === 'beneficial'
                    ? 'bg-emerald-100 text-emerald-700'
                    : result.verdict.status === 'caution'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {result.verdict.status === 'safe' || result.verdict.status === 'beneficial' ? (
                  <ShieldCheck className="w-6 h-6" />
                ) : result.verdict.status === 'caution' ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <ShieldAlert className="w-6 h-6" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-extrabold tracking-wider opacity-75">
                    Simulation Verdict
                  </span>
                  <span className="text-xs font-mono font-bold">
                    ({result.simulatedRiskLevel})
                  </span>
                </div>
                <h3 className="text-xl font-black tracking-tight mt-0.5">
                  {result.verdict.headline}
                </h3>
                <p className="text-xs sm:text-sm mt-1 leading-relaxed opacity-90">
                  {result.verdict.description}
                </p>
              </div>
            </div>
          </div>

          {/* 4-Metric Before vs After Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Metric 1: Current Balance */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Wallet Balance
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-slate-400">Current</div>
                  <div className="text-lg font-bold font-mono-nums text-slate-600">
                    {formatINR(result.currentBalance)}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <div className="text-right">
                  <div className="text-xs text-slate-400">Simulated</div>
                  <div className="text-xl font-extrabold font-mono-nums text-slate-900">
                    {formatINR(result.simulatedBalance)}
                  </div>
                </div>
              </div>
              <div
                className={`mt-2 text-xs font-semibold font-mono-nums flex items-center justify-end gap-1 ${
                  result.balanceDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {result.balanceDelta >= 0 ? '+' : ''}
                {formatINR(result.balanceDelta)} delta
              </div>
            </div>

            {/* Metric 2: Safe Daily Allowance */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Safe Daily Spend
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-slate-400">Current</div>
                  <div className="text-lg font-bold font-mono-nums text-slate-600">
                    {formatINR(Math.round(result.currentSafeDailyAllowance))}/d
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <div className="text-right">
                  <div className="text-xs text-slate-400">Simulated</div>
                  <div className="text-xl font-extrabold font-mono-nums text-[#101827]">
                    {formatINR(Math.round(result.simulatedSafeDailyAllowance))}/d
                  </div>
                </div>
              </div>
              <div
                className={`mt-2 text-xs font-semibold font-mono-nums flex items-center justify-end gap-1 ${
                  result.safeDailyDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {result.safeDailyDelta >= 0 ? '+' : ''}
                {formatINR(Math.round(result.safeDailyDelta))}/day delta
              </div>
            </div>

            {/* Metric 3: Month-End Forecast */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Day 30 Projected Balance
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-slate-400">Current</div>
                  <div className="text-lg font-bold font-mono-nums text-slate-600">
                    {formatINR(Math.round(result.currentMonthEndForecast))}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <div className="text-right">
                  <div className="text-xs text-slate-400">Simulated</div>
                  <div className="text-xl font-extrabold font-mono-nums text-slate-900">
                    {formatINR(Math.round(result.simulatedMonthEndForecast))}
                  </div>
                </div>
              </div>
              <div
                className={`mt-2 text-xs font-semibold font-mono-nums flex items-center justify-end gap-1 ${
                  result.forecastDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {result.forecastDelta >= 0 ? '+' : ''}
                {formatINR(Math.round(result.forecastDelta))} cushion delta
              </div>
            </div>

            {/* Metric 4: Financial Health Score */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Health Score (0-100)
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-slate-400">Current</div>
                  <div className="text-lg font-bold font-mono-nums text-slate-600">
                    {result.currentHealthScore} pts
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <div className="text-right">
                  <div className="text-xs text-slate-400">Simulated</div>
                  <div className="text-xl font-extrabold font-mono-nums text-slate-900">
                    {result.simulatedHealthScore} pts
                  </div>
                </div>
              </div>
              <div
                className={`mt-2 text-xs font-semibold font-mono-nums flex items-center justify-end gap-1 ${
                  result.healthScoreDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {result.healthScoreDelta >= 0 ? '+' : ''}
                {result.healthScoreDelta} pts impact
              </div>
            </div>
          </div>

          {/* Deep-Dive What-If Analysis Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              What this decision means for your month
            </h4>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="font-medium text-slate-700">Days of safe daily allowance absorbed:</span>
                <span className="font-bold font-mono-nums text-slate-900">
                  {result.verdict.daysOfAllowanceImpact} days of daily spending
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="font-medium text-slate-700">Unpaid commitments protected:</span>
                <span className="font-bold font-mono-nums text-emerald-600">
                  100% (₹{metrics.unpaidCommitments.toLocaleString('en-IN')} fully ring-fenced)
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="font-medium text-slate-700">Goa / Savings goal feasibility:</span>
                <span className="font-bold text-slate-900">
                  {result.simulatedSafeDailyAllowance >= 180 ? 'Fully Feasible' : 'Requires tighter discipline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Confirm & Apply Simulated Decision?"
        message={`Are you sure you want to apply "${title || simType}" for ₹${amount.toLocaleString(
          'en-IN'
        )} into your active financial ledger? This will permanently update your current balance to ${formatINR(
          result.simulatedBalance
        )} and adjust your daily allowance to ${formatINR(
          Math.round(result.simulatedSafeDailyAllowance)
        )}/day.`}
        confirmLabel="Yes, Apply to Ledger"
        cancelLabel="Keep Previewing"
        onConfirm={handleConfirmDecision}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
};
