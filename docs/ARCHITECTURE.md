# System Architecture

## 1. Overview
The Personal Progress Tracker is a single-page progressive web application (PWA) designed around a **Local-First / Offline-First** paradigm. All storage, analytics calculations, and report generation run entirely on the client within the browser.

```
+-----------------------------------------------------------------------+
|                             Browser UI                                |
|  +-----------------------------------------------------------------+  |
|  | Pages: Dashboard | Goals | History | Analytics | Reports | Settings |
|  +-----------------------------------------------------------------+  |
|  | Components: Common UI | Charts | Heatmaps | Goal Modals | Tables |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
|                            Hook Layer                                 |
|  - useGoals()         - useDailyRecords(dateRange / date)             |
|  - useAnalytics()     - useCategories()                               |
|  - useTheme()         - useStreaks()                                  |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
|                      Service / Business Logic                         |
|  - analyticsService.ts : aggregations, summary stats, trend lines     |
|  - calculations.ts     : completion percentages, unit normalizations  |
|  - streakService.ts    : current & best streak calculation algorithms |
|  - reportService.ts    : PDF document compilation (jsPDF)             |
|  - exportService.ts    : JSON schema validation, backup, CSV export   |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
|                         Data Access Layer                             |
|  - database.ts         : Dexie DB configuration & migrations          |
|  - repositories/       : goalRepo, recordRepo, categoryRepo           |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
|                         Browser IndexedDB                             |
+-----------------------------------------------------------------------+
```

---

## 2. Key Architectural Principles

1. **Separation of Concerns:**
   - **UI Components:** Responsible only for presentation, user interaction handling, and state reflection. No direct calculations or DB queries.
   - **Custom Hooks:** Provide reactive data binding using `useLiveQuery` from Dexie or wrapped React state.
   - **Service Layer:** Pure or isolated calculation functions (deterministic, easy to unit test).
   - **Data Access Layer:** Type-safe CRUD operations, bulk queries, indexes, and Dexie transactions.

2. **Single Source of Truth for Calculations:**
   - Goal completion logic: $completion = \min(100, (actual / target) \times 100)$ for display, preserving exact raw $actual$ numeric value.
   - Streak calculation: Centralized in `streakService.ts`. Reused across Dashboard, Analytics, and PDF Reports.

3. **Date Consistency:**
   - Standard format: ISO date string `YYYY-MM-DD` (local calendar date).
   - Avoid timezone shift bugs by avoiding arbitrary UTC timestamp conversions on date-only fields.

4. **Offline Capability & Asset Serving:**
   - Static assets served via GitHub Pages.
   - Handled by `vite-plugin-pwa` with Workbox precaching for instant offline loads.
   - Zero external runtime API dependencies.

---

## 3. Directory Layout

```
src/
  ├── assets/
  ├── components/
  │   ├── common/         # Button, Input, Modal, Select, Card, Badge, Alert
  │   ├── layout/         # Navbar, Sidebar, PageContainer, ThemeToggle
  │   ├── dashboard/      # DailyProgressSummary, QuickCheckinCard, StreakBadge
  │   ├── goals/          # GoalFormModal, GoalCard, GoalList, CategoryBadge
  │   ├── history/        # DateNavigator, DailyRecordEditor, HistoryTable
  │   ├── analytics/      # MetricSelector, DateRangeFilter, TrendCharts, Heatmap
  │   └── reports/        # ReportPreview, PDFGeneratorButton, DateRangePicker
  ├── db/
  │   ├── database.ts     # Dexie instance and table version schemas
  │   ├── initialData.ts  # Default categories and optional sample goals
  │   └── repositories/   # Typed repository operations
  ├── hooks/              # Reactive Dexie hooks and UI state hooks
  ├── services/           # Business logic: analytics, PDF, streaks, backup/export
  ├── types/              # TypeScript interfaces and models
  ├── utils/              # Pure helpers: dates, calculations, formatting, validations
  ├── pages/              # Primary route views
  ├── App.tsx
  └── main.tsx
```

---

## 4. Error Handling & Data Safety
- **Validation:** JSON backup imports validated with zod/schema checkers before touching IndexedDB.
- **Atomic Operations:** Dexie transactions for import and batch updates to prevent partial state corruption.
- **User Confirmations:** Destructive actions (reset data, delete goal) require explicit modal confirmation.

