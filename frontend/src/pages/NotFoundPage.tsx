import { Link } from 'react-router-dom';
import { useLanguage } from '@contexts/LanguageContext';

/**
 * 404 Not Found page.
 */
export default function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <section className="section page-container flex flex-col items-center justify-center text-center min-h-[70dvh]"
             aria-labelledby="notfound-heading">
      <div className="mb-6 text-7xl animate-float" aria-hidden="true">🌿</div>
      <h1 id="notfound-heading" className="font-display text-5xl font-extrabold gradient-text mb-4">404</h1>
      <p className="text-gray-400 mb-8 text-lg">This trail leads nowhere. Let's head back.</p>
      <Link to="/" className="btn-primary px-8 py-3">
        {t('common.back')} — {t('nav.home')}
      </Link>
    </section>
  );
}
