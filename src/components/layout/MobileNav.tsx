import React from 'react';
import { navItems, PageId } from './Sidebar';
import { clsx } from 'clsx';

export interface MobileNavProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentPage, onNavigate }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 bg-white/90 px-2 py-1.5 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={clsx(
                'flex flex-col items-center gap-1 rounded-xl p-2 transition-all',
                isActive
                  ? 'text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
