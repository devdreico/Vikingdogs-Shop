# Auditoría e-commerce · VikingDogs

**Fecha:** octubre 2026 · **Alcance:** tienda SPA (React + Vite) en `vikingdogs.presentto.online` · **Mercado:** Colombia, pago contra entrega, COP.

---

## 1. Resumen ejecutivo

VikingDogs es una tienda de 10 productos para perros con un modelo de negocio claro (COD + envío gratis + Instagram/WhatsApp como canales). La base técnica es sólida para una tienda en etapa temprana: React + Vite, checkout vía Formspree, carrito persistente, meta/OG/JSON-LD básicos, `robots.txt` y `sitemap.xml` completos, y una capa de accesibilidad (movimiento reducido, `focus-visible`, etiquetas ARIA).

**Fortalezas principales**
- Propuesta de valor inmediata: envío gratis, pago contra entrega y rango de temporada `-20% a -40%` visibles en el primer fold.
- Mobile-first verificado: 10 fichas de producto + home + catálogo probados a 360/768/1280 px sin desbordamiento horizontal, targets táctiles ≥44 px y formulario con inputs a 16 px (evita el zoom automático en iOS).
- Confianza operativa: WhatsApp flotante, Instagram `@vikingdogs`, dirección física (Funza) y teléfono en el JSON-LD.
- Copy sobrio y consistente: sin palabras agresivas de "oferta/descuento" en botones ni títulos; los descuentos se comunican con badges numéricos (`-33%`) y el rango de temporada.

**Riesgos principales (ver P0)**
1. Rendimiento de imágenes: archivos de ~220 KB a ~1,17 MB, **12 MB** en `assets/`, sin `loading="lazy"` ni formatos modernos.
2. El SEO por ficha se inyecta con JavaScript (`usePageSeo`): las previews sin JS (WhatsApp, algunos bots) reciben el HTML inicial de home. Conviene prerender las rutas de producto.
3. Sin analítica: no hay forma de medir visitas, carritos iniciados ni pedidos enviados.

---

## 2. Metodología

- Revisión de código (`src/main.jsx`, `src/styles.css`, `src/data/*`, `index.html`, `public/`).
- Capturas Playwright de 36 rutas × 3 viewports (360×800, 768×1024, 1280×900) con scroll previo para disparar animaciones de entrada; chequeo automático de desbordamiento horizontal, errores JS, altura de targets y presencia de la foto del hero.
- Build de producción analizado (`vite build`): JS 311 KB (98 KB gzip), CSS 44 KB (9 KB gzip), imágenes sin comprimir adicional.
- Revisión de SEO técnico: meta tags, Open Graph, JSON-LD, sitemap (12 URLs: home, catálogo y las 10 fichas), robots.

---

## 3. Hallazgos por área

### 3.1 UX / conversión (CRO)

| # | Hallazgo | Prioridad |
|---|----------|-----------|
| C1 | **Sin prueba social.** No hay reseñas, testimonios ni contador de clientes. Es el mayor freno de conversión en COD. | P0 |
| C2 | Las 3 fichas "próximamente" enlazan a WhatsApp sin capturar el interés de forma estructurada (lista de espera). | P1 |
| C3 | Carrito sin persistencia visual del ahorro en el resumen de checkout (sí existe en el drawer). | P2 |
| C4 | No hay urgencia real verificable (stock, cierre de temporada con fecha). El copy dice "por tiempo limitado" sin fecha. | P1 |
| C5 | Checkout de un solo paso bien resumido; falta indicador de paso/progreso y resumen pegajoso en móvil. | P2 |
| C6 | Productos sin guía de tallas/medidas ni "cómo se usa" en ficha (aparece solo el bloque genérico "Por qué le encantará"). | P1 |

### 3.2 Mobile

| # | Hallazgo | Prioridad |
|---|----------|-----------|
| M1 | Ficha de producto mobile-first completa: imagen `aspect-ratio 1/1`, panel oscuro para precio/CTA, botones apilados ≥44 px, cantidad táctil. | ✔ Hecho |
| M2 | El botón flotante de WhatsApp tapa texto en pantallas de 360 px (zona del párrafo del hero y de la 2ª tarjeta del catálogo). | P1 |
| M3 | Grilla del catálogo a 2 columnas con tarjetas de ~160 px de imagen: correcto, pero los nombres largos ocupan 3 líneas y empujan el precio. | P2 |
| M4 | El drawer del carrito ocupa todo el ancho en 360 px (esperado) pero sin gesto de cierre; solo la X. | P2 |

### 3.3 Rendimiento

| # | Hallazgo | Prioridad |
|---|----------|-----------|
| R1 | **Imágenes sin optimizar:** desde ~220 KB hasta ~1,17 MB; ~12 MB totales. Convertir a WebP/AVIF con variantes `srcset` (objetivo: <150 KB por imagen de producto). | P0 |
| R2 | **Sin `loading="lazy"`** en ninguna imagen (0 ocurrencias). Añadir lazy a todo salvo la foto del hero (`fetchpriority=high` ya está). | P0 |
| R3 | Google Fonts vía `@import` en CSS (cadena de render bloqueada). Se mitigó con `preconnect`; mejor aún: auto-hospedar WOFF2 subset. | P1 |
| R4 | JS bundle único de 311 KB (98 KB gzip) sin code-splitting por ruta. Con React Router, `React.lazy` en `/checkout` basta para el primer load. | P1 |
| R5 | El `manifest.webmanifest` existe pero no hay `apple-touch-icon` ni `screenshots`. | P2 |

### 3.4 SEO técnico

| # | Hallazgo | Prioridad |
|---|----------|-----------|
| S1 | **SEO por ruta ya existe** (`usePageSeo` inyecta title, descripción, canonical, OG y JSON-LD por ficha). El matiz: es inyección client-side; Google renderiza JS, pero los crawlers sin JS (previews de WhatsApp/mensajería, algunos bots) solo reciben el HTML inicial de home. El prerender/SSG de `/producto/*` sigue siendo el siguiente salto de calidad. | P1 |
| S2 | JSON-LD `Product` + `Offer` (precio COP, `InStock`/`PreOrder`, seller) ya se inyecta por ficha. ✔ Falta ampliarlo con `aggregateRating` cuando existan reseñas (ver C1). | ✔ Hecho |
| S3 | Falta `BreadcrumbList`. | P1 |
| S4 | Falta `hreflang`/`og:locale` alternos (no aplica aún: un solo idioma/mercado). | P2 |
| S5 | `sitemap.xml` completo (12 URLs) y `robots.txt` correctos. ✔ | ✔ Hecho |
| S6 | Favicon y `preconnect` de fuentes añadidos. Falta imagen OG dedicada 1200×630 (hoy se usa el logo transparente, legible pero no óptimo en previews). | P1 |

### 3.5 Accesibilidad

| # | Hallazgo | Prioridad |
|---|----------|-----------|
| A1 | `prefers-reduced-motion` desactiva animaciones. ✔ | ✔ Hecho |
| A2 | `focus-visible` en tarjetas; botones con `aria-label` en controles de carrito. ✔ | ✔ Hecho |
| A3 | Contraste: la paleta gris azulada sobre fondo claro quedó con `--ink #242c36` y `--muted #5b6673` (AA en cuerpo de texto). Los textos claros viven solo sobre fondos oscuros; el panel de la ficha móvil garantiza ese contexto. | ✔ Hecho |
| A4 | El marquee superior no tiene `aria-hidden` ni pausa para lectores de pantalla (se pausa con hover, no con foco). | P1 |
| A5 | Carrito y checkout modales sin trap de foco ni `role="dialog"` + `aria-modal`. | P1 |
| A6 | Imágenes de producto con `alt` = nombre del producto (aceptable); la foto del hero tiene alt descriptivo. ✔ | ✔ Hecho |

### 3.6 Confianza y legal

| # | Hallazgo | Prioridad |
|---|----------|-----------|
| L1 | **Sin página de políticas** (envíos, devoluciones, privacidad, términos). Obligatorias para Meta/Google Ads y para reducir tickets de "¿y si no me gusta?". | P0 |
| L2 | Sin FAQ visible (tiempos de entrega, zonas, pagos). El footer repite datos de contacto pero no resuelve objeciones. | P1 |
| L3 | Checkout Formspree: no hay confirmación automática al cliente por correo; la confirmación depende de la respuesta del negocio. | P1 |
| L4 | Precios tachados sin política de referencia pública; en temporada es aceptable, pero conviene una nota "precio de lista" en la ficha. | P2 |
| L5 | Crédito de la fotografía del hero (CC BY 3.0) añadido al README. Las imágenes de producto deben pasar una revisión de licencias/uso comercial. | P1 |

### 3.7 Analítica y datos

| # | Hallazgo | Prioridad |
|---|----------|-----------|
| D1 | **Sin analytics.** Instalar GA4 o Plausible con eventos: `view_item`, `add_to_cart`, `begin_checkout`, `purchase` (custom en Formspree success). | P0 |
| D2 | Sin píxel de Meta (Catalog/CAPI) ni evento `Lead` de WhatsApp. | P1 |
| D3 | Sin Heatmap/session recording (Hotjar/Clarity) para validar el nuevo diseño mobile. | P2 |

---

## 4. Prioridades

### P0 — hacer primero (impacto directo en ventas o visibilidad)
1. Optimizar imágenes a WebP/AVIF + `loading="lazy"` (R1, R2).
2. Prerender/SSG de las rutas de producto para que los previews sin JS (WhatsApp, bots) reciban meta única (S1) + `BreadcrumbList` (S3).
3. Analítica con embudo básico (D1).
4. Páginas de políticas y FAQ mínimas (L1, L2 parcial).
5. Prueba social: aunque sea 3 testimonios reales o fotos de clientes en Instagram embebidas (C1).

### P1 — segundo sprint
6. Code-splitting de checkout (R4) + auto-hospedar fuentes (R3).
7. Breadcrumbs + hreflang no aplica; imagen OG 1200×630 (S3, S6).
8. Ajustar flotante de WhatsApp para no tapar contenido en 360 px (M2).
9. Trap de foco en drawer/checkout (A5); pausa del marquee con foco (A4).
10. Confirmación automática de pedido por correo (L3).
11. Revisión de licencias de imágenes de producto (L5).

### P2 — mejorar continuamente
12. Lista de espera estructurada para "próximamente" (C2).
13. Guía de medidas en fichas (C6), resumen pegajoso en checkout móvil (C5).
14. Micro-ajustes de grilla y cierre por gesto del drawer (M3, M4).
15. Manifest/iconos iOS (R5), heatmap (D3), píxel Meta (D2).

---

## 5. Roadmap sugerido

| Sprint | Objetivo | Ítems |
|--------|----------|-------|
| **S1 (1 semana)** | Velocidad + medición | R1, R2, D1, L1 |
| **S2 (1–2 semanas)** | SEO de producto + confianza | S1, S3, C1, L2, L3 |
| **S3 (1 semana)** | Pulido mobile/a11y | M2, A4, A5, R3, R4, S6 |
| **Continuo** | Iterar con datos | D2, D3, C2, C5, C6, M3, M4 |

**Métricas a mirar tras S1:** LCP en 4G simulado (<2,5 s), tasa de rebote del catálogo, inicio de checkout / visitas del catálogo, pedidos confirmados / checkout iniciado.

---

## 6. Cambios ya aplicados en esta ronda

- Foto real de perros (CC BY 3.0) en el hero central del home; logo vikingdogs se conserva en header, footer y sección de temporada.
- Logo eliminado del hero del catálogo.
- Botones y textos sobrios por función ("Ver catálogo", "Comprar ahora", "Escríbenos"); el descuento se comunica solo con badges numéricos y el rango `-20% a -40%`.
- Tipografía más gris oscura (`--ink #242c36`, `--heading #1a212a`, `--muted #5b6673`).
- CSS reescrito mobile-first (base móvil + `min-width: 561px` y `901px`); ficha de producto corregida en 360 px (imagen fluida, CTA apilado, panel oscuro para precio).
- Verificación: build de producción OK; 36 capturas Playwright (3 viewports) sin desbordamiento horizontal ni errores JS; targets táctiles ≥44 px; smoke test DOM 6/6.
