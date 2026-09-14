import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const PointerContext = createContext({ x: 0, y: 0, nx: 0, ny: 0 });

export function PointerProvider({ children }) {
  const raf = useRef(null);
  const last = useRef({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0, nx: 0, ny: 0 });

  useEffect(() => {
    function onMove(e) {
      const x = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
      const y = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY) || 0;
      last.current.x = x;
      last.current.y = y;
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = null;
        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;
        const nx = (last.current.x / w) * 2 - 1; // -1..1
        const ny = (last.current.y / h) * 2 - 1;
        setPos({ x: last.current.x, y: last.current.y, nx, ny });
      });
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return <PointerContext.Provider value={pos}>{children}</PointerContext.Provider>;
}

export function usePointer() {
  return useContext(PointerContext);
}

export default PointerContext;
