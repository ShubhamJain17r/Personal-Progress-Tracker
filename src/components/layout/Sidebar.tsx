import React from 'react';
import {
  LayoutDashboard,
  Target,
  CalendarDays,
  BarChart3,
  FileText,
  Settings,
} from 'lucide-react';
import { clsx } from 'clsx';

export type PageId = 'dashboard' | 'goals' | 'history' | 'analytics' | 'reports' | 'settings';

export interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const navItems: { id: PageId; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'history', label: 'History', icon: CalendarDays },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-slate-200/80 bg-white/70 dark:border-slate-800/80 dark:bg-slate-900/70 p-4 backdrop-blur-md shrink-0">
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={clsx(
                'flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs dark:bg-brand-500/15 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
              )}
            >
              <Icon
                className={clsx(
                  'h-5 w-5 shrink-0 transition-colors',
                  isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'
                )}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="rounded-xl bg-slate-100/60 p-3 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Offline-First Mode
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            Data saved locally to browser IndexedDB
          </p>
        </div>
      </div>
    </aside>
  );
};
