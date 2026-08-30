import React from 'react';
import { parseISO, getDay } from 'date-fns';
import { Card } from '../common/Card';
import { clsx } from 'clsx';

export interface HeatmapItem {
  date: string;
  rate: number;
  completed: number;
  total: number;
}

export interface HeatmapCalendarProps {
  data: HeatmapItem[];
  onSelectDate?: (date: string) => void;
}

export const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({
  data,
  onSelectDate,
}) => {
  const getColorClass = (item?: HeatmapItem) => {
    if (!item || item.total === 0 || item.completed === 0) {
      return 'bg-slate-100 dark:bg-slate-800/80 hover:ring-1 hover:ring-slate-400';
    }
    const rate = item.rate;
    if (rate >= 100) return 'bg-emerald-500 hover:ring-2 hover:ring-emerald-400';
    if (rate >= 66) return 'bg-emerald-600/80 hover:ring-2 hover:ring-emerald-500';
    if (rate >= 33) return 'bg-emerald-700/60 hover:ring-2 hover:ring-emerald-600';
    return 'bg-emerald-900/40 hover:ring-1 hover:ring-emerald-700';
  };

  const columns: HeatmapItem[][] = [];
  let currentColumn: HeatmapItem[] = [];

  if (data.length > 0) {
    const firstDayOfWeek = getDay(parseISO(data[0].date));
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentColumn.push({ date: '', rate: 0, completed: 0, total: 0 });
    }
  }

  for (const item of data) {
    currentColumn.push(item);
    if (currentColumn.length === 7) {
      columns.push(currentColumn);
      currentColumn = [];
    }
  }

  if (currentColumn.length > 0) {
    while (currentColumn.length < 7) {
      currentColumn.push({ date: '', rate: 0, completed: 0, total: 0 });
    }
    columns.push(currentColumn);
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Daily Consistency Heatmap
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Activity intensity and goal achievement over time
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800" />
          <div className="w-3 h-3 rounded-sm bg-emerald-900/40" />
          <div className="w-3 h-3 rounded-sm bg-emerald-700/60" />
          <div className="w-3 h-3 rounded-sm bg-emerald-600/80" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1.5 min-w-max">
          {columns.map((week, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-1.5">
              {week.map((day, rowIdx) => {
                if (!day.date) {
                  return (
                    <div
                      key={rowIdx}
                      className="w-3.5 h-3.5 rounded-sm opacity-0 pointer-events-none"
                    />
                  );
                }

                return (
                  <button
                    key={rowIdx}
                    onClick={() => onSelectDate && onSelectDate(day.date)}
                    title={`${day.date}: ${day.rate}% completed (${day.completed}/${day.total} goals)`}
                    className={clsx(
                      'w-3.5 h-3.5 rounded-sm transition-all cursor-pointer',
                      getColorClass(day)
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
