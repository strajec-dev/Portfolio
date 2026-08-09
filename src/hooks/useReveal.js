import { useEffect } from 'react';

/**
 * useReveal - Reusable IntersectionObserver hook for animating children elements when in view.
 * 
 * @param {React.RefObject} ref - The container ref to observe
 * @param {Object} options
 * @param {number} [options.threshold=0.08] - IntersectionObserver threshold
 * @param {number} [options.staggerDelay=160] - Milliseconds to delay each sequential reveal item
 * @param {string} [options.selector='.reveal'] - CSS Selector for target elements to animate
 */
export function useReveal(ref, { threshold = 0.08, staggerDelay = 160, selector = '.reveal' } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targets = entry.target.querySelectorAll(selector);
            targets.forEach((target, i) => {
              setTimeout(() => {
                target.classList.add('visible');
              }, i * staggerDelay);
            });
            // Stop observing once animated
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold, staggerDelay, selector]);
}

export default useReveal;
