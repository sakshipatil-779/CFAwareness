import { Link } from 'react-router-dom';
import { useLanguage } from '@contexts/LanguageContext';

/**
 * 404 Not Found page.
 */
export default function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <section
      className="section page-container flex min-h-[70dvh] flex-col items-center justify-center text-center"
      aria-labelledby="notfound-heading"
    >
      <div className="mb-6 animate-float text-7xl" aria-hidden="true">
        🌿
      </div>
      <h1 id="notfound-heading" className="gradient-text mb-4 font-display text-5xl font-extrabold">
        404
      </h1>
      <p className="mb-8 text-lg text-gray-400">This trail leads nowhere. Let's head back.</p>
      <Link to="/" className="btn-primary px-8 py-3">
        {t('common.back')} — {t('nav.home')}
      </Link>
    </section>
  );
}
