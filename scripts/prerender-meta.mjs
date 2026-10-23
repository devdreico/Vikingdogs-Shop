import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PRODUCTS } from '../src/data/products.js'
import { SITE_URL, SITE_NAME } from '../src/data/site.js'
import { discountedPrice } from '../src/data/pricing.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const baseHtml = readFileSync(join(dist, 'index.html'), 'utf8')

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const productLd = (product) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.detail,
  brand: { '@type': 'Brand', name: SITE_NAME },
  url: `${SITE_URL}/producto/${product.id}`,
  offers: {
    '@type': 'Offer',
    url: `${SITE_URL}/producto/${product.id}`,
    priceCurrency: 'COP',
    ...(product.salePrice != null
      ? { price: product.salePrice, availability: 'https://schema.org/InStock' }
      : { availability: 'https://schema.org/PreOrder' }),
    seller: { '@type': 'Organization', name: SITE_NAME },
  },
})

function renderHead({ title, description, path, jsonLd }) {
  const url = `${SITE_URL}${path}`
  let html = baseHtml
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
  html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${esc(description)}"`)
  html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${esc(url)}"`)
  html = html.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${esc(url)}"`)
  html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${esc(title)}"`)
  html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${esc(description)}"`)
  html = html.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${esc(title)}"`)
  html = html.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${esc(description)}"`)
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${esc(JSON.stringify(jsonLd))}<\/script>`)
  return html
}

function writeRoute(path, head) {
  const dir = path === '/' ? dist : join(dist, path.replace(/^\//, ''))
  if (path !== '/') mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), renderHead(head))
  console.log(`prerender: ${path}`)
}

// Catálogo
writeRoute('/catalogo', {
  title: `Catálogo · ${SITE_NAME}`,
  description: '10 productos para el cuidado, aseo y aventuras de tu perro. Envío gratis en todos los pedidos y pago contra entrega.',
  path: '/catalogo',
  jsonLd: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Catálogo VikingDogs', url: `${SITE_URL}/catalogo` },
})

// Productos (con precio descontado para las previews)
for (const raw of PRODUCTS) {
  const product = { ...raw, salePrice: raw.price != null ? discountedPrice(raw.price, raw.id) : null }
  writeRoute(`/producto/${product.id}`, {
    title: `${product.name} · ${SITE_NAME}`,
    description: `${product.detail} Envío gratis en todos los pedidos. Pago contra entrega.`,
    path: `/producto/${product.id}`,
    jsonLd: productLd(product),
  })
}

// Páginas informativas
const infoPages = [
  ['faq', `Preguntas frecuentes · ${SITE_NAME}`, 'Resolvemos tus dudas sobre pagos contra entrega, envíos gratis, tiempos de entrega y devoluciones.'],
  ['envios', `Envíos y entregas · ${SITE_NAME}`, 'Envío gratis a todo Colombia en todos los pedidos. Tiempos de entrega y seguimiento por WhatsApp.'],
  ['devoluciones', `Cambios y devoluciones · ${SITE_NAME}`, 'Política de cambios y devoluciones: 10 días para reportar fallas o errores de despacho.'],
  ['privacidad', `Privacidad · ${SITE_NAME}`, 'Cómo usamos tus datos únicamente para procesar y entregar tu pedido. No vendemos información.'],
  ['terminos', `Términos de uso · ${SITE_NAME}`, 'Precios en COP, disponibilidad de productos y condiciones de compra contra entrega.'],
]
for (const [slug, title, description] of infoPages) {
  writeRoute(`/${slug}`, {
    title,
    description,
    path: `/${slug}`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebPage', name: title, url: `${SITE_URL}/${slug}` },
  })
}

console.log(`prerender-meta: ${PRODUCTS.length + 6} rutas con meta única`)
