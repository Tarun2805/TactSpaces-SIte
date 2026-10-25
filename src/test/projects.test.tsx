import { readFileSync } from 'node:fs';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { StrictMode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import ProjectPage from '../app/projects/page';
import AnatomyPage from '../app/anatomy/page';
import { renderProject } from '../app/projects/render';
import { ProjectCard } from '../components/shared/project-card';
import { SiteLayout } from '../components/shared/site-layout';
import { PROJECTS } from '../constants/projects';
import { parseProject } from '../lib/validations/project';
import { getProjectHref } from '../utils/project';

describe('JSON-driven projects', () => {
  it('keeps all eight cards in order but only publishes three detail pages', () => {
    expect(PROJECTS).toHaveLength(8);
    expect(PROJECTS.filter((project) => project.details).map((project) => project.slug)).toEqual(['d-hoofers', 'pinaki-residence', 'hakuna-matata']);
    for (const project of PROJECTS) {
      expect(parseProject(project)).toEqual(project);
      expect(getProjectHref(project)).toBe(project.details ? `/projects/${project.slug}/` : undefined);
    }
  });

  it('keeps the five projects without details visible in the portfolio', () => {
    const { container } = render(<AnatomyPage />);
    expect(container.querySelectorAll('a.case-card')).toHaveLength(3);
    expect(container.querySelectorAll('article.case-card')).toHaveLength(5);
    for (const project of PROJECTS) {
      expect(screen.getByRole('heading', { name: project.name })).toBeTruthy();
    }
    expect(container.querySelector('.deep-dive')).toBeNull();
  });

  it.each(PROJECTS.filter((project) => project.details))('preserves $name’s existing case-study content', (project) => {
    const original = new DOMParser().parseFromString(readFileSync('archive/html/anatomy.html', 'utf8'), 'text/html');
    const { container } = render(<ProjectPage project={project} />);
    const selectors = 'h1,h2,.num,.lbl,.mandate-copy,.day,h3,.h-panel p,blockquote';
    const content = (parent: ParentNode) => Array.from(parent.querySelectorAll(selectors)).map((node) => node.textContent?.replace(/[“”]/g, '"').replace(/\s+/g, ''));
    expect(content(container)).toEqual(content(original.querySelector(`#${project.legacyAnchor}`)!));
    expect(container.querySelectorAll('h1')).toHaveLength(1);
  });

  it.each(['portfolio', 'home'] as const)('renders a listing-only %s card without a dead link', (variant) => {
    const { details: _details, ...listing } = PROJECTS[0];
    expect(parseProject(listing).details).toBeUndefined();
    expect(getProjectHref(listing)).toBeUndefined();
    const { container } = render(<ProjectCard project={listing} variant={variant} />);
    expect(container.querySelector('article')).not.toBeNull();
    expect(container.querySelector('a,button,[tabindex]')).toBeNull();
    expect(screen.getByRole('heading', { name: listing.name })).toBeTruthy();
  });

  it('does not render a detail page for a listing-only project', () => {
    const { details: _details, ...listing } = PROJECTS[0];
    const { container } = render(<ProjectPage project={listing} />);
    expect(container.innerHTML).toBe('');
  });

  it('omits optional sections instead of leaving empty placeholders', () => {
    const project = { ...PROJECTS[0], details: { summary: 'A concise project overview.', stats: [{ value: '45', label: 'Days' }] } };
    expect(parseProject(project)).toEqual(project);
    const { container } = render(<ProjectPage project={project} />);
    expect(screen.getByText('A concise project overview.')).toBeTruthy();
    expect(container.querySelector('.h-timeline-wrap,.dd-hero,.ba-slider,blockquote')).toBeNull();
  });

  it('supports actual images and keeps comparison images full-size while dragging', () => {
    const project = {
      ...PROJECTS[2],
      details: {
        ...PROJECTS[2].details!,
        sections: [{
          type: 'comparison' as const,
          before: { kind: 'image' as const, src: '/images/before.jpg', alt: 'Room before renovation' },
          after: { kind: 'image' as const, src: '/images/after.jpg', alt: 'Room after renovation' },
        }],
      },
    };
    expect(parseProject(project)).toEqual(project);
    const { container } = render(<ProjectPage project={project} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '0' } });
    const clipped = container.querySelector<HTMLElement>('.ba-before-wrap')!;
    expect(clipped.style.width).toBe('100%');
    expect(clipped.style.clipPath).toBe('inset(0 100% 0 0)');
    expect(screen.getByAltText('Room before renovation').getAttribute('src')).toBe('/images/before.jpg');
    expect(screen.getByAltText('Room after renovation').getAttribute('src')).toBe('/images/after.jpg');
  });

  it('hydrates the pre-rendered content without mismatches and activates interactions', async () => {
    const container = document.createElement('div');
    document.body.append(container);
    container.innerHTML = renderProject(PROJECTS[2]);
    const errors = vi.fn();
    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(container, <StrictMode><SiteLayout page="anatomy" siteRoot="/"><ProjectPage project={PROJECTS[2]} /></SiteLayout></StrictMode>, { onRecoverableError: errors });
    });
    expect(errors).not.toHaveBeenCalled();
    expect(container.querySelector('.logo-mark')?.getAttribute('href')).toBe('/index.html');
    fireEvent.change(screen.getByRole('slider'), { target: { value: '80' } });
    expect(container.querySelector<HTMLElement>('.ba-handle')?.style.left).toBe('80%');
    await act(async () => root!.unmount());
    container.remove();
  });

  it('escapes project text instead of treating JSON content as markup', () => {
    const html = renderToString(<ProjectPage project={{ ...PROJECTS[0], name: '<script>not markup</script>' }} />);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
});

describe('project content validation', () => {
  it.each([
    ['slug', '../bad'], ['slug', 'Uppercase'], ['order', -1], ['category', 'office'],
    ['featured', 'true'], ['cover', { kind: 'placeholder', preset: 'unknown' }],
    ['cover', { kind: 'image', src: 'javascript:alert(1)', alt: 'Bad image' }],
    ['cover', { kind: 'image', src: '//example.com/image.jpg', alt: 'Bad image' }],
    ['cover', { kind: 'image', src: '/images/project.jpg', alt: '' }], ['details', null], ['detail', {}],
  ])('rejects invalid %s content', (key, value) => {
    expect(() => parseProject({ ...PROJECTS[0], [key]: value })).toThrow();
  });

  it.each([
    { summary: '', stats: [] },
    { summary: 'Overview', stats: [] },
    { summary: 'Overview', stats: [{ value: '12', label: 'Days' }], sections: [{ type: 'unknown' }] },
    { summary: 'Overview', stats: [{ value: '12', label: 'Days' }], sections: [{ type: 'timeline', stages: [] }] },
    { summary: 'Overview', stats: [{ value: '12', label: 'Days' }], sections: [{ type: 'comparison', before: { kind: 'image', src: '/before.jpg', alt: 'Before' } }] },
    { summary: 'Overview', stats: [{ value: '12', label: 'Days' }], sections: [{ type: 'hero', media: PROJECTS[0].cover, callouts: [{ top: '101%', left: '20%', text: 'Material' }] }] },
  ])('rejects incomplete or invalid case-study sections', (details) => {
    expect(() => parseProject({ ...PROJECTS[0], details })).toThrow();
  });
});
