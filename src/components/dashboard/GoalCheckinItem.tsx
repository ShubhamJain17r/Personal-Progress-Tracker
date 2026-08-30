import React, { useState, useEffect } from 'react';
import { Check, Plus, Minus, FileText, Flame } from 'lucide-react';
import { Goal } from '../../types/goal';
import { DailyRecord } from '../../types/record';
import { Category } from '../../types/category';
import { Badge } from '../common/Badge';
import {
  calculateCappedProgress,
  formatGoalProgressDisplay,
  isGoalCompleted,
} from '../../utils/calculations';
import { clsx } from 'clsx';

export interface GoalCheckinItemProps {
  goal: Goal;
  record?: DailyRecord;
  category?: Category;
  streak?: number;
  onUpdateValue: (value: number) => void;
  onOpenNote: () => void;
}

export const GoalCheckinItem: React.FC<GoalCheckinItemProps> = ({
  goal,
  record,
  category,
  streak = 0,
  onUpdateValue,
  onOpenNote,
}) => {
  const currentValue = record?.value ?? 0;
  const isCompleted = record?.completed ?? isGoalCompleted(goal, currentValue);
  const progressPercent = calculateCappedProgress(goal.target, currentValue, goal.type);
  const hasNote = Boolean(record?.note && record.note.trim().length > 0);

  const [localInput, setLocalInput] = useState<string>(String(currentValue));
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    setLocalInput(String(currentValue));
  }, [currentValue]);

  const handleInputBlur = () => {
    setIsEditing(false);
    const parsed = parseFloat(localInput);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateValue(parsed);
    } else {
      setLocalInput(String(currentValue));
    }
  };

  const handleBooleanToggle = () => {
    onUpdateValue(isCompleted ? 0 : 1);
  };

  const handleAdjustValue = (delta: number) => {
    const nextVal = Math.max(0, Math.round((currentValue + delta) * 100) / 100);
    onUpdateValue(nextVal);
  };

  return (
    <div
      className={clsx(
        'group relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 bg-white dark:bg-slate-900',
        isCompleted
          ? 'border-emerald-200 dark:border-emerald-900/50 shadow-xs'
          : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      )}
    >
      <div
        className={clsx(
          'absolute left-0 top-0 bottom-0 transition-all duration-500 pointer-events-none opacity-10',
          isCompleted ? 'bg-emerald-500' : 'bg-brand-500'
        )}
        style={{ width: `${progressPercent}%` }}
      />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {category && <Badge label={category.name} color={category.color} size="sm" />}
            {streak > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/40">
                <Flame className="w-3 h-3 fill-amber-500" />
                {streak} {streak === 1 ? 'day' : 'days'}
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
            {goal.name}
          </h3>

          {goal.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {goal.description}
            </p>
          )}

          <div className="mt-2.5 flex items-center gap-3">
            <div className="h-1.5 flex-1 max-w-[160px] rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={clsx(
                  'h-full rounded-full transition-all duration-500',
                  isCompleted ? 'bg-emerald-500' : 'bg-brand-500'
                )}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {formatGoalProgressDisplay(currentValue, goal.target, goal.unit, goal.type)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            onClick={onOpenNote}
            title={hasNote ? 'Edit note' : 'Add reflection note'}
            className={clsx(
              'relative rounded-xl p-2 transition-colors',
              hasNote
                ? 'bg-amber-100/80 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300'
            )}
          >
            <FileText className="w-4 h-4" />
            {hasNote && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          {goal.type === 'boolean' && (
            <button
              onClick={handleBooleanToggle}
              className={clsx(
                'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 active:scale-95 shadow-xs',
                isCompleted
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500 dark:bg-emerald-500'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              )}
            >
              <Check className={clsx('w-4 h-4', isCompleted ? 'stroke-[3]' : 'opacity-40')} />
              <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
            </button>
          )}

          {(goal.type === 'numeric' || goal.type === 'count') && (
            <div className="flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <button
                onClick={() => handleAdjustValue(goal.type === 'count' ? -1 : -Math.max(1, Math.round(goal.target / 10)))}
                disabled={currentValue <= 0}
                className="rounded-lg p-1.5 text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700 transition-colors disabled:opacity-30"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              {isEditing ? (
                <input
                  type="number"
                  autoFocus
                  value={localInput}
                  onChange={(e) => setLocalInput(e.target.value)}
                  onBlur={handleInputBlur}
                  onKeyDown={(e) => e.key === 'Enter' && handleInputBlur()}
                  className="w-16 rounded-md bg-white dark:bg-slate-900 px-1.5 py-0.5 text-center text-xs font-bold text-slate-900 dark:text-white focus:outline-none ring-1 ring-brand-500"
                />
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="min-w-12 px-2 py-1 text-center text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors"
                  title="Click to edit value"
                >
                  {currentValue}
                </button>
              )}

              <button
                onClick={() => handleAdjustValue(goal.type === 'count' ? 1 : Math.max(1, Math.round(goal.target / 10)))}
                className="rounded-lg p-1.5 text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {goal.type === 'duration' && (
            <div className="flex items-center gap-1">
              <div className="hidden sm:flex items-center gap-1">
                <button
                  onClick={() => handleAdjustValue(goal.unit === 'hours' || goal.unit === 'hrs' ? 0.5 : 15)}
                  className="rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-2 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  +{goal.unit === 'hours' || goal.unit === 'hrs' ? '30m' : '15m'}
                </button>
                <button
                  onClick={() => handleAdjustValue(goal.unit === 'hours' || goal.unit === 'hrs' ? 1 : 30)}
                  className="rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-2 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  +{goal.unit === 'hours' || goal.unit === 'hrs' ? '1h' : '30m'}
                </button>
              </div>

              <div className="flex items-center bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <button
                  onClick={() => handleAdjustValue(goal.unit === 'hours' || goal.unit === 'hrs' ? -0.5 : -15)}
                  disabled={currentValue <= 0}
                  className="rounded-lg p-1.5 text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700 transition-colors disabled:opacity-30"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                {isEditing ? (
                  <input
                    type="number"
                    step="any"
                    autoFocus
                    value={localInput}
                    onChange={(e) => setLocalInput(e.target.value)}
                    onBlur={handleInputBlur}
                    onKeyDown={(e) => e.key === 'Enter' && handleInputBlur()}
                    className="w-14 rounded-md bg-white dark:bg-slate-900 px-1 py-0.5 text-center text-xs font-bold text-slate-900 dark:text-white focus:outline-none ring-1 ring-brand-500"
                  />
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="min-w-10 px-1.5 py-1 text-center text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors"
                    title="Click to edit value"
                  >
                    {currentValue}
                  </button>
                )}

                <button
                  onClick={() => handleAdjustValue(goal.unit === 'hours' || goal.unit === 'hrs' ? 0.5 : 15)}
                  className="rounded-lg p-1.5 text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
