import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Category, CreateCategoryDTO } from '../../types/category';

export interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dto: CreateCategoryDTO) => Promise<void>;
  initialCategory?: Category | null;
}

const PRESET_COLORS = [
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#f59e0b',
  '#ef4444',
  '#06b6d4',
  '#ec4899',
  '#6366f1',
];

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCategory,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#10b981');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCategory) {
      setName(initialCategory.name);
      setColor(initialCategory.color);
    } else {
      setName('');
      setColor('#10b981');
    }
    setError(null);
  }, [initialCategory, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a category name.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        color,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialCategory ? 'Edit Category' : 'Create Category'}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-950/50 p-3 text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <Input
          label="Category Name"
          placeholder="e.g. Fitness, Study, Coding, Health"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Category Color Tag
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full transition-transform ${
                  color === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="secondary" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} size="sm">
            {initialCategory ? 'Save' : 'Add Category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
