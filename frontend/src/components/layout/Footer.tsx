import { Link } from 'react-router-dom';
import { useLanguage } from '@contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-auto w-full py-8"
      style={{
        borderTop: '1px solid rgba(34,197,94,0.10)',
        background: 'rgba(255,255,255,0.78)',
        backdropFilter: 'blur(12px)',
      }}
      role="contentinfo"
    >
      <div className="page-container">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span aria-hidden="true">🌿</span>
            <span className="font-display font-bold gradient-text">EcoQuest</span>
            <span className="text-slate-400 text-sm">— Carbon Footprint Awareness Platform</span>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex gap-4 text-sm text-slate-400" >
              <li><Link to="/" className="hover:text-eco-600 transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/game" className="hover:text-eco-600 transition-colors">{t('nav.game')}</Link></li>
              <li><Link to="/leaderboard" className="hover:text-eco-600 transition-colors">{t('nav.leaderboard')}</Link></li>
            </ul>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-slate-400">
            © {year} EcoQuest. Built on{' '}
            <span className="text-eco-600">Google Cloud Platform</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
