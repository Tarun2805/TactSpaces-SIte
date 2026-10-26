import type { MetadataRoute } from 'next';
import { PROJECTS } from '../constants/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/anatomy', '/standard', '/studio', '/command-center'];
  return [
    ...routes.map((path) => ({ url: `https://tactspaces.in${path}`, changeFrequency: 'monthly' as const })),
    ...PROJECTS.filter((project) => project.details).map((project) => ({ url: `https://tactspaces.in/projects/${project.slug}/`, changeFrequency: 'yearly' as const })),
  ];
}
