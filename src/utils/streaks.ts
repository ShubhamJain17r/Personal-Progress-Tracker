import { format, parseISO, subDays, isValid } from 'date-fns';
import { DailyRecord } from '../types/record';
import { Goal } from '../types/goal';
import { isGoalCompleted } from './calculations';

export interface StreakResult {
  currentStreak: number;
  bestStreak: number;
}

export function calculateGoalStreaks(
  goal: Goal,
  records: DailyRecord[],
  referenceDateStr: string = format(new Date(), 'yyyy-MM-dd')
): StreakResult {
  if (!records || records.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  const completionMap = new Map<string, boolean>();
  for (const r of records) {
    if (r.goalId === goal.id) {
      completionMap.set(r.date, isGoalCompleted(goal, r.value));
    }
  }

  const dates = Array.from(completionMap.keys()).sort();
  if (dates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  let bestStreak = 0;
  let runningStreak = 0;
  let prevDate: Date | null = null;

  for (const dateStr of dates) {
    const isComp = completionMap.get(dateStr) || false;
    const currDate = parseISO(dateStr);

    if (isComp) {
      if (prevDate) {
        const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          runningStreak++;
        } else {
          runningStreak = 1;
        }
      } else {
        runningStreak = 1;
      }
      prevDate = currDate;
      bestStreak = Math.max(bestStreak, runningStreak);
    } else {
      runningStreak = 0;
      prevDate = null;
    }
  }

  let currentStreak = 0;
  let checkDate = parseISO(referenceDateStr);
  if (!isValid(checkDate)) {
    return { currentStreak: 0, bestStreak };
  }

  const todayCompleted = completionMap.get(referenceDateStr);

  if (todayCompleted) {
    currentStreak++;
    checkDate = subDays(checkDate, 1);
  } else {
    checkDate = subDays(checkDate, 1);
  }

  while (true) {
    const dStr = format(checkDate, 'yyyy-MM-dd');
    if (completionMap.get(dStr)) {
      currentStreak++;
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }
  }

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
  };
}

export function calculateOverallStreaks(
  activeGoals: Goal[],
  records: DailyRecord[],
  referenceDateStr: string = format(new Date(), 'yyyy-MM-dd')
): StreakResult {
  if (activeGoals.length === 0 || records.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  const activeGoalIds = new Set(activeGoals.map((g) => g.id));
  const goalMap = new Map(activeGoals.map((g) => [g.id, g]));

  const dateRecords = new Map<string, DailyRecord[]>();
  for (const r of records) {
    if (activeGoalIds.has(r.goalId)) {
      const list = dateRecords.get(r.date) || [];
      list.push(r);
      dateRecords.set(r.date, list);
    }
  }

  const isDaySuccessful = (dateStr: string): boolean => {
    const list = dateRecords.get(dateStr);
    if (!list || list.length === 0) return false;
    let completedCount = 0;
    for (const r of list) {
      const goal = goalMap.get(r.goalId);
      if (goal && isGoalCompleted(goal, r.value)) {
        completedCount++;
      }
    }
    return completedCount >= activeGoals.length;
  };

  const dates = Array.from(dateRecords.keys()).sort();
  let bestStreak = 0;
  let running = 0;
  let prevDate: Date | null = null;

  for (const dStr of dates) {
    const success = isDaySuccessful(dStr);
    const currDate = parseISO(dStr);

    if (success) {
      if (prevDate) {
        const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          running++;
        } else {
          running = 1;
        }
      } else {
        running = 1;
      }
      prevDate = currDate;
      bestStreak = Math.max(bestStreak, running);
    } else {
      running = 0;
      prevDate = null;
    }
  }

  let currentStreak = 0;
  let checkDate = parseISO(referenceDateStr);
  if (isDaySuccessful(referenceDateStr)) {
    currentStreak++;
    checkDate = subDays(checkDate, 1);
  } else {
    checkDate = subDays(checkDate, 1);
  }

  while (true) {
    const dStr = format(checkDate, 'yyyy-MM-dd');
    if (isDaySuccessful(dStr)) {
      currentStreak++;
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }
  }

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
  };
}
