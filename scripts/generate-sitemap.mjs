import { promises as fs } from "fs"
import path from "path"

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
const appDir = path.join(process.cwd(), "app")
const pages = []

async function collect(dir, route = "") {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (entry.name === "api" || entry.name.startsWith("[")) continue
      await collect(path.join(dir, entry.name), path.join(route, entry.name))
    } else if (entry.name === "page.tsx" || entry.name === "page.ts") {
      pages.push(route ? `/${route}` : "/")
    }
  }
}

await collect(appDir)

const urls = pages
  .map((page) => {
    const loc = `${baseUrl}${page}`
    return `  <url>\n    <loc>${loc}</loc>\n  </url>`
  })
  .join("\n")

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

await fs.mkdir(path.join(process.cwd(), "public"), { recursive: true })
await fs.writeFile(path.join(process.cwd(), "public", "sitemap.xml"), sitemap)

console.log("sitemap.xml generated")
