import React from 'react';
import { useLanguage } from '@contexts/LanguageContext';

interface Props {
  scenarioIndex: number;
  totalScenarios?: number;
  totalEcoPoints: number;
  characterAvatar: string;
}

export default React.memo(function ScoreBar({ scenarioIndex, totalScenarios = 3, totalEcoPoints, characterAvatar }: Props) {
  const { t } = useLanguage();
  const progressPct = Math.round(((scenarioIndex) / totalScenarios) * 100);

  return (
    <div
      className="sticky top-16 z-30 w-full"
      style={{
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(34,197,94,0.12)',
        boxShadow: '0 2px 12px rgba(14,165,233,0.06)',
      }}
      role="status"
      aria-label={`Scenario ${scenarioIndex + 1} of ${totalScenarios} — ${totalEcoPoints} eco-points`}
    >
      <div className="page-container py-3">
        <div className="flex items-center gap-4">

          {/* Character avatar */}
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(240,253,244,0.9), rgba(224,242,254,0.8))',
              border: '1px solid rgba(34,197,94,0.20)',
            }}
            aria-hidden="true"
          >
            {characterAvatar}
          </div>

          {/* Progress bar + label */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-500">
                {t('game.scenario')} {scenarioIndex + 1} / {totalScenarios}
              </span>
              <span className="text-xs text-slate-400">{progressPct}%</span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: 'rgba(34,197,94,0.12)' }}
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${progressPct}%`,
                  background: 'linear-gradient(90deg, #22c55e, #0ea5e9)',
                  boxShadow: '0 0 8px rgba(34,197,94,0.35)',
                }}
              />
            </div>
          </div>

          {/* Eco-points badge */}
          <div className="score-pill shrink-0" aria-live="polite">
            <span aria-hidden="true">🌿</span>
            <span className="font-display font-extrabold text-base">{totalEcoPoints}</span>
            <span className="text-xs text-eco-700 hidden sm:inline">{t('game.eco_points')}</span>
          </div>

        </div>
      </div>
    </div>
  );
});
