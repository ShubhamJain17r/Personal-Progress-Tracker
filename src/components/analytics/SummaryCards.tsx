import React from 'react';
import { Card } from '../common/Card';
import { MetricSummary } from '../../types/analytics';
import {
  TrendingUp,
  Target,
  Flame,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from 'lucide-react';

export interface SummaryCardsProps {
  summary: MetricSummary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const isMeasurement = summary.type === 'measurement';

  if (isMeasurement) {
    const change = summary.changeValue ?? 0;
    const isPositiveChange = change > 0;
    const isZeroChange = change === 0;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Latest Value Card */}
        <Card className="p-4 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Latest Logged
            </span>
            <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {summary.latestValue !== undefined && summary.latestValue > 0
                ? `${summary.latestValue.toLocaleString()} ${summary.unit}`
                : 'No logs yet'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {summary.target > 0
                ? `Target: ${summary.target} ${summary.unit}`
                : 'Free tracking mode'}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
        </Card>

        {/* Change / Delta Card */}
        <Card className="p-4 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Period Change (Δ)
            </span>
            <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {isZeroChange
                ? `0 ${summary.unit}`
                : `${isPositiveChange ? '+' : ''}${change} ${summary.unit}`}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              From initial {summary.initialValue} {summary.unit}
            </p>
          </div>
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              isZeroChange
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                : isPositiveChange
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
            }`}
          >
            {isPositiveChange ? (
              <ArrowUpRight className="w-5 h-5" />
            ) : (
              <ArrowDownRight className="w-5 h-5" />
            )}
          </div>
        </Card>

        {/* Average Card */}
        <Card className="p-4 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Average Recorded
            </span>
            <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {summary.averageValue.toLocaleString()} {summary.unit}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Across all entries in range
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </Card>

        {/* Min / Max Range Card */}
        <Card className="p-4 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Recorded Range
            </span>
            <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {summary.minValue} - {summary.maxValue} {summary.unit}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Min to Max recorded
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
        </Card>
      </div>
    );
  }

  const cards = [
    {
      label: 'Completion Rate',
      value: `${summary.completionRate}%`,
      subtext: `${summary.completedDays} of ${summary.totalScheduledDays} days met`,
      icon: Target,
      color: 'text-brand-600 dark:text-brand-400',
      bg: 'bg-brand-50 dark:bg-brand-950/40',
    },
    {
      label: 'Current Streak',
      value: `${summary.currentStreak} Days`,
      subtext: `Best: ${summary.bestStreak} days`,
      icon: Flame,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
    },
    {
      label: summary.type === 'boolean' ? 'Completed Days' : 'Total Recorded',
      value:
        summary.type === 'boolean'
          ? `${summary.completedDays} Days`
          : `${summary.totalValue.toLocaleString()} ${summary.unit}`,
      subtext:
        summary.type === 'boolean'
          ? `Missed: ${summary.missedDays} days`
          : `Avg: ${summary.averageValue} ${summary.unit}/day`,
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    ...(summary.type !== 'boolean'
      ? [
          {
            label: 'Min / Max Daily',
            value: `${summary.minValue} - ${summary.maxValue}`,
            subtext: `Target: ${summary.target} ${summary.unit}`,
            icon: Layers,
            color: 'text-purple-600 dark:text-purple-400',
            bg: 'bg-purple-50 dark:bg-purple-950/40',
          },
        ]
      : []),
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="p-4 flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {card.label}
              </span>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {card.value}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {card.subtext}
              </p>
            </div>

            <div className={`p-2.5 rounded-xl ${card.bg} ${card.color} shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
          </Card>
        );
      })}
    </div>
  );
};
