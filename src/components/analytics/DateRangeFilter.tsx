import React from 'react';
import { DateRange, DateRangePreset } from '../../types/analytics';
import { getPresetDateRange } from '../../utils/dates';
import { clsx } from 'clsx';

export interface DateRangeFilterProps {
  selectedPreset: DateRangePreset;
  customRange: DateRange;
  onPresetSelect: (preset: DateRangePreset, range: DateRange) => void;
  onCustomRangeChange: (range: DateRange) => void;
}

const PRESETS: { id: DateRangePreset; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'this_week', label: 'This Week' },
  { id: 'last_week', label: 'Last Week' },
  { id: 'this_month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
  { id: 'last_30_days', label: 'Last 30 Days' },
  { id: 'last_90_days', label: 'Last 90 Days' },
  { id: 'this_year', label: 'This Year' },
  { id: 'custom', label: 'Custom Range' },
];

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  selectedPreset,
  customRange,
  onPresetSelect,
  onCustomRangeChange,
}) => {
  const handlePresetClick = (preset: DateRangePreset) => {
    if (preset === 'custom') {
      onPresetSelect('custom', customRange);
    } else {
      const range = getPresetDateRange(preset);
      onPresetSelect(preset, range);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 flex-wrap">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => handlePresetClick(p.id)}
            className={clsx(
              'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150',
              selectedPreset === p.id
                ? 'bg-brand-600 text-white shadow-xs dark:bg-brand-500'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {selectedPreset === 'custom' && (
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Start:
            </span>
            <input
              type="date"
              value={customRange.startDate}
              onChange={(e) =>
                e.target.value &&
                onCustomRangeChange({ ...customRange, startDate: e.target.value })
              }
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              End:
            </span>
            <input
              type="date"
              value={customRange.endDate}
              onChange={(e) =>
                e.target.value &&
                onCustomRangeChange({ ...customRange, endDate: e.target.value })
              }
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
