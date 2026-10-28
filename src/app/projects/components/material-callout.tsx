import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { CALLOUT_DISMISS_DELAY_MS } from '../../../constants/site-navigation';

interface MaterialCalloutProps {
  top: string;
  left: string;
  children: string;
}

export function MaterialCallout({ top, left, children }: MaterialCalloutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tipRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const [position, setPosition] = useState<CSSProperties>({ left: '18px', top: '-8px' });

  useLayoutEffect(() => {
    if (!isOpen) return;
    const tip = tipRef.current;
    const hero = tip?.closest('.dd-hero');
    if (!tip || !hero) return;
    const bounds = hero.getBoundingClientRect();
    const rect = tip.getBoundingClientRect();
    setPosition({
      ...(rect.right > bounds.right - 12 ? { right: '18px' } : { left: '18px' }),
      top: rect.top < bounds.top + 8 ? '20px' : '-8px',
    });
  }, [isOpen]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);
  const show = () => {
    if (isOpen) return;
    setPosition({ left: '18px', top: '-8px' });
    setIsOpen(true);
  };

  return (
    <div className="callout-pin absolute h-3 w-3 cursor-pointer rounded-full bg-[var(--alabaster)] shadow-[0_0_0_4px_rgba(31,45,40,0.35)] max-[640px]:before:absolute max-[640px]:before:inset-[-16px] max-[640px]:before:rounded-full" style={{ top, left }} role="button" tabIndex={0}
      aria-label={children} aria-expanded={isOpen}
      onMouseEnter={show} onMouseLeave={() => setIsOpen(false)} onFocus={show} onBlur={() => setIsOpen(false)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setIsOpen(false);
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (isOpen) setIsOpen(false); else show();
        }
      }}
      onTouchStart={(event) => {
        event.preventDefault();
        window.clearTimeout(timerRef.current);
        show();
        timerRef.current = window.setTimeout(() => setIsOpen(false), CALLOUT_DISMISS_DELAY_MS);
      }}>
      <span ref={tipRef} className={`callout-tip absolute z-[5] w-max max-w-[220px] pointer-events-none rounded-[1px] bg-[var(--forest)] px-3 py-2 text-[0.72rem] text-[var(--alabaster)] opacity-0 translate-y-1 transition-[opacity,transform] duration-[250ms]${isOpen ? ' show opacity-100 translate-y-0' : ''}`} style={position}>{children}</span>
    </div>
  );
}
