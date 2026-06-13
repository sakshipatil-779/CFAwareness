/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@contexts/GameContext';
import { useAuth } from '@contexts/AuthContext';
import { useLanguage } from '@contexts/LanguageContext';
import type { CharacterId, Choice } from '@/types';
import CharacterSelect from '@components/game/CharacterSelect';
import ScoreBar from '@components/game/ScoreBar';
import GameScene from '@components/game/GameScene';
import ChoicePanel from '@components/game/ChoicePanel';
import AIVideoPlayer from '@components/game/AIVideoPlayer';

// Game flow: awareness → character-select → playing → animating
type GamePhase = 'awareness' | 'character-select' | 'playing' | 'animating';

const CHAR_AVATARS: Record<CharacterId, string> = {
  alex: '🧑🏽‍💼',
  maya: '👩🏻',
  riya: '👩🏾',
  carlos: '👨🏽',
};

export default function GamePage() {
  const navigate = useNavigate();
  const { state, startGame, makeDecision, nextScenario, completeGame } = useGame();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [phase, setPhase] = useState<GamePhase>('awareness');
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);

  // Use session scenarios from context (randomly picked each game)
  const scenarios = state.sessionScenarios;
  const currentScenario = scenarios[state.currentScenarioIndex];
  const isLastScenario = state.currentScenarioIndex >= scenarios.length - 1;

  // ── 1. Awareness video complete ──────────────────────────────────────────
  const handleAwarenessComplete = useCallback(() => {
    setPhase('character-select');
  }, []);

  // ── 2. Character selected ────────────────────────────────────────────────
  const handleCharacterSelect = useCallback(
    (characterId: CharacterId) => {
      startGame(characterId, user?.uid ?? null);
      setPhase('playing');
    },
    [startGame, user],
  );

  // ── 3. Choice made ───────────────────────────────────────────────────────
  const handleChoice = useCallback(
    (choice: Choice) => {
      if (!currentScenario) return;
      setSelectedChoice(choice);
      makeDecision(currentScenario.id, choice.id, choice.ecoPoints, choice.carbonSaved);
      setTimeout(() => setPhase('animating'), 350);
    },
    [currentScenario, makeDecision],
  );

  // ── 4. Animation complete ────────────────────────────────────────────────
  const handleAnimationComplete = useCallback(() => {
    setSelectedChoice(null);
    if (isLastScenario) {
      completeGame();
      const entry = {
        uid: user?.uid ?? `guest_${Date.now()}`,
        displayName: user?.displayName ?? 'Eco Explorer',
        totalEcoPoints: state.totalEcoPoints + (selectedChoice?.ecoPoints ?? 0),
        totalCarbonSaved: state.totalCarbonSaved + (selectedChoice?.carbonSaved ?? 0),
        timestamp: Date.now(),
      };
      const stored = JSON.parse(
        localStorage.getItem('ecoquest_scores') ?? '[]',
      ) as (typeof entry)[];
      stored.unshift(entry);
      localStorage.setItem('ecoquest_scores', JSON.stringify(stored.slice(0, 50)));
      navigate('/results', {
        state: { decisions: [...state.decisions], characterId: state.characterId },
      });
    } else {
      nextScenario();
      setPhase('playing');
    }
  }, [isLastScenario, completeGame, navigate, nextScenario, state, selectedChoice, user]);

  if (phase === 'awareness') {
    return (
      <div
        className="min-h-screen"
        style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 50%, #f0fdfa 100%)' }}
      >
        <div className="page-container py-8">
          <AIVideoPlayer onComplete={handleAwarenessComplete} />
        </div>
      </div>
    );
  }

  // ── Phase: Character Select ──────────────────────────────────────────────
  if (phase === 'character-select' || !state.isStarted) {
    return (
      <div className="w-full">
        <CharacterSelect onSelect={handleCharacterSelect} />
      </div>
    );
  }

  // ── Phase: Playing / Animating ───────────────────────────────────────────
  return (
    <div className="w-full">
      {/* Sticky score bar */}
      <ScoreBar
        scenarioIndex={state.currentScenarioIndex}
        totalScenarios={scenarios.length}
        totalEcoPoints={state.totalEcoPoints}
        characterAvatar={CHAR_AVATARS[state.characterId]}
      />

      {/* Animation overlay */}
      {phase === 'animating' && selectedChoice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(240,249,255,0.92)', backdropFilter: 'blur(16px)' }}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl shadow-glass-xl">
            <GameScene
              animationType={selectedChoice.animation}
              characterId={state.characterId}
              ecoPoints={selectedChoice.ecoPoints}
              onComplete={handleAnimationComplete}
            />
          </div>
        </div>
      )}

      {/* Scenario content */}
      {phase === 'playing' && currentScenario && (
        <div className="page-container py-8">
          <div className="mx-auto max-w-2xl">
            {/* Scenario header */}
            <div className="animation-fill-both mb-8 animate-fade-in text-center">
              <div className="eco-badge mb-4 justify-center">
                <span aria-hidden="true">📍</span>
                {t('game.scenario')} {state.currentScenarioIndex + 1} of {scenarios.length}
              </div>

              <h1 className="gradient-text mb-3 font-display text-3xl font-extrabold">
                {t(currentScenario.titleKey)}
              </h1>

              <p className="text-lg leading-relaxed text-slate-500">
                {t(currentScenario.descriptionKey)}
              </p>

              {/* Choice icons preview */}
              <div className="mt-6 flex items-center justify-center gap-4" aria-hidden="true">
                <div
                  className="h-px flex-1 rounded"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.2))' }}
                />
                <div className="glass-card-light px-6 py-3 text-3xl tracking-widest">
                  {currentScenario.choices.map((c) => c.icon).join(' ')}
                </div>
                <div
                  className="h-px flex-1 rounded"
                  style={{ background: 'linear-gradient(90deg, rgba(34,197,94,0.2), transparent)' }}
                />
              </div>
            </div>

            {/* Choices */}
            <ChoicePanel
              choices={currentScenario.choices}
              onChoose={handleChoice}
              selectedId={selectedChoice?.id ?? null}
            />

            {/* Eco tip */}
            <div className="glass-card mt-6 p-4 text-center">
              <p className="text-sm text-slate-500">💡 {t('game.tip')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
