import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDisplayDate, getTodayDateString, shiftDateString } from '../../utils/dates';
import { Button } from '../common/Button';

export interface DateNavigatorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const DateNavigator: React.FC<DateNavigatorProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const today = getTodayDateString();
  const isToday = selectedDate === today;

  const handlePrevDay = () => {
    onDateChange(shiftDateString(selectedDate, -1));
  };

  const handleNextDay = () => {
    onDateChange(shiftDateString(selectedDate, 1));
  };

  const handleToday = () => {
    onDateChange(today);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevDay}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Previous Day"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="px-3 text-center">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {formatDisplayDate(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {isToday ? "Today's Log" : 'Historical Log'}
          </span>
        </div>

        <button
          onClick={handleNextDay}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Next Day"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        {!isToday && (
          <Button variant="secondary" size="sm" onClick={handleToday}>
            Jump to Today
          </Button>
        )}

        <div className="relative flex items-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => e.target.value && onDateChange(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
