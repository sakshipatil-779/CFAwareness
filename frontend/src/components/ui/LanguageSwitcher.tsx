/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@contexts/LanguageContext';
import type { Language } from '@/types';
import { LANGUAGE_OPTIONS } from '@/utils/constants';

/**
 * Language switcher dropdown — accessible with keyboard navigation.
 */
export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = LANGUAGE_OPTIONS.find((o) => o.code === language)!;

  // Close on outside click
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  // Keyboard: Escape closes
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') setOpen(false);
  }

  function select(code: Language) {
    setLanguage(code);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative" onKeyDown={onKeyDown}>
      <button
        type="button"
        id="language-switcher-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t('nav.language')}: ${current.nativeLabel}`}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-400
                   transition-all hover:bg-eco-900/40 hover:text-eco-300"
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true">{current.flag}</span>
        <span className="hidden sm:inline">{current.nativeLabel}</span>
        <span aria-hidden="true" className="text-xs opacity-60">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-labelledby="language-switcher-btn"
          aria-label="Select language"
          className="absolute right-0 top-full mt-1 w-44 overflow-hidden rounded-xl py-1 shadow-glass-lg"
          style={{
            background: 'rgba(7, 26, 14, 0.95)',
            border: '1px solid rgba(34, 197, 94, 0.20)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {LANGUAGE_OPTIONS.map((opt) => (
            <li
              key={opt.code}
              role="option"
              aria-selected={opt.code === language}
              tabIndex={0}
              className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm transition-colors
                          hover:bg-eco-900/50
                          ${opt.code === language ? 'text-eco-400 font-medium' : 'text-gray-300'}`}
              onClick={() => select(opt.code)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && select(opt.code)}
            >
              <span aria-hidden="true">{opt.flag}</span>
              <span>{opt.nativeLabel}</span>
              {opt.code === language && (
                <span aria-hidden="true" className="ml-auto text-eco-500">✓</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
