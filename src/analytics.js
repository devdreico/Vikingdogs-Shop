const GA_ID = '' // Pon aquí tu ID de Google Analytics (G-XXXXXXXXXX). Vacío = analítica desactivada.

export function track(event, params = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...params, ts: Date.now() })
  if (typeof window.gtag === 'function' && GA_ID) {
    window.gtag('event', event, params)
  }
}

export function trackPurchase({ value, items = [] }) {
  track('purchase', { currency: 'COP', value, items })
}

export function productItem(product, quantity = 1) {
  return {
    item_id: product.id,
    item_name: product.name,
    currency: 'COP',
    price: product.salePrice ?? product.price ?? 0,
    quantity,
  }
}
