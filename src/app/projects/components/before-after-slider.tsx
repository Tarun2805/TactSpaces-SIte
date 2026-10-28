import { useState } from 'react';
import type { ProjectImage } from '../../../types/project';

interface BeforeAfterSliderProps {
  id: string;
  project: string;
  before?: ProjectImage;
  after?: ProjectImage;
}

export function BeforeAfterSlider({ id, project, before, after }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const percentage = `${position}%`;

  return (
    <div className="ba-slider reveal relative mx-[5vw] mt-12 aspect-[4/3] cursor-ew-resize select-none overflow-hidden focus-within:outline-2 focus-within:outline-[var(--forest)] focus-within:outline-offset-4 max-[640px]:mx-5 max-[640px]:mt-8 max-[640px]:touch-pan-y" id={id}>
      <div className="ba-after absolute inset-0 size-full bg-[linear-gradient(135deg,#2a3a34_0%,var(--forest)_55%,var(--accent)_100%)]">{after ? <img className="block h-full w-full object-cover" src={after.src} alt={after.alt} width="1200" height="900" loading="lazy" /> : null}</div>
      <div className="ba-before-wrap absolute inset-0 w-1/2 overflow-hidden" style={{ width: '100%', clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <div className="ba-before absolute inset-0 bg-[repeating-linear-gradient(45deg,#d7d2c4,#d7d2c4_12px,#c9c4b4_12px,#c9c4b4_24px)]">{before ? <img className="block h-full w-full object-cover" src={before.src} alt={before.alt} width="1200" height="900" loading="lazy" /> : null}</div>
      </div>
      <div className="ba-divider pointer-events-none absolute top-0 bottom-0 z-[3] w-0.5 -translate-x-1/2 bg-[var(--alabaster)]" style={{ left: percentage }} />
      <div className="ba-handle pointer-events-none absolute top-1/2 z-[4] flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--alabaster)] text-[.9rem] shadow-[0_4px_16px_rgba(0,0,0,.25)]" style={{ left: percentage }}>⇔</div>
      <span className="ba-tag before-tag absolute bottom-4 left-4 z-[3] bg-[rgba(31,45,40,.75)] px-3 py-[.4rem] text-[.7rem] uppercase tracking-[.1em] text-[var(--alabaster)]">Before</span>
      <span className="ba-tag after-tag absolute right-4 bottom-4 z-[3] bg-[rgba(31,45,40,.75)] px-3 py-[.4rem] text-[.7rem] uppercase tracking-[.1em] text-[var(--alabaster)]">After</span>
      <input type="range" className="ba-range absolute inset-0 z-[5] m-0 h-full w-full cursor-ew-resize opacity-0 max-[640px]:touch-pan-y" min="0" max="100" value={position}
        aria-label={`${project} before and after comparison`}
        onChange={(event) => setPosition(Number(event.target.value))} />
    </div>
  );
}
