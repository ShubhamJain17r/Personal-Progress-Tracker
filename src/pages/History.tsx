import React, { useState } from 'react';
import { useGoals } from '../hooks/useGoals';
import { useDailyRecords } from '../hooks/useDailyRecords';
import { useCategories } from '../hooks/useCategories';
import { getTodayDateString } from '../utils/dates';
import { DateNavigator } from '../components/history/DateNavigator';
import { GoalCheckinItem } from '../components/dashboard/GoalCheckinItem';
import { NoteModal } from '../components/dashboard/NoteModal';
import { Card } from '../components/common/Card';
import { Goal } from '../types/goal';
import { isGoalCompleted } from '../utils/calculations';

export const History: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const { activeGoals } = useGoals();
  const { categories } = useCategories();
  const { records, upsertRecord } = useDailyRecords(selectedDate);
  const [activeNoteGoal, setActiveNoteGoal] = useState<Goal | null>(null);

  const recordMap = new Map(records.map((r) => [r.goalId, r]));

  let completedCount = 0;
  for (const goal of activeGoals) {
    const rec = recordMap.get(goal.id);
    if (rec && isGoalCompleted(goal, rec.value)) {
      completedCount++;
    }
  }

  const completionPct =
    activeGoals.length > 0 ? Math.round((completedCount / activeGoals.length) * 100) : 0;

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
              ({completedCount} of {activeGoals.length} goals achieved)
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

        {activeGoals.map((goal) => {
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
