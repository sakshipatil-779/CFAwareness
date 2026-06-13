import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from '@contexts/LanguageContext';
import { GameProvider } from '@contexts/GameContext';
import { AuthProvider } from '@contexts/AuthContext';
import Layout from '@components/layout/Layout';
import LoadingScreen from '@components/ui/LoadingScreen';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@pages/HomePage'));
const GamePage = lazy(() => import('@pages/GamePage'));
const ResultsPage = lazy(() => import('@pages/ResultsPage'));
const LeaderboardPage = lazy(() => import('@pages/LeaderboardPage'));
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <GameProvider>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/game" element={<GamePage />} />
                  <Route path="/results" element={<ResultsPage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/404" element={<NotFoundPage />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Route>
              </Routes>
            </Suspense>
          </GameProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
