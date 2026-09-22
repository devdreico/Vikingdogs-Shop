import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { PRODUCTS, COMBO_IDS } from '../src/data/products.js'
import { SITE_URL } from '../src/data/site.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'public', 'sitemap.xml')

const routes = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/catalogo', changefreq: 'weekly', priority: '0.9' },
  ...PRODUCTS.map((product) => ({
    loc: `/producto/${product.id}`,
    changefreq: product.comingSoon ? 'weekly' : 'monthly',
    priority: product.comingSoon ? '0.7' : '0.8',
  })),
]

const entries = routes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route.loc}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`

writeFileSync(out, xml)
console.log(`sitemap.xml generado: ${routes.length} URLs (${SITE_URL}) — combo: ${COMBO_IDS.length} productos`)
