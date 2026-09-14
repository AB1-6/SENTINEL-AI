import { ChevronDown } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';

const KEY = 'sentinel:intensity';

export default function IntensityControl() {
  const [open, setOpen] = useState(false);
  const controlRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState(null);
  const [level, setLevel] = useState(() => {
    try { return localStorage.getItem(KEY) || 'medium'; } catch { return 'medium'; }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, level); } catch {}
    const root = document.getElementById('root');
    if (root) root.setAttribute('data-intensity', level);
  }, [level]);

  useEffect(() => {
    function onDocClick(event) {
      if (!controlRef.current) return;
      if (controlRef.current.contains(event.target)) return;
      setOpen(false);
    }

    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  useEffect(() => {
    if (!open) return;

    function updateMenuPosition() {
      const control = controlRef.current;
      if (!control) return;
      const rect = control.getBoundingClientRect();
      const menuWidth = 160;
      const left = Math.max(12, Math.min(rect.left, window.innerWidth - menuWidth - 12));
      const top = rect.bottom + 10;
      setMenuStyle({ position: 'fixed', top: `${top}px`, left: `${left}px`, minWidth: `${Math.max(rect.width, menuWidth)}px` });
    }

    updateMenuPosition();
    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);
    return () => {
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [open, level]);

  return (
    <div className="relative inline-flex items-center" ref={controlRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-3 py-2 text-sm text-slate-100 transition hover:border-cyan-400/25 hover:bg-white/6"
        aria-haspopup="menu"
        aria-expanded={open ? 'true' : 'false'}
      >
        <span className="capitalize">{level}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && menuStyle ? createPortal(
        <div className="intensity-dropdown intensity-dropdown--portal" style={menuStyle} role="menu" aria-label="Intensity level">
          {['low', 'medium', 'high'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setLevel(option);
                setOpen(false);
              }}
              className={option === level ? 'active' : ''}
              role="menuitem"
            >
              {option[0].toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>,
        document.body,
      ) : null}
    </div>

  );
}
