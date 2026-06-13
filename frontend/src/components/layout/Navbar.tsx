/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '@contexts/LanguageContext';
import { LANGUAGE_OPTIONS } from '@/utils/constants';

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Close lang dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [location]);

  const currentLang = LANGUAGE_OPTIONS.find((l) => l.code === language)!;

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: '🏠' },
    { to: '/game', label: t('nav.game'), icon: '🎮' },
    { to: '/leaderboard', label: t('nav.leaderboard'), icon: '🏆' },
  ];

  return (
    <header className="navbar-glass sticky top-0 z-40" role="banner">
      <div className="page-container">
        <nav className="flex h-16 items-center justify-between" aria-label="Main navigation">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-xl font-extrabold"
            aria-label="EcoQuest Home"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
              style={{
                background: 'linear-gradient(135deg, #22c55e, #0ea5e9)',
                boxShadow: '0 2px 10px rgba(34,197,94,0.35)',
              }}
              aria-hidden="true"
            >
              🌍
            </span>
            <span className="gradient-text">EcoQuest</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                role="listitem"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'border border-eco-200 bg-eco-50 text-eco-700 shadow-sm'
                      : 'text-slate-500 hover:bg-eco-50/60 hover:text-eco-600'
                  }`
                }
              >
                <span aria-hidden="true">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right: Language + mobile toggle */}
          <div className="flex items-center gap-2">
            {/* Language dropdown */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                id="lang-toggle"
                onClick={() => setLangOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label={`Language: ${currentLang?.nativeLabel}`}
                className="flex items-center gap-1.5 rounded-xl border border-eco-200 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur-sm transition-all hover:border-eco-400 hover:bg-eco-50"
              >
                <span aria-hidden="true">{currentLang?.flag}</span>
                <span className="hidden sm:inline">{currentLang?.nativeLabel}</span>
                <svg
                  className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Dropdown panel */}
              {langOpen && (
                <div
                  className="animation-fill-both absolute right-0 z-50 mt-2 w-52 animate-slide-down overflow-hidden rounded-2xl shadow-glass-lg"
                  style={{
                    background: 'rgba(255,255,255,0.97)',
                    border: '1px solid rgba(34,197,94,0.15)',
                  }}
                  role="listbox"
                  aria-label="Select language"
                >
                  {/* Scrollable container for 9 languages */}
                  <div className="no-scrollbar max-h-72 overflow-y-auto py-1.5">
                    {LANGUAGE_OPTIONS.map((opt) => (
                      <button
                        key={opt.code}
                        role="option"
                        aria-selected={language === opt.code}
                        type="button"
                        onClick={() => {
                          setLanguage(opt.code);
                          setLangOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 ${
                          language === opt.code
                            ? 'bg-eco-50 font-semibold text-eco-700'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-base" aria-hidden="true">
                          {opt.flag}
                        </span>
                        <span className="flex-1 text-left">{opt.nativeLabel}</span>
                        <span className="text-xs text-slate-400">{opt.label}</span>
                        {language === opt.code && (
                          <span className="text-eco-500" aria-hidden="true">
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              id="mobile-menu-toggle"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-slate-500 transition-colors hover:border-eco-300 hover:text-eco-600 md:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="animation-fill-both animate-slide-down border-t pb-3 pt-2 md:hidden"
            style={{ borderColor: 'rgba(34,197,94,0.12)' }}
            role="navigation"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `mx-1 my-0.5 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-eco-50 text-eco-700'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-eco-600'
                  }`
                }
              >
                <span aria-hidden="true">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
