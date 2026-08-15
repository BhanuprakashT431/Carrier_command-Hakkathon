import { useEffect, useRef } from 'react';

/**
 * Hook to trigger reveal animations when elements scroll into view.
 * 
 * Usage:
 * const revealRef = useScrollReveal();
 * <div ref={revealRef} className="reveal-hidden">...</div>
 * 
 * @param {Object} options - IntersectionObserver options
 * @returns {React.RefObject} - Ref to attach to the target element
 */
export function useScrollReveal(options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      element.classList.remove('reveal-hidden');
      element.classList.add('reveal-visible');
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.classList.remove('reveal-hidden');
        element.classList.add('reveal-visible');
        observer.unobserve(element);
      }
    }, options);

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [options.threshold, options.rootMargin]);

  return ref;
}
