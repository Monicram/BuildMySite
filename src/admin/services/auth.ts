// ============================================================
// BuildMySite Admin — Auth Service
// ============================================================
import adminApi, { TOKEN_KEY } from './api';
import type { LoginCredentials, LoginResponse, AdminUser } from '../types';

const USER_KEY = 'bms_admin_user';

export const authService = {
  /**
   * POST /api/auth/login
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await adminApi.post<LoginResponse>('/auth/login', credentials);
    if (data.success && data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.admin));
    }
    return data;
  },

  /**
   * GET /api/auth/verify — checks token is still valid
   */
  verify: async (): Promise<AdminUser> => {
    const { data } = await adminApi.get<{ success: boolean; admin: AdminUser }>('/auth/verify');
    return data.admin;
  },

  /**
   * Clear session data
   */
  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Read token from localStorage
   */
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Read cached admin user from localStorage
   */
  getUser: (): AdminUser | null => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as AdminUser) : null;
    } catch {
      return null;
    }
  },

  /**
   * Check if a token exists (fast, no network call)
   */
  hasToken: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
