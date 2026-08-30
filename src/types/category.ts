export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateCategoryDTO = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCategoryDTO = Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>;
