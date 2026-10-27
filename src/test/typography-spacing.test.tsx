import { readFileSync } from 'node:fs';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from '../app/home/home-view';
import ProjectPage from '../app/projects/project-view';
import { HomeProjectCard, PortfolioProjectCard } from '../components/shared/project-card';
import { PROJECTS } from '../constants/projects';

describe('shared typography and spacing', () => {
  const integration = readFileSync('src/styles/tailwind.css', 'utf8');
  const refinements = readFileSync('src/styles/typography-spacing.css', 'utf8');

  it('applies shared refinements to every entry above page styles and below utilities', () => {
    expect(integration).toContain('@layer theme, base, components, refinements, utilities;');
    expect(integration).toContain("@import './typography-spacing.css' layer(refinements);");
    for (const page of ['home', 'anatomy', 'standard', 'studio', 'command-center', 'projects']) {
      expect(readFileSync(`src/app/${page}/entry.tsx`, 'utf8')).toContain("import '../../styles/tailwind.css';");
      expect(readFileSync(`src/app/${page}/${page}.css`, 'utf8')).toMatch(/^@layer components/);
    }
  });

  it('restricts shared refinements to text, spacing, and wrapping', () => {
    const allowed = new Set([
      'font-size', 'font-family', 'font-variant-numeric', 'line-height', 'letter-spacing',
      'text-wrap', 'overflow-wrap', 'text-align', 'gap', 'margin', 'margin-top', 'margin-bottom',
      'padding', 'padding-inline', 'padding-block', 'padding-top', 'min-width', 'max-width',
      'display', 'flex-shrink', 'flex-wrap', 'align-items',
    ]);
    const properties = Array.from(refinements.matchAll(/(?:^|[;{])\s*([-\w]+)\s*:/g), (match) => match[1]);
    expect(properties.length).toBeGreaterThan(0);
    expect(properties.filter((property) => !property.startsWith('--') && !allowed.has(property))).toEqual([]);
  });

  it('keeps area units and duration values together in both card variants', () => {
    const project = PROJECTS[0];
    for (const Card of [HomeProjectCard, PortfolioProjectCard]) {
      const { container, unmount } = render(<Card project={project} />);
      expect(container.querySelector('.stat')?.textContent).toBe(`${project.area.replaceAll(' ', '\u00a0')} · ${project.scope}`);
      expect(container.querySelector('.work-meta, .meta-row')?.textContent).toContain(project.duration.replaceAll(' ', '\u00a0'));
      unmount();
    }
  });

  it('uses typographic quotation marks for founder and client quotations', () => {
    const home = render(<HomePage />);
    expect(home.container.querySelector('blockquote')?.textContent).toMatch(/^“.*”$/);
    home.unmount();
    for (const project of PROJECTS.filter((item) => item.details?.sections?.some((section) => section.type === 'testimonial'))) {
      const page = render(<ProjectPage project={project} />);
      const quote = page.container.querySelector('blockquote');
      const text = Array.from(quote!.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.textContent).join('');
      expect(text).toMatch(/^“.*”$/);
      page.unmount();
    }
  });
});
