import { db } from './database';
import { DEFAULT_CATEGORIES, SAMPLE_GOALS } from './initialData';

export async function initializeDatabase(): Promise<void> {
  const categoryCount = await db.categories.count();
  if (categoryCount === 0) {
    await db.categories.bulkAdd(DEFAULT_CATEGORIES);
  }

  const goalCount = await db.goals.count();
  if (goalCount === 0) {
    await db.goals.bulkAdd(SAMPLE_GOALS);
  }
}
