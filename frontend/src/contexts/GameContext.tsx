/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type { GameState, GameDecision, CharacterId, ScenarioId, Scenario } from '@/types';
import { calculateTotalEcoPoints, calculateTotalCarbonSaved } from '@/utils/scoreUtils';
import { pickRandomScenarios } from '@/data/scenarios';

// ── Extended game state with session scenarios ─────────────────────────────
interface ExtendedGameState extends GameState {
  sessionScenarios: Scenario[];
}

const initialState: ExtendedGameState = {
  isStarted: false,
  isCompleted: false,
  currentScenarioIndex: 0,
  totalEcoPoints: 0,
  totalCarbonSaved: 0,
  decisions: [],
  characterId: 'alex',
  userId: null,
  sessionScenarios: [],
};

// ── Actions ───────────────────────────────────────────────────────────────
type GameAction =
  | {
      type: 'START_GAME';
      payload: { characterId: CharacterId; userId: string | null; scenarios: Scenario[] };
    }
  | { type: 'MAKE_DECISION'; payload: Omit<GameDecision, 'timestamp'> }
  | { type: 'NEXT_SCENARIO' }
  | { type: 'COMPLETE_GAME' }
  | { type: 'RESET_GAME' };

// ── Reducer ───────────────────────────────────────────────────────────────
function gameReducer(state: ExtendedGameState, action: GameAction): ExtendedGameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialState,
        isStarted: true,
        characterId: action.payload.characterId,
        userId: action.payload.userId,
        sessionScenarios: action.payload.scenarios,
      };

    case 'MAKE_DECISION': {
      const decision: GameDecision = { ...action.payload, timestamp: Date.now() };
      const updatedDecisions = [...state.decisions, decision];
      return {
        ...state,
        decisions: updatedDecisions,
        totalEcoPoints: calculateTotalEcoPoints(updatedDecisions),
        totalCarbonSaved: calculateTotalCarbonSaved(updatedDecisions),
      };
    }

    case 'NEXT_SCENARIO':
      return { ...state, currentScenarioIndex: state.currentScenarioIndex + 1 };

    case 'COMPLETE_GAME':
      return { ...state, isCompleted: true };

    case 'RESET_GAME':
      return { ...initialState };

    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────
interface GameContextValue {
  state: ExtendedGameState;
  startGame: (characterId: CharacterId, userId?: string | null) => void;
  makeDecision: (
    scenarioId: ScenarioId,
    choiceId: string,
    ecoPoints: number,
    carbonSaved: number,
  ) => void;
  nextScenario: () => void;
  completeGame: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  /** Picks a fresh random set of 3 scenarios every time startGame is called */
  const startGame = useCallback((characterId: CharacterId, userId: string | null = null) => {
    const scenarios = pickRandomScenarios(Date.now());
    dispatch({ type: 'START_GAME', payload: { characterId, userId, scenarios } });
  }, []);

  const makeDecision = useCallback(
    (scenarioId: ScenarioId, choiceId: string, ecoPoints: number, carbonSaved: number) => {
      dispatch({
        type: 'MAKE_DECISION',
        payload: { scenarioId, choiceId, ecoPoints, carbonSaved },
      });
    },
    [],
  );

  const nextScenario = useCallback(() => dispatch({ type: 'NEXT_SCENARIO' }), []);
  const completeGame = useCallback(() => dispatch({ type: 'COMPLETE_GAME' }), []);
  const resetGame = useCallback(() => dispatch({ type: 'RESET_GAME' }), []);

  return (
    <GameContext.Provider
      value={{ state, startGame, makeDecision, nextScenario, completeGame, resetGame }}
    >
      {children}
    </GameContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────
export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within <GameProvider>');
  return ctx;
}
