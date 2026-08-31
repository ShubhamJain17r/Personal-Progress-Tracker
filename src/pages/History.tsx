import React, { useState } from 'react';
import { useGoals } from '../hooks/useGoals';
import { useDailyRecords } from '../hooks/useDailyRecords';
import { useCategories } from '../hooks/useCategories';
import { getTodayDateString, isGoalScheduledForDate } from '../utils/dates';
import { DateNavigator } from '../components/history/DateNavigator';
import { GoalCheckinItem } from '../components/dashboard/GoalCheckinItem';
import { NoteModal } from '../components/dashboard/NoteModal';
import { Card } from '../components/common/Card';
import { Goal } from '../types/goal';
import { isGoalCompleted } from '../utils/calculations';
import { Filter } from 'lucide-react';
import { clsx } from 'clsx';

export const History: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [showAllActive, setShowAllActive] = useState<boolean>(false);
  const { activeGoals } = useGoals();
  const { categories } = useCategories();
  const { records, upsertRecord } = useDailyRecords(selectedDate);
  const [activeNoteGoal, setActiveNoteGoal] = useState<Goal | null>(null);

  const recordMap = new Map(records.map((r) => [r.goalId, r]));

  const scheduledGoals = activeGoals.filter((g) => isGoalScheduledForDate(g, selectedDate));
  const activeList = showAllActive ? activeGoals : scheduledGoals;

  let completedCount = 0;
  for (const goal of scheduledGoals) {
    const rec = recordMap.get(goal.id);
    if (rec && isGoalCompleted(goal, rec.value)) {
      completedCount++;
    }
  }

  const completionPct =
    scheduledGoals.length > 0 ? Math.round((completedCount / scheduledGoals.length) * 100) : 0;

  const handleUpdateValue = async (goal: Goal, value: number) => {
    await upsertRecord({
      date: selectedDate,
      goalId: goal.id,
      value,
    });
  };

  const handleSaveNote = async (note: string) => {
    if (!activeNoteGoal) return;
    const currentRec = recordMap.get(activeNoteGoal.id);
    await upsertRecord({
      date: selectedDate,
      goalId: activeNoteGoal.id,
      value: currentRec?.value ?? 0,
      note,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            History & Retroactive Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse past dates, review performance logs, and backfill missed days
          </p>
        </div>

        {activeGoals.length > scheduledGoals.length && (
          <button
            onClick={() => setShowAllActive(!showAllActive)}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all',
              showAllActive
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{showAllActive ? 'Showing All Goals' : `Scheduled on ${selectedDate} (${scheduledGoals.length})`}</span>
          </button>
        )}
      </div>

      <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />

      <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white border-slate-800">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Selected Day Completion
          </span>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-brand-400">
              {completionPct}%
            </span>
            <span className="text-xs text-slate-300">
              ({completedCount} of {scheduledGoals.length} scheduled goals achieved)
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Values updated below are recorded directly for <strong>{selectedDate}</strong>.
        </div>
      </Card>

      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Goals Log for {selectedDate}
        </h3>

        {activeList.map((goal) => {
          const rec = recordMap.get(goal.id);
          const cat = categories.find((c) => c.id === goal.categoryId);

          return (
            <GoalCheckinItem
              key={goal.id}
              goal={goal}
              record={rec}
              category={cat}
              onUpdateValue={(val) => handleUpdateValue(goal, val)}
              onOpenNote={() => setActiveNoteGoal(goal)}
            />
          );
        })}

        {activeList.length === 0 && (
          <div className="text-center py-10 text-xs text-slate-400">
            No goals were scheduled on this date.
          </div>
        )}
      </div>

      <NoteModal
        isOpen={Boolean(activeNoteGoal)}
        onClose={() => setActiveNoteGoal(null)}
        goal={activeNoteGoal}
        date={selectedDate}
        initialNote={activeNoteGoal ? recordMap.get(activeNoteGoal.id)?.note : ''}
        onSave={handleSaveNote}
      />
    </div>
  );
};
