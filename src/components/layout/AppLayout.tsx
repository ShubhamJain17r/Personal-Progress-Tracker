import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar, PageId } from './Sidebar';
import { MobileNav } from './MobileNav';

export interface AppLayoutProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentPage,
  onNavigate,
  children,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans">
      <Navbar currentPage={currentPage} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>

      <MobileNav currentPage={currentPage} onNavigate={onNavigate} />
    </div>
  );
};
