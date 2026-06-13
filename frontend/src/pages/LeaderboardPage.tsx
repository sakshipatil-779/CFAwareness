/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@contexts/LanguageContext';
import { formatCarbon } from '@/utils/scoreUtils';

interface LeaderboardEntry {
  rank: number;
  uid: string;
  displayName: string;
  totalEcoPoints: number;
  totalCarbonSaved: number;
  country: string;
  isCurrentUser?: boolean;
}

const MOCK_GLOBAL: Omit<LeaderboardEntry, 'rank'>[] = [
  { uid: 'p1',  displayName: 'Priya Sharma',   totalEcoPoints: 145, totalCarbonSaved: 7.1, country: '🇮🇳' },
  { uid: 'p2',  displayName: 'Carlos Méndez',  totalEcoPoints: 138, totalCarbonSaved: 6.8, country: '🇲🇽' },
  { uid: 'p3',  displayName: 'Yuki Tanaka',    totalEcoPoints: 130, totalCarbonSaved: 6.5, country: '🇯🇵' },
  { uid: 'p4',  displayName: 'Amara Diallo',   totalEcoPoints: 125, totalCarbonSaved: 6.2, country: '🇸🇳' },
  { uid: 'p5',  displayName: 'Sofia Andersen', totalEcoPoints: 120, totalCarbonSaved: 5.9, country: '🇩🇰' },
  { uid: 'p6',  displayName: 'Rajan Patel',    totalEcoPoints: 115, totalCarbonSaved: 5.5, country: '🇮🇳' },
  { uid: 'p7',  displayName: 'Lena Müller',    totalEcoPoints: 108, totalCarbonSaved: 5.1, country: '🇩🇪' },
  { uid: 'p8',  displayName: 'James Okafor',   totalEcoPoints: 100, totalCarbonSaved: 4.8, country: '🇳🇬' },
  { uid: 'p9',  displayName: 'Ana Costa',      totalEcoPoints:  93, totalCarbonSaved: 4.4, country: '🇧🇷' },
  { uid: 'p10', displayName: 'Wei Chen',       totalEcoPoints:  85, totalCarbonSaved: 4.0, country: '🇨🇳' },
];

const RANK_STYLES: Record<number, { color: string; bg: string; icon: string }> = {
  1: { color: '#b45309', bg: 'rgba(251,191,36,0.12)', icon: '🥇' },
  2: { color: '#64748b', bg: 'rgba(148,163,184,0.10)', icon: '🥈' },
  3: { color: '#c2410c', bg: 'rgba(251,146,60,0.10)', icon: '🥉' },
};

export default function LeaderboardPage() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'global' | 'personal'>('global');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('ecoquest_scores') ?? '[]') as {
      uid: string; displayName: string; totalEcoPoints: number; totalCarbonSaved: number;
    }[];

    const userEntries = stored.map((s) => ({
      uid: s.uid, displayName: s.displayName,
      totalEcoPoints: s.totalEcoPoints, totalCarbonSaved: s.totalCarbonSaved,
      country: '🌍', isCurrentUser: true,
    }));

    const merged = [...userEntries, ...MOCK_GLOBAL];
    const deduped = merged.filter((e, i, arr) => arr.findIndex((x) => x.uid === e.uid) === i);
    const sorted = [...deduped].sort((a, b) => b.totalEcoPoints - a.totalEcoPoints);
    const ranked = sorted.map((e, i) => ({ ...e, rank: i + 1 }));

    setTimeout(() => { setEntries(ranked); setIsLoading(false); }, 600);
  }, []);

  const displayed = filter === 'personal' ? entries.filter((e) => e.isCurrentUser) : entries;

  return (
    <main id="main-content" className="page-container py-10">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="eco-badge mb-4 justify-center animate-fade-in animation-fill-both">
            <span aria-hidden="true">🌍</span>
            Live Rankings — EcoQuest
          </div>
          <h1 className="font-display text-4xl font-extrabold gradient-text mb-3 animate-slide-up animation-fill-both animate-delay-100">
            {t('lb.title')}
          </h1>
          <p className="text-slate-500 animate-slide-up animation-fill-both animate-delay-200">
            See how eco-warriors around the world are making a difference
          </p>
        </div>

        {/* Podium — top 3 */}
        {!isLoading && entries.length >= 3 && (
          <div className="mb-8 grid grid-cols-3 gap-3 animate-slide-up animation-fill-both animate-delay-200" aria-label="Top 3 players">
            {/* 2nd */}
            <div className="flex flex-col items-center gap-2 pt-6">
              <div className="glass-card p-4 text-center w-full" style={{ border: '1.5px solid rgba(148,163,184,0.30)' }}>
                <p className="text-3xl mb-1" aria-hidden="true">🥈</p>
                <p className="font-display font-bold text-sm text-slate-700 truncate">{entries[1]?.displayName}</p>
                <p className="font-bold text-sm" style={{ color: '#0369a1' }}>{entries[1]?.totalEcoPoints} pts</p>
                <p className="text-xs text-slate-400">{entries[1]?.country}</p>
              </div>
            </div>
            {/* 1st */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="glass-card p-5 text-center w-full animate-glow-pulse"
                style={{ border: '2px solid rgba(251,191,36,0.50)', boxShadow: '0 0 24px rgba(251,191,36,0.20)' }}
              >
                <p className="text-4xl mb-1" aria-hidden="true">🥇</p>
                <p className="font-display font-bold text-slate-800 truncate">{entries[0]?.displayName}</p>
                <p className="font-display text-xl font-extrabold" style={{ color: '#15803d' }}>{entries[0]?.totalEcoPoints} pts</p>
                <p className="text-sm text-slate-400">{entries[0]?.country}</p>
                <div className="eco-badge mt-2 justify-center text-xs">Eco Legend</div>
              </div>
            </div>
            {/* 3rd */}
            <div className="flex flex-col items-center gap-2 pt-6">
              <div className="glass-card p-4 text-center w-full" style={{ border: '1.5px solid rgba(194,65,12,0.20)' }}>
                <p className="text-3xl mb-1" aria-hidden="true">🥉</p>
                <p className="font-display font-bold text-sm text-slate-700 truncate">{entries[2]?.displayName}</p>
                <p className="font-bold text-sm" style={{ color: '#c2410c' }}>{entries[2]?.totalEcoPoints} pts</p>
                <p className="text-xs text-slate-400">{entries[2]?.country}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="mb-4 flex gap-2" role="tablist" aria-label="Leaderboard filter">
          {(['global', 'personal'] as const).map((f) => (
            <button
              key={f} type="button" role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                filter === f
                  ? 'bg-eco-50 text-eco-700 border border-eco-200 shadow-sm'
                  : 'text-slate-400 hover:text-eco-600 hover:bg-eco-50/50'
              }`}
            >
              {f === 'global' ? '🌍 Global' : '👤 My Scores'}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          {/* Header row */}
          <div
            className="grid grid-cols-[3rem_1fr_6rem_7rem] gap-3 px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide"
            style={{ borderBottom: '1px solid rgba(34,197,94,0.08)' }}
          >
            <span>{t('lb.rank')}</span>
            <span>{t('lb.player')}</span>
            <span className="text-right">{t('lb.points')}</span>
            <span className="text-right hidden sm:block">{t('lb.carbon')}</span>
          </div>

          {/* Rows */}
          {isLoading ? (
            <div aria-busy="true" aria-label="Loading leaderboard">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="grid grid-cols-[3rem_1fr_6rem_7rem] gap-3 px-5 py-4 items-center"
                  style={{ borderBottom: '1px solid rgba(34,197,94,0.05)' }}>
                  <div className="h-5 w-8 rounded-lg bg-slate-100 animate-pulse" />
                  <div className="h-4 rounded-lg bg-slate-100 animate-pulse" style={{ width: `${60 + (i % 3) * 15}%` }} />
                  <div className="h-4 w-14 rounded-lg bg-slate-100 animate-pulse ml-auto" />
                  <div className="h-4 w-16 rounded-lg bg-slate-100 animate-pulse ml-auto hidden sm:block" />
                </div>
              ))}
            </div>
          ) : displayed.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-5xl mb-3" aria-hidden="true">🌱</p>
              <p className="text-slate-500 mb-4">No scores yet! Play EcoQuest to appear here.</p>
              <Link to="/game" className="btn-primary">Play Now</Link>
            </div>
          ) : (
            <div>
              {displayed.map((entry, i) => {
                const rankStyle = RANK_STYLES[entry.rank];
                return (
                  <div
                    key={entry.uid}
                    className="grid grid-cols-[3rem_1fr_6rem_7rem] gap-3 px-5 py-4 items-center transition-colors duration-150 hover:bg-eco-50/50 animate-slide-up animation-fill-both"
                    style={{
                      borderBottom: i < displayed.length - 1 ? '1px solid rgba(34,197,94,0.05)' : 'none',
                      animationDelay: `${i * 40}ms`,
                      background: entry.isCurrentUser ? 'rgba(240,253,244,0.60)' : undefined,
                    }}
                    role="row"
                    aria-label={`Rank ${entry.rank}: ${entry.displayName}, ${entry.totalEcoPoints} eco-points`}
                  >
                    <span className="font-display font-black text-lg" style={{ color: rankStyle?.color ?? '#94a3b8' }}>
                      {rankStyle ? rankStyle.icon : `#${entry.rank}`}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-700 flex items-center gap-1.5 flex-wrap text-sm">
                        {entry.country && <span aria-hidden="true">{entry.country}</span>}
                        {entry.displayName}
                        {entry.isCurrentUser && <span className="eco-badge text-[10px] px-1.5 py-0.5">You</span>}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-display font-bold text-eco-600">{entry.totalEcoPoints}</span>
                      <span className="text-slate-400 text-xs ml-1">pts</span>
                    </div>
                    <div className="text-right hidden sm:block">
                      <span className="text-teal-600 text-sm font-medium">{formatCarbon(entry.totalCarbonSaved)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Play CTA */}
        <div className="mt-8 text-center animate-fade-in animation-fill-both animate-delay-500">
          <Link to="/game" id="lb-play-btn" className="btn-primary px-10 py-4 text-lg">
            <span aria-hidden="true">🚀</span>
            {t('home.cta.play')}
          </Link>
          <p className="mt-3 text-xs text-slate-400">Complete all scenarios to appear on the leaderboard</p>
        </div>
      </div>
    </main>
  );
}
