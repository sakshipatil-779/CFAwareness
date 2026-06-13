import { describe, it, expect } from 'vitest';
import {
  calculateTotalEcoPoints,
  calculateTotalCarbonSaved,
  getEcoGrade,
  getScorePercentage,
  getBadge,
  formatCarbon,
  clamp,
} from '@/utils/scoreUtils';
import type { GameDecision } from '@/types';
import { MAX_ECO_POINTS } from '@/utils/constants';

// Helper factory
function makeDecision(scenarioId: string, points: number, carbon: number): GameDecision {
  return {
    scenarioId: scenarioId as GameDecision['scenarioId'],
    choiceId: 'test-choice',
    ecoPoints: points,
    carbonSaved: carbon,
    timestamp: Date.now(),
  };
}

describe('calculateTotalEcoPoints', () => {
  it('returns 0 for empty decisions array', () => {
    expect(calculateTotalEcoPoints([])).toBe(0);
  });

  it('sums eco-points correctly', () => {
    const decisions = [makeDecision('commute', 50, 2.0), makeDecision('diet', 30, 1.5)];
    expect(calculateTotalEcoPoints(decisions)).toBe(80);
  });

  it('clamps to MAX_ECO_POINTS', () => {
    const decisions = [
      makeDecision('commute', 100, 5.0),
      makeDecision('diet', 100, 5.0),
      makeDecision('energy', 100, 5.0),
    ];
    expect(calculateTotalEcoPoints(decisions)).toBe(MAX_ECO_POINTS);
  });

  it('clamps negative total to 0', () => {
    const decisions = [makeDecision('commute', -50, 0)];
    expect(calculateTotalEcoPoints(decisions)).toBe(0);
  });
});

describe('calculateTotalCarbonSaved', () => {
  it('returns 0 for empty decisions', () => {
    expect(calculateTotalCarbonSaved([])).toBe(0);
  });

  it('sums carbon saved correctly', () => {
    const decisions = [makeDecision('commute', 50, 2.5), makeDecision('diet', 30, 1.5)];
    expect(calculateTotalCarbonSaved(decisions)).toBeCloseTo(4.0);
  });
});

describe('getEcoGrade', () => {
  it('returns S for >= 135 points', () => {
    expect(getEcoGrade(135)).toBe('S');
    expect(getEcoGrade(150)).toBe('S');
  });

  it('returns A for 105–134 points', () => {
    expect(getEcoGrade(105)).toBe('A');
    expect(getEcoGrade(134)).toBe('A');
  });

  it('returns B for 75–104 points', () => {
    expect(getEcoGrade(75)).toBe('B');
    expect(getEcoGrade(104)).toBe('B');
  });

  it('returns C for 45–74 points', () => {
    expect(getEcoGrade(45)).toBe('C');
    expect(getEcoGrade(74)).toBe('C');
  });

  it('returns D for < 45 points', () => {
    expect(getEcoGrade(0)).toBe('D');
    expect(getEcoGrade(44)).toBe('D');
  });
});

describe('getScorePercentage', () => {
  it('returns 100 for MAX_ECO_POINTS', () => {
    expect(getScorePercentage(MAX_ECO_POINTS)).toBe(100);
  });

  it('returns 50 for half of max', () => {
    expect(getScorePercentage(MAX_ECO_POINTS / 2)).toBe(50);
  });

  it('returns 0 for 0 points', () => {
    expect(getScorePercentage(0)).toBe(0);
  });
});

describe('getBadge', () => {
  it('returns eco-hero for S grade', () => {
    expect(getBadge(190)).toBe('eco-hero');
  });

  it('returns new-leaf for D grade', () => {
    expect(getBadge(10)).toBe('new-leaf');
  });
});

describe('formatCarbon', () => {
  it('formats values < 1000 as kg CO₂', () => {
    expect(formatCarbon(2.5)).toBe('2.5 kg CO₂');
  });

  it('formats values >= 1000 as t CO₂', () => {
    expect(formatCarbon(1500)).toBe('1.5 t CO₂');
  });
});

describe('clamp', () => {
  it('clamps value below min', () => {
    expect(clamp(-5, 0, 100)).toBe(0);
  });

  it('clamps value above max', () => {
    expect(clamp(150, 0, 100)).toBe(100);
  });

  it('returns value within range unchanged', () => {
    expect(clamp(50, 0, 100)).toBe(50);
  });
});
