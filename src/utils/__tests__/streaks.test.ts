import { describe, it, expect } from 'vitest';
import { calculateGoalStreaks } from '../streaks';
import { Goal } from '../../types/goal';
import { DailyRecord } from '../../types/record';

describe('streaks calculation utility', () => {
  const mockGoal: Goal = {
    id: 'g1',
    name: 'Daily Run',
    categoryId: 'c1',
    type: 'boolean',
    target: 1,
    unit: 'done',
    frequency: 'daily',
    active: true,
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  };

  it('handles empty records returning 0 streaks', () => {
    const result = calculateGoalStreaks(mockGoal, [], '2026-08-30');
    expect(result.currentStreak).toBe(0);
    expect(result.bestStreak).toBe(0);
  });

  it('calculates current streak when today is completed', () => {
    const records: DailyRecord[] = [
      { id: '1', date: '2026-08-28', goalId: 'g1', value: 1, completed: true, createdAt: '', updatedAt: '' },
      { id: '2', date: '2026-08-29', goalId: 'g1', value: 1, completed: true, createdAt: '', updatedAt: '' },
      { id: '3', date: '2026-08-30', goalId: 'g1', value: 1, completed: true, createdAt: '', updatedAt: '' },
    ];
    const result = calculateGoalStreaks(mockGoal, records, '2026-08-30');
    expect(result.currentStreak).toBe(3);
    expect(result.bestStreak).toBe(3);
  });

  it('calculates current streak when today is not completed yet but yesterday was', () => {
    const records: DailyRecord[] = [
      { id: '1', date: '2026-08-28', goalId: 'g1', value: 1, completed: true, createdAt: '', updatedAt: '' },
      { id: '2', date: '2026-08-29', goalId: 'g1', value: 1, completed: true, createdAt: '', updatedAt: '' },
    ];
    const result = calculateGoalStreaks(mockGoal, records, '2026-08-30');
    expect(result.currentStreak).toBe(2);
    expect(result.bestStreak).toBe(2);
  });

  it('breaks streak when a day is missed', () => {
    const records: DailyRecord[] = [
      { id: '1', date: '2026-08-20', goalId: 'g1', value: 1, completed: true, createdAt: '', updatedAt: '' },
      { id: '2', date: '2026-08-21', goalId: 'g1', value: 1, completed: true, createdAt: '', updatedAt: '' },
      { id: '3', date: '2026-08-22', goalId: 'g1', value: 1, completed: true, createdAt: '', updatedAt: '' },
      { id: '4', date: '2026-08-23', goalId: 'g1', value: 1, completed: true, createdAt: '', updatedAt: '' },
      { id: '5', date: '2026-08-29', goalId: 'g1', value: 1, completed: true, createdAt: '', updatedAt: '' },
      { id: '6', date: '2026-08-30', goalId: 'g1', value: 1, completed: true, createdAt: '', updatedAt: '' },
    ];
    const result = calculateGoalStreaks(mockGoal, records, '2026-08-30');
    expect(result.currentStreak).toBe(2);
    expect(result.bestStreak).toBe(4);
  });
});
