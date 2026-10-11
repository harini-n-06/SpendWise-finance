import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../utils/calculations';
import { PieChart as PieIcon, ArrowUpRight } from 'lucide-react';

interface SpendingBreakdownChartProps {
  onNavigateToBudget?: () => void;
}

export const SpendingBreakdownChart: React.FC<SpendingBreakdownChartProps> = ({ onNavigateToBudget }) => {
  const { metrics } = useFinance();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeCategories = metrics.categorySpending
    .filter((c) => c.spent > 0)
    .sort((a, b) => b.spent - a.spent);

  const totalSpent = metrics.totalExpenses;

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percent = totalSpent > 0 ? ((data.spent / totalSpent) * 100).toFixed(1) : 0;
      return (
        <div className="bg-[#101827] text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs font-medium">
          <div className="font-bold mb-1 text-slate-200">{data.category}</div>
          <div className="text-[#B8F36B] font-mono-nums text-sm font-bold">
            {formatINR(data.spent)}
          </div>
          <div className="text-slate-400 mt-1">
            {percent}% of ₹{totalSpent.toLocaleString('en-IN')} total spent
          </div>
          <div className="text-slate-400">
            Cap: {formatINR(data.allocated)} ({data.percentUsed}% used)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-slate-500" />
            <h3 className="text-base font-bold text-slate-900">Spending Breakdown</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Where your ₹{totalSpent.toLocaleString('en-IN')} has gone so far
          </p>
        </div>

        {onNavigateToBudget && (
          <button
            onClick={onNavigateToBudget}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors"
          >
            <span>Planner</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {activeCategories.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
          No expenses recorded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Donut Chart */}
          <div className="md:col-span-6 h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activeCategories}
                  dataKey="spent"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {activeCategories.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                      className="transition-opacity duration-200 outline-hidden"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label in Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Spent</span>
              <span className="text-lg font-black text-slate-900 font-mono-nums">
                {formatINR(totalSpent)}
              </span>
            </div>
          </div>

          {/* Category List */}
          <div className="md:col-span-6 space-y-2">
            {activeCategories.map((cat, idx) => {
              const share = totalSpent > 0 ? Math.round((cat.spent / totalSpent) * 100) : 0;
              return (
                <div
                  key={cat.category}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                    activeIndex === idx ? 'bg-slate-100' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-semibold text-slate-800 truncate">
                      {cat.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 font-mono-nums">
                    <span className="font-bold text-slate-900">{formatINR(cat.spent)}</span>
                    <span className="text-slate-400 text-[11px] w-9 text-right font-normal">
                      {share}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
