// ============================================================
// EcoQuest — Global TypeScript Definitions
// ============================================================

// ----- Language -----
export type Language = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'pt' | 'ar' | 'ja' | 'zh';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
}

// ----- Game -----
export type ScenarioId =
  | 'commute'
  | 'diet'
  | 'energy'
  | 'shopping'
  | 'heating'
  | 'water'
  | 'travel'
  | 'waste'
  | 'digital';

export type ChoiceId = string;

export interface Choice {
  id: ChoiceId;
  /** Translation keys — resolved at runtime via language context */
  labelKey: string;
  descriptionKey: string;
  ecoPoints: number;
  animation: AnimationType;
  icon: string;
  carbonSaved: number; // kg CO₂ equivalent saved vs worst option
}

export interface Scenario {
  id: ScenarioId;
  titleKey: string;
  descriptionKey: string;
  backgroundClass: string;
  choices: Choice[];
}

export type AnimationType =
  | 'cycling'
  | 'walking'
  | 'bus'
  | 'car'
  | 'metro'
  | 'plant-based'
  | 'vegetarian'
  | 'omnivore'
  | 'solar'
  | 'efficient'
  | 'standard'
  | 'idle';

export interface GameDecision {
  scenarioId: ScenarioId;
  choiceId: ChoiceId;
  ecoPoints: number;
  carbonSaved: number;
  timestamp: number;
}

export interface GameState {
  isStarted: boolean;
  isCompleted: boolean;
  currentScenarioIndex: number;
  totalEcoPoints: number;
  totalCarbonSaved: number;
  decisions: GameDecision[];
  characterId: CharacterId;
  userId: string | null;
}

export type CharacterId = 'alex' | 'maya' | 'riya' | 'carlos';

export interface Character {
  id: CharacterId;
  nameKey: string;
  descriptionKey: string;
  avatar: string; // SVG string or image URL
  accentColor: string;
}

// ----- User / Auth -----
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
  language: Language;
  totalEcoPoints: number;
  totalCarbonSaved: number;
  gamesPlayed: number;
  createdAt: number;
  lastPlayedAt: number;
}

// ----- Leaderboard -----
export interface LeaderboardEntry {
  rank: number;
  uid: string;
  displayName: string;
  photoURL: string | null;
  totalEcoPoints: number;
  totalCarbonSaved: number;
  country?: string;
  badge?: BadgeId;
}

export type BadgeId =
  | 'eco-hero'
  | 'green-champion'
  | 'planet-saver'
  | 'climate-warrior'
  | 'new-leaf';

// ----- AI Analysis -----
export interface AnalysisRequest {
  userId: string;
  language: Language;
  totalEcoPoints: number;
  totalCarbonSaved: number;
  decisions: GameDecision[];
}

export interface AnalysisResponse {
  analysisText: string;
  audioUrl: string; // Signed URL from GCS (TTS output)
  tips: string[];
  score: {
    label: string;
    value: number;
    grade: 'S' | 'A' | 'B' | 'C' | 'D';
  };
}

// ----- Translation -----
export type TranslationCache = Record<string, Partial<Record<Language, string>>>;

// ----- API -----
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}
