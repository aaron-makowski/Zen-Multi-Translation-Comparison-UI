const fs = require("fs");

const baseUrl = process.env.SITE_URL || "https://example.com";
const pages = ["/", "/about", "/books"];

const urls = pages
  .map((path) => `  <url><loc>${baseUrl}${path}</loc></url>`)
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

fs.mkdirSync("public", { recursive: true });
fs.writeFileSync("public/sitemap.xml", sitemap);
