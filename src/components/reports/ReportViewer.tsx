import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { ProgressReport } from '../../types/report';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { reportService } from '../../services/reportService';
import { formatDisplayDate } from '../../utils/dates';

export interface ReportViewerProps {
  report: ProgressReport;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ report }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      reportService.exportPDF(report);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const dateRangeLabel = `${formatDisplayDate(report.dateRange.startDate, 'MMM d, yyyy')} - ${formatDisplayDate(report.dateRange.endDate, 'MMM d, yyyy')}`;

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 text-white p-6 border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-5 h-5 text-brand-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Generated Report
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">{report.title}</h2>
            <p className="text-xs text-slate-400 mt-1">Period: {dateRangeLabel}</p>
          </div>

          <Button
            onClick={handleDownloadPDF}
            isLoading={isExporting}
            leftIcon={<Download className="w-4 h-4" />}
            size="md"
          >
            Export PDF Report
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Overall Completion
          </span>
          <h3 className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">
            {report.overall.overallCompletionRate}%
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {report.overall.totalCheckins} check-ins recorded
          </p>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Active Goals Tracked
          </span>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {report.overall.activeGoalsCount}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Across {report.overall.totalDays} scheduled days
          </p>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Perfect Days
          </span>
          <h3 className="text-2xl font-black text-amber-500 mt-1">
            {report.overall.perfectDaysCount} / {report.overall.totalDays}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Days with 100% goal completion
          </p>
        </Card>
      </div>

      <Card className="p-5 overflow-hidden">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Goal Performance Breakdown
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Goal</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Target</th>
                <th className="pb-3 font-semibold">Total Recorded</th>
                <th className="pb-3 font-semibold">Completion %</th>
                <th className="pb-3 font-semibold">Days Met</th>
                <th className="pb-3 font-semibold">Current Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {report.goalSummaries.map((g) => (
                <tr key={g.goalId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 font-bold text-slate-900 dark:text-white">{g.goalName}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{g.categoryName}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    {g.type === 'boolean' ? 'Completed' : `${g.target} ${g.unit}`}
                  </td>
                  <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                    {g.type === 'boolean' ? `${g.completedDays} days` : `${g.totalValue} ${g.unit}`}
                  </td>
                  <td className="py-3">
                    <span className="font-bold text-brand-600 dark:text-brand-400">
                      {g.completionRate}%
                    </span>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    {g.completedDays} / {g.totalScheduledDays}
                  </td>
                  <td className="py-3 text-amber-600 dark:text-amber-400 font-semibold">
                    {g.currentStreak}d (Best: {g.bestStreak}d)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {report.notes.length > 0 && (
        <Card className="p-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Notes & Reflections Recorded
          </h3>

          <div className="space-y-3">
            {report.notes.map((n, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-xs text-brand-600 dark:text-brand-400">
                    {n.goalName}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {formatDisplayDate(n.date, 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                  "{n.note}"
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
