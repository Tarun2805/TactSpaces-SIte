import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import AnatomyPage from '../app/anatomy/page';
import CommandCenterPage from '../app/command-center/page';
import HomePage from '../app/home/page';
import StandardPage from '../app/standard/page';
import StudioPage from '../app/studio/page';
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

    it(`preserves ${source}'s content, links, and anchors`, () => {
      const before = parse(original);
      const after = parse(renderToStaticMarkup(<SiteLayout page={page}><Component /></SiteLayout>));
      const text = (doc: Document) => Array.from(doc.querySelectorAll(
        'h1,h2,h3,h4,p,blockquote,dt,dd,.stat,.idx,.name,.title,.role,.stage-label,.step-label,.tile-label,.day,.doc-name,.num,.lbl',
      )).map((element) => element.textContent?.replace(/\s+/g, ''));
      expect(text(after)).toEqual(text(before));

      const links = (doc: Document) => Array.from(doc.querySelectorAll('a')).map((a) => a.getAttribute('href'));
      expect(links(after)).toEqual(links(before));
      const anchors = (doc: Document) => Array.from(doc.querySelectorAll('section[id]')).map((section) => section.id);
      expect(anchors(after)).toEqual(anchors(before));
    });

    it(`retains ${source}'s original CSS declarations`, () => {
      const originalStyles = original.match(/<style>([\s\S]*?)<\/style>/)?.[1]
        .replace(/\s*@import url\([^\n]*\);/, '').trim();
      const extracted = readFileSync(`src/app/${page}/${page}.css`, 'utf8')
        .replace(/^@layer components \{\n/, '').replace(/\n\}\n$/, '').trim();
      expect(extracted).toBe(originalStyles);
    });
  }

  it('retains the exact embedded logo bytes', () => {
    const original = readFileSync('archive/html/index.html', 'utf8');
    const encoded = original.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/)?.[1];
    expect(encoded).toBeTruthy();
    expect(readFileSync('src/assets/tactspaces-logo.png')).toEqual(Buffer.from(encoded!, 'base64'));
  });
});
