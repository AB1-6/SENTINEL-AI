import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AppLayout from '@/layouts/AppLayout';
import RequireAuth from '@/components/RequireAuth';
import SplashScreen from '@/pages/SplashScreen';
import { useAuth, AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/contexts/ToastContext';
import ToastHost from '@/components/ToastHost';
import DataLines from '@/components/DataLines';
import CanvasNebula from '@/components/CanvasNebula';
import CanvasGL from '@/components/CanvasGL';

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const AssistantPage = lazy(() => import('@/pages/AssistantPage'));
const FinancialPage = lazy(() => import('@/pages/FinancialPage'));
const PresentationPage = lazy(() => import('@/pages/PresentationPage'));
const DocumentsPage = lazy(() => import('@/pages/DocumentsPage'));
const ChatHistoryPage = lazy(() => import('@/pages/ChatHistoryPage'));
const SecurityCenterPage = lazy(() => import('@/pages/SecurityCenterPage'));
const UserManagementPage = lazy(() => import('@/pages/UserManagementPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));

function BootLoader({ children }) {
  const [booted, setBooted] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleBootComplete = () => {
    setBooted(true);
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!booted && (
          <SplashScreen key="splash" onComplete={handleBootComplete} />
        )}
      </AnimatePresence>
      {booted && children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CanvasGL />
        <CanvasNebula />
        <DataLines />
        <ToastProvider>
          <AuthProvider>
            <BootLoader>
              <ToastHost />
              <Suspense fallback={<div className="grid min-h-screen place-items-center bg-[#050816] text-electric">Loading Sentinel modules...</div>}>
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<RequireAuth><AppLayout /></RequireAuth>}>
                      <Route index element={<DashboardPage />} />
                      <Route path="assistant" element={<AssistantPage />} />
                      <Route path="financial" element={<FinancialPage />} />
                      <Route path="presentation" element={<PresentationPage />} />
                      <Route path="documents" element={<DocumentsPage />} />
                      <Route path="history" element={<ChatHistoryPage />} />
                      <Route path="security" element={<SecurityCenterPage />} />
                      <Route path="users" element={<UserManagementPage />} />
                      <Route path="settings" element={<SettingsPage />} />
                      <Route path="profile" element={<ProfilePage />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AnimatePresence>
              </Suspense>
            </BootLoader>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}