import { Category } from '../types/category';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat_fitness',
    name: 'Fitness & Health',
    color: '#10b981',
    icon: 'Activity',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_measurements',
    name: 'Body & Measurements',
    color: '#ec4899',
    icon: 'Scale',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_study',
    name: 'Study & Learning',
    color: '#3b82f6',
    icon: 'BookOpen',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_coding',
    name: 'Coding & Projects',
    color: '#8b5cf6',
    icon: 'Code2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_personal',
    name: 'Mindset & Habits',
    color: '#f59e0b',
    icon: 'Smile',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_finance',
    name: 'Finance & Savings',
    color: '#06b6d4',
    icon: 'DollarSign',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
