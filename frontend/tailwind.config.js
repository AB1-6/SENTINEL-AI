import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050816',
        midnight: '#08111f',
        aura: '#22a3ff',
        electric: '#4dd7ff',
        success: '#5ef28b',
        warning: '#f5b84d',
        danger: '#ff5e7b',
      },
      boxShadow: {
        glow: '0 0 35px rgba(34, 163, 255, 0.35)',
        glass: '0 12px 40px rgba(0, 0, 0, 0.35)',
      },
      backgroundImage: {
        'radial-grid': 'radial-gradient(circle at top, rgba(34,163,255,0.25), transparent 40%), linear-gradient(180deg, rgba(8,17,31,0.2), rgba(5,8,22,1))',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-18px) translateX(10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.55, transform: 'scale(0.98)' },
          '50%': { opacity: 1, transform: 'scale(1.03)' },
        },
      },
      animation: {
        drift: 'drift 12s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [typography],
};