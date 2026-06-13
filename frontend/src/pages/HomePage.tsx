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
    <div className="w-full">
      {/* ── HERO ── */}
      <section
        className="section relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 50%, #f0fdfa 100%)' }}
        aria-labelledby="hero-heading"
      >
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden="true">
          <div
            className="glow-orb left-1/4 top-0 h-96 w-96"
            style={{
              background: 'radial-gradient(ellipse, rgba(34,197,94,0.10) 0%, transparent 70%)',
            }}
          />
          <div
            className="glow-orb bottom-0 right-1/4 h-96 w-96"
            style={{
              background: 'radial-gradient(ellipse, rgba(14,165,233,0.10) 0%, transparent 70%)',
            }}
          />
        </div>

        <div className="page-container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="eco-badge animation-fill-both mb-6 animate-fade-in justify-center">
              <span aria-hidden="true">🌿</span>
              Google Cloud H2S Hackathon 2026
            </div>

            {/* Headline */}
            <h1
              id="hero-heading"
              className="gradient-text animation-fill-both animate-delay-100 mb-6 animate-slide-up font-display text-5xl font-extrabold leading-tight sm:text-6xl"
            >
              {t('home.hero.title')}
            </h1>

            {/* Globe animation */}
            <div
              className="animation-fill-both animate-delay-200 my-6 flex animate-fade-in justify-center"
              aria-hidden="true"
            >
              <div
                className="flex h-24 w-24 animate-float items-center justify-center rounded-full text-5xl"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(240,253,244,0.9), rgba(224,242,254,0.9))',
                  border: '2px solid rgba(34,197,94,0.25)',
                  boxShadow: '0 8px 32px rgba(34,197,94,0.20), 0 0 0 8px rgba(34,197,94,0.06)',
                }}
              >
                🌍
              </div>
            </div>

            {/* Subtitle */}
            <p className="animation-fill-both animate-delay-200 mb-10 animate-slide-up text-balance text-xl leading-relaxed text-slate-500">
              {t('home.hero.subtitle')}
            </p>

            {/* CTAs */}
            <div className="animation-fill-both animate-delay-300 flex animate-slide-up flex-col justify-center gap-4 sm:flex-row">
              <Link to="/game" id="hero-play-btn" className="btn-primary px-10 py-4 text-lg">
                <span aria-hidden="true">🚀</span>
                {t('home.cta.play')}
              </Link>
              <Link to="/leaderboard" id="hero-lb-btn" className="btn-secondary px-10 py-4 text-lg">
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
          <div className="mx-auto grid max-w-2xl grid-cols-3 gap-4">
            {STATS.map((stat) => (
              <div key={stat.key} className="glass-card p-5 text-center">
                <p className="mb-2 text-3xl" aria-hidden="true">
                  {stat.emoji}
                </p>
                <p className="gradient-text font-display text-2xl font-extrabold">{stat.value}</p>
                <p className="mt-1 text-xs text-slate-400">{t(stat.key)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section" aria-labelledby="features-heading">
        <div className="page-container">
          <div className="mb-12 text-center">
            <div className="eco-badge mb-4 justify-center">
              <span aria-hidden="true">✨</span>
              Why EcoQuest?
            </div>
            <h2
              id="features-heading"
              className="gradient-text mb-3 font-display text-3xl font-extrabold"
            >
              How It Works
            </h2>
            <p className="mx-auto max-w-lg text-slate-500">
              A premium eco-awareness experience built on Google Cloud Platform — production-ready,
              multilingual, and AI-powered.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feat, i) => (
              <div
                key={feat.title}
                className="glass-card animation-fill-both animate-slide-up p-6"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
                  style={{ background: feat.bg, border: `1px solid ${feat.color}22` }}
                  aria-hidden="true"
                >
                  {feat.icon}
                </div>
                <h3
                  className="mb-2 font-display font-bold text-slate-800"
                  style={{ color: feat.color }}
                >
                  {feat.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-16" aria-label="Start playing">
        <div className="page-container">
          <div
            className="glass-card relative mx-auto max-w-2xl overflow-hidden p-10 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(240,253,244,0.95), rgba(224,242,254,0.90))',
              border: '1.5px solid rgba(34,197,94,0.25)',
            }}
          >
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div
                className="glow-orb left-0 top-0 h-40 w-40"
                style={{
                  background: 'radial-gradient(ellipse, rgba(34,197,94,0.15) 0%, transparent 70%)',
                }}
              />
              <div
                className="glow-orb bottom-0 right-0 h-40 w-40"
                style={{
                  background: 'radial-gradient(ellipse, rgba(14,165,233,0.12) 0%, transparent 70%)',
                }}
              />
            </div>
            <div className="relative z-10">
              <p className="mb-4 animate-float text-5xl" aria-hidden="true">
                🌱
              </p>
              <h2 className="gradient-text mb-3 font-display text-3xl font-extrabold">
                Ready to make a difference?
              </h2>
              <p className="mb-8 text-slate-500">
                Watch the awareness video, choose your character, and make 3 eco-decisions. Every
                choice matters.
              </p>
              <Link to="/game" id="cta-play-btn" className="btn-primary px-12 py-4 text-lg">
                <span aria-hidden="true">🎮</span>
                {t('home.cta.play')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
