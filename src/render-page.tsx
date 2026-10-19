import { StrictMode, type ComponentType } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { SiteLayout } from './components/shared/site-layout';
import type { PageName } from './types/site';

export function renderPage(Page: ComponentType, page: PageName, options: { hydrate?: boolean; siteRoot?: string } = {}) {
  const container = document.getElementById('root');
  if (!container) throw new Error('The application root is missing.');

  const content = (
    <StrictMode>
      <SiteLayout page={page} siteRoot={options.siteRoot}>
        <Page />
      </SiteLayout>
    </StrictMode>
  );
  if (options.hydrate) hydrateRoot(container, content);
  else createRoot(container).render(content);
}
