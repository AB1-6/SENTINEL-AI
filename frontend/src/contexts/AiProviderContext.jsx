import React, { createContext, useContext, useEffect, useState } from 'react';

const AiProviderContext = createContext(null);

export function AiProviderProvider({ children }) {
  const [provider, setProvider] = useState(() => {
    try {
      return window.localStorage.getItem('sentinel.aiProvider') || 'Gemini';
    } catch (e) {
      return 'Gemini';
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('sentinel.aiProvider', provider);
    } catch (e) {}
  }, [provider]);

  // respond to external storage changes (other tabs)
  useEffect(() => {
    function onStorage(e) {
      if (e.key === 'sentinel.aiProvider' && e.newValue) setProvider(e.newValue);
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return <AiProviderContext.Provider value={{ provider, setProvider }}>{children}</AiProviderContext.Provider>;
}

export function useAiProvider() {
  const ctx = useContext(AiProviderContext);
  if (!ctx) throw new Error('useAiProvider must be used within AiProviderProvider');
  return ctx;
}

export default AiProviderContext;
