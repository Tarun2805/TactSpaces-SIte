import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';
import { createServer, type Plugin, type ViteDevServer } from 'vite';
import { parseProject } from '../src/lib/validations/project.ts';
import type { Project, ProjectMedia } from '../src/types/project.ts';

const SITE_URL = 'https://tactspaces.in';

const STATIC_PAGES = [
  { path: '/', title: 'Architecture & Interiors in Bengaluru | TactSpaces', description: 'Architecture and turnkey interior design across Bengaluru, governed by precision.' },
  { path: '/anatomy.html', title: 'Architecture & Interior Design Projects | TactSpaces', description: 'Selected residential, commercial, and hospitality projects by TactSpaces in Bengaluru.' },
  { path: '/standard.html', title: 'The TactSpaces Project Delivery Standard', description: 'Seven documented stages guide each TactSpaces project from discovery through handover.' },
  { path: '/studio.html', title: 'About the TactSpaces Studio', description: 'Meet TactSpaces, a Bengaluru architecture and interiors studio.' },
  { path: '/command-center.html', title: 'Start an Architecture or Interiors Project | TactSpaces', description: 'Share your project brief and start a prepared discovery conversation with TactSpaces.' },
];

function validateImage(media: ProjectMedia, root: string, source: string) {
  if (media.kind !== 'image' || media.src.startsWith('https://')) return;
  const publicRoot = resolve(root, 'public');
  let path: string;
  try { path = decodeURIComponent(media.src); } catch { throw new Error(`${source}: invalid image URL ${media.src}.`); }
  const absolute = resolve(publicRoot, `.${path}`);
  const fromPublic = relative(publicRoot, absolute);
  if (fromPublic.startsWith(`..${sep}`) || fromPublic === '..' || isAbsolute(fromPublic) || !existsSync(absolute) || !statSync(absolute).isFile()) {
    throw new Error(`${source}: image ${media.src} must exist inside public/.`);
  }
}

export function loadProjects(root: string): Project[] {
  const directory = join(root, 'src/content/projects');
  const projects = readdirSync(directory).filter((file) => file.endsWith('.json')).map((file) => {
    const project = parseProject(JSON.parse(readFileSync(join(directory, file), 'utf8')), file);
    if (file !== `${project.slug}.json`) throw new Error(`${file}: filename must match the project slug.`);
    validateImage(project.cover, root, file);
    for (const section of project.details?.sections ?? []) {
      if (section.type === 'hero') validateImage(section.media, root, file);
      if (section.type === 'timeline') section.stages.forEach((stage) => validateImage(stage.media, root, file));
      if (section.type === 'comparison') {
        if (section.before) validateImage(section.before, root, file);
        if (section.after) validateImage(section.after, root, file);
      }
    }
    return project;
  });
  for (const field of ['slug', 'legacyAnchor'] as const) {
    const seen = new Set<string>();
    for (const project of projects) {
      const value = project[field];
      if (!value) continue;
      if (seen.has(value)) throw new Error(`Duplicate project ${field}: ${value}.`);
      seen.add(value);
    }
  }
  return projects.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
}

export function projectDocument(template: string, project: Project, markup: string) {
  if (!project.details) throw new Error(`Cannot generate a page for listing-only project ${project.slug}.`);
  const url = `${SITE_URL}/projects/${project.slug}/`;
  const title = `${project.name} | TactSpaces`;
  const description = project.details.summary;
  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
  }).replace(/</g, '\\u003c');
  return template
    .replace('<html lang="en">', `<html lang="en" data-project-slug="${escapeHtml(project.slug)}">`)
    .replace('<title>Project | TactSpaces</title>', () => `<title>${escapeHtml(title)}</title>\n    <meta name="description" content="${escapeHtml(description)}" />\n    <link rel="canonical" href="${url}" />\n    <meta property="og:type" content="article" />\n    <meta property="og:site_name" content="TactSpaces" />\n    <meta property="og:title" content="${escapeHtml(title)}" />\n    <meta property="og:description" content="${escapeHtml(description)}" />\n    <meta property="og:url" content="${url}" />\n    <meta name="twitter:card" content="summary" />\n    <script type="application/ld+json">${structuredData}</script>`)
    .replace('<div id="root"></div>', () => `<div id="root">${markup}</div>`);
}

async function renderProject(server: ViteDevServer, project: Project): Promise<string> {
  const renderer = await server.ssrLoadModule('/src/app/projects/render.tsx');
  return renderer.renderProject(project);
}

export function projectPages(): Plugin {
  let root: string;
  return {
    name: 'project-pages',
    enforce: 'post',
    configResolved(config) { root = config.root; },
    buildStart() { loadProjects(root); },
    configureServer(server) {
      loadProjects(root);
      server.middlewares.use(async (request, response, next) => {
        const url = new URL(request.url ?? '/', 'http://localhost');
        if (!url.pathname.startsWith('/projects/') && url.pathname !== '/project.html') return next();
        try {
          const match = url.pathname.match(/^\/projects\/([a-z0-9-]+)(?:\/|\/index\.html)?$/);
          const project = match && loadProjects(root).find((item) => item.slug === match[1] && item.details);
          if (!project) {
            response.statusCode = 404;
            response.setHeader('Content-Type', 'text/html; charset=utf-8');
            response.end('<!doctype html><html lang="en"><title>Project not found | TactSpaces</title><h1>Project not found</h1><a href="/anatomy.html">View all projects</a></html>');
            return;
          }
          if (url.pathname === `/projects/${project.slug}`) {
            response.statusCode = 301;
            response.setHeader('Location', `/projects/${project.slug}/${url.search}`);
            response.end();
            return;
          }
          const template = readFileSync(join(root, 'project.html'), 'utf8');
          const html = projectDocument(template, project, await renderProject(server, project));
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.end(await server.transformIndexHtml(url.pathname, html));
        } catch (error) { next(error as Error); }
      });
    },
    handleHotUpdate(context) {
      if (context.file.startsWith(join(root, 'src/content/projects') + sep) && context.file.endsWith('.json')) loadProjects(root);
    },
    async generateBundle(_options, bundle) {
      const shell = bundle['project.html'];
      if (!shell || shell.type !== 'asset') throw new Error('The compiled project page template is missing.');
      const server = await createServer({
        configFile: false,
        root,
        appType: 'custom',
        server: { middlewareMode: true, watch: null },
        optimizeDeps: { noDiscovery: true, include: [] },
      });
      try {
        const projects = loadProjects(root);
        for (const project of projects) {
          if (!project.details) continue;
          let markup = await renderProject(server, project);
          // SSR resolves source images; replace them with the client build's hashed assets.
          for (const output of Object.values(bundle)) {
            if (output.type !== 'asset') continue;
            for (const original of output.originalFileNames) {
              const source = isAbsolute(original) ? relative(root, original) : original;
              if (!/\.(?:png|jpe?g|webp|avif|svg|gif|ico)$/i.test(source)) continue;
              markup = markup.replaceAll(`/${source}`, `/${output.fileName}`);
            }
          }
          this.emitFile({ type: 'asset', fileName: `projects/${project.slug}/index.html`, source: projectDocument(String(shell.source), project, markup) });
        }
        const urls = [
          ...STATIC_PAGES.map((page) => `${SITE_URL}${page.path}`),
          ...projects.filter((project) => project.details).map((project) => `${SITE_URL}/projects/${project.slug}/`),
        ];
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`;
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });

        const llmsEntries = [
          ...STATIC_PAGES.map((page) => `- [${page.title}](${SITE_URL}${page.path}): ${page.description}`),
          ...projects.filter((project) => project.details).map((project) => `- [${project.name}](${SITE_URL}/projects/${project.slug}/): ${project.details!.summary}`),
        ];
        this.emitFile({ type: 'asset', fileName: 'llms.txt', source: `# TactSpaces\n\n> Architecture and turnkey interior design across Bengaluru, India.\n\n## Website\n\n${llmsEntries.join('\n')}\n` });
        delete bundle['project.html'];
      } finally { await server.close(); }
    },
  };
}
