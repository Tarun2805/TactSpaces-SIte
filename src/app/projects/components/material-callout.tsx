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
    <div className="callout-pin" style={{ top, left }} role="button" tabIndex={0}
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
      <span ref={tipRef} className={`callout-tip${isOpen ? ' show' : ''}`} style={position}>{children}</span>
    </div>
  );
}
