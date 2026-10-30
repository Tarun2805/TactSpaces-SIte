'use client';

import { ProjectMedia } from '../../components/shared/project-media';
import type { Project, ProjectSection } from '../../types/project';
import { BeforeAfterSlider } from './components/before-after-slider';
import { HorizontalTimeline } from './components/horizontal-timeline';
import { MaterialCallout } from './components/material-callout';
import { ArrowIcon } from '../../components/shared/arrow-icon';

interface ProjectSectionContentProps {
  section: ProjectSection;
  projectName: string;
  id: string;
}

function ProjectSectionContent({ section, projectName, id }: ProjectSectionContentProps) {
  switch (section.type) {
    case 'hero':
      return (
        <div className="dd-hero reveal relative mx-[5vw] mt-12 aspect-[21/9] overflow-hidden bg-[linear-gradient(160deg,#E7E4DA,#D7D2C4)] max-[640px]:mx-5 max-[640px]:mt-8 max-[640px]:aspect-[4/3]">
          <ProjectMedia media={section.media} eager />
          {section.callouts?.map((callout, index) => (
            <MaterialCallout key={index} top={callout.top} left={callout.left}>{callout.text}</MaterialCallout>
          ))}
        </div>
      );
    case 'timeline':
      return (
        <HorizontalTimeline trackId={`${id}-track`} fillId={`${id}-fill`}>
          {section.stages.map((stage, index) => (
            <div className="h-panel flex w-[78vw] max-w-[820px] flex-shrink-0 flex-col justify-center px-[4vw] max-[640px]:w-[86vw] max-[640px]:max-w-none max-[640px]:px-5" key={index}>
              <div className={`${stage.media.kind === 'placeholder' && stage.media.preset === 'pending' ? 'frame-placeholder flex flex-col items-center justify-center gap-[0.6rem] border border-dashed border-[var(--line)] bg-[var(--alabaster-deep)]' : 'frame relative overflow-hidden bg-[linear-gradient(160deg,#E7E4DA,#D7D2C4)]'} mb-[1.6rem] aspect-[4/3]`}>
                <ProjectMedia media={stage.media} />
              </div>
              <span className="day mb-[0.6rem] text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[var(--accent)]">{stage.label}</span>
              <h3 className="mb-[0.6rem] text-[1.6rem] max-[640px]:text-[1.35rem]">{stage.title}</h3>
              <p className="max-w-[440px] leading-[1.6] text-[#4B534F] max-[640px]:text-[0.95rem]">{stage.description}</p>
            </div>
          ))}
        </HorizontalTimeline>
      );
    case 'testimonial':
      return <blockquote className="pull reveal mx-[5vw] mt-12 max-w-[640px] border-l-2 border-[var(--accent)] pl-6 font-display text-2xl italic leading-[1.5] text-[var(--forest)] max-[640px]:mx-5 max-[640px]:mt-8 max-[640px]:pl-[1.1rem] max-[640px]:text-[1.2rem]">“{section.quote}”<cite className="mt-[0.9rem] block text-[0.82rem] not-italic text-[#6B726D]">{section.author}</cite></blockquote>;
    case 'comparison':
      return <BeforeAfterSlider id={id} project={projectName} before={section.before} after={section.after} />;
  }
}

interface ProjectPageProps {
  project: Project;
}

export default function ProjectPage({ project }: ProjectPageProps) {
  if (!project.details) return null;

  return (
    <article className="project-page deep-dive border-t-0 px-0 pt-36 pb-24 max-[640px]:pt-[calc(var(--nav-h)+2.25rem)] max-[640px]:pb-10">
      <div className="deep-dive-head reveal mb-12 max-w-[900px] px-[5vw] max-[640px]:mb-7 max-[640px]:px-5">
        <a className="project-back mb-8 inline-flex min-h-11 items-center gap-2 text-[0.85rem] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--forest)] focus-visible:outline-offset-4" href="/anatomy"><ArrowIcon direction="left" />All projects</a>
        <h1 className="mt-4 break-words text-[clamp(2rem,3.5vw,3.2rem)] max-[640px]:text-[clamp(1.8rem,8vw,2.2rem)]">{project.name}</h1>
        <p className="mt-[1.2rem] text-[0.9rem] leading-[1.6] text-[#454E4A]">{project.location} · {project.scope}</p>
      </div>
      <div className="deep-dive-stats reveal mt-8 mb-4 flex flex-wrap gap-10 px-[5vw] max-[640px]:grid max-[640px]:grid-cols-[repeat(auto-fit,minmax(100px,1fr))] max-[640px]:gap-x-4 max-[640px]:gap-y-5 max-[640px]:px-5">
        {project.details.stats.map((stat, index) => (
          <div className="border-l-2 border-[var(--forest)] pl-[0.9rem] first:border-l-0 first:pl-0" key={index}><span className="num block text-[1.8rem] max-[640px]:text-[1.55rem]">{stat.value}</span><span className="lbl text-[0.72rem] uppercase tracking-[0.08em] text-[#6B726D] max-[640px]:block max-[640px]:text-[0.64rem]">{stat.label}</span></div>
        ))}
      </div>
      <p className="mandate-copy reveal mt-6 max-w-[760px] px-[5vw] text-base leading-[1.7] text-[#3A413D] max-[640px]:px-5 max-[640px]:text-[0.98rem]">{project.details.summary}</p>
      {project.details.sections?.map((section, index) => (
        <ProjectSectionContent key={index} section={section} projectName={project.name} id={`${project.slug}-${index}`} />
      ))}
    </article>
  );
}
