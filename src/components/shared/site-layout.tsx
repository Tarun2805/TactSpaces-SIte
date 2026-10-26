import { useEffect, useRef, type ReactNode } from 'react';
import { useReveal } from '../../hooks/use-reveal';
import type { PageName } from '../../types/site';
import { SiteFooter } from './site-footer';
import { SiteNavigation } from './site-navigation';

interface SiteLayoutProps {
  page: PageName;
  children: ReactNode;
}

export function SiteLayout({ page, children }: SiteLayoutProps) {
  const contentRef = useRef<HTMLElement>(null);
  useReveal(contentRef, page === 'home' ? 0.15 : 0.12);

  useEffect(() => {
    // React mounts after the browser's initial fragment lookup.
    let id = window.location.hash.slice(1);
    try { id = decodeURIComponent(id); } catch { /* A malformed fragment must not prevent rendering. */ }
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <>
      <SiteNavigation page={page} />
      <main ref={contentRef}>{children}</main>
      <SiteFooter />
    </>
  );
}
