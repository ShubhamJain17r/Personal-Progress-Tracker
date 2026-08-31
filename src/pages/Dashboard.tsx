import React, { useState } from 'react';
import { Plus, Target, Calendar, Sparkles, Filter } from 'lucide-react';
import { useGoals } from '../hooks/useGoals';
import { useDailyRecords } from '../hooks/useDailyRecords';
import { useCategories } from '../hooks/useCategories';
import { getTodayDateString, formatDisplayDate, isGoalScheduledForDate } from '../utils/dates';
import { DailyProgressCard } from '../components/dashboard/DailyProgressCard';
import { GoalCheckinItem } from '../components/dashboard/GoalCheckinItem';
import { NoteModal } from '../components/dashboard/NoteModal';
import { GoalFormModal } from '../components/goals/GoalFormModal';
import { CategoryFormModal } from '../components/goals/CategoryFormModal';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { Goal, CreateGoalDTO, UpdateGoalDTO } from '../types/goal';
import { CreateCategoryDTO } from '../types/category';
import { calculateGoalStreaks, calculateOverallStreaks } from '../utils/streaks';
import { isGoalCompleted } from '../utils/calculations';
import { clsx } from 'clsx';

export const Dashboard: React.FC<{ onNavigateToGoals?: () => void }> = () => {
  const today = getTodayDateString();
  const { activeGoals, createGoal } = useGoals();
  const { categories, createCategory } = useCategories();
  const { records: todayRecords, upsertRecord } = useDailyRecords(today);
  const { records: allRecords } = useDailyRecords();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAllActive, setShowAllActive] = useState<boolean>(false);
  const [activeNoteGoal, setActiveNoteGoal] = useState<Goal | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const recordMap = new Map(todayRecords.map((r) => [r.goalId, r]));

  // Scheduled goals for today (weekly goals only show on Sundays, weekdays on Mon-Fri, etc.)
  const scheduledGoalsForToday = activeGoals.filter((g) => isGoalScheduledForDate(g, today));
  const activeList = showAllActive ? activeGoals : scheduledGoalsForToday;

  const otherScheduledCount = activeGoals.length - scheduledGoalsForToday.length;

  let completedCount = 0;
  for (const goal of scheduledGoalsForToday) {
    const rec = recordMap.get(goal.id);
    if (rec && isGoalCompleted(goal, rec.value)) {
      completedCount++;
    }
  }

  const overallStreak = calculateOverallStreaks(activeGoals, allRecords, today).currentStreak;

  const filteredGoals = activeList.filter((g) =>
    selectedCategory === 'all' ? true : g.categoryId === selectedCategory
  );

  const handleUpdateValue = async (goal: Goal, value: number) => {
    await upsertRecord({
      date: today,
      goalId: goal.id,
      value,
    });
  };

  const handleSaveNote = async (note: string) => {
    if (!activeNoteGoal) return;
    const currentRec = recordMap.get(activeNoteGoal.id);
    await upsertRecord({
      date: today,
      goalId: activeNoteGoal.id,
      value: currentRec?.value ?? 0,
      note,
    });
  };

  const handleCreateGoal = async (dto: CreateGoalDTO | UpdateGoalDTO) => {
    await createGoal(dto as CreateGoalDTO);
  };

  const handleCreateCategory = async (dto: CreateCategoryDTO) => {
    await createCategory(dto);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Today's Check-in</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatDisplayDate(today, 'EEEE, MMMM d, yyyy')}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {otherScheduledCount > 0 && (
            <button
              onClick={() => setShowAllActive(!showAllActive)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all',
                showAllActive
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
              title="Toggle view between today's scheduled tasks and all active goals"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{showAllActive ? 'Showing All Goals' : `Scheduled Today (${scheduledGoalsForToday.length})`}</span>
            </button>
          )}

          <Button
            onClick={() => setIsGoalModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            size="sm"
          >
            Add Goal
          </Button>
        </div>
      </div>

      {activeGoals.length > 0 && (
        <DailyProgressCard
          completedGoalsCount={completedCount}
          totalGoalsCount={scheduledGoalsForToday.length}
          overallStreak={overallStreak}
          dateLabel="Today's"
        />
      )}

      {otherScheduledCount > 0 && !showAllActive && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/40 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-500 shrink-0" />
            <span>
              <strong>{otherScheduledCount} weekly/periodic task(s)</strong> are scheduled for Sundays and other days.
            </span>
          </div>
          <button
            onClick={() => setShowAllActive(true)}
            className="font-bold text-brand-600 dark:text-brand-400 hover:underline shrink-0"
          >
            View All ({activeGoals.length})
          </button>
        </div>
      )}

      {activeGoals.length > 0 && categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={clsx(
              'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0',
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            All ({activeList.length})
          </button>
          {categories.map((c) => {
            const count = activeList.filter((g) => g.categoryId === c.id).length;
            if (count === 0) return null;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={clsx(
                  'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0',
                  selectedCategory === c.id
                    ? 'bg-brand-600 text-white dark:bg-brand-500 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>
      )}

      {filteredGoals.length > 0 ? (
        <div className="space-y-3">
          {filteredGoals.map((goal) => {
            const rec = recordMap.get(goal.id);
            const cat = categories.find((c) => c.id === goal.categoryId);
            const streak = calculateGoalStreaks(goal, allRecords, today).currentStreak;

            return (
              <GoalCheckinItem
                key={goal.id}
                goal={goal}
                record={rec}
                category={cat}
                streak={streak}
                onUpdateValue={(val) => handleUpdateValue(goal, val)}
                onOpenNote={() => setActiveNoteGoal(goal)}
              />
            );
          })}
        </div>
      ) : activeGoals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No Active Goals Defined"
          description="Start building positive routines by creating your first daily or recurring goal."
          actionLabel="Create First Goal"
          onAction={() => setIsGoalModalOpen(true)}
        />
      ) : (
        <div className="text-center py-10 text-xs text-slate-400">
          No goals scheduled in this category for today.
        </div>
      )}

      <NoteModal
        isOpen={Boolean(activeNoteGoal)}
        onClose={() => setActiveNoteGoal(null)}
        goal={activeNoteGoal}
        date={today}
        initialNote={activeNoteGoal ? recordMap.get(activeNoteGoal.id)?.note : ''}
        onSave={handleSaveNote}
      />

      <GoalFormModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        categories={categories}
        onSave={handleCreateGoal}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
      />

      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleCreateCategory}
      />
    </div>
  );
};
