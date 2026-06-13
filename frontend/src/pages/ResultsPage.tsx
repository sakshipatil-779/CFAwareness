/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@contexts/LanguageContext';
import { useGame } from '@contexts/GameContext';
import { getEcoGrade, getScorePercentage, formatCarbon } from '@/utils/scoreUtils';
import type { GameDecision, CharacterId } from '@/types';
import { API_BASE_URL } from '@/utils/constants';

interface LocationState { decisions: GameDecision[]; characterId: CharacterId; }
interface AIAnalysis { analysisText: string; tips: string[]; score: { label: string; value: number; grade: string }; audioUrl?: string | null; }

const CHARACTER_AVATARS: Record<CharacterId, string> = {
  alex: '🧑🏽‍💼', maya: '👩🏻', riya: '👩🏾', carlos: '👨🏽',
};

const GRADE_CONFIG: Record<string, { emoji: string; color: string; bg: string; border: string; label: string }> = {
  S: { emoji: '🌟', color: '#15803d', bg: 'rgba(240,253,244,0.90)', border: 'rgba(34,197,94,0.40)', label: 'Eco Legend' },
  A: { emoji: '🌿', color: '#16a34a', bg: 'rgba(240,253,244,0.80)', border: 'rgba(34,197,94,0.30)', label: 'Eco Hero' },
  B: { emoji: '🌱', color: '#0369a1', bg: 'rgba(240,249,255,0.85)', border: 'rgba(14,165,233,0.30)', label: 'Green Champion' },
  C: { emoji: '🍃', color: '#b45309', bg: 'rgba(255,251,235,0.85)', border: 'rgba(251,191,36,0.35)', label: 'Eco Learner' },
  D: { emoji: '🌾', color: '#c2410c', bg: 'rgba(255,241,242,0.80)', border: 'rgba(244,63,94,0.25)', label: 'New Leaf' },
};

function generateLocalAnalysis(points: number, carbon: number, grade: string, language: string): AIAnalysis {
  type LangKey = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'pt' | 'ar' | 'ja' | 'zh';
  const templates: Partial<Record<LangKey, Record<string, { text: string; tips: string[] }>>> = {
    en: {
      S: { text: `Outstanding! ${points} Eco-Points and ${formatCarbon(carbon)} CO₂ saved. You're a true climate champion! Your sustainable choices inspire everyone around you.`, tips: ['Share your journey to inspire friends!', 'Try a full week of zero-emission commutes.'] },
      A: { text: `Excellent eco-awareness! ${points} points and ${formatCarbon(carbon)} CO₂ saved. Your commitment to sustainability is making a real difference. A few more tweaks and you'll reach Legend status!`, tips: ['Cycle for distances under 5km.', 'Two plant-based meals per week saves 3.6kg CO₂.'] },
      B: { text: `Good effort! ${points} Eco-Points and ${formatCarbon(carbon)} CO₂ saved. You're on the right path. Small habit changes lead to big environmental impact over time.`, tips: ['Try public transport for your daily commute.', 'A plant-based meal once a week helps.', 'Switch to LED bulbs at home.'] },
      C: { text: `You're starting your eco-journey! ${points} points is a solid foundation. Every sustainable choice, no matter how small, contributes to a greener future.`, tips: ['Walk or cycle for short trips.', 'Opt for vegetarian meals more often.', 'Unplug devices when not in use.'] },
      D: { text: `Welcome to EcoQuest! ${points} points is just the beginning. There are many simple, effective changes you can make to dramatically reduce your footprint.`, tips: ['Choose public transport over a private car.', 'Try one plant-based meal per day.', 'Use a reusable water bottle.'] },
    },
    hi: {
      S: { text: `अविश्वसनीय! ${points} इको-पॉइंट और ${formatCarbon(carbon)} CO₂ बचाई! आप एक सच्चे पर्यावरण चैंपियन हैं!`, tips: ['दूसरों को प्रेरित करें!', 'हर रोज साइकिल चलाएं।'] },
      A: { text: `बहुत बढ़िया! ${points} पॉइंट और ${formatCarbon(carbon)} CO₂ बचत। आपकी जागरूकता प्रशंसनीय है!`, tips: ['5km से कम के लिए साइकिल।', 'सप्ताह में दो बार शाकाहारी।'] },
      B: { text: `अच्छा प्रयास! ${points} इको-पॉइंट — आप सही राह पर हैं!`, tips: ['सार्वजनिक परिवहन अपनाएं।', 'LED बल्ब लगाएं।'] },
      C: { text: `शुरुआत अच्छी है! ${points} पॉइंट की नींव मजबूत है।`, tips: ['पैदल चलें।', 'डिवाइस बंद रखें।'] },
      D: { text: `EcoQuest में आपका स्वागत है! ${points} पॉइंट से शुरुआत हुई।`, tips: ['बस/मेट्रो लें।', 'एक शाकाहारी भोजन रोज।'] },
    },
    es: {
      S: { text: `¡Extraordinario! ${points} Eco-Puntos y ${formatCarbon(carbon)} CO₂ ahorrado. ¡Eres un campeón climático!`, tips: ['¡Inspira a otros!', 'Sigue con transporte cero emisiones.'] },
      A: { text: `¡Excelente! ${points} puntos y ${formatCarbon(carbon)} CO₂ ahorrado. ¡Sigue así!`, tips: ['Bicicleta para distancias cortas.', 'Dos comidas veganas a la semana.'] },
      B: { text: `¡Buen esfuerzo! ${points} puntos. Vas por buen camino.`, tips: ['Usa transporte público.', 'Prueba comida vegetal.'] },
      C: { text: `¡Comienzo prometedor! ${points} puntos base sólida.`, tips: ['Camina para trayectos cortos.', 'Desconecta dispositivos.'] },
      D: { text: `¡Bienvenido a EcoQuest! ${points} puntos es el inicio.`, tips: ['Elige bus en vez de coche.', 'Una comida vegetal al día.'] },
    },
    fr: {
      S: { text: `Extraordinaire! ${points} Éco-Points et ${formatCarbon(carbon)} CO₂ économisé. Vous êtes un champion du climat!`, tips: ['Inspirez les autres!', 'Continuez à zéro émission.'] },
      A: { text: `Excellent! ${points} points et ${formatCarbon(carbon)} CO₂ économisé. Continuez!`, tips: ['Vélo pour moins de 5km.', 'Deux repas végétaliens par semaine.'] },
      B: { text: `Bon effort! ${points} points. Vous êtes sur la bonne voie.`, tips: ['Utilisez les transports en commun.', 'Ampoules LED.'] },
      C: { text: `Bon début! ${points} points — une base solide.`, tips: ['Marchez pour les courtes distances.', 'Débranchez les appareils.'] },
      D: { text: `Bienvenue dans EcoQuest! ${points} points c'est un début.`, tips: ['Bus/métro plutôt que voiture.', 'Un repas végétal par jour.'] },
    },
    de: {
      S: { text: `Außergewöhnlich! ${points} Öko-Punkte und ${formatCarbon(carbon)} CO₂ gespart. Ein echter Klima-Champion!`, tips: ['Inspirieren Sie andere!', 'Weiter so mit null Emissionen.'] },
      A: { text: `Ausgezeichnet! ${points} Punkte und ${formatCarbon(carbon)} CO₂ gespart. Super!`, tips: ['Fahrrad für unter 5km.', 'Zwei vegane Mahlzeiten pro Woche.'] },
      B: { text: `Gute Leistung! ${points} Punkte. Sie sind auf dem richtigen Weg.`, tips: ['Öffentliche Verkehrsmittel nutzen.', 'LED-Lampen.'] },
      C: { text: `Guter Start! ${points} Punkte als Basis.`, tips: ['Kurze Wege zu Fuß.', 'Geräte ausstecken.'] },
      D: { text: `Willkommen bei EcoQuest! ${points} Punkte als Anfang.`, tips: ['Bus statt Auto.', 'Eine vegane Mahlzeit täglich.'] },
    },
  };

  const lang = (language in templates ? language : 'en') as LangKey;
  const langTemplates = templates[lang] ?? templates.en!;
  const template = langTemplates[grade] ?? langTemplates['D']!;

  return { analysisText: template.text, tips: template.tips, audioUrl: null, score: { label: grade, value: points, grade } };
}

export default function ResultsPage() {
  const { t, language } = useLanguage();
  const { state: gameState, resetGame } = useGame();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;

  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const decisions = locationState?.decisions ?? gameState.decisions;
  const characterId = (locationState?.characterId ?? gameState.characterId) as CharacterId;
  const totalPoints = decisions.reduce((s, d) => s + d.ecoPoints, 0);
  const totalCarbon = decisions.reduce((s, d) => s + d.carbonSaved, 0);
  const grade = getEcoGrade(totalPoints);
  const percentage = getScorePercentage(totalPoints);
  const gradeInfo = GRADE_CONFIG[grade] ?? GRADE_CONFIG['D']!;

  useEffect(() => {
    if (decisions.length === 0) { navigate('/game'); return; }

    async function fetchAnalysis() {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 'guest', language, totalEcoPoints: totalPoints, totalCarbonSaved: totalCarbon, decisions }),
          signal: AbortSignal.timeout(6000),
        });
        if (response.ok) {
          const data = await response.json() as AIAnalysis;
          setAnalysis(data);
        } else {
          setAnalysis(generateLocalAnalysis(totalPoints, totalCarbon, grade, language));
        }
      } catch {
        setAnalysis(generateLocalAnalysis(totalPoints, totalCarbon, grade, language));
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalysis();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handlePlayAgain() { resetGame(); navigate('/game'); }

  if (decisions.length === 0) return null;

  return (
    <main id="main-content" className="page-container py-10">
      <div className="mx-auto max-w-2xl space-y-6">

        {/* Grade hero */}
        <div className="glass-card p-8 text-center animate-fade-in animation-fill-both">
          <div className="eco-badge mb-4 justify-center">
            <span aria-hidden="true">{CHARACTER_AVATARS[characterId]}</span>
            {t('results.title')}
          </div>

          <div
            className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full grade-reveal"
            style={{ background: gradeInfo.bg, border: `2.5px solid ${gradeInfo.border}`, boxShadow: `0 0 30px ${gradeInfo.border}` }}
            aria-label={`Grade: ${grade}`}
          >
            <div>
              <p className="font-display text-5xl font-black" style={{ color: gradeInfo.color }}>{grade}</p>
              <p className="text-lg" aria-hidden="true">{gradeInfo.emoji}</p>
            </div>
          </div>

          <h1 className="font-display text-3xl font-extrabold gradient-text mb-1">{gradeInfo.label}</h1>
          <p className="text-slate-500">
            You scored <strong style={{ color: gradeInfo.color }}>{totalPoints}</strong> Eco-Points ({percentage}% of max)
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 animate-slide-up animation-fill-both animate-delay-100">
          <div className="glass-card p-5 text-center">
            <p className="mb-1 text-3xl" aria-hidden="true">🌿</p>
            <p className="shimmer-text font-display text-3xl font-extrabold">{totalPoints}</p>
            <p className="mt-1 text-sm text-slate-400">{t('game.eco_points')}</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="mb-1 text-3xl" aria-hidden="true">💨</p>
            <p className="font-display text-3xl font-extrabold" style={{ color: '#0d9488' }}>{formatCarbon(totalCarbon)}</p>
            <p className="mt-1 text-sm text-slate-400">{t('results.carbon')}</p>
          </div>
        </div>

        {/* Decision breakdown */}
        <div className="glass-card p-6 animate-slide-up animation-fill-both animate-delay-200">
          <h2 className="mb-4 font-display text-lg font-semibold text-eco-700">Your Decisions</h2>
          <div className="space-y-2.5">
            {decisions.map((d) => (
              <div
                key={d.scenarioId}
                className="flex items-center justify-between rounded-xl p-3"
                style={{ background: d.ecoPoints >= 30 ? 'rgba(240,253,244,0.80)' : 'rgba(255,241,242,0.60)', border: '1px solid rgba(34,197,94,0.10)' }}
              >
                <span className="text-sm text-slate-600 capitalize">{d.scenarioId}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{formatCarbon(d.carbonSaved)} saved</span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                    style={{
                      background: d.ecoPoints >= 30 ? '#dcfce7' : '#fee2e2',
                      color: d.ecoPoints >= 30 ? '#15803d' : '#be123c',
                    }}
                  >
                    +{d.ecoPoints} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis */}
        <div className="glass-card p-6 animate-slide-up animation-fill-both animate-delay-300" aria-live="polite" aria-busy={isLoading}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-eco-700">🤖 {t('results.ai_analysis')}</h2>
            {analysis?.audioUrl && (
              <button type="button" onClick={() => { audioRef.current?.play(); setAudioPlaying(true); }}
                className="btn-secondary px-3 py-1.5 text-xs" aria-label="Play audio analysis">
                {audioPlaying ? '⏸ Pause' : '🔊 Listen'}
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[95, 80, 65].map((w, i) => (
                <div key={i} className="h-4 rounded-lg bg-slate-100 animate-pulse" style={{ width: `${w}%` }} />
              ))}
            </div>
          ) : (
            <>
              <p className="text-slate-600 leading-relaxed mb-4">{analysis?.analysisText}</p>
              {analysis?.tips && analysis.tips.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-eco-700">💡 Tips for improvement:</p>
                  <ul className="space-y-1.5">
                    {analysis.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-500">
                        <span aria-hidden="true" className="mt-0.5 shrink-0 text-eco-500">→</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Impact Video Summary */}
        <div className="glass-card p-6 animate-slide-up animation-fill-both animate-delay-300">
          <button
            type="button"
            onClick={() => setShowVideo((v) => !v)}
            className="flex w-full items-center justify-between"
            aria-expanded={showVideo}
          >
            <h2 className="font-display text-lg font-semibold text-eco-700">🎬 Impact Video Summary</h2>
            <span className="text-eco-500 transition-transform duration-300" aria-hidden="true" style={{ transform: showVideo ? 'rotate(180deg)' : '' }}>▼</span>
          </button>

          {showVideo && (
            <div className="mt-4" id="video-summary">
              <div
                className="relative overflow-hidden rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0f9ff 100%)',
                  border: '1.5px solid rgba(34,197,94,0.20)',
                  aspectRatio: '16/9',
                }}
                role="region" aria-label="Impact video summary"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-6">
                    <div className="mb-4 text-6xl animate-float" aria-hidden="true">🌍</div>
                    <p className="font-display text-2xl font-bold gradient-text mb-2">Your EcoQuest Journey</p>
                    <p className="text-slate-500 text-sm">
                      You saved <strong className="text-eco-600">{formatCarbon(totalCarbon)}</strong> CO₂ today!
                    </p>
                    <div className="mt-4 flex justify-center gap-3" aria-hidden="true">
                      {decisions.map((d, i) => (
                        <div key={i} className="glass-card-light px-3 py-2 text-xs animate-float" style={{ animationDelay: `${i * 0.4}s` }}>
                          <span className="block text-eco-600 font-bold">+{d.ecoPoints}</span>
                          <span className="text-slate-400 capitalize">{d.scenarioId}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {analysis?.audioUrl && (
          <audio ref={audioRef} src={analysis.audioUrl} onEnded={() => setAudioPlaying(false)} aria-label="AI analysis audio" />
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row animate-slide-up animation-fill-both animate-delay-500">
          <button type="button" id="play-again-btn" onClick={handlePlayAgain} className="btn-primary flex-1 py-4">
            <span aria-hidden="true">🔄</span>
            {t('results.play_again')}
          </button>
          <Link to="/leaderboard" id="view-leaderboard-btn" className="btn-secondary flex-1 py-4 text-center">
            <span aria-hidden="true">🏆</span>
            View Leaderboard
          </Link>
        </div>

      </div>
    </main>
  );
}
