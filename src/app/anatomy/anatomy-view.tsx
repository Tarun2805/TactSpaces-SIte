'use client';

import { useCallback, useEffect, useState } from 'react';
import { PortfolioProjectCard } from '../../components/shared/project-card';
import { PROJECT_CATEGORIES, PROJECTS } from '../../constants/projects';
import { getProjectHref } from '../../utils/project';

export default function AnatomyPage() {
  const [category, setCategory] = useState('all');
  const changeCategory = useCallback((value: string) => {
    setCategory(value);
    const url = new URL(window.location.href);
    if (value === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', value);
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }, []);

  useEffect(() => {
    const validCategories = new Set(['all', ...Object.keys(PROJECT_CATEGORIES)]);
    const syncCategory = () => {
      const requested = new URLSearchParams(window.location.search).get('category') ?? 'all';
      setCategory(validCategories.has(requested) ? requested : 'all');
    };
    syncCategory();
    window.addEventListener('popstate', syncCategory);
    const project = PROJECTS.find((item) => item.legacyAnchor === window.location.hash.slice(1));
    const href = project && getProjectHref(project);
    if (href) window.location.replace(href);
    return () => window.removeEventListener('popstate', syncCategory);
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
            aria-pressed={category === 'all'} onClick={() => changeCategory('all')}>All</button>
          {Object.entries(PROJECT_CATEGORIES).map(([value, label]) => (
            <button key={value} className={`filter-pill${category === value ? ' active' : ''}`} data-f={value}
              aria-pressed={category === value} onClick={() => changeCategory(value)}>{label}</button>
          ))}
        </div>
        <section style={{ padding: '4rem 0 2rem' }}>
          <div className="case-grid reveal" id="caseGrid">
            {PROJECTS.map((project) => (
              <PortfolioProjectCard key={project.slug} project={project} hidden={category !== 'all' && category !== project.category} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
