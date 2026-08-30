import { db } from '../database';
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../../types/category';

export const categoryRepo = {
  async getAll(): Promise<Category[]> {
    return db.categories.toArray();
  },

  async getById(id: string): Promise<Category | undefined> {
    return db.categories.get(id);
  },

  async create(dto: CreateCategoryDTO): Promise<Category> {
    const id = `cat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const category: Category = {
      ...dto,
      id,
      createdAt: now,
      updatedAt: now,
    };
    await db.categories.add(category);
    return category;
  },

  async update(id: string, dto: UpdateCategoryDTO): Promise<void> {
    const now = new Date().toISOString();
    await db.categories.update(id, {
      ...dto,
      updatedAt: now,
    });
  },

  async delete(id: string): Promise<void> {
    await db.categories.delete(id);
  },

  async bulkAdd(categories: Category[]): Promise<void> {
    await db.categories.bulkPut(categories);
  },
};
