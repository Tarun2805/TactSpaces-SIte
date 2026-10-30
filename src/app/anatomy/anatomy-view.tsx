'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PortfolioProjectCard } from '../../components/shared/project-card';
import { PROJECTS } from '../../constants/projects';
import { getProjectHref } from '../../utils/project';

const SCOPE_OPTIONS = [{ value: '', label: 'All scopes' }, { value: 'design', label: 'Design' }, { value: 'turnkey-execution', label: 'Turnkey Execution' }];
const TYPE_OPTIONS = [{ value: '', label: 'All types' }, { value: 'residential', label: 'Residential' }, { value: 'commercial', label: 'Commercial' }, { value: 'institutional', label: 'Institutional' }, { value: 'villa', label: 'Villa' }, { value: 'others', label: 'Others' }];

function FilterDropdown({ label, value, options, onChange, open, onToggle }: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  open: boolean;
  onToggle: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) onToggle();
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [open, onToggle]);

  const focusOption = (index: number) => {
    const items = rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]');
    if (!items?.length) return;
    items[Math.max(0, Math.min(index, items.length - 1))].focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ?? []);
    const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === 'Escape') {
      event.preventDefault();
      onToggle();
      triggerRef.current?.focus();
    } else if (event.key === 'ArrowDown' && items.length) {
      event.preventDefault();
      focusOption(currentIndex < 0 ? 0 : currentIndex + 1);
    } else if (event.key === 'ArrowUp' && items.length) {
      event.preventDefault();
      focusOption(currentIndex < 0 ? items.length - 1 : currentIndex - 1);
    } else if (event.key === 'Home' && items.length) {
      event.preventDefault();
      focusOption(0);
    } else if (event.key === 'End' && items.length) {
      event.preventDefault();
      focusOption(items.length - 1);
    }
  };

  return (
    <div ref={rootRef} className="relative" onKeyDown={handleKeyDown}>
      <button ref={triggerRef} type="button" aria-haspopup="listbox" aria-expanded={open} aria-label={`${label}: ${selected.label}`} onKeyDown={(event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          if (!open) onToggle();
          requestAnimationFrame(() => focusOption(event.key === 'ArrowUp' ? options.length - 1 : 0));
        } else if (event.key === 'Escape' && open) {
          event.preventDefault();
          onToggle();
        }
      }} onClick={onToggle}
        className={`filter-pill inline-flex min-h-10 items-center gap-3 rounded-[20px] border px-4 py-2 text-[0.8rem] font-semibold transition-[background,color,border-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest)] ${open || value ? 'border-[var(--forest)] bg-[var(--forest)] text-[var(--alabaster)]' : 'border-[var(--line)] bg-[var(--alabaster)] text-[var(--ink)] hover:border-[var(--forest)]'}`}>
        <span className="text-[0.66rem] uppercase tracking-[0.1em] opacity-70">{label}</span><span>{selected.label}</span>
        <svg aria-hidden="true" className={`ml-0.5 h-3 w-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none"><path d="m2.25 4.5 3.75 3 3.75-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && <div role="listbox" aria-label={label} className="absolute left-0 top-[calc(100%+0.25rem)] z-40 min-w-full overflow-hidden border border-[var(--line)] bg-[var(--alabaster)] py-0 shadow-[0_10px_28px_rgba(31,45,40,0.14)]">
        {options.map((option) => <button key={option.value || 'all'} type="button" role="option" aria-selected={value === option.value} onClick={() => onChange(option.value)} className={`flex w-full appearance-none items-center justify-between gap-6 rounded-none border-0 bg-[var(--alabaster)] px-4 py-2 text-left text-sm shadow-none transition-colors hover:bg-[var(--alabaster-deep)] focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--forest)] ${value === option.value ? 'bg-[var(--alabaster-deep)] font-semibold text-[var(--forest)]' : 'text-[var(--ink)]'}`}>
          {option.label}{value === option.value && <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none"><path d="m3 7 2.5 2.5L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        </button>)}
      </div>}
    </div>
  );
}

export default function AnatomyPage() {
  const [scope, setScope] = useState('');
  const [type, setType] = useState('');
  const [openFilter, setOpenFilter] = useState<'scope' | 'type' | null>(null);
  const updateFilter = useCallback((key: 'scope' | 'type', value: string) => {
    if (key === 'scope') setScope(value);
    else setType(value);
    const url = new URL(window.location.href);
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }, []);

  useEffect(() => {
    const syncCategory = () => {
      const params = new URLSearchParams(window.location.search);
      setScope(['design', 'turnkey-execution'].includes(params.get('scope') ?? '') ? params.get('scope')! : '');
      setType(['residential', 'commercial', 'institutional', 'villa', 'others'].includes(params.get('type') ?? '') ? params.get('type')! : '');
    };
    syncCategory();
    window.addEventListener('popstate', syncCategory);
    const project = PROJECTS.find((item) => item.legacyAnchor === window.location.hash.slice(1));
    const href = project && getProjectHref(project);
    if (href) window.location.replace(href);
    return () => window.removeEventListener('popstate', syncCategory);
  }, []);

  const filteredProjects = useMemo(() => PROJECTS.filter((project) => {
    const matchesScope = !scope || (scope === 'design'
      ? /design/i.test(project.scope)
      : /execution|turnkey|complete/i.test(project.scope));
    const projectType = project.category === 'residential' ? 'residential' : project.category === 'commercial' ? 'commercial' : 'others';
    return matchesScope && (!type || projectType === type);
  }), [scope, type]);

  return (
    <>
      <header className="page-header reveal max-w-[900px] px-[5vw] pt-36 pb-16 max-[640px]:px-5 max-[640px]:pt-[calc(var(--nav-h)+2.25rem)] max-[640px]:pb-8">
        <h1 className="my-[1.2rem] text-[clamp(2.1rem,5vw,4.6rem)] leading-[1.05] tracking-[-0.01em] max-[640px]:my-4 max-[640px]:text-[clamp(2.1rem,9.5vw,2.6rem)]">Evidence of Execution.</h1>
        <p className="max-w-[620px] text-[1.05rem] leading-[1.65] text-[#454E4A] max-[640px]:text-base max-[640px]:leading-[1.6]">A curated selection of completed mandates: proof of spatial maximization, material transparency, and operational control.</p>
      </header>
      <div className="portfolio-index">
        <div className="filter-bar sticky top-[var(--nav-h)] z-30 flex flex-wrap items-center gap-3 border-y border-[var(--line)] bg-[var(--alabaster)] px-[5vw] py-3 max-[640px]:gap-2 max-[640px]:px-5 max-[640px]:py-2.5">
          <FilterDropdown label="Scope" value={scope} options={SCOPE_OPTIONS} open={openFilter === 'scope'} onToggle={() => setOpenFilter(openFilter === 'scope' ? null : 'scope')} onChange={(value) => { updateFilter('scope', value); setOpenFilter(null); }} />
          <FilterDropdown label="Type" value={type} options={TYPE_OPTIONS} open={openFilter === 'type'} onToggle={() => setOpenFilter(openFilter === 'type' ? null : 'type')} onChange={(value) => { updateFilter('type', value); setOpenFilter(null); }} />
        </div>
        <section className="py-16 pb-8 max-[640px]:!py-6 max-[640px]:!pb-4">
          <div className="case-grid reveal mx-[5vw] grid w-[calc(100%-10vw)] grid-cols-3 gap-px bg-[var(--alabaster)] p-px max-[1099px]:grid-cols-2 max-[640px]:mx-5 max-[640px]:w-[calc(100%-40px)] max-[640px]:grid-cols-1" id="caseGrid">
            {filteredProjects.map((project) => (
              <PortfolioProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
