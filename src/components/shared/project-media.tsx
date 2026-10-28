import { PROJECT_PLACEHOLDER_BLOCKS } from '../../constants/project-visuals';
import type { ProjectMedia as ProjectMediaContent } from '../../types/project';

interface ProjectMediaProps {
  media: ProjectMediaContent;
  eager?: boolean;
}

export function ProjectMedia({ media, eager = false }: ProjectMediaProps) {
  if (media.kind === 'image') {
    return <img className="block h-full w-full object-cover" src={media.src} alt={media.alt} width="1200" height="900" loading={eager ? 'eager' : 'lazy'} />;
  }

  if (media.preset === 'pending') {
    return <div className="flex h-full w-full items-center justify-center p-4 text-center text-xs leading-6 text-[#454e4a]"><span>Site photo pending</span></div>;
  }

  return <>{PROJECT_PLACEHOLDER_BLOCKS[media.preset].map((style, index) => (
    <div key={index} className="absolute bg-[#1f2d28] opacity-90" style={style} aria-hidden="true" />
  ))}</>;
}
