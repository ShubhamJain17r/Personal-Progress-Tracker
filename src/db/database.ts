import Dexie, { type Table } from 'dexie';
import { Goal } from '../types/goal';
import { DailyRecord } from '../types/record';
import { Category } from '../types/category';

export class AppDatabase extends Dexie {
  goals!: Table<Goal, string>;
  dailyRecords!: Table<DailyRecord, string>;
  categories!: Table<Category, string>;

  constructor() {
    super('PersonalProgressTrackerDB');

    this.version(1).stores({
      goals: 'id, categoryId, type, active, order, createdAt',
      dailyRecords: 'id, date, goalId, completed, [date+goalId], createdAt',
      categories: 'id, name, createdAt',
    });
  }
}

export const db = new AppDatabase();
