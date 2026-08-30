import { Goal, GoalType } from '../types/goal';

export function calculateRawCompletionPercentage(target: number, value: number, type?: GoalType): number {
  if (type === 'boolean') {
    return value >= 1 ? 100 : 0;
  }
  if (type === 'measurement') {
    if (target > 0) {
      return (value / target) * 100;
    }
    return value > 0 ? 100 : 0;
  }
  if (!target || target <= 0) {
    return value > 0 ? 100 : 0;
  }
  return (value / target) * 100;
}

export function calculateCappedProgress(target: number, value: number, type?: GoalType): number {
  const raw = calculateRawCompletionPercentage(target, value, type);
  return Math.min(100, Math.max(0, Math.round(raw)));
}

export function isGoalCompleted(goal: Pick<Goal, 'type' | 'target'>, value: number): boolean {
  if (goal.type === 'boolean') {
    return value >= 1;
  }
  if (goal.type === 'measurement') {
    return value > 0;
  }
  return value >= goal.target;
}

export function formatValueWithUnit(value: number, unit: string, type: GoalType): string {
  if (type === 'boolean') {
    return value >= 1 ? 'Completed' : 'Pending';
  }
  const formattedNum = Number.isInteger(value)
    ? value.toLocaleString()
    : value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  return unit ? `${formattedNum} ${unit}` : String(formattedNum);
}

export function formatGoalProgressDisplay(value: number, target: number, unit: string, type: GoalType): string {
  if (type === 'boolean') {
    return value >= 1 ? 'Completed' : 'Not Completed';
  }
  if (type === 'measurement') {
    const formattedVal = Number.isInteger(value) ? value.toLocaleString() : value.toFixed(1);
    if (target > 0) {
      const formattedTarget = Number.isInteger(target) ? target.toLocaleString() : target.toFixed(1);
      return `${formattedVal} ${unit} (Target: ${formattedTarget} ${unit})`.trim();
    }
    return `${formattedVal} ${unit}`.trim();
  }
  const formattedVal = Number.isInteger(value) ? value.toLocaleString() : value.toFixed(1);
  const formattedTarget = Number.isInteger(target) ? target.toLocaleString() : target.toFixed(1);
  return `${formattedVal} / ${formattedTarget} ${unit}`.trim();
}
