import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { Goal, GoalType, GoalFrequency, CreateGoalDTO, UpdateGoalDTO } from '../../types/goal';
import { Category } from '../../types/category';

export interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGoal?: Goal | null;
  categories: Category[];
  onSave: (dto: CreateGoalDTO | UpdateGoalDTO) => Promise<void>;
  onOpenCategoryModal?: () => void;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  initialGoal,
  categories,
  onSave,
  onOpenCategoryModal,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState<GoalType>('boolean');
  const [target, setTarget] = useState<string>('1');
  const [unit, setUnit] = useState('');
  const [frequency, setFrequency] = useState<GoalFrequency>('daily');
  const [active, setActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialGoal) {
      setName(initialGoal.name);
      setDescription(initialGoal.description || '');
      setCategoryId(initialGoal.categoryId);
      setType(initialGoal.type);
      setTarget(String(initialGoal.target));
      setUnit(initialGoal.unit || '');
      setFrequency(initialGoal.frequency || 'daily');
      setActive(initialGoal.active);
    } else {
      setName('');
      setDescription('');
      setCategoryId(categories.length > 0 ? categories[0].id : '');
      setType('boolean');
      setTarget('1');
      setUnit('done');
      setFrequency('daily');
      setActive(true);
    }
    setError(null);
  }, [initialGoal, isOpen, categories]);

  const handleTypeChange = (newType: GoalType) => {
    setType(newType);
    if (newType === 'boolean') {
      setTarget('1');
      setUnit('done');
      setFrequency('daily');
    } else if (newType === 'numeric') {
      if (target === '1') setTarget('10000');
      if (unit === 'done' || unit === 'hrs') setUnit('steps');
    } else if (newType === 'duration') {
      if (target === '1' || target === '10000') setTarget('30');
      setUnit('minutes');
    } else if (newType === 'count') {
      if (target === '10000' || target === '30') setTarget('5');
      setUnit('items');
    } else if (newType === 'measurement') {
      setTarget('0');
      setUnit('kg');
      setFrequency('weekly');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a goal/metric name.');
      return;
    }
    const parsedTarget = parseFloat(target) || 0;
    if (type !== 'measurement' && parsedTarget <= 0) {
      setError('Target value must be greater than 0.');
      return;
    }
    if (!categoryId) {
      setError('Please select or create a category.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim() || undefined,
        categoryId,
        type,
        target: parsedTarget,
        unit: unit.trim(),
        frequency,
        active,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save goal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialGoal ? 'Edit Goal or Metric' : 'Create Goal / Metric Log'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-950/50 p-3 text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <Input
          label="Name"
          placeholder="e.g. Weekly Body Weight, Money Saved, Morning Workout, Read Book"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Description (Optional)"
          placeholder="e.g. Weigh in every Sunday morning, or Track investment deposits"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="w-full">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Category
              </label>
              {onOpenCategoryModal && (
                <button
                  type="button"
                  onClick={onOpenCategoryModal}
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  + New Category
                </button>
              )}
            </div>
            <Select
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            />
          </div>

          <Select
            label="Type"
            options={[
              { value: 'boolean', label: 'Boolean (Yes / No Check-in)' },
              { value: 'numeric', label: 'Numeric (e.g. Steps, Calories)' },
              { value: 'duration', label: 'Duration (e.g. Hours, Minutes)' },
              { value: 'count', label: 'Count (e.g. Problems, Pages)' },
              { value: 'measurement', label: 'Measurement / Log (e.g. Weight, Height, Money Saved)' },
            ]}
            value={type}
            onChange={(e) => handleTypeChange(e.target.value as GoalType)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={
              type === 'boolean'
                ? 'Target (Completed = 1)'
                : type === 'measurement'
                ? 'Optional Target (Set 0 if none)'
                : 'Target Value'
            }
            type="number"
            step="any"
            disabled={type === 'boolean'}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            required={type !== 'measurement'}
          />

          <Input
            label="Unit Label"
            placeholder={
              type === 'boolean'
                ? 'done'
                : type === 'measurement'
                ? 'e.g. kg, lbs, cm, $, %'
                : 'e.g. steps, mins, pages'
            }
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <Select
            label="Frequency"
            options={[
              { value: 'daily', label: 'Daily (Every Day)' },
              { value: 'weekly', label: 'Weekly (e.g. Weekly Log)' },
              { value: 'monthly', label: 'Monthly (e.g. Monthly Savings/Height)' },
              { value: 'weekdays', label: 'Weekdays Only' },
              { value: 'weekends', label: 'Weekends Only' },
            ]}
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as GoalFrequency)}
          />

          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500 rounded-md border-slate-300"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Active in tracking view
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="secondary" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} size="sm">
            {initialGoal ? 'Save Changes' : 'Create Item'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
