import React, { useState } from 'react';
import { Plus, Target, Search, FolderPlus } from 'lucide-react';
import { useGoals } from '../hooks/useGoals';
import { useCategories } from '../hooks/useCategories';
import { useDailyRecords } from '../hooks/useDailyRecords';
import { GoalCard } from '../components/goals/GoalCard';
import { GoalFormModal } from '../components/goals/GoalFormModal';
import { CategoryFormModal } from '../components/goals/CategoryFormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { EmptyState } from '../components/common/EmptyState';
import { Goal, CreateGoalDTO, UpdateGoalDTO } from '../types/goal';
import { CreateCategoryDTO } from '../types/category';
import { calculateGoalStreaks } from '../utils/streaks';

export const Goals: React.FC = () => {
  const { goals, createGoal, updateGoal, deleteGoal, toggleActive } = useGoals();
  const { categories, createCategory } = useCategories();
  const { records: allRecords } = useDailyRecords();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredGoals = goals.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.description && g.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || g.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setEditingGoal(null);
    setIsGoalModalOpen(true);
  };

  const handleOpenEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = async (dto: CreateGoalDTO | UpdateGoalDTO) => {
    if (editingGoal) {
      await updateGoal(editingGoal.id, dto);
    } else {
      await createGoal(dto as CreateGoalDTO);
    }
  };

  const handleConfirmDelete = async () => {
    if (!goalToDelete) return;
    setIsDeleting(true);
    try {
      await deleteGoal(goalToDelete.id);
      setGoalToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveCategory = async (dto: CreateCategoryDTO) => {
    await createCategory(dto);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Goal Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Define, customize, and organize your daily and recurring habits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setIsCategoryModalOpen(true)}
            leftIcon={<FolderPlus className="w-4 h-4" />}
            size="sm"
          >
            New Category
          </Button>
          <Button
            onClick={handleOpenCreate}
            leftIcon={<Plus className="w-4 h-4" />}
            size="sm"
          >
            Create Goal
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search goals by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All ({goals.length})
          </button>
          {categories.map((c) => {
            const count = goals.filter((g) => g.categoryId === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === c.id
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGoals.map((goal) => {
            const category = categories.find((c) => c.id === goal.categoryId);
            const streak = calculateGoalStreaks(goal, allRecords).currentStreak;

            return (
              <GoalCard
                key={goal.id}
                goal={goal}
                category={category}
                streak={streak}
                onEdit={handleOpenEdit}
                onDelete={(g) => setGoalToDelete(g)}
                onToggleActive={(id) => toggleActive(id)}
              />
            );
          })}
        </div>
      ) : goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No Goals Found"
          description="Create your first tracking goal with targets, units, and custom categories."
          actionLabel="Create First Goal"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="text-center py-12 text-sm text-slate-400">
          No goals match your search filter.
        </div>
      )}

      <GoalFormModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        initialGoal={editingGoal}
        categories={categories}
        onSave={handleSaveGoal}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
      />

      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
      />

      <ConfirmDialog
        isOpen={Boolean(goalToDelete)}
        onClose={() => setGoalToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Goal"
        message={`Are you sure you want to delete "${goalToDelete?.name}"? All historical logs associated with this goal will also be deleted.`}
        confirmLabel="Delete Goal"
        isLoading={isDeleting}
      />
    </div>
  );
};
