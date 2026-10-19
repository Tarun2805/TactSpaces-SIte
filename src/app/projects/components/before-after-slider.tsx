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
    <div className="ba-slider reveal" id={id}>
      <div className="ba-after">{after ? <img className="project-image" src={after.src} alt={after.alt} loading="lazy" /> : null}</div>
      <div className="ba-before-wrap" style={{ width: '100%', clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <div className="ba-before">{before ? <img className="project-image" src={before.src} alt={before.alt} loading="lazy" /> : null}</div>
      </div>
      <div className="ba-divider" style={{ left: percentage }} />
      <div className="ba-handle" style={{ left: percentage }}>⇔</div>
      <span className="ba-tag before-tag">Before</span>
      <span className="ba-tag after-tag">After</span>
      <input type="range" className="ba-range" min="0" max="100" value={position}
        aria-label={`${project} before and after comparison`}
        onChange={(event) => setPosition(Number(event.target.value))} />
    </div>
  );
}
