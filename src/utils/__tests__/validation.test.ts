import { describe, it, expect } from 'vitest';
import { validateBackupPayload } from '../validation';

describe('validation utility', () => {
  it('rejects non-object or null input', () => {
    expect(validateBackupPayload(null).valid).toBe(false);
    expect(validateBackupPayload('string').valid).toBe(false);
    expect(validateBackupPayload([]).valid).toBe(false);
  });

  it('rejects payload with invalid appName', () => {
    const invalid = { appName: 'WrongApp', version: 1, data: { categories: [], goals: [], dailyRecords: [] } };
    expect(validateBackupPayload(invalid).valid).toBe(false);
  });

  it('validates a correct payload including measurement goals successfully', () => {
    const valid = {
      appName: 'PersonalProgressTracker',
      version: 1,
      exportedAt: '2026-08-30T12:00:00Z',
      data: {
        categories: [
          { id: 'c1', name: 'Fitness', color: '#10b981', createdAt: '', updatedAt: '' },
          { id: 'c2', name: 'Body & Measurements', color: '#ec4899', createdAt: '', updatedAt: '' },
        ],
        goals: [
          { id: 'g1', name: 'Run', categoryId: 'c1', type: 'boolean', target: 1, unit: 'done', frequency: 'daily', active: true, createdAt: '', updatedAt: '' },
          { id: 'g2', name: 'Weight', categoryId: 'c2', type: 'measurement', target: 70, unit: 'kg', frequency: 'weekly', active: true, createdAt: '', updatedAt: '' },
        ],
        dailyRecords: [
          { id: 'r1', date: '2026-08-30', goalId: 'g1', value: 1, completed: true, createdAt: '', updatedAt: '' },
          { id: 'r2', date: '2026-08-30', goalId: 'g2', value: 72.5, completed: true, createdAt: '', updatedAt: '' },
        ],
      },
    };
    const res = validateBackupPayload(valid);
    expect(res.valid).toBe(true);
    expect(res.summary?.categoriesCount).toBe(2);
    expect(res.summary?.goalsCount).toBe(2);
    expect(res.summary?.recordsCount).toBe(2);
  });
});
