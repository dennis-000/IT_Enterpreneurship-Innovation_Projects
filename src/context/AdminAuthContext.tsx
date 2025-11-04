import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface AdminUser {
  email: string;
  name: string;
}

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

const ADMIN_EMAIL = 'admin@fga.local';
const ADMIN_PASSWORD = 'SecurePass123';
const STORAGE_KEY = 'fga-admin-session';
const isBrowser = typeof window !== 'undefined';

const loadSession = (): AdminUser | null => {
  if (!isBrowser) return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    if (stored === 'true') {
      // Backward compatibility with earlier boolean-based session storage
      return createUserProfile(ADMIN_EMAIL);
    }

    const parsed = JSON.parse(stored) as AdminUser | null;
    if (parsed && typeof parsed.email === 'string' && typeof parsed.name === 'string') {
      return parsed;
    }
    return null;
  } catch (error) {
    console.warn('[AdminAuthContext] Failed to read session from storage', error);
    return null;
  }
};

const persistSession = (user: AdminUser | null) => {
  if (!isBrowser) return;
  try {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.warn('[AdminAuthContext] Failed to write session to storage', error);
  }
};

const createUserProfile = (email: string): AdminUser => {
  const [usernamePart] = email.split('@');
  const friendlyName = usernamePart
    .split(/[._-]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ') || 'Administrator';

  return { email, name: friendlyName };
};

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => loadSession());

  useEffect(() => {
    persistSession(user);
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const isValid = normalizedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD;
    if (isValid) {
      const profile = createUserProfile(normalizedEmail);
      setUser(profile);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      user,
      login,
      logout,
    }),
    [user, login, logout]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
