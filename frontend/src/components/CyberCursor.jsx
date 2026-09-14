import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CyberCursor() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const cursorX = useSpring(0, { stiffness: 450, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 450, damping: 28 });

  useEffect(() => {
    // Only activate on devices with fine pointer (mouse)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    function onMouseMove(e) {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    }

    function onMouseOver(e) {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('role') === 'button'
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    }

    function onMouseLeave() {
      setVisible(false);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Outer Halo Ring */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: hovered ? 1.8 : 1.0,
          borderColor: hovered ? 'rgba(77, 215, 255, 0.8)' : 'rgba(77, 215, 255, 0.35)',
          boxShadow: hovered ? '0 0 20px rgba(77, 215, 255, 0.5)' : '0 0 10px rgba(77, 215, 255, 0.15)',
        }}
        transition={{ duration: 0.15 }}
        className="h-8 w-8 rounded-full border border-cyan-400/40 backdrop-blur-[1px]"
      />

      {/* Inner Precision Core Dot */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: hovered ? 1.4 : 1.0,
          backgroundColor: hovered ? '#60a5fa' : '#4dd7ff',
        }}
        transition={{ duration: 0.1 }}
        className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#4dd7ff]"
      />
    </div>
  );
}
