# Data Model Specification

## 1. IndexedDB Schema (Dexie.js)

Database Name: `PersonalProgressTrackerDB`
Current Schema Version: `1`

### 1.1 `goals` Table
Stores definition and configuration of user goals.

```typescript
export type GoalType = 'boolean' | 'numeric' | 'duration' | 'count';
export type GoalFrequency = 'daily' | 'weekly' | 'weekdays' | 'weekends';

export interface Goal {
  id: string;              // UUID
  name: string;            // e.g., "Daily Workout", "Read Book"
  description?: string;    // Optional details
  categoryId: string;      // Foreign key -> categories.id
  type: GoalType;          // 'boolean' | 'numeric' | 'duration' | 'count'
  target: number;          // Target value (e.g. 1 for boolean, 10000 for steps, 60 for minutes)
  unit: string;            // Display unit (e.g. 'steps', 'mins', 'pages', 'bool', 'hrs')
  frequency: GoalFrequency;// Target scheduling recurrence
  active: boolean;         // Active in daily tracking
  createdAt: string;       // ISO 8601 Timestamp
  updatedAt: string;       // ISO 8601 Timestamp
}
```
**IndexedDB Table Indexes:**
- `id` (Primary Key)
- `categoryId`
- `active`
- `createdAt`

---

### 1.2 `dailyRecords` Table
Stores actual user progress and notes per goal per date.

```typescript
export interface DailyRecord {
  id: string;              // UUID
  date: string;            // 'YYYY-MM-DD' (Local calendar date)
  goalId: string;          // Foreign key -> goals.id
  value: number;           // Recorded actual progress value (0 or 1 for boolean, float/int for others)
  completed: boolean;      // Calculated flag: value >= goal.target
  note?: string;           // Optional daily reflection or journal entry
  createdAt: string;       // ISO 8601 Timestamp
  updatedAt: string;       // ISO 8601 Timestamp
}
```
**IndexedDB Table Indexes:**
- `id` (Primary Key)
- `date`
- `goalId`
- `[date+goalId]` (Compound index for rapid lookup and uniqueness per day per goal)
- `completed`

---

### 1.3 `categories` Table
User-defined or default classification tags.

```typescript
export interface Category {
  id: string;              // UUID
  name: string;            // e.g. "Health & Fitness", "Study & Coding"
  color: string;           // Hex color code or Tailwind color token (e.g. '#10B981')
  icon?: string;           // Lucide icon identifier
  createdAt: string;       // ISO 8601 Timestamp
  updatedAt: string;       // ISO 8601 Timestamp
}
```
**IndexedDB Table Indexes:**
- `id` (Primary Key)
- `name`

---

## 2. Backup & Export Data Structures

### 2.1 JSON Backup (`BackupPayload`)
```typescript
export interface BackupPayload {
  version: number;
  exportedAt: string;
  appName: 'PersonalProgressTracker';
  data: {
    categories: Category[];
    goals: Goal[];
    dailyRecords: DailyRecord[];
  };
}
```

### 2.2 CSV Export Format
```csv
date,goal_name,category,goal_type,target,unit,recorded_value,completion_percentage,completed,note
2026-08-30,"Morning Run","Fitness","duration",30,"mins",35,116.67,true,"Great pace today"
```

---

## 3. Analytics & Aggregation Types

```typescript
export interface DateRange {
  startDate: string; // 'YYYY-MM-DD'
  endDate: string;   // 'YYYY-MM-DD'
}

export interface MetricSummary {
  goalId: string;
  goalName: string;
  totalValue: number;
  averageValue: number;
  minValue: number;
  maxValue: number;
  completionRate: number; // 0 to 100%
  completedDays: number;
  missedDays: number;
  currentStreak: number;
  bestStreak: number;
  unit: string;
}

export interface DailyHeatmapEntry {
  date: string;       // 'YYYY-MM-DD'
  completionRate: number; // 0 to 100
  totalGoals: number;
  completedGoals: number;
}
```

