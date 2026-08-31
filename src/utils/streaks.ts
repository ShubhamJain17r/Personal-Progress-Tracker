import { format, parseISO, isValid } from 'date-fns';
import { DailyRecord } from '../types/record';
import { Goal } from '../types/goal';
import { isGoalCompleted } from './calculations';
import { isGoalScheduledForDate, getScheduledDatesForGoal } from './dates';

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

  const recordedDates = Array.from(completionMap.keys()).sort();
  if (recordedDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  const earliestDate = recordedDates[0];
  const scheduledDates = getScheduledDatesForGoal(goal, earliestDate, referenceDateStr);

  let bestStreak = 0;
  let runningStreak = 0;

  for (const dStr of scheduledDates) {
    const isComp = completionMap.get(dStr) || false;
    if (isComp) {
      runningStreak++;
      if (runningStreak > bestStreak) {
        bestStreak = runningStreak;
      }
    } else {
      runningStreak = 0;
    }
  }

  // Calculate current active streak backward from the most recent scheduled date
  let currentStreak = 0;
  const reversedScheduled = [...scheduledDates].reverse();

  for (let i = 0; i < reversedScheduled.length; i++) {
    const dStr = reversedScheduled[i];
    const isComp = completionMap.get(dStr) || false;

    // If today is scheduled and not yet completed, allow yesterday's/last scheduled day streak to count
    if (i === 0 && dStr === referenceDateStr && !isComp) {
      continue;
    }

    if (isComp) {
      currentStreak++;
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
    // Only check goals scheduled for dateStr
    const scheduled = activeGoals.filter((g) => isGoalScheduledForDate(g, dateStr));
    if (scheduled.length === 0) return true;

    const list = dateRecords.get(dateStr);
    if (!list || list.length === 0) return false;

    let completedCount = 0;
    for (const r of list) {
      const goal = goalMap.get(r.goalId);
      if (goal && isGoalScheduledForDate(goal, dateStr) && isGoalCompleted(goal, r.value)) {
        completedCount++;
      }
    }
    return completedCount >= scheduled.length;
  };

  const dates = Array.from(dateRecords.keys()).sort();
  if (dates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

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
  if (!isValid(checkDate)) {
    return { currentStreak: 0, bestStreak };
  }

  const todaySuccessful = isDaySuccessful(referenceDateStr);
  if (todaySuccessful) {
    currentStreak++;
  }

  let testDate = parseISO(referenceDateStr);
  while (true) {
    testDate = new Date(testDate.getTime() - 86400000);
    const dStr = format(testDate, 'yyyy-MM-dd');
    if (isDaySuccessful(dStr)) {
      currentStreak++;
    } else {
      break;
    }
  }

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
  };
}
