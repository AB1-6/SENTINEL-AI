import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import RotatingShield from './RotatingShield';
import { 
  LayoutDashboard, 
  Bot, 
  Folder, 
  MessageSquareText, 
  ShieldCheck, 
  Users, 
  Settings2, 
  Menu, 
  X, 
  LogOut, 
  ShieldAlert 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { playClickSound, playChimeSound } from '@/utils/soundEffects';

const navItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Enterprise Assistant', to: '/assistant', icon: Bot },
  { label: 'Documents', to: '/documents', icon: Folder },
  { label: 'Chat History', to: '/history', icon: MessageSquareText },
  { label: 'Security Center', to: '/security', icon: ShieldCheck },
  { label: 'User Management', to: '/users', icon: Users },
  { label: 'Settings', to: '/settings', icon: Settings2 },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    playClickSound();
    setIsOpen(!isOpen);
  };

  const handleNavClick = (to) => {
    playClickSound();
    setIsOpen(false);
    navigate(to);
  };

  const handleLogout = () => {
    playClickSound();
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <div className="xl:hidden w-full border-b border-cyan-500/15 bg-[#050816]/90 px-4 py-3 backdrop-blur-xl sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10">
            <RotatingShield size={32} compact />
          </div>
          <div>
            <span className="font-display font-bold text-white text-base tracking-wide">SENTINEL AI</span>
            <span className="ml-2 font-mono text-[10px] text-cyan-300">v2.0</span>
          </div>
        </div>

        {/* Hamburger Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X className="h-5 w-5 text-cyan-300" /> : <Menu className="h-5 w-5 text-cyan-300" />}
        </button>
      </div>

      {/* Slide-Down Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden pt-4 pb-2"
          >
            <nav className="space-y-1.5 border-t border-white/10 pt-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => handleNavClick(item.to)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-all ${
                      isActive
                        ? 'border-cyan-400/40 bg-cyan-400/10 text-white font-semibold shadow-[0_0_15px_rgba(77,215,255,0.15)]'
                        : 'border-transparent text-slate-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="h-4.5 w-4.5 text-cyan-300" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Mobile User Profile Footer */}
            <div className="mt-4 border-t border-white/10 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-xs text-black">
                  {user?.avatar || (user?.name ? user.name.slice(0, 2).toUpperCase() : 'AP')}
                </div>
                <div>
                  <p className="font-display font-semibold text-white text-xs truncate max-w-[150px]">
                    {user?.name || 'Anlin Punne'}
                  </p>
                  <p className="text-[10px] text-cyan-300 font-mono truncate max-w-[150px]">
                    {user?.role || 'Super Admin'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500 hover:text-white transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
