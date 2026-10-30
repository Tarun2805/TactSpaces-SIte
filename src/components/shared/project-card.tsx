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
      ? <a className={`${className} cursor-pointer`} href={href} data-cat={project.category} style={hidden ? { display: 'none' } : undefined}>{children}</a>
      : <article className={`${className} cursor-default`} data-cat={project.category} style={hidden ? { display: 'none' } : undefined}>{children}</article>
  );
}

interface ProjectCardProps {
  project: Project;
  hidden?: boolean;
}

interface ProjectCardContentProps {
  project: Project;
  media: ReactNode;
  mediaClass: string;
  metaClass: string;
  titleClass: string;
  statClass: string;
}

function ProjectCardContent({ project, media, mediaClass, metaClass, titleClass, statClass }: ProjectCardContentProps) {
  return (
    <>
      <div className={mediaClass}>{media}</div>
      <div className={metaClass}>
        <span>{project.location}</span>
        <span>{project.status ? <span className="inline-block rounded-[10px] bg-[#273939] px-[.6rem] py-1 text-[.68rem] font-bold uppercase tracking-[.06em] text-[#f9f9f7]">{project.status}</span> : project.duration.replaceAll(' ', '\u00a0')}</span>
      </div>
      <h3 className={titleClass}>{project.name}</h3>
      <span className={`stat ${statClass}`}>{project.area.replaceAll(' ', '\u00a0')} · {project.scope}</span>
    </>
  );
}

export function PortfolioProjectCard({ project, hidden }: ProjectCardProps) {
  return <ProjectCardFrame project={project} hidden={hidden} className="case-card bg-[#f9f9f7] p-5 outline outline-1 outline-[#dad7ce] transition-colors duration-[400ms] focus-visible:outline-2 focus-visible:outline-[#1f2d28] focus-visible:outline-offset-[-2px] min-[641px]:p-[2.4rem]">
    <ProjectCardContent project={project} media={<ProjectMedia media={project.cover} />} mediaClass="relative mb-4 aspect-[16/10] overflow-hidden bg-[linear-gradient(160deg,#e7e4da,#d7d2c4)] min-[641px]:mb-[1.4rem]" metaClass="meta-row mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 text-[.8125rem] leading-[1.5] text-[#6b726d] min-[641px]:mb-[.4rem]" titleClass="mb-2 text-xl font-semibold" statClass="mt-2 block text-sm font-semibold text-[#273939] min-[641px]:mt-0" />
  </ProjectCardFrame>;
}

export function HomeProjectCard({ project }: ProjectCardProps) {
  return <ProjectCardFrame project={project} className="work-card block snap-start">
    <ProjectCardContent project={project} media={<div className="absolute inset-0"><ProjectMedia media={project.cover} /></div>} mediaClass="relative mb-[1.1rem] aspect-[4/5] overflow-hidden bg-[linear-gradient(160deg,#e7e4da_0%,#d7d2c4_100%)]" metaClass="work-meta mb-[.3rem] flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 text-[.8125rem] leading-[1.5] text-[#5c645f]" titleClass="mb-[.2rem] text-[1.2rem] font-semibold" statClass="block text-[.8125rem] font-semibold text-[#273939]" />
  </ProjectCardFrame>;
}
