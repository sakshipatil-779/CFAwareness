import type { Language, LanguageOption } from '@/types';

/**
 * All 9 supported languages for the EcoQuest multi-language interface.
 */
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English',    nativeLabel: 'English',    flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi',      nativeLabel: 'हिन्दी',    flag: '🇮🇳' },
  { code: 'es', label: 'Spanish',    nativeLabel: 'Español',    flag: '🇪🇸' },
  { code: 'fr', label: 'French',     nativeLabel: 'Français',   flag: '🇫🇷' },
  { code: 'de', label: 'German',     nativeLabel: 'Deutsch',    flag: '🇩🇪' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português',  flag: '🇧🇷' },
  { code: 'ar', label: 'Arabic',     nativeLabel: 'العربية',    flag: '🇸🇦' },
  { code: 'ja', label: 'Japanese',   nativeLabel: '日本語',      flag: '🇯🇵' },
  { code: 'zh', label: 'Chinese',    nativeLabel: '中文',        flag: '🇨🇳' },
];

export const DEFAULT_LANGUAGE: Language = 'en';

/** LocalStorage key for persisted language preference */
export const LANGUAGE_STORAGE_KEY = 'ecoquest_language';

/** Maximum Eco-Points achievable in a single full game run (3 scenarios × ~50 pts max) */
export const MAX_ECO_POINTS = 150;

/** API base URL — resolved from env variables */
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

/** Firebase project config (injected via env) */
export const FIREBASE_CONFIG = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY ?? '',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID ?? '',
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? '',
} as const;

/** Animation durations (ms) */
export const ANIMATION = {
  CHOICE_REVEAL:  300,
  SCENE_ENTER:    500,
  SCENE_EXIT:     400,
  CHARACTER_MOVE: 1200,
  POINTS_FLASH:   800,
} as const;

/** Eco-grade thresholds (out of 150 max) */
export const ECO_GRADE_THRESHOLDS = {
  S: 135,
  A: 105,
  B:  75,
  C:  45,
  D:   0,
} as const;
