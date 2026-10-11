import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../utils/calculations';
import { CalendarClock, Check, ArrowUpRight } from 'lucide-react';

interface UpcomingCommitmentsWidgetProps {
  onNavigateToCommitments: () => void;
}

export const UpcomingCommitmentsWidget: React.FC<UpcomingCommitmentsWidgetProps> = ({
  onNavigateToCommitments,
}) => {
  const { state, markCommitmentPaid } = useFinance();
  const unpaid = state.commitments.filter((c) => !c.isPaid);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-slate-500" />
              <h3 className="text-base font-bold text-slate-900">Upcoming Bills</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Scheduled commitments protected in safe allowance
            </p>
          </div>

          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {unpaid.length} Due
          </span>
        </div>

        {unpaid.length === 0 ? (
          <div className="py-8 text-center text-xs text-emerald-600 font-medium">
            All scheduled bills for this cycle are paid!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {unpaid.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span>Due Day {item.dueDayOfCycle}</span>
                    <span>·</span>
                    <span>{item.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold font-mono-nums text-slate-900">
                    {formatINR(item.amount)}
                  </span>
                  <button
                    onClick={() => markCommitmentPaid(item.id)}
                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                    title="Mark bill as paid (converts to expense without double counting)"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Pay</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
        <span className="text-xs text-slate-400 font-medium">
          Zero double-counting on payment
        </span>
        <button
          onClick={onNavigateToCommitments}
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors"
        >
          <span>Manage all bills</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
