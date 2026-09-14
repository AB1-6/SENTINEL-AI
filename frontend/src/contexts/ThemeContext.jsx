import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export const THEMES = ['Dark Glass', 'Midnight Blue', 'Enterprise Contrast'];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('uiTheme');
      if (THEMES.includes(saved)) return saved;
    } catch (e) {
      // ignore
    }
    return 'Dark Glass';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const root = document.getElementById('root');
    if (root) root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('uiTheme', theme);
    } catch (e) {}
  }, [theme]);

  const toggle = () => {
    setTheme((current) => {
      const idx = THEMES.indexOf(current);
      const nextIdx = (idx + 1) % THEMES.length;
      return THEMES[nextIdx];
    });
  };

  return <ThemeContext.Provider value={{ theme, setTheme, toggle, THEMES }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

export default ThemeContext;