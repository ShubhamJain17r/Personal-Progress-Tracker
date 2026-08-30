import { db } from '../database';
import { DailyRecord, UpsertRecordDTO } from '../../types/record';
import { isGoalCompleted } from '../../utils/calculations';

export const recordRepo = {
  async getByDate(date: string): Promise<DailyRecord[]> {
    return db.dailyRecords.where('date').equals(date).toArray();
  },

  async getByDateAndGoal(date: string, goalId: string): Promise<DailyRecord | undefined> {
    return db.dailyRecords.where('[date+goalId]').equals([date, goalId]).first();
  },

  async getByDateRange(startDate: string, endDate: string): Promise<DailyRecord[]> {
    return db.dailyRecords
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray();
  },

  async getByGoal(goalId: string): Promise<DailyRecord[]> {
    return db.dailyRecords.where('goalId').equals(goalId).toArray();
  },

  async getAll(): Promise<DailyRecord[]> {
    return db.dailyRecords.toArray();
  },

  async upsert(dto: UpsertRecordDTO): Promise<DailyRecord> {
    const existing = await this.getByDateAndGoal(dto.date, dto.goalId);
    const now = new Date().toISOString();

    let completed = dto.completed;
    if (completed === undefined) {
      const goal = await db.goals.get(dto.goalId);
      if (goal) {
        completed = isGoalCompleted(goal, dto.value);
      } else {
        completed = dto.value > 0;
      }
    }

    if (existing) {
      const updated: DailyRecord = {
        ...existing,
        value: dto.value,
        completed,
        note: dto.note !== undefined ? dto.note : existing.note,
        updatedAt: now,
      };
      await db.dailyRecords.put(updated);
      return updated;
    } else {
      const newRecord: DailyRecord = {
        id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        date: dto.date,
        goalId: dto.goalId,
        value: dto.value,
        completed,
        note: dto.note,
        createdAt: now,
        updatedAt: now,
      };
      await db.dailyRecords.add(newRecord);
      return newRecord;
    }
  },

  async delete(id: string): Promise<void> {
    await db.dailyRecords.delete(id);
  },

  async bulkPut(records: DailyRecord[]): Promise<void> {
    await db.dailyRecords.bulkPut(records);
  },

  async clearAll(): Promise<void> {
    await db.dailyRecords.clear();
  },
};
