# VikingDogs

Tienda React/Vite de productos para perros. Identidad visual en gris azulado → blanco con glassmorphism, estilo redondeado, animaciones (reveal en scroll, marquee, flotaciones) y tipografía Montserrat.

## Ejecutar

```bash
npm install
npm run dev
```

Build de producción (regenera el sitemap automáticamente):

```bash
npm run build
```

## Pagos y contacto

- **Solo pago contra entrega**: se eliminó Mercado Pago y cualquier pago en línea.
- Todos los pedidos se envían a un único endpoint de Formspree (`FORM_ENDPOINT` en `src/data/site.js`).
- WhatsApp: `314 457 2008` (`WHATSAPP_NUMBER` en `src/data/site.js`).
- Instagram: [@vikingdogs](https://www.instagram.com/vikingdogs/) (`INSTAGRAM_URL` en `src/data/site.js`).

## Precios y descuentos

- `src/data/products.js` guarda el **precio de lista** (`price`).
- `src/data/pricing.js` calcula un descuento **determinístico del 20% al 40%** por id de producto (`discountPercent` / `discountedPrice`), redondeado a $100.
- La UI (tarjetas, ficha, carrito, checkout) y el JSON-LD usan el precio descontado con el precio de lista tachado.
- El copy de temporada (`SEASON_LABEL`, `SEASON_RANGE`) se define en `src/data/pricing.js`.

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
