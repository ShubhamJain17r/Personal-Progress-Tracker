import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { categoryRepo } from '../db/repositories/categoryRepo';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../types/category';

export function useCategories() {
  const categories = useLiveQuery(() => db.categories.toArray(), []) || [];

  return {
    categories,
    isLoading: categories === undefined,
    createCategory: (dto: CreateCategoryDTO) => categoryRepo.create(dto),
    updateCategory: (id: string, dto: UpdateCategoryDTO) => categoryRepo.update(id, dto),
    deleteCategory: (id: string) => categoryRepo.delete(id),
  };
}
