import type { CSSProperties } from 'react';
import type { ProjectPlaceholder } from '../types/project.ts';

export const PROJECT_PLACEHOLDER_BLOCKS: Record<Exclude<ProjectPlaceholder, 'pending'>, CSSProperties[]> = {
  studio: [
    { left: '0', top: '0', width: '60%', height: '65%' },
    { left: '64%', top: '10%', width: '32%', height: '40%', background: 'var(--accent)' },
  ],
  residence: [
    { left: '10%', top: '15%', width: '35%', height: '70%' },
    { left: '52%', top: '30%', width: '38%', height: '26%', background: 'var(--accent)' },
  ],
  hotel: [
    { left: '0', top: '20%', width: '55%', height: '55%' },
    { left: '60%', top: '0', width: '35%', height: '45%', background: 'var(--accent)' },
  ],
  vimal: [
    { left: '15%', top: '8%', width: '34%', height: '80%' },
    { left: '56%', top: '22%', width: '34%', height: '56%', background: 'var(--accent)' },
  ],
  manjunath: [
    { left: '0', top: '10%', width: '50%', height: '80%' },
    { left: '56%', top: '0', width: '40%', height: '38%', background: 'var(--accent)' },
  ],
  arun: [
    { left: '8%', top: '20%', width: '38%', height: '60%' },
    { left: '52%', top: '5%', width: '40%', height: '50%', background: 'var(--accent)' },
  ],
  manikantan: [
    { left: '0', top: '0', width: '55%', height: '70%' },
    { left: '60%', top: '30%', width: '36%', height: '50%', background: 'var(--accent)' },
  ],
  office: [{ left: '20%', top: '15%', width: '60%', height: '65%' }],
  hero: [
    { left: '0', top: '0', width: '58%', height: '100%' },
    { left: '60%', top: '8%', width: '38%', height: '40%', background: 'var(--accent)' },
    { left: '60%', top: '52%', width: '38%', height: '40%', opacity: '0.55' },
  ],
  'raw-commercial': [{ left: '0', top: '0', width: '100%', height: '100%', opacity: '0.35' }],
  'raw-residential': [{ left: '0', top: '0', width: '100%', height: '100%', opacity: '0.3' }],
  structure: [{ left: '0', top: '30%', width: '100%', height: '70%', opacity: '0.6' }],
  'finishes-commercial': [
    { left: '0', top: '0', width: '60%', height: '100%' },
    { left: '64%', top: '20%', width: '32%', height: '60%', background: 'var(--accent)' },
  ],
  'finishes-residential': [
    { left: '0', top: '0', width: '60%', height: '100%' },
    { left: '64%', top: '15%', width: '32%', height: '70%', background: 'var(--accent)' },
  ],
  handover: [{ left: '0', top: '0', width: '100%', height: '100%' }],
};
