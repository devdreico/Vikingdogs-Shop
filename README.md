# VikingDogs

Tienda React/Vite de productos para perros. Identidad visual en degradado café oscuro → beige con glassmorphism y tipografía Montserrat.

## Ejecutar

```bash
npm install
npm run dev
```

Build de producción (regenera el sitemap automáticamente):

```bash
npm run build
```

## Catálogo e indexación

- Los productos viven en `src/data/products.js` (datos puros: sin imágenes ni lógica de UI).
- Las imágenes se mapean en `src/data/images.js` (`imageKey` → asset).
- El dominio canónico está en `src/data/site.js` (`SITE_URL`).
- Para agregar un producto: añade su objeto en `products.js` (usa `comingSoon: true` y `price: null` si aún no está disponible) y, si tiene fotos, su `imageKey` en `images.js`.
- Regenera el sitemap con:

```bash
npm run sitemap
```

El script `scripts/generate-sitemap.mjs` escribe `public/sitemap.xml` con todas las URLs de productos. Se ejecuta solo antes de `npm run build` (`prebuild`).

- El SEO por ruta (title, description, canonical, og y JSON-LD de producto/lista) se inyecta con el hook `usePageSeo` en `src/seo.js`.
- La ruta `/checkout` queda marcada como `noindex`.
