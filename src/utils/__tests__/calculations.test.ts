import { describe, it, expect } from 'vitest';
import {
  calculateRawCompletionPercentage,
  calculateCappedProgress,
  isGoalCompleted,
  formatValueWithUnit,
  formatGoalProgressDisplay,
} from '../calculations';

describe('calculations utility', () => {
  it('calculates raw completion percentage correctly for numeric goals', () => {
    expect(calculateRawCompletionPercentage(10000, 5000, 'numeric')).toBe(50);
    expect(calculateRawCompletionPercentage(10000, 12000, 'numeric')).toBe(120);
    expect(calculateRawCompletionPercentage(10, 0, 'numeric')).toBe(0);
  });

  it('calculates boolean completion percentage', () => {
    expect(calculateRawCompletionPercentage(1, 1, 'boolean')).toBe(100);
    expect(calculateRawCompletionPercentage(1, 0, 'boolean')).toBe(0);
  });

  it('calculates measurement completion percentage', () => {
    expect(calculateRawCompletionPercentage(70, 70, 'measurement')).toBe(100);
    expect(calculateRawCompletionPercentage(0, 72.5, 'measurement')).toBe(100);
  });

  it('caps visual progress at 100% while not underflowing 0%', () => {
    expect(calculateCappedProgress(100, 150, 'numeric')).toBe(100);
    expect(calculateCappedProgress(100, 50, 'numeric')).toBe(50);
    expect(calculateCappedProgress(100, -10, 'numeric')).toBe(0);
  });

  it('checks isGoalCompleted correctly for all goal types', () => {
    expect(isGoalCompleted({ type: 'boolean', target: 1 }, 1)).toBe(true);
    expect(isGoalCompleted({ type: 'boolean', target: 1 }, 0)).toBe(false);
    expect(isGoalCompleted({ type: 'numeric', target: 50 }, 50)).toBe(true);
    expect(isGoalCompleted({ type: 'numeric', target: 50 }, 49)).toBe(false);
    expect(isGoalCompleted({ type: 'duration', target: 6 }, 7)).toBe(true);
    expect(isGoalCompleted({ type: 'measurement', target: 70 }, 72.5)).toBe(true);
  });

  it('formats value with units nicely', () => {
    expect(formatValueWithUnit(1, '', 'boolean')).toBe('Completed');
    expect(formatValueWithUnit(0, '', 'boolean')).toBe('Pending');
    expect(formatValueWithUnit(10000, 'steps', 'numeric')).toBe('10,000 steps');
    expect(formatValueWithUnit(4.5, 'hrs', 'duration')).toBe('4.5 hrs');
    expect(formatValueWithUnit(72.5, 'kg', 'measurement')).toBe('72.5 kg');
  });

  it('formats goal progress display text', () => {
    expect(formatGoalProgressDisplay(1, 1, 'done', 'boolean')).toBe('Completed');
    expect(formatGoalProgressDisplay(4.5, 6, 'hours', 'duration')).toBe('4.5 / 6 hours');
    expect(formatGoalProgressDisplay(8400, 10000, 'steps', 'numeric')).toBe('8,400 / 10,000 steps');
    expect(formatGoalProgressDisplay(72.5, 70, 'kg', 'measurement')).toBe('72.5 kg (Target: 70 kg)');
    expect(formatGoalProgressDisplay(180, 0, 'cm', 'measurement')).toBe('180 cm');
  });
});
