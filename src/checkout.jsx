import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, ChevronDown, X } from 'lucide-react'
import { Layout, useCartContext, formatCOP, Thumb, InstagramIcon, WhatsAppIcon, PRODUCTS } from './main'
import { usePageSeo } from './seo'
import { track, trackPurchase, productItem } from './analytics'
import { FORM_ENDPOINT, INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, WHATSAPP_URL } from './data/site'

export function CheckoutPage() {
  const { cart, total, clearCart } = useCartContext()
  const navigate = useNavigate()
  const product = cart[0] || PRODUCTS[0]
  usePageSeo({
    title: 'Checkout · VikingDogs',
    description: 'Confirma tu pedido VikingDogs. Pago contra entrega.',
    path: '/checkout',
    noindex: true,
  })
  useEffect(() => {
    if (cart.length) track('begin_checkout', { value: total, items: cart.map((item) => productItem(item, item.quantity)) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
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
      trackPurchase({ value: total, items: cart.map((item) => productItem(item, item.quantity)) })
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
