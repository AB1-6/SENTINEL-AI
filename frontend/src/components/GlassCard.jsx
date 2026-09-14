import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import React, { useRef, useMemo } from 'react';

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

const componentCache = new Map();

function getMotionComponent(Component) {
  if (typeof Component === 'string') {
    if (!componentCache.has(Component)) {
      componentCache.set(Component, motion(Component));
    }
    return componentCache.get(Component);
  }
  return motion(Component);
}

const GlassCard = React.forwardRef(function GlassCard({ className = '', children, as: Component = 'div', ...props }, ref) {
  const MotionComponent = useMemo(() => getMotionComponent(Component), [Component]);
  const innerRef = useRef(null);
  // prefer forwarded ref when provided
  const handleRef = ref || innerRef;

  // motion values for subtle tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useTransform(mx, (v) => `${clamp(v * 2, -2, 2)}deg`);
  const rotX = useTransform(my, (v) => `${clamp(-v * 2, -2, 2)}deg`);
  const sRotX = useSpring(rotX, { stiffness: 120, damping: 18 });
  const sRotY = useSpring(rotY, { stiffness: 120, damping: 18 });

  function handleMove(e) {
    const el = handleRef && 'current' in handleRef ? handleRef.current : innerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(nx);
    my.set(ny);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <MotionComponent
      ref={handleRef}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: sRotX, rotateY: sRotY, transformStyle: 'preserve-3d' }}
      className={`glass-card ${className}`}
      {...props}
    >
      <div className="glass-reflection" />
      <div className="stat-top-accent" />
      {children}
    </MotionComponent>
  );
});

export default GlassCard;