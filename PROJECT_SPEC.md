# Personal Progress Tracker — Project Specification

## 1. Project Overview
Build a modern, offline-first personal progress tracking web application.
The application allows a user to define daily/recurring goals, record progress, review historical data, visualize trends over arbitrary date ranges, and generate progress reports.
It functions completely client-side without a backend, database server, or internet connection after initial static asset load. Target deployment: GitHub Pages.

---

## 2. Core Product Philosophy
- **Simple & Fast:** Instant response times, minimal interaction cost for daily check-ins.
- **Offline-First & Private:** 100% data persistence in browser IndexedDB (Dexie.js). Zero telemetry, tracking, or cloud sync required.
- **Data-Driven & Flexible:** Support for multiple goal types (Boolean, Numeric, Duration, Count), custom categories, historical backfilling, arbitrary date filtering, analytics, and PDF reports.
- **Maintainable & Clean:** Layered architecture separating UI, Hooks, Business Services, and Database Access Layer.

---

## 3. Technology Stack
- **Frontend Framework:** React 19 / TypeScript / Vite
- **Styling:** Tailwind CSS + Lucide React icons
- **Database / Local Storage:** IndexedDB managed via Dexie.js (`dexie` and `dexie-react-hooks`)
- **Charts / Visualizations:** Recharts + Custom Heatmap Component
- **PWA & Offline:** `vite-plugin-pwa` with Service Worker & Web App Manifest
- **Reporting & Export:** `jspdf` & `jspdf-autotable` / HTML Canvas for client-side PDF generation; standard JSON & CSV data export/import routines
- **Date Handling:** `date-fns` for robust, timezone-safe date arithmetic and ISO-formatted `YYYY-MM-DD` standard strings

---

## 4. Key Architectural Layers
```
React Components (UI / Pages)
        ↓
Custom React Hooks (State / Subscriptions)
        ↓
Service Layer (Calculations, Streaks, Analytics, Aggregations, Exports, Reports)
        ↓
Dexie Database Layer (IndexedDB Repositories & Migrations)
```

---

## 5. Primary Features
1. **Dashboard:** Quick daily progress overview, completion percentages, streak counter, and rapid 1-click update controls.
2. **Goal Management:** CRUD for goals with type definitions (`boolean`, `numeric`, `duration`, `count`), frequency, targets, units, activation toggle, and categories.
3. **Category Management:** Flexible categorization (Health, Study, Work, Personal, etc.) with custom color tagging.
4. **Daily Tracking & History:** Record historical values, add notes, backfill missed days, and inspect past performance by calendar date.
5. **Analytics & Heatmap:** Arbitrary date-range filtering, metric drill-downs, streak tracking, line/bar charts, and GitHub-style activity heatmaps.
6. **Reports:** Weekly, monthly, and custom date range performance reports with client-side PDF generation and preview.
7. **Backup & Safety:** Full JSON database backup and restore (with schema validation), CSV record export, and clear data controls with safety confirmations.
8. **PWA Support:** Installable on desktop & mobile devices, fully functional offline.

