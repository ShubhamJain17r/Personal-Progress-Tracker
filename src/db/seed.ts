import { db } from './database';
import { DEFAULT_CATEGORIES } from './initialData';

export async function initializeDatabase(): Promise<void> {
  // Ensure default categories exist if the user has a fresh database
  const categoryCount = await db.categories.count();
  if (categoryCount === 0) {
    await db.categories.bulkAdd(DEFAULT_CATEGORIES);
  }
}
