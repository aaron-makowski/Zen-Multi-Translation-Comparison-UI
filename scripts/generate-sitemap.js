const { writeFileSync } = require('fs');

const rawBase = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const baseUrl = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;
const locales = ['en', 'es'];
const routes = ['/', '/about', '/compare', '/books', '/translations'];

const urls = [];
for (const locale of locales) {
  for (const route of routes) {
    urls.push(`${baseUrl}/${locale}${route}`);
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n') +
  '\n</urlset>\n';

writeFileSync('public/sitemap.xml', sitemap);
console.log('sitemap generated');
