export type GoalType = 'boolean' | 'numeric' | 'duration' | 'count' | 'measurement';
export type GoalFrequency = 'daily' | 'weekly' | 'weekdays' | 'weekends' | 'monthly';

export interface Goal {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  type: GoalType;
  target: number;
  unit: string;
  frequency: GoalFrequency;
  active: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateGoalDTO = Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateGoalDTO = Partial<Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>>;
