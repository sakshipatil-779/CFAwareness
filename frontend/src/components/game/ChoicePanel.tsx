/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { useLanguage } from '@contexts/LanguageContext';
import type { Choice } from '@/types';

interface Props {
  choices: Choice[];
  onChoose: (choice: Choice) => void;
  selectedId: string | null;
}

type Tier = 'best' | 'good' | 'fair' | 'poor';

function getTier(ecoPoints: number, allPoints: number[]): Tier {
  const max = Math.max(...allPoints);
  const min = Math.min(...allPoints);
  const range = max - min || 1;
  const pct = (ecoPoints - min) / range;
  if (pct >= 0.85) return 'best';
  if (pct >= 0.55) return 'good';
  if (pct >= 0.25) return 'fair';
  return 'poor';
}

const TIER_STYLES: Record<
  Tier,
  {
    label: string;
    bg: string;
    border: string;
    chipBg: string;
    chipColor: string;
    glowColor: string;
  }
> = {
  best: {
    label: '⭐ Best',
    bg: 'rgba(240,253,244,0.85)',
    border: 'rgba(34,197,94,0.35)',
    chipBg: '#dcfce7',
    chipColor: '#15803d',
    glowColor: 'rgba(34,197,94,0.15)',
  },
  good: {
    label: '👍 Good',
    bg: 'rgba(240,249,255,0.85)',
    border: 'rgba(14,165,233,0.28)',
    chipBg: '#e0f2fe',
    chipColor: '#0369a1',
    glowColor: 'rgba(14,165,233,0.12)',
  },
  fair: {
    label: '😐 Fair',
    bg: 'rgba(255,251,235,0.85)',
    border: 'rgba(251,191,36,0.30)',
    chipBg: '#fef3c7',
    chipColor: '#92400e',
    glowColor: 'rgba(251,191,36,0.10)',
  },
  poor: {
    label: '⚠️ Poor',
    bg: 'rgba(255,241,242,0.80)',
    border: 'rgba(244,63,94,0.22)',
    chipBg: '#fee2e2',
    chipColor: '#991b1b',
    glowColor: 'rgba(244,63,94,0.08)',
  },
};

export default React.memo(function ChoicePanel({ choices, onChoose, selectedId }: Props) {
  const { t } = useLanguage();
  const allPoints = choices.map((c) => c.ecoPoints);

  return (
    <div role="group" aria-label={t('game.choose')} className="space-y-3">
      <p className="mb-5 text-center text-sm font-semibold uppercase tracking-widest text-slate-400">
        {t('game.choose')}
      </p>

      {choices.map((choice, i) => {
        const tier = getTier(choice.ecoPoints, allPoints);
        const styles = TIER_STYLES[tier];
        const isSelected = selectedId === choice.id;
        const isDisabled = selectedId !== null && !isSelected;

        return (
          <button
            key={choice.id}
            id={`choice-${choice.id}`}
            type="button"
            onClick={() => !isDisabled && onChoose(choice)}
            disabled={isDisabled}
            aria-pressed={isSelected}
            aria-label={`${t(choice.labelKey)}: ${t(choice.descriptionKey)} — ${choice.ecoPoints} eco-points`}
            className={`animation-fill-both w-full animate-slide-up rounded-2xl p-4 text-left transition-all duration-200 ${isDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:-translate-y-0.5'} ${isSelected ? 'scale-[1.01] ring-2 ring-eco-400' : ''} `}
            style={{
              animationDelay: `${i * 60}ms`,
              background: isSelected
                ? 'linear-gradient(135deg, rgba(240,253,244,0.95), rgba(224,242,254,0.90))'
                : styles.bg,
              border: `1.5px solid ${isSelected ? 'rgba(34,197,94,0.55)' : styles.border}`,
              boxShadow: isSelected
                ? `0 4px 20px ${styles.glowColor}, 0 1px 4px rgba(0,0,0,0.04)`
                : `0 2px 8px rgba(0,0,0,0.04)`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                style={{ background: styles.chipBg }}
                aria-hidden="true"
              >
                {choice.icon}
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-base font-bold text-slate-800">
                    {t(choice.labelKey)}
                  </span>
                  {/* Tier chip */}
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-semibold"
                    style={{ background: styles.chipBg, color: styles.chipColor }}
                    aria-label={`Quality tier: ${tier}`}
                  >
                    {styles.label}
                  </span>
                </div>
                <p className="mt-0.5 text-sm leading-snug text-slate-500">
                  {t(choice.descriptionKey)}
                </p>
              </div>

              {/* Points */}
              <div className="shrink-0 text-right">
                <p
                  className="font-display text-lg font-extrabold leading-none"
                  style={{
                    color:
                      tier === 'best'
                        ? '#15803d'
                        : tier === 'good'
                          ? '#0369a1'
                          : tier === 'fair'
                            ? '#b45309'
                            : '#be123c',
                  }}
                >
                  +{choice.ecoPoints}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">pts</p>
                {choice.carbonSaved > 0 && (
                  <p className="mt-1 text-xs font-medium" style={{ color: '#0d9488' }}>
                    -{choice.carbonSaved.toFixed(1)}kg CO₂
                  </p>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
});
