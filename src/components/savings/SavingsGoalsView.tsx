import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { SavingsGoal } from '../../types/finance';
import { formatINR } from '../../utils/calculations';
import {
  Target,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  ShieldCheck,
  Calendar,
  Trash2,
  Edit2,
  X,
  Coins,
} from 'lucide-react';
import { ConfirmModal } from '../common/ConfirmModal';

export const SavingsGoalsView: React.FC = () => {
  const {
    state,
    metrics,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    contributeToGoal,
    withdrawFromGoal,
  } = useFinance();

  // Dialog states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [depositGoal, setDepositGoal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>('500');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states for new/edit goal
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('2000');
  const [targetDate, setTargetDate] = useState('2026-10-31');
  const [notes, setNotes] = useState('');

  const handleOpenCreate = () => {
    setTitle('');
    setTargetAmount('2000');
    setTargetDate('2026-10-31');
    setNotes('');
    setIsCreateModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    if (!title.trim() || isNaN(target) || target <= 0) return;

    if (editingGoal) {
      updateSavingsGoal(editingGoal.id, {
        title: title.trim(),
        targetAmount: target,
        targetDate,
        notes: notes.trim() || undefined,
      });
      setEditingGoal(null);
    } else {
      addSavingsGoal({
        title: title.trim(),
        targetAmount: target,
        targetDate,
        category: 'Savings',
        notes: notes.trim() || undefined,
      });
      setIsCreateModalOpen(false);
    }
  };

  const handleExecuteDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositGoal) return;
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    contributeToGoal(depositGoal.id, amount);
    setDepositGoal(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Savings Goals & Vault</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ring-fenced reserves protected by your safe daily allowance
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-[#101827] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#B8F36B]" />
          <span>New Savings Goal</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Target
          </span>
          <div className="text-2xl font-black font-mono-nums text-slate-900 mt-1">
            {formatINR(metrics.savingsSummary.totalTarget)}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Across {state.savingsGoals.length} goals</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Saved So Far
          </span>
          <div className="text-2xl font-black font-mono-nums text-emerald-600 mt-1">
            {formatINR(metrics.savingsSummary.totalSaved)}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            {metrics.savingsSummary.progressPercent}% of target achieved
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Remaining to Save
          </span>
          <div className="text-2xl font-black font-mono-nums text-indigo-600 mt-1">
            {formatINR(metrics.savingsSummary.remainingRequirement)}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            ~{formatINR(Math.round(metrics.savingsSummary.remainingRequirement / metrics.daysRemaining))}/day over {metrics.daysRemaining} days
          </div>
        </div>
      </div>

      {/* Goals Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {state.savingsGoals.map((goal) => {
          const percent = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100)) : 0;
          const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
          const isComplete = goal.savedAmount >= goal.targetAmount;
          const isFeasible = metrics.safeDailyAllowance >= (remaining / metrics.daysRemaining);

          return (
            <div
              key={goal.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{goal.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Target: {goal.targetDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingGoal(goal);
                        setTitle(goal.title);
                        setTargetAmount(goal.targetAmount.toString());
                        setTargetDate(goal.targetDate);
                        setNotes(goal.notes || '');
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(goal.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 my-4">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Progress: {percent}%</span>
                    <span className="font-mono-nums font-bold">
                      {formatINR(goal.savedAmount)} / {formatINR(goal.targetAmount)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#101827] h-full rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Feasibility Indicator */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Goal Feasibility:</span>
                  <span
                    className={`font-bold flex items-center gap-1 ${
                      isComplete
                        ? 'text-emerald-600'
                        : isFeasible
                        ? 'text-emerald-700'
                        : 'text-amber-600'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {isComplete ? 'Goal Achieved!' : isFeasible ? 'High Feasibility' : 'Requires Extra Cushion'}
                  </span>
                </div>
              </div>

              {/* Actions: Deposit / Withdraw */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={() => {
                    setDepositGoal(goal);
                    setDepositAmount('500');
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#101827] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Coins className="w-3.5 h-3.5 text-[#B8F36B]" />
                  <span>Deposit Funds</span>
                </button>

                {goal.savedAmount > 0 && (
                  <button
                    onClick={() => withdrawFromGoal(goal.id, Math.min(goal.savedAmount, 500))}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                    title="Transfer ₹500 back to active balance"
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deposit Modal */}
      {depositGoal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Deposit to {depositGoal.title}
              </h3>
              <button
                onClick={() => setDepositGoal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteDeposit} className="space-y-4">
              <p className="text-xs text-slate-600">
                Transfers money from your active cash balance into this ring-fenced savings goal.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Deposit Amount (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  max={metrics.balance}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-mono-nums font-bold focus:ring-2 focus:ring-slate-900"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Available in balance: {formatINR(metrics.balance)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDepositGoal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#101827] hover:bg-slate-800 text-white text-xs font-bold shadow-xs"
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create / Edit Goal Modal */}
      {(isCreateModalOpen || editingGoal) && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingGoal ? 'Edit Savings Goal' : 'Create Savings Goal'}
              </h3>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingGoal(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Goa Trip or Emergency Fund"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  min="100"
                  required
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-mono-nums font-bold focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="Optional goal details"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingGoal(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#101827] hover:bg-slate-800 text-white text-xs font-bold shadow-xs"
                >
                  {editingGoal ? 'Save Changes' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Goal Modal */}
      <ConfirmModal
        isOpen={deletingId !== null}
        title="Delete Savings Goal?"
        message="Are you sure you want to delete this savings goal? Its required target will be removed from future calculations."
        confirmLabel="Delete Goal"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          if (deletingId) {
            deleteSavingsGoal(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
