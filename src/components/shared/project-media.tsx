import { PROJECT_PLACEHOLDER_BLOCKS } from '../../constants/project-visuals';
import type { ProjectMedia as ProjectMediaContent } from '../../types/project';

interface ProjectMediaProps {
  media: ProjectMediaContent;
  eager?: boolean;
}

export function ProjectMedia({ media, eager = false }: ProjectMediaProps) {
  if (media.kind === 'image') {
    return <img className="project-image" src={media.src} alt={media.alt} width="1200" height="900" loading={eager ? 'eager' : 'lazy'} />;
  }

  if (media.preset === 'pending') {
    return <div className="project-media-pending"><span>Site photo pending</span></div>;
  }

  return <>{PROJECT_PLACEHOLDER_BLOCKS[media.preset].map((style, index) => (
    <div key={index} className="blk" style={style} aria-hidden="true" />
  ))}</>;
}
