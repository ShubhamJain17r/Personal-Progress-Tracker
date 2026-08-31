import {
  format,
  parseISO,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  subWeeks,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  isToday,
  isYesterday,
  isValid,
  getDay,
  getDate,
} from 'date-fns';
import { DateRange, DateRangePreset } from '../types/analytics';
import { Goal } from '../types/goal';

export function getTodayDateString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatDisplayDate(dateStr: string, formatStr: string = 'EEE, MMM d, yyyy'): string {
  if (!dateStr) return '';
  const parsed = parseISO(dateStr);
  if (!isValid(parsed)) return dateStr;
  return format(parsed, formatStr);
}

export function getFriendlyDateLabel(dateStr: string): string {
  const parsed = parseISO(dateStr);
  if (!isValid(parsed)) return dateStr;
  if (isToday(parsed)) return 'Today';
  if (isYesterday(parsed)) return 'Yesterday';
  return format(parsed, 'MMM d, yyyy');
}

export function shiftDateString(dateStr: string, days: number): string {
  const parsed = parseISO(dateStr);
  if (!isValid(parsed)) return dateStr;
  const shifted = subDays(parsed, -days);
  return format(shifted, 'yyyy-MM-dd');
}

export function getDateIntervalArray(startDate: string, endDate: string): string[] {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  if (!isValid(start) || !isValid(end) || start > end) {
    return [startDate];
  }
  const interval = eachDayOfInterval({ start, end });
  return interval.map((d) => format(d, 'yyyy-MM-dd'));
}

/**
 * Checks whether a specific goal is scheduled to be performed on a given calendar date
 * - daily: every day
 * - weekly: Sundays only (dayOfWeek === 0)
 * - weekdays: Monday through Friday (dayOfWeek 1 to 5)
 * - weekends: Saturday and Sunday (dayOfWeek 0 or 6)
 * - monthly: 1st of the month
 */
export function isGoalScheduledForDate(goal: Pick<Goal, 'frequency'>, dateStr: string): boolean {
  if (!dateStr) return true;
  const parsed = parseISO(dateStr);
  if (!isValid(parsed)) return true;

  const dayOfWeek = getDay(parsed); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const dayOfMonth = getDate(parsed); // 1 - 31

  switch (goal.frequency) {
    case 'weekly':
      return dayOfWeek === 0; // Weekly tasks only show up on Sundays

    case 'weekdays':
      return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday - Friday

    case 'weekends':
      return dayOfWeek === 0 || dayOfWeek === 6; // Saturday & Sunday

    case 'monthly':
      return dayOfMonth === 1; // 1st of each month

    case 'daily':
    default:
      return true;
  }
}

/**
 * Gets all dates within an interval where a goal is scheduled to run
 */
export function getScheduledDatesForGoal(
  goal: Pick<Goal, 'frequency'>,
  startDate: string,
  endDate: string
): string[] {
  const allDates = getDateIntervalArray(startDate, endDate);
  return allDates.filter((d) => isGoalScheduledForDate(goal, d));
}

export function getPresetDateRange(preset: DateRangePreset, refDate: Date = new Date()): DateRange {
  const todayStr = format(refDate, 'yyyy-MM-dd');

  switch (preset) {
    case 'today':
      return { startDate: todayStr, endDate: todayStr };

    case 'yesterday': {
      const yesterdayStr = format(subDays(refDate, 1), 'yyyy-MM-dd');
      return { startDate: yesterdayStr, endDate: yesterdayStr };
    }

    case 'this_week': {
      const start = format(startOfWeek(refDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      const end = format(endOfWeek(refDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      return { startDate: start, endDate: end };
    }

    case 'last_week': {
      const prevWeek = subWeeks(refDate, 1);
      const start = format(startOfWeek(prevWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      const end = format(endOfWeek(prevWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      return { startDate: start, endDate: end };
    }

    case 'this_month': {
      const start = format(startOfMonth(refDate), 'yyyy-MM-dd');
      const end = format(endOfMonth(refDate), 'yyyy-MM-dd');
      return { startDate: start, endDate: end };
    }

    case 'last_month': {
      const prevMonth = subMonths(refDate, 1);
      const start = format(startOfMonth(prevMonth), 'yyyy-MM-dd');
      const end = format(endOfMonth(prevMonth), 'yyyy-MM-dd');
      return { startDate: start, endDate: end };
    }

    case 'last_7_days': {
      const start = format(subDays(refDate, 6), 'yyyy-MM-dd');
      return { startDate: start, endDate: todayStr };
    }

    case 'last_30_days': {
      const start = format(subDays(refDate, 29), 'yyyy-MM-dd');
      return { startDate: start, endDate: todayStr };
    }

    case 'last_90_days': {
      const start = format(subDays(refDate, 89), 'yyyy-MM-dd');
      return { startDate: start, endDate: todayStr };
    }

    case 'this_year': {
      const start = format(startOfYear(refDate), 'yyyy-MM-dd');
      const end = format(endOfYear(refDate), 'yyyy-MM-dd');
      return { startDate: start, endDate: end };
    }

    case 'custom':
    default:
      return { startDate: format(subDays(refDate, 29), 'yyyy-MM-dd'), endDate: todayStr };
  }
}
