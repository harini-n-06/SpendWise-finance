import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { generate30DayTrajectory, formatINR } from '../../utils/calculations';
import { TrendingUp, Info } from 'lucide-react';

export const ForecastTrajectoryChart: React.FC = () => {
  const { state, metrics } = useFinance();
  const trajectoryData = generate30DayTrajectory(state);
  const { currentDay } = state.settings;

  // Custom chart tooltip
  const CustomTrajectoryTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPastOrToday = data.day <= currentDay;
      return (
        <div className="bg-[#101827] text-white p-3.5 rounded-2xl shadow-xl border border-slate-800 text-xs font-medium min-w-[180px]">
          <div className="flex items-center justify-between text-slate-400 mb-1.5 pb-1 border-b border-slate-800">
            <span className="font-bold text-white">Day {data.day} of 30</span>
            <span className="text-[10px] uppercase font-bold text-[#B8F36B]">
              {data.isToday ? 'Today' : isPastOrToday ? 'Recorded' : 'Projected'}
            </span>
          </div>

          <div className="space-y-1 font-mono-nums">
            <div className="flex justify-between">
              <span className="text-slate-400">Balance:</span>
              <span className="font-bold text-white">
                {formatINR(data.projectedBalance)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cumulative Spend:</span>
              <span className="text-slate-300">
                {formatINR(data.cumulativeSpend)}
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 pt-1">
              <span>Planned Safe Ceiling:</span>
              <span>{formatINR(data.safeCeilingBalance)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
            <h3 className="text-base font-bold text-slate-900">30-Day Budget Trajectory</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Actual balance through Day {currentDay} & modeled runway to Day 30
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#101827] rounded-full inline-block" />
            <span>Balance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#B8F36B] rounded-full inline-block" />
            <span>Target Runway</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trajectoryData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#101827" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#101827" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              interval={4}
              tickFormatter={(day) => `D${day}`}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickFormatter={(val) => `₹${val / 1000}k`}
              domain={[0, 10500]}
            />
            <Tooltip content={<CustomTrajectoryTooltip />} />
            
            {/* Reference Line for Current Day */}
            <ReferenceLine
              x={currentDay}
              stroke="#B8F36B"
              strokeWidth={2}
              strokeDasharray="4 4"
              label={{
                value: `Today (D${currentDay})`,
                position: 'insideTopRight',
                fill: '#101827',
                fontSize: 10,
                fontWeight: 700,
              }}
            />

            {/* Target Ceiling Line */}
            <Area
              type="monotone"
              dataKey="safeCeilingBalance"
              stroke="#B8F36B"
              strokeWidth={1.5}
              fill="transparent"
              strokeDasharray="3 3"
              dot={false}
            />

            {/* Actual / Modeled Balance Area */}
            <Area
              type="monotone"
              dataKey="projectedBalance"
              stroke="#101827"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#balanceGrad)"
              activeDot={{ r: 5, fill: '#101827', stroke: '#B8F36B', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Day 30 Projected Balance: <strong className="text-slate-900 font-mono-nums">{formatINR(Math.round(metrics.forecast.projectedBalance))}</strong></span>
        </div>
        <span className="font-medium text-emerald-600">On Track</span>
      </div>
    </div>
  );
};
