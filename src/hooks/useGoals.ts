import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { goalRepo } from '../db/repositories/goalRepo';
import { CreateGoalDTO, UpdateGoalDTO } from '../types/goal';

export function useGoals() {
  const goals = useLiveQuery(() => db.goals.orderBy('order').toArray(), []) || [];
  const activeGoals = goals.filter((g) => g.active);

  return {
    goals,
    activeGoals,
    isLoading: goals === undefined,
    createGoal: (dto: CreateGoalDTO) => goalRepo.create(dto),
    updateGoal: (id: string, dto: UpdateGoalDTO) => goalRepo.update(id, dto),
    toggleActive: (id: string) => goalRepo.toggleActive(id),
    deleteGoal: (id: string) => goalRepo.delete(id),
  };
}
