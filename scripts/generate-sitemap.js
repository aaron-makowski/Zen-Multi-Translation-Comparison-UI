const fs = require('fs')
const path = require('path')

const baseUrl = process.env.SITE_URL || 'https://v0-compare-translation-apps.vercel.app'

function getRoutes(dir, route = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let routes = []

  for (const entry of entries) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue
    const res = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name.startsWith('(')) continue
      if (entry.name.includes('[')) continue
      routes = routes.concat(getRoutes(res, `${route}/${entry.name}`))
    } else if (entry.name === 'page.tsx' || entry.name === 'page.js' || entry.name === 'page.ts') {
      routes.push(route === '' ? '/' : route)
    }
  }

  return routes
}

const pagesDir = path.join(process.cwd(), 'app')
const routes = Array.from(new Set(getRoutes(pagesDir)))

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
  .map((route) => `  <url><loc>${baseUrl}${route}</loc></url>`)
  .join('\n')}\n</urlset>\n`

fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemap)
