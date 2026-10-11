import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../utils/calculations';
import {
  PieChart as PieIcon,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Check,
  X,
  Plus,
} from 'lucide-react';

export const BudgetPlannerView: React.FC = () => {
  const { state, metrics, updateCategoryBudget } = useFinance();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const totalAllocated = state.budgetCategories.reduce((sum, c) => sum + c.allocatedAmount, 0);
  const startingBudget = state.settings.startingBudget;
  const unallocated = startingBudget - totalAllocated;

  const handleStartEdit = (id: string, currentAmount: number) => {
    setEditingId(id);
    setEditValue(currentAmount.toString());
  };

  const handleSaveEdit = (id: string) => {
    const val = parseFloat(editValue);
    if (!isNaN(val) && val >= 0) {
      updateCategoryBudget(id, Math.round(val));
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Category Budget Planner</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Distribute your ₹{startingBudget.toLocaleString('en-IN')} cycle budget across spending categories
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono-nums">
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Total Planned
              </span>
              <span className="text-base font-extrabold text-slate-900">
                {formatINR(totalAllocated)}
              </span>
            </div>

            <div className="text-right pl-4 border-l border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Unallocated
              </span>
              <span
                className={`text-base font-extrabold ${
                  unallocated === 0
                    ? 'text-emerald-600'
                    : unallocated > 0
                    ? 'text-slate-600'
                    : 'text-rose-600'
                }`}
              >
                {formatINR(unallocated)}
              </span>
            </div>
          </div>
        </div>

        {/* Global Progress Strip */}
        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-700">
            <span>Overall Budget Allocation Progress</span>
            <span className="font-mono-nums">
              {formatINR(metrics.totalExpenses)} spent of {formatINR(totalAllocated)} planned ({Math.round((metrics.totalExpenses / totalAllocated) * 100)}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
            {metrics.categorySpending.map((cat) => {
              const width = totalAllocated > 0 ? (cat.spent / totalAllocated) * 100 : 0;
              return (
                <div
                  key={cat.category}
                  style={{ width: `${width}%`, backgroundColor: cat.color }}
                  className="h-full transition-all"
                  title={`${cat.category}: ${formatINR(cat.spent)}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.categorySpending.map((item) => {
          const isOver = item.spent > item.allocated;
          const isNear = item.percentUsed >= 80 && !isOver;
          const isEditing = editingId === item.category;

          return (
            <div
              key={item.category}
              className={`bg-white rounded-3xl p-6 border shadow-xs transition-all ${
                isOver
                  ? 'border-rose-200 ring-1 ring-rose-200'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-lg shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.category}</h3>
                    <span className="text-[11px] text-slate-400">
                      {isOver ? 'Over budget' : `${formatINR(item.remaining)} remaining`}
                    </span>
                  </div>
                </div>

                {/* Edit Cap Button */}
                <div className="flex items-center gap-1.5">
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-20 px-2 py-1 text-xs font-mono font-bold rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900"
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          const bc = state.budgetCategories.find((b) => b.category === item.category);
                          if (bc) handleSaveEdit(bc.id);
                        }}
                        className="p-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(item.category, item.allocated)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit planned cap"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 my-3">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isOver
                        ? 'bg-rose-500'
                        : isNear
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, item.percentUsed)}%` }}
                  />
                </div>
              </div>

              {/* Numbers Row */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="text-slate-500">
                  Spent:{' '}
                  <strong className="text-slate-900 font-mono-nums font-bold">
                    {formatINR(item.spent)}
                  </strong>
                </div>
                <div className="text-slate-500">
                  Cap:{' '}
                  <strong className="text-slate-900 font-mono-nums font-bold">
                    {formatINR(item.allocated)}
                  </strong>
                </div>
                <div
                  className={`font-mono-nums font-bold ${
                    isOver ? 'text-rose-600' : isNear ? 'text-amber-600' : 'text-slate-600'
                  }`}
                >
                  {item.percentUsed}%
                </div>
              </div>

              {/* Alert Badge if Over */}
              {isOver && (
                <div className="mt-3 p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Exceeded cap by {formatINR(item.spent - item.allocated)}. Reallocate from another category.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
