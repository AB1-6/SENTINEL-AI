import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { demoUser } from '@/services/mockData';
import api, { safeRequest } from '@/services/api';

const AuthContext = createContext(null);

const rolePresets = {
  admin: {
    email: 'anlinpunneli@gmail.com',
    password: 'Anlin20#69',
    user: demoUser,
  },
  analyst: {
    email: 'alex.mercer@sentinel.local',
    password: 'Sentinel123!',
    user: {
      name: 'Alex Mercer',
      email: 'alex.mercer@sentinel.local',
      role: 'Security Analyst',
      title: 'Lead Security Engineer (SecOps)',
      avatar: 'AM',
    },
  },
  employee: {
    email: 'employee@sentinel.local',
    password: 'Sentinel123!',
    user: {
      name: 'David Kim',
      email: 'employee@sentinel.local',
      role: 'Employee',
      title: 'Standard Employee User',
      avatar: 'DK',
    },
  },
};

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useLocalStorage('sentinel.auth', {
    user: null,
    token: null,
    isAuthenticated: false,
  });


  async function login({ email, password }) {
    const result = await safeRequest(
      () => api.post('/auth/login', { email, password }),
      null
    );

    if (result?.token && result?.user) {
      setAuthState({ user: result.user, token: result.token, isAuthenticated: true });
      return result.user;
    }

    const matchedRole = Object.values(rolePresets).find(
      (preset) => preset.email.toLowerCase() === (email || '').toLowerCase() && preset.password === password
    );

    if (matchedRole) {
      setAuthState({ user: matchedRole.user, token: 'demo-token', isAuthenticated: true });
      return matchedRole.user;
    }

    // Default admin fallback for fast dev testing
    if ((email || '').toLowerCase() === rolePresets.admin.email.toLowerCase()) {
      setAuthState({ user: demoUser, token: 'demo-token', isAuthenticated: true });
      return demoUser;
    }

    throw new Error('Invalid credentials');
  }

  function logout() {
    window.localStorage.removeItem('sentinel.auth');
    window.localStorage.removeItem('sentinel.token');
    setAuthState({ user: null, token: null, isAuthenticated: false });
  }

  const value = useMemo(
    () => ({
      user: authState.user,
      token: authState.token,
      isAuthenticated: Boolean(authState.isAuthenticated),
      login,
      logout,
    }),
    [authState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}