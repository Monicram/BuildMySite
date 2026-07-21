// ============================================================
// BuildMySite Admin — Authentication Context
// ============================================================
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { authService } from '../services/auth';
import type { AdminUser, LoginCredentials } from '../types';

interface AuthContextValue {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateAdmin: (updated: Partial<AdminUser>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, try to restore session from localStorage
  useEffect(() => {
    const initAuth = async () => {
      if (!authService.hasToken()) {
        setIsLoading(false);
        return;
      }
      // Optimistic: populate from cache immediately
      const cached = authService.getUser();
      if (cached) setAdmin(cached);

      // Then verify token is still valid on server
      try {
        const user = await authService.verify();
        // Merge cached properties like phone/avatar if they exist
        setAdmin(prev => ({ ...user, ...prev }));
      } catch {
        // Token invalid/expired
        authService.logout();
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };
    void initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    setAdmin(response.admin);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setAdmin(null);
  }, []);

  const updateAdmin = useCallback((updated: Partial<AdminUser>) => {
    setAdmin(prev => {
      if (!prev) return null;
      const next = { ...prev, ...updated };
      localStorage.setItem('bms_admin_user', JSON.stringify(next));
      return next;
    });
  }, []);

  const value: AuthContextValue = {
    admin,
    isAuthenticated: !!admin,
    isLoading,
    login,
    logout,
    updateAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
