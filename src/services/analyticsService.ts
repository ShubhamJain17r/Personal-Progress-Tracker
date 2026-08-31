import { format, parseISO } from 'date-fns';
import { Goal } from '../types/goal';
import { DailyRecord } from '../types/record';
import { Category } from '../types/category';
import {
  DateRange,
  DayDataPoint,
  MetricSummary,
  OverallSummary,
  CategoryBreakdown,
} from '../types/analytics';
import { calculateCappedProgress, isGoalCompleted } from '../utils/calculations';
import { getDateIntervalArray, isGoalScheduledForDate, getScheduledDatesForGoal } from '../utils/dates';
import { calculateGoalStreaks } from '../utils/streaks';

export const analyticsService = {
  /**
   * Generates time-series day data points for a specific goal over a date range
   */
  getGoalTimeSeries(
    goal: Goal,
    records: DailyRecord[],
    dateRange: DateRange
  ): DayDataPoint[] {
    const dates = getDateIntervalArray(dateRange.startDate, dateRange.endDate);
    const recordMap = new Map<string, DailyRecord>();

    for (const r of records) {
      if (r.goalId === goal.id) {
        recordMap.set(r.date, r);
      }
    }

    const isMeasurement = goal.type === 'measurement';
    let lastKnownVal = 0;

    return dates.map((dateStr) => {
      const rec = recordMap.get(dateStr);
      let val = rec ? rec.value : 0;

      if (rec && rec.value > 0) {
        lastKnownVal = rec.value;
      }

      const completed = rec ? rec.completed : false;
      const completionPercentage = calculateCappedProgress(goal.target, val, goal.type);

      const parsedDate = parseISO(dateStr);
      const displayDate = format(parsedDate, 'MMM d');

      return {
        date: dateStr,
        displayDate,
        value: val > 0 ? val : (isMeasurement && lastKnownVal > 0 ? lastKnownVal : val),
        target: goal.target,
        completed,
        completionPercentage,
        note: rec?.note,
      };
    });
  },

  /**
   * Calculates comprehensive summary statistics for a specific goal over a date range
   */
  calculateMetricSummary(
    goal: Goal,
    allRecordsForGoal: DailyRecord[],
    categories: Category[],
    dateRange: DateRange
  ): MetricSummary {
    const category = categories.find((c) => c.id === goal.categoryId);
    const scheduledDates = getScheduledDatesForGoal(goal, dateRange.startDate, dateRange.endDate);
    const scheduledDaysCount = scheduledDates.length;
    const isMeasurement = goal.type === 'measurement';

    const rangeRecords = allRecordsForGoal
      .filter((r) => r.date >= dateRange.startDate && r.date <= dateRange.endDate)
      .sort((a, b) => a.date.localeCompare(b.date));

    const recordMap = new Map<string, DailyRecord>();
    for (const r of rangeRecords) {
      recordMap.set(r.date, r);
    }

    let totalValue = 0;
    let completedDays = 0;
    let minValue = Infinity;
    let maxValue = -Infinity;
    const recordedValues: number[] = [];

    for (const dStr of scheduledDates) {
      const rec = recordMap.get(dStr);
      if (rec && (rec.value > 0 || isGoalCompleted(goal, rec.value))) {
        recordedValues.push(rec.value);
        totalValue += rec.value;
        if (rec.value < minValue) minValue = rec.value;
        if (rec.value > maxValue) maxValue = rec.value;
        if (isGoalCompleted(goal, rec.value)) {
          completedDays++;
        }
      }
    }

    if (minValue === Infinity) minValue = 0;
    if (maxValue === -Infinity) maxValue = 0;

    const initialValue = recordedValues.length > 0 ? recordedValues[0] : 0;
    const latestValue = recordedValues.length > 0 ? recordedValues[recordedValues.length - 1] : 0;
    const changeValue =
      recordedValues.length > 1 ? Math.round((latestValue - initialValue) * 100) / 100 : 0;

    const averageValue = isMeasurement
      ? (recordedValues.length > 0 ? totalValue / recordedValues.length : 0)
      : (scheduledDaysCount > 0 ? totalValue / scheduledDaysCount : 0);

    const missedDays = Math.max(0, scheduledDaysCount - completedDays);
    const completionRate =
      scheduledDaysCount > 0 ? Math.round((completedDays / scheduledDaysCount) * 100) : 0;

    const streaks = calculateGoalStreaks(goal, allRecordsForGoal, dateRange.endDate);

    return {
      goalId: goal.id,
      goalName: goal.name,
      categoryName: category?.name || 'Uncategorized',
      categoryColor: category?.color || '#94a3b8',
      type: goal.type,
      unit: goal.unit,
      target: goal.target,
      totalValue: Math.round(totalValue * 100) / 100,
      averageValue: Math.round(averageValue * 100) / 100,
      minValue: Math.round(minValue * 100) / 100,
      maxValue: Math.round(maxValue * 100) / 100,
      initialValue,
      latestValue,
      changeValue,
      completionRate,
      totalScheduledDays: scheduledDaysCount,
      completedDays,
      missedDays,
      currentStreak: streaks.currentStreak,
      bestStreak: streaks.bestStreak,
    };
  },

  /**
   * Calculates overall aggregate performance across all active goals taking frequency into account
   */
  calculateOverallSummary(
    goals: Goal[],
    records: DailyRecord[],
    categories: Category[],
    dateRange: DateRange
  ): OverallSummary {
    const dates = getDateIntervalArray(dateRange.startDate, dateRange.endDate);
    const totalDays = dates.length;
    const activeGoals = goals.filter((g) => g.active);

    const goalMap = new Map(activeGoals.map((g) => [g.id, g]));

    // Group records by date
    const dateMap = new Map<string, Map<string, DailyRecord>>();
    for (const r of records) {
      if (r.date >= dateRange.startDate && r.date <= dateRange.endDate && goalMap.has(r.goalId)) {
        const goalRecs = dateMap.get(r.date) || new Map<string, DailyRecord>();
        goalRecs.set(r.goalId, r);
        dateMap.set(r.date, goalRecs);
      }
    }

    let totalPossibleCompletions = 0;
    let actualCompletedGoals = 0;
    let perfectDaysCount = 0;
    let totalCheckins = 0;

    // Category tracking
    const catStats = new Map<string, { total: number; completed: number }>();
    for (const c of categories) {
      catStats.set(c.id, { total: 0, completed: 0 });
    }

    for (const dStr of dates) {
      const dayRecs = dateMap.get(dStr);
      const scheduledForDay = activeGoals.filter((g) => isGoalScheduledForDate(g, dStr));
      let dayCompletedCount = 0;

      for (const goal of scheduledForDay) {
        totalPossibleCompletions++;
        const stat = catStats.get(goal.categoryId) || { total: 0, completed: 0 };
        stat.total++;

        const rec = dayRecs?.get(goal.id);
        if (rec) {
          totalCheckins++;
          if (isGoalCompleted(goal, rec.value)) {
            dayCompletedCount++;
            actualCompletedGoals++;
            stat.completed++;
          }
        }
        catStats.set(goal.categoryId, stat);
      }

      if (scheduledForDay.length > 0 && dayCompletedCount >= scheduledForDay.length) {
        perfectDaysCount++;
      }
    }

    const overallCompletionRate =
      totalPossibleCompletions > 0
        ? Math.round((actualCompletedGoals / totalPossibleCompletions) * 100)
        : 0;

    const categoryBreakdown: CategoryBreakdown[] = categories
      .map((cat) => {
        const stat = catStats.get(cat.id) || { total: 0, completed: 0 };
        const rate = stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0;
        return {
          categoryId: cat.id,
          categoryName: cat.name,
          categoryColor: cat.color,
          totalGoals: stat.total,
          completedCount: stat.completed,
          completionRate: rate,
        };
      })
      .filter((c) => c.totalGoals > 0);

    return {
      dateRange,
      totalDays,
      activeGoalsCount: activeGoals.length,
      totalCheckins,
      overallCompletionRate,
      perfectDaysCount,
      categoryBreakdown,
    };
  },

  /**
   * Computes calendar heatmap matrix for long-term consistency
   */
  calculateHeatmapData(
    activeGoals: Goal[],
    records: DailyRecord[],
    dateRange: DateRange
  ): { date: string; rate: number; completed: number; total: number }[] {
    const dates = getDateIntervalArray(dateRange.startDate, dateRange.endDate);
    const goalMap = new Map(activeGoals.map((g) => [g.id, g]));

    const dateRecords = new Map<string, DailyRecord[]>();
    for (const r of records) {
      if (goalMap.has(r.goalId)) {
        const list = dateRecords.get(r.date) || [];
        list.push(r);
        dateRecords.set(r.date, list);
      }
    }

    return dates.map((dateStr) => {
      const scheduledForDay = activeGoals.filter((g) => isGoalScheduledForDate(g, dateStr));
      const list = dateRecords.get(dateStr) || [];
      let completed = 0;

      for (const r of list) {
        const g = goalMap.get(r.goalId);
        if (g && isGoalScheduledForDate(g, dateStr) && isGoalCompleted(g, r.value)) {
          completed++;
        }
      }

      const total = scheduledForDay.length;
      const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { date: dateStr, rate, completed, total };
    });
  },
};
