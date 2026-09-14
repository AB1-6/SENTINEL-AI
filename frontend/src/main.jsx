import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { PointerProvider } from './contexts/PointerContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AiProviderProvider } from './contexts/AiProviderContext';
import './styles/index.css';

// Enable canvas visuals by default in dev for easier inspection
try {
  const root = document.getElementById('root');
  if (root && import.meta.env.DEV) {
    root.setAttribute('data-canvas', 'enabled');
    // default intensity for local dev
    root.setAttribute('data-intensity', 'medium');
      // apply a restrained professional theme by default
      root.classList.add('professional-theme');
  }
} catch (e) {
  // silent
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PointerProvider>
      <ThemeProvider>
        <AiProviderProvider>
          <App />
        </AiProviderProvider>
      </ThemeProvider>
    </PointerProvider>
  </React.StrictMode>
);