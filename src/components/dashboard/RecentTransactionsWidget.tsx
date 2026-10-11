import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../utils/calculations';
import { ArrowLeftRight, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface RecentTransactionsWidgetProps {
  onNavigateToTransactions: () => void;
  onOpenAddModal: () => void;
}

export const RecentTransactionsWidget: React.FC<RecentTransactionsWidgetProps> = ({
  onNavigateToTransactions,
  onOpenAddModal,
}) => {
  const { state } = useFinance();
  const recent = state.transactions.slice(0, 5);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-slate-500" />
              <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest recorded activity in this 30-day cycle
            </p>
          </div>

          <button
            onClick={onOpenAddModal}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No transactions recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recent.map((tx) => {
              const isExpense = tx.type === 'expense';
              return (
                <div key={tx.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 truncate">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isExpense ? 'bg-slate-100 text-slate-700' : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {isExpense ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4" />
                      )}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {tx.title}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <span>{tx.category}</span>
                        <span>·</span>
                        <span>Day {tx.dayOfCycle}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`text-xs font-bold font-mono-nums ${
                        isExpense ? 'text-slate-900' : 'text-emerald-600'
                      }`}
                    >
                      {isExpense ? '-' : '+'}
                      {formatINR(tx.amount)}
                    </div>
                    <div className="text-[10px] text-slate-400">{tx.date}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
        <span className="text-xs text-slate-400 font-medium">
          {state.transactions.length} total entries
        </span>
        <button
          onClick={onNavigateToTransactions}
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors"
        >
          <span>View all transactions</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
