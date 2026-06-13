import type { GameDecision, BadgeId } from '@/types';
import { ECO_GRADE_THRESHOLDS, MAX_ECO_POINTS } from './constants';

/**
 * Calculate total Eco-Points from an array of decisions.
 * Points are clamped to [0, MAX_ECO_POINTS].
 */
export function calculateTotalEcoPoints(decisions: GameDecision[]): number {
  const total = decisions.reduce((sum, d) => sum + d.ecoPoints, 0);
  return Math.max(0, Math.min(total, MAX_ECO_POINTS));
}

/**
 * Calculate total carbon saved (kg CO₂e) from decisions.
 */
export function calculateTotalCarbonSaved(decisions: GameDecision[]): number {
  return decisions.reduce((sum, d) => sum + d.carbonSaved, 0);
}

/**
 * Determine eco grade letter based on total points.
 */
export function getEcoGrade(totalPoints: number): 'S' | 'A' | 'B' | 'C' | 'D' {
  if (totalPoints >= ECO_GRADE_THRESHOLDS.S) return 'S';
  if (totalPoints >= ECO_GRADE_THRESHOLDS.A) return 'A';
  if (totalPoints >= ECO_GRADE_THRESHOLDS.B) return 'B';
  if (totalPoints >= ECO_GRADE_THRESHOLDS.C) return 'C';
  return 'D';
}

/**
 * Calculate score as a percentage of max possible.
 */
export function getScorePercentage(totalPoints: number): number {
  return Math.round((totalPoints / MAX_ECO_POINTS) * 100);
}

/**
 * Return badge id based on total points.
 */
export function getBadge(totalPoints: number): BadgeId {
  const grade = getEcoGrade(totalPoints);
  const badges: Record<typeof grade, BadgeId> = {
    S: 'eco-hero',
    A: 'green-champion',
    B: 'planet-saver',
    C: 'climate-warrior',
    D: 'new-leaf',
  };
  return badges[grade];
}

/**
 * Format carbon saved into a human-readable string.
 * e.g. 2.5 → "2.5 kg CO₂"
 */
export function formatCarbon(kgCO2: number): string {
  if (kgCO2 >= 1000) {
    return `${(kgCO2 / 1000).toFixed(1)} t CO₂`;
  }
  return `${kgCO2.toFixed(1)} kg CO₂`;
}

/**
 * Clamp a number between min and max (inclusive).
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
