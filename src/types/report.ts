import { DateRange, MetricSummary, OverallSummary } from './analytics';

export type ReportType = 'weekly' | 'monthly' | 'custom';

export interface ProgressReport {
  title: string;
  type: ReportType;
  generatedAt: string;
  dateRange: DateRange;
  overall: OverallSummary;
  goalSummaries: MetricSummary[];
  notes: { date: string; goalName: string; note: string }[];
}
