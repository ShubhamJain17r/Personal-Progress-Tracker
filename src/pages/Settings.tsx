import React from 'react';
import { Sun, Moon, Monitor, Database, Info } from 'lucide-react';
import { Card } from '../components/common/Card';
import { BackupManager } from '../components/settings/BackupManager';
import { useTheme, Theme } from '../hooks/useTheme';
import { useGoals } from '../hooks/useGoals';
import { useCategories } from '../hooks/useCategories';
import { useDailyRecords } from '../hooks/useDailyRecords';
import { clsx } from 'clsx';

export const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { goals } = useGoals();
  const { categories } = useCategories();
  const { records } = useDailyRecords();

  const themes: { id: Theme; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Settings & Data Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize display preferences, manage backups, and export tracking records
        </p>
      </div>

      <Card className="p-5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Appearance & Theme
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Choose how the Personal Progress Tracker appears on your device
        </p>

        <div className="grid grid-cols-3 gap-3 max-w-md">
          {themes.map((t) => {
            const Icon = t.icon;
            const isSelected = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={clsx(
                  'flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all duration-150',
                  isSelected
                    ? 'border-brand-500 bg-brand-50/50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 ring-2 ring-brand-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                )}
              >
                <Icon className="w-5 h-5 mb-1.5" />
                <span className="text-xs font-semibold">{t.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Local Storage Metrics
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-xl font-black text-slate-900 dark:text-white block">
              {goals.length}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Total Goals</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-xl font-black text-slate-900 dark:text-white block">
              {categories.length}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Categories</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-xl font-black text-brand-600 dark:text-brand-400 block">
              {records.length}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Recorded Check-ins</span>
          </div>
        </div>
      </Card>

      <BackupManager />

      <Card className="p-5 border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Personal Progress Tracker v1.0.0
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              An offline-first, client-only application built with React, TypeScript, Tailwind CSS, IndexedDB (Dexie.js), and Recharts. Released under the MIT License.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
