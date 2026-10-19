import { PROJECT_CATEGORIES } from '../../constants/projects';
import { ProjectMedia } from '../../components/shared/project-media';
import type { Project, ProjectSection } from '../../types/project';
import { BeforeAfterSlider } from './components/before-after-slider';
import { HorizontalTimeline } from './components/horizontal-timeline';
import { MaterialCallout } from './components/material-callout';

interface ProjectSectionContentProps {
  section: ProjectSection;
  projectName: string;
  id: string;
}

function ProjectSectionContent({ section, projectName, id }: ProjectSectionContentProps) {
  switch (section.type) {
    case 'hero':
      return (
        <div className="dd-hero reveal">
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
            <div className="h-panel" key={index}>
              <div className={stage.media.kind === 'placeholder' && stage.media.preset === 'pending' ? 'frame-placeholder' : 'frame'}>
                <ProjectMedia media={stage.media} />
              </div>
              <span className="day">{stage.label}</span>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
            </div>
          ))}
        </HorizontalTimeline>
      );
    case 'testimonial':
      return <blockquote className="pull reveal">"{section.quote}"<cite>{section.author}</cite></blockquote>;
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
    <article className="project-page deep-dive">
      <div className="deep-dive-head reveal">
        <a className="project-back" href="/anatomy.html">← All projects</a>
        <p className="eyebrow">{PROJECT_CATEGORIES[project.category]}</p>
        <h1>{project.name}</h1>
        <p className="project-location">{project.location} · {project.scope}</p>
      </div>
      <div className="deep-dive-stats reveal">
        {project.details.stats.map((stat, index) => (
          <div key={index}><span className="num">{stat.value}</span><span className="lbl">{stat.label}</span></div>
        ))}
      </div>
      <p className="mandate-copy reveal">{project.details.summary}</p>
      {project.details.sections?.map((section, index) => (
        <ProjectSectionContent key={index} section={section} projectName={project.name} id={`${project.slug}-${index}`} />
      ))}
    </article>
  );
}
