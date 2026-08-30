import { db } from '../db/database';
import { BackupPayload, BackupValidationResult } from '../types/backup';
import { validateBackupPayload } from '../utils/validation';
import { format } from 'date-fns';
import { calculateRawCompletionPercentage } from '../utils/calculations';

export const exportService = {
  async exportJSON(): Promise<void> {
    const categories = await db.categories.toArray();
    const goals = await db.goals.toArray();
    const dailyRecords = await db.dailyRecords.toArray();

    const payload: BackupPayload = {
      version: 1,
      appName: 'PersonalProgressTracker',
      exportedAt: new Date().toISOString(),
      data: {
        categories,
        goals,
        dailyRecords,
      },
    };

    const jsonString = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStamp = format(new Date(), 'yyyy-MM-dd_HHmm');
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress_tracker_backup_${dateStamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  async parseAndValidateBackupFile(file: File): Promise<BackupValidationResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          const validation = validateBackupPayload(parsed);
          resolve(validation);
        } catch (err: any) {
          resolve({ valid: false, error: `Invalid JSON syntax: ${err.message}` });
        }
      };
      reader.onerror = () => {
        resolve({ valid: false, error: 'Failed to read file.' });
      };
      reader.readAsText(file);
    });
  },

  async restoreBackup(payload: BackupPayload, mode: 'replace' | 'merge' = 'replace'): Promise<void> {
    await db.transaction('rw', db.categories, db.goals, db.dailyRecords, async () => {
      if (mode === 'replace') {
        await db.categories.clear();
        await db.goals.clear();
        await db.dailyRecords.clear();
      }

      await db.categories.bulkPut(payload.data.categories);
      await db.goals.bulkPut(payload.data.goals);
      await db.dailyRecords.bulkPut(payload.data.dailyRecords);
    });
  },

  async exportCSV(): Promise<void> {
    const goals = await db.goals.toArray();
    const categories = await db.categories.toArray();
    const dailyRecords = await db.dailyRecords.toArray();

    const goalMap = new Map(goals.map((g) => [g.id, g]));
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    dailyRecords.sort((a, b) => b.date.localeCompare(a.date));

    const headers = [
      'date',
      'goal_name',
      'category',
      'goal_type',
      'target',
      'unit',
      'recorded_value',
      'completion_percentage',
      'completed',
      'note',
    ];

    const rows = dailyRecords.map((r) => {
      const goal = goalMap.get(r.goalId);
      const category = goal ? categoryMap.get(goal.categoryId) : undefined;
      const target = goal?.target ?? 0;
      const goalType = goal?.type ?? 'numeric';
      const unit = goal?.unit ?? '';
      const completionPct = goal
        ? Math.round(calculateRawCompletionPercentage(target, r.value, goal.type))
        : 0;

      const sanitize = (str: string | undefined) => {
        if (!str) return '""';
        const escaped = str.replace(/"/g, '""');
        return `"${escaped}"`;
      };

      return [
        r.date,
        sanitize(goal?.name || 'Unknown Goal'),
        sanitize(category?.name || 'Uncategorized'),
        goalType,
        target,
        sanitize(unit),
        r.value,
        completionPct,
        r.completed ? 'true' : 'false',
        sanitize(r.note || ''),
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const dateStamp = format(new Date(), 'yyyy-MM-dd');
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress_records_${dateStamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  async clearAllData(): Promise<void> {
    await db.transaction('rw', db.categories, db.goals, db.dailyRecords, async () => {
      await db.categories.clear();
      await db.goals.clear();
      await db.dailyRecords.clear();
    });
  },
};
