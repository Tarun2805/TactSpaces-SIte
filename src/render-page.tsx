import { StrictMode, type ComponentType } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Agentation } from 'agentation';
import { SiteLayout } from './components/shared/site-layout';
import { initializeGoogleAnalytics } from './lib/google-analytics';
import type { PageName } from './types/site';

export function renderPage(Page: ComponentType, page: PageName, options: { hydrate?: boolean } = {}) {
  const container = document.getElementById('root');
  if (!container) throw new Error('The application root is missing.');

  const content = (
    <StrictMode>
      <SiteLayout page={page}>
        <Page />
      </SiteLayout>
      {import.meta.env.DEV && <Agentation />}
    </StrictMode>
  );
  if (options.hydrate) hydrateRoot(container, content);
  else createRoot(container).render(content);
  initializeGoogleAnalytics();
}
