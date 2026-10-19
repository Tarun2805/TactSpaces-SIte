import { renderToString } from 'react-dom/server';
import { StrictMode } from 'react';
import { SiteLayout } from '../../components/shared/site-layout';
import type { Project } from '../../types/project';
import ProjectPage from './page';

export function renderProject(project: Project) {
  return renderToString(
    <StrictMode>
      <SiteLayout page="anatomy" siteRoot="/">
        <ProjectPage project={project} />
      </SiteLayout>
    </StrictMode>,
  );
}
