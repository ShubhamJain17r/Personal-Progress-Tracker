import React, { useState, useMemo } from 'react';
import { BarChart3, Filter } from 'lucide-react';
import { useGoals } from '../hooks/useGoals';
import { useCategories } from '../hooks/useCategories';
import { useDailyRecords } from '../hooks/useDailyRecords';
import { DateRangePreset, DateRange } from '../types/analytics';
import { getPresetDateRange } from '../utils/dates';
import { analyticsService } from '../services/analyticsService';
import { DateRangeFilter } from '../components/analytics/DateRangeFilter';
import { SummaryCards } from '../components/analytics/SummaryCards';
import { GoalTrendChart } from '../components/analytics/GoalTrendChart';
import { HeatmapCalendar } from '../components/analytics/HeatmapCalendar';
import { Select } from '../components/common/Select';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';

export const Analytics: React.FC<{ onNavigateToHistory?: (date: string) => void }> = ({
  onNavigateToHistory,
}) => {
  const { goals, activeGoals } = useGoals();
  const { categories } = useCategories();
  const { records: allRecords } = useDailyRecords();

  const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>('last_30_days');
  const [dateRange, setDateRange] = useState<DateRange>(() => getPresetDateRange('last_30_days'));
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');

  const currentGoal = useMemo(() => {
    if (selectedGoalId) {
      return goals.find((g) => g.id === selectedGoalId) || activeGoals[0] || goals[0];
    }
    return activeGoals[0] || goals[0];
  }, [selectedGoalId, goals, activeGoals]);

  const handlePresetSelect = (preset: DateRangePreset, range: DateRange) => {
    setSelectedPreset(preset);
    setDateRange(range);
  };

  const timeSeriesData = useMemo(() => {
    if (!currentGoal) return [];
    return analyticsService.getGoalTimeSeries(currentGoal, allRecords, dateRange);
  }, [currentGoal, allRecords, dateRange]);

  const metricSummary = useMemo(() => {
    if (!currentGoal) return null;
    return analyticsService.calculateMetricSummary(currentGoal, allRecords, categories, dateRange);
  }, [currentGoal, allRecords, categories, dateRange]);

  const heatmapData = useMemo(() => {
    return analyticsService.calculateHeatmapData(activeGoals, allRecords, dateRange);
  }, [activeGoals, allRecords, dateRange]);

  const overallSummary = useMemo(() => {
    return analyticsService.calculateOverallSummary(goals, allRecords, categories, dateRange);
  }, [goals, allRecords, categories, dateRange]);

  if (goals.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No Tracking Data Available"
        description="Define goals and log daily progress to unlock analytics charts and trend reports."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Progress Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Explore trends, measure habit consistency, and inspect progress across custom periods
        </p>
      </div>

      <Card className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Filter className="w-4 h-4" />
            <span>Time Range & Metric Filters</span>
          </div>

          <div className="w-full sm:w-64">
            <Select
              options={goals.map((g) => ({
                value: g.id,
                label: `${g.name} (${g.type})`,
              }))}
              value={currentGoal?.id || ''}
              onChange={(e) => setSelectedGoalId(e.target.value)}
            />
          </div>
        </div>

        <DateRangeFilter
          selectedPreset={selectedPreset}
          customRange={dateRange}
          onPresetSelect={handlePresetSelect}
          onCustomRangeChange={setDateRange}
        />
      </Card>

      {metricSummary && <SummaryCards summary={metricSummary} />}

      {currentGoal && <GoalTrendChart goal={currentGoal} data={timeSeriesData} />}

      <HeatmapCalendar
        data={heatmapData}
        onSelectDate={(d) => onNavigateToHistory && onNavigateToHistory(d)}
      />

      {overallSummary.categoryBreakdown.length > 0 && (
        <Card className="p-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
            Performance by Category
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {overallSummary.categoryBreakdown.map((cat) => (
              <div
                key={cat.categoryId}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {cat.categoryName}
                  </span>
                  <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400">
                    {cat.completionRate}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${cat.completionRate}%`,
                      backgroundColor: cat.categoryColor || '#0284c7',
                    }}
                  />
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                  {cat.completedCount} of {cat.totalGoals} targets met
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
