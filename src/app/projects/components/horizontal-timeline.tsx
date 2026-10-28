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
    <div ref={wrapRef} className="h-timeline-wrap relative mt-16 max-[640px]:mt-10 max-[640px]:!h-[240vh]" style={{ height: `${Math.max(1, Children.count(children)) * 100}vh` }}>
      <div ref={stickyRef} className="h-timeline-sticky sticky top-0 flex h-screen items-center overflow-hidden max-[640px]:h-svh">
        <div ref={trackRef} className="h-timeline-track flex will-change-transform" id={trackId}>{children}</div>
      </div>
      <div className="h-progress absolute bottom-10 left-[5vw] right-[5vw] z-[2] h-0.5 bg-[var(--line)] max-[640px]:bottom-7 max-[640px]:left-5 max-[640px]:right-5"><div ref={fillRef} className="h-progress-fill h-full w-0 bg-[var(--forest)]" id={fillId} /></div>
    </div>
  );
}
