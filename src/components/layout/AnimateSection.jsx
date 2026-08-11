import React, { useEffect, useRef } from 'react';

// Simple animate-on-scroll wrapper
export function AnimateSection({ children, className = '', delay = 0, variant = 'fadeUp' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('visible'), delay * 1000);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

// Stagger parent — triggers children with delay
export function StaggerContainer({ children, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('.stagger-item').forEach((child, i) => {
            setTimeout(() => child.classList.add('visible'), i * 100);
          });
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function StaggerItem({ children, className = '' }) {
  return (
    <div className={`stagger-item reveal ${className}`}>
      {children}
    </div>
  );
}

export default AnimateSection;
