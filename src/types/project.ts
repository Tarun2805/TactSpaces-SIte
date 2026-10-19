export type ProjectCategory = 'commercial' | 'residential' | 'hospitality';

export type ProjectPlaceholder = 'studio' | 'residence' | 'hotel' | 'vimal' | 'manjunath' | 'arun' | 'manikantan' | 'office' | 'hero' | 'raw-commercial' | 'raw-residential' | 'structure' | 'finishes-commercial' | 'finishes-residential' | 'handover' | 'pending';

export interface ProjectImage {
  kind: 'image';
  src: string;
  alt: string;
}

export type ProjectMedia = ProjectImage | { kind: 'placeholder'; preset: ProjectPlaceholder };

export type ProjectSection =
  | { type: 'hero'; media: ProjectMedia; callouts?: { top: string; left: string; text: string }[] }
  | { type: 'timeline'; stages: { label: string; title: string; description: string; media: ProjectMedia }[] }
  | { type: 'testimonial'; quote: string; author: string }
  | { type: 'comparison'; before?: ProjectImage; after?: ProjectImage };

export interface Project {
  slug: string;
  order: number;
  name: string;
  category: ProjectCategory;
  location: string;
  duration: string;
  scope: string;
  area: string;
  cover: ProjectMedia;
  featured?: boolean;
  status?: string;
  legacyAnchor?: string;
  details?: {
    summary: string;
    stats: { value: string; label: string }[];
    sections?: ProjectSection[];
  };
}
