import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#090d16',
        midnight: '#0e1422',
        surface: '#131b2e',
        'surface-elevated': '#17223b',
        aura: '#3b82f6',
        electric: '#38bdf8',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      boxShadow: {
        glow: '0 0 25px rgba(56, 189, 248, 0.15)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.35)',
        'enterprise': '0 4px 20px -2px rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        'radial-grid': 'radial-gradient(circle at top, rgba(56,189,248,0.12), transparent 45%), linear-gradient(180deg, rgba(14,20,34,0.3), rgba(9,13,22,1))',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-10px) translateX(6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.7, transform: 'scale(0.99)' },
          '50%': { opacity: 1, transform: 'scale(1.01)' },
        },
      },
      animation: {
        drift: 'drift 14s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [typography],
};