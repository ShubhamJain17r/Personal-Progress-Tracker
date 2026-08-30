import { BackupPayload, BackupValidationResult } from '../types/backup';

export function validateBackupPayload(data: unknown): BackupValidationResult {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Backup data must be a valid JSON object.' };
  }

  const payload = data as Partial<BackupPayload>;

  if (payload.appName !== 'PersonalProgressTracker') {
    return {
      valid: false,
      error: 'Invalid application identifier. File is not a valid Personal Progress Tracker backup.',
    };
  }

  if (typeof payload.version !== 'number' || payload.version < 1) {
    return { valid: false, error: 'Invalid or missing backup version.' };
  }

  if (!payload.data || typeof payload.data !== 'object') {
    return { valid: false, error: 'Missing data container in backup file.' };
  }

  const { categories, goals, dailyRecords } = payload.data;

  if (!Array.isArray(categories)) {
    return { valid: false, error: 'Invalid or missing categories array.' };
  }

  if (!Array.isArray(goals)) {
    return { valid: false, error: 'Invalid or missing goals array.' };
  }

  if (!Array.isArray(dailyRecords)) {
    return { valid: false, error: 'Invalid or missing dailyRecords array.' };
  }

  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    if (!c.id || typeof c.id !== 'string' || !c.name || typeof c.name !== 'string') {
      return { valid: false, error: `Invalid category format at index ${i}.` };
    }
  }

  for (let i = 0; i < goals.length; i++) {
    const g = goals[i];
    if (
      !g.id ||
      typeof g.id !== 'string' ||
      !g.name ||
      typeof g.name !== 'string' ||
      typeof g.target !== 'number' ||
      !['boolean', 'numeric', 'duration', 'count', 'measurement'].includes(g.type)
    ) {
      return { valid: false, error: `Invalid goal format at index ${i} (${g.name || 'Unnamed'}).` };
    }
  }

  for (let i = 0; i < dailyRecords.length; i++) {
    const r = dailyRecords[i];
    if (
      !r.id ||
      typeof r.id !== 'string' ||
      !r.date ||
      typeof r.date !== 'string' ||
      !r.goalId ||
      typeof r.goalId !== 'string' ||
      typeof r.value !== 'number'
    ) {
      return { valid: false, error: `Invalid record format at index ${i}.` };
    }
  }

  return {
    valid: true,
    summary: {
      categoriesCount: categories.length,
      goalsCount: goals.length,
      recordsCount: dailyRecords.length,
    },
    payload: payload as BackupPayload,
  };
}
