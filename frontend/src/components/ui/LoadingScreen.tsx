import { useLanguage } from '@contexts/LanguageContext';

/**
 * Full-screen loading screen shown during React.Suspense lazy loading.
 */
export default function LoadingScreen() {
  const { t } = useLanguage();

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 50%, #f0fdfa 100%)' }}
      role="status"
      aria-live="polite"
      aria-label={t('common.loading')}
    >
      {/* Animated logo */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Outer glow ring */}
        <div
          className="absolute h-24 w-24 rounded-full animate-ping"
          style={{ background: 'rgba(34, 197, 94, 0.15)' }}
          aria-hidden="true"
        />
        {/* Inner ring */}
        <div
          className="absolute h-16 w-16 rounded-full animate-spin-slow"
          style={{ border: '2px solid transparent', borderTopColor: 'rgba(34, 197, 94, 0.6)' }}
          aria-hidden="true"
        />
        {/* Icon */}
        <span className="relative text-4xl animate-bounce-eco" role="img" aria-hidden="true">
          🌿
        </span>
      </div>

      <p className="font-display text-xl font-bold gradient-text mb-2">EcoQuest</p>
      <p className="text-sm text-slate-500">{t('common.loading')}</p>
    </div>
  );
}
