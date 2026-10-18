import { StrictMode, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { SiteLayout } from './components/shared/site-layout';
import type { PageName } from './types/site';

export function renderPage(Page: ComponentType, page: PageName) {
  const container = document.getElementById('root');
  if (!container) throw new Error('The application root is missing.');

  createRoot(container).render(
    <StrictMode>
      <SiteLayout page={page}>
        <Page />
      </SiteLayout>
    </StrictMode>,
  );
}
