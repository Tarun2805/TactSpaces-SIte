import type { Project, ProjectCategory } from '../types/project';

export const PROJECT_CATEGORIES: Record<ProjectCategory, string> = {
  commercial: 'Commercial & Workspaces',
  residential: 'Premium Residential',
  hospitality: 'Boutique Hospitality',
};

export const PROJECTS = Object.values(import.meta.glob<Project>('../content/projects/*.json', {
  eager: true,
  import: 'default',
})).sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
