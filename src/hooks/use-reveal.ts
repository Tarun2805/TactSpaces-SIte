import { useEffect, type RefObject } from 'react';

export function useReveal(rootRef: RefObject<HTMLElement | null>, threshold: number) {
  useEffect(() => {
    const elements = rootRef.current?.querySelectorAll('.reveal');
    if (!elements) return;
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('in'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [rootRef, threshold]);
}
