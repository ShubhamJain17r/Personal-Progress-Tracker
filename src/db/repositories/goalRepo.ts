import { db } from '../database';
import { Goal, CreateGoalDTO, UpdateGoalDTO } from '../../types/goal';

export const goalRepo = {
  async getAll(): Promise<Goal[]> {
    return db.goals.orderBy('order').toArray();
  },

  async getActive(): Promise<Goal[]> {
    const all = await db.goals.toArray();
    return all.filter((g) => g.active).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  },

  async getById(id: string): Promise<Goal | undefined> {
    return db.goals.get(id);
  },

  async create(dto: CreateGoalDTO): Promise<Goal> {
    const id = `goal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const count = await db.goals.count();

    const goal: Goal = {
      ...dto,
      id,
      order: dto.order ?? count + 1,
      createdAt: now,
      updatedAt: now,
    };
    await db.goals.add(goal);
    return goal;
  },

  async update(id: string, dto: UpdateGoalDTO): Promise<void> {
    const now = new Date().toISOString();
    await db.goals.update(id, {
      ...dto,
      updatedAt: now,
    });
  },

  async toggleActive(id: string): Promise<boolean> {
    const goal = await db.goals.get(id);
    if (!goal) return false;
    const newActive = !goal.active;
    await db.goals.update(id, {
      active: newActive,
      updatedAt: new Date().toISOString(),
    });
    return newActive;
  },

  async delete(id: string): Promise<void> {
    await db.transaction('rw', db.goals, db.dailyRecords, async () => {
      await db.goals.delete(id);
      await db.dailyRecords.where('goalId').equals(id).delete();
    });
  },

  async bulkAdd(goals: Goal[]): Promise<void> {
    await db.goals.bulkPut(goals);
  },
};
