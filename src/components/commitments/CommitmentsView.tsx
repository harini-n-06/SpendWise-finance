import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Commitment, CommitmentFrequency, Category } from '../../types/finance';
import { formatINR } from '../../utils/calculations';
import {
  CalendarClock,
  Plus,
  CheckCircle2,
  Trash2,
  Calendar,
  ShieldCheck,
  Check,
  X,
  CreditCard,
  RefreshCw,
} from 'lucide-react';
import { ConfirmModal } from '../common/ConfirmModal';

export const CommitmentsView: React.FC = () => {
  const { state, metrics, addCommitment, markCommitmentPaid, deleteCommitment } = useFinance();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('600');
  const [dueDay, setDueDay] = useState('18');
  const [dueDate, setDueDate] = useState('2026-10-18');
  const [category, setCategory] = useState<Category>('Utilities & Bills');
  const [frequency, setFrequency] = useState<CommitmentFrequency>('monthly');

  const unpaidCommitments = state.commitments.filter((c) => !c.isPaid);
  const paidCommitments = state.commitments.filter((c) => c.isPaid);

  const handleSaveCommitment = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    const day = parseInt(dueDay, 10);
    if (!title.trim() || isNaN(val) || val <= 0) return;

    addCommitment({
      title: title.trim(),
      amount: val,
      dueDate,
      dueDayOfCycle: isNaN(day) ? 15 : day,
      category,
      frequency,
    });

    setIsAddOpen(false);
    setTitle('');
    setAmount('600');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-cyan-600" />
            <h2 className="text-xl font-bold text-slate-900">Upcoming Bills & Recurring Subscriptions</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Total unpaid obligations ring-fenced: <strong className="text-slate-900 font-mono-nums">{formatINR(metrics.unpaidCommitments)}</strong>
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#101827] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#B8F36B]" />
          <span>Add Bill or Subscription</span>
        </button>
      </div>

      {/* Explanation Banner on Double-Counting Prevention */}
      <div className="bg-cyan-50/70 border border-cyan-200/80 rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-700 shrink-0 mt-0.5" />
        <div className="text-xs text-cyan-950 leading-relaxed">
          <strong>Zero Double-Counting Protection:</strong> When you click <span className="font-bold underline">Pay</span>, the bill converts into a real expense transaction and leaves the unpaid commitments queue. Your safe daily allowance never experiences a double deduction!
        </div>
      </div>

      {/* Unpaid Commitments Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
          <span>Unpaid Scheduled Bills ({unpaidCommitments.length})</span>
          <span className="font-mono-nums font-extrabold text-slate-900">
            {formatINR(metrics.unpaidCommitments)}
          </span>
        </h3>

        {unpaidCommitments.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/90 text-xs text-emerald-600 font-semibold">
            All scheduled bills for this month cycle have been paid!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unpaidCommitments.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Due Day {item.dueDayOfCycle} ({item.dueDate})</span>
                        <span>·</span>
                        <span className="capitalize">{item.frequency}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setDeletingId(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Cancel or delete bill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="my-3 flex items-baseline justify-between">
                    <span className="text-xs text-slate-500 font-medium">Scheduled Amount:</span>
                    <span className="text-2xl font-black font-mono-nums text-slate-900">
                      {formatINR(item.amount)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Category: {item.category}
                  </span>
                  <button
                    onClick={() => markCommitmentPaid(item.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>Mark as Paid</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paid Commitments History */}
      {paidCommitments.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Paid in This Cycle ({paidCommitments.length})
          </h3>

          <div className="bg-white rounded-3xl border border-slate-200/90 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {paidCommitments.map((p) => (
              <div
                key={p.id}
                className="p-4 sm:px-6 flex items-center justify-between text-xs text-slate-600"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900">{p.title}</div>
                    <div className="text-[11px] text-slate-400">
                      Settled and recorded as expense
                    </div>
                  </div>
                </div>

                <div className="font-mono-nums font-bold text-slate-900">
                  {formatINR(p.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Commitment Modal */}
      {isAddOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Add Bill or Subscription</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCommitment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Bill or Service Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Netflix, Gym, or Electricity Bill"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-mono-nums font-bold focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Due Day of Cycle (1-30)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-mono-nums font-bold focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:ring-2 focus:ring-slate-900"
                >
                  <option value="Utilities & Bills">Utilities & Bills</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Health & Fitness">Health & Fitness</option>
                  <option value="Education & Books">Education & Books</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Frequency
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFrequency('monthly')}
                    className={`py-1.5 text-xs font-bold rounded-lg ${
                      frequency === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Monthly Recurring
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('one-time')}
                    className={`py-1.5 text-xs font-bold rounded-lg ${
                      frequency === 'one-time' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    One-Time Bill
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#101827] hover:bg-slate-800 text-white text-xs font-bold shadow-xs"
                >
                  Save Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete / Cancel Subscription Confirmation */}
      <ConfirmModal
        isOpen={deletingId !== null}
        title="Cancel or Remove Commitment?"
        message="Are you sure you want to remove this commitment from your schedule? It will no longer be subtracted from your safe daily allowance."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          if (deletingId) {
            deleteCommitment(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
