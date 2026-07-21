import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './admin/context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/layouts/AdminLayout';
import App from './App.tsx';
import './index.css';

// Lazy-load all admin pages for performance
const Login       = lazy(() => import('./admin/pages/Login'));
const Dashboard   = lazy(() => import('./admin/pages/Dashboard'));
const Enquiries   = lazy(() => import('./admin/pages/Enquiries'));
const Bookings    = lazy(() => import('./admin/pages/Bookings'));
const Slots       = lazy(() => import('./admin/pages/Slots'));
const AdminSettings = lazy(() => import('./admin/pages/Settings'));
const Profile     = lazy(() => import('./admin/pages/Profile'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const PageLoader = () => (
  <div className="min-h-screen bg-obsidian-950 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* ── Landing Page (completely unchanged) ── */}
                <Route path="/" element={<App />} />

                {/* ── Admin: Login (public) ── */}
                <Route path="/admin/login" element={<Login />} />

                {/* ── Admin: Protected Routes ── */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard"     element={<Dashboard />} />
                  <Route path="enquiries"     element={<Enquiries />} />
                  <Route path="bookings"      element={<Bookings />} />
                  <Route path="slots"         element={<Slots />} />
                  <Route path="settings"      element={<AdminSettings />} />
                  <Route path="profile"       element={<Profile />} />
                </Route>

                {/* ── Catch all: redirect to home ── */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
