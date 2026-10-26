import type { PageName } from '../types/site';

export const SITE_NAVIGATION: { page: PageName; href: string; label: string }[] = [
  { page: 'home', href: '/', label: 'Home' },
  { page: 'anatomy', href: '/anatomy', label: 'Anatomy of Execution' },
  { page: 'standard', href: '/standard', label: 'The Standard' },
  { page: 'command-center', href: '/command-center', label: 'Command Center' },
  { page: 'studio', href: '/studio', label: 'Studio' },
];

export const DESKTOP_MENU_QUERY = '(min-width:901px)';
export const MOBILE_PLANNER_QUERY = '(max-width:640px)';
export const HERO_REVEAL_DELAY_MS = 400;
export const CALLOUT_DISMISS_DELAY_MS = 2200;
