import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Check, ChevronDown, Dog, Menu, Minus, PackageCheck, PawPrint, Plus, ShoppingBag, Sparkles, Truck, X } from 'lucide-react'
import logoSrc from '../assets/vikingdogs-logo-fondo-transparente.png'
import brushImage from '../assets/productos/CEPILLO 3 EN 1 VAPOR CEPILLO PELOS/productImage-1749594317145.png'
import gloveImage from '../assets/productos/guante anti pelos perros/imageProduct.jpg'
import gloveImage2 from '../assets/productos/guante anti pelos perros/61e55dc4-2ae0-4b19-9de0-c434be68bfc4.jpeg'
import gloveImage3 from '../assets/productos/guante anti pelos perros/e39c88e6-ef5f-45d1-9ec5-18419ff66784.jpeg'
import bottleImage from '../assets/productos/BEBEDERO PARA PERROS/imageProduct.jpg'
import groomingImage from '../assets/productos/KIT PELUQUERIA Y ASEO PERROS/imageProduct.jpg'
import groomingImage2 from '../assets/productos/KIT PELUQUERIA Y ASEO PERROS/productImage-1723248234445.jpeg'
import groomingImage3 from '../assets/productos/KIT PELUQUERIA Y ASEO PERROS/productImage-1723248230957.jpeg'
import groomingImage4 from '../assets/productos/KIT PELUQUERIA Y ASEO PERROS/productImage-1723248232786.jpeg'
import groomingImage5 from '../assets/productos/KIT PELUQUERIA Y ASEO PERROS/productImage-1723248229021.jpeg'
import './styles.css'

const FORM_ENDPOINT = 'https://formspree.io/f/xoeqoven'
const WHATSAPP_NUMBER = '573144572008'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola VikingDogs, quiero conocer el catálogo y recibir atención.')}`
const LOGO_SRC = logoSrc
const COMBO_PRICE = 130000

// Catálogo real de VikingDogs.
const PRODUCTS = [
  {
    id: 'cepillo-vapor',
    name: 'Cepillo 3 en 1 a vapor',
    shortName: 'Cepillo 3 en 1',
    category: 'Cuidado del pelaje',
    badge: 'Cepillo quitapelos para mascotas',
    hoverTitle: 'Pelaje limpio y suave',
    hoverText: 'Cepillo 3 en 1 para desenredar, retirar pelo suelto y consentir a tu mascota.',
    description: 'Cepillado, masaje y cuidado en un solo producto.',
    detail: 'Cepillo multifuncional con vapor para el cuidado diario del pelaje.',
    benefits: ['3 funciones', 'Para perros y gatos', 'Diseño ergonómico'],
    whyTitle: 'Un momento de cuidado que tu mascota disfruta.',
    whyText: 'Haz del cepillado una rutina sencilla: ayuda a retirar pelo suelto, mantener el pelaje ordenado y compartir un momento de conexión con tu compañero.',
    idealFor: 'Mascotas con muda de pelo y pelaje de cualquier longitud.',
    ritual: 'Cepilla suavemente en el sentido del pelo y limpia el producto después de usarlo.',
    included: '1 cepillo 3 en 1 · depósito de vapor',
    price: 30000,
    image: brushImage,
    gallery: [brushImage],
    accent: 'blue',
  },
  {
    id: 'guante-quitapelos',
    name: 'Guante anti pelos',
    shortName: 'Guante anti pelos',
    category: 'Baño y aseo',
    badge: 'Masaje y retiro de pelo',
    hoverTitle: 'Aseo sin estrés',
    hoverText: 'Guante de aseo que ayuda a retirar el pelo suelto mientras masajeas suavemente.',
    description: 'Limpieza y masaje para una rutina más amable.',
    detail: 'Guante de aseo para retirar pelo suelto y masajear a tu mascota.',
    benefits: ['Ajuste cómodo', 'Uso en seco o húmedo', 'Para perros y gatos'],
    whyTitle: 'Convierte el aseo en una caricia.',
    whyText: 'Su textura permite acompañar el baño o el cepillado con movimientos suaves. Una herramienta práctica para cuidar el pelaje y reducir el pelo suelto en casa.',
    idealFor: 'Mascotas sensibles al cepillado tradicional.',
    ritual: 'Coloca el guante y deslízalo suavemente siguiendo el crecimiento del pelo.',
    included: '1 guante de aseo',
    price: 25000,
    image: gloveImage,
    gallery: [gloveImage, gloveImage2, gloveImage3],
    accent: 'sky',
  },
  {
    id: 'bebedero-portatil',
    name: 'Bebedero portátil',
    shortName: 'Bebedero portátil',
    category: 'Paseos y aventura',
    badge: 'Hidratación en movimiento',
    hoverTitle: 'Agua donde quiera que vayan',
    hoverText: 'Bebedero práctico para mantener hidratado a tu perro durante paseos y viajes.',
    description: 'Hidratación cómoda para cada aventura.',
    detail: 'Bebedero portátil con botella integrada para paseos y viajes.',
    benefits: ['Portátil', 'Fácil de usar', 'Ideal para paseos'],
    whyTitle: 'Más paseos, más aventuras, siempre con agua.',
    whyText: 'Llévalo en la mano o en el bolso y ofrece agua a tu perro cuando la necesite. Su formato facilita hidratarlo sin cargar recipientes adicionales.',
    idealFor: 'Paseos, viajes y actividades al aire libre.',
    ritual: 'Llena el depósito, presiona para liberar el agua y devuelve el sobrante a la botella.',
    included: '1 bebedero portátil',
    price: 30000,
    image: bottleImage,
    gallery: [bottleImage],
    accent: 'aqua',
  },
  {
    id: 'kit-peluqueria-aseo',
    name: 'Kit peluquería y aseo',
    shortName: 'Kit peluquería y aseo',
    category: 'Cuidado completo',
    badge: 'Kit 4 en 1 para perros',
    hoverTitle: 'Todo para su cuidado',
    hoverText: 'Un kit práctico con herramientas esenciales para mantener a tu perro aseado en casa.',
    description: 'Cuidado del pelaje y uñas desde casa.',
    detail: 'Kit de peluquería y aseo con accesorios para el cuidado de tu perro.',
    benefits: ['Máquina recargable', 'Peine y tijeras', 'Cortaúñas incluido'],
    whyTitle: 'El cuidado de tu perro, en tus manos.',
    whyText: 'Ten a la mano lo esencial para acompañar el aseo de tu perro: recorte, peinado y cuidado de uñas en un solo kit pensado para la rutina del hogar.',
    idealFor: 'Familias que cuidan el aseo de su perro en casa.',
    ritual: 'Usa cada accesorio con calma, siguiendo el sentido del pelo y evitando zonas sensibles.',
    included: 'Máquina · guías · peine · tijeras · cortaúñas',
    price: 55000,
    image: groomingImage,
    gallery: [groomingImage, groomingImage2, groomingImage3, groomingImage4, groomingImage5],
    accent: 'royal',
  },
]

const formatCOP = (value) => value == null ? 'Consultar' : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)

function useCart() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vikingdogs-cart') || '[]') } catch { return [] }
  })

  useEffect(() => localStorage.setItem('vikingdogs-cart', JSON.stringify(cart)), [cart])

  const addToCart = (product, quantity = 1) => setCart((current) => {
    const item = current.find((entry) => entry.id === product.id)
    return item ? current.map((entry) => entry.id === product.id ? { ...entry, quantity: entry.quantity + quantity } : entry) : [...current, { ...product, quantity }]
  })
  const changeQuantity = (id, delta) => setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter((item) => item.quantity > 0))
  const removeFromCart = (id) => setCart((current) => current.filter((item) => item.id !== id))
  const clearCart = () => setCart([])
  const addCombo = () => setCart(PRODUCTS.map((product) => ({ ...product, quantity: 1 })))
  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.some((item) => item.price == null) ? null : cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const isCombo = cart.length === 4 && cart.every((item) => item.quantity === 1)
  const comboPrice = COMBO_PRICE
  const total = isCombo ? comboPrice : subtotal

  return { cart, addToCart, addCombo, changeQuantity, removeFromCart, clearCart, itemsCount, subtotal, total, isCombo, comboPrice }
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

const CartContext = React.createContext(null)
const useCartContext = () => React.useContext(CartContext)

function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { itemsCount, cart, changeQuantity, removeFromCart, total, isCombo } = useCartContext()
  const location = useLocation()
  const navigate = useNavigate()
  const closeMenu = () => setMenuOpen(false)

  return <div className="app-shell">
    <div className="announcement"><Sparkles size={14} /> Envío gratis · Entrega en menos de 5 días · Pagas al recibir</div>
    <header className="site-header">
      <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú"><Menu size={21} /></button>
      <Link className="brand" to="/" onClick={closeMenu} aria-label="VikingDogs inicio">
        <img className="brand-logo" src={LOGO_SRC} alt="" />
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
    <footer className="site-footer"><div><Link className="brand footer-brand" to="/"><img className="brand-logo" src={LOGO_SRC} alt="" /><span>vikingdogs</span></Link></div><div className="footer-links"><Link to="/catalogo">Catálogo</Link><a href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp</a><span>Funza · Cra 19 Bis #9-15</span></div><small>© 2026 VikingDogs</small><small className="footer-service">Cuidado, paseo y felicidad para tu mejor amigo. · Responsable: Alexandra Ortiz · <a href="https://ya.presentto.online" target="_blank" rel="noreferrer">ya.presentto.online</a> · 3219517348</small></footer>
    {cartOpen && <CartDrawer cart={cart} changeQuantity={changeQuantity} removeFromCart={removeFromCart} total={total} isCombo={isCombo} onClose={() => setCartOpen(false)} onCatalog={() => { setCartOpen(false); navigate('/catalogo') }} />}
  </div>
}

function CartDrawer({ cart, changeQuantity, removeFromCart, total, isCombo, onClose, onCatalog }) {
  return <div className="drawer-layer" onClick={onClose}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
    <div className="drawer-head"><div><span className="eyebrow">Tu selección</span><h2>Carrito</h2></div><button className="icon-button" onClick={onClose} aria-label="Cerrar carrito"><X size={21} /></button></div>
    {cart.length === 0 ? <div className="empty-cart"><div className="empty-icon"><ShoppingBag /></div><h3>Tu carrito está vacío</h3><p>Descubre productos para crear tu ritual de bienestar.</p><button className="button button-primary" onClick={onCatalog}>Explorar catálogo <ArrowRight size={16} /></button></div> : <>
      <div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><img src={item.image} alt="" /><div className="cart-item-info"><strong>{item.name}</strong><span>{formatCOP(item.price)}</span><div className="quantity"><button onClick={() => changeQuantity(item.id, -1)}><Minus size={13} /></button><b>{item.quantity}</b><button onClick={() => changeQuantity(item.id, 1)}><Plus size={13} /></button></div></div><button className="remove" onClick={() => removeFromCart(item.id)} aria-label={`Eliminar ${item.name}`}><X size={15} /></button></div>)}</div>
      {isCombo && <div className="combo-note"><Check size={16} /> Pack completo seleccionado · ahorras $10.000</div>}
      <div className="drawer-total"><span>Total</span><strong>{formatCOP(total)}</strong></div>
      <Link to="/checkout" className="button button-primary button-wide" onClick={onClose}>Completar pedido <ArrowRight size={16} /></Link>
      <button className="text-button" onClick={onCatalog}>Seguir explorando</button>
    </>}
  </aside></div>
}

function Home() {
  return <Layout><section className="hero hero-simple container"><div className="hero-copy"><span className="eyebrow"><PawPrint size={14} /> Para perros · Colombia</span><h1>Más cuidado<br /><em>más aventuras.</em></h1><p className="hero-minimal">Productos prácticos para consentir a tu mejor amigo.</p><div className="hero-actions"><Link to="/catalogo" className="button button-primary">Ver catálogo <ArrowRight size={17} /></Link><a href={WHATSAPP_URL} className="button button-quiet" target="_blank" rel="noreferrer">Hablemos</a></div></div></section>
    <section className="value-strip"><div className="container value-grid"><div><Truck /><span><strong>Envío gratis</strong><small>Menos de 5 días</small></span></div><div><PackageCheck /><span><strong>Contra entrega</strong><small>Compra segura</small></span></div><div><Sparkles /><span><strong>WhatsApp 24/7</strong><small>Seguimiento</small></span></div></div></section>
    <section className="home-bottom container"><span className="eyebrow">VikingDogs</span><h2>Lo esencial para<br /><em>cuidarlo mejor.</em></h2><Link to="/catalogo" className="button button-primary">Comprar ahora <ArrowRight size={16} /></Link></section>
  </Layout>
}

function Catalog() {
  const { addToCart, addCombo, itemsCount } = useCartContext()
  const [notice, setNotice] = useState('')
  const add = (product) => { addToCart(product); setNotice(`${product.shortName} se agregó a tu carrito`); setTimeout(() => setNotice(''), 2400) }
  const addPack = () => { addCombo(); setNotice('Pack completo agregado · ahorras $10.000'); setTimeout(() => setNotice(''), 2400) }
  return <Layout><section className="catalog-hero container"><div><span className="eyebrow"><PawPrint size={14} /> VikingDogs</span><h1>Elige su<br /><em>cuidado.</em></h1></div><p>Productos para perros · Consulta disponibilidad</p></section>
    <section className="catalog-section container"><div className="section-heading"><div><span className="eyebrow">MVP</span><h2>Productos</h2></div><span className="stock-note"><span className="stock-dot"></span> Unidades limitadas</span></div><div className="product-grid">{PRODUCTS.map((product, index) => <ProductCard key={product.id} product={product} index={index} onAdd={() => add(product)} />)}</div><div className="limited-note"><Sparkles size={20} /><div><strong>Próximamente más novedades.</strong><span>Disponibilidad limitada.</span></div><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="underlink">WhatsApp <ArrowRight size={15} /></a></div></section>
    <section className="combo-section container"><div className="combo-copy"><span className="eyebrow">Sistema VikingDogs</span><h2>Todo su cuidado<br /><em>en un pack.</em></h2><p className="combo-lead">Cuatro esenciales para acompañar el aseo, la hidratación y las aventuras de tu mejor amigo.</p><div className="combo-pillars"><div><span>01</span><strong>Pelaje</strong><small>Cepillo 3 en 1 · brillo y suavidad</small></div><div><span>02</span><strong>Aseo</strong><small>Guante + kit · cuidado en casa</small></div><div><span>03</span><strong>Paseos</strong><small>Bebedero · hidratación portátil</small></div></div><p className="combo-rhythm">Arma su rutina con productos simples, funcionales y pensados para compartir más momentos juntos.</p><div className="combo-offer"><strong>{formatCOP(COMBO_PRICE)}</strong><span>4 productos · ahorras $10.000</span></div><button className="button button-light" onClick={addPack}>Agregar pack completo <ArrowRight size={16} /></button></div><div className="combo-stack">{PRODUCTS.map((product, i) => <img key={product.id} src={product.image} alt={product.name} style={{ '--i': i }} />)}<div className="save-pill">Ahorras<br /><strong>$10.000</strong></div></div></section>
    {notice && <div className="toast"><Check size={16} /> {notice} · <span>{itemsCount} {itemsCount === 1 ? 'producto' : 'productos'}</span></div>}
  </Layout>
}

function ProductCard({ product, index, onAdd }) {
  return <article tabIndex="0" className={`product-card accent-${product.accent}`}><Link to={`/producto/${product.id}`} className="product-image"><img src={product.image} alt={product.name} /><span className="product-number">0{index + 1}</span><span className="shipping-pill">Consulta</span><div className="product-hover"><span className="hover-label">Beneficios</span><strong>{product.hoverTitle}</strong><p>{product.hoverText}</p><ul>{product.benefits.map((benefit) => <li key={benefit}><Check size={13} /> {benefit}</li>)}</ul><span className="hover-cta">Ver producto <ArrowRight size={13} /></span></div></Link><div className="product-content"><span className="product-category">{product.category}</span><Link to={`/producto/${product.id}`}><h3>{product.name}</h3></Link><div className="product-bottom"><div><strong>{formatCOP(product.price)}</strong><span className="pay-note">Escríbenos para comprar</span></div><button className="add-button" onClick={onAdd} aria-label={`Agregar ${product.name} al carrito`}><Plus size={19} /></button></div></div></article>
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
  if (!product) return <Navigate to="/catalogo" replace />
  const directBuy = () => { if (!fromCart && !fromCombo) addToCart(product, quantity); navigate('/checkout') }
  const add = () => { addToCart(product, quantity); setAdded(true); setTimeout(() => setAdded(false), 2200) }
  return <Layout><section className="product-page container"><Link to="/catalogo" className="back-link">← Catálogo</Link><div className="product-detail"><div><div className={`detail-image accent-${product.accent}`}><img src={selectedImage} alt={product.name} /><span className="detail-stamp"><PawPrint size={16} /> vikingdogs</span></div>{product.gallery.length > 1 && <div className="detail-gallery">{product.gallery.map((image, index) => <button className={selectedImage === image ? 'selected' : ''} key={`${image}-${index}`} onClick={() => setSelectedImage(image)}><img src={image} alt={`${product.name} vista ${index + 1}`} /></button>)}</div>}</div><div className="detail-copy"><span className="eyebrow">{product.category}</span><span className="detail-badge">{product.badge}</span><h1>{product.name}</h1><p className="detail-description">{product.detail}</p><ul className="benefit-list">{product.benefits.map((benefit) => <li key={benefit}><Check size={15} /> {benefit}</li>)}</ul><div className="detail-price"><strong>{formatCOP(product.price)}</strong><span className="free-shipping">Disponibilidad</span><span>Consulta por WhatsApp</span></div><div className="detail-actions"><div className="quantity large"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={15} /></button><b>{quantity}</b><button onClick={() => setQuantity(quantity + 1)}><Plus size={15} /></button></div><button className="button button-primary buy-button" onClick={directBuy}>Continuar al pedido <ArrowRight size={17} /></button><button className="button button-outline cart-add" onClick={add}><ShoppingBag size={17} /> Agregar</button></div>{added && <div className="added-message"><Check size={16} /> Agregado al carrito</div>}<div className="detail-promise"><div><Truck size={19} /><span><b>Envíos nacionales</b><small>Consulta cobertura</small></span></div><div><PackageCheck size={19} /><span><b>WhatsApp</b><small>Atención personalizada</small></span></div></div></div></div></section><section className="product-why container"><div className="product-why-main"><span className="eyebrow">Por qué elegirlo</span><h2>{product.whyTitle}</h2><p>{product.whyText}</p></div><div className="product-why-grid"><div><span className="info-label">Ideal para</span><strong>{product.idealFor}</strong></div><div><span className="info-label">Cómo incorporarlo</span><strong>{product.ritual}</strong></div><div><span className="info-label">Tu pedido incluye</span><strong>{product.included}</strong></div></div></section><section className="product-info container"><div><span className="eyebrow">Compra fácil</span><h2>Su bienestar,<br /><em>en camino.</em></h2></div><div><p>Envíos nacionales · Disponibilidad por WhatsApp</p><a className="underlink" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Resolver una duda <ArrowRight size={15} /></a></div></section></Layout>
}

function CheckoutPage() {
  const { cart, total, clearCart } = useCartContext()
  const navigate = useNavigate()
  const product = cart[0] || PRODUCTS[0]
  if (!cart.length) return <Layout><section className="checkout-empty container"><span className="eyebrow">VikingDogs</span><h1>Tu carrito está vacío</h1><p>Agrega productos para continuar con tu pedido.</p><Link className="button button-primary" to="/catalogo">Ver catálogo <ArrowRight size={16} /></Link></section></Layout>
  return <Layout><section className="checkout-page container"><Checkout product={product} quantity={cart[0].quantity} cart={cart} total={total} standalone onClose={() => navigate(-1)} onSuccess={clearCart} /></section></Layout>
}

function Checkout({ product, quantity, cart, total, standalone = false, onClose, onSuccess }) {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ phone: '', email: '', firstName: '', lastName: '', document: '', tag: '', providerNotes: '', internalNotes: '', officeDelivery: false, department: '', addressInfo: '', payment: 'Pago contra entrega' })
  const update = (event) => { const { name, value, type, checked } = event.target; setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value })) }
  const submit = async (event) => {
    event.preventDefault(); setSubmitting(true); setError('')
    const summary = cart.map((item) => `${item.name} x${item.quantity}`).join(' | ') || `${product.name} x${quantity}`
    const payload = { ...form, _replyto: form.email, phone: `+57 ${form.phone}`, _subject: `Nuevo pedido VikingDogs — ${form.firstName} ${form.lastName}`, products: summary, total: formatCOP(total), shipping: 'Por confirmar con VikingDogs', source: 'Tienda online VikingDogs' }
    try { const response = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (!response.ok) throw new Error('formspree'); setSuccess(true); onSuccess?.() } catch { setError('No pudimos enviar el pedido. Revisa tu conexión o escríbenos por WhatsApp.') } finally { setSubmitting(false) }
  }
  return <div className={standalone ? 'checkout-page-inner' : 'checkout-layer'}><div className="checkout-modal"><button className="modal-close" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>{success ? <div className="success-state"><div className="success-icon"><Check /></div><span className="eyebrow">Pedido recibido</span><h2>Gracias por elegir<br /><em>VikingDogs.</em></h2><p>Recibimos tus datos. Te contactaremos muy pronto para confirmar tu pedido y coordinar la entrega por WhatsApp.</p><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="button button-primary">Seguir mi compra por WhatsApp <ArrowRight size={16} /></a><button className="text-button" onClick={() => navigate('/catalogo')}>Volver al catálogo</button></div> : <><div className="checkout-header"><span className="eyebrow">Último paso</span><h2>Confirma tu pedido</h2><p>{cart.length === 4 ? 'Pack completo · 4 productos' : `${product.name} · ${quantity} ${quantity === 1 ? 'unidad' : 'unidades'}`}</p></div><div className="checkout-order-summary">{cart.map((item) => <div className="checkout-order-item" key={item.id}><img src={item.image} alt="" /><span><strong>{item.name}</strong><small>Cantidad: {item.quantity}</small></span><b>{formatCOP(item.price)}</b></div>)}</div><form onSubmit={submit}><div className="form-section"><h3>Datos del cliente</h3><div className="form-grid"><label>Teléfono<div className="phone-field"><span>(+57)</span><input required name="phone" type="tel" value={form.phone} onChange={update} placeholder="300 000 0000" /></div></label><label>Correo<input required name="email" type="email" value={form.email} onChange={update} placeholder="tu@correo.com" /></label><label>Nombre<input required name="firstName" value={form.firstName} onChange={update} placeholder="Tu nombre" /></label><label>Apellido<input required name="lastName" value={form.lastName} onChange={update} placeholder="Tu apellido" /></label><label>Cédula o documento<input required name="document" value={form.document} onChange={update} placeholder="Número de documento" /></label><label>Etiqueta <span className="optional">(separadas por coma)</span><input name="tag" value={form.tag} onChange={update} placeholder="Casa, trabajo" /></label></div></div><div className="form-section"><h3>Dirección de entrega</h3><label>Departamento<select required name="department" value={form.department} onChange={update}><option value="">Selecciona una opción</option><option>Bogotá D.C.</option><option>Cundinamarca</option><option>Antioquia</option><option>Valle del Cauca</option><option>Atlántico</option><option>Santander</option><option>Otro departamento</option></select><ChevronDown className="select-icon" size={16} /></label><label>Información adicional de la dirección<textarea required name="addressInfo" value={form.addressInfo} onChange={update} placeholder="Dirección, barrio, ciudad y referencias" rows="3" /></label><label className="check-row"><input type="checkbox" name="officeDelivery" checked={form.officeDelivery} onChange={update} /><span>Entregar en una oficina de la transportadora</span></label><div className="form-grid"><label>Notas para el proveedor<textarea name="providerNotes" value={form.providerNotes} onChange={update} placeholder="Indicaciones para la entrega" rows="2" /></label><label>Notas internas<textarea name="internalNotes" value={form.internalNotes} onChange={update} placeholder="Algo más que debamos saber" rows="2" /></label></div></div><div className="form-section"><h3>Método de pago</h3><div className="payment-options"><label className={form.payment === 'Pago contra entrega' ? 'selected' : ''}><input type="radio" name="payment" value="Pago contra entrega" checked={form.payment === 'Pago contra entrega'} onChange={update} /><span><strong>Pago contra entrega</strong><small>Pagas al recibir tu pedido</small></span><Check size={16} /></label><label className={form.payment === 'Pago anticipado' ? 'selected' : ''}><input type="radio" name="payment" value="Pago anticipado" checked={form.payment === 'Pago anticipado'} onChange={update} /><span><strong>Pago anticipado</strong><small>Te contactaremos para coordinarlo</small></span><Check size={16} /></label></div></div>{error && <div className="form-error">{error}</div>}<div className="checkout-total"><span>Total del pedido</span><strong>{formatCOP(total)}</strong></div><button disabled={submitting} className="button button-primary button-wide submit-button" type="submit">{submitting ? 'Enviando pedido…' : 'Confirmar pedido'} {!submitting && <ArrowRight size={17} />}</button><p className="secure-note">Tus datos se usarán únicamente para procesar y entregar tu pedido.</p></form></>}</div></div>
}

function Root() { return <BrowserRouter><App /></BrowserRouter> }
createRoot(document.getElementById('root')).render(<Root />)
