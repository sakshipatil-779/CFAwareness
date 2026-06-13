import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Root layout — wraps all pages with Navbar + Footer.
 * Outlet renders the matched child route.
 */
export default function Layout() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      {/* Ambient background glows */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="glow-orb -top-32 left-1/4 h-96 w-96 bg-eco-900/40" />
        <div className="glow-orb -bottom-32 right-1/4 h-96 w-96 bg-teal-600/20" />
        <div className="glow-orb left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 bg-eco-800/20" />
      </div>

      <Navbar />

      <main id="main-content" className="relative flex-1" tabIndex={-1}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
