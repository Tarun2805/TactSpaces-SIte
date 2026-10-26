import type { Project, ProjectCategory } from '../types/project';
import dHoofers from '../content/projects/d-hoofers.json';
import arunResidence from '../content/projects/arun-residence.json';
import pinakiResidence from '../content/projects/pinaki-residence.json';
import manikantanResidence from '../content/projects/manikantan-residence.json';
import tactspacesStudio from '../content/projects/tactspaces-studio.json';
import manjunathResidence from '../content/projects/manjunath-residence.json';
import hakunaMatata from '../content/projects/hakuna-matata.json';
import vimalResidence from '../content/projects/vimal-residence.json';

export const PROJECT_CATEGORIES: Record<ProjectCategory, string> = {
  commercial: 'Commercial & Workspaces',
  residential: 'Premium Residential',
  hospitality: 'Boutique Hospitality',
};

export const PROJECTS: Project[] = [dHoofers, arunResidence, pinakiResidence, manikantanResidence, tactspacesStudio, manjunathResidence, hakunaMatata, vimalResidence]
  .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug)) as Project[];
