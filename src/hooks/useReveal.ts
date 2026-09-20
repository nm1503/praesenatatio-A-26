import { useEffect, useRef } from 'react';

/**
 * Custom hook: adds a reveal class 'visible' to elements
 * with className 'reveal', 'reveal-left', or 'stagger'
 * when they enter the viewport.
 */
export function useReveal() {
  const triggered = useRef(new Set<Element>());

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal, .reveal-left, .stagger');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !triggered.current.has(entry.target)) {
            triggered.current.add(entry.target);
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  });
}
