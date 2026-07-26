import React, { useState, useEffect, useRef } from 'react';

/**
 * MagneticCursor
 * ─────────────────────────────────────────────────────────
 * A high-performance custom cursor built for portfolios:
 *  • Eliminates layout thrashing by updating transform only inside rAF.
 *  • Uses state and classes for design styling to prevent redundant styles parsing.
 *  • pointer-events: none is enforced to avoid mouseover flickering.
 */
export default function MagneticCursor() {
  const isTouch = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches
  );

  if (isTouch.current) return null;

  return <CursorImpl />;
}

function CursorImpl() {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const labelRef = useRef(null);

  const mousePos  = useRef({ x: -200, y: -200 });
  const ringPos   = useRef({ x: -200, y: -200 });
  const rafId     = useRef(null);

  const [particles, setParticles] = useState([]);
  const [hidden, setHidden]       = useState(false);

  const stateRef = useRef({
    mode: 'default',
    label: '',
    clicking: false,
  });

  // Performant class toggle (only run when mode changes)
  const updateCursorMode = (newMode, labelText = '') => {
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!ring) return;

    stateRef.current.mode = newMode;
    stateRef.current.label = labelText;

    // Standard static styles to prevent cssText parsing overhead
    ring.className = 'fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center transition-all duration-300 ease-out select-none';
    
    if (label) {
      label.style.display = 'none';
    }

    if (newMode === 'hover') {
      ring.classList.add('w-12', 'h-12', 'rounded-full', 'border-2', 'border-gold', 'bg-gold/8');
    } else if (newMode === 'label') {
      ring.classList.add('w-16', 'h-16', 'rounded-full', 'bg-navy', 'border-none');
      if (label) {
        label.style.display = 'flex';
        label.textContent = labelText.toUpperCase();
      }
    } else if (newMode === 'text') {
      ring.classList.add('w-[3px]', 'h-7', 'rounded-sm', 'bg-navy', 'border-none');
    } else {
      ring.classList.add('w-9', 'h-9', 'rounded-full', 'border', 'border-navy/40');
    }
  };

  // ── rAF loop for smooth elastic position tracking ──
  useEffect(() => {
    const ease = 0.14;

    const loop = () => {
      const tx = mousePos.current.x;
      const ty = mousePos.current.y;
      const rx = ringPos.current.x;
      const ry = ringPos.current.y;

      const nextX = rx + (tx - rx) * ease;
      const nextY = ry + (ty - ry) * ease;

      ringPos.current = { x: nextX, y: nextY };

      // Update ring transform only
      if (ringRef.current) {
        const mode = stateRef.current.mode;
        const offset = mode === 'hover' ? 24
                     : mode === 'label' ? 32
                     : mode === 'text' ? 1.5
                     : 18;
        
        const scale = stateRef.current.clicking ? 0.88 : 1;
        const yOffset = mode === 'text' ? 14 : offset;
        ringRef.current.style.transform = `translate3d(${nextX - offset}px, ${nextY - yOffset}px, 0) scale(${scale})`;
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  // ── Event listeners ──
  useEffect(() => {
    const onMove = (e) => {
      const { clientX: x, clientY: y } = e;
      mousePos.current = { x, y };

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x - 3}px,${y - 3}px,0)`;
      }
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const interactive = target.closest('a, button, [role="button"], [data-cursor], input, select, textarea');
      const isText = !interactive && target.closest('p, blockquote, h1, h2, h3, h4, li');
      const cursorAttr = interactive?.getAttribute('data-cursor');

      if (cursorAttr) {
        updateCursorMode('label', cursorAttr);
      } else if (interactive) {
        updateCursorMode('hover');
      } else if (isText) {
        updateCursorMode('text');
      } else {
        updateCursorMode('default');
      }
    };

    const onDown = () => {
      stateRef.current.clicking = true;
    };
    const onUp = () => {
      stateRef.current.clicking = false;
    };

    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    const onClick = (e) => {
      const count  = 16;
      const colors = ['#013582', '#F4CF31', '#0B4DB5', '#F8E571'];
      const burst  = Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const dist  = 35 + Math.random() * 55;
        return {
          id: Date.now() + i,
          x:  e.clientX,
          y:  e.clientY,
          dx: `${Math.cos(angle) * dist}px`,
          dy: `${Math.sin(angle) * dist}px`,
          size: `${4 + Math.random() * 5}px`,
          color: colors[i % colors.length],
        };
      });
      setParticles(prev => [...prev, ...burst]);
      setTimeout(() => setParticles([]), 800);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);
    window.addEventListener('click',     onClick);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    // Initial load state
    updateCursorMode('default');

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
      window.removeEventListener('click',     onClick);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  if (hidden) return null;

  return (
    <>
      {/* Particles */}
      {particles.map(p => (
        <span
          key={p.id}
          className="cursor-particle"
          style={{
            left: p.x, top: p.y,
            width: p.size, height: p.size,
            backgroundColor: p.color,
            '--dx': p.dx, '--dy': p.dy,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Dot — exact position */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 6, height: 6,
          borderRadius: '50%',
          background: '#013582',
          pointerEvents: 'none',
          zIndex: 10000,
          willChange: 'transform',
          transition: 'background 0.15s ease',
        }}
      />

      {/* Ring — elastic follow */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center transition-all duration-300 ease-out select-none w-9 h-9 rounded-full border border-navy/40"
        style={{
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      >
        {/* Label text inside ring */}
        <span
          ref={labelRef}
          className="hidden select-none pointer-events-none"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '8px',
            fontWeight: 600,
            letterSpacing: '0.14em',
            color: '#F4CF31',
            textTransform: 'uppercase',
            lineHeight: 1,
            pointerEvents: 'none',
          }}
        />
      </div>
    </>
  );
}
