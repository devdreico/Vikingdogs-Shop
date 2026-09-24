import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Check, ChevronDown, CreditCard, Menu, Minus, PackageCheck, PawPrint, Plus, ShoppingBag, Sparkles, Truck, X } from 'lucide-react'
import { IMAGES, LOGO_SRC } from './data/images'
import { COMBO_IDS, COMBO_PRICE, PRODUCTS as RAW_PRODUCTS } from './data/products'
import { FORM_ENDPOINT, SITE_NAME, SITE_URL, WHATSAPP_NUMBER, WHATSAPP_URL } from './data/site'
import { usePageSeo } from './seo'
import './styles.css'

const PRODUCTS = RAW_PRODUCTS.map((product) => ({
  ...product,
  image: product.imageKey ? IMAGES[product.imageKey] : null,
  gallery: (product.galleryKeys || []).map((key) => IMAGES[key]).filter(Boolean),
}))

const COMBO_PRODUCTS = COMBO_IDS.map((id) => PRODUCTS.find((product) => product.id === id)).filter(Boolean)
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
    ...(product.price != null
      ? { price: product.price, availability: 'https://schema.org/InStock' }
      : { availability: 'https://schema.org/PreOrder' }),
    seller: { '@type': 'Organization', name: SITE_NAME },
  },
})

function useCart() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vikingdogs-cart') || '[]') } catch { return [] }
  })

  useEffect(() => localStorage.setItem('vikingdogs-cart', JSON.stringify(cart)), [cart])

  const addToCart = (product, quantity = 1) => setCart((current) => {
    if (product.comingSoon || product.price == null) return current
    const item = current.find((entry) => entry.id === product.id)
    return item ? current.map((entry) => entry.id === product.id ? { ...entry, quantity: entry.quantity + quantity } : entry) : [...current, { ...product, quantity }]
  })
  const changeQuantity = (id, delta) => setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter((item) => item.quantity > 0))
  const removeFromCart = (id) => setCart((current) => current.filter((item) => item.id !== id))
  const clearCart = () => setCart([])
  const addCombo = () => setCart(COMBO_PRODUCTS.map((product) => ({ ...product, quantity: 1 })))
  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.some((item) => item.price == null) ? null : cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const isCombo = cart.length === COMBO_IDS.length && cart.every((item) => COMBO_IDS.includes(item.id) && item.quantity === 1)
  const comboPrice = COMBO_PRICE
  const total = isCombo ? comboPrice : subtotal

  return { cart, addToCart, addCombo, changeQuantity, removeFromCart, clearCart, itemsCount, subtotal, total, isCombo, comboPrice }
}

const CartContext = React.createContext(null)
const useCartContext = () => React.useContext(CartContext)

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

function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { itemsCount, cart, changeQuantity, removeFromCart, total, isCombo } = useCartContext()
  const location = useLocation()
  const navigate = useNavigate()
  const closeMenu = () => setMenuOpen(false)

  return <div className="app-shell">
    <div className="announcement"><Sparkles size={14} /> Envío gratis en Colombia · Pago contra entrega o Mercado Pago · Calidad artesanal café</div>
    <header className="site-header">
      <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú"><Menu size={21} /></button>
      <Link className="brand" to="/" onClick={closeMenu} aria-label="VikingDogs inicio">
        <img className="brand-logo" src={LOGO} alt="" />
        <span>vikingdogs</span>
      </Link>
      <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
        <Link className={location.pathname === '/' ? 'active' : ''} to="/" onClick={closeMenu}>Inicio</Link>
        <Link className={location.pathname.startsWith('/catalogo') ? 'active' : ''} to="/catalogo" onClick={closeMenu}>Catálogo</Link>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" onClick={closeMenu}>Hablemos <ArrowRight size={14} /></a>
      </nav>
      <button className="cart-button" onClick={() => setCartOpen(true)} aria-label="Abrir carrito">
        <ShoppingBag size={19} /><span>Carrito</span>{itemsCount > 0 && <b>{itemsCount}</b>}
      </button>
    </header>
    <main>{children}</main>
    <footer className="site-footer"><div><Link className="brand footer-brand" to="/"><img className="brand-logo" src={LOGO} alt="" /><span>vikingdogs</span></Link></div><div className="footer-links"><Link to="/catalogo">Catálogo</Link><a href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp</a><span>Funza · Cra 19 Bis #9-15</span></div><small>© 2026 VikingDogs</small><small className="footer-service">Cuidado premium, paseo y bienestar canino estilo café. · <a href="https://vikingdogs.presentto.online" target="_blank" rel="noreferrer">vikingdogs.presentto.online</a> · 3219517348</small></footer>
    {cartOpen && <CartDrawer cart={cart} changeQuantity={changeQuantity} removeFromCart={removeFromCart} total={total} isCombo={isCombo} onClose={() => setCartOpen(false)} onCatalog={() => { setCartOpen(false); navigate('/catalogo') }} />}
  </div>
}

function CartDrawer({ cart, changeQuantity, removeFromCart, total, isCombo, onClose, onCatalog }) {
  return <div className="drawer-layer" onClick={onClose}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
    <div className="drawer-head"><div><span className="eyebrow">Tu selección</span><h2>Carrito</h2></div><button className="icon-button" onClick={onClose} aria-label="Cerrar carrito"><X size={21} /></button></div>
    {cart.length === 0 ? <div className="empty-cart"><div className="empty-icon"><ShoppingBag /></div><h3>Tu carrito está vacío</h3><p>Descubre productos para crear tu ritual de bienestar.</p><button className="button button-primary" onClick={onCatalog}>Explorar catálogo <ArrowRight size={16} /></button></div> : <>
      <div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><Thumb src={item.image} /><div className="cart-item-info"><strong>{item.name}</strong><span>{formatCOP(item.price)}</span><div className="quantity"><button onClick={() => changeQuantity(item.id, -1)}><Minus size={13} /></button><b>{item.quantity}</b><button onClick={() => changeQuantity(item.id, 1)}><Plus size={13} /></button></div></div><button className="remove" onClick={() => removeFromCart(item.id)} aria-label={`Eliminar ${item.name}`}><X size={15} /></button></div>)}</div>
      {isCombo && <div className="combo-note"><Check size={16} /> Pack completo seleccionado · ahorras $10.000</div>}
      <div className="drawer-total"><span>Total</span><strong>{formatCOP(total)}</strong></div>
      <Link to="/checkout" className="button button-primary button-wide" onClick={onClose}>Completar pedido <ArrowRight size={16} /></Link>
      <button className="text-button" onClick={onCatalog}>Seguir explorando</button>
    </>}
  </aside></div>
}

function Home() {
  usePageSeo({
    title: 'VikingDogs · Cuidado y Bienestar Canino Estilo Café',
    description: 'Productos prácticos y de alta gama para perros: cuidado, aseo, hidratación y aventuras. Envío gratis en toda Colombia. Pago contra entrega o Mercado Pago.',
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
  return <Layout><section className="hero hero-simple container"><div className="hero-copy"><span className="eyebrow"><PawPrint size={14} /> Estilo Café · Colombia</span><h1>Bienestar canino<br /><em>con alma de café.</em></h1><p className="hero-minimal">Productos artesanales y prácticos para consentir a tu mejor amigo. Envío gratis a todo el país. Paga por Mercado Pago en artículos individuales o elige pago contra entrega.</p><div className="hero-actions"><Link to="/catalogo" className="button button-primary">Ver catálogo <ArrowRight size={17} /></Link><a href={WHATSAPP_URL} className="button button-quiet" target="_blank" rel="noreferrer">Hablemos</a></div></div></section>
    <section className="value-strip"><div className="container value-grid"><div><Truck /><span><strong>Envío gratis</strong><small>Menos de 5 días</small></span></div><div><PackageCheck /><span><strong>Contra entrega</strong><small>Compra segura</small></span></div><div><CreditCard /><span><strong>Mercado Pago</strong><small>Link único individual</small></span></div></div></section>
    <section className="home-bottom container"><span className="eyebrow">VikingDogs</span><h2>Lo esencial para<br /><em>cuidarlo mejor.</em></h2><Link to="/catalogo" className="button button-primary">Comprar ahora <ArrowRight size={16} /></Link></section>
  </Layout>
}

function Catalog() {
  const { addToCart, addCombo, itemsCount } = useCartContext()
  const [notice, setNotice] = useState('')
  const noteTitle = 'Envío gratis en todo el catálogo.'
  const noteText = `${PRODUCTS.length} productos disponibles · Calidad garantizada · Pago contra entrega o Mercado Pago.`
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
    description: '10 productos para el cuidado, aseo y aventuras de tu perro. Envío gratis en todos los pedidos.',
    path: '/catalogo',
    jsonLd: itemListLd,
  })
  const add = (product) => { addToCart(product); setNotice(`${product.shortName} se agregó a tu carrito`); setTimeout(() => setNotice(''), 2400) }
  const addPack = () => { addCombo(); setNotice('Pack completo agregado · ahorras $10.000'); setTimeout(() => setNotice(''), 2400) }
  return <Layout><section className="catalog-hero container"><div><span className="eyebrow"><PawPrint size={14} /> VikingDogs</span><h1>Elige su<br /><em>cuidado.</em></h1></div><p>10 productos · Envío gratis · Pago flexible</p></section>
    <section className="catalog-section container"><div className="section-heading"><div><span className="eyebrow">Catálogo</span><h2>Productos</h2></div><span className="stock-note"><span className="stock-dot"></span> Unidades seleccionadas</span></div><div className="product-grid">{PRODUCTS.map((product, index) => <ProductCard key={product.id} product={product} index={index} onAdd={() => add(product)} />)}</div><div className="limited-note"><Sparkles size={20} /><div><strong>{noteTitle}</strong><span>{noteText}</span></div><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="underlink">WhatsApp <ArrowRight size={15} /></a></div></section>
    <section className="combo-section container"><div className="combo-copy"><span className="eyebrow">Sistema VikingDogs</span><h2>Todo su cuidado<br /><em>en un pack.</em></h2><p className="combo-lead">Cuatro esenciales para acompañar el aseo, la hidratación y las aventuras de tu mejor amigo.</p><div className="combo-pillars"><div><span>01</span><strong>Pelaje</strong><small>Cepillo 3 en 1 · brillo y suavidad</small></div><div><span>02</span><strong>Aseo</strong><small>Guante + kit · cuidado en casa</small></div><div><span>03</span><strong>Paseos</strong><small>Bebedero · hidratación portátil</small></div></div><p className="combo-rhythm">Arma su rutina con productos simples, funcionales y pensados para compartir más momentos juntos.</p><div className="combo-offer"><strong>{formatCOP(COMBO_PRICE)}</strong><span>4 productos · ahorras $10.000</span></div><button className="button button-light" onClick={addPack}>Agregar pack completo <ArrowRight size={16} /></button></div><div className="combo-stack">{COMBO_PRODUCTS.map((product, i) => <img key={product.id} src={product.image} alt={product.name} style={{ '--i': i }} />)}<div className="save-pill">Ahorras<br /><strong>$10.000</strong></div></div></section>
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
  return <article tabIndex="0" className={`product-card${soon ? ' card-soon' : ''}`}><Link to={`/producto/${product.id}`} className="product-image"><ProductMedia product={product} src={product.image} /><span className="product-number">{String(index + 1).padStart(2, '0')}</span><span className="shipping-pill">Envío gratis</span>{soon && <span className="soon-badge">Próximamente</span>}<div className="product-hover"><span className="hover-label">Beneficios</span><strong>{product.hoverTitle}</strong><p>{product.hoverText}</p><ul>{product.benefits.map((benefit) => <li key={benefit}><Check size={13} /> {benefit}</li>)}</ul><span className="hover-cta">{soon ? 'Avísame' : 'Ver producto'} <ArrowRight size={13} /></span></div></Link><div className="product-content"><span className="product-category">{product.category}</span><Link to={`/producto/${product.id}`}><h3>{product.name}</h3></Link><div className="product-bottom">{soon ? <div><strong className="soon-label">Próximamente</strong><span className="pay-note">Avísame por WhatsApp</span></div> : <div><strong>{formatCOP(product.price)}</strong><span className="pay-note">Mercado Pago / Contraentrega</span></div>}{soon ? <a className="add-button" href={notifyUrl(product)} target="_blank" rel="noreferrer" aria-label={`Avisarme cuando ${product.name} esté disponible`}><ArrowRight size={19} /></a> : <button className="add-button" onClick={onAdd} aria-label={`Agregar ${product.name} al carrito`}><Plus size={19} /></button>}</div></div></article>
}

function ProductPage() {
  const { slug } = useParams()
  const product = PRODUCTS.find((item) => item.id === slug)
  const { addToCart, cart } = useCartContext()
  const navigate = useNavigate()
  const location = useLocation()
  const cartItem = cart.find((item) => item.id === product?.id)
  const fromCart = Boolean(location.state?.fromCart)
  const fromCombo = Boolean(location.state?.fromCombo)
  const [quantity, setQuantity] = useState(() => fromCart ? cartItem?.quantity || 1 : 1)
  const [selectedImage, setSelectedImage] = useState(product?.image)
  const [added, setAdded] = useState(false)
  const soon = Boolean(product?.comingSoon)
  usePageSeo({
    title: product ? `${product.name} · VikingDogs` : 'Producto · VikingDogs',
    description: product ? `${product.detail} Envío gratis en todos los pedidos. Pago contra entrega o Mercado Pago.` : 'Producto VikingDogs.',
    path: product ? `/producto/${product.id}` : '/catalogo',
    jsonLd: product ? productJsonLd(product) : null,
  })
  if (!product) return <Navigate to="/catalogo" replace />
  const directBuy = () => { if (!fromCart && !fromCombo) addToCart(product, quantity); navigate('/checkout') }
  const add = () => { addToCart(product, quantity); setAdded(true); setTimeout(() => setAdded(false), 2200) }
  const gallery = product.gallery.length ? product.gallery : [product.image].filter(Boolean)
  return <Layout><section className="product-page container"><Link to="/catalogo" className="back-link">← Catálogo</Link><div className="product-detail"><div><div className="detail-image"><ProductMedia product={product} src={selectedImage} /><span className="detail-stamp"><PawPrint size={16} /> vikingdogs</span></div>{gallery.length > 1 && <div className="detail-gallery">{gallery.map((image, index) => <button className={selectedImage === image ? 'selected' : ''} key={`${image}-${index}`} onClick={() => setSelectedImage(image)}><img src={image} alt={`${product.name} vista ${index + 1}`} /></button>)}</div>}</div><div className="detail-copy"><span className="eyebrow">{product.category}</span><span className="detail-badge">{product.badge}</span><h1>{product.name}</h1><p className="detail-description">{product.detail}</p><ul className="benefit-list">{product.benefits.map((benefit) => <li key={benefit}><Check size={15} /> {benefit}</li>)}</ul><div className="detail-price">{soon ? <strong className="soon-label">Próximamente</strong> : <strong>{formatCOP(product.price)}</strong>}<span className="free-shipping">Envío gratis</span><span>{soon ? 'Avísanos por WhatsApp' : 'Mercado Pago o Contra entrega'}</span></div>{soon ? <div className="detail-actions"><a className="button button-primary buy-button" href={notifyUrl(product)} target="_blank" rel="noreferrer">Avísame cuando llegue <ArrowRight size={17} /></a></div> : <div className="detail-actions"><div className="quantity large"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={15} /></button><b>{quantity}</b><button onClick={() => setQuantity(quantity + 1)}><Plus size={15} /></button></div><button className="button button-primary buy-button" onClick={directBuy}>Continuar al pedido <ArrowRight size={17} /></button><button className="button button-outline cart-add" onClick={add}><ShoppingBag size={17} /> Agregar</button></div>}{added && <div className="added-message"><Check size={16} /> Agregado al carrito</div>}</div></div><div className="why-section"><div><span className="eyebrow">Por qué le encantará</span><h2>{product.whyTitle}</h2><p>{product.whyText}</p></div><div className="why-grid"><div><strong>Ideal para</strong><p>{product.idealFor}</p></div><div><strong>Ritual de uso</strong><p>{product.ritual}</p></div><div><strong>Incluye</strong><p>{product.included}</p></div></div></div></section></Layout>
}

function CheckoutPage() {
  const { cart, total, clearCart } = useCartContext()
  const navigate = useNavigate()
  const product = cart[0] || PRODUCTS[0]
  usePageSeo({
    title: 'Checkout · VikingDogs',
    description: 'Confirma tu pedido VikingDogs.',
    path: '/checkout',
    noindex: true,
  })
  if (!cart.length) return <Layout><section className="checkout-empty container"><span className="eyebrow">VikingDogs</span><h1>Tu carrito está vacío</h1><p>Agrega productos para continuar con tu pedido.</p><Link className="button button-primary" to="/catalogo">Ver catálogo <ArrowRight size={16} /></Link></section></Layout>
  return <Layout><section className="checkout-page container"><Checkout product={product} quantity={cart[0].quantity} cart={cart} total={total} standalone onClose={() => navigate(-1)} onSuccess={clearCart} /></section></Layout>
}

function Checkout({ product, quantity, cart, total, standalone = false, onClose, onSuccess }) {
  const navigate = useNavigate()
  const { isCombo } = useCartContext()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Determine if single product purchase (either exactly 1 item in cart with quantity 1 or single product view)
  const isSingleItemPurchase = cart.length === 1 && cart[0].quantity >= 1
  const singleProduct = isSingleItemPurchase ? cart[0] : null
  const hasMercadoPagoOption = isSingleItemPurchase && singleProduct?.mercadopagoUrl

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
    payment: hasMercadoPagoOption ? 'Mercado Pago (Link Único)' : 'Pago contra entrega'
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
      _subject: `Nuevo pedido VikingDogs — ${form.firstName} ${form.lastName} (${form.payment})`,
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

  const handleMpRedirect = () => {
    if (singleProduct?.mercadopagoUrl) {
      window.open(singleProduct.mercadopagoUrl, '_blank')
    }
  }

  return <div className={standalone ? 'checkout-page-inner' : 'checkout-layer'}><div className="checkout-modal"><button className="modal-close" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>{success ? <div className="success-state"><div className="success-icon"><Check /></div><span className="eyebrow">Pedido recibido</span><h2>Gracias por elegir<br /><em>VikingDogs.</em></h2><p>Recibimos tus datos. Te contactaremos muy pronto para confirmar tu pedido y coordinar la entrega o pago.</p>{form.payment.includes('Mercado Pago') && singleProduct?.mercadopagoUrl && <a href={singleProduct.mercadopagoUrl} target="_blank" rel="noreferrer" className="button button-primary" style={{ marginBottom: '12px' }}><CreditCard size={16} /> Abrir link de pago Mercado Pago</a>}<a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="button button-quiet">Seguir mi compra por WhatsApp <ArrowRight size={16} /></a><button className="text-button" onClick={() => navigate('/catalogo')}>Volver al catálogo</button></div> : <><div className="checkout-header"><span className="eyebrow">Último paso</span><h2>Confirma tu pedido</h2><p>{isCombo ? 'Pack completo · 4 productos' : isSingleItemPurchase ? `${singleProduct.name} · ${singleProduct.quantity} ${singleProduct.quantity === 1 ? 'unidad' : 'unidades'}` : 'Varios productos en carrito'}</p></div><div className="checkout-order-summary">{cart.map((item) => <div className="checkout-order-item" key={item.id}><Thumb src={item.image} /><span><strong>{item.name}</strong><small>Cantidad: {item.quantity}</small></span><b>{formatCOP(item.price)}</b></div>)}</div><form onSubmit={submit}><div className="form-section"><h3>Datos del cliente para envío</h3><div className="form-grid"><label>Teléfono<div className="phone-field"><span>(+57)</span><input required name="phone" type="tel" value={form.phone} onChange={update} placeholder="300 000 0000" /></div></label><label>Correo<input required name="email" type="email" value={form.email} onChange={update} placeholder="tu@correo.com" /></label><label>Nombre<input required name="firstName" value={form.firstName} onChange={update} placeholder="Tu nombre" /></label><label>Apellido<input required name="lastName" value={form.lastName} onChange={update} placeholder="Tu apellido" /></label><label>Cédula o documento<input required name="document" value={form.document} onChange={update} placeholder="Número de documento" /></label><label>Etiqueta <span className="optional">(separadas por coma)</span><input name="tag" value={form.tag} onChange={update} placeholder="Casa, trabajo" /></label></div></div><div className="form-section"><h3>Dirección de entrega</h3><label>Departamento<select required name="department" value={form.department} onChange={update}><option value="">Selecciona una opción</option><option>Bogotá D.C.</option><option>Cundinamarca</option><option>Antioquia</option><option>Valle del Cauca</option><option>Atlántico</option><option>Santander</option><option>Otro departamento</option></select><ChevronDown className="select-icon" size={16} /></label><label>Información adicional de la dirección<textarea required name="addressInfo" value={form.addressInfo} onChange={update} placeholder="Dirección, barrio, ciudad y referencias" rows="3" /></label><label className="check-row"><input type="checkbox" name="officeDelivery" checked={form.officeDelivery} onChange={update} /><span>Entregar en una oficina de la transportadora</span></label><div className="form-grid"><label>Notas para el proveedor<textarea name="providerNotes" value={form.providerNotes} onChange={update} placeholder="Indicaciones para la entrega" rows="2" /></label><label>Notas internas<textarea name="internalNotes" value={form.internalNotes} onChange={update} placeholder="Algo más que debamos saber" rows="2" /></label></div></div><div className="form-section"><h3>Método de pago</h3><div className="payment-options">
          {hasMercadoPagoOption && <label className={form.payment === 'Mercado Pago (Link Único)' ? 'selected' : ''}><input type="radio" name="payment" value="Mercado Pago (Link Único)" checked={form.payment === 'Mercado Pago (Link Único)'} onChange={update} /><span><strong>Mercado Pago (Link Único)</strong><small>Pago seguro en línea para artículo individual</small></span><Check size={16} /></label>}
          <label className={form.payment === 'Pago contra entrega' ? 'selected' : ''}><input type="radio" name="payment" value="Pago contra entrega" checked={form.payment === 'Pago contra entrega'} onChange={update} /><span><strong>Pago contra entrega</strong><small>Pagas al recibir tu pedido en casa</small></span><Check size={16} /></label>
        </div>
        {!hasMercadoPagoOption && <p className="cart-payment-note">ℹ️ Para compras con múltiples productos en el carrito, el método disponible es exclusivamente <strong>Pago contra entrega</strong>.</p>}
      </div>{error && <div className="form-error">{error}</div>}<div className="checkout-total"><span>Total del pedido</span><strong>{formatCOP(total)}</strong></div><button disabled={submitting} className="button button-primary button-wide submit-button" type="submit">{submitting ? 'Enviando pedido y datos…' : form.payment.includes('Mercado Pago') ? 'Registrar pedido y pagar con Mercado Pago' : 'Confirmar pedido contra entrega'} {!submitting && <ArrowRight size={17} />}</button>{form.payment.includes('Mercado Pago') && singleProduct?.mercadopagoUrl && <button type="button" className="button button-outline button-wide" style={{ marginTop: '10px' }} onClick={handleMpRedirect}><CreditCard size={16} /> Abrir link de Mercado Pago directamente</button>}<p className="secure-note">Tus datos y pedido se envían de forma segura a Formspree. Envío gratis a todo Colombia.</p></form></>}</div></div>
}

function Root() { return <BrowserRouter><App /></BrowserRouter> }
createRoot(document.getElementById('root')).render(<Root />)
