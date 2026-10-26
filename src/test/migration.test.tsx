import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import AnatomyPage from '../app/anatomy/anatomy-view';
import CommandCenterPage from '../app/command-center/command-center-view';
import HomePage from '../app/home/home-view';
import StandardPage from '../app/standard/standard-view';
import StudioPage from '../app/studio/studio-view';
import { SiteLayout } from '../components/shared/site-layout';
import type { PageName } from '../types/site';

const PAGES = [
  { source: 'index', page: 'home' as PageName, Component: HomePage },
  { source: 'anatomy', page: 'anatomy' as PageName, Component: AnatomyPage },
  { source: 'standard', page: 'standard' as PageName, Component: StandardPage },
  { source: 'command-center', page: 'command-center' as PageName, Component: CommandCenterPage },
  { source: 'studio', page: 'studio' as PageName, Component: StudioPage },
];

function parse(html: string) {
  return new DOMParser().parseFromString(html, 'text/html');
}

describe('migration preservation', () => {
  for (const { source, page, Component } of PAGES) {
    const original = readFileSync(`archive/html/${source}.html`, 'utf8');

    it(`preserves ${source}'s content, links, and anchors outside data-driven project content`, () => {
      const before = parse(original);
      const after = parse(renderToStaticMarkup(<SiteLayout page={page}><Component /></SiteLayout>));
      // Project listings now come from JSON; case studies have their own pages.
      for (const doc of [before, after]) {
        if (page === 'anatomy') doc.querySelectorAll('.deep-dive').forEach((node) => node.remove());
      }
      if (page === 'home') {
        before.querySelector('.trust-grid')?.closest('section')?.remove();
        after.querySelector('.trust-grid')?.closest('section')?.remove();
        after.querySelector('.why-split')?.remove();
      }
      if (page === 'studio') {
        before.querySelector('.why-split')?.remove();
        after.querySelector('.trust-grid')?.closest('section')?.remove();
      }
      if (page === 'standard') {
        before.querySelector('.commit-section')?.remove();
        const principles = after.querySelector('.commit-section');
        expect(principles?.querySelector('h2')?.textContent).toBe('Our core principles');
        expect(principles?.querySelectorAll('.commit-card')).toHaveLength(6);
        principles?.remove();
      }
      const text = (doc: Document) => Array.from(doc.querySelectorAll(
        'h1,h2,h3,h4,p,blockquote,dt,dd,.stat,.idx,.name,.title,.role,.stage-label,.step-label,.tile-label,.day,.doc-name,.num,.lbl,footer a[href^="tel:"],footer a[href^="mailto:"],footer a[href^="https://www.google.com/maps/"],footer a[href="https://maps.app.goo.gl/yyCswfFMvS2y59Bq6"]',
      )).filter((element) => !element.classList.contains('eyebrow') && !element.closest('.studio-gallery-section'))
        .map((element) => element.textContent?.replace(/[“”]/g, '"').replace(/\s+/g, ''));
      expect(text(after)).toEqual(text(before));

      // Footer contact links intentionally replace the original plain text.
      expect(after.querySelector('footer a[href="tel:+917348921433"]')?.textContent).toBe('+91 73489 21433');
      expect(after.querySelector('footer a[href="mailto:tactspaces@gmail.com"]')?.textContent).toBe('tactspaces@gmail.com');
      const addressLink = after.querySelector('footer a[href="https://maps.app.goo.gl/yyCswfFMvS2y59Bq6"]');
      expect(addressLink).toBeTruthy();
      expect(addressLink?.getAttribute('target')).toBe('_blank');
      expect(addressLink?.getAttribute('rel')).toBe('noopener noreferrer');
      const links = (doc: Document) => Array.from(doc.querySelectorAll('a:not(.work-card):not(.case-card):not(footer a[href^="tel:"]):not(footer a[href^="mailto:"]):not(footer a[href^="https://www.google.com/maps/"]):not(footer a[href="https://maps.app.goo.gl/yyCswfFMvS2y59Bq6"])')).map((a) => a.getAttribute('href'));
      expect(links(after).every((href) => !href?.endsWith('.html'))).toBe(true);
      const anchors = (doc: Document) => Array.from(doc.querySelectorAll('section[id]')).map((section) => section.id);
      expect(anchors(after)).toEqual(anchors(before));
    });

    it(`removes decorative hairlines from ${source}`, () => {
      const styles = readFileSync(`src/app/${page}/${page}.css`, 'utf8');
      expect(styles).not.toMatch(/\.eyebrow::before\{content:'?'[^}]*height:1px/);
      expect(styles).not.toMatch(/\.nav-links a::after\{content:'?'[^}]*height:1px/);
      expect(styles).not.toMatch(/nav\{[^}]*border-bottom:1px solid var\(--line\)/);
    });
  }

  it('places the commitment section on studio instead of home', () => {
    const home = parse(renderToStaticMarkup(<SiteLayout page="home"><HomePage /></SiteLayout>));
    const studio = parse(renderToStaticMarkup(<SiteLayout page="studio"><StudioPage /></SiteLayout>));
    expect(home.querySelector('.trust-grid')).toBeNull();
    expect(home.querySelector('.why-split + .founders')).not.toBeNull();
    expect(home.querySelector('.why-split h2')?.textContent).toBe('Understand. Design. Deliver.');
    expect(studio.querySelector('.trust-grid')?.closest('section')?.querySelector('h2')?.textContent).toBe('Our commitment');
    expect(studio.querySelectorAll('.trust-card')).toHaveLength(3);
  });

  it('retains the exact embedded logo bytes', () => {
    const original = readFileSync('archive/html/index.html', 'utf8');
    const encoded = original.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/)?.[1];
    expect(encoded).toBeTruthy();
    expect(readFileSync('src/assets/tactspaces-logo.png')).toEqual(Buffer.from(encoded!, 'base64'));
  });
});

describe('studio anchor layout', () => {
  it('offsets anchored sections by the measured header height without changing section spacing', () => {
    const styles = readFileSync('src/app/studio/studio.css', 'utf8');
    expect(styles).toContain('section[id]{scroll-margin-top:var(--nav-h);}');
    expect(styles).toContain('section{padding:5rem 5vw;}');
    expect(styles).toContain('section{padding:3.5rem 20px;}');
  });
});

describe('portfolio grid layout', () => {
  const styles = readFileSync('src/app/anatomy/anatomy.css', 'utf8');

  it('sticks the filter bar below the measured navigation at every breakpoint', () => {
    const offsets = Array.from(styles.matchAll(/\.filter-bar\{[^}]*?top:([^;]+);/g), (match) => match[1]);
    expect(offsets).toEqual(['var(--nav-h)', 'var(--nav-h)']);
  });

  it('keeps column counts fixed at desktop, tablet, and mobile breakpoints', () => {
    expect(styles).not.toContain('repeat(auto-fit, minmax(320px,1fr))');
    expect(styles).toMatch(/\.case-grid\{display:grid; grid-template-columns:repeat\(3, minmax\(0,1fr\)\)/);
    expect(styles).toMatch(/@media \(max-width:1099px\)\{\s*\.case-grid\{grid-template-columns:repeat\(2, minmax\(0,1fr\)\)/);
    expect(styles).toMatch(/@media \(max-width:640px\)\{[^}]*\}[\s\S]*?\.case-grid\{grid-template-columns:minmax\(0,1fr\)/);
  });

  it('borders populated cards without filling unused grid cells', () => {
    const grid = styles.match(/\.case-grid\{([^}]*)\}/)?.[1];
    const card = styles.match(/\.case-card\{([^}]*)\}/)?.[1];
    expect(grid).toContain('background:var(--alabaster)');
    expect(grid).not.toContain('border:');
    expect(card).toContain('outline:1px solid var(--line)');
    expect(styles).toContain('.case-card:focus-visible{outline:2px solid var(--forest)');
  });
});
