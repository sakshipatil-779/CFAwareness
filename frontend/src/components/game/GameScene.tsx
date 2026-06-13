/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useRef, useState } from 'react';
import type { AnimationType, CharacterId } from '@/types';

interface Props {
  animationType: AnimationType;
  characterId: CharacterId;
  ecoPoints: number;
  onComplete: () => void;
}

const CHARACTER_EMOJI: Record<CharacterId, string> = {
  alex: '🧑🏽‍💼', maya: '👩🏻', riya: '👩🏾', carlos: '👨🏽',
};

interface SceneConfig {
  bg: string;
  label: string;
  emoji: string;
  elements: string[];
  isEco: boolean;
  feedbackText: string;
  vehicleEmoji: string;
}

const SCENE_CONFIG: Record<AnimationType, SceneConfig> = {
  cycling: {
    bg: 'linear-gradient(180deg, #bfdbfe 0%, #bbf7d0 60%, #86efac 100%)',
    label: 'Cycling to work',
    emoji: '🚲',
    elements: ['🌳', '🌸', '🏡', '☀️', '🌳', '🌷', '🏡', '🌿'],
    isEco: true,
    feedbackText: 'Amazing! Zero emissions cycling! 🚲',
    vehicleEmoji: '🚴',
  },
  walking: {
    bg: 'linear-gradient(180deg, #bfdbfe 0%, #d1fae5 60%, #a7f3d0 100%)',
    label: 'Walking the path',
    emoji: '🚶',
    elements: ['🌺', '🌿', '🦋', '🌳', '🌻', '🐝', '🌳', '🌾'],
    isEco: true,
    feedbackText: 'Perfect! Healthy & green! 🚶',
    vehicleEmoji: '🚶',
  },
  bus: {
    bg: 'linear-gradient(180deg, #e0f2fe 0%, #cffafe 60%, #a5f3fc 100%)',
    label: 'Taking the bus',
    emoji: '🚌',
    elements: ['🏙️', '🚏', '🏢', '🌆', '🏗️', '🏢', '🌇', '🚏'],
    isEco: true,
    feedbackText: 'Smart! Shared transport saves emissions 🚌',
    vehicleEmoji: '🚌',
  },
  metro: {
    bg: 'linear-gradient(180deg, #dbeafe 0%, #e0e7ff 60%, #c7d2fe 100%)',
    label: 'Metro commute',
    emoji: '🚇',
    elements: ['🏙️', '💡', '🏢', '⚡', '🏙️', '🏢', '🌆', '⚡'],
    isEco: true,
    feedbackText: 'Excellent! Metro cuts emissions by 70%! 🚇',
    vehicleEmoji: '🚇',
  },
  car: {
    bg: 'linear-gradient(180deg, #d1d5db 0%, #9ca3af 50%, #6b7280 100%)',
    label: 'Private car',
    emoji: '🚗',
    elements: ['🏢', '🚦', '🏗️', '🌫️', '🏢', '🚦', '🌫️', '🏗️'],
    isEco: false,
    feedbackText: 'Oops! Cars emit 2.4kg CO₂ per trip 🚗',
    vehicleEmoji: '🚗',
  },
  'plant-based': {
    bg: 'linear-gradient(180deg, #d1fae5 0%, #bbf7d0 60%, #6ee7b7 100%)',
    label: 'Plant-based meal',
    emoji: '🥗',
    elements: ['🥦', '🍅', '🥕', '🌿', '🍃', '🫛', '🥬', '🌱'],
    isEco: true,
    feedbackText: 'Outstanding! 80% less carbon than beef! 🥗',
    vehicleEmoji: '🥗',
  },
  vegetarian: {
    bg: 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 60%, #a7f3d0 100%)',
    label: 'Vegetarian meal',
    emoji: '🧀',
    elements: ['🥚', '🧀', '🥗', '🥛', '🍞', '🫐', '🥗', '🥛'],
    isEco: true,
    feedbackText: 'Great choice! Low-carbon vegetarian! 🧀',
    vehicleEmoji: '🍽️',
  },
  omnivore: {
    bg: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)',
    label: 'Meat-heavy meal',
    emoji: '🍗',
    elements: ['🍗', '🌾', '🐄', '💨', '🌾', '🐄', '💨', '🍗'],
    isEco: false,
    feedbackText: 'Beef = 10x more CO₂ than plant-based! 🍗',
    vehicleEmoji: '🍖',
  },
  solar: {
    bg: 'linear-gradient(180deg, #fef9c3 0%, #d1fae5 60%, #bbf7d0 100%)',
    label: 'Solar energy',
    emoji: '☀️',
    elements: ['☀️', '⚡', '🏡', '🌿', '🔆', '⚡', '🏡', '☀️'],
    isEco: true,
    feedbackText: 'Brilliant! Solar = 100% clean energy! ☀️',
    vehicleEmoji: '☀️',
  },
  efficient: {
    bg: 'linear-gradient(180deg, #ecfdf5 0%, #e0f2fe 60%, #bae6fd 100%)',
    label: 'Energy efficient',
    emoji: '💡',
    elements: ['💡', '🌿', '🏠', '⚡', '💡', '🌱', '🏠', '⚡'],
    isEco: true,
    feedbackText: 'Smart! LED lights cut energy use by 75%! 💡',
    vehicleEmoji: '💡',
  },
  standard: {
    bg: 'linear-gradient(180deg, #e5e7eb 0%, #d1d5db 50%, #9ca3af 100%)',
    label: 'Standard usage',
    emoji: '🔌',
    elements: ['🔌', '🏭', '💨', '🏠', '🔌', '💨', '🏭', '🏠'],
    isEco: false,
    feedbackText: 'Room to improve! Try LED + smart plugs 🔌',
    vehicleEmoji: '🔌',
  },
  idle: {
    bg: 'linear-gradient(180deg, #f0f9ff 0%, #ecfdf5 100%)',
    label: 'Thinking…',
    emoji: '🌍',
    elements: ['🌿', '🌍', '🌱', '☀️', '🌿', '🍃', '🌍', '🌱'],
    isEco: true,
    feedbackText: 'Every choice matters! 🌍',
    vehicleEmoji: '🌍',
  },
};

// Point particles that float up
function PointsParticle({ points }: { points: number }) {
  return (
    <div
      className="points-pop absolute top-1/3 left-1/2 -translate-x-1/2 z-20 select-none pointer-events-none"
      aria-live="polite"
      aria-label={`+${points} eco-points`}
    >
      <div
        className="font-display font-black text-4xl"
        style={{
          color: '#15803d',
          textShadow: '0 2px 10px rgba(34,197,94,0.4)',
          WebkitTextStroke: '1px rgba(255,255,255,0.8)',
        }}
      >
        +{points}
      </div>
      <div className="text-center text-sm font-semibold text-eco-600 mt-1">Eco-Points!</div>
    </div>
  );
}

export default function GameScene({ animationType, characterId, ecoPoints, onComplete }: Props) {
  const scene = SCENE_CONFIG[animationType] ?? SCENE_CONFIG.idle;
  const charEmoji = CHARACTER_EMOJI[characterId];
  const [showPoints, setShowPoints] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Show points after 0.8s
    const t1 = setTimeout(() => setShowPoints(true), 800);
    // Complete after 3.2s
    timerRef.current = setTimeout(onComplete, 3200);
    return () => {
      clearTimeout(t1);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onComplete]);

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: 320, background: scene.bg }}
      role="img"
      aria-label={`Animation: ${scene.label}`}
    >
      {/* Scrolling background elements */}
      <div className="scene-elements absolute inset-0 flex items-center" style={{ top: '15%' }}>
        <div className="scene-scroll text-3xl gap-12 flex items-center" style={{ gap: '3rem' }}>
          {[...scene.elements, ...scene.elements].map((el, i) => (
            <span key={i} aria-hidden="true">{el}</span>
          ))}
        </div>
      </div>

      {/* Ground strip */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[22%]"
        style={{
          background: scene.isEco
            ? 'linear-gradient(180deg, #4ade80, #16a34a)'
            : 'linear-gradient(180deg, #6b7280, #374151)',
          borderTop: '2px solid rgba(255,255,255,0.2)',
        }}
        aria-hidden="true"
      />

      {/* Road markings for vehicle scenes */}
      {['cycling', 'walking', 'bus', 'metro', 'car'].includes(animationType) && (
        <div
          className="absolute bottom-[9%] left-0 right-0 h-[4px] scene-road-line"
          aria-hidden="true"
        />
      )}

      {/* Animated character/vehicle */}
      <div
        className="scene-character"
        style={{ bottom: '24%' }}
        aria-hidden="true"
      >
        <span className="inline-block animate-bounce-eco">{charEmoji}</span>
        {scene.vehicleEmoji !== charEmoji && !['plant-based','vegetarian','omnivore','solar','efficient','standard','idle'].includes(animationType) && (
          <span className="inline-block ml-1 text-3xl">{scene.vehicleEmoji}</span>
        )}
      </div>

      {/* Points particle */}
      {showPoints && <PointsParticle points={ecoPoints} />}

      {/* Bottom caption */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-4 pb-3 pt-8"
        style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.30) 0%, transparent 100%)' }}
        aria-hidden="true"
      >
        {/* Eco/Non-eco indicator */}
        <div
          className="rounded-full px-3 py-1 text-xs font-bold text-white"
          style={{
            background: scene.isEco ? 'rgba(22,163,74,0.85)' : 'rgba(220,38,38,0.80)',
            backdropFilter: 'blur(6px)',
          }}
        >
          {scene.isEco ? '🌿 Eco-Friendly' : '⚠️ High Carbon'}
        </div>

        {/* Feedback text */}
        <div
          className="max-w-xs text-right text-xs font-semibold text-white"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
        >
          {scene.feedbackText}
        </div>
      </div>

      {/* Ambient light overlay for eco scenes */}
      {scene.isEco && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(34,197,94,0.08) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
