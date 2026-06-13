/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { UserProfile } from '@/types';

// ---- Context ----
interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ---- Provider ----
// Firebase auth will be wired up in Step 5.
// For now, anonymous guest user is simulated for the game to work standalone.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate anonymous guest session until Firebase is wired in Step 5
    const stored = sessionStorage.getItem('ecoquest_guest');
    if (stored) {
      // eslint-disable-next-line
      setUser(JSON.parse(stored) as UserProfile);
    } else {
      const guest: UserProfile = {
        uid:           `guest_${Math.random().toString(36).slice(2, 10)}`,
        displayName:   'Eco Explorer',
        email:         null,
        photoURL:      null,
        language:      'en',
        totalEcoPoints: 0,
        totalCarbonSaved: 0,
        gamesPlayed:   0,
        createdAt:     Date.now(),
        lastPlayedAt:  Date.now(),
      };
      sessionStorage.setItem('ecoquest_guest', JSON.stringify(guest));
      setUser(guest);
    }
    setIsLoading(false);
  }, []);

  const signInAnonymously = async () => {
    // TODO: replace with firebase.auth().signInAnonymously() in Step 5
    setIsLoading(false);
  };

  const signOut = async () => {
    sessionStorage.removeItem('ecoquest_guest');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signInAnonymously, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// ---- Hook ----
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
