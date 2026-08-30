# Development Plan & Implementation Roadmap

## 1. Overview & Incremental Strategy
This plan follows a phased approach to build the Personal Progress Tracker without monolithic or risky rewrites.

---

## 2. Phase Breakdown

### Phase 0: Planning & Architectural Review (Current)
- [x] Verify empty workspace and requirements.
- [x] Create `PROJECT_SPEC.md`, `docs/ARCHITECTURE.md`, `docs/DATA_MODEL.md`, `docs/DEVELOPMENT_PLAN.md`.
- [x] Identify architectural risks and mitigations.
- [x] Create Implementation Plan artifact and request user approval.

### Phase 1: Project Setup & Baseline Tooling
- Initialize Vite + React + TypeScript in root.
- Configure Tailwind CSS (with Dark Mode class support), Lucide React, and PostCSS.
- Setup standard directory structure (`src/components`, `src/db`, `src/hooks`, `src/services`, `src/types`, `src/utils`, `src/pages`).
- Configure Vitest for pure business logic testing.
- Verify basic build and development server execution.

### Phase 2: Database Layer & Data Repositories
- Install `dexie` and `dexie-react-hooks`.
- Implement `src/db/database.ts` with typed tables and versioned schema.
- Implement seed/initial default categories (Fitness, Study, Health, Coding, Personal, Finance) and sample starter goals.
- Implement repository helper functions with compound queries (`getRecordsByDateRange`, `getGoalRecords`, `upsertRecord`).
- Write unit tests for database schema, migrations, and CRUD operations.

### Phase 3: Goal & Category Management
- Build `GoalModal` (Create / Edit) supporting 4 goal types (`boolean`, `numeric`, `duration`, `count`), targets, units, categories, and frequency.
- Build Goal List screen with category filtering, search, and active/inactive toggling.
- Implement Category management modal (add custom category, pick colors).

### Phase 4: Daily Tracking & Rapid Check-in Workflow
- Implement reusable calculation utilities (`src/utils/calculations.ts` and `src/utils/dates.ts`).
- Create single-click/quick-input controls for daily goal check-in:
  - Boolean: Toggle button (Check / Uncheck).
  - Numeric/Count: Quick +/- step buttons + direct numeric input.
  - Duration: Quick increment timer/buttons (e.g. +15m, +30m, custom).
- Optional daily notes/journaling per goal or per day.

### Phase 5: Dashboard
- Build main Dashboard layout:
  - Today's date & day-of-week header with quick "Previous Day / Today / Next Day" navigation.
  - Daily completion summary donut / progress bar.
  - Goal list sorted by active status and category.
  - Streak badges per goal and overall daily streak indicator.
  - Quick statistics card.

### Phase 6: History & Backfill View
- Calendar date picker & chronological timeline browser.
- Edit past records and backfill missed historical days.
- Daily notes view and historical completion metrics.

### Phase 7: Analytics & Visualization
- Install `recharts`.
- Filter-driven interface:
  - Date range presets (Today, This Week, Last Week, This Month, Last Month, Last 30/90 Days, This Year, Custom Range).
  - Goal / Metric filter dropdown.
- Chart implementations:
  - Time-series Line Chart (actual vs target trend).
  - Categorical Bar Chart (completion rate by category / day).
  - Summary cards (Total, Average, Min, Max, Completion %, Streak stats).

### Phase 8: Consistency Heatmap
- Implement yearly/multi-month activity heatmap (GitHub-style calendar grid with color intensity scaling).
- Interactive tooltip and click-to-view date details.

### Phase 9: Reports & Client-Side PDF Generation
- Install `jspdf` and `jspdf-autotable`.
- Build Reports page with Weekly, Monthly, and Custom date-range selectors.
- Live report preview with summary stats, goal performance breakdown tables, and notes.
- Client-side PDF export button with clean formatted typography and tables.

### Phase 10: Backup, Restore & Safety Controls
- Full JSON export (all tables, metadata, schema version).
- JSON import with pre-import validation and merge/overwrite options.
- CSV export for historical logs (date, goal, category, target, recorded value, completed, note).
- Clear database with two-step confirmation modal.

### Phase 11: PWA & Offline Support
- Configure `vite-plugin-pwa` with manifest (name, short name, theme color, icons).
- Service Worker registration with offline asset caching strategy.

### Phase 12: Polish & Accessibility
- Dark mode theme toggle (Light / Dark / System) with smooth transitions.
- Responsive mobile layout with bottom navigation / compact header.
- Keyboard navigation, ARIA attributes, empty states across all views.
- Production build validation.

