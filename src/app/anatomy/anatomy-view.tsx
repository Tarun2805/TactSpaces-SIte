'use client';

import { useEffect, useState } from 'react';
import { ProjectCard } from '../../components/shared/project-card';
import { PROJECT_CATEGORIES, PROJECTS } from '../../constants/projects';
import { getProjectHref } from '../../utils/project';

export default function AnatomyPage() {
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const project = PROJECTS.find((item) => item.legacyAnchor === window.location.hash.slice(1));
    const href = project && getProjectHref(project);
    if (href) window.location.replace(href);
  }, []);

  return (
    <>
      <header className="page-header reveal">
        <h1>Evidence of Execution.</h1>
        <p>A curated selection of completed mandates: proof of spatial maximization, material transparency, and operational control.</p>
      </header>
      <div className="portfolio-index">
        <div className="filter-bar">
          <button className={`filter-pill${category === 'all' ? ' active' : ''}`} data-f="all"
            aria-pressed={category === 'all'} onClick={() => setCategory('all')}>All</button>
          {Object.entries(PROJECT_CATEGORIES).map(([value, label]) => (
            <button key={value} className={`filter-pill${category === value ? ' active' : ''}`} data-f={value}
              aria-pressed={category === value} onClick={() => setCategory(value)}>{label}</button>
          ))}
        </div>
        <section style={{ padding: '4rem 0 2rem' }}>
          <div className="case-grid reveal" id="caseGrid">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.slug} project={project} hidden={category !== 'all' && category !== project.category} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
