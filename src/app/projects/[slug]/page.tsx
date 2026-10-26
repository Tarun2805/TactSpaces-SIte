import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PROJECTS } from '../../../constants/projects';
import { PageFrame } from '../../site-shell';
import ProjectView from '../project-view';

interface ProjectRouteProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PROJECTS.filter((project) => project.details).map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: ProjectRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((item) => item.slug === slug && item.details);
  if (!project?.details) return {};
  const url = `/projects/${project.slug}/`;
  const title = `${project.name} | TactSpaces`;
  return {
    title,
    description: project.details.summary,
    alternates: { canonical: url },
    openGraph: { type: 'article', title, description: project.details.summary, url },
  };
}

export default async function ProjectRoute({ params }: ProjectRouteProps) {
  const { slug } = await params;
  const project = PROJECTS.find((item) => item.slug === slug && item.details);
  if (!project?.details) notFound();
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.details.summary,
    url: `https://tactspaces.in/projects/${project.slug}/`,
    creator: { '@id': 'https://tactspaces.in/#organization' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <PageFrame page="anatomy"><ProjectView project={project} /></PageFrame>
    </>
  );
}
