import { PROJECTS } from '../../constants/projects';
import { renderPage } from '../../render-page';
import ProjectPage from './page';
import '../../styles/tailwind.css';
import '../anatomy/anatomy.css';
import './projects.css';

function CurrentProjectPage() {
  const project = PROJECTS.find((item) => item.slug === document.documentElement.dataset.projectSlug && item.details);
  if (!project) throw new Error('The project content is missing.');
  return <ProjectPage project={project} />;
}

renderPage(CurrentProjectPage, 'anatomy', { hydrate: true, siteRoot: '/' });
