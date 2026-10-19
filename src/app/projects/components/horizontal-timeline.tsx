import { Children, useRef, type ReactNode } from 'react';
import { useScrollUpdate } from '../../../hooks/use-scroll-update';

interface HorizontalTimelineProps {
  children: ReactNode;
  trackId: string;
  fillId: string;
}

export function HorizontalTimeline({ children, trackId, fillId }: HorizontalTimelineProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useScrollUpdate(() => {
    const wrap = wrapRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!wrap || !sticky || !track || !fill) return;

    const total = Math.max(1, wrap.offsetHeight - sticky.offsetHeight);
    const progress = Math.max(0, Math.min(1, -wrap.getBoundingClientRect().top / total));
    const distance = Math.max(0, track.scrollWidth - sticky.clientWidth);
    track.style.transform = `translateX(-${progress * distance}px)`;
    fill.style.width = `${progress * 100}%`;
  });

  return (
    <div ref={wrapRef} className="h-timeline-wrap" style={{ height: `${Math.max(1, Children.count(children)) * 100}vh` }}>
      <div ref={stickyRef} className="h-timeline-sticky">
        <div ref={trackRef} className="h-timeline-track" id={trackId}>{children}</div>
      </div>
      <div className="h-progress"><div ref={fillRef} className="h-progress-fill" id={fillId} /></div>
    </div>
  );
}
