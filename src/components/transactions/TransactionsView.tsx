import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Transaction, Category, TransactionType } from '../../types/finance';
import { formatINR } from '../../utils/calculations';
import {
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Trash2,
  Edit2,
  Calendar,
  X,
} from 'lucide-react';
import { TransactionModal } from './TransactionModal';
import { ConfirmModal } from '../common/ConfirmModal';

interface TransactionsViewProps {
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  isAddModalOpen = false,
  onCloseAddModal,
}) => {
  const { state, metrics, addTransaction, updateTransaction, deleteTransaction } = useFinance();

  // Local state
  const [internalAddOpen, setInternalAddOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  const showModal = isAddModalOpen || internalAddOpen || editingTransaction !== null;

  const handleCloseModal = () => {
    setInternalAddOpen(false);
    setEditingTransaction(null);
    if (onCloseAddModal) onCloseAddModal();
  };

  const handleSaveTransaction = (data: {
    title: string;
    amount: number;
    type: TransactionType;
    category: Category;
    date: string;
    notes?: string;
  }) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
    } else {
      addTransaction(data);
    }
  };

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    return state.transactions
      .filter((t) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = t.title.toLowerCase().includes(q);
          const matchesCategory = t.category.toLowerCase().includes(q);
          const matchesNotes = t.notes?.toLowerCase().includes(q);
          const matchesAmount = t.amount.toString().includes(q);
          if (!matchesTitle && !matchesCategory && !matchesNotes && !matchesAmount) {
            return false;
          }
        }
        // Type
        if (typeFilter !== 'all' && t.type !== typeFilter) {
          return false;
        }
        // Category
        if (categoryFilter !== 'all' && t.category !== categoryFilter) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.date).getTime() - new Date(a.date).getTime() || b.dayOfCycle - a.dayOfCycle;
        }
        if (sortBy === 'date-asc') {
          return new Date(a.date).getTime() - new Date(b.date).getTime() || a.dayOfCycle - b.dayOfCycle;
        }
        if (sortBy === 'amount-desc') {
          return b.amount - a.amount;
        }
        if (sortBy === 'amount-asc') {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [state.transactions, searchQuery, typeFilter, categoryFilter, sortBy]);

  const allCategories: Category[] = [
    'Food & Dining',
    'Groceries',
    'Commute & Transit',
    'Entertainment',
    'Shopping & Style',
    'Health & Fitness',
    'Utilities & Bills',
    'Education & Books',
    'Savings Transfer',
    'Freelance / Income',
    'Other',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Ledger Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Recorded Transactions</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {state.transactions.length} total entries · Total Spent: <strong className="text-slate-900 font-mono-nums">{formatINR(metrics.totalExpenses)}</strong>
          </p>
        </div>

        <button
          onClick={() => setInternalAddOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#101827] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#B8F36B]" />
          <span>Record Transaction</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, notes, or ₹ amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Segmented Buttons */}
          <div className="sm:col-span-3 flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setTypeFilter('all')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                typeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                typeFilter === 'expense'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                typeFilter === 'income'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Income
            </button>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
            >
              <option value="all">All Categories</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="sm:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Amount: High to Low</option>
              <option value="amount-asc">Amount: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            <div className="font-semibold text-slate-600 mb-1">No transactions match your criteria</div>
            <p className="text-xs">Try clearing filters or search query.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTransactions.map((tx) => {
              const isExpense = tx.type === 'expense';
              return (
                <div
                  key={tx.id}
                  className="p-4 sm:px-6 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        isExpense ? 'bg-slate-100 text-slate-700' : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {isExpense ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {tx.title}
                      </div>
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span className="font-medium text-slate-700">{tx.category}</span>
                        <span>·</span>
                        <span>{tx.date}</span>
                        <span>·</span>
                        <span>Day {tx.dayOfCycle}</span>
                        {tx.notes && (
                          <>
                            <span>·</span>
                            <span className="italic text-slate-400 truncate max-w-xs">{tx.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Amount and Actions */}
                  <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                    <div className="text-right">
                      <div
                        className={`text-base font-extrabold font-mono-nums ${
                          isExpense ? 'text-slate-900' : 'text-emerald-600'
                        }`}
                      >
                        {isExpense ? '-' : '+'}
                        {formatINR(tx.amount)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingTransaction(tx)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit transaction"
                        aria-label="Edit transaction"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(tx.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete transaction"
                        aria-label="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transaction Modal (Add/Edit) */}
      <TransactionModal
        isOpen={showModal}
        initialTransaction={editingTransaction}
        onClose={handleCloseModal}
        onSave={handleSaveTransaction}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deletingId !== null}
        title="Delete Transaction?"
        message="Are you sure you want to remove this transaction? Your current balance, safe daily allowance, and month-end forecast will update immediately."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          if (deletingId) {
            deleteTransaction(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
