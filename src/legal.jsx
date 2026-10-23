import { Link } from 'react-router-dom'
import { usePageSeo } from './seo'
import { INSTAGRAM_URL, INSTAGRAM_HANDLE, WHATSAPP_DISPLAY, WHATSAPP_URL, SITE_NAME } from './data/site'

function InfoPage({ title, description, path, intro, sections }) {
  usePageSeo({ title: `${title} · ${SITE_NAME}`, description, path })
  return <section className="info-page">
    <div className="info-hero container" data-reveal>
      <span className="eyebrow">{SITE_NAME} · Información</span>
      <h1>{title}</h1>
      <p>{intro}</p>
    </div>
    <div className="info-body container">
      {sections.map((section) => <article className="info-card" key={section.heading} data-reveal>
        <h2>{section.heading}</h2>
        {section.paragraphs?.map((text, i) => <p key={i}>{text}</p>)}
        {section.items && <ul>{section.items.map((item, i) => <li key={i}>{item}</li>)}</ul>}
        {section.link && <Link className="underlink info-link" to={section.link.to}>{section.link.label}</Link>}
      </article>)}
      <div className="info-help" data-reveal>
        <strong>¿Te quedó alguna duda?</strong>
        <span>Escríbenos y te ayudamos a elegir o a dar seguimiento a tu pedido.</span>
        <div className="info-help-actions">
          <a className="button button-primary" href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp {WHATSAPP_DISPLAY}</a>
          <a className="button button-quiet" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">@{INSTAGRAM_HANDLE}</a>
        </div>
      </div>
    </div>
  </section>
}

export function FaqPage() {
  return <InfoPage
    title="Preguntas frecuentes"
    path="/faq"
    description="Resolvemos tus dudas sobre pagos contra entrega, envíos gratis a todo Colombia, tiempos de entrega y devoluciones en VikingDogs."
    intro="Lo esencial para comprar con tranquilidad: pago contra entrega, envío gratis y seguimiento por WhatsApp."
    sections={[
      {
        heading: '¿Cómo pago mi pedido?',
        paragraphs: ['Pagas en efectivo contra entrega, cuando el paquete llegue a tu puerta. No pedimos datos de tarjeta ni pagos por adelantado.'],
      },
      {
        heading: '¿El envío tiene costo?',
        paragraphs: ['No. El envío es gratis a todo Colombia en todos los pedidos del catálogo.'],
        link: { to: '/envios', label: 'Ver detalle de envíos' },
      },
      {
        heading: '¿Cuánto demora en llegar?',
        paragraphs: ['En ciudades principales suele tomar entre 2 y 5 días hábiles; en el resto del país entre 5 y 10 días hábiles, según la aerolínea o transportadora. Te confirmamos el número de guía cuando despachamos.'],
      },
      {
        heading: '¿Cómo confirmas mi pedido?',
        paragraphs: [`Al enviar el formulario recibimos tu pedido y te escribimos por WhatsApp o llamamos para confirmar dirección, productos y fecha de entrega. Si prefieres adelantar la conversación, escríbenos al ${WHATSAPP_DISPLAY}.`],
      },
      {
        heading: '¿Puedo devolver un producto?',
        paragraphs: ['Sí, si el producto llega defectuoso o no corresponde a tu pedido. Avisanos dentro de los primeros 10 días y coordinamos el cambio o la devolución.'],
        link: { to: '/devoluciones', label: 'Ver política de devoluciones' },
      },
      {
        heading: '¿Tienen tienda física?',
        paragraphs: ['Atendemos desde Funza, Cundinamarca (Cra 19 Bis #9-15). Escríbenos antes de visitarnos para confirmar horarios y disponibilidad.'],
      },
      {
        heading: '¿Puedo pagar con tarjeta o transferencia?',
        paragraphs: ['Por ahora solo trabajamos contra entrega. Es la forma más segura de comprar con nosotros: ves y pagas al recibir.'],
      },
    ]}
  />
}

export function ShippingPage() {
  return <InfoPage
    title="Envíos y entregas"
    path="/envios"
    description="Envío gratis a todo Colombia en todos los pedidos VikingDogs. Tiempos de entrega y seguimiento por WhatsApp."
    intro="Enviamos gratis a todo Colombia. El pedido sale despachado tras confirmar contigo por WhatsApp."
    sections={[
      {
        heading: 'Costo de envío',
        paragraphs: ['El envío es gratis en todos los pedidos, sin monto mínimo.'],
      },
      {
        heading: 'Tiempos de entrega',
        items: [
          'Ciudades principales (Bogotá, Medellín, Cali, Barranquilla, Bucaramanga, etc.): 2 a 5 días hábiles.',
          'Resto del país: 5 a 10 días hábiles.',
          'Funza y alrededores: entregas locales coordinadas por WhatsApp, normalmente en 24 a 48 horas.',
        ],
        paragraphs: ['Los tiempos son estimados y pueden variar por festivos, clima o demoras de la transportadora.'],
      },
      {
        heading: 'Seguimiento del pedido',
        paragraphs: ['Cuando despachamos te enviamos el número de guía por WhatsApp para que sigas el paquete con la transportadora.'],
      },
      {
        heading: 'Datos que necesitamos',
        items: ['Nombre completo.', 'Dirección exacta con barrio y referencias.', 'Teléfono celular de contacto.', 'Ciudad y departamento.'],
      },
    ]}
  />
}

export function ReturnsPage() {
  return <InfoPage
    title="Cambios y devoluciones"
    path="/devoluciones"
    description="Política de cambios y devoluciones de VikingDogs: 10 días para reportar fallas o errores de despacho, gestionado por WhatsApp."
    intro="Queremos que quedes conforme. Si algo llega mal, lo resolvemos por WhatsApp."
    sections={[
      {
        heading: '¿Cuándo puedo pedir un cambio?',
        items: [
          'El producto llegó dañado o con falla de fábrica.',
          'Te enviamos un producto distinto al de tu pedido.',
          'El paquete llegó incompleto.',
        ],
      },
      {
        heading: 'Plazos',
        paragraphs: ['Avisanos dentro de los 10 días hábiles siguientes a la entrega. Pasado ese plazo evaluamos caso por caso.'],
      },
      {
        heading: 'Cómo es el proceso',
        items: [
          'Escríbenos por WhatsApp con fotos del producto y del empaque, más tu número de pedido.',
          'Te confirmamos la viabilidad del cambio o la devolución en máximo 48 horas hábiles.',
          'Si aplica, coordinamos la recogida o el reenvío sin costo para ti.',
        ],
      },
      {
        heading: 'Condiciones',
        paragraphs: ['El producto debe estar sin uso, con sus accesorios y empaque original. No aplica por desgaste normal, mal uso o modificaciones del comprador.'],
      },
    ]}
  />
}

export function PrivacyPage() {
  return <InfoPage
    title="Privacidad"
    path="/privacidad"
    description="Cómo VikingDogs usa tus datos de contacto y dirección únicamente para procesar y entregar tu pedido. No vendemos información a terceros."
    intro="Tus datos se usan solo para procesar y entregar tu pedido."
    sections={[
      {
        heading: 'Qué datos recogemos',
        items: ['Nombre completo.', 'Dirección de entrega.', 'Teléfono de contacto.', 'Correo electrónico si lo envías en el formulario.'],
      },
      {
        heading: 'Para qué los usamos',
        items: ['Armar y despachar tu pedido.', 'Coordinar la entrega contra entrega.', 'Darte seguimiento por WhatsApp o llamada.'],
      },
      {
        heading: 'Con quién los compartimos',
        paragraphs: ['Solo con la transportadora que lleva tu paquete (nombre, dirección y teléfono) y con el proveedor del formulario que reciben los pedidos (Formspree). No vendemos ni cedemos tus datos con fines de marketing de terceros.'],
      },
      {
        heading: 'Tus derechos',
        paragraphs: ['Puedes pedir acceso, corrección o eliminación de tus datos escribiéndonos por WhatsApp o Instagram. Atendimos solicitudes de la Ley 1581 de 2012 de protección de datos personales de Colombia.'],
      },
      {
        heading: 'Cookies y medición',
        paragraphs: ['El sitio puede usar cookies de medición anónima (por ejemplo Google Analytics) para entender qué páginas se visitan. Puedes bloquearlas desde tu navegador sin que deje de funcionar la tienda.'],
      },
    ]}
  />
}

export function TermsPage() {
  return <InfoPage
    title="Términos de uso"
    path="/terminos"
    description="Términos de uso de la tienda VikingDogs: precios en COP, disponibilidad de productos y condiciones de compra contra entrega."
    intro="Al usar la tienda aceptas estas condiciones sencillas de compra."
    sections={[
      {
        heading: 'La tienda',
        paragraphs: [`${SITE_NAME} vende accesorios y productos de cuidado canino a través de este sitio. Los pedidos se confirman por WhatsApp antes del despacho.`],
      },
      {
        heading: 'Precios',
        paragraphs: ['Todos los precios están en pesos colombianos (COP). Los precios de temporada pueden cambiar sin aviso previo; el precio válido es el que se muestra al momento de confirmar tu pedido con nosotros.'],
      },
      {
        heading: 'Disponibilidad',
        paragraphs: ['El inventario puede variar. Si un producto se agota después de tu pedido, te avisamos y ofrecemos reponerlo o reembolsarte (en caso de aplane ya pagado, que no es el caso del contra entrega).'],
      },
      {
        heading: 'Uso del sitio',
        items: [
          'No se permite usar la tienda con fines ilícitos.',
          'Las fotos son ilustrativas del producto real.',
          'El contenido, nombre y diseño del sitio son de VikingDogs.',
        ],
      },
      {
        heading: 'Ley aplicable',
        paragraphs: ['Estos términos se rigen por la legislación colombiana. Cualquier controversia se trata de buena fe por WhatsApp o correo antes de acudir a otras vías.'],
      },
    ]}
  />
}
