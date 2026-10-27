import type { ReactNode } from 'react';
import type { Project } from '../../types/project';
import { getProjectHref } from '../../utils/project';
import { ProjectMedia } from './project-media';

interface ProjectCardFrameProps {
  project: Project;
  hidden?: boolean;
  className: string;
  children: ReactNode;
}

function ProjectCardFrame({ project, hidden = false, className, children }: ProjectCardFrameProps) {
  const href = getProjectHref(project);

  return (
    href
      ? <a className={className} href={href} data-cat={project.category} style={hidden ? { display: 'none' } : undefined}>{children}</a>
      : <article className={className} data-cat={project.category} style={hidden ? { display: 'none' } : undefined}>{children}</article>
  );
}

interface ProjectCardProps {
  project: Project;
  hidden?: boolean;
}

function ProjectCardContent({ project, media, mediaClass, metaClass }: {
  project: Project;
  media: ReactNode;
  mediaClass: string;
  metaClass: string;
}) {
  return (
    <>
      <div className={mediaClass}>{media}</div>
      <div className={metaClass}>
        <span>{project.location}</span>
        <span>{project.status ? <span className="status-badge">{project.status}</span> : project.duration.replaceAll(' ', '\u00a0')}</span>
      </div>
      <h3>{project.name}</h3>
      <span className="stat">{project.area.replaceAll(' ', '\u00a0')} · {project.scope}</span>
    </>
  );
}

export function PortfolioProjectCard({ project, hidden }: ProjectCardProps) {
  return <ProjectCardFrame project={project} hidden={hidden} className="case-card">
    <ProjectCardContent project={project} media={<ProjectMedia media={project.cover} />} mediaClass="thumb" metaClass="meta-row" />
  </ProjectCardFrame>;
}

export function HomeProjectCard({ project }: ProjectCardProps) {
  return <ProjectCardFrame project={project} className="work-card">
    <ProjectCardContent project={project} media={<div className="blocks"><ProjectMedia media={project.cover} /></div>} mediaClass="work-image" metaClass="work-meta" />
  </ProjectCardFrame>;
}
