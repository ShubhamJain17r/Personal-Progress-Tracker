import React, { useState, useMemo } from 'react';
import { FileText } from 'lucide-react';
import { useGoals } from '../hooks/useGoals';
import { useCategories } from '../hooks/useCategories';
import { useDailyRecords } from '../hooks/useDailyRecords';
import { ReportType } from '../types/report';
import { DateRange } from '../types/analytics';
import { getPresetDateRange } from '../utils/dates';
import { reportService } from '../services/reportService';
import { ReportViewer } from '../components/reports/ReportViewer';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { clsx } from 'clsx';

export const Reports: React.FC = () => {
  const { goals } = useGoals();
  const { categories } = useCategories();
  const { records } = useDailyRecords();

  const [reportType, setReportType] = useState<ReportType>('weekly');
  const [customRange, setCustomRange] = useState<DateRange>(() => getPresetDateRange('this_week'));

  const dateRange = useMemo(() => {
    if (reportType === 'weekly') return getPresetDateRange('this_week');
    if (reportType === 'monthly') return getPresetDateRange('this_month');
    return customRange;
  }, [reportType, customRange]);

  const reportData = useMemo(() => {
    if (goals.length === 0) return null;
    return reportService.generateReportData(
      reportType,
      dateRange,
      goals,
      categories,
      records
    );
  }, [reportType, dateRange, goals, categories, records]);

  if (goals.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No Tracking Data Available"
        description="Set up your goals and track progress to generate comprehensive progress reports."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Progress Reports
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Generate structured weekly, monthly, or custom date-range PDF performance reports locally in your browser
        </p>
      </div>

      <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setReportType('weekly')}
            className={clsx(
              'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all',
              reportType === 'weekly'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            )}
          >
            Weekly Report
          </button>
          <button
            onClick={() => setReportType('monthly')}
            className={clsx(
              'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all',
              reportType === 'monthly'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            )}
          >
            Monthly Report
          </button>
          <button
            onClick={() => setReportType('custom')}
            className={clsx(
              'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all',
              reportType === 'custom'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            )}
          >
            Custom Range
          </button>
        </div>

        {reportType === 'custom' && (
          <div className="flex items-center gap-2 text-xs">
            <input
              type="date"
              value={customRange.startDate}
              onChange={(e) =>
                e.target.value &&
                setCustomRange({ ...customRange, startDate: e.target.value })
              }
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-slate-800 dark:text-slate-200"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={customRange.endDate}
              onChange={(e) =>
                e.target.value &&
                setCustomRange({ ...customRange, endDate: e.target.value })
              }
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-slate-800 dark:text-slate-200"
            />
          </div>
        )}
      </Card>

      {reportData && <ReportViewer report={reportData} />}
    </div>
  );
};
