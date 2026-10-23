import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Check, ChevronDown, Menu, Minus, PackageCheck, PawPrint, Percent, Plus, ShoppingBag, Sparkles, Truck, X } from 'lucide-react'
import { IMAGES, LOGO_SRC } from './data/images'
import { PRODUCTS as RAW_PRODUCTS } from './data/products'
import { FORM_ENDPOINT, INSTAGRAM_HANDLE, INSTAGRAM_URL, SITE_NAME, SITE_URL, WHATSAPP_DISPLAY, WHATSAPP_NUMBER, WHATSAPP_URL } from './data/site'
import { discountedPrice, discountPercent, SEASON_LABEL, SEASON_RANGE } from './data/pricing'
import { usePageSeo } from './seo'
import './styles.css'

const PRODUCTS = RAW_PRODUCTS.map((product) => ({
  ...product,
  discountPercent: discountPercent(product.id),
  salePrice: discountedPrice(product.price, product.id),
  image: product.imageKey ? IMAGES[product.imageKey] : null,
  gallery: (product.galleryKeys || []).map((key) => IMAGES[key]).filter(Boolean),
}))

const LOGO = LOGO_SRC

const absoluteUrl = (value) => (value ? (value.startsWith('/') ? `${SITE_URL}${value}` : value) : undefined)

const formatCOP = (value) => value == null ? 'Consultar' : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)

const productUrl = (product) => `${SITE_URL}/producto/${product.id}`

const notifyUrl = (product) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola ${SITE_NAME}, avísame cuando "${product.name}" esté disponible en la tienda.`)}`

const productJsonLd = (product) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.detail,
  image: absoluteUrl(product.image),
  brand: { '@type': 'Brand', name: SITE_NAME },
  url: productUrl(product),
  offers: {
    '@type': 'Offer',
    url: productUrl(product),
    priceCurrency: 'COP',
    ...(product.salePrice != null
      ? { price: product.salePrice, availability: 'https://schema.org/InStock' }
      : { availability: 'https://schema.org/PreOrder' }),
    seller: { '@type': 'Organization', name: SITE_NAME },
  },
})

function useCart() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vikingdogs-cart') || '[]') } catch { return [] }
  })

  useEffect(() => {
    const clean = cart.map((item) => {
      const fresh = PRODUCTS.find((product) => product.id === item.id)
      if (!fresh) return item
      return { ...fresh, quantity: item.quantity }
    })
    localStorage.setItem('vikingdogs-cart', JSON.stringify(clean))
  }, [cart])

  const addToCart = (product, quantity = 1) => setCart((current) => {
    if (product.comingSoon || product.salePrice == null) return current
    const item = current.find((entry) => entry.id === product.id)
    return item ? current.map((entry) => entry.id === product.id ? { ...entry, quantity: entry.quantity + quantity } : entry) : [...current, { ...product, quantity }]
  })
  const changeQuantity = (id, delta) => setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter((item) => item.quantity > 0))
  const removeFromCart = (id) => setCart((current) => current.filter((item) => item.id !== id))
  const clearCart = () => setCart([])
  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.some((item) => item.salePrice == null) ? null : cart.reduce((sum, item) => sum + item.salePrice * item.quantity, 0)
  const total = subtotal
  const savedAmount = cart.reduce((sum, item) => sum + ((item.price || 0) - (item.salePrice || 0)) * item.quantity, 0)

  return { cart, addToCart, changeQuantity, removeFromCart, clearCart, itemsCount, subtotal, total, savedAmount }
}

const CartContext = React.createContext(null)
const useCartContext = () => React.useContext(CartContext)

function useReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-reveal]'))
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('in-view'))
      return undefined
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])
}

function App() {
  const cartState = useCart()
  return <CartContext.Provider value={cartState}><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/catalogo" element={<Catalog />} />
    <Route path="/producto/:slug" element={<ProductPage />} />
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></CartContext.Provider>
}

function InstagramIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
}

function WhatsAppIcon({ size = 22 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg>
}

function Layout({ children }) {
  useReveal()
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { itemsCount, cart, changeQuantity, removeFromCart, total } = useCartContext()
  const location = useLocation()
  const navigate = useNavigate()
  const closeMenu = () => setMenuOpen(false)
  const marqueeText = `${SEASON_LABEL} · ${SEASON_RANGE} en todo el catálogo · Envío gratis en Colombia · Pago contra entrega · Síguenos en Instagram @${INSTAGRAM_HANDLE} · WhatsApp ${WHATSAPP_DISPLAY} ·`

  return <div className="app-shell">
    <div className="announcement"><div className="marquee"><div className="marquee-track"><span>{marqueeText}</span><span aria-hidden="true">{marqueeText}</span></div></div></div>
    <header className="site-header">
      <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú"><Menu size={21} /></button>
      <Link className="brand" to="/" onClick={closeMenu} aria-label="VikingDogs inicio">
        <img className="brand-logo" src={LOGO} alt="" />
        <span>vikingdogs</span>
      </Link>
      <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
        <Link className={location.pathname === '/' ? 'active' : ''} to="/" onClick={closeMenu}>Inicio</Link>
        <Link className={location.pathname.startsWith('/catalogo') ? 'active' : ''} to="/catalogo" onClick={closeMenu}>Catálogo</Link>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" onClick={closeMenu}>Comprar <ArrowRight size={14} /></a>
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" onClick={closeMenu} aria-label={`Instagram ${INSTAGRAM_HANDLE}`}><InstagramIcon size={15} /> @{INSTAGRAM_HANDLE}</a>
      </nav>
      <button className="cart-button" onClick={() => setCartOpen(true)} aria-label="Abrir carrito">
        <ShoppingBag size={19} /><span>Carrito</span>{itemsCount > 0 && <b>{itemsCount}</b>}
      </button>
    </header>
    <main>{children}</main>
    <footer className="site-footer">
      <div><Link className="brand footer-brand" to="/"><img className="brand-logo" src={LOGO} alt="" /><span>vikingdogs</span></Link></div>
      <div className="footer-links">
        <Link to="/catalogo">Catálogo</Link>
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer"><InstagramIcon size={13} /> Instagram @{INSTAGRAM_HANDLE}</a>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp {WHATSAPP_DISPLAY}</a>
        <span>Funza · Cra 19 Bis #9-15</span>
      </div>
      <small>© 2026 VikingDogs · Pago contra entrega · Envío gratis a todo Colombia</small>
      <small className="footer-service">Cuidado premium, paseo y bienestar canino para tu perro. · <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">instagram.com/{INSTAGRAM_HANDLE}</a> · <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp {WHATSAPP_DISPLAY}</a></small>
    </footer>
    {cartOpen && <CartDrawer cart={cart} changeQuantity={changeQuantity} removeFromCart={removeFromCart} total={total} savedAmount={savedAmount} onClose={() => setCartOpen(false)} onCatalog={() => { setCartOpen(false); navigate('/catalogo') }} />}
    <a className="wa-float" href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label={`Escríbenos por WhatsApp ${WHATSAPP_DISPLAY}`}>
      <WhatsAppIcon size={24} /><span>¿Dudas? Escríbenos</span>
    </a>
  </div>
}

function CartDrawer({ cart, changeQuantity, removeFromCart, total, savedAmount, onClose, onCatalog }) {
  return <div className="drawer-layer" onClick={onClose}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
    <div className="drawer-head"><div><span className="eyebrow">Tu selección</span><h2>Carrito</h2></div><button className="icon-button" onClick={onClose} aria-label="Cerrar carrito"><X size={21} /></button></div>
    {cart.length === 0 ? <div className="empty-cart"><div className="empty-icon"><ShoppingBag /></div><h3>Tu carrito está vacío</h3><p>Descubre productos con descuentos de temporada y crea tu ritual de bienestar.</p><button className="button button-primary" onClick={onCatalog}>Explorar catálogo <ArrowRight size={16} /></button></div> : <>
      <div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><Thumb src={item.image} /><div className="cart-item-info"><strong>{item.name}</strong><span className="cart-price">{item.salePrice != null && item.price > item.salePrice && <del>{formatCOP(item.price)}</del>} {formatCOP(item.salePrice)}</span><div className="quantity"><button onClick={() => changeQuantity(item.id, -1)}><Minus size={13} /></button><b>{item.quantity}</b><button onClick={() => changeQuantity(item.id, 1)}><Plus size={13} /></button></div></div><button className="remove" onClick={() => removeFromCart(item.id)} aria-label={`Eliminar ${item.name}`}><X size={15} /></button></div>)}</div>
      {savedAmount > 0 && <div className="saved-note"><Percent size={14} /> Ahorras {formatCOP(savedAmount)} con los descuentos de temporada</div>}
      <div className="drawer-total"><span>Total</span><strong>{formatCOP(total)}</strong></div>
      <Link to="/checkout" className="button button-primary button-wide" onClick={onClose}>Pagar contra entrega <ArrowRight size={16} /></Link>
      <button className="text-button" onClick={onCatalog}>Seguir explorando</button>
    </>}
  </aside></div>
}

function Home() {
  usePageSeo({
    title: 'VikingDogs · Cuidado y Accesorios para Perros',
    description: `Productos prácticos y de alta gama para perros: cuidado, aseo, hidratación y adiestramiento. ${SEASON_LABEL} ${SEASON_RANGE}. Envío gratis en toda Colombia. Pago contra entrega.`,
    path: '/',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: absoluteUrl(LOGO),
        telephone: '+57 314 457 2008',
        areaServed: 'CO',
        sameAs: [INSTAGRAM_URL],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Cra 19 Bis #9-15',
          addressLocality: 'Funza',
          addressRegion: 'Cundinamarca',
          addressCountry: 'CO',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: `${SITE_URL}/`,
      },
    ],
  })
  return <Layout>
    <section className="hero hero-home container">
      <div className="hero-copy" data-reveal>
        <span className="eyebrow"><PawPrint size={14} /> Accesorios para perros · Colombia</span>
        <h1>Todo para el cuidado<br /><em>de tu perro.</em></h1>
        <p className="hero-minimal">Productos prácticos y de alta calidad para consentir a tu mejor amigo canino. Envío gratis a todo el país, pago contra entrega y {SEASON_RANGE} en temporada.</p>
        <div className="hero-actions">
          <Link to="/catalogo" className="button button-primary button-pulse">Ver catálogo con descuentos <ArrowRight size={17} /></Link>
          <a href={WHATSAPP_URL} className="button button-quiet" target="_blank" rel="noreferrer">Comprar por WhatsApp</a>
        </div>
        <div className="hero-trust">
          <span><Truck size={13} /> Envío gratis</span>
          <span><PackageCheck size={13} /> Pago contra entrega</span>
          <span><Percent size={13} /> {SEASON_RANGE} de descuento</span>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer"><InstagramIcon size={13} /> @{INSTAGRAM_HANDLE}</a>
        </div>
      </div>
      <div className="hero-visual" data-reveal>
        <div className="hero-orb hero-float">
          <span className="hero-ring hero-ring-one"></span>
          <span className="hero-ring hero-ring-two"></span>
          <img className="hero-logo" src={LOGO} alt="VikingDogs" />
        </div>
        <span className="hero-discount-badge">{SEASON_RANGE}<small>en temporada</small></span>
        <span className="hero-ship-badge"><Truck size={14} /> Envío gratis a todo Colombia</span>
      </div>
    </section>
    <section className="value-strip" data-reveal><div className="container value-grid">
      <div><Truck /><span><strong>Envío gratis</strong><small>Menos de 5 días</small></span></div>
      <div><PackageCheck /><span><strong>Pago contra entrega</strong><small>Pagas al recibir tu pedido</small></span></div>
      <div><Percent /><span><strong>{SEASON_LABEL}</strong><small>{SEASON_RANGE} en el catálogo</small></span></div>
    </div></section>
    <section className="home-bottom container" data-reveal>
      <div>
        <span className="eyebrow">VikingDogs · {SEASON_LABEL}</span>
        <h2>Descuentos de temporada<br /><em>por tiempo limitado.</em></h2>
        <p className="home-bottom-copy">Aprovecha hasta -40% en accesorios para el cuidado, el aseo y las aventuras de tu perro. Envío gratis y pago contra entrega en todos los pedidos.</p>
      </div>
      <div className="home-bottom-actions">
        <Link to="/catalogo" className="button button-primary button-pulse">Comprar ahora <ArrowRight size={16} /></Link>
        <a href={WHATSAPP_URL} className="button button-quiet" target="_blank" rel="noreferrer">Hablemos por WhatsApp</a>
      </div>
    </section>
  </Layout>
}

function Catalog() {
  const { addToCart, itemsCount } = useCartContext()
  const [notice, setNotice] = useState('')
  const noteTitle = 'Envío gratis en todo el catálogo.'
  const noteText = `${PRODUCTS.length} productos con ${SEASON_RANGE} en temporada · Calidad garantizada · Pago contra entrega.`
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Catálogo VikingDogs',
    itemListElement: PRODUCTS.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: product.name,
      url: productUrl(product),
    })),
  }
  usePageSeo({
    title: 'Catálogo · VikingDogs',
    description: `10 productos para el cuidado, aseo y aventuras de tu perro. ${SEASON_LABEL} ${SEASON_RANGE}. Envío gratis en todos los pedidos. Pago contra entrega.`,
    path: '/catalogo',
    jsonLd: itemListLd,
  })
  const add = (product) => { addToCart(product); setNotice(`${product.shortName} se agregó a tu carrito`); setTimeout(() => setNotice(''), 2400) }
  return <Layout>
    <section className="catalog-hero container" data-reveal>
      <div>
        <span className="eyebrow"><PawPrint size={14} /> VikingDogs · {SEASON_LABEL}</span>
        <h1>Elige su<br /><em>cuidado.</em></h1>
      </div>
      <img className="catalog-hero-logo hero-float" src={LOGO} alt="VikingDogs" />
      <p>{PRODUCTS.length} productos · Envío gratis · {SEASON_RANGE} · Pago contra entrega</p>
    </section>
    <section className="catalog-section container">
      <div className="section-heading" data-reveal><div><span className="eyebrow">Catálogo</span><h2>Productos en oferta</h2></div><span className="stock-note"><span className="stock-dot"></span> Unidades seleccionadas · descuentos de temporada</span></div>
      <div className="product-grid">{PRODUCTS.map((product, index) => <ProductCard key={product.id} product={product} index={index} onAdd={() => add(product)} />)}</div>
      <div className="limited-note" data-reveal><Sparkles size={20} /><div><strong>{noteTitle}</strong><span>{noteText}</span></div><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="underlink">Comprar por WhatsApp <ArrowRight size={15} /></a></div>
    </section>
    <section className="season-section container" data-reveal>
      <div className="season-copy">
        <span className="eyebrow">Ofertas de temporada</span>
        <h2>{SEASON_LABEL}<br /><em>para su mejor amigo.</em></h2>
        <p className="season-lead">Durante la temporada VikingDogs encontrarás descuentos del 20% al 40% en accesorios seleccionados. Sin complicaciones: eliges, pides y pagas cuando llegue a tu puerta.</p>
        <div className="season-pillars">
          <div><span>01</span><strong>{SEASON_RANGE}</strong><small>Descuentos en el catálogo</small></div>
          <div><span>02</span><strong>Contra entrega</strong><small>Pagas al recibir tu pedido</small></div>
          <div><span>03</span><strong>Envío gratis</strong><small>A todo Colombia</small></div>
        </div>
        <p className="season-rhythm">Oferta por tiempo limitado. Consulta disponibilidad y arma la rutina perfecta para tu perro hoy mismo.</p>
        <div className="season-actions">
          <Link to="/catalogo" className="button button-light button-pulse">Ver todas las ofertas <ArrowRight size={16} /></Link>
          <a href={WHATSAPP_URL} className="button button-outline" target="_blank" rel="noreferrer">Comprar por WhatsApp</a>
        </div>
      </div>
      <div className="season-visual">
        <span className="season-ring season-ring-one"></span>
        <span className="season-ring season-ring-two"></span>
        <img className="season-logo hero-float" src={LOGO} alt="VikingDogs" />
        <div className="season-badge-pop">-20%<span>a</span>-40%</div>
      </div>
    </section>
    {notice && <div className="toast"><Check size={16} /> {notice} · <span>{itemsCount} {itemsCount === 1 ? 'producto' : 'productos'}</span></div>}
  </Layout>
}

function ProductMedia({ product, src, className = '' }) {
  if (src) return <img src={src} alt={product.name} />
  return <div className={`product-placeholder ${className}`}><img src={LOGO} alt="" /><span>{product.comingSoon ? 'Próximamente' : 'VikingDogs'}</span></div>
}

function Thumb({ src, alt = '' }) {
  if (src) return <img src={src} alt={alt} />
  return <div className="thumb-empty" aria-hidden="true"><img src={LOGO} alt="" /></div>
}

function ProductCard({ product, index, onAdd }) {
  const soon = Boolean(product.comingSoon)
  return <article tabIndex="0" data-reveal className={`product-card reveal${soon ? ' card-soon' : ''}`} style={{ '--d': `${Math.min(index * 70, 420)}ms` }}>
    <Link to={`/producto/${product.id}`} className="product-image"><ProductMedia product={product} src={product.image} /><span className="product-number">{String(index + 1).padStart(2, '0')}</span><span className="shipping-pill">Envío gratis</span>{!soon && product.discountPercent != null && <span className="discount-pill">-{product.discountPercent}%</span>}{soon && <span className="soon-badge">Próximamente</span>}<div className="product-hover"><span className="hover-label">Beneficios</span><strong>{product.hoverTitle}</strong><p>{product.hoverText}</p><ul>{product.benefits.map((benefit) => <li key={benefit}><Check size={13} /> {benefit}</li>)}</ul><span className="hover-cta">{soon ? 'Avísame' : 'Ver producto'} <ArrowRight size={13} /></span></div></Link>
    <div className="product-content"><span className="product-category">{product.category}</span><Link to={`/producto/${product.id}`}><h3>{product.name}</h3></Link><div className="product-bottom">{soon ? <div><strong className="soon-label">Próximamente</strong><span className="pay-note">Avísame por WhatsApp</span></div> : <div className="price-stack">{product.price > product.salePrice && <del className="price-old">{formatCOP(product.price)}</del>}<strong>{formatCOP(product.salePrice)}</strong><span className="pay-note">Pago contra entrega · envío gratis</span></div>}{soon ? <a className="add-button" href={notifyUrl(product)} target="_blank" rel="noreferrer" aria-label={`Avisarme cuando ${product.name} esté disponible`}><ArrowRight size={19} /></a> : <button className="add-button" onClick={onAdd} aria-label={`Agregar ${product.name} al carrito`}><Plus size={19} /></button>}</div></div>
  </article>
}

function ProductPage() {
  const { slug } = useParams()
  const product = PRODUCTS.find((item) => item.id === slug)
  const { addToCart, cart } = useCartContext()
  const navigate = useNavigate()
  const location = useLocation()
  const cartItem = cart.find((item) => item.id === product?.id)
  const fromCart = Boolean(location.state?.fromCart)
  const [quantity, setQuantity] = useState(() => fromCart ? cartItem?.quantity || 1 : 1)
  const [selectedImage, setSelectedImage] = useState(product?.image)
  const [added, setAdded] = useState(false)
  const soon = Boolean(product?.comingSoon)
  usePageSeo({
    title: product ? `${product.name} · VikingDogs` : 'Producto · VikingDogs',
    description: product ? `${product.detail} Envío gratis en todos los pedidos. Pago contra entrega.` : 'Producto VikingDogs.',
    path: product ? `/producto/${product.id}` : '/catalogo',
    jsonLd: product ? productJsonLd(product) : null,
  })
  if (!product) return <Navigate to="/catalogo" replace />
  const directBuy = () => { if (!fromCart) addToCart(product, quantity); navigate('/checkout') }
  const add = () => { addToCart(product, quantity); setAdded(true); setTimeout(() => setAdded(false), 2200) }
  const gallery = product.gallery.length ? product.gallery : [product.image].filter(Boolean)
  return <Layout><section className="product-page container"><Link to="/catalogo" className="back-link">← Catálogo</Link><div className="product-detail">
    <div data-reveal><div className="detail-image"><ProductMedia product={product} src={selectedImage} /><span className="detail-stamp"><PawPrint size={16} /> vikingdogs</span>{!soon && product.discountPercent != null && <span className="discount-pill detail-discount">-{product.discountPercent}%</span>}</div>{gallery.length > 1 && <div className="detail-gallery">{gallery.map((image, index) => <button className={selectedImage === image ? 'selected' : ''} key={`${image}-${index}`} onClick={() => setSelectedImage(image)}><img src={image} alt={`${product.name} vista ${index + 1}`} /></button>)}</div>}</div>
    <div className="detail-copy" data-reveal><span className="eyebrow">{product.category}</span><span className="detail-badge">{product.badge}</span><h1>{product.name}</h1><p className="detail-description">{product.detail}</p><ul className="benefit-list">{product.benefits.map((benefit) => <li key={benefit}><Check size={15} /> {benefit}</li>)}</ul><div className="detail-price">{soon ? <strong className="soon-label">Próximamente</strong> : <div className="price-line">{product.price > product.salePrice && <del>{formatCOP(product.price)}</del>}<strong>{formatCOP(product.salePrice)}</strong></div>}<span className="free-shipping">Envío gratis</span><span>{soon ? 'Avísanos por WhatsApp' : 'Pago contra entrega'}</span></div>{soon ? <div className="detail-actions"><a className="button button-primary buy-button" href={notifyUrl(product)} target="_blank" rel="noreferrer">Avísame cuando llegue <ArrowRight size={17} /></a></div> : <div className="detail-actions"><div className="quantity large"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={15} /></button><b>{quantity}</b><button onClick={() => setQuantity(quantity + 1)}><Plus size={15} /></button></div><button className="button button-primary buy-button button-pulse" onClick={directBuy}>Comprar · pagar contra entrega <ArrowRight size={17} /></button><button className="button button-outline cart-add" onClick={add}><ShoppingBag size={17} /> Agregar</button></div>}{added && <div className="added-message"><Check size={16} /> Agregado al carrito</div>}</div>
  </div>
  <div className="product-why" data-reveal>
    <div className="product-why-main"><span className="eyebrow">Por qué le encantará</span><h2>{product.whyTitle}</h2><p>{product.whyText}</p></div>
    <div className="product-why-grid">
      <div><span className="info-label">Ideal para</span><strong>{product.idealFor}</strong></div>
      <div><span className="info-label">Ritual de uso</span><strong>{product.ritual}</strong></div>
      <div><span className="info-label">Incluye</span><strong>{product.included}</strong></div>
    </div>
  </div>
  <div className="detail-cta-strip" data-reveal><div><strong>{SEASON_LABEL}: {SEASON_RANGE}</strong><span>Envío gratis a todo Colombia · Pago contra entrega</span></div><div className="detail-cta-actions"><a className="button button-primary" href={WHATSAPP_URL} target="_blank" rel="noreferrer"><WhatsAppIcon size={16} /> WhatsApp {WHATSAPP_DISPLAY}</a><a className="button button-quiet" href={INSTAGRAM_URL} target="_blank" rel="noreferrer"><InstagramIcon size={15} /> @{INSTAGRAM_HANDLE}</a></div></div>
  </section></Layout>
}

function CheckoutPage() {
  const { cart, total, clearCart } = useCartContext()
  const navigate = useNavigate()
  const product = cart[0] || PRODUCTS[0]
  usePageSeo({
    title: 'Checkout · VikingDogs',
    description: 'Confirma tu pedido VikingDogs. Pago contra entrega.',
    path: '/checkout',
    noindex: true,
  })
  if (!cart.length) return <Layout><section className="checkout-empty container"><span className="eyebrow">VikingDogs</span><h1>Tu carrito está vacío</h1><p>Agrega productos para continuar con tu pedido.</p><Link className="button button-primary" to="/catalogo">Ver catálogo <ArrowRight size={16} /></Link></section></Layout>
  return <Layout><section className="checkout-page container"><Checkout product={product} quantity={cart[0].quantity} cart={cart} total={total} standalone onClose={() => navigate(-1)} onSuccess={clearCart} /></section></Layout>
}

function Checkout({ product, quantity, cart, total, standalone = false, onClose, onSuccess }) {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const isSingleItemPurchase = cart.length === 1 && cart[0].quantity >= 1
  const singleProduct = isSingleItemPurchase ? cart[0] : null

  const [form, setForm] = useState({
    phone: '',
    email: '',
    firstName: '',
    lastName: '',
    document: '',
    tag: '',
    providerNotes: '',
    internalNotes: '',
    officeDelivery: false,
    department: '',
    addressInfo: '',
    payment: 'Pago contra entrega'
  })

  const update = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const submit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const summary = cart.map((item) => `${item.name} x${item.quantity}`).join(' | ') || `${product.name} x${quantity}`
    const payload = {
      ...form,
      _replyto: form.email,
      phone: `+57 ${form.phone}`,
      _subject: `Nuevo pedido VikingDogs — ${form.firstName} ${form.lastName} (Pago contra entrega)`,
      products: summary,
      total: formatCOP(total),
      shipping: 'Envío gratis',
      source: 'Tienda online VikingDogs'
    }

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!response.ok) throw new Error('formspree')
      setSuccess(true)
      onSuccess?.()
    } catch {
      setError('No pudimos enviar el pedido. Revisa tu conexión o escríbenos por WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  return <div className={standalone ? 'checkout-page-inner' : 'checkout-layer'}><div className="checkout-modal"><button className="modal-close" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>{success ? <div className="success-state"><div className="success-icon"><Check /></div><span className="eyebrow">Pedido recibido</span><h2>Gracias por elegir<br /><em>VikingDogs.</em></h2><p>Recibimos tus datos. Te contactaremos muy pronto para confirmar tu pedido y coordinar la entrega. Pagas contra entrega al recibirlo.</p><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="button button-primary" style={{ marginBottom: '12px' }}><WhatsAppIcon size={16} /> Seguir mi compra por WhatsApp</a><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="button button-quiet" style={{ marginBottom: '12px' }}><InstagramIcon size={15} /> @{INSTAGRAM_HANDLE}</a><button className="text-button" onClick={() => navigate('/catalogo')}>Volver al catálogo</button></div> : <><div className="checkout-header"><span className="eyebrow">Último paso</span><h2>Confirma tu pedido</h2><p>{isSingleItemPurchase ? `${singleProduct.name} · ${singleProduct.quantity} ${singleProduct.quantity === 1 ? 'unidad' : 'unidades'}` : 'Varios productos en carrito'} · Pago contra entrega</p></div><div className="checkout-order-summary">{cart.map((item) => <div className="checkout-order-item" key={item.id}><Thumb src={item.image} /><span><strong>{item.name}</strong><small>Cantidad: {item.quantity} · Envío gratis</small></span><b>{item.salePrice != null && item.price > item.salePrice && <del>{formatCOP(item.price)}</del>} {formatCOP(item.salePrice)}</b></div>)}</div><form onSubmit={submit}>
        <div className="form-section"><h3>Datos del cliente para envío</h3><div className="form-grid">
          <label>Teléfono<div className="phone-field"><span>(+57)</span><input required name="phone" type="tel" value={form.phone} onChange={update} placeholder="300 000 0000" /></div></label>
          <label>Correo<input required name="email" type="email" value={form.email} onChange={update} placeholder="tu@correo.com" /></label>
          <label>Nombre<input required name="firstName" value={form.firstName} onChange={update} placeholder="Tu nombre" /></label>
          <label>Apellido<input required name="lastName" value={form.lastName} onChange={update} placeholder="Tu apellido" /></label>
          <label>Cédula o documento<input required name="document" value={form.document} onChange={update} placeholder="Número de documento" /></label>
          <label>Etiqueta <span className="optional">(separadas por coma)</span><input name="tag" value={form.tag} onChange={update} placeholder="Casa, trabajo" /></label>
        </div></div>
        <div className="form-section"><h3>Dirección de entrega</h3>
          <label>Departamento<select required name="department" value={form.department} onChange={update}><option value="">Selecciona una opción</option><option>Bogotá D.C.</option><option>Cundinamarca</option><option>Antioquia</option><option>Valle del Cauca</option><option>Atlántico</option><option>Santander</option><option>Otro departamento</option></select><ChevronDown className="select-icon" size={16} /></label>
          <label>Información adicional de la dirección<textarea required name="addressInfo" value={form.addressInfo} onChange={update} placeholder="Dirección, barrio, ciudad y referencias" rows="3" /></label>
          <label className="check-row"><input type="checkbox" name="officeDelivery" checked={form.officeDelivery} onChange={update} /><span>Entregar en una oficina de la transportadora</span></label>
          <div className="form-grid">
            <label>Notas para el proveedor<textarea name="providerNotes" value={form.providerNotes} onChange={update} placeholder="Indicaciones para la entrega" rows="2" /></label>
            <label>Notas internas<textarea name="internalNotes" value={form.internalNotes} onChange={update} placeholder="Algo más que debamos saber" rows="2" /></label>
          </div>
        </div>
        <div className="form-section"><h3>Método de pago</h3>
          <div className="payment-static"><Check size={18} /><div><strong>Pago contra entrega</strong><small>Pagas en efectivo al recibir tu pedido en casa u oficina. Sin pagos en línea, sin anticipos.</small></div></div>
        </div>
        {error && <div className="form-error">{error}</div>}
        <div className="checkout-total"><span>Total del pedido</span><strong>{formatCOP(total)}</strong></div>
        <button disabled={submitting} className="button button-primary button-wide submit-button button-pulse" type="submit">{submitting ? 'Enviando pedido y datos…' : 'Confirmar pedido · Pago contra entrega'} {!submitting && <ArrowRight size={17} />}</button>
        <p className="secure-note">Tus datos y pedido se envían de forma segura a Formspree. Envío gratis a todo Colombia.</p>
        <p className="secure-note">¿Dudas? Escríbenos al WhatsApp {WHATSAPP_DISPLAY} o síguenos en Instagram @{INSTAGRAM_HANDLE}.</p>
      </form></>}</div></div>
}

function Root() { return <BrowserRouter><App /></BrowserRouter> }
createRoot(document.getElementById('root')).render(<Root />)
