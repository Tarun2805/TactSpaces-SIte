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
      <header className="page-header reveal max-w-[900px] px-[5vw] pt-36 pb-16 max-[640px]:px-5 max-[640px]:pt-[calc(var(--nav-h)+2.25rem)] max-[640px]:pb-8">
        <h1 className="my-[1.2rem] text-[clamp(2.1rem,5vw,4.6rem)] leading-[1.05] tracking-[-0.01em] max-[640px]:my-4 max-[640px]:text-[clamp(2.1rem,9.5vw,2.6rem)]">Evidence of Execution.</h1>
        <p className="max-w-[620px] text-[1.05rem] leading-[1.65] text-[#454E4A] max-[640px]:text-base max-[640px]:leading-[1.6]">A curated selection of completed mandates: proof of spatial maximization, material transparency, and operational control.</p>
      </header>
      <div className="portfolio-index">
        <div className="filter-bar sticky top-[var(--nav-h)] z-30 flex flex-wrap gap-[0.7rem] border-y border-[var(--line)] bg-[var(--alabaster)] px-[5vw] py-[1.1rem] max-[640px]:gap-2 max-[640px]:overflow-x-auto max-[640px]:flex-nowrap max-[640px]:px-5 max-[640px]:py-[0.7rem] max-[640px]:[scrollbar-width:none] max-[640px]:[-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
          <button className={`filter-pill min-h-10 flex-none cursor-pointer whitespace-nowrap rounded-[20px] border border-[var(--line)] bg-[var(--alabaster)] px-[1.1rem] py-2 text-[0.8rem] font-semibold transition-[background,color,border-color] duration-[250ms] hover:not-[.active]:border-[var(--forest)] max-[640px]:py-[0.55rem]${category === 'all' ? ' active bg-[var(--forest)] text-[var(--alabaster)] [border-color:var(--forest)]' : ''}`} data-f="all"
            aria-pressed={category === 'all'} onClick={() => changeCategory('all')}>All</button>
          {Object.entries(PROJECT_CATEGORIES).map(([value, label]) => (
            <button key={value} className={`filter-pill min-h-10 flex-none cursor-pointer whitespace-nowrap rounded-[20px] border border-[var(--line)] bg-[var(--alabaster)] px-[1.1rem] py-2 text-[0.8rem] font-semibold transition-[background,color,border-color] duration-[250ms] hover:not-[.active]:border-[var(--forest)] max-[640px]:py-[0.55rem]${category === value ? ' active bg-[var(--forest)] text-[var(--alabaster)] [border-color:var(--forest)]' : ''}`} data-f={value}
              aria-pressed={category === value} onClick={() => changeCategory(value)}>{label}</button>
          ))}
        </div>
        <section className="py-16 pb-8 max-[640px]:!py-6 max-[640px]:!pb-4">
          <div className="case-grid reveal mx-[5vw] grid w-[calc(100%-10vw)] grid-cols-3 gap-px bg-[var(--alabaster)] p-px max-[1099px]:grid-cols-2 max-[640px]:mx-5 max-[640px]:w-[calc(100%-40px)] max-[640px]:grid-cols-1" id="caseGrid">
            {PROJECTS.map((project) => (
              <PortfolioProjectCard key={project.slug} project={project} hidden={category !== 'all' && category !== project.category} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
