import React from 'react';
import { Flame, CheckCircle2, Award } from 'lucide-react';
import { Card } from '../common/Card';
import { clsx } from 'clsx';

export interface DailyProgressCardProps {
  completedGoalsCount: number;
  totalGoalsCount: number;
  overallStreak: number;
  dateLabel: string;
}

export const DailyProgressCard: React.FC<DailyProgressCardProps> = ({
  completedGoalsCount,
  totalGoalsCount,
  overallStreak,
  dateLabel,
}) => {
  const percentage =
    totalGoalsCount > 0 ? Math.round((completedGoalsCount / totalGoalsCount) * 100) : 0;

  const size = 110;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const isPerfect = totalGoalsCount > 0 && completedGoalsCount >= totalGoalsCount;

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 text-white border-slate-800 p-6 shadow-md">
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {dateLabel} Overview
            </span>
            {isPerfect && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                <Award className="w-3.5 h-3.5" /> Perfect Day
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {isPerfect
              ? 'All Goals Completed! 🎉'
              : percentage > 50
              ? 'Great momentum today!'
              : 'Keep going, you got this!'}
          </h2>

          <div className="flex items-center gap-6 pt-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-slate-200">
                {completedGoalsCount} of {totalGoalsCount} completed
              </span>
            </div>

            {overallStreak > 0 && (
              <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-xl text-amber-300">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold">
                  {overallStreak} Day Streak
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center shrink-0 self-center">
          <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="rotate-[-90deg]">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={clsx(
                  'transition-all duration-700 ease-out',
                  isPerfect ? 'text-emerald-500' : 'text-brand-500'
                )}
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white">{percentage}%</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Done
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
