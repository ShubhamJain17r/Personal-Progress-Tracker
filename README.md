# 📈 Personal Progress Tracker

> A modern, fast, offline-first personal progress and habit tracking web application built with React, TypeScript, Tailwind CSS, and IndexedDB.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38bdf8.svg)](https://tailwindcss.com/)
[![IndexedDB](https://img.shields.io/badge/Storage-IndexedDB%20%2F%20Dexie-green.svg)](https://dexie.org/)

---

## 🌟 Key Features

- 🔒 **100% Offline-First & Private:** All data resides exclusively inside your browser's IndexedDB. Zero servers, zero telemetry, zero accounts, zero cloud lock-in.
- 🎯 **Flexible Goal Types:** Track boolean check-ins (e.g. *Workout completed*), numeric targets (e.g. *10,000 steps*), duration goals (e.g. *6 hours study*), and count metrics (e.g. *20 problems solved*).
- 🏷️ **Custom Categorization:** Organize your goals into custom categories (Fitness, Study, Coding, Health, Personal, Finance) with custom color badges.
- ⚡ **Rapid Daily Check-ins:** Designed for minimal friction with 1-click updates, quick-steppers, and daily journaling/notes.
- 📅 **History & Retroactive Backfill:** Browse past dates, inspect completion logs, and backfill missed days seamlessly.
- 📊 **Dynamic Analytics:** Filter by arbitrary date ranges (Today, This Week, Month, Custom Start $\rightarrow$ End) and view time-series trends, bar charts, and summary statistics.
- 🟩 **Activity Heatmap:** GitHub-style calendar consistency grid visualizing your daily performance intensity over weeks and months.
- 📄 **Client-Side PDF Reports:** Generate clean weekly, monthly, or custom date-range progress reports directly in your browser with download support.
- 💾 **Data Ownership & Portability:** Full JSON backup and restore with pre-validation, along with CSV export for spreadsheet analysis.
- 📱 **Installable PWA:** Install on desktop or mobile devices with service worker caching for full offline reliability.
- 🌓 **Dark & Light Modes:** Clean, accessible aesthetic with system theme detection.

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
│   (useGoals, useDailyRecords, useAnalytics, useStreaks)   │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│               Service / Business Logic Layer              │
│   (analyticsService, streakService, reportService, etc.)  │
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
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | UI framework and type-safe components |
| **Bundler** | [Vite](https://vitejs.dev/) | Fast build tooling and HMR |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Responsive design and dark mode styling |
| **Database** | [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) via [Dexie.js](https://dexie.org/) | Client-side reactive persistence |
| **Charts** | [Recharts](https://recharts.org/) | Time-series and categorical visualizations |
| **Icons** | [Lucide React](https://lucide.dev/) | Modern UI iconography |
| **PDF Generation**| [jsPDF](https://github.com/parallax/jsPDF) & [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) | Client-side report generation |
| **PWA** | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) | Service worker and offline caching |
| **Testing** | [Vitest](https://vitest.dev/) | Unit testing for business logic & math |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or pnpm / yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/personal-progress-tracker.git
   cd personal-progress-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
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

This project is configured for static hosting with zero backend requirements.

### Automatic Deployment (GitHub Actions)
A GitHub Actions workflow is provided in `.github/workflows/deploy.yml`. When you push to the `main` branch, GitHub Actions will automatically build and publish the site to GitHub Pages.

To enable GitHub Pages in your repository:
1. Navigate to your repository **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.

---

## 📖 Documentation

- [Project Specification](PROJECT_SPEC.md)
- [System Architecture](docs/ARCHITECTURE.md)
- [Data Model & IndexedDB Schema](docs/DATA_MODEL.md)
- [Development Plan & Roadmap](docs/DEVELOPMENT_PLAN.md)

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

