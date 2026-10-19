import type { Project } from '../../types/project';
import { getProjectHref } from '../../utils/project';
import { ProjectMedia } from './project-media';

interface ProjectCardProps {
  project: Project;
  variant?: 'portfolio' | 'home';
  hidden?: boolean;
}

export function ProjectCard({ project, variant = 'portfolio', hidden = false }: ProjectCardProps) {
  const href = getProjectHref(project);
  const Tag = href ? 'a' : 'article';
  const isPortfolio = variant === 'portfolio';

  return (
    <Tag className={isPortfolio ? 'case-card' : 'work-card'} href={href}
      data-cat={project.category} style={hidden ? { display: 'none' } : undefined}>
      <div className={isPortfolio ? 'thumb' : 'work-image'}>
        {isPortfolio ? <ProjectMedia media={project.cover} /> : (
          <div className="blocks"><ProjectMedia media={project.cover} /></div>
        )}
      </div>
      <div className={isPortfolio ? 'meta-row' : 'work-meta'}>
        <span>{project.location}</span>
        <span>{project.status ? <span className="status-badge">{project.status}</span> : project.duration.replaceAll(' ', '\u00a0')}</span>
      </div>
      <h3>{project.name}</h3>
      <span className="stat">{project.area.replaceAll(' ', '\u00a0')} · {project.scope}</span>
    </Tag>
  );
}
