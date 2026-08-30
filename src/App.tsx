import { useState, useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { PageId } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Goals } from './pages/Goals';
import { History } from './pages/History';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { initializeDatabase } from './db/seed';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    initializeDatabase()
      .catch((err) => console.error('Database initialization error:', err))
      .finally(() => setIsDbReady(true));
  }, []);

  if (!isDbReady) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <span className="text-xs font-semibold text-slate-400">Loading Progress Tracker...</span>
        </div>
      </div>
    );
  }

  return (
    <AppLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === 'dashboard' && (
        <Dashboard onNavigateToGoals={() => setCurrentPage('goals')} />
      )}
      {currentPage === 'goals' && <Goals />}
      {currentPage === 'history' && <History />}
      {currentPage === 'analytics' && (
        <Analytics
          onNavigateToHistory={(_date) => {
            setCurrentPage('history');
          }}
        />
      )}
      {currentPage === 'reports' && <Reports />}
      {currentPage === 'settings' && <Settings />}
    </AppLayout>
  );
}

export default App;
