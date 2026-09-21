import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Sentinel Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen grid place-items-center bg-[#02040c] text-white p-6 font-sans">
          <div className="max-w-md w-full rounded-2xl border border-rose-500/30 bg-slate-950/90 backdrop-blur-xl p-6 shadow-2xl space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-6 w-6 animate-pulse" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Sentinel Security Intercept
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                A rendering exception was safely caught. The module has been paused to maintain state integrity.
              </p>
            </div>

            {this.state.error && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 text-left font-mono text-[11px] text-rose-300 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 px-4 py-2 text-xs font-bold text-slate-950 hover:from-sky-300 hover:to-blue-400 transition shadow-lg shadow-sky-500/20"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reload Module
              </button>
              <a
                href="/"
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white transition"
              >
                <Home className="h-3.5 w-3.5" />
                Return Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
