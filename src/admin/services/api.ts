// ============================================================
// BuildMySite Admin — Axios Instance (with JWT interceptor)
// ============================================================
import axios from 'axios';

const TOKEN_KEY = 'bms_admin_token';

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ─── Request Interceptor — attach JWT ──────────────────────
adminApi.interceptors.request.use(
  config => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// ─── Response Interceptor — handle 401 ────────────────────
adminApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('bms_admin_user');
      // Only redirect if we're in an admin route
      if (window.location.pathname.startsWith('/admin') &&
          !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export { TOKEN_KEY };
export default adminApi;
