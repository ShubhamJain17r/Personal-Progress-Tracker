import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { Goal } from '../../types/goal';
import { DayDataPoint } from '../../types/analytics';
import { Card } from '../common/Card';

export interface GoalTrendChartProps {
  goal: Goal;
  data: DayDataPoint[];
}

export const GoalTrendChart: React.FC<GoalTrendChartProps> = ({ goal, data }) => {
  const isBoolean = goal.type === 'boolean';

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Performance Trend
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isBoolean
              ? 'Daily completion status over selected period'
              : `Recorded values vs daily target (${goal.target} ${goal.unit})`}
          </p>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {isBoolean ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 1]}
                ticks={[0, 1]}
                tickFormatter={(val) => (val === 1 ? 'Done' : 'Missed')}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload as DayDataPoint;
                    return (
                      <div className="rounded-xl bg-slate-900 text-white p-3 text-xs shadow-xl border border-slate-800">
                        <p className="font-bold text-slate-200">{d.date}</p>
                        <p className="mt-1 font-semibold text-emerald-400">
                          Status: {d.value >= 1 ? 'Completed 🎉' : 'Not completed'}
                        </p>
                        {d.note && <p className="mt-1 text-slate-400 italic">"{d.note}"</p>}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="value"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                maxBarSize={30}
              />
            </BarChart>
          ) : (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="goalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload as DayDataPoint;
                    return (
                      <div className="rounded-xl bg-slate-900 text-white p-3 text-xs shadow-xl border border-slate-800">
                        <p className="font-bold text-slate-200">{d.date}</p>
                        <p className="mt-1 font-semibold text-sky-400">
                          Recorded: {d.value} {goal.unit} ({d.completionPercentage}%)
                        </p>
                        <p className="text-slate-400">Target: {goal.target} {goal.unit}</p>
                        {d.note && <p className="mt-1 text-amber-300 italic">"{d.note}"</p>}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine
                y={goal.target}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{
                  value: `Target (${goal.target} ${goal.unit})`,
                  fill: '#f59e0b',
                  fontSize: 10,
                  position: 'top',
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#0284c7"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#goalGradient)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
