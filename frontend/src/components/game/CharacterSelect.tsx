/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { useLanguage } from '@contexts/LanguageContext';
import type { CharacterId } from '@/types';

interface Props {
  onSelect: (id: CharacterId) => void;
}

interface CharacterData {
  id: CharacterId;
  nameKey: string;
  descKey: string;
  avatar: string;
  tagline: string;
  accent: string;
  accentLight: string;
  border: string;
}

const CHARACTERS: CharacterData[] = [
  {
    id: 'alex',
    nameKey: 'char.alex.name',
    descKey: 'char.alex.desc',
    avatar: '🧑🏽‍💼',
    tagline: 'Tech & Innovation',
    accent: '#0284c7',
    accentLight: 'rgba(14,165,233,0.10)',
    border: 'rgba(14,165,233,0.25)',
  },
  {
    id: 'maya',
    nameKey: 'char.maya.name',
    descKey: 'char.maya.desc',
    avatar: '👩🏻',
    tagline: 'Nature & Sustainability',
    accent: '#16a34a',
    accentLight: 'rgba(34,197,94,0.10)',
    border: 'rgba(34,197,94,0.25)',
  },
  {
    id: 'riya',
    nameKey: 'char.riya.name',
    descKey: 'char.riya.desc',
    avatar: '👩🏾',
    tagline: 'Mindful & Conscious',
    accent: '#0d9488',
    accentLight: 'rgba(20,184,166,0.10)',
    border: 'rgba(20,184,166,0.25)',
  },
  {
    id: 'carlos',
    nameKey: 'char.carlos.name',
    descKey: 'char.carlos.desc',
    avatar: '👨🏽',
    tagline: 'Community & Action',
    accent: '#7c3aed',
    accentLight: 'rgba(124,58,237,0.10)',
    border: 'rgba(124,58,237,0.25)',
  },
];

export default function CharacterSelect({ onSelect }: Props) {
  const { t } = useLanguage();

  const handleSelect = useCallback((id: CharacterId) => {
    onSelect(id);
  }, [onSelect]);

  return (
    <section
      className="min-h-[80vh] flex flex-col items-center justify-center page-container py-12"
      aria-labelledby="char-select-heading"
    >
      {/* Header */}
      <div className="mb-10 text-center animate-fade-in animation-fill-both">
        <div className="eco-badge mb-5 justify-center">
          <span aria-hidden="true">🌿</span>
          EcoQuest — Choose Your Hero
        </div>
        <h1
          id="char-select-heading"
          className="font-display text-4xl font-extrabold gradient-text mb-3"
        >
          {t('game.choose_char')}
        </h1>
        <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
          Each character brings a unique perspective to living sustainably. Who are you?
        </p>
      </div>

      {/* Character cards grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-5xl"
        
        aria-label="Choose your character"
      >
        {CHARACTERS.map((char, i) => (
          <button
            key={char.id}
            id={`char-${char.id}`}
            type="button"
            role="listitem"
            aria-label={`Choose ${t(char.nameKey)} — ${t(char.descKey)}`}
            onClick={() => handleSelect(char.id)}
            className="group glass-card p-6 text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-eco-500 animate-slide-up animation-fill-both"
            style={{
              animationDelay: `${i * 80}ms`,
              border: `1.5px solid ${char.border}`,
            }}
          >
            {/* Avatar */}
            <div
              className="flex items-center justify-center mb-4 rounded-2xl text-5xl"
              style={{
                height: 80,
                background: char.accentLight,
                border: `1px solid ${char.border}`,
                transition: 'transform 250ms ease',
              }}
              aria-hidden="true"
            >
              <span
                className="group-hover:scale-110 group-hover:animate-bounce-eco inline-block transition-transform duration-200"
              >
                {char.avatar}
              </span>
            </div>

            {/* Name */}
            <h2
              className="font-display text-lg font-bold mb-1"
              style={{ color: char.accent }}
            >
              {t(char.nameKey)}
            </h2>

            {/* Tagline chip */}
            <span
              className="chip text-xs mb-2 inline-block"
              style={{
                background: char.accentLight,
                color: char.accent,
                border: `1px solid ${char.border}`,
              }}
            >
              {char.tagline}
            </span>

            {/* Description */}
            <p className="text-sm text-slate-500 leading-relaxed">
              {t(char.descKey)}
            </p>

            {/* Select CTA */}
            <div
              className="mt-4 w-full rounded-xl py-2 text-center text-sm font-semibold transition-all duration-200"
              style={{
                background: char.accentLight,
                color: char.accent,
                border: `1px solid ${char.border}`,
              }}
              aria-hidden="true"
            >
              <span className="group-hover:tracking-wider transition-all duration-200">
                Select →
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Ambient glow orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="glow-orb top-1/4 left-1/4 h-80 w-80"
          style={{ background: 'radial-gradient(ellipse, rgba(34,197,94,0.07) 0%, transparent 70%)' }} />
        <div className="glow-orb bottom-1/4 right-1/4 h-80 w-80"
          style={{ background: 'radial-gradient(ellipse, rgba(14,165,233,0.07) 0%, transparent 70%)' }} />
      </div>
    </section>
  );
}
