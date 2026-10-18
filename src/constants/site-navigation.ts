import type { PageName } from '../types/site';

export const SITE_NAVIGATION: { page: PageName; href: string; label: string }[] = [
  { page: 'home', href: 'index.html', label: 'Home' },
  { page: 'anatomy', href: 'anatomy.html', label: 'Anatomy of Execution' },
  { page: 'standard', href: 'standard.html', label: 'The Standard' },
  { page: 'command-center', href: 'command-center.html', label: 'Command Center' },
  { page: 'studio', href: 'studio.html', label: 'Studio' },
];

export const DESKTOP_MENU_QUERY = '(min-width:901px)';
export const MOBILE_PLANNER_QUERY = '(max-width:640px)';
export const HERO_REVEAL_DELAY_MS = 400;
export const CALLOUT_DISMISS_DELAY_MS = 2200;
