// Génère le blog SEO statique de DotsDaily à partir de scripts/blog-articles.mjs.
//   node scripts/generate-blog.mjs
// Écrit public/blog/<slug>/index.html (URL propre /blog/<slug>/), public/blog/index.html,
// et régénère public/sitemap.xml (pages cœur + blog). 100% statique = indexable
// malgré la SPA Vite. Aucune modif de vercel.json (Vercel sert les fichiers réels
// avant le rewrite catch-all).

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { SITE, articles } from './blog-articles.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');
const BLOG = join(PUBLIC, 'blog');

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const fmtDate = (iso) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

const CSS = `
:root{--ink:#0f172a;--muted:#64748b;--line:#e2e8f0;--brand:#f97316;--bg:#f8fafc}
*{box-sizing:border-box}
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:var(--ink);background:#fff;line-height:1.65;-webkit-font-smoothing:antialiased}
a{color:inherit}
.wrap{max-width:720px;margin:0 auto;padding:0 20px}
header.site{border-bottom:1px solid var(--line);background:#fff;position:sticky;top:0;z-index:10}
header.site .wrap{display:flex;align-items:center;justify-content:space-between;height:60px}
.brand{display:flex;align-items:center;gap:10px;text-decoration:none;font-weight:700}
.brand img{width:28px;height:28px;border-radius:7px}
.btn{display:inline-block;background:var(--brand);color:#fff;text-decoration:none;font-weight:600;padding:9px 16px;border-radius:10px;font-size:14px}
.btn:hover{filter:brightness(.95)}
.crumb{font-size:13px;color:var(--muted);margin:24px 0 8px}
.crumb a{text-decoration:none}
article h1{font-size:32px;line-height:1.2;letter-spacing:-.02em;margin:6px 0 10px}
.meta{color:var(--muted);font-size:14px;margin-bottom:28px}
article h2{font-size:22px;letter-spacing:-.01em;margin:34px 0 10px}
article p{margin:0 0 16px}
article ul,article ol{margin:0 0 18px;padding-left:22px}
article li{margin:6px 0}
.lead{font-size:19px;color:#334155}
.cta{margin:40px 0;padding:24px;border:1px solid var(--line);border-radius:16px;background:var(--bg);text-align:center}
.cta h3{margin:0 0 6px;font-size:19px}
.cta p{margin:0 0 16px;color:var(--muted)}
.related{margin:48px 0 0;border-top:1px solid var(--line);padding-top:24px}
.related h2{font-size:16px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);margin:0 0 14px}
.related a{display:block;text-decoration:none;padding:14px 16px;border:1px solid var(--line);border-radius:12px;margin-bottom:10px;font-weight:600}
.related a:hover{border-color:var(--brand)}
.related a span{display:block;font-weight:400;color:var(--muted);font-size:14px;margin-top:3px}
footer.site{border-top:1px solid var(--line);margin-top:56px;padding:28px 0;color:var(--muted);font-size:14px}
footer.site .wrap{display:flex;flex-wrap:wrap;gap:8px 18px;align-items:center;justify-content:center}
footer.site a{text-decoration:none}
.posts{list-style:none;padding:0;margin:24px 0}
.posts li{margin:0 0 14px}
.posts a{display:block;text-decoration:none;border:1px solid var(--line);border-radius:14px;padding:18px 20px}
.posts a:hover{border-color:var(--brand)}
.posts h2{margin:0 0 6px;font-size:19px}
.posts p{margin:0;color:var(--muted);font-size:15px}
.posts time{display:block;color:var(--muted);font-size:13px;margin-top:8px}
`;

const header = () => `<header class="site"><div class="wrap">
  <a class="brand" href="/"><img src="${SITE.logo}" alt="${esc(SITE.name)} logo" width="28" height="28">${esc(SITE.name)}</a>
  <a class="btn" href="/generator">Create your wallpaper</a>
</div></header>`;

const footer = () => `<footer class="site"><div class="wrap">
  <span>&copy; ${new Date().getFullYear()} ${esc(SITE.name)}</span>
  <a href="/">Home</a><a href="/generator">Generator</a><a href="/blog/">Blog</a>
  <a href="/pricing">Pricing</a><a href="/faq">FAQ</a><a href="/privacy">Privacy</a>
</div></footer>`;

const renderBlocks = (blocks = []) =>
  blocks.map((b) => {
    if (b.p) return `<p>${b.p}</p>`;
    if (b.ul) return `<ul>${b.ul.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
    if (b.ol) return `<ol>${b.ol.map((i) => `<li>${esc(i)}</li>`).join('')}</ol>`;
    return '';
  }).join('\n');

const relatedFor = (current) =>
  articles.filter((a) => a.slug !== current.slug).slice(0, 3);

function articleHtml(a) {
  const url = `${SITE.base}/blog/${a.slug}/`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    dateModified: a.date,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: SITE.base + SITE.logo } },
    mainEntityOfPage: url,
  };
  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.base + '/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: SITE.base + '/blog/' },
      { '@type': 'ListItem', position: 3, name: a.title, item: url },
    ],
  };
  const body = a.sections.map((s) => `<h2>${esc(s.h2)}</h2>\n${renderBlocks(s.blocks)}`).join('\n');
  const related = relatedFor(a)
    .map((r) => `<a href="/blog/${r.slug}/">${esc(r.title)}<span>${esc(r.description)}</span></a>`)
    .join('\n');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(a.title)} | ${esc(SITE.name)}</title>
<meta name="description" content="${esc(a.description)}">
<meta name="keywords" content="${esc(a.keywords)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(a.title)}">
<meta property="og:description" content="${esc(a.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE.base + SITE.logo}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(a.title)}">
<meta name="twitter:description" content="${esc(a.description)}">
<link rel="icon" href="${SITE.logo}">
<style>${CSS}</style>
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script type="application/ld+json">${JSON.stringify(crumbs)}</script>
</head>
<body>
${header()}
<main class="wrap">
  <nav class="crumb"><a href="/">Home</a> &rsaquo; <a href="/blog/">Blog</a> &rsaquo; ${esc(a.title)}</nav>
  <article>
    <h1>${esc(a.title)}</h1>
    <p class="meta">Published ${fmtDate(a.date)} &middot; ${esc(SITE.name)}</p>
    <p class="lead">${a.intro}</p>
    ${body}
    <div class="cta">
      <h3>${esc(a.cta || 'Create your wallpaper')}</h3>
      <p>${esc(SITE.tagline)} Free, no app to install.</p>
      <a class="btn" href="/generator">Open the generator</a>
    </div>
    <section class="related">
      <h2>Keep reading</h2>
      ${related}
    </section>
  </article>
</main>
${footer()}
</body>
</html>`;
}

function indexHtml() {
  const sorted = [...articles].sort((a, b) => (a.date < b.date ? 1 : -1));
  const list = sorted
    .map((a) => `<li><a href="/blog/${a.slug}/"><h2>${esc(a.title)}</h2><p>${esc(a.description)}</p><time>${fmtDate(a.date)}</time></a></li>`)
    .join('\n');
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE.name} Blog`,
    url: `${SITE.base}/blog/`,
    blogPost: sorted.map((a) => ({ '@type': 'BlogPosting', headline: a.title, url: `${SITE.base}/blog/${a.slug}/`, datePublished: a.date })),
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Blog | ${esc(SITE.name)} — iPhone wallpapers, productivity & time</title>
<meta name="description" content="Guides on daily iPhone wallpapers, year progress, life calendars and motivational lock screens, from ${esc(SITE.name)}.">
<link rel="canonical" href="${SITE.base}/blog/">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(SITE.name)} Blog">
<meta property="og:description" content="Guides on daily iPhone wallpapers, year progress, life calendars and motivational lock screens.">
<meta property="og:url" content="${SITE.base}/blog/">
<meta property="og:image" content="${SITE.base + SITE.logo}">
<link rel="icon" href="${SITE.logo}">
<style>${CSS}</style>
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
${header()}
<main class="wrap">
  <nav class="crumb"><a href="/">Home</a> &rsaquo; Blog</nav>
  <h1>The ${esc(SITE.name)} Blog</h1>
  <p class="lead">Make your iPhone lock screen work for you: daily wallpapers, year progress, life calendars and quotes that actually stick.</p>
  <ul class="posts">${list}</ul>
</main>
${footer()}
</body>
</html>`;
}

function sitemapXml() {
  const core = [
    { loc: '/', changefreq: 'weekly', priority: '1.0' },
    { loc: '/generator', changefreq: 'monthly', priority: '0.9' },
    { loc: '/pricing', changefreq: 'monthly', priority: '0.8' },
    { loc: '/about', changefreq: 'monthly', priority: '0.7' },
    { loc: '/faq', changefreq: 'monthly', priority: '0.7' },
    { loc: '/contact', changefreq: 'monthly', priority: '0.6' },
    { loc: '/blog/', changefreq: 'daily', priority: '0.8' },
    { loc: '/privacy', changefreq: 'yearly', priority: '0.4' },
    { loc: '/terms', changefreq: 'yearly', priority: '0.4' },
    { loc: '/legal', changefreq: 'yearly', priority: '0.3' },
  ];
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ...core.map((c) => ({ loc: SITE.base + c.loc, lastmod: today, changefreq: c.changefreq, priority: c.priority })),
    ...articles.map((a) => ({ loc: `${SITE.base}/blog/${a.slug}/`, lastmod: a.date, changefreq: 'monthly', priority: '0.7' })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
}

// --- write ---
mkdirSync(BLOG, { recursive: true });
for (const a of articles) {
  const dir = join(BLOG, a.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), articleHtml(a));
}
writeFileSync(join(BLOG, 'index.html'), indexHtml());
writeFileSync(join(PUBLIC, 'sitemap.xml'), sitemapXml());

console.log(`Blog generated: ${articles.length} articles + index + sitemap (${articles.length + 1} pages).`);
