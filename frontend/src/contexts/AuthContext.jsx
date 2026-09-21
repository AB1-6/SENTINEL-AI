import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { demoUser } from '@/services/mockData';
import api, { safeRequest } from '@/services/api';
import { isUserSuspended, getUser } from '@/services/userSecurityService';

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
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // Zero-Trust Check: Is this account suspended due to 3 prompt violations?
    if (isUserSuspended(cleanEmail)) {
      throw new Error('ACCOUNT_SUSPENDED: This account has been quarantined due to 3 Zero-Trust Security Violations. Only Super Administrator (anlinpunneli@gmail.com) can readmit.');
    }

    const result = await safeRequest(
      () => api.post('/auth/login', { email: cleanEmail, password: cleanPassword }),
      null
    );

    if (result?.token && result?.user) {
      const secRecord = getUser(cleanEmail);
      const enrichedUser = { ...result.user, strikes: secRecord?.strikes || 0, status: secRecord?.status || 'Active' };
      setAuthState({ user: enrichedUser, token: result.token, isAuthenticated: true });
      window.localStorage.setItem('sentinel.token', result.token);
      return enrichedUser;
    }

    const matchedRole = Object.values(rolePresets).find(
      (preset) => preset.email.toLowerCase() === cleanEmail && preset.password === cleanPassword
    );

    if (matchedRole) {
      const secRecord = getUser(cleanEmail);
      const enrichedUser = { ...matchedRole.user, strikes: secRecord?.strikes || 0, status: secRecord?.status || 'Active' };
      setAuthState({ user: enrichedUser, token: 'demo-token', isAuthenticated: true });
      window.localStorage.setItem('sentinel.token', 'demo-token');
      return enrichedUser;
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