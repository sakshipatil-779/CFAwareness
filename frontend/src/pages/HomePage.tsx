import { Link } from 'react-router-dom';
import { useLanguage } from '@contexts/LanguageContext';

const STATS = [
  { emoji: '🌍', value: '2.4M+', key: 'home.stats.warriors' },
  { emoji: '💨', value: '18,000t', key: 'home.stats.saved' },
  { emoji: '🎮', value: '95K+', key: 'home.stats.quests' },
];

const FEATURES = [
  {
    icon: '🎬',
    title: 'Awareness First',
    desc: 'An animated video shows you the real-world impact of carbon emissions before you play.',
    color: '#0284c7',
    bg: 'rgba(14,165,233,0.08)',
  },
  {
    icon: '🎮',
    title: 'Life Simulation Game',
    desc: 'Make daily decisions across 9 real-world scenarios. Every choice affects your Eco-Points.',
    color: '#16a34a',
    bg: 'rgba(34,197,94,0.08)',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Analysis',
    desc: 'Gemini AI analyses your choices and gives personalized, multilingual feedback with audio.',
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.08)',
  },
  {
    icon: '🌐',
    title: '9 Languages',
    desc: 'Play in English, Hindi, Spanish, French, German, Portuguese, Arabic, Japanese, or Chinese.',
    color: '#0d9488',
    bg: 'rgba(20,184,166,0.08)',
  },
];

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <main id="main-content">

      {/* ── HERO ── */}
      <section
        className="section relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 50%, #f0fdfa 100%)' }}
        aria-labelledby="hero-heading"
      >
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden="true">
          <div className="glow-orb top-0 left-1/4 h-96 w-96"
            style={{ background: 'radial-gradient(ellipse, rgba(34,197,94,0.10) 0%, transparent 70%)' }} />
          <div className="glow-orb bottom-0 right-1/4 h-96 w-96"
            style={{ background: 'radial-gradient(ellipse, rgba(14,165,233,0.10) 0%, transparent 70%)' }} />
        </div>

        <div className="page-container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="eco-badge mb-6 justify-center animate-fade-in animation-fill-both">
              <span aria-hidden="true">🌿</span>
              Google Cloud H2S Hackathon 2026
            </div>

            {/* Headline */}
            <h1
              id="hero-heading"
              className="font-display text-5xl font-extrabold sm:text-6xl leading-tight mb-6 gradient-text animate-slide-up animation-fill-both animate-delay-100"
            >
              {t('home.hero.title')}
            </h1>

            {/* Globe animation */}
            <div className="my-6 flex justify-center animate-fade-in animation-fill-both animate-delay-200" aria-hidden="true">
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full text-5xl animate-float"
                style={{
                  background: 'linear-gradient(135deg, rgba(240,253,244,0.9), rgba(224,242,254,0.9))',
                  border: '2px solid rgba(34,197,94,0.25)',
                  boxShadow: '0 8px 32px rgba(34,197,94,0.20), 0 0 0 8px rgba(34,197,94,0.06)',
                }}
              >
                🌍
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-slate-500 text-xl leading-relaxed mb-10 text-balance animate-slide-up animation-fill-both animate-delay-200">
              {t('home.hero.subtitle')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-fill-both animate-delay-300">
              <Link to="/game" id="hero-play-btn" className="btn-primary text-lg px-10 py-4">
                <span aria-hidden="true">🚀</span>
                {t('home.cta.play')}
              </Link>
              <Link to="/leaderboard" id="hero-lb-btn" className="btn-secondary text-lg px-10 py-4">
                <span aria-hidden="true">🏆</span>
                {t('home.cta.leaderboard')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12" aria-label="Platform statistics">
        <div className="page-container">
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.key} className="glass-card p-5 text-center">
                <p className="text-3xl mb-2" aria-hidden="true">{stat.emoji}</p>
                <p className="font-display text-2xl font-extrabold gradient-text">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{t(stat.key)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section" aria-labelledby="features-heading">
        <div className="page-container">
          <div className="text-center mb-12">
            <div className="eco-badge mb-4 justify-center">
              <span aria-hidden="true">✨</span>
              Why EcoQuest?
            </div>
            <h2 id="features-heading" className="font-display text-3xl font-extrabold gradient-text mb-3">
              How It Works
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              A premium eco-awareness experience built on Google Cloud Platform — production-ready, multilingual, and AI-powered.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feat, i) => (
              <div
                key={feat.title}
                className="glass-card p-6 animate-slide-up animation-fill-both"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
                  style={{ background: feat.bg, border: `1px solid ${feat.color}22` }}
                  aria-hidden="true"
                >
                  {feat.icon}
                </div>
                <h3 className="font-display font-bold text-slate-800 mb-2" style={{ color: feat.color }}>
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-16" aria-label="Start playing">
        <div className="page-container">
          <div
            className="glass-card p-10 text-center max-w-2xl mx-auto relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(240,253,244,0.95), rgba(224,242,254,0.90))',
              border: '1.5px solid rgba(34,197,94,0.25)',
            }}
          >
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="glow-orb top-0 left-0 h-40 w-40"
                style={{ background: 'radial-gradient(ellipse, rgba(34,197,94,0.15) 0%, transparent 70%)' }} />
              <div className="glow-orb bottom-0 right-0 h-40 w-40"
                style={{ background: 'radial-gradient(ellipse, rgba(14,165,233,0.12) 0%, transparent 70%)' }} />
            </div>
            <div className="relative z-10">
              <p className="text-5xl mb-4 animate-float" aria-hidden="true">🌱</p>
              <h2 className="font-display text-3xl font-extrabold gradient-text mb-3">
                Ready to make a difference?
              </h2>
              <p className="text-slate-500 mb-8">
                Watch the awareness video, choose your character, and make 3 eco-decisions. Every choice matters.
              </p>
              <Link to="/game" id="cta-play-btn" className="btn-primary text-lg px-12 py-4">
                <span aria-hidden="true">🎮</span>
                {t('home.cta.play')}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
