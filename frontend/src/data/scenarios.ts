/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Scenario } from '@/types';

/**
 * FULL SCENARIO POOL — 9 scenarios, 3 selected randomly per game.
 * Each game session picks 3 different ones so users get variety.
 */
export const SCENARIO_POOL: Scenario[] = [
  // ── 1. Morning Commute ────────────────────────────────────────
  {
    id: 'commute',
    titleKey: 'scenario.commute.title',
    descriptionKey: 'scenario.commute.desc',
    backgroundClass: 'scene-commute',
    choices: [
      { id: 'cycle',  labelKey: 'choice.cycle',  descriptionKey: 'choice.cycle.desc',  ecoPoints: 50, animation: 'cycling',    icon: '🚲', carbonSaved: 2.1 },
      { id: 'walk',   labelKey: 'choice.walk',   descriptionKey: 'choice.walk.desc',   ecoPoints: 40, animation: 'walking',    icon: '🚶', carbonSaved: 2.1 },
      { id: 'metro',  labelKey: 'choice.metro',  descriptionKey: 'choice.metro.desc',  ecoPoints: 25, animation: 'metro',      icon: '🚇', carbonSaved: 1.5 },
      { id: 'car',    labelKey: 'choice.car',    descriptionKey: 'choice.car.desc',    ecoPoints:  5, animation: 'car',        icon: '🚗', carbonSaved: 0   },
    ],
  },
  // ── 2. Lunch Break ────────────────────────────────────────────
  {
    id: 'diet',
    titleKey: 'scenario.diet.title',
    descriptionKey: 'scenario.diet.desc',
    backgroundClass: 'scene-diet',
    choices: [
      { id: 'plant',  labelKey: 'choice.plant',  descriptionKey: 'choice.plant.desc',  ecoPoints: 40, animation: 'plant-based', icon: '🥗', carbonSaved: 1.8 },
      { id: 'veggie', labelKey: 'choice.veggie', descriptionKey: 'choice.veggie.desc', ecoPoints: 30, animation: 'vegetarian',  icon: '🧀', carbonSaved: 1.2 },
      { id: 'meat',   labelKey: 'choice.meat',   descriptionKey: 'choice.meat.desc',   ecoPoints:  5, animation: 'omnivore',   icon: '🍗', carbonSaved: 0   },
    ],
  },
  // ── 3. Evening Energy ─────────────────────────────────────────
  {
    id: 'energy',
    titleKey: 'scenario.energy.title',
    descriptionKey: 'scenario.energy.desc',
    backgroundClass: 'scene-energy',
    choices: [
      { id: 'solar',     labelKey: 'choice.solar',     descriptionKey: 'choice.solar.desc',     ecoPoints: 50, animation: 'solar',     icon: '☀️', carbonSaved: 3.2 },
      { id: 'efficient', labelKey: 'choice.efficient', descriptionKey: 'choice.efficient.desc', ecoPoints: 30, animation: 'efficient', icon: '💡', carbonSaved: 1.5 },
      { id: 'standard',  labelKey: 'choice.standard',  descriptionKey: 'choice.standard.desc',  ecoPoints: 10, animation: 'standard',  icon: '🔌', carbonSaved: 0   },
    ],
  },
  // ── 4. Weekend Shopping ───────────────────────────────────────
  {
    id: 'shopping',
    titleKey: 'scenario.shopping.title',
    descriptionKey: 'scenario.shopping.desc',
    backgroundClass: 'scene-shopping',
    choices: [
      { id: 'local',    labelKey: 'choice.local',    descriptionKey: 'choice.local.desc',    ecoPoints: 45, animation: 'walking',    icon: '🛒', carbonSaved: 1.6 },
      { id: 'secondhand',labelKey:'choice.secondhand',descriptionKey:'choice.secondhand.desc',ecoPoints: 50, animation: 'cycling',    icon: '♻️', carbonSaved: 2.0 },
      { id: 'online',   labelKey: 'choice.online',   descriptionKey: 'choice.online.desc',   ecoPoints: 15, animation: 'standard',   icon: '📦', carbonSaved: 0.4 },
      { id: 'mall',     labelKey: 'choice.mall',     descriptionKey: 'choice.mall.desc',     ecoPoints:  5, animation: 'car',        icon: '🏬', carbonSaved: 0   },
    ],
  },
  // ── 5. Home Heating ───────────────────────────────────────────
  {
    id: 'heating',
    titleKey: 'scenario.heating.title',
    descriptionKey: 'scenario.heating.desc',
    backgroundClass: 'scene-heating',
    choices: [
      { id: 'heatpump', labelKey: 'choice.heatpump', descriptionKey: 'choice.heatpump.desc', ecoPoints: 50, animation: 'solar',     icon: '🌡️', carbonSaved: 3.5 },
      { id: 'sweater',  labelKey: 'choice.sweater',  descriptionKey: 'choice.sweater.desc',  ecoPoints: 40, animation: 'efficient', icon: '🧥', carbonSaved: 2.0 },
      { id: 'gas',      labelKey: 'choice.gas',      descriptionKey: 'choice.gas.desc',      ecoPoints: 10, animation: 'standard',  icon: '🔥', carbonSaved: 0   },
    ],
  },
  // ── 6. Water Usage ────────────────────────────────────────────
  {
    id: 'water',
    titleKey: 'scenario.water.title',
    descriptionKey: 'scenario.water.desc',
    backgroundClass: 'scene-water',
    choices: [
      { id: 'shower',   labelKey: 'choice.shower',   descriptionKey: 'choice.shower.desc',   ecoPoints: 40, animation: 'efficient', icon: '🚿', carbonSaved: 1.2 },
      { id: 'rainwater',labelKey: 'choice.rainwater',descriptionKey: 'choice.rainwater.desc',ecoPoints: 50, animation: 'solar',     icon: '💧', carbonSaved: 2.0 },
      { id: 'bath',     labelKey: 'choice.bath',     descriptionKey: 'choice.bath.desc',     ecoPoints: 10, animation: 'standard',  icon: '🛁', carbonSaved: 0   },
    ],
  },
  // ── 7. Vacation / Travel ──────────────────────────────────────
  {
    id: 'travel',
    titleKey: 'scenario.travel.title',
    descriptionKey: 'scenario.travel.desc',
    backgroundClass: 'scene-travel',
    choices: [
      { id: 'train',    labelKey: 'choice.train',    descriptionKey: 'choice.train.desc',    ecoPoints: 45, animation: 'metro',     icon: '🚂', carbonSaved: 3.8 },
      { id: 'staycation',labelKey:'choice.staycation',descriptionKey:'choice.staycation.desc',ecoPoints: 50, animation: 'walking',  icon: '🏕️', carbonSaved: 5.0 },
      { id: 'flight',   labelKey: 'choice.flight',   descriptionKey: 'choice.flight.desc',   ecoPoints:  5, animation: 'car',       icon: '✈️', carbonSaved: 0   },
    ],
  },
  // ── 8. Waste Management ───────────────────────────────────────
  {
    id: 'waste',
    titleKey: 'scenario.waste.title',
    descriptionKey: 'scenario.waste.desc',
    backgroundClass: 'scene-waste',
    choices: [
      { id: 'compost',  labelKey: 'choice.compost',  descriptionKey: 'choice.compost.desc',  ecoPoints: 45, animation: 'plant-based', icon: '🌱', carbonSaved: 1.5 },
      { id: 'recycle',  labelKey: 'choice.recycle',  descriptionKey: 'choice.recycle.desc',  ecoPoints: 35, animation: 'efficient',   icon: '♻️', carbonSaved: 1.0 },
      { id: 'landfill', labelKey: 'choice.landfill', descriptionKey: 'choice.landfill.desc', ecoPoints:  5, animation: 'omnivore',    icon: '🗑️', carbonSaved: 0   },
    ],
  },
  // ── 9. Digital Habits ─────────────────────────────────────────
  {
    id: 'digital',
    titleKey: 'scenario.digital.title',
    descriptionKey: 'scenario.digital.desc',
    backgroundClass: 'scene-digital',
    choices: [
      { id: 'stream_sd', labelKey: 'choice.stream_sd', descriptionKey: 'choice.stream_sd.desc', ecoPoints: 30, animation: 'efficient', icon: '📱', carbonSaved: 0.8 },
      { id: 'dark_mode', labelKey: 'choice.dark_mode', descriptionKey: 'choice.dark_mode.desc', ecoPoints: 40, animation: 'solar',     icon: '🖥️', carbonSaved: 1.0 },
      { id: 'stream_4k', labelKey: 'choice.stream_4k', descriptionKey: 'choice.stream_4k.desc', ecoPoints: 10, animation: 'standard',  icon: '📺', carbonSaved: 0   },
    ],
  },
];

export const SCENARIOS_PER_GAME = 3;

/**
 * Picks SCENARIOS_PER_GAME unique scenarios using a seeded shuffle
 * so every game session is different, but reproducible for the session.
 */
export function pickRandomScenarios(seed?: number): Scenario[] {
  const arr = [...SCENARIO_POOL];
  const s = seed ?? Date.now();

  // Fisher-Yates shuffle with simple LCG seed
  let r = s;
  for (let i = arr.length - 1; i > 0; i--) {
    r = (r * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(r) % (i + 1);
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }

  return arr.slice(0, SCENARIOS_PER_GAME);
}
