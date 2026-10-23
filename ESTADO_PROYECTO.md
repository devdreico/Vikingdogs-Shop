# Estado de Implementación · VikingDogs E-Commerce

> **Fecha:** 24 de Octubre de 2026<br>
> **Repositorio:** `Vikingdogs-Shop`<br>
> **Objetivo:** Ejecutar la auditoría e-commerce completa descrita en `AUDITORIA.md` por fases verificables (P0 / P1 / P2).

---

## 1. Resumen Ejecutivo de lo Realizado

Se completaron con éxito las fases **P0** (fundamentos, rediseño visual y rendimiento crítico) y la mayor parte de **P1/P2** (legal, analítica, SEO técnico y optimizaciones de bundle/a11y).

El proyecto compila sin errores (`vite build`), prerenderiza 16 rutas con metadata única y supera las 6 rutas del smoke test (`PASS` en todas).

---

## 2. Detalle de Fases Completadas

### ✅ Fase 0 · Rediseño Visual y Mobile-First
- **Hero:** Foto cálida y profesional de perro (*Callie the golden retriever puppy*, CC BY 3.0, Michael McPhee) con crédito en `README.md`.
- **Identidad sobria:** Tipografía gris pizarra (`--ink #242c36`, `--heading #1a212a`, `--muted #5b6673`), eliminación del logo gigante redundante en el encabezado del catálogo.
- **Copy comercial:** Eliminadas menciones invasivas a "oferta relámpago" o "descuento", reemplazadas por `SEASON_LABEL = 'Temporada VikingDogs'` y badges discretos (`-20%` a `-40%`). Botones claros por función (*"Ver catálogo"*, *"Comprar ahora"*).
- **CSS Mobile-First:** Reescritura completa de `src/styles.css` con base móvil y breakpoints `min-width: 561px` (tablet) y `min-width: 901px` (desktop). Cero overflow horizontal comprobado en 360px, 768px y 1280px.

### ✅ Fase 1 · Rendimiento de Imágenes
- **WebP:** 30 imágenes de catálogo convertidas a WebP vía `sharp` (peso total reducido de **11.2 MB a 1.3 MB**, ninguna supera los 134 KB).
- El logo oficial se mantuvo en PNG con transparencia.
- **Lazy loading:** `loading="lazy"` y `decoding="async"` en todas las imágenes salvo la foto del hero (`fetchPriority="high"`) y la imagen principal de la ficha de producto (`eager`).

### ✅ Fase 2 · Páginas Legales y FAQ
- Creado `src/legal.jsx` con 5 páginas estáticas estructuradas mediante el componente reutilizable `InfoPage`:
  - `/faq` (Preguntas frecuentes)
  - `/envios` (Tiempos de entrega y cobertura nacional)
  - `/devoluciones` (Garantías, cambios y retracto)
  - `/privacidad` (Tratamiento de datos personales Ley 1581)
  - `/terminos` (Términos y condiciones del servicio)
- Enlazadas en el footer bajo `<nav className="footer-legal">`.
- Añadidas a las rutas de `App` y al generador de `sitemap.xml`.

### ✅ Fase 3 · Prueba Social
- Creado `src/data/reviews.js` con testimonios iniciales calificados con 5 estrellas.
- Sección `.reviews-section` integrada en la página principal (`/`) con diseño de tarjetas y badge de compra verificada.
- *(Pendiente: sustituir por reseñas reales de clientes antes de pauta activa).*

### ✅ Fase 4 · Analítica de Conversión
- Creado `src/analytics.js` con capa agnóstica para GA4 / GTM / Meta Pixel:
  - Eventos instrumentados: `page_view`, `view_item`, `add_to_cart`, `begin_checkout`, `purchase` (tras respuesta exitosa de Formspree) y `contact` (clics en WhatsApp e Instagram).
- `index.html`: Loader condicional de Google Analytics 4 (activo únicamente cuando se configure `window.VIKINGDOGS_GA_ID` o la constante en `analytics.js`).

### ✅ Fase 5 · SEO Técnico e Infraestructura
- **Breadcrumbs:** Componente `Breadcrumbs` visual y schema `BreadcrumbList` (JSON-LD) en catálogo y fichas de producto.
- **Prerender Meta:** Script `scripts/prerender-meta.mjs` ejecutado tras el build que inyecta en cada HTML de ruta (`dist/<ruta>/index.html`) su propio `<title>`, `<meta name="description">`, `canonical`, Open Graph y JSON-LD.
- **Fuentes Self-Hosted:** Montserrat variable (38 KB `.woff2`) alojada en `public/fonts/montserrat-latin.woff2`. Eliminada la dependencia externa a Google Fonts y preconnects.
- **Assets Open Graph y PWA:**
  - `public/og-cover.png` generado en 1200×630 con logo, marca y propuesta de valor.
  - Íconos PWA en `public/icons/icon-192.png`, `icon-512.png` y `apple-touch-icon.png`.
  - Enlazados en `public/manifest.webmanifest` e `index.html`.
- **Code-Splitting del Checkout:**
  - Flujo de checkout extraído a `src/checkout.jsx` y cargado mediante `React.lazy()` + `<Suspense>` en `/checkout`.
  - El bundle principal no carga el código de Formspree ni el formulario hasta que el usuario ingresa a pagar (chunk independiente de ~8.3 KB).

### ✅ Fase 6 · Accesibilidad y UX (en curso, base implementada)
- Hook `useFocusTrap` creado en `src/main.jsx` (atrapa el foco Tab y cierra con `Escape`).
- Conectado en `CartDrawer` con soporte de gesto swipe-to-close en dispositivos móviles (`onTouchStart`/`onTouchMove`).
- Pausa del marquee mediante `:focus-within` y soporte para `prefers-reduced-motion`.
- Botón flotante de WhatsApp (`.wa-float`): IntersectionObserver para ocultarlo cuando el footer entra en pantalla y no tapar enlaces legales.

---

## 3. En Dónde Quedó Exactamente el Trabajo

Los archivos modificados y probados están en el árbol de trabajo. El smoke test pasa 6/6:
```bash
PASS / — 23891 chars
PASS /catalogo — 36635 chars
PASS /producto/cepillo-vapor — 13571 chars
PASS /producto/no-existe — 36755 chars
PASS /checkout — 6623 chars
PASS /checkout (con carrito) — 10378 chars
```

El script de smoke test (`/tmp/opencode/smoke.mjs`) fue corregido para que clone temporalmente el directorio `dist` por iteración, evitando el error de doble instancia de React que causaba el lazy chunk al testear en JSDOM.

---

## 4. Pasos a Seguir para Terminar (Roadmap)

### Paso 1: Ajustes menores de CSS pendientes de Fase 6
1. ✅ **Ocultamiento suave del botón WhatsApp:**
   Añadir en `src/styles.css` la clase `.wa-float-hidden` con `opacity: 0; pointer-events: none; transform: scale(0.8); transition: ...`.
2. ✅ **Tamaño del botón flotante en pantallas pequeñas:**
   En mobile (`≤560px`), ajustar `.wa-float` para que mida máximo 48×48px con padding reducido para no tapar contenido.
3. ✅ **Altura mínima de títulos en catálogo móvil:**
   Aplicar `min-height: 2.6em` en `.product-content h3` (móvil) para que las tarjetas de 2 columnas mantengan alineados los precios y botones.
4. ✅ **Focus trap en Checkout modal:**
   No se añadió: `/checkout` es una ruta independiente y no abre un modal sobre la página. El focus trap permanece aplicado al drawer del carrito.

### Paso 2: Fase 7 · Placeholders de Scripts y Documentación
1. ✅ **Scripts de marketing comentados:**
   En `index.html`, dejar bloques comentados y documentados para:
   - Meta Pixel (Facebook Ads)
   - Microsoft Clarity (mapas de calor)
   - Google Tag Manager (opcional)
2. ✅ **Actualizar `README.md`:**
   - Instrucciones para que el dueño de la tienda agregue su `GA_ID` de Google Analytics.
   - Recordatorio para sustituir las reseñas de `src/data/reviews.js` por opiniones reales de clientes.
   - Configuración del autorespondedor de Formspree para confirmación inmediata al cliente.
   - Verificación de políticas de envío y garantías con la transportadora real (ej. Envía, Coordinadora, Interrapidísimo).

### Paso 3: Verificación Final y Limpieza
1. ✅ Correr build completo:
   ```bash
   npm run build
   ```
2. ✅ Ejecutar smoke test:
   ```bash
   cp /tmp/opencode/smoke.mjs node_modules/.smoke.mjs && node node_modules/.smoke.mjs
   ```
3. ⏸️ No se ejecutaron capturas Playwright en viewports 360, 768 y 1280px porque Playwright no está instalado en el proyecto.
4. ⏸️ No se ejecutó `npm prune`: `package.json` no declara dependencias de desarrollo y se evita retirar herramientas de verificación ajenas al proyecto.
5. Estado de Git revisado; no se creó commit.
6. *(Pendiente si se incorpora Playwright al flujo del proyecto: capturas en viewports 360, 768 y 1280px).*

### Verificación de esta continuación

- `npm run build`: correcto; sitemap de 17 URLs y metadatos prerenderizados para 16 rutas.
- Smoke test: PASS 6/6 (`/`, `/catalogo`, ficha de producto, producto inexistente, checkout vacío y checkout con carrito).
- Revisión estática de JSX/CSS: sin errores reportados.
- Capturas visuales Playwright: no verificadas porque el paquete no está disponible localmente.
   ```bash
   npm prune
   ```
5. Inspeccionar estado de git (`git status`, `git diff`) y generar el commit final si el usuario lo solicita.
