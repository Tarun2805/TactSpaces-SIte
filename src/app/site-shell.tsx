'use client';

import type { ReactNode } from 'react';
import { SiteLayout } from '../components/shared/site-layout';
import { initializeGoogleAnalytics } from '../lib/google-analytics';
import { useEffect } from 'react';

export function SiteShell({ children }: { children: ReactNode }) {
  useEffect(() => initializeGoogleAnalytics(), []);
  return <>{children}</>;
}

export function PageFrame({ page, children }: { page: 'home' | 'anatomy' | 'standard' | 'studio' | 'command-center'; children: ReactNode }) {
  return <SiteLayout page={page}>{children}</SiteLayout>;
}
