export type DateRangePreset =
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'last_week'
  | 'this_month'
  | 'last_month'
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'
  | 'this_year'
  | 'custom';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface MetricSummary {
  goalId: string;
  goalName: string;
  categoryName: string;
  categoryColor: string;
  type: string;
  unit: string;
  target: number;
  totalValue: number;
  averageValue: number;
  minValue: number;
  maxValue: number;
  latestValue?: number;
  initialValue?: number;
  changeValue?: number;
  completionRate: number;
  totalScheduledDays: number;
  completedDays: number;
  missedDays: number;
  currentStreak: number;
  bestStreak: number;
}

export interface DayDataPoint {
  date: string;
  displayDate: string;
  value: number;
  hasRecord: boolean;
  target: number;
  completed: boolean;
  completionPercentage: number;
  note?: string;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  totalGoals: number;
  completedCount: number;
  completionRate: number;
}

export interface OverallSummary {
  dateRange: DateRange;
  totalDays: number;
  activeGoalsCount: number;
  totalCheckins: number;
  overallCompletionRate: number;
  perfectDaysCount: number;
  categoryBreakdown: CategoryBreakdown[];
}
