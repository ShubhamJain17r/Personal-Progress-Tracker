import React from 'react';
import { Sun, Moon, Monitor, TrendingUp } from 'lucide-react';
import { useTheme, Theme } from '../../hooks/useTheme';

export interface NavbarProps {
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const sequence: Theme[] = ['dark', 'light', 'system'];
    const currentIndex = sequence.indexOf(theme);
    const nextTheme = sequence[(currentIndex + 1) % sequence.length];
    setTheme(nextTheme);
  };

  const getThemeIcon = () => {
    if (theme === 'dark') return <Moon className="w-4 h-4 text-brand-400" />;
    if (theme === 'light') return <Sun className="w-4 h-4 text-amber-500" />;
    return <Monitor className="w-4 h-4 text-slate-400" />;
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-8 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm shadow-brand-500/30">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white capitalize">
            {currentPage}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Personal Progress & Habit Tracker
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={cycleTheme}
          title={`Theme: ${theme} (Click to toggle)`}
          className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          {getThemeIcon()}
          <span className="capitalize hidden sm:inline">{theme}</span>
        </button>
      </div>
    </header>
  );
};
