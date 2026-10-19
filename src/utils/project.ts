import type { Project } from '../types/project';

export function getProjectHref(project: Project): string | undefined {
  return project.details ? `/projects/${project.slug}/` : undefined;
}
