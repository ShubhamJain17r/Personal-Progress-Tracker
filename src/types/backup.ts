import { Goal } from './goal';
import { DailyRecord } from './record';
import { Category } from './category';

export interface BackupPayload {
  version: number;
  exportedAt: string;
  appName: 'PersonalProgressTracker';
  data: {
    categories: Category[];
    goals: Goal[];
    dailyRecords: DailyRecord[];
  };
}

export interface BackupValidationResult {
  valid: boolean;
  error?: string;
  summary?: {
    categoriesCount: number;
    goalsCount: number;
    recordsCount: number;
  };
  payload?: BackupPayload;
}
