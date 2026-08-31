# 📈 Personal Progress Tracker

> A modern, fast, offline-first personal progress, habit tracking, and metric logging web application built with React, TypeScript, Tailwind CSS, and IndexedDB.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38bdf8.svg)](https://tailwindcss.com/)
[![IndexedDB](https://img.shields.io/badge/Storage-IndexedDB%20%2F%20Dexie-green.svg)](https://dexie.org/)

---

## 🌟 Key Features

- 🔒 **100% Offline-First & Private:** All data resides exclusively inside your browser's IndexedDB. Zero servers, zero telemetry, zero accounts, and zero cloud lock-in.
- ⚖️ **Measurement & Metric Logging:** Record periodic measurements and non-cumulative metrics like **Weekly Body Weight (kg/lbs)**, **Height (cm)**, **Body Fat (%)**, **Money Saved ($)**, or **Expenses** with optional targets.
- 🎯 **Flexible Goal Types:**
  - **Measurement / Log:** Periodic value logging with change tracking ($\Delta$).
  - **Boolean:** Daily/weekly yes/no check-ins (e.g. *Morning Workout*).
  - **Numeric:** Quantity targets with custom units (e.g. *10,000 steps*).
  - **Duration:** Time targets (e.g. *6 hours study*, *30 mins reading*).
  - **Count:** Discrete counters (e.g. *5 LeetCode problems*).
- 🗓️ **Intelligent Day-Specific Scheduling:**
  - **Weekly goals** automatically schedule and appear on **Sundays**.
  - **Weekdays goals** schedule Monday through Friday.
  - **Weekends goals** schedule Saturday and Sunday.
  - **Daily goals** schedule every single day.
  - Dynamic progress counters (e.g. `3 of 5 completed`) compute strictly against goals scheduled for the active date.
- 💾 **Explicit "Save Log" & Instant Feedback:** Fast numeric inputs and steppers with dedicated **Save Log** buttons and animated visual confirmation (`Saved! ✓`).
- 🏷️ **Custom Categorization:** Organize habits and measurements into custom categories (*Fitness & Health*, *Body & Measurements*, *Finance & Savings*, *Study & Learning*, *Mindset*) with custom color tags.
- 📅 **History & Retroactive Backfilling:** Browse any past date via calendar navigator, inspect completion records, and backfill missed entries or reflection notes.
- 📊 **Dynamic Trend Analytics & Actual Readings:**
  - Visualizes **actual recorded readings** over time with smooth area/bar charts.
  - Calculates **Period Change ($\Delta$)**, **Initial vs. Latest Reading**, **Min/Max Range**, and **Averages**.
  - Interactive tooltips distinguishing recorded entries from unrecorded days.
- 🟩 **Activity Heatmap Matrix:** GitHub-style calendar consistency grid visualizing your daily habit execution intensity over weeks and months.
- 📄 **Client-Side PDF Reports:** Generate structured weekly, monthly, or custom date-range performance summaries directly in your browser with instant PDF export.
- 💾 **Data Ownership & Portability:** Export full JSON backups (with restore validation & replace/merge modes) and structured CSV files for Excel/Google Sheets.
- 📱 **Installable PWA:** Install on desktop or mobile devices with service worker caching for offline access anywhere.
- 🌓 **Dark & Light Modes:** Clean aesthetic with system theme detection.

---

## 🏗️ Architecture

The application adopts a clean, layered architecture separating user interface presentation from calculation engines and database access:

```
┌───────────────────────────────────────────────────────────┐
│                     React UI Layer                        │
│   (Dashboard, Goals, History, Analytics, Reports, Settings)│
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│                      Hook Layer                           │
│   (useGoals, useDailyRecords, useCategories, useTheme)    │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│               Service / Business Logic Layer              │
│   (analyticsService, exportService, reportService, etc.)  │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│               Dexie.js / Data Access Layer                │
│   (Versioned schemas, transactions, compound indexes)     │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│                    Browser IndexedDB                      │
└───────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | Type-safe declarative UI components |
| **Bundler** | [Vite](https://vitejs.dev/) | Fast build tooling and local HMR |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Responsive utility-first design and dark mode |
| **Database** | [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) via [Dexie.js](https://dexie.org/) | Local-first reactive persistence |
| **Charts** | [Recharts](https://recharts.org/) | Time-series trends and category breakdown visualizations |
| **Icons** | [Lucide React](https://lucide.dev/) | Icon library |
| **PDF Generation**| [jsPDF](https://github.com/parallax/jsPDF) & [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) | Client-side report generation |
| **PWA** | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) | Service worker and web manifest generation |
| **Testing** | [Vitest](https://vitest.dev/) | Unit testing suite |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm, yarn, or pnpm

### Installation & Local Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ShubhamJain17r/Personal-Progress-Tracker.git
   cd Personal-Progress-Tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Run unit tests:**
   ```bash
   npm run test
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🌐 Deploying to GitHub Pages

This application is 100% static and requires no backend servers or paid licenses.

### Automatic Deployment (GitHub Actions)
A production-ready GitHub Actions workflow is provided in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

To host your own copy on GitHub Pages:
1. Push your repository to GitHub.
2. In your repository, go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. GitHub will automatically run the workflow and deploy the application to:
   ```
   https://<your-username>.github.io/<repo-name>/
   ```

---

## 📖 Documentation

- [Project Specification](PROJECT_SPEC.md)
- [System Architecture](docs/ARCHITECTURE.md)
- [Data Model & IndexedDB Schema](docs/DATA_MODEL.md)
- [Development Plan & Roadmap](docs/DEVELOPMENT_PLAN.md)

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
