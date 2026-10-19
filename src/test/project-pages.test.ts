// @vitest-environment node
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { build, createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { loadProjects, projectDocument } from '../../plugins/project-pages';

const ROOT = process.cwd();

describe('project page generation', () => {
  it('only emits complete, pre-rendered project pages with working asset and site links', async () => {
    const result = await build({ configFile: resolve(ROOT, 'vite.config.ts'), logLevel: 'silent', build: { write: false } });
    const output = Array.isArray(result) ? result[0] : result;
    if (!('output' in output)) throw new Error('Expected a completed build.');
    const projects = loadProjects(ROOT).filter((project) => project.details);
    const pages = output.output.filter((item) => item.fileName.startsWith('projects/'));
    expect(pages.map((page) => page.fileName).sort()).toEqual(projects.map((project) => `projects/${project.slug}/index.html`).sort());
    expect(output.output.some((item) => item.fileName === 'project.html')).toBe(false);
    for (const project of projects) {
      const page = pages.find((item) => item.fileName === `projects/${project.slug}/index.html`)!;
      if (page.type !== 'asset') throw new Error('Expected HTML asset.');
      const html = String(page.source);
      expect(html).toContain(`<h1>${project.name}</h1>`);
      expect(html).toContain(renderToStaticMarkup(createElement('p', { className: 'mandate-copy reveal' }, project.details!.summary)));
      expect(html).toContain(`data-project-slug="${project.slug}"`);
      expect(html).toContain('href="/index.html"');
      expect(html).toContain('href="/command-center.html"');
      expect(html).toContain('src="/assets/tactspaces-logo-');
      expect(html).not.toContain('/src/');
      for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"?]+)"/g)) {
        expect(output.output.some((asset) => asset.fileName === match[1].slice(1))).toBe(true);
      }
    }
  });

  it('serves project URLs directly in development and returns 404 for missing projects', async () => {
    const server = await createServer({ configFile: resolve(ROOT, 'vite.config.ts'), logLevel: 'silent', server: { port: 0 } });
    try {
      await server.listen();
      const address = server.httpServer!.address();
      if (!address || typeof address === 'string') throw new Error('Expected a local HTTP address.');
      const origin = `http://localhost:${address.port}`;
      const project = await fetch(`${origin}/projects/d-hoofers/`);
      expect(project.status).toBe(200);
      expect(await project.text()).toContain('<h1>D Hoofers Dance Studio</h1>');
      const redirect = await fetch(`${origin}/projects/d-hoofers?from=portfolio`, { redirect: 'manual' });
      expect(redirect.status).toBe(301);
      expect(redirect.headers.get('location')).toBe('/projects/d-hoofers/?from=portfolio');
      expect((await fetch(`${origin}/projects/not-a-project/`)).status).toBe(404);
      expect((await fetch(`${origin}/projects/vimal-residence/`)).status).toBe(404);
      expect((await fetch(`${origin}/project.html`)).status).toBe(404);
    } finally { await server.close(); }
  });

  it('escapes metadata, preserves literal dollar characters, and refuses listing-only pages', () => {
    const project = { ...loadProjects(ROOT)[0], name: 'A & B "$&" <Studio>' };
    const template = readFileSync(join(ROOT, 'project.html'), 'utf8');
    const html = projectDocument(template, project, '<h1>$&</h1>');
    expect(html).toContain('<title>A &amp; B &quot;$&amp;&quot; &lt;Studio&gt; | TactSpaces</title>');
    expect(html).toContain('<div id="root"><h1>$&</h1></div>');
    const { details: _details, ...listing } = project;
    expect(() => projectDocument(template, listing, '')).toThrow('listing-only');
  });

  it('validates listing-only files, slug/filename consistency, duplicate anchors, and local image paths', () => {
    const tempRoot = existsSync(join(tmpdir(), 'opencode')) ? join(tmpdir(), 'opencode') : tmpdir();
    const temporary = mkdtempSync(join(tempRoot, 'project-content-'));
    const directory = join(temporary, 'src/content/projects');
    mkdirSync(directory, { recursive: true });
    const { details: _details, ...listing } = loadProjects(ROOT)[0];
    const file = join(directory, `${listing.slug}.json`);
    try {
      writeFileSync(file, JSON.stringify(listing));
      expect(loadProjects(temporary)[0].details).toBeUndefined();
      writeFileSync(file, JSON.stringify({ ...listing, slug: 'different' }));
      expect(() => loadProjects(temporary)).toThrow('filename');
      writeFileSync(file, JSON.stringify({ ...listing, cover: { kind: 'image', src: '/images/missing.jpg', alt: 'Missing' } }));
      expect(() => loadProjects(temporary)).toThrow('must exist inside public/');
      mkdirSync(join(temporary, 'public/images'), { recursive: true });
      writeFileSync(join(temporary, 'public/images/cover.jpg'), 'fixture');
      writeFileSync(file, JSON.stringify({ ...listing, cover: { kind: 'image', src: '/images/cover.jpg', alt: 'Cover' } }));
      expect(loadProjects(temporary)).toHaveLength(1);
      writeFileSync(join(directory, 'second.json'), JSON.stringify({ ...listing, slug: 'second' }));
      expect(() => loadProjects(temporary)).toThrow('Duplicate project legacyAnchor');
    } finally { rmSync(temporary, { recursive: true, force: true }); }
  });
});
