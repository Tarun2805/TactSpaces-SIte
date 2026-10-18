import { useEffect, useEffectEvent } from 'react';

/** Keep scroll-driven visuals out of React state, with at most one update per frame. */
export function useScrollUpdate(update: () => void) {
  const onUpdate = useEffectEvent(update);

  useEffect(() => {
    let frame: number | null = null;
    const schedule = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        onUpdate();
      });
    };
    onUpdate();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);
}
