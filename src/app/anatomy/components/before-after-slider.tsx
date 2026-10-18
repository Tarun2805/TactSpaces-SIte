import { useState } from 'react';

interface BeforeAfterSliderProps {
  id: string;
  project: string;
}

export function BeforeAfterSlider({ id, project }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const percentage = `${position}%`;

  return (
    <div className="ba-slider reveal" id={id}>
      <div className="ba-after" />
      <div className="ba-before-wrap" style={{ width: percentage }}><div className="ba-before" /></div>
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
