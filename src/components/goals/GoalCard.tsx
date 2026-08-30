import React from 'react';
import { Edit2, Trash2, Power, Flame } from 'lucide-react';
import { Goal } from '../../types/goal';
import { Category } from '../../types/category';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { clsx } from 'clsx';

export interface GoalCardProps {
  goal: Goal;
  category?: Category;
  streak?: number;
  onEdit: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
  onToggleActive: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  category,
  streak = 0,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  return (
    <Card
      hoverable
      className={clsx(
        'relative flex flex-col justify-between transition-all duration-200',
        !goal.active && 'opacity-60 bg-slate-50/50 dark:bg-slate-900/30'
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {category && <Badge label={category.name} color={category.color} size="sm" />}
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {goal.type}
            </span>
          </div>

          <button
            onClick={() => onToggleActive(goal.id)}
            title={goal.active ? 'Active (Click to deactivate)' : 'Inactive (Click to activate)'}
            className={clsx(
              'flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl transition-colors',
              goal.active
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
            )}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{goal.active ? 'Active' : 'Inactive'}</span>
          </button>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          {goal.name}
        </h3>
        {goal.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
            {goal.description}
          </p>
        )}

        <div className="my-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {goal.type === 'measurement' ? 'Tracking Target' : 'Daily Target'}
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {goal.type === 'boolean'
                ? 'Completed Daily'
                : goal.type === 'measurement'
                ? goal.target > 0
                  ? `Target: ${goal.target.toLocaleString()} ${goal.unit}`
                  : `Periodic Log (${goal.unit})`
                : `${goal.target.toLocaleString()} ${goal.unit}`}
            </span>
          </div>

          {streak > 0 && (
            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-200/60 dark:border-amber-800/40">
              <Flame className="w-3.5 h-3.5 fill-amber-500" />
              {streak}d
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 mt-2">
        <span className="text-[11px] text-slate-400 capitalize">
          Frequency: {goal.frequency}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(goal)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Edit Goal"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(goal)}
            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
            title="Delete Goal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};
